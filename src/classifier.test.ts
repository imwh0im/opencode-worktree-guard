import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { classifyRequest } from "./classifier.js"

describe("classifyRequest", () => {
  it("classifies explanation and search requests as readonly", () => {
    assert.equal(classifyRequest("이 파일이 뭐 하는지 설명해줘"), "readonly")
    assert.equal(classifyRequest("Find where checkout validation happens"), "readonly")
  })

  it("classifies obvious tiny edits as trivial", () => {
    assert.equal(classifyRequest("README.md 오타 하나 고쳐줘"), "trivial")
    assert.equal(classifyRequest("Rename this label text in one file"), "trivial")
  })

  it("recommends a worktree for broad or risky implementation", () => {
    assert.equal(classifyRequest("장바구니 쿠폰 적용 기능을 추가해줘"), "worktree_recommended")
    assert.equal(classifyRequest("Refactor the auth flow and update config"), "worktree_recommended")
  })
})
