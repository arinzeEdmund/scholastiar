import { expect, test, type Page } from "@playwright/test";

// Updates to completed stages (2026-10-02): crypto at checkout, WhatsApp opt-in,
// WhatsApp notification settings and the message outbox.

const PASSWORD = "Passw0rd!x";
const uniqueEmail = (prefix: string) => `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
const uniquePhone = () => `+23480${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`;

async function signUpToCheckout(page: Page, opts: { whatsapp?: string } = {}) {
  const email = uniqueEmail("u3b");
  await page.goto("/auth/sign-up/candidate");
  await page.getByLabel("Full name").fill("Test Candidate");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Where do you live now?").click();
  await page.getByRole("option", { name: "Nigeria", exact: true }).click();
  if (opts.whatsapp) await page.getByLabel("WhatsApp for updates (optional)").fill(opts.whatsapp);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: /^Starter/ }).click();
  await page.getByLabel(/I agree to the/).check();
  await page.getByRole("button", { name: "Create account and continue to payment" }).click();
  await expect(page).toHaveURL(/\/billing\/checkout/);
  return email;
}

async function payByCard(page: Page) {
  await page.getByLabel("Name on card").fill("Test Candidate");
  await page.getByRole("button", { name: /Payment succeeds/ }).click();
  await page.getByRole("button", { name: /^Pay \$/ }).click();
  await expect(page).toHaveURL(/\/auth\/verify-email/);
}

test.describe("Payments and messages", () => {
  test("crypto checkout: underpaid, top up, confirm, plan active", async ({ page }) => {
    test.setTimeout(60_000);
    await signUpToCheckout(page);
    await page.getByRole("tab", { name: /^Crypto/ }).click();
    await page.getByRole("radio", { name: /^USDT/ }).click();
    await page.getByRole("radio", { name: "Tron (TRC20)" }).click();
    await page.getByRole("button", { name: /Pay \$35\/month with USDT/ }).click();

    await expect(page.getByText("Send exactly")).toBeVisible();
    await expect(page.getByRole("img", { name: /QR code for the USDT payment address/ })).toBeVisible();

    await page.getByRole("button", { name: "Send too little" }).click();
    await expect(page.getByText(/We received 21\.00 USDT/)).toBeVisible();
    await page.getByRole("button", { name: "Send the rest" }).click();
    await expect(page.getByText(/Confirming/).first()).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/verify-email/, { timeout: 20_000 });
  });

  test("crypto quote expires and can be renewed", async ({ page }) => {
    await signUpToCheckout(page);
    await page.getByRole("tab", { name: /^Crypto/ }).click();
    await page.getByRole("button", { name: /Pay \$35\/month with USDT/ }).click();
    await page.getByRole("button", { name: "Let the quote expire" }).click();
    await expect(page.getByText("This quote has expired")).toBeVisible();
    await page.getByRole("button", { name: "New quote" }).click();
    await expect(page.getByText("Send exactly")).toBeVisible();
  });

  test("messages go by email and WhatsApp only with opt-in", async ({ page }) => {
    const phone = uniquePhone();
    const email = await signUpToCheckout(page, { whatsapp: phone });
    await payByCard(page);

    await page.goto("/dev/outbox");
    await expect(page.getByRole("heading", { name: "Message outbox" })).toBeVisible();
    await expect(page.getByText(email).first()).toBeVisible();
    await expect(page.getByText(`to ${phone}`).first()).toBeVisible();
    await expect(page.getByText(/Payment received: \$35 by card/).first()).toBeVisible();
    await expect(page.getByText("Confirm your email address").first()).toBeVisible();

    // A user without WhatsApp opt-in: WhatsApp is skipped, email still sent.
    await page.context().clearCookies();
    await signUpToCheckout(page);
    await page.goto("/dev/outbox");
    await expect(page.getByText("No WhatsApp opt-in").first()).toBeVisible();
  });

  test("WhatsApp settings: opt in, locked and never channels", async ({ page }) => {
    await signUpToCheckout(page);
    await payByCard(page);
    await page.getByRole("link", { name: "Open the verification link" }).click();

    await page.goto("/settings/notifications");
    await expect(page.getByRole("switch", { name: "Deadlines by whatsapp" })).toBeDisabled();
    await page.getByLabel("WhatsApp number").fill("+234 801 555 0199");
    await page.getByRole("switch", { name: "Receive WhatsApp updates" }).click();
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText("WhatsApp updates on")).toBeVisible();

    await expect(page.getByRole("switch", { name: "Deadlines by whatsapp" })).toBeEnabled();
    await expect(page.getByRole("switch", { name: "Payments by whatsapp" })).toBeDisabled();
    await expect(page.getByRole("switch", { name: "Payments by whatsapp" })).toBeChecked();
    await expect(page.getByLabel("Product news by whatsapp: never sent")).toBeVisible();
  });
});
