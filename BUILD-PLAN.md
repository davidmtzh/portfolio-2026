# Carlos D. Martinez — Master Build Plan

Status: APPROVED by Carlos. Implementation authorized. See README.md and CONTENT-SOURCES.md for verified implementation status.

Project root: `new-site/`. `old-portfolio/` is read-only content reference. All documentation, selected asset copies, source code, dependencies, and build output belong inside `new-site/`.

## Approved visual revision — September 18

Carlos requested larger readable text, clearer copy, prominent project names, no floating logic-gate symbols, replacement of the hero signal-processor visual, removal of the four-card microcontroller, continuous cable-following electrical pulses, and distinct backgrounds between sections. These explicit requests supersede the original chip/gate and small-label direction below. No additional approval is required for this revision.

## 1. Website Overview

A creative software engineering portfolio whose storytelling behaves like a living electronic system. Visitors follow one signal from Carlos's introduction through his multidisciplinary background, into four areas of engineering work, through three substantial case studies, and finally into contact and a personal game experience.

Primary audience: engineering hiring teams and potential collaborators. Primary conversion: contact Carlos. Secondary actions: inspect project evidence, visit repositories, and download his résumé.

Confirmed preferences: creative character; cyan and violet; cinematic electricity; recognizable logic gates; four project categories; three prominent projects; educational breadth and teaching experience made visible. Unanswered interview items are resolved below as proposed creative decisions, subject to this plan's approval.

## 2. Core Positioning

**Software engineer. Electronics foundation. Human perspective.**

Proposed headline: **From signal to software.**

Supporting copy: “I'm Carlos D. Martinez, a software engineer with roots in electronics, a background in psychology, and experience teaching technology. I build across applications, intelligent systems, embedded hardware, and infrastructure.”

Proposed mission: turn complex technical ideas into useful systems that people can understand and use. This is positioning inferred from Carlos's account, not a quotation or an invented employment claim.

The differentiator is the relationship between electronics, computing, human behavior, and teaching. Avoid presenting educational breadth as a list of unrelated credentials.

## 3. Brand Personality

Creative, curious, precise, approachable, and technically grounded. Visual drama introduces the work; clear writing and concrete evidence establish credibility. Use first-person copy where appropriate. Avoid inflated seniority, invented business outcomes, skill percentages, fake uptime indicators, and decorative code.

## 4. Messaging Hierarchy

1. Identity: Carlos D. Martinez — Software Engineer.
2. Perspective: electronics, computer science, psychology, and teaching.
3. Breadth: four connected engineering areas.
4. Proof: three featured projects and a complete categorized archive.
5. Credentials: education and relevant experience.
6. Invitation: “Let's build something useful.”
7. Personal signature: Quintex RPG, the final output of the circuit.

Primary CTA: **Contact me**, linking to `#contact`. Secondary hero CTA: **Explore my work**, linking to `#work`. Résumé access remains available in navigation and the credentials section.

## 5. Creative Concept

**INPUT → PROCESSING → TRANSFORMATION → OUTPUT.**

One continuous signal carries meaning. The introduction supplies input; Carlos's background processes it; a distribution node routes it into four practice areas; real projects demonstrate output. Contact becomes a new incoming connection. The residual signal powers a final retro game station.

Circuit endpoints attach to actual modules, headings, and interactive controls. Every major trace has a destination. Cyan communicates an incoming or active signal; violet communicates processing and downstream output. Text and shape also communicate state so color is never the sole cue.

## 6. Visual Direction

An editorial technical instrument: near-black surfaces, large expressive typography, purposeful whitespace, fine etched traces, and concentrated electrical light. Cinematic electricity comes from a bright pulse and controlled falloff along engineered paths, not lightning scattered behind content.

Keep the first three sections connected visually. After their immersive introduction, use calmer case-study compositions with readable evidence and generous margins. The final terminal restores depth and surprise without overpowering contact.

## 7. Complete Visual Style Guide

| Token | Proposed value | Role |
|---|---|---|
| Background | `#080B12` | Main canvas |
| Surface | `#101622` | Modules and evidence frames |
| Raised surface | `#182132` | Selected panels |
| Primary text | `#F3F6FC` | Headlines and body |
| Secondary text | `#ACB8CC` | Supporting copy |
| Cyan | `#55DFF5` | Incoming signal and primary emphasis |
| Violet | `#AA91FF` | Processing and output emphasis |
| Trace | `#334259` | Inactive paths, never essential text |

