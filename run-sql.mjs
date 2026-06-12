import { chromium } from '@playwright/test'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SQL = readFileSync(path.join(__dirname, 'supabase-minimal.sql'), 'utf8')
const tmpDir = path.join(os.tmpdir(), 'pw-supabase-' + Date.now())

async function run() {
  console.log('🚀 Opening Supabase SQL editor...')

  const browser = await chromium.launchPersistentContext(tmpDir, {
    channel: 'chrome',
    headless: false,
    slowMo: 200,
    args: ['--window-size=1400,900'],
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()

  // Use domcontentloaded — faster, doesn't wait for all network
  await page.goto(
    'https://supabase.com/dashboard/project/zodajmbqwbgxhqrmcsst/sql/new',
    { waitUntil: 'domcontentloaded', timeout: 60000 }
  )

  console.log('⏳ Waiting for page...')

  // Check if we need to log in
  await page.waitForTimeout(3000)
  const url = page.url()
  console.log('Current URL:', url)

  if (url.includes('sign-in') || url.includes('auth') || url.includes('login')) {
    console.log('⚠️  Not logged in — please log in manually in the browser window')
    console.log('   After logging in, the SQL editor will open automatically')
    // Wait up to 60s for user to log in
    await page.waitForURL('**/sql**', { timeout: 60000 })
  }

  // Wait for Monaco editor or CodeMirror
  console.log('⏳ Waiting for SQL editor...')
  await page.waitForSelector('.monaco-editor, .cm-editor, [data-testid="sql-editor"]', {
    timeout: 30000,
  }).catch(() => console.log('Editor selector not found, trying anyway'))

  await page.waitForTimeout(2000)

  // Click into editor
  try {
    const monacoEditor = page.locator('.monaco-editor').first()
    if (await monacoEditor.isVisible({ timeout: 3000 })) {
      await monacoEditor.click()
    } else {
      await page.click('body')
    }
  } catch {
    await page.click('body')
  }

  await page.waitForTimeout(500)

  // Select all and replace with SQL
  await page.keyboard.press('Meta+a')
  await page.waitForTimeout(300)
  await page.keyboard.insertText(SQL)
  await page.waitForTimeout(1000)

  console.log('▶️  Running SQL (Cmd+Enter)...')
  await page.keyboard.press('Meta+Enter')
  await page.waitForTimeout(6000)

  // Take screenshot to verify result
  await page.screenshot({ path: path.join(__dirname, 'test-video', 'sql-result.png') })
  console.log('📸 Screenshot saved to test-video/sql-result.png')

  const text = await page.evaluate(() => document.body.innerText.slice(0, 500))
  console.log('\nPage content snippet:\n', text)

  await page.waitForTimeout(3000)
  await browser.close()
  console.log('\n✅ Done!')
}

run().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
