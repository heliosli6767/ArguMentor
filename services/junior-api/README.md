# Junior API boundary

This directory owns the future cross-platform backend boundary. The running Web version still serves `/api/status`, `/api/turn` and `/api/transcribe` from `apps/junior/server.ts`; move implementation here only when remote clients are ready.

Rules:

- Model and speech-provider keys are server-side only.
- Clients receive short-lived sessions, never provider credentials.
- Every write is scoped to the signed-in child profile selected by a parent.
- Audio is transient by default and is not placed in analytics or logs.
- Demo mode stays client-capable and must not pretend to be an assessed result.
- Version public contracts under `/api/v1`; keep the current same-origin routes as a compatibility adapter.