Validate actual rendered contrast before release. Avoid pale text over active gradients. Cyan/violet filled buttons use dark text; dark buttons use light text and a visible boundary.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144px. Desktop content maximum approximately 1280px with 32–64px gutters; mobile 20px gutters. Body lines stay around 60–70 characters.

Module corners: 8–16px; small controls: 6–8px. Reserve circular shapes for nodes and ports. Circuit strokes: 1–2px with a 2–3px active core. Glow is a local duplicate stroke, not a full-page filter. Use at most two blurred layers per active module. Focus indicators use a crisp high-contrast outline with an offset.

Photography and screenshots retain truthful content. Crop for composition only when a full-view action remains available. Do not stretch screenshots or replace project evidence with generated mockups. Inspect images for exposed tokens, account details, and irrelevant personal information before publishing.

## 8. Typography

Proposed pairing: Space Grotesk for display headings, Inter for body copy, IBM Plex Mono for concise labels and signal annotations. Use licensed, locally hosted WOFF2 files after confirming their license. Limit initial font loads and weights; system fallbacks must remain attractive.

Hero title: fluid approximately 56–112px desktop, 40–58px mobile. Section titles: 36–64px desktop, 28–40px mobile. Body: 16–18px, line-height 1.55–1.7. Technical labels: 12–13px with moderate tracking. Avoid tiny technical typography for substantive content.

## 9. Website Structure

1. Power-on hero — `#home`.
2. Background and perspective — `#story`.
3. Four connected areas and categorized project explorer — `#work`.
4. Three featured case studies — `#featured`.
5. Education and experience — `#background`.
6. Contact — `#contact`.
7. Quintex game terminal — `#quintex`.
8. Small footer with identity and essential links.

Use one primary document with native anchor navigation. Project details expand inline with stable anchors, preserving context and minimizing routing complexity. The category explorer displays every identified project; featured projects also appear in their category without duplicating their full case study.

### Content inventory and evidence status

Inspected read-only sources: the old repository's HEAD tree, content strings from its compiled JavaScript, `resume.pdf`, `projects/Carlos Mtz-Resume TE.pdf`, and `projects/Carlos_Martinez_Systems_Engineer.pdf`. Its worktree contains only `.git`; use read-only Git blob access to extract content and later copy approved assets into the new project. Do not restore files or change repository configuration. No old CSS, application logic, architecture, or dependencies are to be reused.

| Area | Projects | Evidence and treatment |
|---|---|---|
| Software Development | Circuit Minds; Quintex RPG | Circuit Minds cover, repository, live-demo URL, résumé descriptions; Quintex cover and Unity repository reference |
| AI & Machine Learning | AI Voice Test Agent for Healthcare; ML Market Skills Predictor; Azure ML diabetes model comparison | Voice evidence screenshots and recording; market-skills cover and repository; Azure ML résumé description |
| Embedded Systems & Robotics | Smart House Automation; Robotic AI Agent; Radio Transmitter & Receiver | IoT image; robot image and GIF; résumé descriptions of PIC, circuits, sensors, and analog prototype |
| Cloud & Infrastructure | Distributed Linux Infrastructure; Azure deployment and CI/CD work | Infrastructure cover; Azure screenshots; résumé descriptions of Linux, VMware, Kubernetes, Ansible, LDAP and DNS |

The Azure work includes App Service deployment, pipeline troubleshooting, self-hosted agents, and PR validation. Group related exercises into one case-study collection with individually accessible evidence rather than presenting every screenshot as a separate project. A portfolio cover and ML-house covers also exist but their filenames alone do not establish additional projects; reconcile their content during asset review before adding or excluding a project. One Azure overview image referenced in old copy is absent from the tree; never ship that broken reference.

Known source links:

