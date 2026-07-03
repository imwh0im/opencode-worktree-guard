import type { Plugin, PluginModule } from "@opencode-ai/plugin"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { classifyRequest } from "./classifier.js"
import { createSessionState } from "./state.js"

type SkillPathConfig = {
  skills?: {
    paths?: string[]
  }
}

const BUNDLED_SKILLS_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "..", "skills")

const SYSTEM_INSTRUCTION = [
  "Worktree guard is active.",
  "Before non-trivial implementation work, classify the task as readonly, trivial, or worktree-recommended.",
  "For broad edits, multi-file work, refactors, dependency/config/schema/infra changes, or PR-bound work, ask whether to proceed in the current checkout or create an isolated git worktree before mutating files.",
  "Do not ask for read-only investigation, explanation, search, diagnostics, tests, or obvious single-file small edits.",
].join(" ")

export const WorktreeGuardPlugin = (async () => {
  const sessions = createSessionState()

  return {
    config: async (cfg) => {
      addBundledSkillPath(cfg as SkillPathConfig)
    },
    "chat.message": async (input, output) => {
      const messageText = output.parts
        .map((part) => JSON.stringify(part))
        .join("\n")

      if (classifyRequest(messageText) === "worktree_recommended") {
        sessions.require(input.sessionID)
      }
    },
    "experimental.chat.system.transform": async (_input, output) => {
      output.system.push(SYSTEM_INSTRUCTION)
    },
  }
}) satisfies Plugin

export function addBundledSkillPath(
  config: SkillPathConfig,
  skillsPath = BUNDLED_SKILLS_PATH,
): void {
  config.skills ??= {}
  config.skills.paths ??= []

  if (!config.skills.paths.includes(skillsPath)) {
    config.skills.paths.push(skillsPath)
  }
}

const pluginModule: PluginModule = {
  server: WorktreeGuardPlugin,
}

export default pluginModule
