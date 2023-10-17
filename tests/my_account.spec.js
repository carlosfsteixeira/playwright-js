import {test} from "@playwright/test"
import { MyAccountPage } from "./../page-objects/MyAccountPage.js"
import { getLoginToken } from "./../api-calls/getLoginToken.js"
import { adminDetails } from "./../data/userDetails.js"

test("My account using cookie injection", async({page}) => {
    const myAccount = new MyAccountPage(page)

    // make request to get login token
    const loginToken = await getLoginToken(adminDetails.username, adminDetails.password)

    await page.route("**/api/user**", async (route, request) => {
        await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({message: "PLAYWRIGHT ERROR FROM MOCKING"}),
        })
    })

    await myAccount.visit()

    // inject the login token into the browser
    await page.evaluate(([loginTokenInsideBrowserCode]) => {
        document.cookie = "token=" + loginTokenInsideBrowserCode
    }, [loginToken])

    await myAccount.visit()   
    
    await myAccount.waitForErrorMessage()
})