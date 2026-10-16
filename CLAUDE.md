# stairno.com

브랜드 Stairno의 허브 사이트. 소개, 프로젝트 카드(Works, Games, Labs), 소식 자리, 메일 링크만 있다. 판매, 접수, 결제, 로그인은 없고 앞으로도 여기엔 두지 않는다. 그 기능은 `stairnoworks.com`이 맡는다.

## 문서가 먼저다

이 레포는 설계 문서를 따라 짠다. 문서와 코드가 어긋나면 둘 중 하나를 같은 PR에서 고친다.

| 문서 | 원본 | 공유본 |
| --- | --- | --- |
| 프로젝트 계획서 | `docs/specs/plan.md` | [Google Docs](https://docs.google.com/document/d/19ZMOOU9a8McIlXUp4gqBGZSnI_teIMJkoQCWvBj2B1E/edit) |
| 요구사항 명세서 (SRS) | `docs/specs/srs.md` | [Google Docs](https://docs.google.com/document/d/1xL1lK83hd1QYACoqibiINdR5z7eX14g9BXqUn4PjjK0/edit) |
| 설계 명세서 (SDD) | `docs/specs/sdd.md` | [Google Docs](https://docs.google.com/document/d/19pXJ_bnOkJaKumNUpx5OIEHD7T0Nh9Ikw8f4WMMiNr0/edit) |
| 테스트와 배포 | `docs/specs/test-deploy.md` | [Google Docs](https://docs.google.com/document/d/163y2aNPE-6zIXontwdoe8add6d0EpetFqYLONdxRZoc/edit) |

- `docs/specs/`는 git에서 제외된다. 로컬에 없으면 Google Docs를 읽는다. Drive 폴더는 `Stairno/stairno.com`
- 문서를 고치면 마크다운 원본을 고치고 Google Docs에 다시 올린다. Google Docs만 고치지 않는다
- 요구사항 ID(`FR-n`, `NFR-n`, `DR-n`)는 SRS에 있다. 테스트 이름과 PR 본문에서 이 ID를 인용한다

## 작업 규칙

- 개발 방식은 TDD. 실패하는 테스트를 먼저 쓰고, 통과시키고, 정리한다. 테스트 없는 구현 커밋은 올리지 않는다
- 브랜치, 커밋, PR, 머지 규칙은 `CONTRIBUTING.md`
- `main`에 직접 커밋하지 않는다. 모든 변경은 PR이고 CI가 통과해야 머지한다
- 콘텐츠(문자열, 프로젝트 목록, 메일 주소)는 `src/i18n/`과 `src/data/`에만 있다. 글을 바꾸려고 컴포넌트를 고치지 않는다
- 사용자 노출 문자열은 `ko`, `en` 두 사전에 같은 키로 넣는다. 한쪽만 넣으면 타입 오류다
- 브랜드 표기는 "Stairno". 회사, 그룹, 스튜디오, company, studio라는 말을 쓰지 않는다. 통합 테스트가 이 단어를 잡는다
- 외부 스크립트, 추적 도구, 쿠키, 폼을 추가하지 않는다. `localStorage`에는 테마 값만 둔다
- 범위를 늘리는 변경(소식 기능, 제품 카드, 접수)은 계획서의 범위 밖 목록을 먼저 고치고 결정 기록에 날짜와 함께 남긴 뒤에만 한다

## 스택

Astro 7, TypeScript, 전역 CSS와 CSS 변수, Vitest(+ Astro Container API), Prettier, GitHub Actions, Cloudflare Pages. 자세한 구조와 토큰은 SDD.

```bash
npm ci
npm run dev
npm test
npm run check
npm run format
```

## 배포

`main`에 머지되면 `.github/workflows/deploy.yml`이 빌드해서 Cloudflare Pages 프로젝트 `stairno-com`에 올린다. 시크릿 `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`가 없으면 배포 단계만 건너뛴다. 설정 절차는 테스트와 배포 문서 6절.

## GitHub

- 원격 `github.com/seren-wib/stairno.com` (public), 기본 브랜치 `main`
- 룰셋: `main`은 PR 필수, CI 통과 필수, 삭제와 force push 금지
- 머지는 rebase merge. feature 브랜치는 머지 직후 삭제
