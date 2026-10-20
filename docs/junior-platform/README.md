# ArguMentor Junior multi-platform architecture

This is the map for evolving the current child-focused Web product into Web, WeChat Mini Program, iOS and Android without duplicating the teaching system.

## Repository map

```text
argumentor/
├── apps/                              # Level 1: product shells
│   ├── junior/                        # Web: current production React/Vite app
│   │   ├── src/                       # Web views, browser voice, local history
│   │   └── server.ts                  # Current compatibility API host
│   ├── wechat-miniapp/                # WeChat native Mini Program
│   │   ├── miniprogram/
│   │   │   ├── pages/                 # home/learn/topics/briefing/debate/review/profile
│   │   │   ├── services/              # wx.request transport only
│   │   │   ├── store/                 # local session/progress state
│   │   │   ├── data/                  # generated offline starter content
│   │   │   └── styles/                # WeChat token projection
│   │   └── project.config.json
│   └── mobile/                        # Expo/React Native shared app
│       ├── app/                        # Expo Router routes
│       ├── src/                        # components, services, storage, theme
│       └── platforms/                  # iOS and Android build notes/overrides
├── packages/                          # Level 2: platform-neutral product logic
│   ├── junior-contracts/              # DTOs, phase IDs, API route constants
│   ├── debate-core/                   # Existing debate state machine
│   ├── agents/                        # Existing opponent/judge/coach/research
│   └── ui/                            # Existing shared brand primitives
├── services/                          # Level 3: trusted server boundaries
│   └── junior-api/                    # OpenAPI and backend extraction target
├── docs/junior-platform/              # Level 4: decisions and delivery guides
├── tools/                             # Architecture/security checks
└── .openai/hosting.json               # Existing private Web deployment only
```

## Dependency rule

Dependencies point inward:

```text
Web / WeChat / iOS / Android
            ↓
      junior-contracts
            ↓
        debate-core

All remote AI and transcription calls
            ↓
        junior-api
            ↓
      agents / providers
```

Product shells may depend on packages and the HTTP API. Shared packages must never import a product shell. Clients must never contain provider keys. Platform-specific microphone, storage, login and payment code stays inside its app.

## Current versus target

| Area | Current source of truth | Target |
|---|---|---|
| Web teaching UI | `apps/junior` | Keep as Web shell |
| Topic and lesson content | `apps/junior/src` | Move gradually to a versioned content package after all clients can consume it |
| Debate state | `packages/debate-core` | Shared by Web/mobile; server-authoritative for live sessions |
| Transport types | Duplicated in Web | `packages/junior-contracts` |
| AI/transcription | `apps/junior/server.ts` | `services/junior-api` behind `/api/v1` |
| Progress | Per-browser localStorage | Per-device adapter now; optional account sync later |
| Authentication | Private Site/browser | Parent account plus child profiles; WeChat and Apple/Google identities link to the parent |

## Non-goals of this scaffold

This change creates buildable product shells and contracts; it does not register a WeChat AppID, Apple bundle, Google Play application, domain allowlist or production API. Those actions require the owner's developer accounts and legal/privacy choices.

Read next: [platform ownership matrix](platform-matrix.md), [platform boundaries](platform-boundaries.md), [data and security](data-and-security.md), [local development](local-development.md), [delivery roadmap](delivery-roadmap.md), and [ADRs](adr/0001-one-core-many-shells.md).
