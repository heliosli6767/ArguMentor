# Data, identity and child safety

## Data classes

| Class | Examples | Default |
|---|---|---|
| Public curriculum | motions, lessons, sentence frames | bundled and cacheable |
| Learner content | speech text, drafts, feedback | private to child profile |
| Audio | temporary voice recording | delete after transcription |
| Parent controls | age band, allowed modes, export/delete | parent-only |
| Operational | request ID, error category, latency | no speech text by default |

## Identity model

A parent account may own multiple child profiles. Platform identities—Web, WeChat, Apple and Google—link to the parent record. A child profile is not an independent social account and has no public profile, messaging or leaderboard.

## Required server controls before public release

- Provider secrets remain server-side.
- Validate every topic, level, phase and payload length again on the server.
- Rate-limit by account/device and bound concurrent model calls.
- Encrypt stored learner text; support export and deletion.
- Keep audio retention off unless a parent explicitly enables a reviewed feature.
- Separate formative feedback from formal assessment.
- Add moderation and incident logging without copying full child speech into routine logs.
- Complete applicable privacy, consent and store-review work for every launch region.
