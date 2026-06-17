# Development Guide

## Project Overview

URLscape is a lightweight, client-side URL encoder/decoder web application built with Vue 3 and Bulma CSS framework. It runs entirely in the browser with no build step required.

## Tech Stack

- **Vue 3** (via CDN) - Reactive UI framework
- **Bulma CSS** (via CDN) - Modern CSS framework
- **Font Awesome 6** (via CDN) - Icons
- **Vanilla JavaScript** - Core logic
- **CSS Custom Properties** - Theming system
- **Playwright** - E2E and unit testing

## Project Structure

```
urlscape/
├── index.html          # Main HTML entry point, Vue template
├── script.js           # Vue 3 application logic (state, watchers, methods)
├── style.css           # All styles including theming via CSS variables
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline caching)
├── Makefile            # Common commands (serve, test, etc.)
├── package.json        # Dev dependencies (Playwright)
├── playwright.config.js# Playwright configuration
├── .gitignore          # Git ignore rules
├── Readme.md           # Project documentation
├── LICENSE.txt         # Apache License 2.0
├── assets/
│   ├── icon.svg             # PWA app icon
│   ├── link_preview.jpg     # Social preview image
│   └── bg-pattern.svg       # Background pattern
└── tests/
    ├── app.spec.js          # E2E tests
    └── encoding.spec.js     # Unit tests for encoding logic
```

## Development Workflow

### Running Locally

No build step required:

```bash
make serve
```

**Note**: The Clipboard API requires a secure context (HTTPS or localhost). Opening the file directly via `file://` will not work for copy functionality.

### Making Changes

1. Edit `index.html`, `script.js`, or `style.css` directly
2. Refresh browser to see changes
3. No compilation or bundling needed

### Available Commands

```bash
make install        # Install dependencies
make serve          # Start dev server
make test           # Run E2E and unit tests (headless)
make test-headed    # Run tests in visible browser
make test-ui        # Run tests with Playwright UI mode
```

### Code Style Guidelines

#### JavaScript (script.js)
- Use Vue 3 Options API
- Prefer `const` over `let`, avoid `var`
- Extract shared logic to private methods (prefixed with `_`)
- Handle async operations with try/catch or .catch()
- Keep methods small and focused

#### CSS (style.css)
- Use CSS custom properties (variables) for theming
- Mobile-first responsive design
- Avoid `!important` unless absolutely necessary
- Group related properties together

#### HTML (index.html)
- Use semantic HTML5 elements
- Minimize inline styles (move to CSS)
- Use CDN links with specific versions (not `@latest`)

## Theming System

The app uses CSS custom properties defined on `:root` and overridden by `body.dark`:

```css
:root {
  --bg-body: #f5f5f5;
  --text-body: #222;
  --bg-input-box: rgb(226 226 226);
  /* ... */
}

body.dark {
  --bg-body: #232d5b;
  --text-body: #fff;
  --bg-input-box: #334599;
  /* ... dark overrides */
}
```

Theme is persisted in `localStorage` and applied via an inline `<script>` before first paint to prevent flash.

## Features

- **Real-time encoding** – Vue watcher on `inputText` auto-transforms to `outputText` (and vice versa)
- **Auto-detect** – If input contains `%XX` patterns, decode; otherwise encode
- **Bidirectional sync** – Editing either textarea updates the other (via `_updating` guard)
- **Per-box Copy & Clear** – Inline buttons in each textarea header
- **Character/Byte Count** – Computed properties using `Blob.size` for accurate UTF-8 byte count
- **URL Validation** – Uses `new URL()` constructor, shown as green badge
- **Keyboard Shortcuts** – Keydown listener in `mounted()`

## Testing

```bash
make test          # headless
make test-headed   # visible browser
make test-ui       # Playwright UI mode
```

31 tests total:
- 10 E2E tests (encode, decode, clear, copy, theme, unicode, URLs)
- 21 unit tests (encodeURIComponent, decodeURIComponent, round-trip)

## Deployment

Static hosting only. No server-side processing.
Recommended: GitHub Pages, Netlify, Vercel, Cloudflare Pages.

## Performance Considerations

- All assets loaded from CDN (Bulma, Font Awesome, Vue)
- SVG background pattern is inline-friendly (small)
- Service worker caches app shell for offline use

## Browser Support

Modern browsers supporting:
- ES6+ (arrow functions, const/let, template literals)
- Clipboard API
- CSS Custom Properties
- Vue 3 (requires Proxy support)

IE11 not supported.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes following style guidelines
4. Run `make test` to check for regressions
5. Submit PR with clear description

## License

Apache License 2.0 - see LICENSE.txt
