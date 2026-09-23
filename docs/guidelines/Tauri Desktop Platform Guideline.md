# **Tauri Desktop Platform Guideline**

**Subtitle: Platform Standards for Web-Based Tauri Applications**

## **1. Overview**

This guideline defines the basic policy for running a web UI built with Vite + React + TypeScript as a desktop application using Tauri.

This guideline will be extended incrementally.

The initial version covers only the following.

- Rendering a web UI with React
- Development/production build with Vite
- HTTPS communication with external internet APIs
- Frontend configuration
- Build as a Tauri desktop application

Native integrations such as Tauri Commands, plugins, file system access, window APIs, and Rust application logic are currently out of scope.

These are **not prohibited; they are targets to be added to the guideline when needed**.

---

## **2. Architecture**

The current base structure is as follows.

Tauri Runtime

&nbsp;&nbsp;&nbsp;&nbsp;↓

WebView

&nbsp;&nbsp;&nbsp;&nbsp;↓

React Application

&nbsp;&nbsp;&nbsp;&nbsp;↓

External HTTPS API

&nbsp;

Design the frontend application as a regular Vite + React application.

Within the current scope, do not embed assumptions about Tauri-specific functionality into application architecture.

At the same time, do not impose constraints that would block future native integration.

When required capabilities increase, define architecture and responsibilities at that time.

---

## **3. Technology Stack**

| Category                      | Standard       |
| ----------------------------- | -------------- |
| Desktop Runtime               | Tauri          |
| Frontend Build                | Vite           |
| UI                            | React          |
| Language                      | TypeScript     |
| Server State / Async Resource | TanStack Query |
| Runtime Validation            | Zod            |

Follow `TypeScript Basic Guideline` for TypeScript code.

Follow `React UI Guideline` for React application structure and UI design.

---

## **4. Project Structure**

Use the following base structure.

root/

├── src/

│ ├── app/

│ ├── features/

│ ├── routes/

│ ├── shared/

│ ├── assets/

│ └── env.ts

│

├── src-tauri/

│ ├── src/

│ ├── capabilities/

│ ├── Cargo.toml

│ └── tauri.conf.json

│

├── vite.config.ts

├── package.json

└── tsconfig.json

&nbsp;

`src/` manages the frontend application.

`src-tauri/` manages Tauri runtime and desktop application settings.

Within the current scope, do not place frontend business logic under `src-tauri/`.

---

## **5. External API Communication**

Use web-standard `fetch` for communication with external internet APIs.

Do not write communication logic directly in React components; separate it into the frontend API layer.

The standard flow is as follows.

Widget

&nbsp;&nbsp;↓

Query Hook

&nbsp;&nbsp;↓

API Function

&nbsp;&nbsp;↓

fetch

&nbsp;&nbsp;↓

External HTTPS API

&nbsp;

Use TanStack Query for cache, retry, refetch, and loading state management.

Use HTTPS in production environments.

Do not trust external input such as API responses; perform runtime validation with Zod as needed.

---

## **6. Environment Configuration**

Centralize frontend configuration in `env.ts`.

Do not reference `import.meta.env` directly from application code.

import { z } from 'zod';

&nbsp;

const envSchema = z.object({

&nbsp;&nbsp;VITE_API_BASE_URL: z.string().url(),

});

&nbsp;

export const env = envSchema.parse(import.meta.env);

&nbsp;

Treat environment variables passed to the frontend as public information.

Do not include secrets like the following in frontend configuration.

- API secrets
- Private keys
- Passwords
- Service account credentials

---

## **7. Security**

Include HTML, JavaScript, and CSS used to compose the application UI in the application build.

Treat the external internet only as API communication destinations; do not load remote scripts as application code.

Enable Content Security Policy and allow only required resources and API origins.

In particular, when adding an external API, add only required origins to `connect-src`.

To keep security policy simple, do not assign unnecessarily broad permissions.

---

## **8. Development & Build**

In development, use the Vite development server from Tauri.

Vite Dev Server

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+

Tauri Dev Runtime

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

Desktop WebView

&nbsp;

In production, embed Vite build artifacts into the Tauri application.

Use the following as the basic verification flow.

Type Check

↓

Lint

↓

Test

↓

Vite Build

↓

Tauri Build

&nbsp;

You may use a browser for frontend-only development and checks.

However, features delivered as a desktop application must ultimately be verified on the Tauri WebView as well.

---

## **9. Extension Policy**

This guideline defines only currently necessary platform capabilities.

When native integration becomes necessary, add the corresponding functionality to this guideline.

Future addition targets include:

- Command / IPC
- Tauri Plugin
- File System
- Window Management
- Native Dialog
- Clipboard
- Notification
- Database
- Sidecar
- Updater
- Rust Application Logic

Being out of scope today does not prohibit or discourage adopting them.

When adding new capabilities, define responsibilities and boundaries based on actual use cases, and avoid upfront abstraction motivated only by possible future use.
