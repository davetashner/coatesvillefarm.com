#!/usr/bin/env bash
# configure-cloudfront-spa.sh
#
# Configures CloudFront custom error responses so that direct navigation
# to SPA routes (e.g. /about, /crops) returns index.html instead of 404.
#
# This is a one-time setup per CloudFront distribution. Re-running is safe
# (idempotent) — it overwrites the error response config each time.
#
# Usage:
#   CLOUDFRONT_DISTRIBUTION_ID=EXXXXX ./scripts/configure-cloudfront-spa.sh
#
# Requires: aws CLI configured with appropriate credentials.

set -euo pipefail

if [ -z "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "Error: CLOUDFRONT_DISTRIBUTION_ID is required" >&2
  exit 1
fi

DIST_ID="$CLOUDFRONT_DISTRIBUTION_ID"

echo "Fetching current distribution config for $DIST_ID..."
CONFIG=$(aws cloudfront get-distribution-config --id "$DIST_ID")

ETAG=$(echo "$CONFIG" | jq -r '.ETag')
DIST_CONFIG=$(echo "$CONFIG" | jq '.DistributionConfig')

# Add custom error responses: 403 and 404 both serve /index.html with 200
UPDATED_CONFIG=$(echo "$DIST_CONFIG" | jq '.CustomErrorResponses = {
  "Quantity": 2,
  "Items": [
    {
      "ErrorCode": 403,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 300
    },
    {
      "ErrorCode": 404,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 300
    }
  ]
}')

echo "Updating distribution with SPA error responses..."
aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$ETAG" \
  --distribution-config "$UPDATED_CONFIG" \
  > /dev/null

echo "Done. CloudFront distribution $DIST_ID now routes 403/404 to /index.html."
echo "Allow a few minutes for the distribution to deploy."
