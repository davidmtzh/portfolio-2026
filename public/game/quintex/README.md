# Quintex RPG — portfolio campaign demo

## Delivery status

Exported with Unity 6000.6.2f1 and exercised in the Chromium-based Codex browser on Windows on October 6, 2026. The delivery is **Builds/quintex-web-demo-red-knight**; use **Builds/quintex-web-demo.zip**, not the older green-character exports. This is a local browser-tested build, not a deployed Vercel site. See the test scope and limitations below.

## Included game

The existing Quintex start screen leads to Tutorial_Level. Both ROCK and WIND selections use BryanScene's existing **Player 3** gameplay components and its first-player **red knight** setup (`Player` Animator controller and `Warrior_Red` sprite), with both abilities. The base prefab's `Player3` controller is the green character and is deliberately replaced by BryanScene's normal first-player assignment. Complete the tutorial's existing floor-button sequence, open its door, and cross the gate to enter BryanScene. BryanScene's exit returns to the start screen. Scene geometry, enemies, puzzles and effects remain authored content. The tutorial spawns the same Player 3 prefab; BryanScene uses its existing placed player without spawning a duplicate.

The browser wrapper provides Play, pause/resume, restart, fullscreen, health/energy and touch controls. It preserves the native start screen and campaign. Missing ability audio references are filled from the project's existing sound effects. No new character art is used.

## Controls

| Action | Desktop | Touch |
| --- | --- | --- |
| Move / face | WASD / arrows | Left stick |
| Sword | Space | Sword |
| Wind | Q | Wind (hold to repeat when ready) |
| Rock smash | E | Rock |
| Dash | Shift | Keyboard only |
| Recharge energy | C (hold) | Charge (hold) |
| Pause / resume | Esc or Pause / Resume | Pause / Resume |
| Restart | Restart / Return to start | Same buttons |
| Fullscreen | Top-right fullscreen | Where supported |

Click Play before selecting a path. Keyboard controls belong to the focused game canvas. Clicking outside the game or hiding the tab pauses gameplay and audio; resume explicitly. Restart returns to the native start screen. Touch controls allow movement and attacks together. Native ability costs, timing and animations are retained. Player 3 does not have the separate canonical animation prototype's jump or paired-burst controller.

## Vite React portfolio integration

Copy the **contents** of the extracted build to public/game/quintex/. The resulting siblings must be index.html, Build/, TemplateData/ and this README; do not add an extra enclosing folder.

Keep the portfolio's cartridge insertion, loading sequence and expanding monitor. Mount this iframe when that existing flow is ready to load the game:

```jsx
<iframe
  ref={iframeRef}
  src="/game/quintex/"
  title="Quintex RPG playable demo"
  allow="fullscreen; gamepad"
  allowFullScreen
  style={{ width: '100%', aspectRatio: '16 / 9', border: 0, display: 'block' }}
/>
```

Unity posts `{ type: 'quintex:ready' }` to the same-origin parent when loading finishes. Validate `event.origin === location.origin` and `event.source === iframeRef.current.contentWindow` before dismissing the portfolio's loading overlay. The visitor must still press the iframe's **Play** button to unlock audio and gameplay. Remove any portfolio pointer-blocking overlay after the monitor animation. No automatic Play message is needed.

All build asset paths are relative. Keep the trailing slash in /game/quintex/. Do not attach keyboard-forwarding handlers to the surrounding website. If adding an iframe sandbox, scripts and same-origin execution must be allowed. The wrapper fits a 16:9 landscape area; portrait windows letterbox it.

## Static hosting on Vercel

This build uses **gzip with Unity decompression fallback**. `.unityweb` files must be served as ordinary static bytes: **do not set Content-Encoding: gzip for these files**. The Unity loader decompresses them. No custom MIME types or compression headers are required. No COOP/COEP headers, SharedArrayBuffer or cross-origin isolation are needed; WebAssembly threads are disabled.

Vercel's normal Vite static-file handling is sufficient. Custom SPA rewrites must not return the portfolio index for existing /game/quintex/Build/* or TemplateData/* assets. Optional revalidation configuration, merged into the portfolio's root vercel.json:

