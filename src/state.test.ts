import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { createSessionState } from "./state.js"

describe("createSessionState", () => {
  it("starts with no decision for a session", () => {
    const state = createSessionState()

    assert.equal(state.get("session-1").required, false)
    assert.equal(state.get("session-1").decision, undefined)
  })

  it("tracks that a checkpoint is required", () => {
    const state = createSessionState()

    state.require("session-1")

    assert.deepEqual(state.get("session-1"), { required: true, decision: undefined })
  })

  it("records a session-level decision and can reset it", () => {
    const state = createSessionState()

    state.require("session-1")
    state.decide("session-1", "worktree")
    assert.deepEqual(state.get("session-1"), { required: true, decision: "worktree" })

    state.reset("session-1")
    assert.deepEqual(state.get("session-1"), { required: false, decision: undefined })
  })
})
