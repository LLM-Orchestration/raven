import { Page, expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function testStep(
  page: Page,
  stepName: string,
  screenshotPath: string,
  action: () => Promise<void>
) {
  await test.step(stepName, async () => {
    await action();
    
    // Ensure the directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await page.screenshot({ path: screenshotPath });
  });
}
