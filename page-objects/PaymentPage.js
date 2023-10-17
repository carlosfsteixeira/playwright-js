import { expect } from "@playwright/test"
import { paymentDetails } from "../data/paymentDetails"

export class PaymentPage{
    constructor(page){
        this.page = page

        // discount locators
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]').locator('[data-qa="discount-code"]')
        this.discountInput = page.getByPlaceholder('Discount code')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.valueAfterDiscount = page.locator('[data-qa="total-with-discount-value"]')
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')

        // payment details locators
        this.creditCardOwner = page.getByPlaceholder('Credit card owner')
        this.creditCardNumber = page.getByPlaceholder('Credit card number')
        this.creditCardDate = page.getByPlaceholder('Valid until')
        this.creditCardCvv = page.getByPlaceholder('Credit card CVC')

        // payment button
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async() => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()

        await this.discountInput.waitFor()

        // Option 1 for laggy inputs: using .fill() with await expect 
        //await this.discountInput.fill(code)
        //await expect(this.discountInput).toHaveValue(code)

        // Option 2  for laggy inputs: slow typing
        await this.discountInput.focus()
        await this.page.keyboard.type(code, {delay: 1000})
        expect(await this.discountInput.inputValue()).toBe(code)

        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()

        await this.discountActiveMessage.waitFor()
        await this.valueAfterDiscount.waitFor()
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creditCardOwner.fill(paymentDetails.owner)
        await this.creditCardNumber.fill(paymentDetails.number)
        await this.creditCardDate.fill(paymentDetails.validUntil)
        await this.creditCardCvv.fill(paymentDetails.cvv)
    }

    finishPayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/)
    }
}