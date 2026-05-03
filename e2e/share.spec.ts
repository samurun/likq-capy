import { test, expect } from "@playwright/test";

const RESULT_URL = "/en/result/zen-master";

test.describe("share dropdown", () => {
  test("opens menu and shows all share options", async ({ page }) => {
    await page.goto(RESULT_URL);

    const trigger = page.getByRole("button", { name: "Share" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    await expect(menu.getByRole("menuitem", { name: /^Share/ })).toBeVisible();
    await expect(
      menu.getByRole("menuitem", { name: "Instagram Story" }),
    ).toBeVisible();
    await expect(
      menu.getByRole("menuitem", { name: "Facebook Story" }),
    ).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "TikTok" })).toBeVisible();
    await expect(
      menu.getByRole("menuitem", { name: "Copy link" }),
    ).toBeVisible();
  });

  test("copy link writes URL to clipboard and flashes status", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(RESULT_URL);

    await page.getByRole("button", { name: "Share" }).click();
    await page.getByRole("menuitem", { name: "Copy link" }).click();

    await expect(page.getByRole("status")).toHaveText("Copied!");

    const clipboard = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboard).toContain("/en/result/zen-master");
  });

  test("native Share… falls back to copy when Web Share is unavailable", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Strip Web Share API so the handler falls through to copy.
    await page.addInitScript(() => {
      delete (Navigator.prototype as { share?: unknown }).share;
    });

    await page.goto(RESULT_URL);
    await page.getByRole("button", { name: "Share" }).click();
    await page.getByRole("menuitem", { name: /^Share/ }).click();

    await expect(page.getByRole("status")).toHaveText("Copied!");
  });

  test("renders in Thai locale", async ({ page }) => {
    await page.goto("/th/result/zen-master");

    const trigger = page.getByRole("button", { name: "แชร์" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    await expect(
      page.getByRole("menuitem", { name: "คัดลอกลิงก์" }),
    ).toBeVisible();
  });
});
