import {expect} from "@playwright/test"

export class DeliveryDetails{
    constructor(page) {
        this.page = page

        // locating and attributing values to the variables from the inputs in the front end page
        this.firstName = page.locator('[data-qa="delivery-first-name"]')
        this.lastName = page.locator('[data-qa="delivery-last-name"]')
        this.street = page.locator('[data-qa="delivery-address-street"]')
        this.postCode = page.locator('[data-qa="delivery-postcode"]')
        this.city = page.locator('[data-qa="delivery-city"]')
        this.countryDropdown = page.locator('[data-qa="country-dropdown"]')
        this.saveAddressButton = page.getByRole('button', {name: 'Save address for next time'})
        this.savedAddressContainer = page.locator('[data-qa="saved-address-container"]')
        this.continueToPaymentButton = page.getByRole('button', {name: 'Continue to payment'})

        // extract input from fields
        this.savedAddressFirstName = page.locator('[data-qa="saved-address-firstName"]')
        this.savedAddressLastName = page.locator('[data-qa="saved-address-lastName"]')
        this.savedAddressStreet = page.locator('[data-qa="saved-address-street"]')
        this.savedAddressPostCode = page.locator('[data-qa="saved-address-postCode"]')
        this.savedAddressCity = page.locator('[data-qa="saved-address-city"]')
        this.savedAddressCountry = page.locator('[data-qa="saved-address-country"]')

        
    }

    // method receives the user details object
    fillDetails = async (userDetails) => {
        await this.firstName.waitFor()
        await this.firstName.fill(userDetails.firstName)
        await this.lastName.waitFor()
        await this.lastName.fill(userDetails.lastName)
        await this.street.waitFor()
        await this.street.fill(userDetails.street)
        await this.postCode.waitFor()
        await this.postCode.fill(userDetails.postCode)
        await this.city.waitFor()
        await this.city.fill(userDetails.city)
        await this.countryDropdown.waitFor()
        await this.countryDropdown.selectOption(userDetails.countryDropdown)
    }

    // checks if there is any saved address and compares the saved details to what was actually input 
    saveDetails = async () => {
        const addressCountBeforeSaving = await this.savedAddressContainer.count()
        await this.saveAddressButton.click()
        await expect(this.savedAddressContainer).toHaveCount(addressCountBeforeSaving + 1) 

        await this.savedAddressLastName.first().waitFor()
        expect(await this.savedAddressFirstName.first().innerText()).toBe(await this.firstName.inputValue())
    }

    continueToPayment = async () => {
        await this.continueToPaymentButton.waitFor()
        await this.continueToPaymentButton.click()
        await this.page.waitForURL(/\/payment/, {timeout: 3000})
    }
}