- Circuit Minds: https://github.com/davidmtzh/circuit-minds and https://circuit-minds-web.vercel.app/
- Voice agent: https://github.com/davidmtzh/pgai-voice-challenge.git
- Infrastructure: https://github.com/davidmtzh/Server-Deployment-Infrasructure
- Robotics: https://github.com/davidmtzh/AI-Autonomous-Agent
- Skills forecasting: https://github.com/davidmtzh/Forecasting-Future-Skills
- Smart house: https://github.com/davidmtzh/Embedded-Smart-Home-Control-System
- Quintex: https://github.com/cmartinez1542/Quintex-RPG/tree/main

These URLs were found in reference content, not all live-verified. Verify destinations during implementation. Do not invent missing demo links or performance metrics.

Confirmed résumé facts: B.S. Computer Science, San Diego State University, May 2025; five semesters of engineering coursework at UABC, 2018–2020; Associate's in Electronics, CBTIS 21, May 2016. Degree wording varies between résumés for the unfinished UABC program; describe it as electronics/electrical engineering coursework, never a completed bachelor's.

User-provided facts supplement the résumés: associate degrees for transfer in Psychology and Computer Science at Imperial Valley College; academic instruction at the school where Carlos earned his electronics qualification; after-school coding instruction at theCoderSchool. No dates will be invented. Nexplore STEM Instructor, September 2024–August 2025, and SDSU systems administration internship, February–May 2025, are résumé-supported. The résumé specifies grades 1–12 at Nexplore; use that more specific wording. Include psychology and client-support experience as context, without implying engineering employment. Case-manager start dates conflict between March and May 2025; omit the disputed month pending confirmation. Do not assume a dated résumé's “Present” remains current.

## 10. Hero Section

Purpose: identify Carlos and establish the electronics-to-software idea immediately.

Composition: name and role at the top, oversized headline offset left, and a wide powered rectangular core spanning the right and lower field. An input trace enters a recognizable AND gate, its output powers the core, and a lower port routes toward the next section. The core uses layered DOM, SVG waveforms, masked horizontal bands, and scanning light. It is an instrument housing, not a conventional content card.

Automatic timeline, approximately 4.5 seconds on desktop:

- 0–0.4s: dark surfaces and faint traces are visible; navigation is usable.
- 0.4–1.1s: input A rises; input B is visibly held high; pulse reaches the AND gate.
- 1.1–1.5s: gate output activates and travels toward the core.
- 1.5–2.2s: core edge and internal waveform power on.
- 2.2–3.2s: headline reveals; name/role were already legible.
- 3.2–3.8s: supporting copy and CTA receive visual emphasis.
- 3.8–4.5s: output trace energizes toward the story boundary; system settles.

Trigger: first page entry; automatic. Technologies: React DOM, CSS, SVG, GSAP. All essential content remains present and accessible; never make a visitor wait to activate navigation or contact. Early scrolling completes the intro safely. A visible skip control completes the timeline. Run once per session, with no repeated full boot on anchor navigation.

Desktop: restrained idle waveform, no full replay. Mobile: 1.5–2s sequence with fewer paths and no pointer motion. Reduced motion: fully powered static state immediately. Transition: a physical trace exits the core's bottom port and remains aligned with the story's incoming port.

## 11. Section 2 — Background as Processing

Purpose: explain how Carlos's education and teaching shape his engineering perspective.

Proposed heading: **A foundation built across disciplines.** Three readable content groups: electronics and physical systems; computer science and software; psychology and teaching. The complete credential timeline follows later, so this section explains connections rather than repeating every date.

Composition: vertical signal spine with three offset content modules. Gates and junctions sit on purposeful branches. Fine background traces support depth without competing with the copy.

Behavior: hybrid scroll progression and short automatic node activations. ScrollTrigger advances the main line: 0–20% entry, 20–40% first node, 40–60% content connection, 60–80% completed reveals, 80–100% outgoing path. Each reached threshold may trigger a 250–450ms automatic pulse; reverse scrolling adjusts line progress without repeatedly hiding readable content.

Trigger: section enters viewport; technologies: SVG, GSAP/ScrollTrigger and CSS transforms. Desktop: slight layer offsets and 0.97-to-1 content settling; no prolonged pinned reading sequence. Mobile: one central or left-hand rail with sequential modules. Reduced motion: static complete path and visible copy. Transition: the single output reaches a prominent distribution node before Section 3.

## 12. Section 3 — Four Areas, One System

