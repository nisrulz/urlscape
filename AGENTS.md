# AGENTS.md - Project Instructions for AI Agents

## Project Summary

**URLscape** - A lightweight, client-side URL encoder/decoder web application.

- **Type**: Static web app (HTML/CSS/JS)
- **Framework**: Vue 3 (CDN), Bulma CSS (CDN)
- **License**: Apache 2.0
- **Author**: Nishant Srivastava (nisrulz@gmail.com)
- **Repository**: https://github.com/nisrulz/urlscape

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Vue 3 App (#app)                  │    │
│  │  ┌──────────────┐   watches    ┌──────────────┐    │    │
│  │  │  Input       │◄────────────►│  Output      │    │    │
│  │  │  textarea    │  bidirectional│  textarea    │    │    │
│  │  │              │     sync     │              │    │    │
│  │  └──────┬───────┘              └──────┬───────┘    │    │
│  │         │ copy/clear                  │ copy/clear │    │
│  │  ┌──────┴──────────────────────────────┴───────┐   │    │
│  │  │     Theme Toggle (dark/light)               │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Service Worker (sw.js) — caches app shell offline │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main entry point, Vue template, CDN links |
| `script.js` | Vue 3 app logic (state, watchers, methods) |
| `style.css` | All styling including theming via CSS variables |
| `manifest.json` | PWA manifest for installability |
| `sw.js` | Service worker for offline caching |

### Data Flow

1. User types in **input** textarea → `inputText` (Vue reactive)
2. Watcher auto-detects: if text contains `%XX` → decode, otherwise encode → updates `outputText`
3. User edits **output** textarea → `outputText` watcher transforms back to `inputText`
4. Both watchers use `_sync(target, val)` for shared transform logic
5. `_updating` flag prevents circular sync loops
6. Per-box **copy** button → `navigator.clipboard.writeText()` + blink animation
7. Per-box **clear** button → resets that field (clearing input also clears output via watcher)
8. **Theme** toggle → updates `theme` state, persists to `localStorage`, applies to `<body>`
9. **Keyboard shortcuts**: `Ctrl/Cmd+E` encode, `Ctrl/Cmd+D` decode, `Ctrl/Cmd+Shift+C` copy

## Coding Standards

### JavaScript
- Use Vue 3 Options API
- ES6+ syntax (arrow functions, const/let, template literals)
- Shared logic extracted to private methods (prefixed with `_`)
- Handle async operations with try/catch or .catch()
- Keep methods small and focused

### CSS
- CSS custom properties for all themeable values
- Mobile-first responsive design
- Animations via `@keyframes` with `prefers-reduced-motion` respect

### HTML
- Semantic HTML5
- Minimize inline styles (move to CSS)
- Proper meta tags for SEO/social
- Accessible markup (labels, ARIA where needed)

## Common Tasks

### Adding a New Feature
1. Add state/data in `script.js` (data, computed, watch, or methods)
2. Add template in `index.html`
3. Add styles in `style.css`
4. Add tests in `tests/`

### Modifying Themes
1. Edit CSS custom properties in `:root` (light) and `body.dark` (dark)
2. Test both themes thoroughly
3. Ensure contrast ratios meet WCAG AA

### Updating CDN Dependencies
1. Update version pins in `index.html`:
   - Vue: `https://unpkg.com/vue@3/dist/vue.global.prod.js`
   - Bulma: `https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css`
   - Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`
2. Test for breaking changes

## Testing

```bash
make test          # Run all 31 tests (10 E2E + 21 unit)
make test-headed   # Visible browser
make test-ui       # Playwright UI mode
```

## What NOT to Do

- ❌ Add build tools (webpack, vite, etc.) - keep it zero-build
- ❌ Add npm dependencies to the app - dev dependencies only for testing
- ❌ Use `localStorage` for anything except theme preference
- ❌ Add tracking/analytics
- ❌ Modify LICENSE.txt without legal review

## File Modification Guidelines

### index.html
- Keep CDN links versioned
- Minimize inline styles
- Vue directives only on elements inside `#app`

### script.js
- State in `data()`, methods in `methods`, watchers in `watch`, lifecycle in `mounted()`
- No side effects in `data()`
- Extract shared logic to private `_` methods

### style.css
- All themeable values as CSS custom properties
- Dark theme overrides in `body.dark { --var: value; }`
- Responsive breakpoints: 380px, 768px

## Deployment

Static hosting only. No server-side processing.
Recommended: GitHub Pages, Netlify, Vercel, Cloudflare Pages.

## Security

- No user data stored or transmitted
- Clipboard API only writes (no read)
- No eval(), no innerHTML with user input
- CSP-friendly (no inline scripts except Vue mount)

## Performance Budget

- Total JS: < 3KB (currently ~2KB)
- Total CSS: < 5KB (currently ~4KB)
- No images in critical path (background pattern is decorative)
- CDN assets cached via browser cache headers

## Accessibility

- Semantic HTML structure
- Label elements for inputs
- Color contrast WCAG AA in both themes
- Keyboard shortcuts for primary actions
- Reduced motion respected for animations
