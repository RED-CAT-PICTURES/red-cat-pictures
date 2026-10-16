<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/RED-CAT-PICTURES/red-cat-pictures/main/public/logo-light.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/RED-CAT-PICTURES/red-cat-pictures/main/public/logo-dark.svg">
    <img alt="RED CAT PICTURES Logo" src="https://raw.githubusercontent.com/RED-CAT-PICTURES/red-cat-pictures/main/public/logo-dark.svg" width="96">
  </picture>
</p>

<h1 align="center">RED CAT PICTURES</h1>

<p align="center">
  <strong>Tech-enabled Creative Media Agency</strong>
</p>

<p align="center">
  <a href="https://redcatpictures.betteruptime.com">
    <img src="https://uptime.betterstack.com/status-badges/v3/monitor/10v2y.svg" alt="Better Stack Monitor Status">
  </a>
  <a href="https://github.com/RED-CAT-PICTURES/red-cat-pictures/releases">
    <img src="https://img.shields.io/github/v/release/RED-CAT-PICTURES/red-cat-pictures?color=CD2D2D" alt="Latest GitHub Release">
  </a>
 <a href="https://bun.sh">
    <img src="https://img.shields.io/badge/Bun-1.4.0-black?logo=bun&logoColor=white&style=flat-square" alt="Bun 1.4" />
  </a>
  <a href="https://tauri.app">
    <img src="https://img.shields.io/badge/Tauri-2.12-24C8DB?logo=tauri&logoColor=white" alt="Tauri 2">
  </a>
  <a href="https://nuxt.com">
    <img src="https://img.shields.io/badge/Nuxt-4.5.2-00DC82?logo=nuxt" alt="Nuxt 4">
  </a>
  <a href="https://github.com/RED-CAT-PICTURES/red-cat-pictures/actions/workflows/integrate.yml">
    <img src="https://github.com/RED-CAT-PICTURES/red-cat-pictures/actions/workflows/integrate.yml/badge.svg" alt="Nuxt CI Status">
  </a>
  <a href="https://github.com/RED-CAT-PICTURES/red-cat-pictures/pkgs/container/red-cat-pictures">
    <img src="https://img.shields.io/badge/Docker-GHCR-2496ED?logo=docker&logoColor=white&style=flat-square" alt="Docker GHCR" />
  </a>
  <a href="https://github.com/RED-CAT-PICTURES/red-cat-pictures/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/RED-CAT-PICTURES/red-cat-pictures?color=CD2D2D" alt="License: GPL-3.0">
  </a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/RED-CAT-PICTURES/red-cat-pictures/main/public/previews/landing.jpg" alt="RED CAT PICTURES Platform Preview" width="100%">
</p>

---

## Overview

**RED CAT PICTURES** is an enterprise-grade full-stack platform powering a tech-enabled creative media agency. Built with Nuxt 4, Nitro, and Tauri v2, the application delivers multi-codec adaptive video streaming, WebGL shaders, automated headless CMS synchronization with Notion, and multi-channel notifications (Web Push, WhatsApp, Facebook) across web, desktop, and mobile platforms. The platform also embeds a native Model Context Protocol (MCP) server for automated production scoping and pricing estimation by AI agents.

### Features

- ⚡ **Nuxt 4 & Nitro Performance:** Full-stack architecture powered by Bun, featuring Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and route-level caching.
- 🖥️ **Cross-Platform Native Apps:** Native desktop (macOS Apple Silicon/Intel, Linux, Windows) and mobile (Android APK/AAB) clients built using Tauri v2 and Rust.
- 🎬 **Adaptive Media & 3D Shaders:** High-definition video streaming across AV1, HEVC, VP9, and AVC codecs with Video.js, accompanied by WebGL shader pipelines powered by TresJS, Three.js, and Regl.
- 🗂️ **Automated Notion Headless CMS:** Background tasks poll and sync projects, media assets, clients, promotional offers, and legal policies into local Nitro cache storage every 3 minutes.
- 🤖 **Omnichannel Notification Pipelines:** Automated Nitro workers dispatch newly published episodes, blogs, and portfolio assets to Web Push subscribers, WhatsApp recipients, and Facebook Pages.
- 🧠 **Native Model Context Protocol (MCP) Server:** Embedded MCP server (`@nuxtjs/mcp-toolkit`) exposing pricing calculation tools for agentic AI pairs and workflows.

