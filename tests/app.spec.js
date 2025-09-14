const { test, expect } = require('@playwright/test');

test('add and process a mandate', async ({ page }) => {
  await page.goto('/index.html');
  const frame = page.frameLocator('iframe'); // the app UI lives in app.html inside the iframe

  // Add a mandate
  await frame.getByRole('button', { name: 'Mandates' }).click();
  await frame.getByRole('button', { name: 'Add mandate' }).click();

  await frame.locator('#mf_merchant').fill('Netflix');
  await frame.locator('#mf_amount').fill('499');
  await frame.locator('#mf_app').fill('UPI');
  await frame.locator('#mf_next').fill('2025-10-01');
  await frame.getByRole('button', { name: 'Save' }).click();

  await expect(frame.getByText('Netflix')).toBeVisible();

  // Process once → next date should change
  const before = await frame.locator('tbody tr td:nth-child(4)').first().textContent();
  await frame.getByRole('button', { name: 'Processed' }).first().click();
  const after = await frame.locator('tbody tr td:nth-child(4)').first().textContent();
  expect(after).not.toEqual(before);
});

test('smart import from pasted text', async ({ page }) => {
  await page.goto('/index.html');
  const frame = page.frameLocator('iframe');

  await frame.getByRole('button', { name: 'Import' }).click();
  const sample = `
Your auto payment of Rs. 499 for Netflix will be debited on 05/07/2024 via UPI. VPA: netflix@icici

Spotify Premium: next charge INR 119 on 10-08-2024. Manage in app.
`;
  await frame.locator('#smartText').fill(sample);
  await frame.getByRole('button', { name: 'Parse & preview' }).click();
  await frame.getByRole('button', { name: /Add \d+ to mandates/i }).click();

  await frame.getByRole('button', { name: 'Mandates' }).click();
  await expect(frame.getByText('Netflix')).toBeVisible();
  await expect(frame.getByText('Spotify')).toBeVisible();
});
