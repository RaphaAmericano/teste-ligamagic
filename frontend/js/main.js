import { postLogin, postSignin } from "./requests.js"

async function submitLogin(data){
    const { email, password } = event.target.elements
    if(!email.value || !password.value) throw Error("Password e email são obrigatórios.")
    await postLogin(email.value.trim(), password.value.trim())
}
async function submitSignin(data){
    const { email, password, repeatPassword } = event.target.elements
    if(!email.value || !password.value || !repeatPassword.value) throw Error("Password, repetição do password e email são obrigatórios.")
    if(password.value.trim().length < 6) throw Error("Passwords deve conter 6 caractéres.")
    if(password.value.trim() !== repeatPassword.value.trim()) throw Error("Passwords não estão iguais.")
    await postSignin(email.value.trim(), password.value.trim())
}

const actions = {
    login: submitLogin,
    signin: submitSignin
}

async function submitForm(event){
    event.preventDefault()
    const action = event.submitter.dataset.action
    const fn = actions[action]
    // TODO: trazer o try catch para cá e o redirect
    try {
        await fn(event.target.elements)
        window.location.href = "./dashboard.html"
    } catch (error) {
        alert(error.message)
    } finally {

    }

}

(() => {
    console.log('Funcionando')

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.forms[0]
        if(!form){
            console.error('Erro ao carregar o form')
            return 
        }
        const loginSubmitButton = document.getElementById('loginSubmitButton')
        const signinSubmitButton = document.getElementById('signinSubmitButton')

        if( !loginSubmitButton && !signinSubmitButton ) return 

        form.addEventListener('submit', submitForm)
    })

})()