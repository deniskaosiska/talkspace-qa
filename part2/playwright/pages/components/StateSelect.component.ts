import { Page } from '@playwright/test';
import { Timeouts } from '../../constants/timeouts';

export class StateSelectComponent {
  constructor(private readonly page: Page) {}

  async selectState(stateName: string): Promise<void> {
    const stateInput = this.page.getByLabel('State', { exact: true });

    await stateInput.click();
    await stateInput.fill('');
    await stateInput.pressSequentially(stateName.slice(0, 4), { delay: 40 });
    await this.page.waitForTimeout(500);

    const option = this.page.getByRole('option', {
      name: new RegExp(stateName, 'i'),
    });

    if (await option.count()) {
      await option.first().click();
      return;
    }

    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(200);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(Timeouts.spaSettleMs);
  }
}
