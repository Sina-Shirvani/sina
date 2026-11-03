import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('portfolio loads, lays out, and serves its local assets', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', req => errors.push(req.url()));
  page.on('response', res => {
    if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`);
  });

  const response = await page.goto('/sina/');
  expect(response.status()).toBe(200);
  await expect(page).toHaveTitle(/Network & Systems Engineer/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Ahmad.*Shirvani/);
  await expect(page.locator('.packet-tracer-card')).toHaveCount(14);

  for (const toggle of await page.locator('.case-study summary').all()) await toggle.click();
  for (const image of await page.locator('.case-study img').all()) {
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate(async element => {
      await element.decode();
      return element.naturalWidth;
    })).toBeGreaterThan(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(await page.evaluate(() => document.documentElement.clientWidth));

  for (const [asset, mime] of [['favicon.ico', 'image/x-icon'], ['social-preview.jpg', 'image/jpeg'],
    ['Ahmad-Shirvani-Master-Resume.pdf', 'application/pdf']]) {
    const result = await request.get(`/sina/${asset}`);
    expect(result.ok(), asset).toBeTruthy();
    expect(result.headers()['content-type']).toContain(mime);
    if (mime === 'application/pdf') expect((await result.body()).subarray(0, 5).toString()).toBe('%PDF-');
  }
  expect(errors).toEqual([]);
});

test('keyboard menu and navigation keep destinations visible', async ({ page }) => {
  await page.goto('/sina/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#portfolio-content')).toBeFocused();

  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  const menu = nav.locator('summary');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toBeHidden();

  for (const [name, hash] of [['About', 'about'], ['Skills', 'skills'],
    ['Experience', 'experience'], ['Projects', 'labs'], ['Contact', 'contact']]) {
    await menu.click();
    await nav.locator('.mobile-menu-links').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${hash}$`));
    await expect(page.locator(`#${hash}`)).toBeFocused();
    const header = await nav.boundingBox();
    const section = await page.locator(`#${hash}`).boundingBox();
    expect(header.y).toBeCloseTo(0);
    expect(section.y).toBeGreaterThanOrEqual(header.height - 1);
    expect(section.y).toBeLessThan(page.viewportSize().height);
  }
  const top = page.locator('.floating-top');
  await expect(top).toBeVisible();
  await top.click();
  await expect(top).toBeHidden();
  await expect(page.locator('#top')).toBeFocused();
});

test('recruiter actions and project destinations are available', async ({ page }) => {
  await page.goto('/sina/');
  await page.getByRole('link', { name: 'View Projects', exact: true }).click();
  await expect(page).toHaveURL(/#labs$/);
  await expect(page.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', /^mailto:.+@.+/);
  await expect(page.getByRole('link', { name: 'Email Ahmad' })).toHaveAttribute('href', /^mailto:.+@.+/);
  await expect(page.getByRole('link', { name: 'LinkedIn profile' })).toHaveAttribute('href', /^https:\/\/www\.linkedin\.com\/in\//);
  await expect(page.getByRole('link', { name: 'GitHub projects' })).toHaveAttribute('href', 'https://github.com/Sina-Shirvani');

  const cards = await page.locator('.packet-tracer-card a').evaluateAll(links =>
    links.map(link => [link.href, link.getAttribute('aria-label')]));
  expect(new Set(cards.map(([href]) => href)).size).toBe(14);
  expect(new Set(cards.map(([, label]) => label)).size).toBe(14);
  for (const [href, label] of cards) {
    expect(href).toMatch(/^https:\/\/github\.com\/Sina-Shirvani\/Networking-Labs\/tree\/main\/packet-tracer\//);
    expect(label).toMatch(/^View project: .+ on GitHub$/);
  }

  const downloads = page.getByRole('link', { name: 'Download Résumé (PDF)', exact: true });
  await expect(downloads).toHaveCount(2);
  for (const link of await downloads.all()) {
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    expect(download.suggestedFilename()).toBe('Ahmad-Shirvani-Master-Resume.pdf');
    expect(await download.failure()).toBeNull();
  }
});

test('reports automated accessibility violations', async ({ page }, testInfo) => {
  await page.goto('/sina/');
  for (const toggle of await page.locator('.case-study summary').all()) await toggle.click();
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const findings = violations.map(({ id, impact, help, nodes }) => ({
    id, impact, help, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }));
  await testInfo.attach('axe-violations', {
    body: JSON.stringify(findings, null, 2), contentType: 'application/json',
  });
  for (const finding of findings) {
    testInfo.annotations.push({
      type: 'axe violation', description: `${finding.id}: ${finding.nodes.length} affected nodes`,
    });
    console.log(`[axe ${testInfo.project.name}] ${finding.id}: ${finding.nodes.length} affected nodes`);
  }
});

