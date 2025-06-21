# Coatesville Farm Website

This is the static React site for **Coatesville Farm**, hosted on AWS S3 and designed to adapt its visual branding based on the current season and time of day. The site showcases farm information, crops, contact details, and a seasonal homepage.

---

## 🗂 Project Structure

```
public/
  assets/
    img/
      logo-spring.png
      logo-spring-night.png
      logo-summer.png
      logo-summer-night.png
      logo-autumn.png
      logo-autumn-night.png
      logo-winter.png
      logo-winter-night.png
    silo-rainbow.png        # Static image for About page

src/
  App.jsx                   # Main application entry
  utils/
    logoUtils.js           # Logo logic based on season/time
  __tests__/
    *.test.jsx             # Component tests
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

The footer includes:

- 📍 [14072 Old Ridge Road, Beaverdam, VA](https://maps.app.goo.gl/7daPheXtBUPiJES87)
- 📞 (804) 555-1234
- ✉️ [info@coatesvillefarm.com](mailto:info@coatesvillefarm.com)

---

## 🛠 Future Enhancements

- CMS or Markdown-based content editing
- Contact form with spam prevention
- Improved mobile styling and accessibility

---