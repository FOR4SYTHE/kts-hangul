# AGENTS.md — TTS-Baybayin

Read this before touching anything in `api/`. These rules exist because the API layer has
broken in production before from well-intentioned "upgrades." Follow them exactly.

## Tech stack
- Vite + React 18 + TypeScript, Tailwind CSS v4
- Framer Motion, GSAP, html2canvas
- Vercel Edge Functions (`api/*.ts`)
- `@google/genai` — the current, actively maintained Gemini SDK

## Locked API configuration — do not change without explicit approval

These were fixed after real production incidents. Never "helpfully" change them as a side
effect of an unrelated task, even if you believe a newer option exists. Ask first.

- **SDK package:** `@google/genai` only. Never install or import from `@google/generative-ai`
  — it is deprecated, unmaintained, and silently fails on Gemini 2.0+ models.
- **Import pattern:**
  ```ts
  import { GoogleGenAI, ThinkingLevel } from '@google/genai';
  ```
  Include `ThinkingLevel` whenever `thinkingConfig` is used anywhere in the file.
- **Client init:** `new GoogleGenAI({ apiKey })` — never the old two-step
  `new GoogleGenerativeAI(key)` + `.getGenerativeModel({ model })` pattern.
- **Reading responses:** `response.text` — a plain property, NOT `response.text()`. Calling
  it as a function is the old SDK's pattern and will crash JSON parsing silently.
- **thinkingLevel values:** must use the `ThinkingLevel` enum (e.g. `ThinkingLevel.LOW`).
  A raw string like `'low'` is a TypeScript build error (TS2820), not just a style issue.

### Current model assignments (as of this writing)
| File | Branch | Model | Config |
|---|---|---|---|
| `api/example.ts` | — | `gemini-3.1-flash-lite` | — |
| `api/funfact.ts` | — | `gemini-3.1-flash-lite` | — |
| `api/translate.ts` | text/word branch | `gemini-3.1-flash-lite` | — |
| `api/translate.ts` | image/vision branch (Supreme Lens) | `gemini-3.5-flash` | `thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }` |

Flash-Lite is used for plain text tasks (no reasoning needed, faster, cheaper). 3.5 Flash is
kept only on the vision branch where extraction quality matters, with thinking capped low to
control latency. Do not swap these around without being asked.

## Before touching any model string or SDK version
1. Check `https://ai.google.dev/gemini-api/docs/changelog` first.
2. Ask the user before swapping models or SDK packages — including "upgrades."
3. After any change to `api/*.ts`, run a build and confirm zero TypeScript errors before
   reporting the task as done.

## Never claim verification you didn't actually run
If `tsc`, a build, or a test command times out, hangs, or fails to run for any reason
(sandbox network restrictions, missing dependency, etc.), say so explicitly. Do not say
"I can guarantee zero errors" or declare a task complete based on the code "looking
correct." A guess dressed up as a guarantee is worse than no answer — paste the actual
command output, or state clearly that verification did not happen and why.

## Design language
- Translator mode: `doodle-border` / `doodle-shadow` utility classes, Comic Sans / Mali font stack.
- Baybayin mode: `#2C2825` / `#F6F5F2` palette, `font-tribal-text` classes, corner-notch
  decorative divs already used on input/output boxes. Match existing patterns, don't invent new ones.

## Commits
Conventional commit style: `fix:`, `feat:`, `perf:`, etc.

## General
- Ask before any architecture-level change (new dependencies, restructuring file layout, etc).
- Don't touch files outside the stated scope of the current task.