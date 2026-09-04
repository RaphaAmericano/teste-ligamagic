import { submitLogin, submitSignin } from "./auth.js"

const actions = {
    login: submitLogin,
    signin: submitSignin
}

async function submitForm(event){
    event.preventDefault()
    const action = event.submitter.dataset.action
    const fn = actions[action]
    try {
        const response = await fn(event.target.elements)
        if(response.token){
            localStorage.setItem('ligamagicJwtToken', response.token)
            window.location.href = "./dashboard.html"
        }
    } catch (error) {
        console.warn(error)
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