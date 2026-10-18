# Front End Assignment 4 - GlowUp

## Project Information

- **Team name:** GlowUp
- **Team members:** Tamiris Mukieva; Alina Abdubek
- **Group:** SE-2516
- **Repository:** https://github.com/Teraflu7/glowup
- **Public URL:** https://teraflu7.github.io/glowup/
- **Technologies:** HTML5, CSS3, Bootstrap 5.3.8, and vanilla JavaScript

## Objective

The goal of Assignment 4 was to add interactive JavaScript features to the existing GlowUp website. The completed work includes custom form validation, an FAQ accordion, a popup contact form, a background color changer, and a dynamically updated date and time display. The updated website keeps the responsive layout and accessibility features created in the previous assignment.

## Completed Tasks

### 1. Form Validation

The contact form in `about.html` is validated by `js/signup.js`. Native browser messages are disabled with `novalidate` so that the project can display consistent custom messages next to the relevant fields.

Implementation steps:

1. Added required name, email, password, password confirmation, and message fields to the form.
2. Added an error container for each field so that the user can immediately identify the problem.
3. Trimmed text values before checking them and verified that every required field contains data.
4. Checked the email against a valid email pattern.
5. Required the password to contain at least eight characters and required the confirmation to match it exactly.
6. Set `aria-invalid` on invalid controls and moved keyboard focus to the first field that needs correction.
7. Prevented submission when any check fails and displayed a success message only after all values are valid.

The form was checked with empty values, an incorrectly formatted email, a short password, non-matching passwords, and a complete valid submission. Clear inline messages are shown for every invalid case.

### 2. FAQ Accordion

The four questions in `faq.html` were converted into an accessible accordion controlled by `js/faq.js` and styled by `css/faq-accordion.css`.

Implementation steps:

1. Changed every question heading into a native button.
2. Connected each button to its answer with `aria-controls` and reported its state with `aria-expanded`.
3. Hid all answer panels when JavaScript initializes.
4. Added click handlers that reveal the selected answer with a smooth transition.
5. Allowed a second click on the same question to hide its answer again.
6. Closed the previously open answer when another question is selected.

Because the questions are native buttons, the accordion also works with the keyboard. Existing reduced-motion styles continue to support users who request less animation.

### 3. Popup Contact Form

The contact form in `about.html` was moved into a native HTML `<dialog>`. Its layout is defined in `css/signup-dialog.css`, while opening, closing, focus handling, and validation are managed by `js/signup.js`.

Implementation steps:

1. Kept the dialog closed when the page first loads.
2. Added a visible call-to-action button that opens the popup.
3. Added a clear close button inside the popup.
4. Added support for closing the popup by selecting the backdrop or pressing Escape.
5. Returned focus to the opening button when the popup closes.
6. Kept the form responsive so that it remains usable on narrow and wide screens.

The result is a visually clear popup that can be opened and closed with a mouse, touch input, or keyboard.

### 4. Background Color Changer

The home page contains a new "Настрой свой GlowUp" (Customize your GlowUp) interaction panel. `js/home.js` changes the existing `--bg` CSS custom property, and `css/home-interactions.css` styles the controls.

Implementation steps:

1. Added "Сменить цвет" (Change color) and "Сбросить" (Reset) buttons to `index.html`.
2. Defined a controlled palette of soft colors that matches the original visual style.
3. Made each click cycle through soft pink, warm peach, airy lavender, and fresh mint.
4. Updated a live status message so that the current color is announced and visible.
5. Made the reset button return the page to the first color in the palette.

Changing the CSS custom property preserves the decorative background effects while visibly updating the page color.

### 5. Current Date and Time

The same home-page panel includes a semantic `<time>` element that displays the current date and time.

Implementation steps:

