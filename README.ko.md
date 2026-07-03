# opencode-worktree-guard

opencode 에이전트가 위험하거나 범위가 큰 구현 작업을 현재 checkout에서 바로 시작하기 전에, git worktree 사용 여부를 먼저 묻게 돕는 플러그인과 스킬 번들입니다.

목표는 모든 명령 전에 묻는 것이 아닙니다. 읽기 전용 조사, 진단, 테스트, 설명, 명백한 단일 파일 소수정에는 조용히 넘어가고, 여러 파일 수정, 리팩터링, 의존성/설정/schema/infra 변경, PR로 이어질 수 있는 작업 전에만 개입하는 것이 목표입니다.

## 현재 상태

이 저장소는 MVP 스캐폴드입니다.

- 플러그인은 opencode 세션에 시스템 지침을 주입합니다.
- 요청 분류기와 메모리 기반 세션 상태를 구현하고 테스트했습니다.
- 함께 제공되는 스킬은 worktree checkpoint 정책을 설명합니다.
- 플러그인은 worktree를 자동 생성하지 않습니다.
- 플러그인은 아직 도구 실행을 강제로 차단하지 않습니다.

## 구조

```text
src/
  classifier.ts          # 사용자 요청을 readonly, trivial, worktree-recommended 로 분류
  state.ts               # 메모리 기반 세션 checkpoint 상태
  index.ts               # opencode plugin entry
skills/
  worktree-checkpoint/
    SKILL.md             # 에이전트용 정책 문서
snippets/
  AGENTS.md              # 복사해서 붙여넣을 수 있는 지침 snippet
README.md                # 영어 문서
README.ko.md             # 한국어 문서
```

## 로컬 설치

이 저장소를 clone 하거나 복사한 뒤, opencode 설정에서 로컬 플러그인을 참조합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["/absolute/path/to/opencode-worktree-guard/src/index.ts"],
  "skills": {
    "paths": ["/absolute/path/to/opencode-worktree-guard/skills"]
  }
}
```

설정을 바꾼 뒤에는 opencode를 재시작해야 합니다. opencode는 설정, 플러그인, 스킬을 시작 시점에 로드합니다.

더 강한 프롬프트 레벨 정책을 원하면 `snippets/AGENTS.md` 내용을 global 또는 project `AGENTS.md`에 붙여넣으세요.

## 기대 동작

읽기 전용 작업에서는 묻지 않고 진행합니다.

```text
사용자: 이 모듈이 어떻게 동작하는지 설명해줘.
에이전트: 조사와 설명을 진행합니다.
```

범위가 큰 구현 작업에서는 먼저 묻습니다.

```text
사용자: auth flow를 리팩터링하고 config도 업데이트해줘.
에이전트: 이 작업은 여러 파일에 영향을 줄 수 있습니다. 현재 checkout에서 진행할까요, 아니면 격리된 git worktree를 만들까요?
```

## 개발

```bash
npm install
npm run typecheck
npm test
npm run validate
```

`npm run validate`가 전체 로컬 검증을 수행합니다.

## 설계 메모

- 첫 버전은 soft guard로 유지합니다. 무해한 작업을 방해하지 않으면서 에이전트 행동을 개선하는 것이 목적입니다.
- 정책의 원본은 skill과 AGENTS snippet입니다.
- 향후 도구 차단 기능을 넣더라도 마지막 안전장치로만 사용합니다. 위험한 요청이 감지되었고, 결정 기록 없이 변경 도구를 실행하려 할 때만 개입해야 합니다.
- 이 MVP의 세션 상태는 메모리 기반입니다.

## 라이선스

MIT
