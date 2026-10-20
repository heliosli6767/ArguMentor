# ArguMentor Junior mobile

One Expo/React Native shell for both iOS and Android. It mirrors the Junior learning flow while keeping native navigation, permissions and store requirements inside this app.

Routes are scaffolded for the practice hub, learning hub, motion library, briefing, four-round debate, review and parent area. The included content and session repository are offline placeholders; production content comes from the shared catalog and live practice goes through `services/junior-api`.

```sh
pnpm --filter @argumentor/mobile dev
pnpm --filter @argumentor/mobile ios
pnpm --filter @argumentor/mobile android
```

Do not place provider keys in Expo public configuration. See `platforms/ios/README.md`, `platforms/android/README.md` and `docs/junior-platform/`.