1. Created a new `Date` object when the page initializes.
2. Formatted the value with `Intl.DateTimeFormat` so that the result is readable and localized.
3. Wrote the formatted value into the visible `<time>` element.
4. Updated the value every second with `setInterval`.
5. Kept the element's machine-readable `datetime` value synchronized with the visible text.

The clock updates without reloading the page and displays both the current date and the current time.

## JavaScript and CSS Integration

- `index.html` links `css/home-interactions.css` and `js/home.js` for the color controls and live clock.
- `faq.html` links `css/faq-accordion.css` and `js/faq.js` for the FAQ accordion.
- `about.html` links `css/signup-dialog.css` and `js/signup.js` for the popup and validation.
- The existing `styles.css` remains responsible for the site's shared design and responsive layout.

The JavaScript files are loaded with `defer` so that the page markup is available before event listeners are attached.

## Accessibility

The implementation uses native buttons and form controls, visible labels, inline error text, focus management, and ARIA state attributes. The popup can be closed with Escape, the accordion can be operated from the keyboard, and the background status is communicated as text instead of relying only on color. These choices make the interactions understandable for keyboard and assistive-technology users.

## Work Distribution

- **Tamiris Mukieva:** FAQ accordion, background color changer, live date and time, and related home/FAQ styles.
- **Alina Abdubek:** popup contact form, custom validation, inline validation messages, and related dialog styles.
- **Both members:** cross-browser testing, report preparation, screenshots, deployment, repository review, and defense preparation.

Each member implemented multiple JavaScript components. The final integration review and test checklist cover the complete project so that both members can prepare to explain every required feature during the practice lesson.

## Testing and Verification

The following checks cover the functional requirements of the assignment:

1. Open `about.html`, open the popup, and confirm that it closes with the close button, backdrop, and Escape key.
2. Submit the form empty and confirm that required-field messages appear.
3. Test an invalid email, a password shorter than eight characters, and a non-matching confirmation.
4. Submit valid values and confirm that the success message appears.
5. Open `faq.html` and confirm that all answers are hidden initially.
6. Open and close every question, and confirm that selecting a new question closes the previous answer.
7. Open `index.html`, cycle through all four background colors, and use the reset button.
8. Confirm that the displayed date and time are readable and update once per second.
9. Repeat the interaction tests with keyboard-only navigation.
10. Test at 375 px, 768 px, and 1440 px in Chrome and one additional modern browser.
11. Confirm that the browser console contains no JavaScript errors and that all local files load successfully.

## Report Screenshots

The final report includes one clear screenshot for every required task. The following files were captured from the completed website and saved in `report-assets/`:

- `assignment4-validation-errors.png` - popup form showing representative inline validation messages.
- `assignment4-accordion-open.png` - FAQ page with one answer expanded and the others collapsed.
- `assignment4-popup-open.png` - contact popup open above the About page.
- `assignment4-background-color.png` - home page after switching to a different background color.
- `assignment4-date-time.png` - live date and time block showing a readable current value.
- `assignment4-mobile-view.png` - one interactive component demonstrated at a narrow mobile viewport.

The screenshots show the current website without developer tools or unrelated windows covering the tested components.

## Deployment

The final `main` branch was pushed to the shared GitHub repository and deployed with GitHub Pages at https://teraflu7.github.io/glowup/. The deployment workflow completed successfully, and the published pages expose the same Assignment 4 JavaScript modules as the tested local version.

## Final Reflection

Assignment 4 transformed GlowUp from a mainly static responsive website into an interactive application. The team practiced selecting DOM elements, listening for user actions, changing CSS properties, managing accessible component state, validating user input, working with the `Date` object, and organizing JavaScript by page. The work also demonstrated the importance of keyboard access, clear feedback, responsive testing, and coordination in a shared repository.

## Result

GlowUp implements all five required JavaScript features: form validation, an FAQ accordion, a popup form, background color controls, and a dynamic date and time display. The components are connected to the existing multi-page design, documented with screenshots, deployed on GitHub Pages, and ready for submission and defense.
