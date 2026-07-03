export type WorktreeDecision = "current" | "worktree"

export type SessionCheckpoint = {
  required: boolean
  decision: WorktreeDecision | undefined
}

export type SessionState = {
  get(sessionID: string): SessionCheckpoint
  require(sessionID: string): void
  decide(sessionID: string, decision: WorktreeDecision): void
  reset(sessionID: string): void
}

const DEFAULT_CHECKPOINT: SessionCheckpoint = { required: false, decision: undefined }

export function createSessionState(): SessionState {
  const sessions = new Map<string, SessionCheckpoint>()

  return {
    get(sessionID) {
      return sessions.get(sessionID) ?? DEFAULT_CHECKPOINT
    },
    require(sessionID) {
      const current = sessions.get(sessionID)
      sessions.set(sessionID, { required: true, decision: current?.decision })
    },
    decide(sessionID, decision) {
      sessions.set(sessionID, { required: true, decision })
    },
    reset(sessionID) {
      sessions.delete(sessionID)
    },
  }
}
