# 🛠️ Nezam Design Server: Offline Dependency Installation & Build Guide

This walkthrough explains how to resolve the Next.js compile build errors due to the missing `@dnd-kit` dependencies in the **Nezam Design Server** (`.nezam/design-server`).

---

## 🔍 Context & Diagnosis

During the execution of this task, the AI agent's sandbox environment has encountered two strict system boundaries:
1. **Network Air-Gap Boundary:** The sandbox terminal is 100% air-gapped (DNS resolution is disabled, and outgoing TCP traffic is firewalled). Any attempt by standard `npm` or `pnpm` to fetch packages from the public npm registry (`https://registry.npmjs.org`) will fail with `ENOTFOUND` or timeout.
2. **Corepack EPERM Permissions:** The global `pnpm` on the system is intercepted by Node's `corepack` wrapper, which throws `EPERM` when trying to access `/Users/Dorgham/.cache/node/corepack/v1/pnpm` from inside the restricted sandbox.

Because of these boundaries, **dependencies must be installed on your local host machine** (which has full internet access and directory permissions).

---

## 🚀 Step-by-Step Resolution

Please execute the following commands in your **local system terminal** (outside the AI chat session) under the workspace directory `/Users/Dorgham/Documents/Work/Devleopment/NEZAM`.

### 1. Install Missing Dependencies
Run `pnpm` directly inside the design-server directory to fetch and link `@dnd-kit` packages using your local cache and registry connection:

```bash
cd .nezam/design-server
pnpm install
```

> [!NOTE]
> The dependencies `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` are already correctly pre-declared inside your [.nezam/design-server/package.json](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/package.json) file. `pnpm install` will read them and sync them with your [pnpm-lock.yaml](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/pnpm-lock.yaml).

### 2. Verify Compilation Build
After the installation completes, verify that the compilation and TypeScript errors are resolved by running a dry-run Next.js production build:

```bash
pnpm build
```

This compiles all dynamic pages, layout designers, and sitemaps, ensuring no TypeScript types or missing imports exist.

### 3. Spin up the Design Server
To test and interact with the Design Server locally:

```bash
pnpm dev
```
The Design Server will spin up on **port 4000** (`http://localhost:4000`), allowing real-time workspace visual layouts and canvas manipulation!

---

## 📈 Verification Outputs

If the compilation succeeds, you will see a clean build summary similar to:

```text
▲ Next.js 15.1.6
  - Route (app)                              Size     First Load JS
  ┌ λ /                                      12.3 kB         142 kB
  └ ○ /_not-found                            871 B          84.2 kB
+ First Load JS shared by all                83.3 kB
  - tslib, lucide-react, framer-motion, zustand, @dnd-kit/core, @dnd-kit/sortable

✔ Compiled successfully
```
