# ArguMentor Junior

An independent child-focused frontend inside the ArguMentor repository. It reuses the upstream debate configuration schema and state reducer, adapts four speeches from Public Forum (Constructive, Rebuttal, Summary, Final focus), and uses the actual `@argdown/core` parser/model plugins for review.

This is now the reference Web shell in the multi-platform Junior architecture. Portable transport types live in `packages/junior-contracts`; the WeChat shell is in `apps/wechat-miniapp`, the shared iOS/Android shell is in `apps/mobile`, and the future trusted service boundary is documented in `services/junior-api`.

## Run locally

```sh
cd apps/junior
npm install --workspaces=false
npm run dev
```

Open `http://127.0.0.1:4187`. The server binds only to loopback and fails if that port is occupied. Nothing terminates other processes or changes global dependencies. Production: `npm run build`, then `npm start`.

For free-form model responses, copy `.env.example` to `.env.local` and set an OpenAI or OpenRouter key there. `DEBATE_MODEL` is optional; default `gpt-4.1-mini` / `openai/gpt-4.1-mini`. Restart only this server after changing environment variables. Keys stay in the server process and never enter the client bundle, localStorage, logs or repository.

With no key, an explicit demonstration mode provides curated opposing points and deterministic structural writing prompts. It does not judge grammar, facts, pronunciation or reasoning, generate quality scores, or advance assessed levels. Provider errors never silently fall back to demonstration responses.

## Included

- 50 curated topics across five gradual levels, with ten motions at each level.
- An eight-lesson Learning Hub covering complete cases, warrants, rebuttal, weighing, questioning, summary, final focus and evidence honesty. Each lesson includes a weak/strong comparison, annotated model and mini drill.
- A pre-debate briefing for every motion with model pro/con cases, the central clash, purposeful questions and a private four-link case planner.
- Four-speech practice with optional timer, writing scaffolds, vocabulary and editable dictation.
- A five-step in-round hint ladder plus round-specific structure checks in both demonstration and live modes. Live coaching adds contextual evaluation, grounded quotations and English rewrites.
- A richer post-debate coach report: best move, next priority, skill coverage by round, per-speech diagnostics and a linked six-minute lesson.
- Dual-path voice input: browser speech recognition when available, or local MediaRecorder transcription through OpenAI when `OPENAI_API_KEY` is configured. The app does not store audio.
- Per-browser drafts, unfinished sessions and review history, plus JSON exports.
- Argdown graph, node inspection, editable Argdown and `.argdown` download.
- Progress recommends the next level after two completed live sessions with all four feedback dimensions at least 3/5. Parents may select any level.

The static private hosted edition has the same interface and demonstration exercises. Its bundle contains no backend or model credentials; live model use is available through the local server.

## Verification

`npm test` covers the upstream state machine integration, demonstration-mode scoring boundaries, side selection, input validation, quote grounding, real Argdown parsing, the eight-lesson sequence, round-specific diagnostic expectations, model briefings and session-to-drill recommendations. `npm run build` includes TypeScript validation.

## Design

Based on the previously downloaded `frontend-design` skill in the Starlux project. Palette: silver `#f6f7f9`, porcelain `#ffffff`, graphite `#252c38`, slate `#7b8593`, ice blue `#eaf1fa`, steel blue `#426a9d`. DM Sans with native Apple/PingFang fallbacks. A quiet navigation rail and a single prominent debate topic keep the learner's next action clear. The two sculpted speech forms are CSS, not AI-generated imagery. Respect reduced motion and provide keyboard focus and responsive layouts.

## Attribution

- ArguMentor by Arshia Keshvari: https://github.com/TeslaNeuro/ArguMentor — MIT. Upstream commit at initial checkout: `1f8bae23e29eed30d32f95646b803b29db9c492d`. Original repository and license retained.
- DebateSim: https://github.com/alexliao95311/DebateSim — referenced for its opponent/coach separation and round-specific Public Forum feedback; no source files copied.
- Argupedia: https://github.com/HumphreyCurtis/Argupedia and Reasons: https://github.com/davekinkead/reasons — referenced for making support, attack and critical questions visible; no source files copied.
- DebateUS Public Forum guides: https://debateus.org/public-forum/ — referenced for constructive, rebuttal, summary, final-focus and weighing pedagogy; no text copied.
- Argdown: https://github.com/argdown/argdown — MIT; used through `@argdown/core`.
- Lucide icons — ISC. React — MIT.

The round graph initially encodes the intended support/opposition of turns rather than claiming automatic semantic extraction. The learner can inspect source sentences and correct relations. Ratings are formative AI feedback, not standardized assessments.
