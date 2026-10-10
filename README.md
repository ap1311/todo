# To-Do List

A clean, responsive To-Do List app built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no dependencies.

Tasks are saved to `localStorage`, so your list is still there the next time you open the page.

## Features

- **Add tasks** — type in the input and submit the form.
- **Complete tasks** — click the round checkbox to toggle a task done; completed tasks get a strikethrough.
- **Delete tasks** — remove any individual task with the ✕ button.
- **Filter** — switch between **All**, **Active**, and **Completed** views.
- **Clear completed** — remove every finished task in one click (button disables when there are none).
- **Live count** — shows how many tasks are still to do.
- **Persistent** — tasks are stored in `localStorage` under the key `todo.tasks.v1`.
- **Multi-tab sync** — edits in one tab update other open tabs via the `storage` event.
- **Accessible** — semantic markup, ARIA labels, keyboard-friendly focus styles, and `prefers-reduced-motion` support.

## Project structure

```
todo/
├── index.html   # Markup and structure
├── style.css    # Styling, layout, theming, responsive tweaks
└── script.js    # App logic and localStorage persistence
```

## Getting started

No installation or build required.

1. Clone the repository:
   ```bash
   git clone https://github.com/ap1311/todo.git
   ```
2. Open `index.html` in any modern web browser.

Optionally serve it locally (useful to avoid any file:// quirks):

```bash
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then visit `http://localhost:8000`.

## How it works

`script.js` keeps an in-memory array of tasks and re-renders the list whenever state changes. Each task is stored as:

```js
{ id: "…", text: "…", completed: false }
```

User input is rendered with `textContent`, so task text is escaped and safe from HTML injection.

## Browser support

Works in current versions of Chrome, Edge, Firefox, and Safari, including mobile.

## License

No license specified.