---

## Model Context Protocol (MCP) Server

RED CAT PICTURES integrates `@nuxtjs/mcp-toolkit` to expose business logic and pricing calculators directly to MCP-compatible AI assistants and IDEs.

- **Server Name:** `RED CAT PICTURES MCP Server`
- **Protocol Version:** `1.0.0`

### Available Tools

#### `get-packages`

Retrieves pricing tiers, package feature matrices, and calculates estimated production costs based on shoot duration.

| Parameter       | Type                       | Default     | Description                                                     |
| :-------------- | :------------------------- | :---------- | :-------------------------------------------------------------- |
| `days`          | `number` (integer $\ge 1$) | `1`         | Duration of the shoot/project in days.                          |
| `packageId`     | `'standard' \| 'custom'`   | `undefined` | Filter results for a specific package tier.                     |
| `includeAddons` | `boolean`                  | `false`     | Whether to include optional premium add-ons in the calculation. |

#### Example Invocation

```json
{
  "name": "get-packages",
  "arguments": {
    "days": 3,
    "packageId": "standard",
    "includeAddons": true
  }
}
```

#### Example Output

```json
{
  "packages": [
    {
      "id": "standard",
      "title": "Standard Photography Package",
      "subtitle": "Everything you need for great product visuals",
      "price": "15000",
      "unit": "day",
      "features": [
        { "icon": "local:camera", "title": "Photo & video shoots included" },
        { "icon": "local:badge-check", "title": "Marketplace-ready edits (Amazon, Flipkart, etc.)" },
        { "icon": "local:layout", "title": "White background & infographic shots" },
        { "icon": "local:sparkles", "title": "Professional post-processing" },
        { "icon": "local:package", "title": "360° product video available" },
        { "icon": "local:timer", "title": "Quick turnaround delivery" }
      ],
      "calculation": {
        "requestedDays": 3,
        "dailyRate": "15000",
        "totalEstimatedCost": "Requires Consultation",
        "currency": "INR"
      }
    }
  ],
  "addons": [{ "item": "Additional Model Casting", "price": "Varies" }],
  "summary": "Estimated project duration: 3 day(s). Showing details for standard."
}
```

---

## REST API Reference

The Nitro server provides high-performance cached REST endpoints for public data, administrative webhooks, and push subscriptions.

### Endpoints

| Method | Endpoint                             | Auth Required | Cache / ISR | Description                                                                             |
| :----- | :----------------------------------- | :-----------: | :---------: | :-------------------------------------------------------------------------------------- |
| `GET`  | `/api/health`                        |      No       |    None     | System probe returning node hostname and build metadata (`version`, `buildTime`).       |
| `GET`  | `/api/package`                       |      No       |    None     | Returns standard and custom photography/videography service packages.                   |
| `GET`  | `/api/offer`                         |      No       |    None     | Fetches active promotional offers directly from Notion CMS.                             |
| `GET`  | `/api/complience`                    |      No       |    None     | Returns parsed markdown for Terms, Privacy, Cancellation, and License policies.         |
| `GET`  | `/api/client`                        |      No       |  SWR (60s)  | Retrieves client portfolio, associated project names, and brand logos.                  |
| `POST` | `/api/client`                        |      No       |    None     | Submits a new client inquiry or offer claim directly to the Notion prospect database.   |
| `GET`  | `/api/photo`                         |      No       |  SWR (60s)  | Returns published portfolio photography assets with calculated aspect ratios and slugs. |
| `GET`  | `/api/photo/:slug`                   |      No       |  SWR (60s)  | Retrieves metadata and CDN asset sources for a specific photo slug.                     |
| `GET`  | `/api/video`                         |      No       |  SWR (60s)  | Returns released video assets with aspect ratios, durations, and streaming identifiers. |
| `GET`  | `/api/video/:slug`                   |      No       |  SWR (60s)  | Fetches streaming URLs and codec sources for a specific video slug.                     |
| `POST` | `/api/payment`                       |      No       |    None     | Generates a dynamic UPI payment deep link with configured merchant details.             |
| `POST` | `/api/notification/push/subscribe`   |      No       |    None     | Registers a browser Web Push subscription payload in Nitro cache storage.               |
| `POST` | `/api/notification/push/send`        |      No       |    None     | Broadcasts a Web Push notification to all active subscribers.                           |
| `POST` | `/api/subscription/:id/whatsapp`     |  **Bearer**   |    None     | Authenticated webhook to register or trigger WhatsApp notification actions.             |
| `POST` | `/api/subscription/:id/notification` |  **Bearer**   |    None     | Authenticated webhook for direct device push delivery.                                  |

