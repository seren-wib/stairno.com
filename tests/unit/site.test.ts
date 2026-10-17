import { describe, expect, it } from 'vitest';
import { site } from '../../src/data/site';

describe('site constants', () => {
  it('FR-8 has one contact email', () => {
    expect(site.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it('FR-8 uses the contact address on the site domain', () => {
    expect(site.email).toBe(`contact@${new URL(site.url).hostname}`);
  });

  it('FR-9 links to the GitHub repository', () => {
    expect(site.github).toMatch(/^https:\/\/github\.com\/.+/);
  });

  it('FR-18 uses the production origin without a trailing slash', () => {
    expect(site.url).toBe('https://stairno.com');
  });

  it('DR-2 names the brand Stairno', () => {
    expect(site.name).toBe('Stairno');
  });
});
