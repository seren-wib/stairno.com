import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';
import { locales } from '../../src/i18n';

describe('projects', () => {
  it('FR-6 lists exactly works, games and labs in that order', () => {
    expect(projects.map((p) => p.id)).toEqual(['works', 'games', 'labs']);
  });

  it('DR-4 links each project to its own domain', () => {
    expect(projects.map((p) => p.url)).toEqual([
      'https://stairnoworks.com',
      'https://stairnogames.com',
      'https://stairnolabs.com',
    ]);
  });

  it('DR-3 names every project "Stairno <Word>" in both locales', () => {
    for (const project of projects) {
      for (const locale of locales) {
        expect(project.name[locale]).toMatch(/^Stairno [A-Z][a-z]+$/);
      }
    }
  });

  it('FR-6 gives every project a description in both locales', () => {
    for (const project of projects) {
      for (const locale of locales) {
        expect(project.description[locale].trim().length).toBeGreaterThan(0);
      }
    }
  });
});