> [!NOTE]
> Endpoints marked with **Bearer** auth require the `Authorization: Bearer <serverValidationKey>` header matching `NUXT_PRIVATE_SERVER_VALIDATION_KEY`.

### Programmatic Usage Example

#### Submitting a Client Inquiry (`POST /api/client`)

```typescript
interface ClaimRequestBody {
  offer: string
  company: string
  email: string
  contactNumber: string
  projectDetails: string
}

interface ApiResponse {
  success: boolean
  message: string
}

async function claimAgencyOffer(): Promise<ApiResponse> {
  const payload: ClaimRequestBody = {
    offer: 'E-Commerce Launch 2026',
    company: 'Acme Studio',
    email: 'client@acme.test',
    contactNumber: '+919876543210',
    projectDetails: 'Need 360-degree product photos and video reel for catalog launch.',
  }

  const response = await $fetch<ApiResponse>('/api/client', {
    method: 'POST',
    body: payload,
  })

  return response
}
```

#### Fetching Available Packages (`GET /api/package`)

```typescript
import type { Package } from '~~/shared/types'

async function loadPackages(): Promise<Package[]> {
  try {
    const packages = await $fetch<Package[]>('/api/package')
    return packages
  } catch (error) {
    console.error('Failed to load packages:', error)
    throw error
  }
}
```

---

## Scheduled Background Tasks

Nitro experimental scheduled workers automate continuous content synchronization and outbound notifications:

| Cron Schedule | Task Name        | Description                                                                                                                                                              |
| :------------ | :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `*/3 * * * *` | `sync:resource`  | Queries Notion databases (`prospect`, `client`, `project`, `content`, `asset`) and updates Nitro storage (`data:resource:*`). Extracts email and WhatsApp subscriptions. |
| `*/7 * * * *` | `notify:content` | Detects newly published episodes, blog posts, and media assets in storage; triggers dispatch to Web Push subscribers, WhatsApp contacts, and Facebook Pages.             |
| On Demand     | `sync:cdn`       | Syncs assets between CDN and Notion, verifying resolutions, aspect ratios, and durations via HEAD probes.                                                                |

---

## CLI & Development Scripts

