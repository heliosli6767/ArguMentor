# Delivery roadmap

## Stage 0 — scaffold (this change)

Repository boundaries, portable contracts, WeChat shell, shared iOS/Android shell, API contract, security rules and architecture checks.

## Stage 1 — offline parity

Move the 50 motions and eight lessons into a versioned content package. Generate platform-native bundles. Implement demo debate, briefing, learning progress and review locally on all three shells. No account is required.

## Stage 2 — remote practice API

Extract the live turn and transcription routes behind `/api/v1`. Add device-safe sessions, request IDs, quotas, content moderation and contract tests. Keep provider keys only on the service.

## Stage 3 — parent account and sync

Add parent authentication, child profiles, encrypted progress sync, export/delete and conflict resolution. Link WeChat/Apple/Google identities to the parent record rather than creating separate learner histories.

## Stage 4 — distribution

Register the WeChat Mini Program and HTTPS request domains; configure Apple/Google signing, privacy manifests, age ratings, store metadata and release channels. Run child-safety, accessibility, low-network and device-matrix QA before release.

## Stage 5 — optional native capabilities

Add reliable push-to-talk, background-safe upload, parental reminders and subscription/payment adapters only after the core learning loop is stable. Payment logic remains platform-specific; entitlements are server-authoritative.
