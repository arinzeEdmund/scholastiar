import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page, email = "amara.okafor@example.com") {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("demo1234");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).not.toHaveURL(/\/auth\/sign-in/);
}

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("U5 candidate tools — AI CV", () => {
  test("generate a tailored CV, check it, edit it, duplicate and delete it", async ({ page }) => {
    await signIn(page);
    await page.goto("/ai-cv");
    await expect(page.getByRole("heading", { name: "CVs tailored to every application" })).toBeVisible();
    await noHorizontalScroll(page);

    // Quick start from the shortlist opens the generator with the programme chosen.
    await page
      .getByRole("link", { name: /MSc Public Health/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/ai-cv\/generate\?target=program:/);
    await expect(page.getByRole("radio", { name: "Programme" })).toHaveAttribute("aria-checked", "true");

    // Validation: a pasted description needs real text.
    await page.getByRole("radio", { name: "Description" }).click();
    await page.getByRole("button", { name: "Generate CV" }).click();
    await expect(page.getByText("Paste at least a few sentences.")).toBeVisible();

    await page.getByRole("radio", { name: "Programme" }).click();
    await page.getByLabel("Programme", { exact: true }).click();
    await page.getByRole("option", { name: /MSc Data Science/ }).click();
    await page.getByRole("radio", { name: /US resume/ }).click();
    await page.getByRole("button", { name: "Generate CV" }).click();
    await expect(page).toHaveURL(/\/ai-cv\/cv-/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "MSc Data Science — US resume" })).toBeVisible();
    await expect(page.getByRole("article", { name: /CV for/ })).toContainText("Brightpath Health Initiative");
    await expect(page.getByText("Every number in this CV matches your profile.")).toBeVisible();
    await noHorizontalScroll(page);

    // Edit: a number that isn't in the profile is flagged live, and the edit persists.
    await page.getByRole("link", { name: "Edit" }).click();
    const summary = page.getByLabel("Profile summary");
    await summary.fill("Data-minded public health researcher who trained 99 analysts.");
    await expect(page.getByText(/isn't in your profile/)).toBeVisible();
    await page.getByLabel("CV name").fill("Data Science resume");
    await page.getByRole("button", { name: "Save CV" }).click();
    await expect(page).toHaveURL(/\/ai-cv\/cv-[^/]+$/);
    await expect(page.getByRole("heading", { name: "Data Science resume" })).toBeVisible();
    await expect(page.getByText(/99 in Profile summary/)).toBeVisible();

    // Duplicate opens the copy's editor; delete removes the original.
    await page.getByRole("button", { name: "Duplicate" }).click();
    await expect(page).toHaveURL(/\/edit$/);
    await expect(page.getByLabel("CV name")).toHaveValue("Data Science resume (copy)");
    await page.goto("/ai-cv/history?view=format");
    await expect(page.getByRole("region", { name: "US resume" })).toContainText("Data Science resume (copy)");
    await page.getByRole("link", { name: /Data Science resume \(copy\)/ }).click();
    await page.getByRole("button", { name: /Delete Data Science resume \(copy\)/ }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
    await expect(page).toHaveURL(/\/ai-cv\/history/);
    await expect(page.getByRole("link", { name: /Data Science resume \(copy\)/ })).toHaveCount(0);
  });

  test("AI CV failure is recoverable", async ({ page }) => {
    await signIn(page);
    await page.context().addCookies([{ name: "sch_ai_failure", value: "1", url: "http://localhost:3100" }]);
    await page.goto("/ai-cv/generate?target=general");
    await page.getByRole("button", { name: "Generate CV" }).click();
    await expect(page.getByText(/couldn't generate your CV right now/)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Generate CV" })).toBeVisible();
  });
});

test.describe("U5 candidate tools — PersonalityAI CV", () => {
  test("record with the camera, preview as a reviewer, change privacy, remove", async ({ page }) => {
    await signIn(page);
    await page.goto("/personality-cv");
    await page.getByRole("link", { name: "Start recording" }).click();
    await expect(page).toHaveURL(/\/personality-cv\/record/);

    const prompts = page.getByRole("group", { name: "Prompts" });
    await expect(prompts.getByRole("checkbox", { checked: true })).toHaveCount(2);
    await prompts.getByRole("checkbox", { name: /proud of/ }).click();
    await expect(prompts.getByRole("checkbox", { name: /new place, language/ })).toBeDisabled();

    await page.getByRole("button", { name: "Check camera and mic" }).click();
    // A fresh browser sometimes refuses the first camera request; students retry the same way.
    const meter = page.getByRole("meter", { name: "Microphone level" });
    const retry = page.getByRole("button", { name: "Try again" });
    await expect(meter.or(retry)).toBeVisible();
    if (await retry.isVisible()) await retry.click();
    await expect(meter).toBeVisible();
    await page.getByRole("button", { name: "Start recording" }).click();
    await expect(page.getByText(/Recording 0:0/)).toBeVisible();
    await expect(page.getByText("Prompt 1 of 3")).toBeVisible();
    await page.getByRole("button", { name: "Next prompt" }).click();
    await expect(page.getByText("Prompt 2 of 3")).toBeVisible();
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: "Stop" }).click();
    await expect(page.getByRole("heading", { name: "Happy with it?" })).toBeVisible();
    await page.getByRole("button", { name: "Use this video" }).click();

    await expect(page).toHaveURL(/\/personality-cv$/);
    await expect(page.getByText(/Published ·/)).toBeVisible();
    await expect(page.getByText("Watched 0 times")).toBeVisible();
    await noHorizontalScroll(page);

    await page.getByRole("link", { name: "See it as a reviewer" }).click();
    await expect(page.getByRole("article", { name: "Reviewer view" })).toContainText(/proud of/);

    await page.goto("/personality-cv/settings");
    await page.getByRole("radio", { name: /Nobody for now/ }).click();
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Privacy settings saved")).toBeVisible();
    await page.goto("/personality-cv/preview");
    await expect(page.getByText(/Your video is hidden/)).toBeVisible();

    // Restore: visible to reviewers again, and remove the video.
    await page.goto("/personality-cv/settings");
    await page.getByRole("radio", { name: /Reviewers of my applications/ }).click();
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Privacy settings saved")).toBeVisible();
    await page.goto("/personality-cv");
    await page.getByRole("button", { name: "Remove" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Remove video" }).click();
    await expect(page.getByRole("heading", { name: "Record in about two minutes" })).toBeVisible();
  });

  test("views show who watched", async ({ page }) => {
    await signIn(page, "kwame.mensah@example.com");
    await page.goto("/personality-cv");
    await expect(page.getByText("Watched 3 times")).toBeVisible();
    await expect(page.getByText("Admissions, Moscow Institute of Applied Sciences")).toBeVisible();
  });
});

test.describe("U5 candidate tools — Signia", () => {
  test("public page shows only public work, and unpublishing hides it", async ({ page, browser }) => {
    const visitor = await browser.newPage();
    await visitor.goto("/s/amara-okafor");
    await expect(visitor.getByRole("heading", { level: 1, name: "Amara Okafor" })).toBeVisible();
    await expect(visitor.getByRole("heading", { name: "Community clinic survey toolkit" })).toBeVisible();

    await signIn(page);
    await page.goto("/signia");
    await expect(page.getByText("scholastiar.ai/s/amara-okafor")).toBeVisible();
    await noHorizontalScroll(page);
    await page.getByRole("switch").click();
    await expect(page.getByText("Your portfolio is unpublished")).toBeVisible();
    const hidden = await visitor.goto("/s/amara-okafor");
    expect(hidden?.status()).toBe(404);

    await page.getByRole("switch").click();
    await expect(page.getByText("Your portfolio is live")).toBeVisible();
    const back = await visitor.goto("/s/amara-okafor");
    expect(back?.status()).toBe(200);
    await visitor.close();
  });

  test("add, edit and delete a project; private projects stay off the public page", async ({ page, browser }) => {
    await signIn(page);
    await page.goto("/signia/projects/new");
    await page.getByRole("button", { name: "Add project" }).click();
    await expect(page.getByText("Give it a title.")).toBeVisible();

    await page.getByLabel("Title").fill("Campus water quality survey");
    await page.getByLabel("One-line summary").fill("Tested drinking water at six campus taps over a term.");
    await page.getByLabel("The result").fill("Two taps were fixed after the report.");
    await page.getByRole("button", { name: "Add a link" }).click();
    await page.getByLabel("Label").fill("Report");
    await page.getByLabel("Link", { exact: true }).fill("not a link");
    await page.getByRole("button", { name: "Add project" }).click();
    await expect(page.getByText("Enter a full link, starting with https://")).toBeVisible();
    await page.getByLabel("Link", { exact: true }).fill("https://example.com/water-report");
    await page.getByRole("radio", { name: /Only me/ }).click();
    await page.getByRole("button", { name: "Add project" }).click();
    await expect(page).toHaveURL(/\/signia$/);
    await expect(page.getByRole("link", { name: /Campus water quality survey/ })).toBeVisible();

    const visitor = await browser.newPage();
    await visitor.goto("/s/amara-okafor");
    await expect(visitor.getByText("Campus water quality survey")).toHaveCount(0);
    await visitor.close();

    await page.getByRole("link", { name: /Campus water quality survey/ }).click();
    await page.getByRole("button", { name: "Delete Campus water quality survey" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
    await expect(page).toHaveURL(/\/signia$/);
    await expect(page.getByRole("link", { name: /Campus water quality survey/ })).toHaveCount(0);
  });

  test("media upload, edit and delete; links validate", async ({ page }) => {
    await signIn(page);
    await page.goto("/signia/media");
    await page.getByLabel("Choose a file to add").setInputFiles({
      name: "lab-photo.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      ),
    });
    await expect(page.getByText("Added to your media")).toBeVisible();
    await page.getByRole("button", { name: "Edit lab photo" }).click();
    await page.getByRole("dialog").getByLabel("Title").fill("Lab bench photo");
    await page.getByRole("dialog").getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Lab bench photo")).toBeVisible();
    await page.getByRole("button", { name: "Delete Lab bench photo" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Lab bench photo")).toHaveCount(0);

    await page.goto("/signia/social-links");
    await page.getByRole("button", { name: "Add a link" }).click();
    await page.getByLabel("Link", { exact: true }).last().fill("orcid.example");
    await page.getByRole("button", { name: "Save links" }).click();
    await expect(page.getByText("Enter a full link, starting with https://")).toBeVisible();
    await page.getByRole("button", { name: "Remove link 3" }).click();
    await page.getByRole("button", { name: "Save links" }).click();
    await expect(page.getByText("Links saved")).toBeVisible();
  });

  test("a handle that's taken is refused", async ({ page }) => {
    await signIn(page, "kwame.mensah@example.com");
    await page.goto("/signia");
    await page.getByRole("link", { name: "Set up Signia" }).click();
    await page.getByLabel("Handle").fill("amara-okafor");
    await page.getByLabel("Headline").fill("Graduate engineer heading to Germany");
    await page.getByRole("button", { name: "Save portfolio" }).click();
    await expect(page.getByText("That handle is taken — try another.")).toBeVisible();
    await noHorizontalScroll(page);
  });
});

test.describe("U5 candidate tools — billing", () => {
  test("Starter upgrades to Pro at checkout, and jobs unlock", async ({ page }) => {
    await signIn(page);
    await page.goto("/billing");
    await expect(page.getByRole("region", { name: "Starter plan" })).toContainText("Current");
    await expect(page.getByText("Paid").first()).toBeVisible();
    await noHorizontalScroll(page);

    await page.getByRole("link", { name: "Upgrade to Pro" }).click();
    await expect(page.getByRole("heading", { name: "Upgrade to Pro" })).toBeVisible();
    await page.getByLabel("Name on card").fill("Amara Okafor");
    await page.getByRole("button", { name: /Payment succeeds/ }).click();
    await page.getByRole("button", { name: /^Pay \$79/ }).click();
    await expect(page).toHaveURL(/\/billing\?changed=1/);
    await expect(page.getByText("You're on Pro now")).toBeVisible();
    await expect(page.getByRole("region", { name: "Pro plan" })).toContainText("Current");

    await page.goto("/dashboard");
    await expect(page.locator("li[data-locked]")).toHaveCount(0);

    // Schedule the move back, then undo it.
    await page.goto("/billing");
    await page.getByRole("button", { name: "Switch to Starter" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Switch at period end" }).click();
    await expect(page.getByText(/You're moving to Starter on/)).toBeVisible();
    await page.getByRole("button", { name: "Keep Pro" }).click();
    await expect(page.getByText("You're staying on Pro")).toBeVisible();

    // Restore Amara to Starter for the other tests (dev panel plan switcher).
    await page.getByRole("button", { name: /Open dev panel/ }).click();
    await page.getByLabel("Plan", { exact: true }).click();
    await page.getByRole("option", { name: "Starter", exact: true }).click();
    await expect(page.getByText("Plan switched to Starter")).toBeVisible();
  });
});

test.describe("U5 candidate tools — messages, notifications, insights", () => {
  test("read a conversation, see the interview, reply with an attachment", async ({ page }) => {
    await signIn(page);
    await page.goto("/messages");
    await expect(page.getByRole("link", { name: /Volga Federal Medical University/ })).toContainText("1");
    await page.getByRole("link", { name: "Interviews" }).click();
    await expect(page.getByRole("link", { name: /Applied Sciences Master's Scholarship/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Volga Federal Medical University/ })).toHaveCount(0);

    await page.getByRole("link", { name: /Applied Sciences Master's Scholarship/ }).click();
    await expect(page.getByText(/Interview ·/)).toBeVisible();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Add to calendar" }).click();
    expect((await download).suggestedFilename()).toBe("interview.ics");

    await page.goto("/messages");
    await page.getByRole("link", { name: /Volga Federal Medical University/ }).click();
    await expect(page.getByText("Status: Documents requested")).toBeVisible();
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Write a message first.")).toBeVisible();
    const reply = `Thank you — attaching my transcript now (${Date.now() % 10000}).`;
    await page.getByLabel("Your reply").fill(reply);
    await page.getByRole("button", { name: "Attach a document" }).click();
    await page.getByRole("menuitemcheckbox").first().click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText(reply)).toBeVisible();
    await noHorizontalScroll(page);

    // Opening the thread marked it read.
    await page.goto("/messages?show=unread");
    await expect(page.getByRole("link", { name: /Volga Federal Medical University/ })).toHaveCount(0);
  });

  test("notifications: filter, open one, mark all read", async ({ page }) => {
    await signIn(page, "kwame.mensah@example.com");
    await page.goto("/notifications");
    await page.getByRole("button", { name: /Your video was watched/ }).click();
    await expect(page).toHaveURL(/\/personality-cv$/);
    await page.goto("/notifications");
    await expect(page.getByText("You're all caught up")).toBeVisible();

    await page.context().clearCookies();
    await signIn(page);
    await page.goto("/notifications");
    await page.getByRole("link", { name: "Deadlines" }).click();
    await expect(page).toHaveURL(/type=deadlines/);
    await expect(page.getByRole("button", { name: /closes in/ })).toBeVisible();
    await page.goto("/notifications");
    // Earlier runs may already have read everything; then the button is correctly disabled.
    const markAll = page.getByRole("button", { name: "Mark all as read" });
    if (await markAll.isEnabled()) {
      await markAll.click();
      await expect(page.getByText("All caught up")).toBeVisible();
    }
    await expect(page.getByText("You're all caught up")).toBeVisible();
    await noHorizontalScroll(page);
  });

  test("insights show readiness, and performance is part of Pro", async ({ page }) => {
    await signIn(page);
    await page.goto("/applications/insights");
    await expect(page.getByRole("region", { name: "Where you fit best" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Fix these first" })).toContainText(/needed by/);
    await expect(page.getByRole("link", { name: "See Pro" })).toBeVisible();
    await noHorizontalScroll(page);
  });
});
