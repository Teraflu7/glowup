# GlowUp

GlowUp is a responsive multi-page website about building healthy habits. The Front End Assignment 4 version extends the existing HTML5, CSS3, and Bootstrap 5.3.8 project with accessible interactive features written in vanilla JavaScript.

Team: Tamiris Mukieva and Alina Abdubek, group SE-2516. The deployed website is available at https://teraflu7.github.io/glowup/.

## Assignment 4 Features

- Custom contact-form validation with required-field, email, password-length, and password-confirmation checks.
- A native dialog-based contact popup that opens from a call-to-action button and closes from its button, backdrop, or the Escape key.
- A smooth FAQ accordion with hidden-by-default answers and accessible expanded-state information.
- A home-page background color control that cycles through four predefined colors and includes a reset action.
- A localized current date and time display that updates every second.

## Pages

- `index.html` - home page, responsive card sections, background controls, and live date/time.
- `blog.html` - CSS Grid Areas, articles, and a Bootstrap carousel with nine images.
- `about.html` - team and pricing sections plus the popup contact form and validation.
- `faq.html` - four JavaScript-powered accordion questions.

## JavaScript Modules

- `js/home.js` - background palette controls, reset behavior, status updates, and the live clock.
- `js/faq.js` - FAQ open/close behavior and accessible accordion state.
- `js/signup.js` - dialog controls, focus restoration, field validation, error messages, and success feedback.

Related component styles are located in `css/home-interactions.css`, `css/faq-accordion.css`, and `css/signup-dialog.css`. Shared site styles remain in `styles.css`.

## Run Locally

Open `index.html` directly in a browser or start a local web server from the project directory:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Manual Verification

1. On the home page, cycle through every background color, reset the color, and confirm that the clock updates each second.
2. On the FAQ page, confirm that answers start hidden and that every question opens and closes smoothly.
3. On the About page, open and close the contact dialog using the visible controls, backdrop, and Escape key.
4. Try empty and incorrect form values, then submit a valid email, an eight-character-or-longer password, and a matching confirmation.
5. Repeat the checks with keyboard navigation and at 375 px, 768 px, and 1440 px.
6. Verify the updated site in Chrome and at least one additional modern browser, with no console errors.

## Project Report

The editable Assignment 4 report is `REPORT.md`, and the submission copy is `REPORT.docx`. Required browser screenshots are stored in `report-assets/`; their filenames and verification notes are listed in the report.

## Deployment

The final `main` branch is published with GitHub Pages at https://teraflu7.github.io/glowup/. Test every page and interaction from this public address before presentation.
