# Repository Instructions

## Scope

This repository currently develops the frontend application using
TypeScript, React, Vite, and Tauri as the desktop runtime.

Rust application logic and Tauri native integrations are outside the
current development scope unless explicitly requested.

Do not introduce Tauri Commands, Plugins, filesystem access, window APIs,
Rust business logic, or other native integrations merely for future use.

## Project Guidelines

Use the following documents according to the task.

- TypeScript application code:
  `docs/guidelines/typescript-basic.md`

- React components, state ownership, UI architecture, hooks, or feature structure:
  `docs/guidelines/react-ui.md`

- Tests, test architecture, runtime validation, or test dependencies:
  `docs/guidelines/frontend-testing.md`

- Tauri configuration, Vite/Tauri build, environment configuration,
  external API communication, CSP, or desktop WebView behavior:
  `docs/guidelines/tauri-desktop-platform.md`

Read only the guidelines relevant to the current task.
For changes spanning multiple areas, apply all relevant guidelines.

## Architectural Boundaries

Preserve the UI responsibility model:

L3 Layout
→ L2 Widget
→ L1 Pure View

Keep external data access, shared application state, rendering responsibility,
and platform integration separated according to the relevant guidelines.

Do not add abstractions or infrastructure solely for possible future requirements.

## Verification

Use the verification appropriate to the changed layer.

For ordinary frontend changes, use the project's existing type check,
lint, and test commands.

For UI-affecting changes, validate the resulting UI behavior in the browser
when the available development environment supports it.

Do not add new test frameworks or infrastructure unless the existing
verification strategy cannot reasonably cover the required behavior.
