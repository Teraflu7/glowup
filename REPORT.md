# Front End Assignment 3 — GlowUp

## Project Information

- **Project:** GlowUp — a website for building healthy habits
- **Team members:** Tamiris Mukieva; Alina Abdubek
- **Group:** `[ENTER GROUP NUMBER]`
- **Public URL:** `[ADD THE DEPLOYED WEBSITE URL]`
- **Technologies:** HTML5, CSS3, Bootstrap 5.3.8

## Objective

The objective was to make an existing multi-page website responsive with CSS media queries and Bootstrap, use the required Bootstrap components, preserve semantic HTML, and provide basic accessibility.

## Completed Tasks

### 1. Responsive Typography

`styles.css` contains separate media queries for desktop, tablet, and mobile screens. They adjust the main heading, section headings, and introductory text without relying on Bootstrap.

### 2. Responsive CSS Card Row

The `.cards-container` section on the home page contains three cards. CSS media queries display:

- three cards per row on desktop screens;
- two cards per row on tablet screens;
- one card per row on mobile screens.

Bootstrap Grid is not used for this card row.

### 3. Bootstrap Grid

The features section on the home page uses `container`, `row`, `col-12`, `col-sm-6`, `col-md-6`, and `col-lg-4`. The team section on the About page uses `col-12`, `col-sm-12`, `col-md-6`, and `col-lg-6`. These sections demonstrate both three-column and two-column layouts.

### 4. Bootstrap Spacing Utilities

Visible spacing was moved from custom CSS to Bootstrap utility classes such as `m-*`, `p-*`, `mt-*`, `mb-*`, `px-*`, `py-*`, and `mx-auto`. Responsive utilities include `px-sm-2`, `mt-lg-4`, `px-lg-5`, and `p-md-4`.

### 5. Bootstrap Navbar

All four pages use a responsive `navbar navbar-expand-lg` with four links: Home, Blog, About, and FAQ. The navigation collapses behind a `navbar-toggler` button on narrow screens.

### 6. Bootstrap Buttons

All visible action buttons and button-style links use Bootstrap classes, including `btn-primary`, `btn-outline-primary`, `btn-lg`, and `btn-sm`. The two main actions on the home page are combined in a `btn-group`.

### 7. Bootstrap Carousel

The Blog page contains a Bootstrap carousel with nine images. It includes nine indicators, previous and next controls, captions, and descriptive alternative text.

### 8. Bootstrap Cards

The home page contains three Bootstrap cards with an image, title, text, and button. The Blog page contains three article cards combined with the `card-group` class.

### 9. Responsive Form Controls

The About page form uses `form-control`, `form-select`, `form-check-input`, `input-group`, `row`, `col-sm-*`, `col-md-*`, and `col-lg-*`. The form includes labels, required fields, and supporting instructions.

### 10. Semantics and Accessibility

The pages use `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`. Form labels are connected to their controls, images have meaningful `alt` text, and interactive elements use appropriate `aria-*` attributes. The project also includes a skip link, visible `:focus-visible` styles, and support for `prefers-reduced-motion`.

## Work Distribution

- **Tamiris Mukieva:** Tasks 1–5 — media queries, CSS cards, Bootstrap Grid, spacing utilities, and navbar.
- **Alina Abdubek:** Tasks 6–10 — buttons, carousel, Bootstrap cards, form, and accessibility.

## Project Structure

- `index.html` — home page and card demonstrations.
- `blog.html` — Grid Areas, guide, carousel, and article cards.
- `about.html` — team, pricing table, and contact form.
- `faq.html` — frequently asked questions.
- `styles.css` — custom presentation and CSS media queries.
- `images/` — project images.
- `report-assets/` — screenshots used in the report.

## Verification Steps

1. Open `index.html` through a local web server.
2. Test the layout at 375 px, 768 px, and 1440 px.
3. Confirm that the CSS card row changes between one, two, and three columns.
4. Open and close the Bootstrap mobile navigation.
5. Navigate through all nine carousel slides.
6. Check the Bootstrap cards and button states.
7. Complete the form with a keyboard and verify the required fields.
8. Visit all four pages and confirm that both team members are listed in every footer.

## Screenshots

The following screenshots were prepared for the report:

- [Home page — desktop](report-assets/home-desktop.png)
- [Home page — mobile](report-assets/home-mobile.png)
- [Blog — Bootstrap carousel](report-assets/blog-carousel.png)
- [About — Bootstrap Grid and form](report-assets/about-form.png)

The generated DOCX includes these browser results. During the presentation, the related HTML and CSS sections can also be opened in the code editor.

## Result

The project meets the technical requirements of Front End Assignment 3. It is responsive, includes the required CSS and Bootstrap solutions, provides four connected pages, and implements basic accessibility. Before submission, replace the two placeholders at the beginning of this report with the group number and public deployment URL.
