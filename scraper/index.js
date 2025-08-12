const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const URL = 'https://udyamregistration.gov.in/UdyamRegistration.aspx';

(async () => {
  console.log('Launching puppeteer...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2' });

  // Wait a bit to allow dynamic content, if any
  await page.waitForTimeout(2000);

  // Extract visible form fields
  const fields = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('input, select, textarea'));
    const visible = nodes.filter(el => el.offsetParent !== null || el.type === 'radio' || el.type === 'checkbox');
    return visible.map(el => {
      const labelEl = document.querySelector(`label[for="${el.id}"]`) || el.closest('td')?.querySelector('label') || null;
      const label = labelEl ? labelEl.innerText.trim() : (el.placeholder || el.name || el.id || '');
      return {
        id: el.id || el.name || null,
        name: el.name || el.id || null,
        type: el.type || el.tagName.toLowerCase(),
        label,
        required: el.required || el.getAttribute('aria-required') === 'true' || false,
        pattern: el.getAttribute('pattern') || null,
        placeholder: el.placeholder || null
      };
    }).filter(f => f.id || f.name);
  });

  await fs.ensureDir('schema');
  await fs.writeJson('schema/udyam_fields.json', fields, { spaces: 2 });
  console.log('Saved schema to scraper/schema/udyam_fields.json (inspect and clean-up as needed)');
  await browser.close();
})();
