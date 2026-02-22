#!/usr/bin/env bash
# configure-www-redirect.sh
#
# Creates a CloudFront Function that 301-redirects www.coatesvillefarm.com
# requests to coatesvillefarm.com, then associates it with the distribution
# as a viewer-request handler.
#
# This is idempotent — it updates the function if it already exists.
#
# Usage:
#   CLOUDFRONT_DISTRIBUTION_ID=EXXXXX ./scripts/configure-www-redirect.sh
#
# Requires: aws CLI configured with appropriate credentials.

set -euo pipefail

if [ -z "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "Error: CLOUDFRONT_DISTRIBUTION_ID is required" >&2
  exit 1
fi

DIST_ID="$CLOUDFRONT_DISTRIBUTION_ID"
FUNC_NAME="www-redirect-coatesvillefarm"

# CloudFront Function code (JavaScript runtime 2.0)
FUNC_CODE='function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;

  if (host.startsWith("www.")) {
    var newUrl = "https://coatesvillefarm.com" + request.uri;
    if (request.querystring && Object.keys(request.querystring).length > 0) {
      var qs = Object.keys(request.querystring).map(function(k) {
        var v = request.querystring[k];
        return v.multiValue
          ? v.multiValue.map(function(mv) { return k + "=" + mv.value; }).join("&")
          : k + "=" + v.value;
      }).join("&");
      newUrl += "?" + qs;
    }
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: { location: { value: newUrl } }
    };
  }

  return request;
}'

# Step 1: Create or update the CloudFront Function
echo "Creating/updating CloudFront Function: $FUNC_NAME..."

EXISTING_ETAG=$(aws cloudfront describe-function --name "$FUNC_NAME" --query 'ETag' --output text 2>/dev/null || echo "")

if [ -n "$EXISTING_ETAG" ] && [ "$EXISTING_ETAG" != "None" ]; then
  echo "Function exists, updating..."
  FUNC_RESULT=$(aws cloudfront update-function \
    --name "$FUNC_NAME" \
    --function-config '{"Comment":"Redirect www.coatesvillefarm.com to coatesvillefarm.com","Runtime":"cloudfront-js-2.0"}' \
    --function-code "$FUNC_CODE" \
    --if-match "$EXISTING_ETAG")
else
  echo "Creating new function..."
  FUNC_RESULT=$(aws cloudfront create-function \
    --name "$FUNC_NAME" \
    --function-config '{"Comment":"Redirect www.coatesvillefarm.com to coatesvillefarm.com","Runtime":"cloudfront-js-2.0"}' \
    --function-code "$FUNC_CODE")
fi

FUNC_ARN=$(echo "$FUNC_RESULT" | jq -r '.FunctionSummary.FunctionMetadata.FunctionARN')
echo "Function ARN: $FUNC_ARN"

# Step 2: Publish the function (move from DEVELOPMENT to LIVE stage)
echo "Publishing function..."
PUBLISH_ETAG=$(aws cloudfront describe-function --name "$FUNC_NAME" --query 'ETag' --output text)
aws cloudfront publish-function \
  --name "$FUNC_NAME" \
  --if-match "$PUBLISH_ETAG" \
  > /dev/null

echo "Function published."

# Step 3: Associate the function with the CloudFront distribution's default cache behavior
echo "Fetching distribution config for $DIST_ID..."
CONFIG=$(aws cloudfront get-distribution-config --id "$DIST_ID")
ETAG=$(echo "$CONFIG" | jq -r '.ETag')
DIST_CONFIG=$(echo "$CONFIG" | jq '.DistributionConfig')

# Check if function is already associated
EXISTING_FUNC=$(echo "$DIST_CONFIG" | jq -r '.DefaultCacheBehavior.FunctionAssociations.Items // [] | map(select(.EventType == "viewer-request")) | .[0].FunctionARN // ""')

if [ "$EXISTING_FUNC" = "$FUNC_ARN" ]; then
  echo "Function already associated with distribution. Nothing to do."
  exit 0
fi

# Add the function association to the default cache behavior
UPDATED_CONFIG=$(echo "$DIST_CONFIG" | jq --arg arn "$FUNC_ARN" '
  .DefaultCacheBehavior.FunctionAssociations = {
    "Quantity": (.DefaultCacheBehavior.FunctionAssociations.Items // [] | map(select(.EventType != "viewer-request")) | length + 1),
    "Items": ((.DefaultCacheBehavior.FunctionAssociations.Items // [] | map(select(.EventType != "viewer-request"))) + [{
      "FunctionARN": $arn,
      "EventType": "viewer-request"
    }])
  }
')

echo "Updating distribution with www-redirect function..."
aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$ETAG" \
  --distribution-config "$UPDATED_CONFIG" \
  > /dev/null

echo "Done. www.coatesvillefarm.com now 301-redirects to coatesvillefarm.com."
echo "Allow a few minutes for the distribution to deploy."
