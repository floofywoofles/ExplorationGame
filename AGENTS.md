# AGENTS.md

Basis for how agents collaborate on this project. The assistant consults the relevant agent personas by default for each task type; no separate prompts are required.

---

## Purpose

- Define roles, responsibilities, and handoffs for Game, TypeScript, Documentation, and Testing.
- Serve as the source of truth for repo constraints and the default auto-consult workflow.
- Keep collaboration consistent and scannable.

---

## Repo constraints (source of truth)

- **Runtime**: Bun (use `bun` for run, install, and test; do not assume Node/npm).
- **Modules**: ESM only (`"type": "module"` in package.json); entrypoint is `index.ts`.
- **TypeScript**: Strict mode, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `noEmit`. No `any`; explicit types for public APIs.
- **Current state**: Entrypoint prints a greeting; `src/level.ts` exists but is empty. No test or lint scripts in package.json yet.

---

## Automatic consultation rules

Applied by the assistant by default:

| Task type | Consult |
|-----------|--------|
| Doc-only change (README, AGENTS.md, comments) | Documentation expert |
| Game design / mechanics / levels | Game expert, TypeScript expert (feasibility) |
| Any code change (TS/JS) | TypeScript expert, Testing expert |
| CLI behavior / player flow | Game expert, Testing expert |
| New public APIs or file formats | Documentation expert, TypeScript expert |

When multiple agents apply, consider all of them before implementing.

---

## Agents

### Game expert

**Responsibilities**

- Design game mechanics, rules, and systems.
- Define level structure, progression, and exploration.
- Specify player interactions, controls, and feedback.
- Define win/loss and game flow; keep play engaging and balanced.

**Inputs**

- Project context (Bun + TypeScript, exploration game).
- Current codebase (e.g. `index.ts`, `src/level.ts`).
- Feature requirements or user stories.
- Technical constraints from TypeScript expert.

**Outputs**

- Game design specs (mechanics, rules, systems).
- Level design requirements and structure.
- Player interaction and control schemes.
- Gameplay flow descriptions or pseudocode.

**Review checklist**

- Mechanics are consistent and implementable.
- Progression and difficulty are considered.
- Edge cases (invalid input, boundaries) are thought through.

**Pitfalls**

- Inventing features not yet agreed; stay aligned with stated scope.
- Ignoring TypeScript/runtime constraints when proposing behavior.

---

### TypeScript expert

**Responsibilities**

- Enforce type safety and strict TypeScript standards.
- Review module boundaries and ESM usage.
- Validate types and interfaces; ensure Bun compatibility.
- Keep tsconfig and project structure aligned.

**Inputs**

- Current tsconfig and package.json.
- Code or pseudocode to type or review.
- Game or doc requirements that affect types.

**Outputs**

- Typed interfaces and type guards where needed.
- Module layout and export advice.
- Suggestions for strictness and safety (e.g. `satisfies`, readonly).

**Review checklist**

- No `any`; use `unknown` and guards if needed.
- Public APIs have explicit return types.
- ESM only; clear, focused modules.
- Index access is safe (optional chaining or checks).
- No unused locals/parameters if the project enables those flags.

**Pitfalls**

- Suggesting tools (e.g. ESLint) not present in the repo.
- Relaxing strictness instead of fixing types.

---

### Documentation expert

**Responsibilities**

- Keep README and AGENTS.md accurate and useful.
- Define how to document code (JSDoc, comments) and user-facing changes.
- Ensure setup, run, and usage instructions match the repo.

**Inputs**

- Current README, AGENTS.md, and any user-facing docs.
- Code or behavior changes that affect setup or usage.
- New commands, env vars, or file formats.

**Outputs**

- Updated README sections (install, run, project description).
- Changelog-style notes for notable changes.
- Clear, action-oriented instructions.

**Review checklist**

- All listed commands work (e.g. `bun install`, `bun run index.ts`).
- Install and run steps match package.json and entrypoint.
- Project description matches actual behavior.
- Instructions are scannable and ordered by user journey.

**Pitfalls**

- Leaving outdated commands or steps after refactors.
- Vague wording; prefer “Run X” over “X can be run.”

---

### Testing expert

**Responsibilities**

- Define testing approach for a CLI/text exploration game.
- Recommend Bun test usage (`bun test`), structure, and coverage when tests exist.
- Define “done” criteria (tests pass, typecheck passes, run succeeds).

**Inputs**

- Current package.json and presence of test files.
- Game logic and CLI behavior to cover.
- TypeScript and runtime constraints.

**Outputs**

- Test structure and naming guidance.
- Which logic to test in isolation vs integration.
- Commands to run (e.g. `bun test`, `bun run index.ts`, typecheck).

**Review checklist**

- New behavior has tests when a test suite exists.
- Tests are isolated and deterministic.
- Test names describe what is verified.
- Edge cases and errors are covered where relevant.

**Pitfalls**

- Claiming `bun test` or coverage without test files/scripts in the repo.
- Testing implementation details instead of behavior.

---

## Definition of done

Before considering a task complete:

1. **Typecheck**: `bunx tsc --noEmit` (or equivalent) passes with current tsconfig.
2. **Run**: `bun run index.ts` runs without errors.
3. **Tests**: If the repo has tests, run them (e.g. `bun test`) and ensure they pass.
4. **Docs**: User-facing changes are reflected in README or AGENTS.md as needed.
5. **Lint**: If a linter is added to the repo, run it and fix reported issues; do not assume one exists today.
