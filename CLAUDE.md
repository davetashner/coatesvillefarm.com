# CLAUDE.md

Project-specific guidance for Claude Code.

## Project Context

This is a React + TypeScript static website for Coatesville Farm, deployed to S3/CloudFront.

## Tech Stack

- React 18 + TypeScript
- Vite for bundling
- Jest + Testing Library for tests
- CSS variables pattern: styles in `src/styles/`
- Path alias: `@/` maps to `src/`

## Project Structure

- `src/components/` - Reusable components
- `src/pages/` - Page components (Home, About, Crops, Contact)
- `src/utils/` - Utility functions
- `src/constants/` - Shared constants
- `src/styles/` - CSS files, variables in `variables.css`
- `src/config/` - App configuration

## Development

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Build for production
npm test         # Run tests
npm run lint     # Run ESLint
```

## Git branching + PR standards (BEADS)

### Branch naming
- All branches must align to the BEADS *Epic name*.
- Use this format:
  - `epic/<EPIC_KEY>-<epic-name-kebab>/<story-key>-<short-desc-kebab>`
- Examples:
  - `epic/BEADS-1234-config-as-data/BEADS-2345-add-validation`
  - `epic/BEADS-9876-ack-governance/BEADS-9881-fix-reconcile-loop`

Notes:
- `<epic-name-kebab>` should closely match the epic name (lowercase, hyphens).
- `<short-desc-kebab>` should be short (3–8 words).

### Pull request title
- PR titles must include the BEADS epic ticket in brackets at the beginning.
- Format:
  - `[<EPIC_KEY>] <PR title>`
- Examples:
  - `[BEADS-1234] Add schema validation for config bundles`
  - `[BEADS-9876] Enforce namespace network policy defaults`

### Pull request description
- PR descriptions must include the BEADS story ticket number.
- Include it near the top using this exact label for consistency:
  - `Story: <STORY_KEY>`
- Example:
  - `Story: BEADS-2345`

### If information is missing
If the epic key, epic name, or story key is not provided:
1. Ask for the missing key(s) before suggesting a branch name or PR text.
2. Do not guess ticket numbers.

## Issue Tracking

This project uses **Beads** for issue tracking. Check `.beads/` for configuration.

```bash
bd list          # View open issues
bd show <id>     # View issue details
bd update <id> --status <status>  # Update status
```

Always check Beads before starting work to understand priorities and context.

---

## Simplicity Bias

- Prefer boring, explicit solutions
- Avoid meta-programming unless requested
- Do not introduce new patterns unless they already exist in the codebase
- Optimize for readability over elegance

## Decision Transparency

For any non-trivial recommendation:
- State assumptions
- List at least one alternative considered
- Explain tradeoffs

## Ambiguity Handling

If required information is missing:
- Ask clarifying questions before generating code
- Do not guess defaults for security, cost, or compliance settings

## Testing Requirements

- Include tests for failure cases
- Include at least one boundary condition
- Tests must be deterministic
- Prefer table-driven tests when applicable

## Security Defaults

- Assume zero trust
- No wildcard IAM permissions
- No plaintext secrets
- All external access must be authenticated and authorized

## Explanation Style

- Explain *why* before *how*
- Highlight common mistakes
- Use concrete examples over theory

## Knowledge Limits

- If uncertain, say so explicitly
- Do not invent APIs, configs, or features
- Prefer citing official documentation when available

## Anti-Patterns to Avoid

- Don't add new dependencies without asking
- Don't create new CSS files; extend existing ones
- Don't use inline styles; use CSS variables from `variables.css`
- Don't hardcode colors or magic numbers; use constants
- Don't skip tests for new utility functions
