# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-10-17

### Added

- Static hub site built with Astro 7: brand intro, three project cards (Works, Games, Labs), a news placeholder and a single contact link.
- Korean and English pages under `/ko/` and `/en/`; `/` picks one from the browser language.
- Light and dark themes that follow the system preference and remember a manual choice.
- Vitest suites for data, i18n, theme logic, components and the built output; GitHub Actions CI on every pull request.
- Deploy workflow for Cloudflare Pages that skips the upload until the account secrets exist.

[0.1.0]: https://github.com/seren-wib/stairno.com/releases/tag/v0.1.0
