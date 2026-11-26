import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';

const msPw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const chromiumExe = path.join(
  msPw,
  'chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'
);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: fs.existsSync(chromiumExe) ? { executablePath: chromiumExe } : undefined,
      },
    },
    {
      name: 'firefox',
      testMatch: [
        '**/preview-edit-and-footer.spec.ts',
        '**/master-redesign-qa.spec.ts',
        '**/audit-security-perf.spec.ts',
        '**/responsive-and-flows.spec.ts',
        '**/dedicated-routes.spec.ts',
        '**/whatsapp-chat.spec.ts',
        '**/whatsapp-group.spec.ts',
        '**/instagram-dm.spec.ts',
        '**/instagram-story.spec.ts',
        '**/instagram-post.spec.ts',
        '**/imessage.spec.ts',
        '**/android-messages.spec.ts',
        '**/telegram-chat.spec.ts',
        '**/discord-chat.spec.ts',
        '**/fake-call.spec.ts',
      ],
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      testMatch: [
        '**/preview-edit-and-footer.spec.ts',
        '**/master-redesign-qa.spec.ts',
        '**/audit-security-perf.spec.ts',
        '**/responsive-and-flows.spec.ts',
        '**/dedicated-routes.spec.ts',
        '**/whatsapp-chat.spec.ts',
        '**/whatsapp-group.spec.ts',
        '**/instagram-dm.spec.ts',
        '**/instagram-story.spec.ts',
        '**/instagram-post.spec.ts',
        '**/imessage.spec.ts',
        '**/android-messages.spec.ts',
        '**/telegram-chat.spec.ts',
        '**/discord-chat.spec.ts',
        '**/fake-call.spec.ts',
      ],
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
  webServer: {
    command: 'npm run start -- -p 3000 -H 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
