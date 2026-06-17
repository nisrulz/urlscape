const { test, expect } = require('@playwright/test');

test.describe('URLscape', () => {

  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('URLscape: URL Encoder/Decoder');
  });

  test('encodes plain text in real-time', async ({ page }) => {
    await page.goto('/');
    await page.locator('#inputTextArea').fill('Hello World! How are you?');
    await expect(page.locator('#outputTextArea')).toHaveValue(
      'Hello%20World!%20How%20are%20you%3F'
    );
  });

  test('decodes encoded text in real-time', async ({ page }) => {
    await page.goto('/');
    await page.locator('#inputTextArea').fill('Hello%20World%21');
    await expect(page.locator('#outputTextArea')).toHaveValue('Hello World!');
  });

  test('shows char and byte counts', async ({ page }) => {
    await page.goto('/');
    await page.locator('#inputTextArea').fill('Hello');
    await expect(page.locator('.counter').first()).toContainText('5 chars');
    await expect(page.locator('.counter').first()).toContainText('5 bytes');
  });

  test('clear input button resets both fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('#inputTextArea').fill('Hello');
    await expect(page.locator('#outputTextArea')).not.toHaveValue('');
    await page.getByTitle('Clear input').click();
    await expect(page.locator('#inputTextArea')).toHaveValue('');
    await expect(page.locator('#outputTextArea')).toHaveValue('');
  });

  test('toggles between dark and light theme', async ({ page }) => {
    await page.goto('/');
    const initial = await page.locator('body').getAttribute('class');
    await page.getByText('Switch Theme').click();
    const toggled = await page.locator('body').getAttribute('class');
    expect(toggled).toBe(initial === 'dark' ? 'light' : 'dark');
    await page.getByText('Switch Theme').click();
    const restored = await page.locator('body').getAttribute('class');
    expect(restored).toBe(initial);
  });

  test('theme persists after page reload', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Switch Theme').click();
    await expect(page.locator('body')).toHaveClass('light');
    await page.reload();
    await expect(page.locator('#inputTextArea')).toBeVisible();
    await expect(page.locator('body')).toHaveClass('light');
  });

  test('copy output button shows visual feedback', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      navigator.clipboard.writeText = () => Promise.resolve();
    });
    await page.locator('#inputTextArea').fill('test123');
    await page.getByTitle('Copy output').click();
    await expect(page.locator('#output')).toHaveClass(/blink/);
    await expect(page.locator('#output')).not.toHaveClass(/blink/, { timeout: 3000 });
  });

  test('handles unicode characters', async ({ page }) => {
    await page.goto('/');
    await page.locator('#inputTextArea').fill('café résumé');
    await expect(page.locator('#outputTextArea')).toHaveValue(
      'caf%C3%A9%20r%C3%A9sum%C3%A9'
    );
    await page.locator('#inputTextArea').fill('caf%C3%A9%20r%C3%A9sum%C3%A9');
    await expect(page.locator('#outputTextArea')).toHaveValue('café résumé');
  });

  test('handles special characters', async ({ page }) => {
    await page.goto('/');
    await page.locator('#inputTextArea').fill('@#$%^&*()');
    await expect(page.locator('#outputTextArea')).toHaveValue(
      '%40%23%24%25%5E%26*()'
    );
  });

  test('output textarea is editable', async ({ page }) => {
    await page.goto('/');
    await page.locator('#outputTextArea').fill('custom text');
    await expect(page.locator('#outputTextArea')).toHaveValue('custom text');
  });

  test('URL validation badge appears for valid URLs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.url-badge')).not.toBeVisible();
    await page.locator('#inputTextArea').fill('https://example.com');
    await expect(page.locator('.url-badge')).toBeVisible();
    await expect(page.locator('.url-badge')).toContainText('✓ URL');
  });

});
