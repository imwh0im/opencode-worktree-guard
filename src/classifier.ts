export type WorktreeClassification = "readonly" | "trivial" | "worktree_recommended"

const READONLY_PATTERNS = [
  /설명해줘/u,
  /찾아/u,
  /검색/u,
  /어디/u,
  /explain/i,
  /find/i,
  /search/i,
  /where/i,
  /look into/i,
  /investigate/i,
]

const TRIVIAL_PATTERNS = [
  /오타/u,
  /typo/i,
  /rename .*label/i,
  /one file/i,
  /single file/i,
]

const WORKTREE_PATTERNS = [
  /추가/u,
  /고쳐줘/u,
  /수정/u,
  /리팩터/u,
  /기능/u,
  /설정/u,
  /의존성/u,
  /마이그레이션/u,
  /implement/i,
  /add/i,
  /fix/i,
  /change/i,
  /build/i,
  /refactor/i,
  /config/i,
  /dependency/i,
  /schema/i,
  /migration/i,
  /infra/i,
  /pr\b/i,
]

export function classifyRequest(text: string): WorktreeClassification {
  const normalized = text.trim()

  if (matchesAny(normalized, TRIVIAL_PATTERNS)) {
    return "trivial"
  }

  if (matchesAny(normalized, WORKTREE_PATTERNS)) {
    return "worktree_recommended"
  }

  if (matchesAny(normalized, READONLY_PATTERNS)) {
    return "readonly"
  }

  return "readonly"
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text))
}
