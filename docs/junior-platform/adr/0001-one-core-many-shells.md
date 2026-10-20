# ADR 0001: one learning core, many product shells

- Status: accepted
- Date: 2026-10-20

## Decision

Use a monorepo with separate Web, WeChat and Expo product shells. Share contracts and domain behavior, not rendering code. iOS and Android use one React Native source tree with platform-specific adapters.

## Why

The debate curriculum and feedback rules must remain consistent, while navigation, voice, storage, authentication and release requirements differ substantially by platform. Copying the entire Web app would create three divergent pedagogies and expose browser assumptions in native clients.

## Consequences

Every cross-platform feature starts with a contract/domain change and is then implemented in each shell. Platform releases may move at different speeds. A small amount of native UI duplication is intentional.
