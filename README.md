# Coatesville Farm Website

A whimsical, seasonal React site for Coatesville Farm, hosted on AWS S3. The site adapts its branding based on the current season and time of day, includes interactive geese with sound effects, and supports mobile responsiveness and automated testing.

---

## 🗂 Project Structure

```
.
├── public/
│   ├── assets/
│   │   ├── img/             # Logos, clouds, geese, etc.
│   │   └── audio/           # Bird and goose audio files
├── src/
│   ├── components/          # Header, Footer, SeasonalLogo
│   ├── pages/               # Home, About, Contact, Crops
│   ├── styles/              # CSS modules for layout/sections
│   ├── utils/               # logoUtils for seasonal logic
│   ├── __tests__/           # Unit tests for each component/page
├── dist/                    # Vite build output
├── iam/                     # S3 bucket policy JSON
```

---

## 🌱 Seasonal Logo Logic

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

## 🔍 Preview Query Parameter

To simulate how the site looks at a different time, use the `preview` query parameter in the URL:

```
https://coatesvillefarm.com/?preview=2025-12-24T19:00:00
```

- Accepts ISO 8601 format (`YYYY-MM-DDTHH:mm:ss`)
- Used for previewing seasonal and night logos in production
- Implemented via `getPreviewDate()` in `logoUtils.js`

---
🪿 Interactive Geese

There are three floating Canada Geese on the homepage:
	•	Goose 1 & Goose 2 honk on click
	•	Goose 3 (a gosling) chirps on click

All geese are absolutely positioned and animated to float gently across the pond without overlapping.

⸻

🐦 Animated Bird

A cardinal flies and flaps across the screen continuously:
	•	Loops every 60 seconds
	•	Flaps using frame-by-frame animation
	•	Clicking the bird triggers a chirp (northern-cardinal-chirp.m4a) and displays a "chirp" speech bubble

⸻

🧪 Testing

Unit tests are provided for:
	•	Seasonal logo behavior
	•	Page rendering (Home, About, Crops, Contact)
	•	Footer and navigation
	•	Logo fallbacks and time simulation

Running tests:
---

## ✅ Tests and CI/CD Pipeline

### 🧪 Tests

- Located in `src/__tests__`
- Implemented with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- Validates:
  - Correct seasonal logo rendering
  - Presence of navigation and footer
  - Content routes (`Home`, `About`, `Crops`, `Contact`)

Run locally:

```bash
npm test
```

### 🚀 Build & Deployment

- Built with [Vite](https://vitejs.dev/)
- Static output deployed to AWS S3
- GitHub Actions or manual workflow can publish site after:

```bash
npm run build
```

> Output appears in the `dist/` folder, ready for upload to S3

---

## 🗺 Address & Contact

Footer and Contact page display:
	•	📍 14072 Old Ridge Road, Beaverdam, VA
	•	📞 (804) 555-1234
	•	✉️ info@coatesvillefarm.com

---

## 🛠 Future Enhancements

	•	Sound on/off toggle for geese and bird audio
	•	Accessibility improvements and keyboard nav
	•	CMS/Markdown integration for crop and about pages
	•	Contact form with spam protection
	•	Offline support (via service workers)

⸻

Made with ❤️, honks, and flaps at Coatesville Farm.

---