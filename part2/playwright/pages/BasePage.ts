import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async gotoPath(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  protected locatorByLabel(label: string): Locator {
    return this.page.getByLabel(label, { exact: true });
  }

  protected async expectVisibleText(text: string | RegExp): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }
}