```json
{
  "headers": [
    {
      "source": "/game/quintex/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

Build assets have content-based filenames to prevent browsers mixing files from different exports. Keep index.html revalidated. Browser Unity data caching is enabled. External debug symbols are included for error diagnostics and are not part of the normal initial download. HTTPS is supplied by Vercel.

## Rebuild

Requires **Unity 6000.6.2f1 (770e33f6875c)**, Web Build Support, an activated license and the existing project packages.

```powershell
powershell -ExecutionPolicy Bypass -File Tools/Build-WebDemo.ps1
```

The script copies the project to Builds/_unity_workspace so the primary editor can stay open, omits editor AI packages from that copy, exports into Builds/quintex-web-demo-red-knight, and creates Builds/quintex-web-demo.zip. The ZIP contains index.html at its root. Re-test after rebuilding; successful export alone does not confirm playability.

The builder explicitly includes only Quintex_Start, Tutorial_Level and BryanScene. It temporarily removes unrelated asset-pack Resources folders from automatic inclusion and restores their paths afterward. Settings: IL2CPP, Low managed stripping, single-threaded WebAssembly, WebGL 2, gzip fallback, 128 MB initial / 1024 MB maximum memory, QuintexCampaign template. Canvas resolution caps device pixel ratio at 1.5. Gameplay runs at 60 FPS, pause reduces to 10 FPS, background execution is disabled.

Logs: Logs/quintex-web-build-red-knight.log (delivery build), Logs/quintex-web-build.log (script rebuilds); export summary: Builds/quintex-build-report.txt. Quintex.Slice.Editor.CampaignVerification.Run is an automated Play Mode integration check in an isolated editor: both menu selections, one Player 3 with the red knight Animator, movement, ability creation, pause/resume, button sequence, locked/open gate behavior, BryanScene and restart. Its latest 44-pass report is Logs/quintex-campaign-verification.txt.

Serve the exported files over HTTP, not file://:

```powershell
python Tools/serve_web_demo.py
```

Open http://localhost:8766/game/quintex/. The server root supplies a parent iframe and an external text field for focus testing. Optional ?qa=1 adds read-only Web Audio peak measurements on the canvas; normal visitors do not incur this instrumentation. Canvas data-state reports real Unity scene/player state for regression checks.

## Tested browsers and known limitations

The automated Unity integration check passed for both menu selections, movement, wind projectile creation, rock casting/recovery, pause/resume, locked gate blocking, the authored button sequence, transition to BryanScene with one Player3, and restart. This check invokes the real button trigger callbacks and moves the player across the gate; it is not a manual level playthrough.

Browser checks on the final red-knight export: loading under /game/quintex/, Play gate, native start menu, tutorial entry, visibly correct red knight and Player Animator, keyboard movement/dash, wind and rock casts, rock recovery, energy/cooldown feedback, pause/resume and restart. Actual Web Audio output was measured after Play (peak 0.41485). No Unity runtime error was reported during these checks.

The preceding export with identical wrapper/combat code was also tested inside a parent iframe: external text input accepted game-control letters, a responsive landscape layout exposed the virtual joystick and ability buttons, joystick input moved the player, and touch-style Wind/Rock clicks cast both abilities. Sword damage destroyed the tutorial's wooden barrier and rock damage destroyed its stone barrier. The final change assigns BryanScene's first-player red knight artwork/Animator; the 44 automated integration checks were rerun after that change.

Known verification limits: no complete manual browser playthrough of both levels, and wind-versus-enemy damage was not separately measured in the browser. The gate sequence and BryanScene transition were checked by the real-scene automated integration test described above. Physical iOS/Android devices and Safari/Firefox are unverified; desktop responsive testing is not physical mobile testing. Existing tutorial scripts emit nonfatal static-Rigidbody2D velocity warnings. The iframe test also recorded an unattributed MutationObserver console error without interrupting gameplay; the game template does not use MutationObserver. No saved progress or multiplayer is included. Both requested authored levels are retained, so this is larger than a single training courtyard.
