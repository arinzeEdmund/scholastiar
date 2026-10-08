import { expect, test, type Page } from "@playwright/test";

const PASSWORD = "Passw0rd!x";
const uniqueEmail = (prefix: string) => `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

async function choose(page: Page, label: string | RegExp, option: string) {
  await page.getByLabel(label).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

async function signIn(page: Page, email: string, password = "demo1234") {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).not.toHaveURL(/\/auth\/sign-in/);
}

/** Signs up, pays and verifies a new candidate; ends on the onboarding start page. */
async function newCandidate(page: Page) {
  const email = uniqueEmail("u3");
  await page.goto("/auth/sign-up/candidate");
  await page.getByLabel("Full name").fill("Test Candidate");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await choose(page, "Where do you live now?", "Nigeria");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: /^Starter/ }).click();
  await page.getByLabel(/I agree to the/).check();
  await page.getByRole("button", { name: "Create account and continue to payment" }).click();
  await expect(page).toHaveURL(/\/billing\/checkout/);
  await page.getByLabel("Name on card").fill("Test Candidate");
  await page.getByRole("button", { name: /Payment succeeds/ }).click();
  await page.getByRole("button", { name: /^Pay \$/ }).click();
  await expect(page).toHaveURL(/\/auth\/verify-email/);
  await page.getByRole("link", { name: "Open the verification link" }).click();
  await page.getByRole("link", { name: "Continue to set-up" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  return email;
}

test.describe("U3 candidate core", () => {
  test("new candidate completes onboarding end to end", async ({ page }) => {
    await newCandidate(page);
    await expect(page.getByRole("heading", { name: /Build your profile once/ })).toBeVisible();
    // Ask the guide a question, and open a step to see what it covers.
    await page.getByRole("button", { name: "Can I stop halfway?" }).click();
    await expect(page.getByText(/pick up exactly where you left off/)).toBeVisible();
    await page.getByRole("button", { name: /Your study and visa situation/ }).click();
    await expect(page.getByText(/on Pro, which jobs fit your visa hours/)).toBeVisible();
    await page.getByRole("link", { name: "Start with step 1" }).click();

    // 1. About you
    await expect(page).toHaveURL(/\/onboarding\/personal/);
    await choose(page, "Nationality (passport)", "Nigeria");
    await page.getByLabel("Phone (optional)").fill("+234 801 555 0100");
    await page.getByRole("button", { name: "Save and continue" }).click();

    // 2. Visa — errors appear inside the fields, then save
    await expect(page).toHaveURL(/\/onboarding\/visa/);
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByText("Choose one.").first()).toBeVisible();
    await page.getByRole("radio", { name: /Studying now/ }).click();
    await choose(page, "Country you study in", "United Kingdom");
    await page.getByRole("button", { name: "20 hours" }).click();
    await page.getByRole("radio", { name: /^Allowed/ }).click();
    await page.getByRole("radio", { name: /^Yes I'll need sponsorship/ }).click();
    await page.getByLabel("Countries you want to study or work in").click();
    await page.getByRole("option", { name: "United Kingdom", exact: true }).click();
    await page.getByRole("button", { name: "Save and continue" }).click();

    // 3. Education — add one in the dialog
    await expect(page).toHaveURL(/\/onboarding\/education/);
    await page.getByRole("button", { name: "Add education" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("University, college or school").fill("Kingsbridge University");
    await choose(page, "Level", "Master's degree");
    await dialog.getByLabel("Qualification").fill("MSc Data Science");
    await dialog.getByLabel("Subject").fill("Data science");
    await dialog.getByRole("button", { name: "Add education" }).click();
    await expect(page.getByText("MSc Data Science")).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();

    // 4. Experience — add one with an achievement and live coaching
    await expect(page).toHaveURL(/\/onboarding\/experience/);
    await page.getByRole("button", { name: "Add experience" }).click();
    await page.getByLabel("Your role").fill("Data intern");
    await page.getByLabel("Organisation").fill("Brightpath Health");
    await page.getByLabel("Started").fill("2025-06");
    await page.getByLabel("Ended").fill("2025-09");
    await page.getByLabel("Achievement 1").fill("Reduced survey cleaning time from 5 days to 2 by automating checks");
    await expect(page.getByText("Has a number")).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "Add experience" }).click();
    await expect(page.getByText("Data intern")).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();

    // 5. Skills
    await expect(page).toHaveURL(/\/onboarding\/skills/);
    await page.getByRole("button", { name: "Excel", exact: true }).click();
    await page.getByLabel("Skill", { exact: true }).fill("Statistics");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByText("2 added")).toBeVisible();
    await page.getByRole("button", { name: "Save and continue" }).click();

    // 6. Goals
    await expect(page).toHaveURL(/\/onboarding\/preferences/);
    await page.getByRole("checkbox", { name: /Student jobs/ }).click();
    await page.getByRole("button", { name: "Save and continue" }).click();

    // 7. PersonalityAI CV (optional)
    await expect(page).toHaveURL(/\/onboarding\/personality-cv/);
    await page.getByRole("button", { name: "Do this later" }).click();

    // 8. Review and finish
    await expect(page).toHaveURL(/\/onboarding\/review/);
    await expect(page.getByText("MSc Data Science")).toBeVisible();
    await page.getByRole("button", { name: "Finish set-up" }).click();
    await expect(page).toHaveURL(/\/onboarding\/complete/);
    await expect(page.getByRole("heading", { name: /You're all set/ })).toBeVisible();

    await page.getByRole("link", { name: "Go to your dashboard" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText("Finish setting up")).toHaveCount(0);
    await expect(page.getByText("Up to 20 hrs/week")).toBeVisible();
    await noHorizontalScroll(page);
  });

  test("candidate with unfinished set-up sees the resume banner", async ({ page }) => {
    await signIn(page, "kwame.mensah@example.com");
    await page.goto("/dashboard");
    await expect(page.getByText(/Finish setting up/)).toBeVisible();
    await page.getByRole("link", { name: "Continue set-up" }).click();
    await expect(page).toHaveURL(/\/onboarding\//);
  });

  test("profile overview, edit and experience editor", async ({ page }) => {
    await signIn(page, "amara.okafor@example.com");
    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "Amara Okafor" })).toBeVisible();
    await expect(page.getByText("Research and Data Assistant")).toBeVisible();
    await noHorizontalScroll(page);

    await page.goto("/profile/edit");
    const headline = `Public health researcher ${Date.now() % 1000}`;
    await page.getByLabel("Headline", { exact: true }).fill(headline);
    await page.locator("#about").getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Profile updated")).toBeVisible();
    await page.goto("/profile");
    await expect(page.getByText(headline)).toBeVisible();

    await page.goto("/profile/experience/exp-amara-brightpath");
    await expect(page.getByRole("heading", { name: "Research and Data Assistant" })).toBeVisible();
    await page.goto("/profile/experience/does-not-exist");
    await expect(page.getByRole("heading", { name: "We couldn't find that page" })).toBeVisible();
  });

  test("documents: upload, make usable, delete", async ({ page }) => {
    await newCandidate(page);
    await page.goto("/profile/documents");
    await expect(page.getByText("No documents yet")).toBeVisible();
    await page.getByLabel("Upload documents").setInputFiles({
      name: "My-CV.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Test Candidate — CV"),
    });
    await expect(page.getByText("My-CV.txt uploaded")).toBeVisible();
    await expect(page.getByText(/^CV · \d+ B/)).toBeVisible();

    await page.getByRole("switch", { name: "Allow My-CV.txt in applications" }).click();
    await expect(page.getByText("Can now be attached to applications")).toBeVisible();

    await page.getByRole("button", { name: "Delete My-CV.txt" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("No documents yet")).toBeVisible();
  });

  test("settings: notifications persist, password changes, account deletes", async ({ page }) => {
    const email = await newCandidate(page);

    await page.goto("/settings/notifications");
    const productEmail = page.getByRole("switch", { name: "Product news by in-app" });
    await expect(productEmail).toBeChecked();
    await productEmail.click();
    await page.getByRole("button", { name: "Save notification settings" }).click();
    await expect(page.getByText("Notification settings saved")).toBeVisible();
    await page.reload();
    await expect(page.getByRole("switch", { name: "Product news by in-app" })).not.toBeChecked();
    await expect(page.getByRole("switch", { name: "Account and security by email" })).toBeDisabled();

    await page.goto("/settings");
    await page.getByLabel("Current password").fill("wrong-pass1");
    await page.getByLabel("New password", { exact: true }).fill("NewPassw0rd");
    await page.getByLabel("Confirm new password").fill("NewPassw0rd");
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(page.getByText("That's not your current password.")).toBeVisible();
    await page.getByLabel("Current password").fill(PASSWORD);
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(page.getByText("Password changed")).toBeVisible();

    // Centre it first: on phones the fixed bottom tabs cover the very bottom of the page.
    const deleteButton = page.getByRole("button", { name: "Delete account" });
    await deleteButton.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await deleteButton.click();
    const confirm = page.getByRole("alertdialog");
    await expect(confirm.getByRole("button", { name: "Delete permanently" })).toBeDisabled();
    await confirm.getByLabel(/Type .* to confirm/).fill(email);
    await confirm.getByRole("button", { name: "Delete permanently" }).click();
    await expect(page).toHaveURL(/\/\?account=deleted/);

    await page.goto("/auth/sign-in");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("NewPassw0rd");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: /don't match/ })).toBeVisible();
  });

  test("jobs are Pro only: locked on Starter, open on Pro, never public", async ({ page }) => {
    // Amara is on Starter: both job tiles are locked and lead to the upgrade path.
    await signIn(page, "amara.okafor@example.com");
    await page.goto("/dashboard");
    const explore = page.locator("section", { has: page.getByRole("heading", { name: "Explore opportunities" }) });
    await expect(explore.locator("li[data-locked]")).toHaveCount(2);
    const locked = explore.getByRole("link", { name: "Student jobs — part of Pro. Upgrade to unlock.", exact: true });
    await expect(locked).toHaveAttribute("href", "/billing");
    await expect(explore.getByText("Upgrade to Pro to unlock")).toHaveCount(2);

    // Kwame is on Pro: nothing is locked.
    await page.context().clearCookies();
    await signIn(page, "kwame.mensah@example.com");
    await page.goto("/dashboard");
    await expect(page.locator("li[data-locked]")).toHaveCount(0);

    // There is no public job board.
    const response = await page.goto("/jobs");
    expect(response?.status()).toBe(404);
  });

  test("candidate screens are protected", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    await page.goto("/onboarding/visa");
    await expect(page).toHaveURL(/\/auth\/sign-in/);

    await signIn(page, "sarah@northwind-health.example");
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/unauthorized/);
  });
});
