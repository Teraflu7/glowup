# GlowUp

GlowUp is a responsive multi-page website about building healthy habits. It extends an HTML5, CSS3, and Bootstrap 5.3.8 project with accessible interactive features built with vanilla JavaScript and jQuery.

Team: Tamiris Mukieva and Alina Abdubek, group SE-2516. The deployed website is available at https://teraflu7.github.io/glowup/.

## Assignment 4 Features

- Custom contact-form validation with required-field, email, password-length, and password-confirmation checks.
- A native dialog-based contact popup that opens from a call-to-action button and closes from its button, backdrop, or the Escape key.
- A smooth FAQ accordion with hidden-by-default answers and accessible expanded-state information.
- A home-page background color control that cycles through four predefined colors and includes a reset action.
- A localized current date and time display that updates every second.

## Assignment 6 Features

- jQuery-powered live article search, category-aware autocomplete suggestions, and safe match highlighting.
- An accessible scroll-progress indicator on every page and animated home-page statistics that respect reduced-motion preferences.
- Reusable, dismissible toast notifications for completed actions and form submissions.
- A simulated form-submission loading state that preserves the existing field validation and multi-step flow.
- A button to copy the five-step habit guide, with Clipboard API and browser fallback support.
- Native lazy loading and asynchronous decoding for below-the-fold content images.
- A browser smoke-test runner covering the Assignment 6 interactions and a 390 px mobile viewport.

## Pages

- `index.html` - home page, responsive card sections, background controls, and live date/time.
- `blog.html` - CSS Grid Areas, articles, and a Bootstrap carousel with nine images.
- `about.html` - team and pricing sections plus the popup contact form and validation.
- `faq.html` - four JavaScript-powered accordion questions.

## JavaScript Modules

- `js/home.js` - background palette controls, reset behavior, status updates, and the live clock.
- `js/faq.js` - FAQ open/close behavior and accessible accordion state.
- `js/signup.js` - dialog controls, focus restoration, field validation, error messages, and success feedback.
- `js/assignment6.js` - jQuery initialization, blog search, suggestions and highlighting, scroll progress, animated counters, copy action, and toast notifications.

Related component styles are located in `css/home-interactions.css`, `css/faq-accordion.css`, `css/signup-dialog.css`, and `css/assignment6.css`. Shared site styles remain in `styles.css`.

## Run Locally

Open `index.html` directly in a browser or start a local web server from the project directory:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

To run the Assignment 6 browser checks, open `http://localhost:8000/tests/assignment6-smoke.html` in a browser with an internet connection (jQuery is loaded from the official CDN), then select **Запустить проверки**. All six checks should pass.

## Manual Verification

1. On the home page, cycle through every background color, reset the color, and confirm that the clock updates each second.
2. On the FAQ page, confirm that answers start hidden and that every question opens and closes smoothly.
3. On the About page, open and close the contact dialog using the visible controls, backdrop, and Escape key.
4. Try empty and incorrect form values, then submit a valid email, an eight-character-or-longer password, and a matching confirmation.
5. Repeat the checks with keyboard navigation and at 375 px, 768 px, and 1440 px.
6. Verify the updated site in Chrome and at least one additional modern browser, with no console errors.
7. On the Blog page, search for an article, select an autocomplete suggestion with the keyboard, clear the query, and copy the five-step plan.
8. On a long page, scroll from top to bottom and confirm that the progress indicator reaches 100%; verify that the home statistics animate when they enter view.
9. Run the Assignment 6 smoke-test page at 390 px and confirm all six checks pass.

## Project Report

The Assignment 6 implementation and verification notes are in `ASSIGNMENT6-REPORT.md`. Capture current browser screenshots and export the final submission report to PDF if required by the course.

## Deployment

The project’s GitHub Pages target is https://teraflu7.github.io/glowup/. The Assignment 6 changes are currently committed locally; push the updated `main` branch to publish them, then verify every page and interaction at the public address.
