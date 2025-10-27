/**
 * Automated App Exploration with Puppeteer
 * Generates comprehensive report of actual app structure
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const REPORT_FILE = path.join(__dirname, 'app-structure-report.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Routes to explore based on workflow documentation
const routes = [
  { path: '/', name: 'home' },
  { path: '/objects/people', name: 'people' },
  { path: '/objects/companies', name: 'companies' },
  { path: '/objects/opportunities', name: 'opportunities' },
  { path: '/objects/tasks', name: 'tasks' },
  { path: '/objects/notes', name: 'notes' },
  { path: '/settings/workspace', name: 'workspace-settings' },
  { path: '/settings/accounts', name: 'account-settings' },
];

class AutoExplorer {
  constructor() {
    this.browser = null;
    this.page = null;
    this.report = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      routes: {},
      errors: [],
      summary: {}
    };
  }

  async initialize() {
    console.log('🚀 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: true, // Fully automated
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();

    // Collect console errors
    this.page.on('console', msg => {
      const type = msg.type();
      if (type === 'error') {
        this.report.errors.push({
          type: 'console-error',
          message: msg.text(),
          url: this.page.url()
        });
      }
    });

    // Collect page errors
    this.page.on('pageerror', error => {
      this.report.errors.push({
        type: 'page-error',
        message: error.message,
        stack: error.stack,
        url: this.page.url()
      });
    });

    console.log('✅ Browser initialized');
  }

  async exploreRoute(route) {
    console.log(`\n📍 Exploring ${route.path} (${route.name})...`);

    const routeData = {
      path: route.path,
      name: route.name,
      success: false,
      structure: {},
      screenshot: null,
      errors: []
    };

    try {
      // Navigate to route
      const url = `${BASE_URL}${route.path}`;
      console.log(`   Navigating to ${url}...`);

      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      routeData.success = true;
      console.log(`   ✅ Loaded successfully`);

      // Wait a bit for dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Take screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${route.name}.png`);
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      routeData.screenshot = screenshotPath;
      console.log(`   📸 Screenshot saved`);

      // Get page structure
      routeData.structure = await this.getPageStructure();
      console.log(`   🔍 Structure analyzed`);
      console.log(`      - Buttons: ${routeData.structure.buttons.length}`);
      console.log(`      - Links: ${routeData.structure.links.length}`);
      console.log(`      - Inputs: ${routeData.structure.inputs.length}`);
      console.log(`      - Forms: ${routeData.structure.forms.length}`);

      // Try to find common action buttons
      routeData.structure.actionButtons = await this.findActionButtons();
      if (routeData.structure.actionButtons.add) {
        console.log(`      ✅ Found Add button`);
      } else {
        console.log(`      ❌ No Add button found`);
      }

    } catch (error) {
      routeData.success = false;
      routeData.errors.push(error.message);
      console.log(`   ❌ Error: ${error.message}`);
    }

    return routeData;
  }

  async getPageStructure() {
    return await this.page.evaluate(() => {
      const getElementInfo = (el) => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: Array.from(el.classList),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          dataTestId: el.getAttribute('data-testid'),
          text: el.innerText ? el.innerText.substring(0, 100) : null,
          visible: rect.width > 0 && rect.height > 0,
          href: el.href || null,
          type: el.type || null,
          name: el.name || null,
          placeholder: el.placeholder || null,
        };
      };

      return {
        title: document.title,
        url: window.location.href,
        pathname: window.location.pathname,
        buttons: Array.from(document.querySelectorAll('button'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          })
          .map(getElementInfo),
        links: Array.from(document.querySelectorAll('a'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          })
          .map(getElementInfo),
        inputs: Array.from(document.querySelectorAll('input, textarea, select'))
          .map(getElementInfo),
        forms: Array.from(document.querySelectorAll('form'))
          .map(getElementInfo),
        mainNav: Array.from(document.querySelectorAll('nav a'))
          .map(getElementInfo),
      };
    });
  }

  async findActionButtons() {
    const selectors = {
      add: [
        'button[aria-label="Add"]',
        'button[aria-label="Create"]',
        'button[aria-label="New"]',
        'button[aria-label*="Add"]',
        'button[aria-label*="Create"]',
        'button[aria-label*="New"]',
        'button[data-testid="add-button"]',
        'button[data-testid="create-button"]',
        'button[data-testid="new-button"]',
        'button:has-text("+")',
        'button:has-text("Add")',
        'button:has-text("Create")',
        'button:has-text("New")',
      ],
      edit: [
        'button[aria-label="Edit"]',
        'button[aria-label*="Edit"]',
        'button[data-testid="edit-button"]',
      ],
      delete: [
        'button[aria-label="Delete"]',
        'button[aria-label="Remove"]',
        'button[aria-label*="Delete"]',
        'button[data-testid="delete-button"]',
      ],
      save: [
        'button[type="submit"]',
        'button[aria-label="Save"]',
        'button[aria-label*="Save"]',
        'button[data-testid="save-button"]',
      ],
    };

    const found = {};

    for (const [action, selectorList] of Object.entries(selectors)) {
      for (const selector of selectorList) {
        try {
          const elements = await this.page.$$(selector);
          if (elements.length > 0) {
            found[action] = selector;
            break;
          }
        } catch (error) {
          // Continue trying other selectors
        }
      }
    }

    return found;
  }

  async generateSummary() {
    this.report.summary = {
      totalRoutes: Object.keys(this.report.routes).length,
      successfulRoutes: Object.values(this.report.routes).filter(r => r.success).length,
      failedRoutes: Object.values(this.report.routes).filter(r => !r.success).length,
      totalErrors: this.report.errors.length,
      routesWithAddButton: Object.values(this.report.routes)
        .filter(r => r.structure.actionButtons && r.structure.actionButtons.add).length,
    };
  }

  async run() {
    console.log('\n' + '='.repeat(80));
    console.log('Twenty CRM Automated App Exploration');
    console.log('='.repeat(80));

    await this.initialize();

    // Explore each route
    for (const route of routes) {
      const routeData = await this.exploreRoute(route);
      this.report.routes[route.name] = routeData;
    }

    // Generate summary
    await this.generateSummary();

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('Exploration Summary');
    console.log('='.repeat(80));
    console.log(`Total routes explored: ${this.report.summary.totalRoutes}`);
    console.log(`Successful: ${this.report.summary.successfulRoutes} ✅`);
    console.log(`Failed: ${this.report.summary.failedRoutes} ❌`);
    console.log(`Total errors: ${this.report.summary.totalErrors}`);
    console.log(`Routes with Add button: ${this.report.summary.routesWithAddButton}`);

    // Print failed routes
    const failedRoutes = Object.values(this.report.routes).filter(r => !r.success);
    if (failedRoutes.length > 0) {
      console.log('\n' + '-'.repeat(80));
      console.log('Failed Routes:');
      failedRoutes.forEach(route => {
        console.log(`❌ ${route.path}: ${route.errors.join(', ')}`);
      });
    }

    // Print routes missing Add button
    const noAddButton = Object.values(this.report.routes).filter(
      r => r.success && (!r.structure.actionButtons || !r.structure.actionButtons.add)
    );
    if (noAddButton.length > 0) {
      console.log('\n' + '-'.repeat(80));
      console.log('Routes Missing Add Button:');
      noAddButton.forEach(route => {
        console.log(`⚠️  ${route.path}`);
      });
    }

    // Save report
    fs.writeFileSync(REPORT_FILE, JSON.stringify(this.report, null, 2));
    console.log(`\n📄 Full report saved to: ${REPORT_FILE}`);
    console.log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}`);

    await this.browser.close();
    console.log('\n✅ Exploration complete!');
  }
}

// Run the explorer
(async () => {
  const explorer = new AutoExplorer();
  try {
    await explorer.run();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();
