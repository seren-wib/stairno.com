export type Theme = 'light' | 'dark';

export const THEME_KEY = 'theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

// Stored choice wins; otherwise follow the system preference (FR-13, FR-14).
// The inline script in Base.astro repeats this rule; the integration test
// keeps the two in step.
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? 'dark' : 'light';
}

export function nextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}
