# Content and asset provenance

## Read-only reference

Content was inspected with Git `show` and `ls-tree` against old-portfolio HEAD. Its worktree was not restored, checked out, or edited. No old CSS, compiled app code, components, architecture, or dependencies were reused. Human-readable content strings were extracted from its compiled bundle only as factual reference.

Resume sources: `resume.pdf`, `projects/Carlos Mtz-Resume TE.pdf`, `projects/Carlos_Martinez_Systems_Engineer.pdf`. The downloadable resume is an unchanged copy of the first file. Dates omitted in the new site were not invented.

Carlos supplied Imperial Valley College's psychology and computer-science transfer degrees, theCoderSchool instruction, and high-school academic instruction in the interview. The on-page story combines these with verified resume facts. UABC is presented as five semesters of coursework, not a completed degree. No ongoing employment status, inflated outcomes, or unverified performance percentages are asserted.

## Selected local assets

Project covers for Circuit Minds, smart house, robotics, skills forecasting, infrastructure, and Quintex were copied and converted to WebP. These are presentation illustrations, not necessarily actual interface captures; they are not represented as proof of production usage. The ML-house image is an evaluation chart. The Azure storefront is a screenshot from the reference evidence collection. The example call recording is copied unchanged and never auto-plays.

`public/media/ml-house.webp` comes from `projects/ml-house-cover.png`; its actual/predicted chart supports a modest archive entry, without asserting evaluation metrics or repository availability. The old React Portfolio is represented as a separate archive project. Duplicate covers, unreferenced portraits and unusable image references are excluded from shipped assets.

## Repository checks

GitHub API confirmed public repositories for Circuit Minds, pgai-voice-challenge, Forecasting-Future-Skills, Embedded-Smart-Home-Control-System, AI-Autonomous-Agent, and Quintex-RPG. The infrastructure source URL returns a moved-permanently response; the existing public link is retained. Circuit Minds' live URL could not be verified with the web fetch tool and remains the URL supplied by the reference portfolio. LinkedIn and the email address are reference-provided, not independently identity-verified.

## Quintex assets

Source: https://github.com/cmartinez1542/Quintex-RPG on main.

- `public/game/warrior.png`: `Assets/Sprites/Tiny Swords/Tiny Swords (Update 010)/Factions/Knights/Troops/Warrior/Blue/Warrior_Blue.png` (Tiny Swords sprite, present in Carlos's project).
- `public/game/enemy.png`: `Assets/Animations/EnemyAnimation/Torch_Red.png`.
- `public/game/boss.png`: `Assets/Sprites/BossSprite.png`.

The repository includes Tutorial_Level, Boss_Level and other Unity scenes and an Android APK, but no ready WebGL build was found. The source README describes collaborative development, sprite animation, combat/dialogue/quest scripting and future demo plans. The browser preview is an original lightweight scene around these existing sprites, not a port. Asset ownership/third-party licenses remain those of their respective creators; no new ownership is claimed.

## Typography

Space Grotesk variable TTF from Google Fonts' official repository, locally hosted. SIL Open Font License included at `public/fonts/OFL.txt`. Body copy uses the same family; technical labels use system monospace, limiting additional downloads.
