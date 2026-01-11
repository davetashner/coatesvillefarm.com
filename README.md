# Coatesville Farm Website

A whimsical, seasonal React site for Coatesville Farm, hosted on AWS S3. The site adapts its branding based on the current season and time of day, includes interactive geese with sound effects, and supports mobile responsiveness and automated testing.

---

## Tech Stack

- **React 18** + **TypeScript** - Type-safe component development
- **Vite** - Fast build tooling and dev server
- **Jest** + **Testing Library** - Unit and component testing
- **CSS Variables** - Centralized theming in `src/styles/variables.css`
- **AWS S3 + CloudFront** - Static site hosting with CDN

---

## Project Structure

```
.
├── public/
│   ├── assets/
│   │   ├── img/             # Logos, clouds, geese, etc.
│   │   └── audio/           # Bird and goose audio files
├── src/
│   ├── components/          # Header, Footer, SeasonalLogo, ErrorBoundary
│   ├── pages/               # Home, About, Contact, Crops
│   ├── styles/              # CSS modules (variables, navbar, home, etc.)
│   ├── utils/               # logoUtils, audioUtils
│   ├── constants/           # Animation timing, form config
│   ├── config/              # App configuration
│   ├── __tests__/           # Unit tests for each component/page
├── dist/                    # Vite build output
├── lambda/                  # Contact form backend (AWS Lambda)
├── .beads/                  # Issue tracking configuration
```

---

## Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Run ESLint
```

---

## Seasonal Logo Logic

The homepage dynamically displays a different logo depending on the current season and time of day:

- **Spring** → March to May
- **Summer** → June to August
- **Autumn** → September to November
- **Winter** → December to February

If the time is **before 6:00 AM** or **after 6:00 PM**, the corresponding `-night` version of the logo is used.

### Examples:
| Date & Time               | Logo Used                 |
|---------------------------|---------------------------|
| 2025-06-15 14:00 (2 PM)   | `logo-summer.png`         |
| 2025-10-10 20:00 (8 PM)   | `logo-autumn-night.png`   |
| 2025-01-05 05:30 (5:30 AM)| `logo-winter-night.png`   |

---

## Preview Query Parameter

To simulate how the site looks at a different time, use the `preview` query parameter in the URL:

```
https://coatesvillefarm.com/?preview=2025-12-24T19:00:00
```

- Accepts ISO 8601 format (`YYYY-MM-DDTHH:mm:ss`)
- Used for previewing seasonal and night logos in production
- Implemented via `getPreviewDate()` in `src/utils/logoUtils.ts`

---

## Interactive Elements

### Geese
Three floating Canada Geese on the homepage:
- Goose 1 & Goose 2 honk on click
- Goose 3 (a gosling) chirps on click
- All geese are keyboard accessible (Enter/Space to activate)

### Animated Bird
A cardinal flies and flaps across the screen continuously:
- Loops every 60 seconds
- Flaps using frame-by-frame animation
- Clicking/activating the bird triggers a chirp and displays a speech bubble

---

## Testing

Unit tests cover:
- Seasonal logo behavior (`logoUtils.ts`)
- Audio utilities (`audioUtils.ts`)
- Page rendering (Home, About, Crops, Contact)
- Footer and navigation
- Component props and interactions

```bash
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
```

---

## Deployment

- Built with [Vite](https://vitejs.dev/)
- Static output deployed to AWS S3 via GitHub Actions
- CloudFront provides CDN and HTTPS

```bash
npm run build    # Output appears in dist/
```

---

## Issue Tracking

This project uses [Beads](https://github.com/steveyegge/beads) for AI-native issue tracking. Issues live in `.beads/issues.jsonl` and sync with git.

### Basic Commands

```bash
bd list                           # View open issues
bd show <id>                      # View issue details
bd create "Add dark mode toggle"  # Create new issue
bd update <id> --status closed    # Close an issue
```

### Using with AI Agents

Beads is designed to work seamlessly with AI coding agents like Claude Code. When working with an agent:

1. **Check the backlog first** - Ask the agent to run `bd list` to see current priorities
2. **Add issues conversationally** - Tell the agent what you need and ask it to create a Beads issue
3. **Track progress** - The agent can update issue status as work completes
4. **Review before committing** - Issues sync with git, so changes are tracked in version control

Example prompts:
- "Add a task to the backlog for implementing dark mode"
- "What's next in the Beads backlog?"
- "Mark issue 751.8 as closed"
- "Create an epic for the authentication feature with subtasks"

---

## Address & Contact

Footer and Contact page display:
- 📍 14072 Old Ridge Road, Beaverdam, VA
- 📞 (804) 555-1234
- ✉️ info@coatesvillefarm.com

---

Made with honks and flaps at Coatesville Farm.
