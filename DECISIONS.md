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


## worker: Redesigned board as pixel-art claim flow, wired SMS-on-post via AWS
- **Did:** Removed the per-item location/description fields and search bar, replaced the details-modal claim flow with an inline "Claim this?" confirm + Claimed section, added an optional "I think it might be ___" + phone number field on Add a find that texts the guessed owner immediately, and did a full pixel-art (Silkscreen/VT323) mobile-first visual redesign matching /Users/viraat/code/lendy's style.
- **Interfaces:** Public web app: https://sharonlostandfound.viraat.dev; API: POST /api/notify (now backed by AWS End User Messaging / SNS SMS, not Twilio).
- **Note:** SMS sending is fully wired (env vars set on Vercel for all environments) but AWS reports the origination toll-free number (+18773188077) is still `PENDING` carrier verification (`RESOURCE_NOT_ACTIVE`). No code changes needed once AWS approves it — texts will start sending automatically.
- **Delivery:** deployed; web; target=sharonlostandfound.viraat.dev; revision=6b4c35c; verifiedAt=2026-09-11T00:00:00Z; checks=3
- **By:** worker · 2026-09-11
