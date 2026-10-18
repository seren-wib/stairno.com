import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');

// The rule block for a selector list that contains `selector`.
function blockFor(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`[^{}]*${escaped}[^{}]*\\{([^}]*)\\}`))?.[1] ?? '';
}

describe('global.css', () => {
  it.each(['.has-dot-text', '.hero .wordmark'])(
    'keeps %s out of text selection, so the hidden text never shows over the dots',
    (selector) => {
      expect(blockFor(selector)).toMatch(/(^|;|\s)user-select:\s*none/);
      expect(blockFor(selector)).toMatch(/-webkit-user-select:\s*none/);
    },
  );
});
