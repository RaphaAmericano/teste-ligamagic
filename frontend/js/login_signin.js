import { submitLogin, submitSignin, checkJwtToken } from "./auth.js"

function toggleFormLoader(){
    const form = document.querySelector('.main-form')
    const submitButton = document.getElementById('signinSubmitButton');
    const loader = document.querySelector('.loader')
    form.disabled = !form.disabled
    loader.classList.toggle('hidden')
}

const actions = {
    login: submitLogin,
    signin: submitSignin
}

function setWaringMessages(message){
    const messageBox = document.querySelector('.loader')
    const [h4Tag] = messageBox.children;
    h4Tag.innerText = message;
}

async function submitForm(event){
    event.preventDefault()
    toggleFormLoader()
    const action = event.submitter.dataset.action
    const fn = actions[action]
    let hasError = false;

    try {
        const response = await fn(event.target.elements)
        if(response.token){
            localStorage.setItem('ligamagicJwtToken', response.token)
            window.location.href = "./dashboard.html"
        }
    } catch (error) {
        console.warn(error)
        hasError = true;

        setWaringMessages(error?.message || 'Erro ao realizar a operação');
    } finally {
        const delay = hasError ? 3000 : 0;
        setTimeout(() => toggleFormLoader(), delay)
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