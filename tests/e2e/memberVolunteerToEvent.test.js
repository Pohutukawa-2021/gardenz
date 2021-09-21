const { chromium } = require('playwright')
const config = require('../../server/db/knexfile').development
const db = require('knex')(config)
const { serverUrl } = require('./index')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../server/.env') })
jest.setTimeout(20000)

let browser
let page
beforeAll(async () => {
  browser = await chromium.launch({
    headless: !!process.env.TEST_HEADLESS,
    slowMo: 500
  })
  await db.migrate.latest({ directory: './server/db/migrations' })
})

beforeEach(async () => {
  const context = await browser.newContext()
  context.clearCookies()
  page = await context.newPage()
  await db.seed.run({ directory: './server/db/seeds' })
})

afterEach(async () => {
  await page.close()
})

afterAll(async () => {
  await browser.close()
  return db.destroy()
})

// Test goes here
test('Member can Login & Volunteer', async () => {
  await page.goto(serverUrl)

  await Promise.all([page.waitForNavigation(), page.click('text=Sign in')])
  expect(await page.url()).toContain(
    'https://gardenz.au.auth0.com/u/login?state='
  )

  const testEmail = process.env.E2E_TEST_AUTH0_MEMBER_EMAIL
  const testPassword = process.env.E2E_TEST_AUTH0_MEMBER_PASSWORD

  await page.fill('#username', testEmail)
  await page.fill('#password', testPassword)

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit]', { force: true })
  ])

  await Promise.all([page.waitForNavigation(), page.click('text=My Garden')])
  expect(await page.url()).toBe(`${serverUrl}/gardens/1`)

  await page.click('.button-secondary')
  expect(await page.$eval('.button-secondary', (el) => el.innerText)).toMatch(
    /Un-Volunteer/
  )
})
