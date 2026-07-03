---
name: worktree-checkpoint
description: Use before implementation, code changes, bug fixes, feature work, refactors, dependency changes, config changes, schema changes, infrastructure changes, or PR-bound work to ask whether to use the current checkout or a git worktree.
---

# Worktree Checkpoint

Use this skill before non-trivial implementation work. The goal is to prevent broad edits from landing in the user's current checkout without an explicit choice.

## Classify The Request

Classify the current user request before mutating files.

### Read-only

Do not ask. Proceed normally.

Examples:

- explain how code works
- find where behavior is implemented
- inspect logs or errors
- run diagnostics or tests
- review code without editing

### Trivial

Do not ask unless the task expands.

Examples:

- fix one typo
- update one obvious label
- make a small single-file edit with clear scope

### Worktree Recommended

Ask before editing.

Examples:

- multi-file edits
- feature work
- unclear bug fixes
- refactors
- dependency, build, config, schema, migration, or infrastructure changes
- work likely to become a PR

## Ask The User

Use this wording by default:

```text
This task may affect more than one file. Should I continue in the current checkout, or create an isolated git worktree?
```

If speaking Korean, use:

```text
이 작업은 변경 범위가 어느 정도 있을 수 있습니다. 현재 checkout에서 진행할까요, 아니면 git worktree를 만들어 격리해서 진행할까요?
```

Ask exactly once per session for the same task. If the user chooses the current checkout, continue there. If the task scope grows materially, ask again.

## If The User Chooses A Worktree

1. Check whether the current directory is already a linked worktree.
2. Check whether `.worktrees/` is ignored before creating anything under it.
3. Fetch `origin`.
4. Create the new worktree from `origin/HEAD`, not from a stale local default branch.
5. Continue edits only inside the new worktree.

## MVP Limitation

This skill is policy only. The companion plugin currently injects this instruction and tracks session-level state in memory. It does not automatically create worktrees or block tools.
