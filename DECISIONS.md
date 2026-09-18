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

## worker: Corrected SMS delivery claim, switched to Twilio, submitted carrier registrations
- **Did:** The earlier "confirmed delivered" claim for AWS SNS was wrong — Publish succeeding only means AWS accepted the request, not that a carrier delivered it. Pulled CloudWatch delivery logs and found every send failing with "No origination identity available to send to destination number." Root cause: the AWS toll-free number's verification was an unsubmitted draft, not "pending AWS review" as assumed.
- Filled in and submitted both AWS's toll-free registration (US_TOLL_FREE_REGISTRATION, status SUBMITTED) and Twilio's toll-free verification (status PENDING_REVIEW) using Exla's business info (2 Embarcadero Center, San Francisco; exla.ai) — registration/case IDs and the EIN are in the respective AWS/Twilio consoles, not committed here. Twilio's stated turnaround is 24-72hrs, typically faster than AWS.
- Switched src/lib/sms.ts from AWS SNS to Twilio (toll-free +18884233613; account/API key credentials live only in Vercel env and .env.local, not in git), and made it actually poll the message status for a terminal state (delivered/undelivered/failed) before reporting success, instead of trusting the initial "queued" response — this is what caused the earlier false positive.
- **Note:** Texting will not work for anyone until Twilio's (or AWS's) toll-free verification is approved. No code changes needed once approved.
- **By:** worker · 2026-09-11

## worker: Fixed both carrier rejections — business identity mismatch was the real cause
- **Did:** Both AWS's toll-free registration and Twilio's toll-free verification were REJECTED (not just pending as previously assumed). Root cause: both were filed under "Exla" business info, but exla.ai is the landing page for an unrelated product ("Libra", an AI on-call/observability tool) with zero mention of Sharon Lost + Found — carriers couldn't verify the business behind the messaging program.
- Re-filed both as sole proprietor "Viraat Das" with business website pointed at https://sharonlostandfound.viraat.dev directly (matches what's actually being verified). Twilio: back to PENDING_REVIEW → IN_REVIEW. AWS: version 2 was instantly denied for a separate reason (missing required `privacyPolicyUrl`/`termsAndConditionsUrl` fields that didn't exist in the form back in June); added `/privacy` and `/terms` pages to the site and resubmitted as version 3, now REVIEWING.
- **Note:** Even once carrier review clears, the AWS account is still in the SMS/MMS sandbox (separate restriction, needs a manually-filed AWS Support case — this account's Basic support plan has no API access to file one). Twilio would need a paid-account upgrade for the same reason. Neither texting-arbitrary-numbers path is fully unblocked yet even after these resubmissions.
- **By:** worker · 2026-09-18
