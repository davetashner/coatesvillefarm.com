# ADR-002: API Endpoint Configuration Strategy

## Status
Accepted

## Context
The frontend contact form needs to know the URL of the Lambda API Gateway endpoint. We need a strategy for configuring this URL that works for development and production.

## Decision
**Phase 1 (Now)**: Use Vite environment variable (`VITE_CONTACT_API_URL`) set at build time.

**Phase 2 (When static site moves to CDK)**: Route `/api/*` through CloudFront to API Gateway, eliminating cross-origin requests.

## Options Considered

### Option 1: Build-time Environment Variable (Selected for Phase 1)
- **How it works**: Set `VITE_CONTACT_API_URL` during build, Vite embeds it in the bundle
- **Pros**:
  - Standard Vite pattern, already partially implemented (`CONFIG.CONTACT_API_URL`)
  - Simple, no runtime overhead
  - Works immediately with current S3/CloudFront setup
- **Cons**:
  - Requires rebuild to change URL
  - URL is visible in client-side code

### Option 2: Hardcoded URL
- **How it works**: Commit the API Gateway URL directly in code
- **Pros**: Simplest possible approach
- **Cons**: Requires code change and redeploy to update; not flexible

### Option 3: Runtime Configuration File
- **How it works**: Fetch `/config.json` from S3 at app startup
- **Pros**: Can change without rebuild
- **Cons**: Extra HTTP request on every page load; added complexity

### Option 4: CloudFront Origin Routing (Selected for Phase 2)
- **How it works**: CloudFront behavior routes `/api/*` to API Gateway origin
- **Pros**:
  - Single domain - no CORS needed
  - Cleaner URLs (`/api/contact` vs external API Gateway URL)
  - Better security posture
  - Leverages CloudFront caching/edge locations
- **Cons**:
  - Requires CloudFront configuration
  - More complex initial setup

## Rationale
**Phase 1**: The environment variable approach works immediately and follows Vite conventions. Since the user is deploying directly to production ("yolo to prod"), there's no need for per-environment flexibility. The `CONFIG.CONTACT_API_URL` pattern already exists in the codebase.

**Phase 2**: When the static site infrastructure moves to CDK (planned), we can add a CloudFront behavior that routes `/api/*` requests to the API Gateway. This eliminates CORS entirely and provides a cleaner architecture.

## Implementation Notes

### Phase 1 (Immediate)
```typescript
// src/config/index.ts
export const CONFIG = {
  CONTACT_API_URL: import.meta.env.VITE_CONTACT_API_URL || '/api/contact',
};
```

```bash
# Build command
VITE_CONTACT_API_URL=https://xyz123.execute-api.us-east-1.amazonaws.com/prod/contact npm run build
```

### Phase 2 (Future - with CDK static site)
```typescript
// CloudFront behavior in CDK
distribution.addBehavior('/api/*', new origins.RestApiOrigin(api), {
  allowedMethods: AllowedMethods.ALLOW_ALL,
  cachePolicy: CachePolicy.CACHING_DISABLED,
});
```

Then update config:
```typescript
export const CONFIG = {
  CONTACT_API_URL: '/api/contact', // Same-origin, no full URL needed
};
```

## Consequences
- Phase 1: API Gateway URL will be visible in browser network tab (acceptable for contact form)
- Phase 1: CORS must be configured on API Gateway (already done in SAM template)
- Phase 2: Will require CloudFront distribution update when migrating to CDK
- Phase 2: Eliminates CORS configuration complexity
