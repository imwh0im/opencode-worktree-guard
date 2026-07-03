import assert from "node:assert/strict"
import { describe, it } from "node:test"

import plugin, { addBundledSkillPath, WorktreeGuardPlugin } from "./index.js"

describe("plugin export", () => {
  it("exports the worktree guard plugin", () => {
    assert.equal(typeof plugin, "function")
    assert.equal(plugin, WorktreeGuardPlugin)
  })

  it("adds the bundled skills directory to opencode config", () => {
    const config = { skills: { paths: ["/already/there"] } }

    addBundledSkillPath(config, "/package/skills")

    assert.deepEqual(config.skills.paths, ["/already/there", "/package/skills"])
  })

  it("does not duplicate the bundled skills directory", () => {
    const config = { skills: { paths: ["/package/skills"] } }

    addBundledSkillPath(config, "/package/skills")
    addBundledSkillPath(config, "/package/skills")

    assert.deepEqual(config.skills.paths, ["/package/skills"])
  })
})
