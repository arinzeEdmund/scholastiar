import { expect, test, type Page } from "@playwright/test";

const SHELLS = ["public", "candidate", "employer", "provider", "forwarder", "office", "admin"];
const UTILITY = ["/unauthorized", "/server-error", "/maintenance", "/offline"];

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

async function openDevPanel(page: Page) {
  await page.getByRole("button", { name: /Open dev panel/ }).click();
}

test.describe("U0 foundation", () => {
  test("dev hub shows build status", async ({ page }) => {
    await page.goto("/dev");
    await expect(page.getByRole("heading", { name: "Build status" })).toBeVisible();
  });

  for (const shell of SHELLS) {
    test(`${shell} shell renders without overflow`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/dev/shells/${shell}`);
      await expect(page.getByText("Shell preview")).toBeVisible();
      await noHorizontalScroll(page);
      expect(errors).toEqual([]);
    });
  }

  for (const path of UTILITY) {
    test(`utility page ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await noHorizontalScroll(page);
    });
  }

  test("unknown routes show the 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "We couldn't find that page" })).toBeVisible();
  });

  test("dev panel: persona, form persistence, screen states, plan, reset", async ({ page }) => {
    await page.goto("/dev/gallery");
    await openDevPanel(page);
    await page.getByLabel("Signed in as").click();
    await page.getByRole("option", { name: /Amara Okafor/ }).click();
    await expect(page.getByText("Now signed in as Amara Okafor")).toBeVisible();
    await page.keyboard.press("Escape");

    // Working form: validation, save, persistence
    const name = page.getByLabel("Full name");
    await name.fill("A");
    await page.getByRole("button", { name: "Save profile" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await name.fill("Amara N. Okafor");
    await page.getByRole("button", { name: "Save profile" }).click();
    await expect(page.getByText("Profile saved")).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Full name")).toHaveValue("Amara N. Okafor");

    // Screen states drive the data layer
    for (const [state, expected] of [
      ["Empty", "No plans to show"],
      ["Error", "Screens show this when data fails to load"],
    ] as const) {
      await openDevPanel(page);
      await page.getByRole("radio", { name: state }).click();
      await expect(page.getByText(`Screens now show the ${state.toLowerCase()} state`)).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByText(expected, { exact: false })).toBeVisible();
    }
    await openDevPanel(page);
    await page.getByRole("radio", { name: "Live" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("cell", { name: "Starter" })).toBeVisible();

    // Plan switch
    await openDevPanel(page);
    await page.getByLabel("Plan", { exact: true }).click();
    await page.getByRole("option", { name: "Pro", exact: true }).click();
    await expect(page.getByText("Plan switched to Pro")).toBeVisible();
    await page.getByLabel("Plan", { exact: true }).click();
    await page.getByRole("option", { name: "No subscription" }).click();
    await expect(page.getByText("Subscription removed")).toBeVisible();

    // Reset restores fixtures
    await page.getByRole("button", { name: "Reset demo data" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Reset demo data" }).click();
    await expect(page.getByText("Demo data reset")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.reload();
    await expect(page.getByLabel("Full name")).toHaveValue("Amara Okafor");
  });

  test("manifest and service worker are served", async ({ request }) => {
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest.name).toBe("Scholastiar.ai");
    expect(manifest.icons).toHaveLength(3);
    expect((await request.get("/sw.js")).ok()).toBe(true);
  });

  test.describe("theme", () => {
    test("follows the device setting by default", async ({ browser }) => {
      for (const colorScheme of ["dark", "light"] as const) {
        const context = await browser.newContext({ colorScheme });
        const page = await context.newPage();
        await page.goto("/about");
        await expect(page.locator("html")).toHaveClass(colorScheme === "dark" ? /\bdark\b/ : /^(?!.*\bdark\b).*/);
        await context.close();
      }
    });

    test("toggle switches theme, persists after reload, and System returns to the device setting", async ({
      browser,
    }) => {
      const context = await browser.newContext({ colorScheme: "light" });
      const page = await context.newPage();
      await page.goto("/pricing");
      const html = page.locator("html");
      await expect(html).not.toHaveClass(/\bdark\b/);

      await page.getByRole("button", { name: "Change theme" }).first().click();
      await page.getByRole("menuitemradio", { name: "Dark" }).click();
      await expect(html).toHaveClass(/\bdark\b/);

      await page.reload();
      await expect(html).toHaveClass(/\bdark\b/);

      await page.getByRole("button", { name: "Change theme" }).first().click();
      await expect(page.getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
      await page.getByRole("menuitemradio", { name: "System" }).click();
      await expect(html).not.toHaveClass(/\bdark\b/);
      await context.close();
    });
  });
});
