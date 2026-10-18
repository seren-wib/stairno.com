import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');

// Every declaration block whose selector list names `selector` exactly, joined.
function blockFor(selector: string): string {
  return [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
    .filter(([, selectors]) =>
      (selectors ?? '')
        .split(',')
        .map((s) => s.replace(/\/\*[\s\S]*?\*\//g, '').trim())
        .includes(selector),
    )
    .map(([, , body]) => body)
    .join(';');
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
