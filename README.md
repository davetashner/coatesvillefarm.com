# Coatesville Farm

Website for Coatesville Farm, a family farm in Beaverdam, Virginia. The site features seasonal branding that adapts to the time of year and day, interactive animated wildlife, a contact form with spam protection, and responsive design throughout.

**Live site:** [coatesvillefarm.com](https://coatesvillefarm.com)

## Tech Stack

- **React 18** + **TypeScript** -- Type-safe component development
- **Vite** -- Fast build tooling and dev server
- **React Router** -- Client-side routing (Home, About, Crops, Contact)
- **react-helmet-async** -- Per-page SEO meta tags
- **date-fns** -- Date handling for seasonal logic
- **Jest** + **Testing Library** -- Unit and component testing
- **AWS CDK** -- Infrastructure as code for the Lambda backend
- **AWS S3 + CloudFront** -- Static site hosting with CDN and HTTPS

## Features

### Seasonal Logo

The homepage displays a different logo based on the current season (spring, summer, autumn, winter) and time of day (day vs. night). A `?preview=2025-12-24T19:00:00` query parameter lets you preview any date/time combination.

### Animated Wildlife

- Three floating Canada Geese that honk or chirp on click (keyboard accessible)
- A cardinal that flies across the screen on a loop, with a speech bubble on interaction

### Contact Form

- Server-side reCAPTCHA v3 verification with configurable score threshold
- Honeypot field for additional bot protection
- IP-based rate limiting (5 requests per hour)
- Sends a notification email to the farm and a confirmation email to the visitor via SES

### Image Optimization

- WebP images with PNG fallback via the `<Picture>` component
- Bulk conversion script using sharp (`npm run convert-images`)

### Responsive Design

- CSS variables for centralized theming (`src/styles/variables.css`)
- Mobile-friendly layout across all pages

## Getting Started

### Prerequisites

- **Node.js 22+** (used in CI and Lambda runtime)
- npm

### Install and Run

```bash
npm install
npm run dev          # Start dev server at localhost:5173
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check with tsc, then build for production |
| `npm test` | Run Jest tests (excludes lambda/) |
| `npm run test:lambda` | Run Lambda function tests |
| `npm run type-check` | Run TypeScript compiler without emitting |
| `npm run lint` | Run ESLint |
| `npm run convert-images` | Convert images to WebP using sharp |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
.
├── src/
│   ├── components/       # Header, Footer, SeasonalLogo, Picture, ErrorBoundary
│   ├── pages/            # Home, About, Crops, Contact, NotFound
│   ├── hooks/            # useRecaptcha
│   ├── styles/           # CSS modules and variables
│   ├── utils/            # logoUtils, audioUtils
│   ├── constants/        # Animation timing, form config
│   ├── config/           # App configuration
│   ├── types/            # TypeScript type definitions
│   └── __tests__/        # Unit tests
├── lambda/               # Contact form Lambda function (TypeScript)
├── infrastructure/       # AWS CDK stack for Lambda + API Gateway
├── public/assets/        # Images (logos, geese, clouds) and audio files
├── scripts/              # Image conversion tooling
└── .github/workflows/    # CI/CD pipeline
```

## Lambda Backend

The `lambda/` directory contains a Node.js Lambda function that processes contact form submissions:

1. Validates the reCAPTCHA token with Google
2. Checks the honeypot field
3. Validates form fields (name, email, message)
4. Sends a notification email to the farm via AWS SES
5. Sends a confirmation email to the visitor

**Dependencies:** `@aws-sdk/client-ses`

## Infrastructure

The `infrastructure/` directory contains an AWS CDK stack (`ContactFormStack`) that provisions:

- **Lambda function** -- Node.js 24.x, 128 MB memory, 10s timeout
- **API Gateway** -- Regional REST API with CORS, exposes `POST /contact`
- **IAM policy** -- Scoped SES permissions restricted to the sender address
- **CloudWatch Logs** -- 1-week retention

Deploy with:

```bash
cd infrastructure
npm install
npx cdk bootstrap          # First time only
npx cdk deploy --context recaptchaSecretKey=YOUR_SECRET
```

## Deployment

The site deploys automatically via GitHub Actions on push to `main`:

1. **Build and Test** -- Installs dependencies, builds the React app, runs frontend and Lambda tests
2. **Deploy to S3** -- Syncs the `dist/` output to the `coatesvillefarm.com` S3 bucket
3. **CloudFront Invalidation** -- Clears the CDN cache so changes go live immediately

Pull requests run the build-and-test job only (no deploy).

## Issue Tracking

This project uses [Beads](https://github.com/steveyegge/beads) for issue tracking. Issues live in `.beads/issues.jsonl` and sync with git.

```bash
bd list                           # View open issues
bd show <id>                      # View issue details
bd create "Add dark mode toggle"  # Create new issue
bd close <id> --reason "Done"     # Close an issue
```
