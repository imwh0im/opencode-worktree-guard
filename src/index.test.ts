import assert from "node:assert/strict"
import { describe, it } from "node:test"

import plugin, { addBundledSkillPath, WorktreeGuardPlugin } from "./index.js"

describe("plugin export", () => {
  it("exports an opencode plugin module with a server plugin", () => {
    assert.equal(typeof plugin, "object")
    assert.equal(plugin.server, WorktreeGuardPlugin)
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
