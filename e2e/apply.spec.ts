import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from '@playwright/test'

test('candidate can submit the apply form', async ({ page }) => {
  page.on('pageerror', (error) => {
    console.error(`pageerror: ${error.message}`)
  })
  const localPhone = `29${Date.now().toString().slice(-7)}`

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 })

  await page.getByLabel('Имя').fill('Анна Ковалева')
  await page.getByLabel('Телефон').fill(localPhone)
  await page.getByLabel('Город').selectOption('Минск')
  await page.getByLabel('Желаемая позиция').fill('Продавец-консультант')

  await expect(page.getByRole('img', { name: '100%' })).toBeVisible()

  await page.getByRole('switch', { name: 'Согласен на обработку персональных данных' }).click()
  await page.getByRole('button', { name: 'Отправить анкету' }).click()

  await expect(page.getByText('Заявка принята')).toBeVisible()

  const inboxPath = path.resolve(process.cwd(), 'data/applications.json')
  await expect
    .poll(async () => {
      try {
        const rows: unknown = JSON.parse(await readFile(inboxPath, 'utf8'))
        if (!Array.isArray(rows)) {
          return false
        }
        return rows.some(
          (row) =>
            typeof row === 'object' &&
            row !== null &&
            'phone' in row &&
            row.phone === `+375${localPhone}`,
        )
      } catch {
        return false
      }
    })
    .toBe(true)
})