All scripts are executed via [Bun](https://bun.sh) (`bun@1.4.3`):

### Development & Build

| Script     | Command            | Description                                                                          |
| :--------- | :----------------- | :----------------------------------------------------------------------------------- |
| `dev`      | `bun run dev`      | Starts the Nuxt development server with HMR on default port `3000`.                  |
| `build`    | `bun run build`    | Builds the production Nuxt application and copies static assets to `.output/static`. |
| `generate` | `bun run generate` | Pre-renders the application to static HTML/assets in `dist/`.                        |
| `preview`  | `bun run preview`  | Previews the production build locally via Nitro.                                     |
| `start`    | `bun run start`    | Runs the production build using Node.js with `.env.prod`.                            |
| `clean`    | `bun run clean`    | Cleans Nuxt cache directories and runs `cargo clean` inside `src-tauri`.             |

### Code Quality & Testing

| Script          | Command                         | Description                                                                  |
| :-------------- | :------------------------------ | :--------------------------------------------------------------------------- |
| `lint`          | `bun run lint`                  | Lints and automatically fixes codebase issues via ESLint 10.                 |
| `format`        | `bun run format`                | Formats all files using Prettier and `prettier-plugin-tailwindcss`.          |
| `detect`        | `bun run detect`                | Scans git history for exposed credentials using Gitleaks.                    |
| `test`          | `bun run test`                  | Executes the Vitest test suite.                                              |
| `test:unit`     | `bun run test:unit`             | Runs unit tests targeting Node environment in `test/unit/`.                  |
| `test:nuxt`     | `bun run test:nuxt`             | Runs Nuxt component and runtime tests with `@nuxt/test-utils` and Happy-DOM. |
| `test:watch`    | `bun run test:watch`            | Runs Vitest in interactive watch mode.                                       |
| `test:coverage` | `bun run test:coverage`         | Generates test coverage reports with V8 engine.                              |
| `test:load`     | `k6 run test/unit/load.test.ts` | Runs performance and load tests using k6.                                    |

### Native Desktop & Mobile (Tauri v2)

| Script               | Command                      | Description                                                                                |
| :------------------- | :--------------------------- | :----------------------------------------------------------------------------------------- |
| `tauri:dev`          | `bun run tauri:dev`          | Launches the desktop native client in development mode with HMR (`http://localhost:3002`). |
| `tauri:build`        | `bun run tauri:build`        | Compiles release binaries for macOS, Linux, or Windows.                                    |
| `tauri:dev:mobile`   | `bun run tauri:dev:mobile`   | Launches the mobile client in Android emulator / connected device.                         |
| `tauri:build:mobile` | `bun run tauri:build:mobile` | Generates release Android APK and AAB bundles.                                             |

---

## Deployment & Production Operations

The application is containerized using Alpine-based Bun containers and deployed across Docker Swarm.

### Docker Image Build & Run

```bash
# Build the Docker image
bun run docker:build

# Run the dev container with volume bind
bun run docker:start
```

### Production Docker Swarm Deployment

1. **Initialize Swarm on the Manager Node:**

   ```bash
   docker swarm init --advertise-addr <MANAGER-IP>
   ```

2. **Join Worker Nodes to the Swarm:**

   ```bash
   docker swarm join --token <WORKER-TOKEN> <MANAGER-IP>:2377
   ```

3. **Deploy the Production Stack:**

   ```bash
   docker stack deploy --compose-file docker-compose.prod.yml red-cat-pictures
   ```

4. **Scale Application Replicas:**

   ```bash
   docker service scale red-cat-pictures_app=2
   ```

5. **Verify Stack Health:**
   ```bash
   docker service ls
   docker service ps red-cat-pictures_app
   ```

### Auxiliary Microservices

The repository includes pre-configured Compose files for self-hosted auxiliary services:

- **Novu Notification Center (`docker-compose.novu.yml`):** Multi-channel notification engine (v3.17.0) with MongoDB and Redis.
- **Documenso Electronic Signatures (`docker-compose.documenso.yml`):** Self-hosted document signing service (v2.14.0) backed by PostgreSQL 16.
- **Cloudreve Drive (`docker-compose.cloudreve.yml`):** Asset file management service (v4.17.0) backed by PostgreSQL 17 and Redis.

---

<details>
<summary><strong>Local Development Setup</strong></summary>

### Prerequisites

- **Bun:** `^1.2.9` (Recommended: `1.4.3`)
- **Node.js:** `^22.11.0 || ^24.14.0` (for compatibility tooling)
- **Rust:** `^1.77.2` (Required only for Tauri native desktop builds)
- **Android SDK & NDK:** `29.0.13846066` + Java 17 (Required only for mobile builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/RED-CAT-PICTURES/red-cat-pictures.git
cd red-cat-pictures

# Install dependencies using Bun
bun install --frozen-lockfile

# Prepare Nuxt environment & types
bun run postinstall
```

### Environment Configuration

Copy the example environment file and populate the necessary secrets:

```bash
cp .env.example .env
```

Key environment variables:

- `NOTION_API_KEY`: Notion integration key for headless database querying.
- `NUXT_PRIVATE_NOTION_DB_ID`: JSON dictionary or individual Notion database IDs.
- `NUXT_PUBLIC_SITE_URL` / `NUXT_PUBLIC_CDN_URL`: Canonical site and asset distribution URLs.
- `NUXT_PRIVATE_SERVER_VALIDATION_KEY`: Bearer token for protected webhook endpoints.
- `NUXT_PUBLIC_VAPID_KEY` / `NUXT_PRIVATE_VAPID_KEY`: Web Push VAPID cryptographic keys.

</details>

---

## License

This project is licensed under the terms of the **GNU General Public License v3.0** (`GPL-3.0-only`). See the [LICENSE](https://github.com/RED-CAT-PICTURES/red-cat-pictures/blob/main/LICENSE) file for complete terms.

<br>

<a href="https://github.com/RED-CAT-PICTURES/red-cat-pictures/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=RED-CAT-PICTURES/red-cat-pictures" alt="Contributors" />
</a>
