# Verification record

Date: 2026-10-20.

## Automated and HTTP

- TypeScript check and Vite production bundle.
- Twelve Node tests: original ArguMentor four-turn state progression; demonstration side and scoring boundaries; grounded quotes; bounded request validation; actual Argdown support/attack parsing including sanitized input; gradual assessed progression; rejection of empty/heading-only diagrams; eight-lesson coverage; round-specific coaching; pre-debate model cases; session-to-drill recommendations.
- HTTP root returned 200.
- `/api/status` reports no provider when no key is configured, without leaking secrets.
- Live turn without a key returned 503 with an actionable message.
- Unknown topic returned 400.
- Cross-origin turn returned 403.

## Browser walkthrough

- Homepage, setup modal, vocabulary, position selection.
- Four complete demonstration turns, with stage changes and per-turn feedback.
- Completion review showed all four speeches and computed word count; no invented model scores.
- Argdown graph rendered with nine nodes and support/opposition connections; editor opened and successfully reparsed the full session.
- Refresh retained the completed practice and selected a new recommended topic.
- Topic search for “AI” returned the Level 5 writing topic.
- Narrow-screen menu and topic search worked; measured 391 CSS pixels with no document horizontal overflow. A 520 CSS pixel layout was also checked.
- Desktop screenshot checked for composition. Instructional text contrast and sizes were then increased.
- Learning Hub, annotated lesson, pre-debate briefing, case planner, four round-specific coach panels, skill coverage and the recommended-lesson handoff were walked through in the browser.

## Not yet verified

- No model API key was available. Actual provider authentication, billing/quota, model output quality, and live end-to-end responses were not tested.
- Microphone and spoken playback were not exercised; permission and browser support must be tested by the user.
- The private hosted edition is static and intentionally demonstration-only. Live model routes run on the local Express server.
- No persistent server database or cross-device sync in this version.

## Multi-platform scaffold

- Repository architecture check passed: all required Web, WeChat, mobile, shared-contract, API-contract and decision-document paths exist.
- Client secret scan passed for all three product shells.
- Shared Junior contracts passed TypeScript and Node contract tests.
- The existing Web shell passed all twelve learning/debate tests and produced a Vite production build after adopting the shared `Side` contract.
- The WeChat and Expo shells are offline-first scaffolds. Full native compilation remains a release-stage check because WeChat DevTools, Expo dependencies, AppIDs and signing accounts are not configured in this workspace.
