import { chromium } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'http://localhost:3000'
const VIDEO_DIR = path.join(__dirname, 'test-video')

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function run() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
    args: ['--window-size=1400,900', '--start-maximized'],
  })

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1400, height: 900 } },
    locale: 'ar',
    // Block WhatsApp so it doesn't open a new tab mid-test
    serviceWorkers: 'block',
  })

  // Close any popup tabs automatically
  context.on('page', async newPage => {
    const url = newPage.url()
    if (url.includes('wa.me') || url.includes('whatsapp')) {
      await newPage.close()
    }
  })

  const page = await context.newPage()

  // Block WhatsApp navigation
  await page.route('**wa.me**', route => route.abort())
  await page.route('**whatsapp.com**', route => route.abort())

  console.log('\n🎬 Starting full store walkthrough...\n')

  // ── 1. HOME PAGE ────────────────────────────────────────────────────
  console.log('📍 1/9  Home page')
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(2200)

  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }))
  await sleep(1000)
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'smooth' }))
  await sleep(1200)
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))
  await sleep(1500)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  await sleep(800)

  // ── 2. PRODUCTS PAGE ───────────────────────────────────────────────
  console.log('📍 2/9  Products page')
  await page.click('a[href="/products"]')
  await page.waitForLoadState('networkidle')
  await sleep(2000)

  // filter skincare
  const skinBtn = page.locator('button', { hasText: 'العناية بالبشرة' }).first()
  if (await skinBtn.isVisible()) {
    await skinBtn.click()
    await sleep(1200)
  }

  // search
  const searchBox = page.locator('input[placeholder*="بحث"]')
  if (await searchBox.isVisible()) {
    await searchBox.fill('سيروم')
    await sleep(1000)
    await searchBox.fill('')
    await sleep(600)
  }

  // reset to all
  const allBtn = page.locator('button', { hasText: 'جميع' }).first()
  if (await allBtn.isVisible()) { await allBtn.click(); await sleep(800) }

  // ── 3. PRODUCT DETAIL PAGE ─────────────────────────────────────────
  console.log('📍 3/9  Product detail')
  const firstCard = page.locator('a[href^="/products/"]').first()
  const productHref = await firstCard.getAttribute('href')
  await page.goto(BASE + productHref, { waitUntil: 'networkidle' })
  await sleep(2000)

  // increase qty
  const qtyPlus = page.locator('button:has-text("+")').first()
  if (await qtyPlus.isVisible()) {
    await qtyPlus.click(); await sleep(500)
    await qtyPlus.click(); await sleep(500)
  }

  // scroll to see description
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }))
  await sleep(800)

  // add to cart
  const addToCart = page.locator('button', { hasText: 'أضف للسلة' }).first()
  if (await addToCart.isVisible()) {
    await addToCart.click()
    await sleep(1500)
  }

  // ── 4. ADD SECOND PRODUCT ──────────────────────────────────────────
  console.log('📍 4/9  Adding second product')
  await page.goto(BASE + '/products', { waitUntil: 'networkidle' })
  await sleep(1200)

  const productCards = await page.locator('a[href^="/products/"]').all()
  if (productCards.length > 1) {
    const secondHref = await productCards[1].getAttribute('href')
    await page.goto(BASE + secondHref, { waitUntil: 'networkidle' })
    await sleep(1500)
    const addBtn2 = page.locator('button', { hasText: 'أضف للسلة' }).first()
    if (await addBtn2.isVisible()) {
      await addBtn2.click()
      await sleep(1200)
    }
  }

  // ── 5. CART PAGE ───────────────────────────────────────────────────
  console.log('📍 5/9  Cart page')
  await page.goto(BASE + '/cart', { waitUntil: 'networkidle' })
  await sleep(2000)

  // adjust quantities
  const minus = page.locator('button:has-text("−")').first()
  if (await minus.isVisible()) { await minus.click(); await sleep(600) }
  const plus = page.locator('button:has-text("+")').first()
  if (await plus.isVisible()) { await plus.click(); await sleep(600) }

  await sleep(1000)
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }))
  await sleep(800)

  // ── 6. CHECKOUT PAGE ───────────────────────────────────────────────
  console.log('📍 6/9  Checkout page')
  await page.goto(BASE + '/checkout', { waitUntil: 'networkidle' })
  await sleep(1500)

  await page.fill('input[placeholder*="اسم"]', 'سارة المحمد')
  await sleep(400)
  await page.fill('input[type="tel"]', '0791234567')
  await sleep(400)

  const citySelect = page.locator('select').first()
  if (await citySelect.isVisible()) {
    await citySelect.selectOption({ index: 2 }) // عمان
    await sleep(400)
  }

  await page.fill('textarea', 'شارع الملكة رانيا، مقابل الجامعة الأردنية، عمان')
  await sleep(700)

  await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'smooth' }))
  await sleep(1200)

  // ── 7. PLACE ORDER ─────────────────────────────────────────────────
  console.log('📍 7/9  Placing order')
  const submitBtn = page.locator('button[type="submit"]').first()
  await submitBtn.click()
  await sleep(4000) // wait for success + WhatsApp (which we block)

  // ── 8. SUCCESS PAGE ────────────────────────────────────────────────
  console.log('📍 8/9  Order success screen')
  await sleep(2500)

  // ── 9. ADMIN DASHBOARD ─────────────────────────────────────────────
  console.log('📍 9/9  Admin dashboard')
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' })
  await sleep(1500)

  // admin login form should be visible
  const pwdInput = page.locator('input[type="password"]')
  await pwdInput.waitFor({ state: 'visible', timeout: 10000 })
  await pwdInput.fill('admin123')
  await sleep(500)
  await page.click('button[type="submit"]')
  await page.waitForLoadState('networkidle')
  await sleep(2500)

  // view the new order
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }))
  await sleep(1500)

  // update order status → processing
  const statusProcessing = page.locator('button', { hasText: 'جاري التجهيز' }).first()
  if (await statusProcessing.isVisible()) {
    await statusProcessing.click()
    await sleep(1200)
  }

  // update to delivered
  const statusDelivered = page.locator('button', { hasText: 'تم التسليم' }).first()
  if (await statusDelivered.isVisible()) {
    await statusDelivered.click()
    await sleep(1200)
  }

  // switch to products tab
  const productsTab = page.locator('button', { hasText: 'المنتجات' }).first()
  if (await productsTab.isVisible()) {
    await productsTab.click()
    await sleep(1800)
  }

  // open add product form
  await page.goto(BASE + '/admin/products/new', { waitUntil: 'networkidle' })
  await sleep(1500)

  await page.fill('input[placeholder*="بالعربية"]', 'كريم مرطب فيتامين E')
  await sleep(300)
  await page.fill('input[placeholder*="English"]', 'Vitamin E Moisturizing Cream')
  await sleep(300)
  await page.fill('input[type="number"][placeholder="0.00"]', '9.500')
  await sleep(300)
  await page.fill('input[type="number"][placeholder="0"]', '50')
  await sleep(300)
  await page.fill('textarea[placeholder*="بالعربية"]', 'كريم مرطب غني بفيتامين E لترطيب البشرة الجافة والعادية')
  await sleep(400)
  await page.fill('textarea[placeholder*="English"]', 'Rich Vitamin E cream for intense moisturizing of dry and normal skin')
  await sleep(500)

  await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }))
  await sleep(1500)

  // go back to admin
  const backBtn = page.locator('button').filter({ hasText: '' }).first()
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' })
  await sleep(500)
  const pwdInput2 = page.locator('input[type="password"]')
  if (await pwdInput2.isVisible({ timeout: 3000 }).catch(() => false)) {
    await pwdInput2.fill('admin123')
    await page.click('button[type="submit"]')
    await page.waitForLoadState('networkidle')
  }
  await sleep(2000)

  // final scroll on admin
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'smooth' }))
  await sleep(1500)

  console.log('\n✅ Walkthrough complete!\n')
  await sleep(2000)

  await context.close()
  await browser.close()

  console.log(`🎥 Video saved → ${VIDEO_DIR}`)
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
