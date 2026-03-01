const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const seedUrls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=42',
    'https://sanand0.github.io/tdsdata/js_table/?seed=43',
    'https://sanand0.github.io/tdsdata/js_table/?seed=44',
    'https://sanand0.github.io/tdsdata/js_table/?seed=45',
    'https://sanand0.github.io/tdsdata/js_table/?seed=46',
    'https://sanand0.github.io/tdsdata/js_table/?seed=47',
    'https://sanand0.github.io/tdsdata/js_table/?seed=48',
    'https://sanand0.github.io/tdsdata/js_table/?seed=49',
    'https://sanand0.github.io/tdsdata/js_table/?seed=50',
    'https://sanand0.github.io/tdsdata/js_table/?seed=51',
  ];

  let grandTotal = 0;

  for (const url of seedUrls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for JS-rendered table to appear
      await page.waitForSelector('table', { timeout: 15000 });

      // Extract all numbers from all table cells
      const numbers = await page.$$eval('table td, table th', cells =>
        cells
          .map(c => parseFloat(c.innerText.replace(/,/g, '').trim()))
          .filter(n => !isNaN(n))
      );

      const seedTotal = numbers.reduce((a, b) => a + b, 0);
      console.log(`URL: ${url} => Sum: ${seedTotal}`);
      grandTotal += seedTotal;
    } catch (err) {
      console.error(`Failed to process ${url}: ${err.message}`);
    }
  }

  console.log(`Grand Total across all pages: ${grandTotal}`);
  await browser.close();
})();
