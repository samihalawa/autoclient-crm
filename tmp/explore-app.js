/**
 * Manual App Exploration with Puppeteer
 * Interactive browser for manual testing
 */

const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const EXPLORATION_LOG = path.join(__dirname, 'exploration-log.md');

class AppExplorer {
  constructor() {
    this.browser = null;
    this.page = null;
    this.logEntries = [];
  }

  async initialize() {
    console.log('🚀 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();

    // Log console messages
    this.page.on('console', msg => {
      const type = msg.type();
      if (type === 'error') {
        this.log(`[ERROR] ${msg.text()}`, 'error');
      } else if (type === 'warning') {
        this.log(`[WARN] ${msg.text()}`, 'warning');
      }
    });

    // Log navigation
    this.page.on('framenavigated', frame => {
      if (frame === this.page.mainFrame()) {
        this.log(`Navigated to: ${frame.url()}`);
      }
    });

    console.log('✅ Browser ready');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    this.logEntries.push(entry);
    console.log(entry);
  }

  async navigate(route) {
    const url = `${BASE_URL}${route}`;
    this.log(`Navigating to ${url}`);
    try {
      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      this.log(`Successfully loaded ${route}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to navigate to ${route}: ${error.message}`, 'error');
      return false;
    }
  }

  async screenshot(name) {
    const screenshotPath = path.join(__dirname, 'screenshots', `${name}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.log(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async getPageStructure() {
    this.log('Analyzing page structure...');

    const structure = await this.page.evaluate(() => {
      const getElementInfo = (el) => {
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: Array.from(el.classList),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          text: el.innerText ? el.innerText.substring(0, 50) : null,
        };
      };

      return {
        title: document.title,
        url: window.location.href,
        buttons: Array.from(document.querySelectorAll('button')).slice(0, 20).map(getElementInfo),
        links: Array.from(document.querySelectorAll('a')).slice(0, 20).map(getElementInfo),
        inputs: Array.from(document.querySelectorAll('input')).slice(0, 20).map(getElementInfo),
        forms: Array.from(document.querySelectorAll('form')).slice(0, 5).map(getElementInfo),
        mainContent: document.querySelector('main') ? getElementInfo(document.querySelector('main')) : null,
      };
    });

    this.log('Page structure analyzed');
    return structure;
  }

  async findElements(selector) {
    try {
      const elements = await this.page.$$(selector);
      this.log(`Found ${elements.length} elements matching "${selector}"`);
      return elements.length;
    } catch (error) {
      this.log(`Error finding elements: ${error.message}`, 'error');
      return 0;
    }
  }

  async testWorkflow1() {
    this.log('=== TESTING WORKFLOW 1: Create and Manage Person ===');

    // Step 1: Navigate to People page
    this.log('Step 1: Navigate to People page');
    const success = await this.navigate('/objects/people');
    if (!success) {
      this.log('❌ Cannot navigate to /objects/people', 'error');
      return;
    }

    await this.screenshot('workflow1-step1-people-page');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Analyze page structure
    const structure = await this.getPageStructure();
    this.log(`Page title: ${structure.title}`);
    this.log(`Found ${structure.buttons.length} buttons`);
    this.log(`Found ${structure.links.length} links`);
    this.log(`Found ${structure.inputs.length} inputs`);

    // Log button labels to find the "Add" button
    structure.buttons.forEach((btn, i) => {
      this.log(`  Button ${i + 1}: ${btn.ariaLabel || btn.text || btn.id}`);
    });

    // Step 2: Try to find and click add button
    this.log('Step 2: Looking for Add button');
    const addButtonSelectors = [
      'button[aria-label="Add"]',
      'button[aria-label="Create"]',
      'button[aria-label="New"]',
      'button:has-text("Add")',
      'button:has-text("+")',
      'button:has-text("New")',
      'button:has-text("Create")',
      '[data-testid="add-button"]',
      '[data-testid="create-button"]',
    ];

    let addButtonFound = false;
    for (const selector of addButtonSelectors) {
      try {
        const count = await this.findElements(selector);
        if (count > 0) {
          this.log(`✅ Found Add button with selector: ${selector}`, 'success');
          addButtonFound = true;

          // Try to click it
          await this.page.click(selector);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await this.screenshot('workflow1-step2-add-clicked');
          break;
        }
      } catch (error) {
        // Continue trying other selectors
      }
    }

    if (!addButtonFound) {
      this.log('❌ Could not find Add button with any known selector', 'error');
      this.log('Taking screenshot of current state...');
      await this.screenshot('workflow1-step2-add-button-not-found');
    }

    // Wait for user inspection
    this.log('Browser will stay open for manual inspection. Check the DevTools.');
    this.log('Press Ctrl+C when done.');
  }

  async saveLog() {
    const logContent = [
      '# Twenty CRM App Exploration Log',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Log Entries',
      '',
      ...this.logEntries.map(entry => `- ${entry}`),
      '',
      '## Next Steps',
      '',
      '1. Review screenshots in tmp/screenshots/',
      '2. Update workflow selectors based on actual app structure',
      '3. Fix any issues found',
      '4. Re-test workflows',
    ].join('\n');

    fs.writeFileSync(EXPLORATION_LOG, logContent);
    this.log(`Log saved to: ${EXPLORATION_LOG}`);
  }

  async run() {
    await this.initialize();
    await this.testWorkflow1();
    await this.saveLog();

    // Keep browser open
    console.log('\n');
    console.log('='.repeat(80));
    console.log('Browser is open for manual inspection.');
    console.log('Press Ctrl+C to close browser and exit.');
    console.log('='.repeat(80));

    // Wait indefinitely
    await new Promise(() => {});
  }
}

// Run the explorer
(async () => {
  const explorer = new AppExplorer();

  process.on('SIGINT', async () => {
    console.log('\nClosing browser...');
    await explorer.saveLog();
    await explorer.browser.close();
    console.log('Done.');
    process.exit(0);
  });

  try {
    await explorer.run();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();
