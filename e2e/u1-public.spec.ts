import { expect, test, type Page } from "@playwright/test";

const PAGES: [string, RegExp][] = [
  ["/", /Study and funding abroad/],
  ["/about", /Building a life abroad shouldn't feel like/],
  ["/how-it-works", /One profile\. Every application\./],
  ["/pricing", /Choose how much support you need/],
  ["/blog", /Practical guides for moving abroad/],
  ["/blog/working-while-you-study-abroad", /Working while you study abroad/],
  ["/contact", /Talk to the Scholastiar team/],
  ["/faq", /How can we help\?/],
  ["/privacy", /Privacy policy/],
  ["/terms", /Terms of service/],
  ["/search", /What are you looking for\?/],
];

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("U1 public & marketing", () => {
  for (const [path, heading] of PAGES) {
    test(`${path} renders`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await noHorizontalScroll(page);
      expect(errors).toEqual([]);
    });
  }

  test("pricing shows the two applicant plans from the data layer", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("article", { name: "Starter" }).getByText("$35", { exact: true })).toBeVisible();
    await expect(page.getByRole("article", { name: "Pro" }).getByText("$79", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Compare plans in detail" })).toBeVisible();
  });

  test("plan comparison: grouped values, only-differences filter, mobile plan switcher", async ({ page, isMobile }) => {
    await page.goto("/pricing#compare");
    await expect(page.getByRole("heading", { name: "Compare plans in detail" })).toBeVisible();
    await expect(page.getByText("Pro includes everything in Starter, plus 12 upgrades.")).toBeVisible();
    if (isMobile) {
      await page.getByRole("tab", { name: /Starter/ }).click();
      const panel = page.getByRole("tabpanel", { name: "Starter features" });
      await expect(panel.getByText("Standard monthly credits")).toBeVisible();
      await expect(panel.getByText("Pro only").first()).toBeVisible();
      await page.getByRole("tab", { name: /Pro/ }).click();
      await expect(page.getByRole("tabpanel", { name: "Pro features" }).getByText("Higher limits")).toBeVisible();
    } else {
      const table = page.getByRole("table", { name: "Features included in each applicant plan" });
      await expect(table.getByRole("rowheader", { name: /Save opportunities/ })).toBeVisible();
      await expect(table.getByText("Higher limits")).toBeVisible();
      await page.getByRole("radio", { name: "Only differences" }).click();
      await expect(table.getByRole("rowheader", { name: /Save opportunities/ })).toHaveCount(0);
      await expect(table.getByRole("rowheader", { name: /Interview preparation/ })).toBeVisible();
    }
  });

  test("blog filters by category and shows an empty state", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("link", { name: "Using Scholastiar" }).click();
    await expect(page).toHaveURL(/category=product/);
    await expect(page.getByRole("link", { name: /How the Scholastiar success score works/ })).toBeVisible();
    await page.getByRole("link", { name: "Insights" }).click();
    await expect(page.getByText("No insights guides yet")).toBeVisible();
  });

  test("article: FAQ expands, sources and disclaimer show, unknown slug is 404", async ({ page }) => {
    await page.goto("/blog/working-while-you-study-abroad");
    await page.getByRole("button", { name: "Can I work on a student visa?" }).click();
    await expect(page.getByText("Often yes, with limits.")).toBeVisible();
    await expect(page.getByRole("link", { name: /GOV\.UK — Student visa/ })).toHaveAttribute("rel", /noopener/);
    await expect(page.getByText(/This guide is for general planning/)).toBeVisible();
    const missing = await page.goto("/blog/this-guide-does-not-exist");
    expect(missing?.status()).toBe(404);
  });

  test("contact form validates, sends and pre-selects topic", async ({ page }) => {
    await page.goto("/contact?topic=employer_sales");
    await expect(page.getByRole("radio", { name: "Hiring on Scholastiar.ai" })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await page.getByLabel("Your name").fill("Ada Mensah");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("We want to hire twelve international students for part-time roles.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Thanks — your message is with us")).toBeVisible();
    await expect(page.getByText("ada@example.com")).toBeVisible();
  });

  test("newsletter signup validates and subscribes", async ({ page }) => {
    await page.goto("/blog");
    const email = page.getByRole("contentinfo").getByLabel("Weekly opportunity digest");
    await email.fill("not-an-email");
    await page.getByRole("contentinfo").getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByText("Enter a valid email.")).toBeVisible();
    await email.fill(`reader-${Date.now()}@example.com`);
    await page.getByRole("contentinfo").getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByText("You're on the list.")).toBeVisible();
  });

  test("help centre: topic cards jump to sections and answers expand", async ({ page }) => {
    await page.goto("/faq");
    await page
      .getByRole("link", { name: /Plans and billing/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#billing$/);
    await page.getByRole("button", { name: "Is there a free plan?" }).click();
    await expect(page.getByText("There are no free plans.")).toBeVisible();
  });

  test("search finds guides and help, filters by type, and handles no results", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("searchbox", { name: "Search Scholastiar.ai" }).fill("visa");
    await page.getByRole("main").getByRole("button", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL(/q=visa/);
    await expect(page.getByRole("heading", { name: "Guides" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Help centre" })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Result types" })
      .getByRole("link", { name: /Guides/ })
      .click();
    await expect(page).toHaveURL(/type=guides/);
    await expect(page.getByRole("heading", { name: "Help centre" })).toHaveCount(0);
    await page.goto("/search?q=zzzqqq");
    await expect(page.getByText("No results for “zzzqqq”")).toBeVisible();
  });

  test("navigation: header links work and unbuilt links are disabled", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    const nav = page.getByRole("navigation", { name: isMobile ? "Mobile" : "Main" });
    await nav.getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page.getByRole("navigation", { name: isMobile ? "Mobile" : "Main" }).getByRole("link", { name: /Study abroad/ }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  test("screen states: empty and error versions of the blog", async ({ page }) => {
    await page.context().addCookies([{ name: "sch_view_state", value: "empty", url: "http://localhost:3100" }]);
    await page.goto("/blog");
    await expect(page.getByText("No guides yet")).toBeVisible();
    await page.context().addCookies([{ name: "sch_view_state", value: "error", url: "http://localhost:3100" }]);
    await page.goto("/blog");
    await expect(page.getByText("Guides couldn't load.")).toBeVisible();
    await page.context().clearCookies();
  });

  test("footer: newsletter, destinations, theme switch and back to top", async ({ page }) => {
    await page.goto("/about");
    const footer = page.getByRole("contentinfo");
    await footer.getByLabel("Weekly opportunity digest").fill(`footer-${Date.now()}@example.com`);
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByText("You're on the list.")).toBeVisible();

    await footer.getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await footer.getByRole("radio", { name: "System" }).click();

    await footer.getByRole("link", { name: "Canada" }).click();
    await expect(page).toHaveURL(/\/search\?q=Canada/);
  });
});
