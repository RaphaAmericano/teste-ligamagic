import { submitLogin, submitSignin, checkJwtToken } from "./auth.js"

function toggleFormLoader(){
    const form = document.querySelector('.main-form')
    const loader = document.querySelector('.loader')
    form.classList.toggle('hidden')
    loader.classList.toggle('hidden')
}

const actions = {
    login: submitLogin,
    signin: submitSignin
}

async function submitForm(event){
    event.preventDefault()
    toggleFormLoader()
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
        toggleFormLoader()
    }
}

(() => {

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.forms[0]
        if(form){
            form.addEventListener('submit', submitForm)
        }
    })

})()