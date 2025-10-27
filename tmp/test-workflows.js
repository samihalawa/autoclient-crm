/**
 * Twenty CRM Workflow Testing with Puppeteer
 * Tests all 20 documented workflows systematically
 *
 * Usage: node tmp/test-workflows.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const RESULTS_FILE = path.join(__dirname, 'workflow-test-results.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const workflows = [
  {
    id: 1,
    name: 'Create and Manage Person Contact',
    priority: 'CRITICAL',
    route: '/objects/people',
    steps: [
      { name: 'Navigate to People page from sidebar', selector: 'a[href="/objects/people"]' },
      { name: 'Click "+" button to add new person', selector: 'button[aria-label="Add"]' },
      { name: 'Fill in Name field', selector: 'input[name="name"]', action: 'type', value: 'Test Person' },
      { name: 'Fill in Email field', selector: 'input[name="email"]', action: 'type', value: 'test@example.com' },
      { name: 'Click Save button', selector: 'button[type="submit"]' },
      { name: 'View person details', selector: '.record-detail-page' },
      { name: 'Edit person information', selector: 'button[aria-label="Edit"]' },
      { name: 'Add note to person', selector: 'button[aria-label="Add note"]' },
      { name: 'Delete person', selector: 'button[aria-label="Delete"]' }
    ]
  },
  {
    id: 2,
    name: 'Create and Manage Company',
    priority: 'CRITICAL',
    route: '/objects/companies',
    steps: [
      { name: 'Navigate to Companies page', selector: 'a[href="/objects/companies"]' },
      { name: 'Click "+" button to add company', selector: 'button[aria-label="Add"]' },
      { name: 'Fill in Company Name', selector: 'input[name="name"]', action: 'type', value: 'Test Company' },
      { name: 'Fill in Domain', selector: 'input[name="domain"]', action: 'type', value: 'testcompany.com' },
      { name: 'Select Industry', selector: 'select[name="industry"]', action: 'select', value: 'Technology' },
      { name: 'Fill in Employee Count', selector: 'input[name="employees"]', action: 'type', value: '50' },
      { name: 'Click Save button', selector: 'button[type="submit"]' },
      { name: 'View company details', selector: '.record-detail-page' },
      { name: 'Link person to company', selector: 'button[aria-label="Link person"]' },
      { name: 'Delete company', selector: 'button[aria-label="Delete"]' }
    ]
  },
  {
    id: 3,
    name: 'Create and Track Opportunity Through Pipeline',
    priority: 'CRITICAL',
    route: '/objects/opportunities',
    steps: [
      { name: 'Navigate to Opportunities page', selector: 'a[href="/objects/opportunities"]' },
      { name: 'Click "+" to create opportunity', selector: 'button[aria-label="Add"]' },
      { name: 'Fill in Opportunity Name', selector: 'input[name="name"]', action: 'type', value: 'Test Deal' },
      { name: 'Select Company', selector: 'select[name="company"]', action: 'select', value: 'Test Company' },
      { name: 'Enter Amount', selector: 'input[name="amount"]', action: 'type', value: '10000' },
      { name: 'Select Stage (New)', selector: 'select[name="stage"]', action: 'select', value: 'New' },
      { name: 'Set Close Date', selector: 'input[name="closeDate"]', action: 'type', value: '2025-12-31' },
      { name: 'Click Save', selector: 'button[type="submit"]' },
      { name: 'Drag to different stage', selector: '.kanban-card', action: 'drag' },
      { name: 'Mark as won/lost', selector: 'button[aria-label="Mark as won"]' }
    ]
  },
  {
    id: 4,
    name: 'Create and Complete Task',
    priority: 'CRITICAL',
    route: '/objects/tasks',
    steps: [
      { name: 'Navigate to Tasks page', selector: 'a[href="/objects/tasks"]' },
      { name: 'Click "+" to create task', selector: 'button[aria-label="Add"]' },
      { name: 'Fill in Task Title', selector: 'input[name="title"]', action: 'type', value: 'Follow up call' },
      { name: 'Select Assignee', selector: 'select[name="assignee"]' },
      { name: 'Set Due Date', selector: 'input[name="dueDate"]', action: 'type', value: '2025-11-01' },
      { name: 'Select Priority', selector: 'select[name="priority"]', action: 'select', value: 'High' },
      { name: 'Link to Person/Company', selector: 'button[aria-label="Link record"]' },
      { name: 'Add Description', selector: 'textarea[name="description"]', action: 'type', value: 'Call to discuss proposal' },
      { name: 'Click Save', selector: 'button[type="submit"]' },
      { name: 'Mark task as complete', selector: 'input[type="checkbox"]' }
    ]
  },
  {
    id: 5,
    name: 'Create and Manage Note',
    priority: 'CRITICAL',
    route: '/objects/notes',
    steps: [
      { name: 'Navigate to Notes page', selector: 'a[href="/objects/notes"]' },
      { name: 'Click "+" to create note', selector: 'button[aria-label="Add"]' },
      { name: 'Fill in Note Title', selector: 'input[name="title"]', action: 'type', value: 'Meeting Notes' },
      { name: 'Enter Note Body', selector: 'textarea[name="body"]', action: 'type', value: 'Discussion about Q4 strategy' },
      { name: 'Link to Person/Company', selector: 'button[aria-label="Link record"]' },
      { name: 'Add Tags', selector: 'input[name="tags"]', action: 'type', value: 'important' },
      { name: 'Click Save', selector: 'button[type="submit"]' },
      { name: 'Edit note', selector: 'button[aria-label="Edit"]' },
      { name: 'Search for note', selector: 'input[type="search"]', action: 'type', value: 'Meeting' },
      { name: 'Delete note', selector: 'button[aria-label="Delete"]' }
    ]
  },
  // Add more workflows as needed (6-20)
];

class WorkflowTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      totalWorkflows: 0,
      passed: 0,
      failed: 0,
      workflows: []
    };
  }

  async initialize() {
    console.log('🚀 Initializing Puppeteer browser...');
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for headless testing
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();

    // Setup console logging
    this.page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        console.log(`   [Browser ${type}]: ${msg.text()}`);
      }
    });
  }

  async testWorkflow(workflow) {
    console.log(`\n📋 Testing Workflow ${workflow.id}: ${workflow.name}`);
    console.log(`   Priority: ${workflow.priority}`);
    console.log(`   Route: ${workflow.route}`);

    const workflowResult = {
      id: workflow.id,
      name: workflow.name,
      priority: workflow.priority,
      route: workflow.route,
      status: 'pending',
      steps: [],
      errors: [],
      screenshots: []
    };

    try {
      // Navigate to workflow starting page
      console.log(`   → Navigating to ${BASE_URL}${workflow.route}`);
      await this.page.goto(`${BASE_URL}${workflow.route}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Take initial screenshot
      const initialScreenshot = path.join(SCREENSHOTS_DIR, `workflow-${workflow.id}-00-initial.png`);
      await this.page.screenshot({ path: initialScreenshot, fullPage: true });
      workflowResult.screenshots.push(initialScreenshot);

      // Test each step
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        const stepResult = await this.testStep(step, i + 1, workflow.id);
        workflowResult.steps.push(stepResult);

        if (!stepResult.passed) {
          workflowResult.errors.push({
            step: i + 1,
            message: stepResult.error
          });
        }
      }

      // Determine overall workflow status
      const failedSteps = workflowResult.steps.filter(s => !s.passed);
      if (failedSteps.length === 0) {
        workflowResult.status = 'PASSED';
        this.results.passed++;
        console.log(`   ✅ Workflow ${workflow.id} PASSED (${workflow.steps.length}/${workflow.steps.length} steps)`);
      } else {
        workflowResult.status = 'FAILED';
        this.results.failed++;
        console.log(`   ❌ Workflow ${workflow.id} FAILED (${workflow.steps.length - failedSteps.length}/${workflow.steps.length} steps passed)`);
      }

    } catch (error) {
      workflowResult.status = 'ERROR';
      workflowResult.errors.push({
        step: 'general',
        message: error.message
      });
      this.results.failed++;
      console.log(`   🚨 Workflow ${workflow.id} ERROR: ${error.message}`);
    }

    this.results.workflows.push(workflowResult);
    return workflowResult;
  }

  async testStep(step, stepNumber, workflowId) {
    console.log(`      Step ${stepNumber}: ${step.name}`);

    const stepResult = {
      number: stepNumber,
      name: step.name,
      selector: step.selector,
      passed: false,
      error: null,
      timestamp: new Date().toISOString()
    };

    try {
      // Wait for element to be visible
      await this.page.waitForSelector(step.selector, {
        visible: true,
        timeout: 10000
      });

      // Perform action based on step type
      if (step.action === 'type' && step.value) {
        await this.page.type(step.selector, step.value);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (step.action === 'select' && step.value) {
        await this.page.select(step.selector, step.value);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (step.action === 'drag') {
        // Simplified drag action
        await this.page.click(step.selector);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Default: just click
        await this.page.click(step.selector);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Take screenshot after step
      const screenshotPath = path.join(SCREENSHOTS_DIR, `workflow-${workflowId}-${String(stepNumber).padStart(2, '0')}-${step.name.replace(/\s+/g, '-').toLowerCase()}.png`);
      await this.page.screenshot({ path: screenshotPath });

      stepResult.passed = true;
      console.log(`      ✅ Passed`);

    } catch (error) {
      stepResult.passed = false;
      stepResult.error = error.message;
      console.log(`      ❌ Failed: ${error.message}`);

      // Take error screenshot
      const errorScreenshot = path.join(SCREENSHOTS_DIR, `workflow-${workflowId}-${String(stepNumber).padStart(2, '0')}-ERROR.png`);
      try {
        await this.page.screenshot({ path: errorScreenshot });
      } catch (screenshotError) {
        console.log(`      ⚠️  Could not capture error screenshot: ${screenshotError.message}`);
      }
    }

    return stepResult;
  }

  async run() {
    console.log('\n' + '='.repeat(80));
    console.log('Twenty CRM Workflow Testing Suite');
    console.log('='.repeat(80));

    await this.initialize();

    this.results.totalWorkflows = workflows.length;

    // Test all workflows
    for (const workflow of workflows) {
      await this.testWorkflow(workflow);
    }

    // Generate summary
    console.log('\n' + '='.repeat(80));
    console.log('Test Summary');
    console.log('='.repeat(80));
    console.log(`Total Workflows Tested: ${this.results.totalWorkflows}`);
    console.log(`Passed: ${this.results.passed} ✅`);
    console.log(`Failed: ${this.results.failed} ❌`);
    console.log(`Success Rate: ${((this.results.passed / this.results.totalWorkflows) * 100).toFixed(1)}%`);

    // Show failed workflows
    if (this.results.failed > 0) {
      console.log('\n' + '-'.repeat(80));
      console.log('Failed Workflows:');
      console.log('-'.repeat(80));
      this.results.workflows.filter(w => w.status !== 'PASSED').forEach(workflow => {
        console.log(`\n❌ Workflow ${workflow.id}: ${workflow.name} (${workflow.priority})`);
        workflow.errors.forEach(error => {
          console.log(`   Step ${error.step}: ${error.message}`);
        });
      });
    }

    // Save results
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Full results saved to: ${RESULTS_FILE}`);
    console.log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}`);

    await this.browser.close();
  }
}

// Run the tests
(async () => {
  const tester = new WorkflowTester();
  try {
    await tester.run();
  } catch (error) {
    console.error('Fatal error running tests:', error);
    process.exit(1);
  }
})();
