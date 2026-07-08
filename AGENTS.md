# AGENTS.md

## Build & Test

- **Build**: `npm run build` (runs `tsc`, outputs to `dist/`)
- **Tests**: `npm test` is a **broken placeholder** — use `npx jest` instead.
- **Run a single test**: `npx jest -t "Pilihan Ganda Benar Semua"`
- Test file is `ujian.test.ts` at the repo root (not in `src/`). Jest ignores `/dist/` via `testPathIgnorePatterns`.

## Codebase Architecture

- **TS source** (`src/`): the actual library published to npm. Entry: `src/index.ts`.
- **JS-only test/verification** (`kunci.js`, `types.js`): standalone Node scripts with their own independent implementations of `calculateScore` and `calculateShortAnswerScore`. These are **not imported by the TS source** — they exist for manual verification only.
- `src/ai.ts` imports `dotenv/config` at the top, so `.env` is loaded automatically. Requires `OPENAI_KEY` in `.env` (see `.env.sample`).
- `src/data.ts` is sample/test data only.

## Grading Engine (`src/index.ts`)

The `hitungnilai()` function handles these question types in order:
1. **Bonus**: answer key is `X` or `-CHECK` with student answer not `CHECK`
2. **Complex MC** (check/uncheck): key is `CHECK` or `-CHECK`
3. **Single-letter MC**: key matches `/^[a-zA-Z]$/`
4. **Numeric**: both answer and key are parsed as numbers
5. **Short answer / essay**: falls through to `calculateScore()` for keyword matching

### Bobot (weight) formats
- Simple number: `2` or `"3"` — full points if correct, 0 if wrong
- Correct/incorrect: `"4;-1"` — +4 correct, -1 wrong
- Choice-based: `"1;2;3;4;5"` — maps A=1, B=2, C=3, D=4, E=5

### Short answer key syntax
- Keywords separated by `|` (pipe) for alternative sets, `,` (comma) for AND within a set
- `[AISCORE:XX]` in a key triggers AI-based scoring (returns `XX/100` as score, no keyword matching)

## env

- `.env` is gitignored. Copy `.env.sample` and set `OPENAI_KEY` for AI grading features.
- `src/ai.ts` auto-loads `.env` via `import "dotenv/config"`.

## Naming

Function and variable names are in Indonesian (e.g. `hitungnilai` = calculate score, `jawaban` = answer, `kunci` = key, `bobot` = weight, `benar` = correct, `salah` = wrong, `nilai` = score). Do not translate them.