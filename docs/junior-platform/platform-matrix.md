# Platform ownership matrix

This matrix answers the practical question “where should this code live?” before a feature is added.

| Capability | Web | WeChat Mini Program | iOS / Android | Shared or server owner |
|---|---|---|---|---|
| Page navigation | React state/router in `apps/junior` | Native page stack and tab bar | Expo Router | Each shell |
| Motion and lesson identifiers | Read-only consumer | Read-only consumer | Read-only consumer | `packages/junior-contracts`; Stage 1 content package |
| Debate phases and DTOs | Import | Generate/copy typed projection | Import | `packages/junior-contracts` |
| Offline demonstration | Browser adapter | `store/session.ts` | `src/storage/session.ts` | Same pedagogical rules, native persistence |
| Live opponent and review | HTTP client | `wx.request` | `fetch` | `services/junior-api` → `packages/agents` |
| Speech input | Web Speech / upload adapter | Recorder Manager / upload adapter | `.ios.ts` and `.android.ts` adapter | Transcription endpoint; no provider key in clients |
| Progress storage | localStorage, later sync | WeChat storage, later sync | encrypted device storage, later sync | Sync endpoint is server-authoritative |
| Parent login | Web identity | `wx.login` code exchange | Apple/Google/email sign-in | Parent identity service; child is a profile |
| Payments | Web checkout if enabled | WeChat payment adapter | StoreKit / Google Play Billing | Server entitlement ledger |
| Analytics | Browser adapter | WeChat adapter | Native adapter | Shared event names, privacy filter |
| Design language | CSS tokens | WXSS tokens | React Native tokens | Semantic names shared; components remain native |

## Feature placement checklist

1. Put domain names, DTOs and route constants in `packages/junior-contracts`.
2. Put deterministic debate rules in `packages/debate-core`.
3. Put model prompts and provider orchestration in `packages/agents`, reachable only through a trusted service.
4. Put network endpoints, authentication, quotas and retention enforcement in `services/junior-api`.
5. Put permissions, navigation, storage and rendering inside the relevant product shell.
6. Never import from `apps/*` into `packages/*`, and never place an AI-provider secret in a client package.

## Release units

- Web deploy: `apps/junior` → root `dist` → private Sites deployment.
- WeChat upload: `apps/wechat-miniapp` → WeChat DevTools → review/release channel.
- iOS build: `apps/mobile` + `platforms/ios` policy → EAS/App Store Connect.
- Android build: `apps/mobile` + `platforms/android` policy → EAS/Play Console.
- API deploy: future implementation of `services/junior-api`, versioned independently behind `/api/v1`.
