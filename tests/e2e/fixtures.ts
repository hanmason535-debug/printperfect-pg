import { test as base, expect } from '@playwright/test';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Create a custom test with axe
const test = base.extend({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => {
      return {
        async analyze() {
          const accessibilityScanResults = await page.evaluate(async () => {
            // @ts-ignore
            return await axe.run();
          });
          return accessibilityScanResults;
        }
      };
    };
    await use(makeAxeBuilder);
  }
});

export { test, expect };
