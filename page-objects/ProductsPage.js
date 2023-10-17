import {expect} from "@playwright/test"
import {Navigation} from "./Navigation.js"
import { isDesktopViewport } from "./../utilities/isDesktopViewport.js"

export class ProductsPage {

    constructor(page) {
        this.page = page

        this.addButtons = page.locator('[data-qa="product-button"]')

        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')

        this.productTitle = page.locator('[data-qa="product-title"]')
    }

    visit = async () => {
        await this.page.goto("/")
    }

    addProductToBasket = async (index) => {
        await this.addButtons.nth(index).waitFor()
        await expect(this.addButtons.nth(index)).toHaveText("Add to Basket")
        const navigation = new Navigation(this.page)

        // for desktop viewport only ---------------------------------------

        // basket counter needs to be initialized as undefined, use LET or VAR so it can reassigned again inside the IF condition
        let basketCountBeforeAdding

        if(isDesktopViewport(this.page)){
            basketCountBeforeAdding = await navigation.getBasketCount()
        }
        
        await this.addButtons.nth(index).click()
        await expect(this.addButtons.nth(index)).toHaveText("Remove from Basket")

        // for desktop viewport only -----------------------------------------
        if(isDesktopViewport(this.page)){
            const basketCountAfterAdding = await navigation.getBasketCount()
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)
        }
    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor()

        await this.productTitle.first().waitFor()

        const productTitlesBeforeSorting = await this.productTitle.allInnerTexts()

        await this.sortDropdown.selectOption("price-asc")

        const productTitlesAfterSorting = await this.productTitle.allInnerTexts()

        expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting)   
    }
}