# Decisions

Shared, agent-authored log of cross-cutting decisions the fleet must honor. The conductor records plan/rebase/steer decisions here; workers record interface contracts + adjustments. Each entry is a `##` heading with **What / Why / By** so it scans. Re-read before each significant step; jj merges concurrent edits as first-class conflicts on fan-in.

## worker: Built and deployed Sharon Lost + Found.
- **Did:** Built and deployed Sharon Lost + Found.
- **Interfaces:** Public web app: https://sharonlostandfound.viraat.dev; optional API: POST /api/notify
- **Delivery:** verified; web; target=sharonlostandfound.viraat.dev; revision=0436638; verifiedAt=2026-09-11T18:00:30Z; checks=5
- **By:** worker · 2026-09-11T18:00:34.137Z

## worker: Replaced the hero with the user-provided photo gallery and
- **Did:** Replaced the hero with the user-provided photo gallery and redeployed.
- **Interfaces:** Public photo gallery: https://sharonlostandfound.viraat.dev
- **Delivery:** deployed; web; target=sharonlostandfound.viraat.dev; revision=cc3ecb6; verifiedAt=2026-09-11T18:05:37Z; checks=4
- **By:** worker · 2026-09-11T18:05:42.906Z

