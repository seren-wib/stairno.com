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

  it('FR-20 has the account menu, signed out until the browser reads the session', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, { props: { locale: 'ko' } });
    const menu = parse(html).querySelector('[data-account-menu]');
    expect(menu?.getAttribute('data-state')).toBe('signed-out');
    expect(menu?.getAttribute('data-session-url')).toBe('https://api.stairno.com/auth/get-session');
    expect(menu?.getAttribute('data-sign-out-url')).toBe('https://api.stairno.com/auth/sign-out');
  });

  it('FR-20 sends sign-in and sign-up to the account center and back to the hub', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, { props: { locale: 'en' } });
    const hrefs = parse(html)
      .querySelectorAll('[data-account-menu] a')
      .map((a) => a.getAttribute('href'));
    const back = encodeURIComponent('https://stairno.com/en/');
    expect(hrefs).toContain('https://account.stairno.com/en/');
    expect(hrefs).toContain(`https://account.stairno.com/en/sign-in?redirect=${back}`);
    expect(hrefs).toContain(`https://account.stairno.com/en/sign-up?redirect=${back}`);
  });

  it('FR-20 uses the same menu wording as the account center', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, { props: { locale: 'ko' } });
    const text = parse(html).querySelector('[data-account-menu]')?.text ?? '';
    for (const label of ['계정 관리', '로그아웃', '로그인', '가입']) {
      expect(text).toContain(label);
    }
    expect(t('ko').nav.accountMenu.manage).toBe('계정 관리');
  });
});
