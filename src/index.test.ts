import assert from "node:assert/strict"
import { describe, it } from "node:test"

import plugin, { WorktreeGuardPlugin } from "./index.js"

describe("plugin export", () => {
  it("exports the worktree guard plugin", () => {
    assert.equal(typeof plugin, "function")
    assert.equal(plugin, WorktreeGuardPlugin)
  })
})
