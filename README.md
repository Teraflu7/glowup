# GlowUp

GlowUp is a responsive multi-page website about building healthy habits. It was created for Front End Assignment 3 with HTML5, CSS3, and Bootstrap 5.3.8.

## Pages

- `index.html` — home page, responsive CSS cards, and Bootstrap cards.
- `blog.html` — CSS Grid Areas, articles, and a Bootstrap carousel with nine images.
- `about.html` — Bootstrap grid, pricing table, team section, and responsive contact form.
- `faq.html` — frequently asked questions.

## Run locally

Open `index.html` directly in a browser or start a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Test responsiveness

Use browser DevTools to test the website at 375 px, 768 px, and 1440 px. The independent CSS card row displays one, two, and three columns at the corresponding breakpoints. Bootstrap components adapt through `col-sm-*`, `col-md-*`, and `col-lg-*` classes.

## Project report

The completed report is available in `REPORT.docx`. Its editable sources are `REPORT.md` and `REPORT.html`. Run the following command in PowerShell to rebuild the Word document after editing `REPORT.html`:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\build-report.ps1
```

## Deployment

Before submission, publish the `main` branch with GitHub Pages or Netlify. Add the public URL and the group number to `REPORT.md`, `REPORT.html`, and the generated `REPORT.docx`.
