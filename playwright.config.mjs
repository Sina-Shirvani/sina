import { defineConfig } from '@playwright/test';

const sizes = [[320, 568], [375, 667], [390, 844], [430, 932],
  [768, 1024], [820, 1180], [1280, 720], [1440, 900], [1920, 1080]];

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: sizes.map(([width, height]) => ({
    name: `${width}x${height}`,
    use: { browserName: 'chromium', viewport: { width, height } },
  })),
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://127.0.0.1:4173/sina/',
    timeout: 15_000,
  },
});
