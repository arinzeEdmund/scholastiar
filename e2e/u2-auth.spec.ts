import { expect, test, type Page } from "@playwright/test";

const PASSWORD = "Passw0rd!x";

const uniqueEmail = (prefix: string) => `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

async function chooseOption(page: Page, label: string, option: string) {
  await page.getByLabel(label).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

async function signUpCandidate(page: Page, email: string, plan: "Starter" | "Pro" = "Starter") {
  await page.goto("/auth/sign-up/candidate");
  await page.getByLabel("Full name").fill("Test Candidate");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await chooseOption(page, "Where do you live now?", "Nigeria");
  await page.getByRole("button", { name: "Continue" }).click();
  // Reaching the plan step must not submit the form or show errors early.
  await expect(page.getByRole("radiogroup", { name: "Choose your plan" })).toBeVisible();
  await expect(page.getByText("Choose a plan.")).toHaveCount(0);
  await page.getByRole("radio", { name: new RegExp(`^${plan}`) }).click();
  await page.getByLabel(/I agree to the/).check();
  await page.getByRole("button", { name: "Create account and continue to payment" }).click();
  await expect(page).toHaveURL(/\/billing\/checkout/);
}

async function payByCard(page: Page, cardLabel: RegExp) {
  await page.getByLabel("Name on card").fill("Test Candidate");
  await page.getByRole("button", { name: cardLabel }).click();
  await page.getByRole("button", { name: /^Pay \$/ }).click();
}

async function signOutFromHeader(page: Page) {
  await page.goto("/about");
  await page.getByRole("button", { name: /Account menu for/ }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page.getByRole("button", { name: /Account menu for/ })).toHaveCount(0);
}

test.describe("U2 auth", () => {
  test("choose role links to all three sign-up flows", async ({ page }) => {
    await page.goto("/auth/choose-role");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const path of ["candidate", "employer", "provider"]) {
      await expect(page.locator(`a[href^="/auth/sign-up/${path}"]`).first()).toBeVisible();
    }
    await noHorizontalScroll(page);
  });

  test("wrong password shows one generic error", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await page.getByLabel("Email").fill("amara.okafor@example.com");
    await page.getByLabel("Password", { exact: true }).fill("wrong-password1");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: /email and password/ })).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("demo persona signs in and signs out", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await page.getByRole("button", { name: /Amara Okafor/ }).click();
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).not.toHaveURL(/\/auth\/sign-in/);
    await signOutFromHeader(page);
    await page.goto("/billing/checkout");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("candidate: sign up, declined card, pay, verify email", async ({ page }) => {
    const email = uniqueEmail("cand");
    await signUpCandidate(page, email);
    await expect(page.getByRole("heading", { name: "Pay for your plan" })).toBeVisible();
    await noHorizontalScroll(page);

    await payByCard(page, /Card declined/);
    await expect(page.getByRole("alert").filter({ hasText: "declined" })).toBeVisible();
    await expect(page).toHaveURL(/\/billing\/checkout/);

    await payByCard(page, /Payment succeeds/);
    await expect(page).toHaveURL(/\/auth\/verify-email/);
    await expect(page.getByRole("heading", { name: "Check your inbox" })).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();

    await page.getByRole("link", { name: "Open the verification link" }).click();
    await expect(page.getByRole("heading", { name: "You're all set" })).toBeVisible();

    // A paid account no longer sees a payment form.
    await page.goto("/billing/checkout");
    await expect(page.getByRole("heading", { name: "Your plan is active" })).toBeVisible();
  });

  test("candidate can pay with a local method", async ({ page }) => {
    await signUpCandidate(page, uniqueEmail("local"), "Pro");
    await page.getByRole("tab", { name: /^Local/ }).click();
    await page.getByRole("radio", { name: /Paystack/ }).click();
    await page.getByRole("button", { name: "Pay $79/month" }).click();
    await expect(page).toHaveURL(/\/auth\/verify-email/);
  });

  test("unpaid account is sent back to checkout on sign-in", async ({ page }) => {
    const email = uniqueEmail("unpaid");
    await signUpCandidate(page, email);
    await signOutFromHeader(page);

    await page.goto("/auth/sign-in");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(/\/billing\/checkout/);
  });

  test("employers sponsoring graduates must choose Pro", async ({ page }) => {
    await page.goto("/auth/sign-up/employer?plan=employer_starter");
    await page.getByLabel("Full name").fill("Test Recruiter");
    await page.getByLabel("Your job title").fill("Talent lead");
    await page.getByLabel("Work email").fill(uniqueEmail("emp"));
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("Company name").fill("Test Health Ltd");
    await chooseOption(page, "Country where you hire", "United Kingdom");
    await page.getByRole("radio", { name: /Graduates, with work visa sponsorship/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("radio", { name: /^Employer Starter/ })).toBeDisabled();
    await expect(page.getByRole("radio", { name: /^Employer Pro/ })).toHaveAttribute("aria-checked", "true");
    await page.getByLabel(/I agree to the/).check();
    await page.getByRole("button", { name: "Create account and continue to payment" }).click();
    await expect(page).toHaveURL(/\/billing\/checkout/);
    await expect(page.getByText("Employer Pro").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Employer Starter/ })).toHaveCount(0);
  });

  test("password reset: request, reset, sign in with the new password", async ({ page }) => {
    const email = uniqueEmail("reset");
    await signUpCandidate(page, email);
    await signOutFromHeader(page);

    await page.goto("/auth/forgot-password");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Send reset link" }).click();
    await page.getByRole("link", { name: "Open the password reset link" }).click();

    await expect(page.getByRole("heading", { name: "Choose a new password" })).toBeVisible();
    const resetUrl = page.url();
    await page.getByLabel("New password", { exact: true }).fill("NewPassw0rd");
    await page.getByLabel("Confirm new password").fill("NewPassw0rd");
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText("Your password has been changed")).toBeVisible();

    // Links work once.
    await page.goto(resetUrl);
    await expect(page.getByRole("heading", { name: "This link has expired" })).toBeVisible();

    await page.goto("/auth/sign-in");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("NewPassw0rd");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(/\/billing\/checkout/);
  });

  test("protected auth screens redirect signed-out visitors", async ({ page }) => {
    await page.goto("/billing/checkout");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    await page.goto("/auth/verify-email");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
