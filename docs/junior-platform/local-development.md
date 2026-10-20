# Local development guide

The clients are intentionally independent: running one does not reserve ports or start another.

## Web

```bash
npm --prefix apps/junior run dev
```

The current Web application owns the compatibility server and defaults to its existing port. Run `npm run junior:check` from the repository root before publishing.

## WeChat Mini Program

1. Open `apps/wechat-miniapp` in WeChat DevTools.
2. Use the test AppID for local layout work, or replace `touristappid` in your private DevTools configuration.
3. Keep the production AppID in `project.private.config.json`; that file is ignored by Git.
4. Add the production HTTPS API origin to the WeChat request-domain allowlist before enabling live calls.

The checked-in shell runs its four-round demonstration without a server. `miniprogram/config/env.ts` is the only place the non-secret public API origin should be selected.

## iOS and Android

```bash
pnpm install
pnpm --filter @argumentor/mobile dev
```

Press `i` or `a` in the Expo terminal, or use the explicit `ios` and `android` scripts. `EXPO_PUBLIC_API_BASE_URL` may contain a public API origin only; secrets belong on the service.

The checked-in app uses an in-memory practice repository. Stage 1 replaces it with encrypted device storage, then Stage 3 adds optional sync.

## Shared contracts

```bash
pnpm --filter @argumentor/junior-contracts typecheck
pnpm --filter @argumentor/junior-contracts test
```

Any breaking contract change must update `services/junior-api/openapi.yaml` and all three clients in the same pull request. Add a new `/api/v2` route rather than silently changing an already released mobile contract.
