import { expect, Page } from '@playwright/test';

export class StateSelectComponent {
  constructor(private readonly page: Page) {}

  async selectState(stateName: string): Promise<void> {
    const stateInput = this.page.getByLabel('State', { exact: true });

    await stateInput.click();
    await stateInput.fill('');
    await stateInput.pressSequentially(stateName.slice(0, 4), { delay: 40 });

    await expect(this.page.getByText(stateName, { exact: true })).toBeVisible();
    await this.page.keyboard.press('Enter');
  }
}