Purpose: make the project collection understandable through four areas, rather than asking visitors to decode a flat list of technologies.

The four output modules represent Software Development, AI & Machine Learning, Embedded Systems & Robotics, and Cloud & Infrastructure. Use real project imagery as each area's visual evidence. Each includes a title, a one-sentence description, an accessible project count derived from data, and an **Open projects** control.

Composition: staggered, asymmetrical desktop arrangement around a distribution hub. Software Development is the largest left module; AI sits above-right; Embedded sits lower-right; Cloud anchors the lower-left. Maintain logical DOM order and sufficient text clearance. These are four directory entrances, not a basic 2×2 card grid.

Selecting a category opens an accessible inline folder-style project list below the spatial composition, then optionally expands individual details. Each item supplies summary, technologies, evidence, repository and demo links where verified. No simulated desktop operating system or nested drag windows.

Behavior: hybrid arrival-by-scroll, exploration-by-pointer/focus/tap. Scroll introduces branches and settles modules over 600–900ms; then releases control. Pointer proximity selects a visual branch using bounded distances and hysteresis. Keyboard focus receives the same visual prominence. It never activates links or moves keyboard focus automatically.

Technologies: semantic DOM, Motion for local card emphasis, SVG connections, GSAP entry, and a small lazy-loaded React Three Fiber/Three.js scene for the hub, physical branch depth, and cursor-responsive light. Drei may provide scene helpers. DOM cards stay readable and selectable above the scene; projected anchors synchronize with their ports.

Desktop: camera displacement is tightly bounded, card rotation stays around 2–3 degrees, and active cards advance only slightly. Inactive cards remain legible. Mobile: no WebGL required; vertical folder modules, scroll/tap activation, and sequential SVG branches. Reduced motion: static category panels, no camera drift. Transition: branch outputs rejoin the primary spine and route into featured work.

## 13. Remaining Sections

### Three featured case studies

Proposed choices: **Circuit Minds**, **AI Voice Test Agent for Healthcare**, and **Smart House Automation**. Together they show application development, real-time intelligent systems, and physical computing. These are proposed for range and available evidence, not ranked using invented impact metrics.

Each receives its own substantial section: problem → Carlos's contribution → technical decisions → evidence → lessons/results. Distinguish implemented behavior from future ambitions. Circuit Minds highlights course/enrollment flows and application/API/database integration. Voice testing highlights call flow, streaming, interruptions and recovery tests; avoid clinical-effectiveness claims. Smart House highlights PIC-based sensor/control modules and validation under changing conditions.

Purpose: prove engineering ability. Composition: large screenshot/evidence panel alternating with concise editorial text; contextual stack labels and meaningful source links. Behavior: gentle entry reveal plus user-controlled galleries. Trigger: intersection and explicit controls; technologies: DOM, CSS, Motion, optional GSAP spine. Desktop: two-column evidence layouts. Mobile: stacked text and media, explicit gallery buttons. Reduced motion: immediate content, no animated slide travel. Transition: low-intensity spine enters credentials.

### Education and experience

Purpose: make educational depth and teaching visible. Composition: an education timeline paired with a teaching/engineering experience list. Give completed degrees, coursework, and employment distinct labels. Include Imperial Valley College's two transfer degrees without unverified dates. Honor the user's teaching story without inventing employer dates or job metrics.

Behavior: mostly static; optional once-only node emphasis. Trigger: intersection; technologies: DOM/CSS, minimal Motion. Desktop: two columns; mobile: one readable chronological list. Reduced motion: entirely static. Transition: spine converges on contact. A résumé download uses a deliberately selected version; do not imply that the downloaded file includes every user-supplied addition when it does not.

## 14. Contact Section

Purpose: primary conversion. Heading: **Let's build something useful.** Supporting copy welcomes engineering opportunities and technical collaboration, without claiming unconfirmed current availability.

Composition: a spacious contact module receiving the main signal, with name, email and message fields; explicit labels; submit state; and direct email, GitHub, LinkedIn, and résumé links. Found reference email: `carlos_10david@hotmail.com`; GitHub: `https://github.com/davidmtzh`; LinkedIn: `https://www.linkedin.com/in/carlos-d-martinez-6bb753363/`. Verify these during content review. Do not publish the résumé phone number as an extra on-page contact channel by default.

