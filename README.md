# opencode-worktree-guard

English | [한국어](README.ko.md)

An opencode plugin and skill bundle that reminds agents to ask before starting risky implementation work in the current checkout.

The goal is not to ask before every command. The guard is meant to stay quiet for read-only work, diagnostics, tests, explanations, and obvious single-file edits. It only nudges the agent before broad edits, refactors, dependency/config/schema/infra changes, or work that may become a PR.

## Status

This repository is an MVP scaffold.

- The plugin injects a system instruction into opencode sessions.
- The classifier and in-memory session state are implemented and tested.
- The bundled skill documents the worktree checkpoint policy.
- The plugin does not create worktrees automatically.
- The plugin does not hard-block tools yet.

## Layout

```text
src/
  classifier.ts          # Classifies user requests as readonly, trivial, or worktree-recommended
  state.ts               # In-memory session checkpoint state
  index.ts               # opencode plugin entry
skills/
  worktree-checkpoint/
    SKILL.md             # Agent-facing policy
snippets/
  AGENTS.md              # Copyable instruction snippet
README.md                # English docs
README.ko.md             # Korean docs
```

## Installation

### Recommended: npm package

After the package is published, add it to your global opencode config at `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@imwh0im/opencode-worktree-guard"]
}
```

The plugin registers its bundled `worktree-checkpoint` skill automatically. You do not need to add a separate `skills.paths` entry.

Restart opencode after changing config. opencode loads config, plugins, and skills at startup.

### Local development

Clone and build this repository:

```bash
git clone https://github.com/imwh0im/opencode-worktree-guard.git
cd opencode-worktree-guard
npm install
npm run build
```

Then reference the built plugin file from your opencode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["/absolute/path/to/opencode-worktree-guard/dist/index.js"]
}
```

Replace `/absolute/path/to/opencode-worktree-guard` with the directory where you cloned this repository. Restart opencode after changing config.

### Optional: add the stronger AGENTS policy

For a stronger prompt-level policy, copy `snippets/AGENTS.md` into your global or project `AGENTS.md`.

## Expected Behavior

For read-only work, the agent should proceed without asking:

```text
User: Explain how this module works.
Agent: Proceeds with investigation and explanation.
```

For broad implementation work, the agent should ask first:

```text
User: Refactor the auth flow and update the config.
Agent: This may affect multiple files. Should I continue in the current checkout, or create an isolated git worktree?
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run validate
```

`npm run validate` runs the full local check.

## Design Notes

- Keep the first version soft. It should improve agent behavior without interrupting harmless work.
- Use the skill and AGENTS snippet as the policy source.
- Treat future tool blocking as a backstop only. It should trigger only after a risky request is detected and the agent attempts a mutating tool before recording a decision.
- Session state is memory-only in this MVP.

## License

MIT
