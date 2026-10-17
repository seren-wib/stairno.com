import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import Header from '../../src/components/Header.astro';
import { t } from '../../src/i18n';

// LocaleSwitch and ThemeToggle themselves are tested in @stairno/ui; here only
// their presence and wiring in the hub header matter.
describe('Header', () => {
  it('FR-4 has the brand home link, the locale switch and the theme toggle', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, { props: { locale: 'en' } });
    const root = parse(html);
    expect(root.querySelector('header')).not.toBeNull();
    const brand = root.querySelector('a[href="/en/"]');
    expect(brand?.text.trim()).toBe('Stairno');
    expect(root.querySelector('a[href="/ko/"][hreflang="ko"]')).not.toBeNull();
    expect(root.querySelector('button[data-theme-toggle]')).not.toBeNull();
  });
});
