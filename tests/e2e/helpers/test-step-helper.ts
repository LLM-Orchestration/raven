import { Page, test, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class TestStepHelper {
  private stepCount = 0;
  private scenarioDir: string;
  private readmeContent: string[] = [];

  constructor(private page: Page, private testInfo: TestInfo) {
    // testInfo.file is the absolute path to the test file
    this.scenarioDir = path.dirname(testInfo.file);
    const scenarioName = path.basename(this.scenarioDir);
    
    this.readmeContent.push(`# Scenario: ${scenarioName}\n`);
    this.readmeContent.push(`## ${testInfo.title}\n`);
    this.readmeContent.push(`This documentation is automatically generated from the E2E test.\n`);
    this.readmeContent.push(`### Steps\n`);
  }

  /**
   * Performs a test step, waits for stabilization, takes a screenshot, and logs it for the README.
   */
  async step(description: string, action: () => Promise<void>) {
    const stepNumber = this.stepCount.toString().padStart(3, '0');
    // Sanitize description for filename
    const sanitizedDescription = description.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const screenshotName = `${stepNumber}-${sanitizedDescription}.png`;
    const screenshotPath = path.join(this.scenarioDir, 'screenshots', screenshotName);

    await test.step(description, async () => {
      await action();
      
      // Stabilization: Wait for network to be idle and images to load
      try {
        await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      } catch (e) {
        // Continue if networkidle times out, it's just a best effort
      }
      
      await this.page.evaluate(async () => {
        const images = Array.from(document.querySelectorAll('img'));
        await Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          });
        }));
      });

      // Ensure screenshots directory exists
      const screenshotsDir = path.dirname(screenshotPath);
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      await this.page.screenshot({ path: screenshotPath });
      
      this.readmeContent.push(`#### ${this.stepCount}. ${description}`);
      this.readmeContent.push(`![${description}](screenshots/${screenshotName})\n`);
      
      this.stepCount++;
    });
  }

  /**
   * Finalizes the README.md for the scenario.
   */
  async finish() {
    const readmePath = path.join(this.scenarioDir, 'README.md');
    fs.writeFileSync(readmePath, this.readmeContent.join('\n'));
  }
}
