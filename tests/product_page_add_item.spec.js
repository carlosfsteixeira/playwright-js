import {test, expect} from "@playwright/test"

test.skip("Product Page Add to Basket", async ({page}) => {
    await page.goto("/")
    
    const addToBasketButton = await page.locator('[data-qa="product-button"]').first()
    const basketCounter = await page.locator('[data-qa="header-basket-count"]')

    await addToBasketButton.waitFor()
    await expect(basketCounter).toHaveText("0")
    await addToBasketButton.click()
    await expect(basketCounter).toHaveText("1")
})