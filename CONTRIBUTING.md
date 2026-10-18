# Contributing

This is a one-person project that runs like a team: issue → branch → failing test → implementation → pull request → CI → merge.

## Branches

| Branch                      | Lifetime  | Role                                    | From   | Merges into |
| --------------------------- | --------- | --------------------------------------- | ------ | ----------- |
| `main`                      | Permanent | What is deployed. A merge is a release. | —      | —           |
| `feature/<issue>-<summary>` | One task  | A single piece of work                  | `main` | `main`      |

- There are no `develop` or `release` branches. The site is small and has no release schedule, so `main` is enough
- Nothing is committed to `main` directly. Every change goes through a pull request
- One task, one issue, one branch. Example: `feature/3-i18n-theme`
- Merge one pull request and see it deployed before opening the next. There is never more than one open pull request

## Issues

- Open an issue before starting. The title uses the commit format (`feat: add theme toggle`)
- The body states the scope, the related SRS IDs and when it is done

## Commits: Conventional Commits

```
<type>(<scope>): <summary>
```

- `scope` is optional
- `summary` is English, imperative, lower case, no trailing period
- The body explains why the change was made. The diff already shows what changed

| type       | Use for                          |
| ---------- | -------------------------------- |
| `feat`     | New features                     |
| `fix`      | Bug fixes                        |
| `test`     | Adding or changing tests         |
| `refactor` | Code changes that keep behaviour |
| `docs`     | Documentation                    |
| `style`    | Formatting only                  |
| `chore`    | Configuration, dependencies      |
| `ci`       | CI and deploy workflows          |

Test-driven work is committed in the same order:

```
test: add failing cases for resolveTheme
feat: implement resolveTheme
refactor: extract theme constants
```

## Pull requests

- The title uses the commit format. The body links the issue (`Closes #3`) and says why, how it was checked and which SRS IDs it covers
- CI (formatting, type checks, tests, build) must pass before merging
- Merges are rebase merges, so every commit lands on `main` as it is and each one must follow the commit rules above
- Delete the feature branch right after merging

## Tests

- Every feature starts with a failing test. Test names include the SRS ID, for example `FR-13 follows system preference when nothing is stored`
- Layers: unit (`tests/unit`), component (`tests/component`) and integration (`tests/integration`, which checks the built output). The full plan is in the test and deploy document
- `npm test` runs all three. The integration tests include one build, so they take a few seconds

## Keeping documents in sync

Updating documents is part of the work. When code changes, the related document changes in the same pull request.

- Design changes go into `docs/specs/sdd.md`, then the Google Doc is updated
- Requirement changes go into `docs/specs/srs.md`; scope changes into the scope and decision log of `docs/specs/plan.md`
- When a tool is added, update `package.json`, `.editorconfig`, `.gitignore`, the CI workflow and the run instructions in `README.md` together
- Public documents (README.md, CONTRIBUTING.md) are written in English. The specifications and CLAUDE.md are in Korean

## Environment

- Work moves between Windows (Git Bash or PowerShell) and macOS. Never hard-code paths
- `.gitattributes` fixes line endings to LF. Leave `core.autocrlf` alone
- Node 22 or newer, as set by `engines` in `package.json`
