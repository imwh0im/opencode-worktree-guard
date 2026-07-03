## Worktree Checkpoint Policy

Before non-trivial implementation work, classify the task scope.

Do not ask for worktree confirmation before:

- read-only investigation
- explanation or Q&A
- code search
- diagnostics or tests
- obvious single-file small edits

Ask whether to continue in the current checkout or create an isolated git worktree before:

- multi-file edits
- feature work
- unclear bug fixes
- refactors
- dependency, build, config, schema, migration, or infrastructure changes
- work likely to become a PR

Use this question:

```text
This task may affect more than one file. Should I continue in the current checkout, or create an isolated git worktree?
```

If the user chooses a worktree, check whether the current directory is already a linked worktree. If it is not, ensure `.worktrees/` is ignored, fetch `origin`, and create the new worktree from `origin/HEAD` rather than a stale local branch.
