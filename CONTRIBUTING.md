# Contributing

1인 프로젝트지만 흐름은 팀처럼 간다. 이슈 → 브랜치 → 테스트 먼저 → 구현 → PR → CI → 머지.

## 브랜치

| 브랜치                      | 수명      | 역할                      | 따는 곳 | 머지 대상 |
| --------------------------- | --------- | ------------------------- | ------- | --------- |
| `main`                      | 상시      | 배포 버전. 머지가 곧 배포 | —       | —         |
| `feature/<이슈번호>-<요약>` | 작업 하나 | 개별 작업                 | `main`  | `main`    |

- `develop`과 `release` 브랜치는 두지 않는다. 사이트가 작고 발표 일정이 없어서 `main` 하나로 충분하다
- `main`에 직접 커밋하지 않는다. 모든 변경은 PR로 들어간다
- 작업 하나당 이슈 하나, 브랜치 하나. 예: `feature/3-i18n-theme`
- PR 하나를 머지하고 배포까지 본 뒤에 다음 PR을 연다. 열린 PR이 둘 이상 쌓이지 않게 한다

## 이슈

- 작업을 시작하기 전에 이슈를 만든다. 제목은 커밋 메시지와 같은 형식(`feat: add theme toggle`)
- 본문에 범위, 관련 SRS ID, 완료 조건을 적는다

## 커밋 — Conventional Commits

```
<type>(<scope>): <summary>
```

- `scope`는 생략 가능
- `summary`는 영어, 명령형, 소문자로 시작, 마침표 없음
- 본문에는 왜 바꿨는지를 적는다. 무엇을 바꿨는지는 diff가 말한다

| type       | 용도                     |
| ---------- | ------------------------ |
| `feat`     | 기능 추가                |
| `fix`      | 버그 수정                |
| `test`     | 테스트 추가, 수정        |
| `refactor` | 동작 변경 없는 코드 개선 |
| `docs`     | 문서                     |
| `style`    | 포맷팅 (동작 변경 없음)  |
| `chore`    | 설정, 의존성 등 기타     |
| `ci`       | CI, 배포 워크플로        |

TDD 작업은 커밋도 그 순서다.

```
test: add failing cases for resolveTheme
feat: implement resolveTheme
refactor: extract theme constants
```

## PR

- 제목은 커밋 형식. 본문에 이슈 번호(`Closes #3`), 바꾼 이유, 확인한 방법, 관련 SRS ID
- CI(포맷, 타입 검사, 테스트, 빌드)가 전부 통과해야 머지한다
- 머지 방식은 rebase merge. 커밋이 그대로 올라가므로 커밋 하나하나가 위 컨벤션을 지켜야 한다
- 머지 직후 feature 브랜치를 삭제한다

## 테스트

- 기능마다 실패하는 테스트를 먼저 쓴다. 테스트 이름에 SRS ID를 넣는다. 예: `FR-13 follows system preference when nothing is stored`
- 계층: 단위(`tests/unit`), 컴포넌트(`tests/component`), 통합(`tests/integration`, 빌드 결과 검사). 자세한 계획은 테스트와 배포 문서
- `npm test`가 셋 다 돈다. 통합 테스트는 빌드를 한 번 포함해서 수 초 걸린다

## 문서 갱신

문서 갱신은 작업의 일부다. 코드를 바꾸면 관련 문서를 같은 PR에서 고친다.

- 설계가 바뀌면 `docs/specs/sdd.md`를 고치고 Google Docs에 다시 올린다
- 요구사항이 바뀌면 `docs/specs/srs.md`. 범위가 바뀌면 `docs/specs/plan.md`의 범위와 결정 기록
- 도구를 추가하면 `package.json`, `.editorconfig`, `.gitignore`, CI 워크플로, `README.md`의 실행 방법을 전부 맞춘다

## 환경

- Windows(Git Bash 또는 PowerShell)와 macOS를 오가며 작업한다. 경로를 하드코딩하지 않는다
- 줄바꿈은 `.gitattributes`가 LF로 고정한다. `core.autocrlf`는 건드리지 않는다
- Node 22 이상. `package.json`의 `engines`가 기준이다
