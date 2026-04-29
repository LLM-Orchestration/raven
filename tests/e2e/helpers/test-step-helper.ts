import { Page, test, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface StepOptions {
  description: string;
  action: () => Promise<void>;
  verifications?: { spec: string; check: () => Promise<void> }[];
}

export class TestStepHelper {
  private stepCount = 0;
  private scenarioDir: string;
  private readmeContent: string[] = [];
  private feature: string = '';
  private userStory: string = '';

  constructor(private page: Page, private testInfo: TestInfo) {
    this.scenarioDir = path.dirname(testInfo.file);
  }

  setMetadata(feature: string, userStory: string) {
    this.feature = feature;
    this.userStory = userStory;
  }

  private async waitForAnimations() {
    await this.page.evaluate(async () => {
      const isAnimationActive = () => {
        return Array.from(document.getAnimations()).some(
          (animation) => animation.playState === 'running'
        );
      };

      if (isAnimationActive()) {
        await new Promise((resolve) => {
          const check = () => {
            if (!isAnimationActive()) {
              resolve(null);
            } else {
              requestAnimationFrame(check);
            }
          };
          requestAnimationFrame(check);
        });
      }
    });
  }

  /**
   * Performs a test step, waits for stabilization, takes a screenshot, and logs it for the README.
   */
  async step(options: StepOptions) {
    const { description, action, verifications = [] } = options;
    const stepNumber = this.stepCount.toString().padStart(3, '0');
    // Sanitize description for filename
    const sanitizedDescription = description.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const screenshotName = `${stepNumber}-${sanitizedDescription}.png`;
    const screenshotPath = path.join(this.scenarioDir, 'screenshots', screenshotName);

    await test.step(description, async () => {
      await action();
      
      // Stabilization: Wait for network, images, and animations with a strict 2000ms timeout
      await Promise.race([
        Promise.all([
          this.page.waitForLoadState('networkidle').catch(() => {}),
          this.page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            await Promise.all(images.map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise(resolve => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
              });
            }));
          }).catch(() => {}),
          this.waitForAnimations().catch(() => {})
        ]),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]).catch(() => {});

      // Execute verifications
      for (const verification of verifications) {
        await verification.check();
      }

      // Ensure screenshots directory exists
      const screenshotsDir = path.dirname(screenshotPath);
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      await this.page.screenshot({ path: screenshotPath });
      
      this.readmeContent.push(`#### Step ${this.stepCount}: ${description}`);
      this.readmeContent.push(`![${description}](screenshots/${screenshotName})\n`);
      for (const verification of verifications) {
        this.readmeContent.push(`- [x] ${verification.spec}`);
      }
      this.readmeContent.push('');
      
      this.stepCount++;
    });
  }

  /**
   * Generates the README.md for the scenario.
   */
  async generateDocs() {
    const scenarioName = path.basename(this.scenarioDir);
    const content: string[] = [];
    content.push(`# Scenario: ${scenarioName}\n`);
    content.push(`## ${this.testInfo.title}\n`);
    if (this.feature) content.push(`**Feature:** ${this.feature}\n`);
    if (this.userStory) content.push(`**User Story:** ${this.userStory}\n`);
    content.push(`This documentation is automatically generated from the E2E test.\n`);
    content.push(`### Steps\n`);
    content.push(...this.readmeContent);

    const readmePath = path.join(this.scenarioDir, 'README.md');
    fs.writeFileSync(readmePath, content.join('\n'));
  }
}
