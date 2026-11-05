# Front End Assignment 6 — jQuery

**Project:** GlowUp  
**Team:** Tamiris Mukieva and Alina Abdubek  
**Group:** SE-2516  
**Repository:** https://github.com/Teraflu7/glowup  
**GitHub Pages target:** https://teraflu7.github.io/glowup/

## Objective

Assignment 6 extends the existing responsive GlowUp site with jQuery-based search and engagement features while retaining its current pages, validation, accessibility, and Bootstrap components.

## Implemented features

### Search and suggestions

The Blog page filters article cards as the visitor types. Search results respect the existing category filters, matching text is highlighted without interpreting user input as HTML, and an empty-result message is announced accessibly. Autocomplete suggestions match article titles, can be selected with the mouse or arrow and Enter keys, and close with Escape or an outside click.

### Engagement and page feedback

All pages show an accessible scroll-progress bar. Home-page statistics animate when they enter the viewport and display their final values immediately for reduced-motion preferences or browsers without `IntersectionObserver`.

The Blog page provides a copy button for the five-step habit guide. It uses the Clipboard API where available and a browser fallback otherwise. Success and failure feedback uses an accessible, dismissible toast component shared with the signup form.

### Form and images

After existing validation succeeds, the signup form displays a spinner and “Подождите…” during a short simulated submission, then restores its controls and shows inline and toast success feedback. No server or real account creation is involved.

Content images use native `loading="lazy"` and `decoding="async"` attributes to defer below-the-fold image work without JavaScript-specific placeholders.

## Verification

Start a local web server from the repository root:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000/tests/assignment6-smoke.html` and run the browser checks. The smoke suite covers:

1. Live search, keyboard suggestions, empty results, and category filtering.
2. Copying all five guide steps and dismissing the confirmation toast.
3. Lazy-loading attributes and layout width at a 390 px viewport.
4. The signup form loading state, completion message, and success toast.
5. Scroll progress reaching 100%.
6. Home statistics reaching their configured target values.

The six smoke checks passed in the local browser preview. The form’s delay is simulated; the site does not send or persist submitted form data.

## Implementation notes

- Search only considers article content, not the extra “Read More” text inserted by the previous assignment.
- Autocomplete uses text nodes and ARIA combobox/listbox states; entered text is never inserted as HTML.
- Clipboard failure is reported visibly, and a fallback is attempted when browser permissions prevent the Clipboard API.
- The test runner is dependency-free and runs in a same-origin browser context; jQuery itself is loaded from its CDN, so the preview requires internet access.

## Deployment and submission

The configured deployment target is GitHub Pages at https://teraflu7.github.io/glowup/. This local implementation has not yet been pushed or published. After pushing `main`, verify the deployed pages and interactions before presenting the site.

Capture screenshots of the working search, form loading state, copy confirmation, and smoke-test results before exporting a PDF submission if screenshots are required by the instructor.
