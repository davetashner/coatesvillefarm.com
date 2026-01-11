# ADR-001: CAPTCHA Selection for Contact Form

## Status
Accepted

## Context
The contact form at coatesvillefarm.com needs bot protection beyond the existing honeypot field and rate limiting. We need to select a CAPTCHA solution that balances security with user experience for a small farm website.

## Decision
**Use Google reCAPTCHA v3** for invisible, score-based bot detection.

## Options Considered

### Option 1: reCAPTCHA v3 (Selected)
- **How it works**: Runs invisibly in background, returns a score (0.0 = likely bot, 1.0 = likely human)
- **Pros**:
  - Zero user friction - no checkbox or challenges
  - Score-based allows tuning threshold server-side
  - Well-documented, battle-tested
  - Free for up to 1M assessments/month
- **Cons**:
  - Requires Google account and API keys
  - Privacy concerns (sends data to Google)
  - May require threshold tuning if false positives occur

### Option 2: reCAPTCHA v2 Invisible
- **How it works**: Invisible by default, shows challenge only if suspicious
- **Pros**: More definitive (pass/fail vs score)
- **Cons**: Can interrupt users with challenges; older technology

### Option 3: reCAPTCHA v2 Checkbox
- **How it works**: "I'm not a robot" checkbox, sometimes followed by image challenges
- **Pros**: Most reliable, users understand it
- **Cons**: Always requires user interaction; dated UX

### Option 4: Cloudflare Turnstile
- **How it works**: Privacy-focused alternative, similar to reCAPTCHA v3
- **Pros**: More privacy-friendly, free, no Google dependency
- **Cons**: Newer/less proven, requires Cloudflare account

## Rationale
For a low-traffic farm website contact form:
1. **User experience is paramount** - visitors shouldn't be interrupted
2. **Defense in depth** - reCAPTCHA v3 + honeypot + rate limiting provides layered protection
3. **Adjustability** - Score threshold can be tuned server-side without frontend changes
4. **Maturity** - reCAPTCHA v3 is well-documented with clear integration patterns

## Implementation Notes
- Frontend: Load reCAPTCHA v3 script, execute on form submit, send token with form data
- Backend (Lambda): Verify token with Google API, reject if score < 0.5 (adjustable)
- Store site key in frontend config, secret key in Lambda environment variable
- Consider Turnstile migration in future if privacy becomes a concern

## Consequences
- Requires Google reCAPTCHA account setup
- Adds ~100KB to page load (reCAPTCHA script)
- Lambda needs network access to Google's verification API
- Will need to monitor for false positives and adjust threshold if needed
