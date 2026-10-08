import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page, email: string) {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("demo1234");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).not.toHaveURL(/\/auth\/sign-in/);
}

const section = (page: Page) => page.locator("#opportunity-card");

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("U4 shared opportunity system", () => {
  test("category tabs, search and filters drive the results through the URL", async ({ page, isMobile }) => {
    await page.goto("/dev/gallery#opportunity-card");
    const tabs = page.getByRole("navigation", { name: "Catalogue categories" });
    await expect(tabs.getByRole("link", { name: /^All/ })).toHaveAttribute("aria-current", "page");

    await tabs.getByRole("link", { name: /^Universities/ }).click();
    await expect(page).toHaveURL(/tab=universities/);
    await expect(section(page).getByText(/results? in Universities/)).toBeVisible();
    const cards = section(page).locator("article");
    await expect(cards.first()).toContainText("University");

    await tabs.getByRole("link", { name: /^Medicine/ }).click();
    await expect(page).toHaveURL(/tab=medicine/);
    await expect(section(page).getByText("3 results in Medicine")).toBeVisible();

    // Filter by country (sheet on phones, sidebar on desktop).
    if (isMobile) {
      await section(page)
        .getByRole("button", { name: /Filters/ })
        .click();
      await page
        .getByRole("dialog")
        .getByLabel(/Georgia/)
        .click();
      await page.keyboard.press("Escape");
    } else {
      await section(page)
        .getByRole("complementary", { name: "Filters" })
        .getByLabel(/Georgia/)
        .click();
    }
    await expect(page).toHaveURL(/country=GE/);
    await expect(section(page).getByText("1 result in Medicine")).toBeVisible();
    await section(page).getByRole("button", { name: "Remove filter: Georgia" }).click();
    await expect(section(page).getByText("3 results in Medicine")).toBeVisible();

    await page.getByLabel("Search programmes, subjects and universities").fill("data science");
    await section(page).getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/q=data/);
    await expect(section(page).getByText("0 results in Medicine")).toBeVisible();
    await expect(section(page).getByText("Nothing matches yet")).toBeVisible();
    await tabs.getByRole("link", { name: /^Master's/ }).click();
    await expect(section(page).getByRole("article", { name: "MSc Data Science" })).toBeVisible();
    await noHorizontalScroll(page);
  });

  test("visitors see locked fit scores and sign-up links, never university websites", async ({ page }) => {
    await page.goto("/dev/gallery#opportunity-card");
    const card = section(page).getByRole("article", { name: "General Medicine (MD)" }).first();
    await expect(card.getByRole("link", { name: /Your fit score/ })).toHaveAttribute(
      "href",
      /\/auth\/sign-up\/candidate\?next=/,
    );
    await expect(card.getByRole("link", { name: "Sign up to save General Medicine (MD)" })).toBeVisible();
    await expect(section(page).getByRole("heading", { name: "See what this means for you" })).toBeVisible();
    await expect(section(page).locator('a[href*=".example"]')).toHaveCount(0);
  });

  test("students see fit with reasons, save and board actions persist", async ({ page, isMobile }) => {
    // Each project uses its own programme so parallel runs don't collide.
    const name = isMobile ? "MBA Global Business" : "MSc Data Science";
    await signIn(page, "amara.okafor@example.com");
    await page.goto("/dev/gallery?tab=masters#opportunity-card");
    const card = section(page).getByRole("article", { name });

    await card.getByRole("button", { name: /% fit — see why/ }).click();
    await expect(page.getByText(/not a promise of admission or funding/)).toBeVisible();
    await page.keyboard.press("Escape");

    const save = card.getByRole("button", { name: `Save ${name}` });
    await save.click();
    await expect(page.getByText(/Saved — we'll remind you/)).toBeVisible();
    await page.reload();
    const unsave = section(page)
      .getByRole("article", { name })
      .getByRole("button", { name: `Remove ${name} from saved` });
    await expect(unsave).toHaveAttribute("aria-pressed", "true");
    await unsave.click();
    await expect(page.getByText("Removed from saved")).toBeVisible();

    await section(page)
      .getByRole("article", { name })
      .getByRole("button", { name: `More actions for ${name}` })
      .click();
    await page.getByRole("menuitemcheckbox", { name: "AI Apply Agent board" }).click();
    await expect(page.getByText("Added to your AI Apply Agent board")).toBeVisible();
    await page.getByRole("menuitemcheckbox", { name: "AI Apply Agent board" }).click();
    await expect(page.getByText("Removed from your AI Apply Agent board")).toBeVisible();
  });

  test("apply workspace: readiness, AI draft, failure state and review", async ({ page }) => {
    await signIn(page, "amara.okafor@example.com");
    await page.goto("/dev/gallery#apply-workspace");
    const workspace = page.locator("#apply-workspace");
    await expect(workspace.getByText(/of \d documents ready/).first()).toBeVisible();

    await workspace.getByRole("button", { name: "Draft with AI" }).click();
    const draft = workspace.getByLabel("Statement of purpose");
    await expect(draft).toHaveValue(/MSc Public Health/, { timeout: 10_000 });
    await expect(workspace.getByText(/Built from:/)).toBeVisible();

    const submit = workspace.getByRole("button", { name: "Apply with Scholastiar" }).last();
    await expect(submit).toBeDisabled();
    await workspace.getByLabel(/agree to Scholastiar submitting it/).click();
    await submit.click();
    await expect(workspace.getByText("Sent to Scholastiar")).toBeVisible();

    // Simulated AI failure shows a calm, recoverable error.
    await page.context().addCookies([{ name: "sch_ai_failure", value: "1", url: "http://localhost:3100" }]);
    await page.reload();
    await page.locator("#apply-workspace").getByRole("button", { name: "Draft with AI" }).click();
    await expect(page.locator("#apply-workspace").getByRole("alert")).toContainText("couldn't write a draft", {
      timeout: 10_000,
    });
  });
});