Delivery architecture: static frontend posting to a configured hosted form endpoint that supports browser submissions and recipient verification. Store only its public endpoint in build configuration; no private API key in the browser. Select/configure the service with Carlos during implementation if no endpoint exists. Direct email and copy-address remain usable independently.

Actual delivery is a launch acceptance criterion. The form requires field validation, honeypot/provider spam controls, pending state, genuine success/failure handling, retry without lost input, and an end-to-end received-message test. Never fake success. If no service can be configured, explicitly label a fallback **Open email draft** and disclose that the direct-send requirement remains incomplete; a mailto action is not equivalent to delivered form submission.

Behavior: form actions plus a brief local confirmation pulse only after confirmed submission. Trigger: input, submit and server response; technologies: DOM, CSS, Motion, fetch. Desktop/mobile: same functionality, large targets, suitable input autocomplete. Reduced motion: static response feedback. Transition: the cable visibly continues below contact into the hidden final output.

## 15. Final Easter Egg / Game Terminal

Purpose: close with a personal creative reward tied to Quintex RPG. Proposed discoverability: lightly foreshadowed in the Software Development folder, fully revealed only after contact.

Composition: original retro monitor and cartridge module, no copied console branding. A cable enters the station; the cartridge uses verified Quintex imagery and a clearly labeled **Insert cartridge** button. Desktop drag is optional progressive enhancement, with identical click and keyboard behavior. Mobile uses tap.

State sequence: unpowered → standby when in view → cartridge available → insertion on explicit activation → brief dark boot → demo/preview → replay/eject. Provide close/stop and mute controls where relevant. No autoplay audio. A user can scroll past freely.

Feasibility evidence: the old portfolio includes `quintex-rpg-cover.png`, a Unity/C# description, and the repository URL, but no web demo or game build. Remote repository inspection was unsuccessful during planning. A playable environment, enemy encounter, and boss sequence are therefore not yet verified.

Implementation decision order: inspect the linked repository and license/assets; integrate an existing viable web build if available; otherwise assess a bounded lightweight scene; otherwise use an accurately labeled scripted preview using real available assets; otherwise provide a cinematic project preview with a polished boot shell. Do not invent boss footage or advertise a static cover as playable gameplay. If only the cover is available, the preview is deliberately modest and includes a repository link; richer game footage/assets remain a visible content dependency.

Technologies: DOM/CSS/SVG shell and GSAP boot; lazy iframe for verified Unity WebGL only when justified; optional isolated R3F scene if actual geometric interaction improves the station. Desktop: button plus optional drag. Mobile: tap, lower-cost preview mode. Reduced motion: no electrical travel, CRT flicker, shake or cinematic camera; direct launch controls. Trigger: viewport powers standby only; explicit action loads heavy content. Transition: cable terminates at a final output node beside the footer.

## 16. Circuit System Architecture

Create a shared circuit vocabulary: port, trace, junction, gate and pulse. Each section owns local SVG coordinates, while a layout coordinator aligns outgoing/incoming ports in shared gutters. Use ResizeObserver after fonts and media settle; batch geometry work and never measure every scroll frame. ViewBox coordinates and named ports support breakpoint-specific route maps.

Each trace has a faint base path, active path and optional localized pulse. Use path length/dash progress and sampled positions from the same geometry; a pulse must not drift off its energized trace. Small overlaps at section boundaries avoid seams. Decorative overlays are pointer-transparent and hidden from assistive technology.

Animation state expresses idle, receiving, active and complete. Keep frequently changing animation values in refs/motion values, not React state updates at frame rate. Content visibility and navigation never depend on a successful animation callback.

## 17. Logic Gate System

Use recognizable AND and OR shapes only where their role is clear. The hero AND gate has one steady enable input and one arriving signal; output rises only when both are high. A story OR gate may combine alternate education/teaching paths where either can energize an output. Distribution is a junction, not a falsely labeled logic gate. Add NOT/XOR only if their actual truth-table behavior has a meaningful role; do not force every available symbol into the design.

Gate glow represents state. Label essential meaning in adjacent text. Decorative gates do not claim to simulate a real complete electrical circuit.

## 18. Interaction & Motion Architecture

