import {test} from "@playwright/test"
import {v4 as uuidv4} from "uuid"
import {ProductsPage} from "./../page-objects/ProductsPage"
import {Navigation} from "./../page-objects/Navigation.js"
import {Checkout} from "./../page-objects/Checkout.js"
import {LoginPage} from "./../page-objects/LoginPage.js"
import {RegisterPage} from "./../page-objects/RegisterPage.js"
import {DeliveryDetails} from "./../page-objects/DeliveryDetails.js"
import {deliveryDetails as userDetails} from "./../data/deliveryDetails.js"
import {PaymentPage} from "./../page-objects/PaymentPage.js"
import {paymentDetails} from "./../data/paymentDetails.js"


test("New user full end-to-end test journey", async({page}) => {
    // new instances
    const productsPage = new ProductsPage(page)
    const navigation = new Navigation(page)
    const checkout = new Checkout(page)
    const login = new LoginPage(page)
    const registerPage = new RegisterPage(page)
    const deliveryDetails = new DeliveryDetails(page)
    const paymentPage = new PaymentPage(page)

    // navigate to specified url in playwright.config.js
    await productsPage.visit()

    // sort the products
    await productsPage.sortByCheapest()

    // click the first 3 products by index
    await productsPage.addProductToBasket(0)
    await productsPage.addProductToBasket(1)
    await productsPage.addProductToBasket(2)

    // go to checkout
    await navigation.goToCheckout()

    // in checkout, remove the cheapest product
    await checkout.removeCheapestProduct()
    
    // continue to checkout after removing item
    await checkout.continueToCheckout()

    // go to sign up page
    await login.moveToSignUp()

    const email = uuidv4() + "@email.com"
    const password = uuidv4()

    // create new account
    await registerPage.signUpAsNewUser(email, password)

    // fill delivery details
    await deliveryDetails.fillDetails(userDetails)

    // save details
    await deliveryDetails.saveDetails()

    await deliveryDetails.continueToPayment()

    await paymentPage.activateDiscount()

    await paymentPage.fillPaymentDetails(paymentDetails)

    await paymentPage.finishPayment()
})