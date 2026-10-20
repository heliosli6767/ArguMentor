# iOS release boundary

- Bundle ID: `app.argumentor.junior` (placeholder until the owner confirms the Apple account).
- Configure microphone and speech-recognition usage descriptions before enabling voice.
- Add Apple privacy manifest entries for every included SDK.
- Use Sign in with Apple if another third-party sign-in is offered.
- Keep subscriptions in StoreKit and resolve entitlements on the server.
- Run iPhone SE through current large-screen iPhone and iPad accessibility QA.

Generate `ios/` with Expo prebuild only when native configuration is required; generated native files are build artifacts, not a second product codebase.
