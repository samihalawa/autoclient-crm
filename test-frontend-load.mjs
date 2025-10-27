import puppeteer from 'puppeteer';

async function testFrontendLoad() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Page loaded! Title:', await page.title());

    // Take a screenshot
    await page.screenshot({ path: 'frontend-loaded.png', fullPage: true });
    console.log('Screenshot saved to frontend-loaded.png');

    // Check for errors in console
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    // Wait a bit to see if there are any errors
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Frontend appears to be working!');

  } catch (error) {
    console.error('Error loading frontend:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

testFrontendLoad().catch(console.error);