Each major section's purpose, composition, trigger, mode, technologies, desktop/mobile/reduced-motion treatment and outgoing transition are defined in Sections 10–15.

Ownership: GSAP owns cinematic sequences and SVG path progress; ScrollTrigger owns scroll mapping; Motion owns local hover/focus/layout feedback; R3F owns camera/light geometry. Separate transform wrappers when libraries affect the same visual object. Avoid two systems writing the same transform. Clean up GSAP contexts, listeners, observers, animation frames and WebGL resources on unmount.

Timing language: 150–220ms control feedback; 300–500ms module response; 600–900ms section arrival; roughly 4.5s one-time hero boot. Use restrained ease-out settling; no elastic wobble for large surfaces. Approximately 80% DOM/CSS/SVG motion and selective 20% spatial effects is a creative balance, not a requirement to spend a fixed rendering budget.

## 19. Automatic Animation Behavior

Run the hero intro once per session. Respect early scroll, skip, restored scroll position and reduced motion. Short gate pass-through sequences are automatic after thresholds, with guards against repeated triggering around a boundary. Pause idle motion when offscreen or the document is hidden. Contact animation requires a real response; the game boot requires explicit launch.

## 20. Scroll Behavior

Native document flow, no forced chapter changes or mandatory scroll traps. Integrate Lenis only after the complete site works with native scrolling. Synchronize Lenis with the GSAP ticker and ScrollTrigger updates using the installed versions' documented APIs. One animation clock; avoid double requestAnimationFrame loops. Native scrolling on touch and reduced-motion configurations is the default. Anchors, focus scrolling, browser restoration and mobile address-bar resizing must continue to work.

## 21. Cursor / Mouse Behavior

Pointer response is concentrated in Section 3. Normalize input relative to its bounds, interpolate bounded movement, and suspend outside the viewport. Focus/tap can select the same active module. Pointer proximity does not open folders, launch the game or select navigation. Reset to neutral on pointer exit. Respect coarse-pointer devices and mixed-input devices; do not infer input solely from viewport width.

## 22. 3D Strategy

Before each effect, compare CSS/SVG/GSAP with actual 3D. Hero and story require no WebGL. Section 3 uses real depth for the branching hub and lighting, while essential project text remains in DOM. The terminal can use CSS perspective unless geometry materially improves insertion.

Use a small scene, limited materials, no default bloom/postprocessing, capped device pixel ratio and visibility-aware rendering. Lazy-load Three/R3F/Drei separately. WebGL unsupported/context-loss modes show the same functional DOM modules with SVG branches. A failed scene cannot block a project link. Do not put the entire website inside one canvas.

## 23. Mobile Behavior

Design at 360–430px first for readability, then compose tablet and desktop variants. Short hero; simplified continuous trace; stacked story; sequential category folders; full-width project evidence; readable credentials; easy-to-use form; tap-to-insert game. No hover-only text or actions. Preserve scroll position when folders open. Avoid horizontal page overflow and screen-height assumptions. Use responsive images and appropriate touch target spacing.

## 24. Reduced Motion

Honor initial preference and changes during the session. Show the hero fully powered, all essential content visible, complete static traces, no continuous wave/pulse motion, no parallax, no pointer camera movement, and immediate folder changes. Game preview remains optional; users may explicitly start media, with clear stop controls. If additional motion controls are offered, the operating-system preference supplies the safe initial state.

## 25. Accessibility

Semantic landmarks, one h1, logical headings, skip link, visible focus, native links/buttons, accessible form labels/errors and polite submission announcements. Folder controls expose expanded state and associated panels. Image viewers or modals, if used, require focus containment, Escape dismissal and focus restoration. Maintain at least WCAG AA contrast goals and approximately 44px touch targets. Circuit glows are not status text. No flashing electrical effects. Full keyboard access reaches every project and cartridge control. Test 200% zoom, narrow reflow and screen-reader form announcements.

## 26. Technical Architecture

Independent React + Vite frontend using GSAP/ScrollTrigger, Motion for React, Lenis, Three.js, React Three Fiber and selected Drei helpers. Inspect the existing `new-site` starter before edits; preserve unrelated user work. Install mutually compatible versions and record a lockfile after approval. No old app runtime code is carried over.

