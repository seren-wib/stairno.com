import { en } from './en';
import { ko } from './ko';
import type { Dictionary } from './types';

export type { Dictionary } from './types';

// Locale list and path rules are shared with every Stairno site through
// @stairno/ui; only the dictionaries live here.
export {
  alternateLocale,
  defaultLocale,
  isLocale,
  localePath,
  locales,
  type Locale,
} from '@stairno/ui/i18n';

import { type Locale } from '@stairno/ui/i18n';

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}
