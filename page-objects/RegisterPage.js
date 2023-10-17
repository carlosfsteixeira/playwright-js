import {expect} from "@playwright/test"

export class RegisterPage{
    constructor(page){
        this.page = page

        this.emailInput = page.getByPlaceholder('e-mail')
        this.passwordInput = page.getByPlaceholder('password')
        this.registerButton = page.getByRole('button', {name: 'register'})
    }

    signUpAsNewUser = async(email, password) => {
        await this.emailInput.waitFor()
        //const emailId = uuidv4()
        //const email = emailId + "@email.com"
        await this.emailInput.fill(email)
        //await this.passwordInput.waitFor()
        //const password = uuidv4()
        await this.passwordInput.fill(password)
        await this.registerButton.waitFor()
        await this.registerButton.click()

    }
}