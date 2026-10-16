import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(process.cwd(), 'dist');

describe('build output', () => {
  it('FR-1 builds one home page per locale', () => {
    expect(existsSync(join(dist, 'ko', 'index.html'))).toBe(true);
    expect(existsSync(join(dist, 'en', 'index.html'))).toBe(true);
  });
});
