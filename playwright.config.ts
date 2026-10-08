import { defineConfig, devices } from "@playwright/test";

// Smoke tests run against a production build on the mock data layer.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 860 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm build && PORT=3100 pnpm start",
    url: "http://localhost:3100/offline",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
