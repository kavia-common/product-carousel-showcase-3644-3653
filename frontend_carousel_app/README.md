# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Added: Tailwind + Carousel

This app now uses Tailwind CSS and includes an accessible, auto-advancing content Carousel matching the Ocean Professional theme.

- Auto-advance every 5s, pause on hover/focus
- Keyboard: Left/Right arrows navigate
- Dots: clickable, focusable, aria-current for active
- Styling uses theme colors and subtle gradient accents

### Scripts
- `npm start` – starts CRA; in dev, you can run `npm run dev:css` in another terminal for continuous Tailwind builds if needed.
- `npm run build` – builds Tailwind CSS then CRA production bundle.

### Dev notes
Tailwind source: `src/tailwind.css`
Built CSS: `src/tailwind.output.css` (imported by `src/index.css`)

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds Tailwind CSS and the production bundle.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
