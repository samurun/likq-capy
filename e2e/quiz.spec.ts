import { test, expect } from "@playwright/test";

test("happy path: landing → quiz → result", async ({ page }) => {
  await page.goto("/en");

  await page.getByRole("link", { name: "Start the quiz" }).click();
  await expect(page).toHaveURL(/\/en\/quiz$/);

  // Pick the first choice on each question until we land on a result page.
  // Choice buttons uniquely contain the aria-hidden A/B/C/D letter span.
  const choiceLocator = page.locator(
    'main button:has(span[aria-hidden="true"])',
  );

  for (let i = 0; i < 10; i++) {
    if (/\/result\//.test(page.url())) break;
    await choiceLocator.first().click();
    await page
      .waitForURL(/\/(quiz|result)\//, { timeout: 2000 })
      .catch(() => {});
  }

  await expect(page).toHaveURL(/\/en\/result\/[a-z-]+$/);
  await expect(page.getByText("You are", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Share" })).toBeVisible();
});
