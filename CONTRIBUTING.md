# Contributing

Thanks for contributing.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:8000`.

## Door Data Changes

- Edit `public/doors.yaml`.
- Keep each `answer` at exactly 9 letters.
- Keep each `grid` at exactly 9 entries.
- Run:
  ```bash
  npm run doors:links
  ```
  to verify route slugs and links.

## Pull Request Guidelines

- Keep changes focused and small.
- Preserve gameplay rules and lockout behavior unless your PR explicitly targets those systems.
- Include a short testing note in your PR description:
  - what you changed
  - how you tested
  - device/browser notes if UI or audio was touched

## Style Notes

- This project intentionally uses a distressed retro-industrial visual style.
- Prefer incremental UI polish over broad visual rewrites.
- Respect `prefers-reduced-motion` when adding motion effects.