Use structured content modules with project IDs, category, featured flag, descriptions, contributions, evidence assets, source links and verification status. Do not silently publish draft or unverified metrics. The contact provider is the only planned external delivery dependency; core browsing has no private API-key requirement. New asset paths never reference `/old-portfolio` or `/React-Portfolio`.

## 27. Component Structure

```text
new-site/
  BUILD-PLAN.md
  src/
    components/
      Navigation/ Hero/ Circuit/ Story/ SpatialCards/
      ProjectExplorer/ FeaturedProjects/ Background/
      Contact/ GameEasterEgg/ Footer/
    three/
      OutputScene.jsx CameraRig.jsx CircuitLines.jsx Lighting.jsx
    hooks/
      useReducedMotion.js useViewport.js useCircuitPorts.js
    content/
      profile.js projects.js education.js experience.js
    styles/
      tokens.css global.css
    assets/
      projects/ portraits/ fonts/
    App.jsx
    main.jsx
  public/
    resume/ media/
```

Keep optional game build files in a separately lazy-loaded public directory only after checking feasibility and weight. Add components when their responsibility is real, not to satisfy a file-count target.

## 28. Performance Strategy

Targets, to be measured rather than claimed: LCP at or below 2.5s, CLS below 0.1, and INP at or below 200ms under representative conditions. Aim for a light initial route; keep Three and the game out of its critical bundle. Prioritize the hero's typography and code-generated visual, not a heavy background asset.

Optimize selected images to responsive WebP/AVIF where appropriate; set dimensions; lazy-load below-fold media. Review whether the robot GIF should become a smaller video. Serve game/media only after intent. Cap canvas DPR around 1.5, lower on constrained devices. No idle scene rendering when not needed, no excessive filter stacks or particles. Profile actual scroll/frame behavior on mobile. Report measured conditions with any results.

## 29. Vercel Deployment

Use `new-site` as the Vercel project root, a Vite production build, and `dist` output. Use production-safe asset URLs and native fragment routes. No localhost references, no Hostinger setup, no private keys in client environment variables. Configure the public form endpoint separately and verify its production-origin policy.

Validate preview deployment before production: fresh navigation, anchor links, downloads, images, lazy chunks, form errors/success and game fallback. Review external-link failures instead of assuming old URLs remain live. Metadata includes title, description, favicon and social image; add canonical URL only when the real domain is known. Publication follows the user's deployment authorization; approving this plan alone authorizes building, not an unrequested public launch.

## 30. Build Sequence and Acceptance

1. Obtain explicit approval of this document.
2. Inspect the new starter, inventory its current work, and establish compatible dependencies.
3. Finish image review, source-link verification and Quintex feasibility inspection; record concrete outcomes.
4. Copy only selected content assets from Git blobs into the new project, preserving the old repository untouched.
5. Build content data, typography, semantic navigation and responsive layouts.
6. Build hero core, circuit primitives and the one-time power-on timeline.
7. Align the hero/story ports and implement story signal progression.
8. Build the four-folder explorer and staggered desktop composition.
9. Add the bounded spatial hub and pointer/focus branch activation with mobile and WebGL fallbacks.
10. Build three evidence-led case studies plus complete categorized archive.
11. Build education, teaching and experience sections with honest source distinctions.
12. Build and configure the contact form; verify actual delivery before calling it complete.
13. Build terminal/cartridge interaction and the best verified game mode; label preview versus play accurately.
14. Add optional Lenis integration, then finish motion preferences and cleanup.
15. Verify keyboard navigation, zoom, forms, reduced motion, touch, WebGL failure and slow assets.
16. Run production build/lint and targeted interaction checks; verify desktop and mobile layouts visually.
17. Check that all discovered projects are represented or explicitly resolved, all primary actions work, and all content/asset references are independent of the old folder.
18. Prepare Vercel preview and deployment notes; report unresolved external configuration or asset requirements candidly.

Approval confirms the creative direction, four categories, proposed three featured projects, inferred mission, motion intensity varying by section, and teased-after-contact game strategy. Missing dates may remain omitted. Game mode and contact delivery cannot be claimed complete until their evidence/configuration requirements are satisfied. No website build begins before explicit approval.
