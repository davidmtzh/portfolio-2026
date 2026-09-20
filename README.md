# Carlos D. Martinez — From signal to software

An independent React/Vite portfolio built from the approved BUILD-PLAN.md. All new files and copied assets are contained in this directory. The old portfolio remains read-only.

## Run locally

Requires a Node version supported by the installed Vite release (Node 22.12+ recommended).

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run lint
```

The environment used to build this project provides Node directly; equivalent commands are `node node_modules/vite/bin/vite.js build` and `node node_modules/eslint/bin/eslint.js .`.

## Implemented experience

- One-time GSAP hero power-on (shortened on mobile), a minimal flowing electrical visual, skip behavior, and calm powered state.
- Measured SVG connectors across the hero, background, and project distribution system; scroll-controlled story signal.
- Four asymmetric project folders containing 12 projects, with focus/tap/hover branches and a continuously moving light routed to the selected card.
- Three dedicated featured cases: Circuit Minds, AI Voice Test Agent, and Smart House Automation.
- Education, teaching, experience, accessible navigation, and resume access.
- Contact validation, email-draft composition, copy email/message, and an optional hosted-form POST adapter.
- Retro cartridge/monitor interaction and a three-chapter browser preview using verified Quintex sprite assets, with movement, strike, pause, replay, and eject controls.
- Responsive layouts, system reduced-motion support, manual motion reduction, and DOM/SVG fallback when the 3D scene cannot render.

## Contact: configuration still required for direct delivery

Carlos confirmed that no submission endpoint exists yet. The current CTA is honestly labeled **Open email draft**; it does not pretend to send a message. It opens the visitor's mail app with the completed form. Copy actions cover browsers without an email handler.

To enable direct delivery, create and verify a hosted form with browser POST support, set `VITE_CONTACT_ENDPOINT` in `.env.local` (or Vercel environment settings), and rebuild. A Formspree-style endpoint accepting FormData and returning an HTTP success/failure is supported. No private API key belongs in a VITE variable. Test receipt, errors, spam handling, and the deployed origin before calling direct delivery complete. A successful HTTP response confirms provider acceptance, not inbox receipt.

## Quintex: deliberate fallback

The repository contains Unity scenes, sprites and an Android APK, but no WebGL build was found. This implementation is a separate lightweight browser scene, explicitly labeled as a preview. It does not execute the Unity source or reproduce a full level. Environment art is code-generated; character, enemy, and guardian sprites come from the user's game repository. See CONTENT-SOURCES.md. Heavy scene code loads only after insertion; the game never starts audio automatically.

## Architecture

`src/components`: semantic sections and reusable circuitry. `src/content/projects.js`: project directory. `src/components/FlowingPulse.jsx`: lightweight SVG current animation. The earlier 3D chip is no longer rendered. `src/hooks`: system motion preference. CSS owns layout and skin; GSAP owns coordinated timelines; Motion owns card response; SVG owns cable-aligned light movement. Asset paths are local and independent of the old repository.

## Deploy to Vercel

Set the project root to `new-site`, framework to Vite, build command to `npm run build`, and output to `dist`. No server function is needed. Anchor navigation works on the static frontend. Configure the form endpoint only when ready. Set a canonical URL and social image once the production domain is chosen. No deployment has been performed by this implementation task.

## Validation and limits

See VALIDATION.md for actual checks. The requested visual revision removes the 3D chip and its runtime bundle. Real field Web Vitals and inbox delivery have not been measured.

## Visual revision — September 18

Replaced the signal-processor panel with a simpler electrical visual, removed floating gates and the central chip, and routed continuously moving light along measured cables to the active card. Added distinct section backgrounds and subtle ambient currents. Enlarged on-screen text to a minimum of 12px with 15–17px body copy, made actual project names the prominent case-study headings, and simplified labels. Reduced-motion and visibility-aware behavior are preserved.
