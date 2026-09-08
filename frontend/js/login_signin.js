import { submitLogin, submitSignin, checkJwtToken } from "./auth.js"

function toggleFormLoader(){
    const form = document.querySelector('.main-form')
    const submitButton = document.getElementById('signinSubmitButton');
    const loader = document.querySelector('.loader')
    submitButton.disabled = !submitButton.disabled
    form.disabled = !form.disabled
    loader.classList.toggle('hidden')
}

const actions = {
    login: submitLogin,
    signin: submitSignin
}

function setWaringMessages(message){
    const messageBox = document.querySelector('.loader')
    console.log(messageBox)
    const [h4Tag] = messageBox.children;
    console.log(h4Tag)
    h4Tag.innerText = message;
    console.log(message)
}

async function submitForm(event){
    event.preventDefault()
    toggleFormLoader()
    const action = event.submitter.dataset.action
    const fn = actions[action]
    let hasError = false;

    try {
        const response = await fn(event.target.elements)
        console.log(response)
        if(response.token){
            localStorage.setItem('ligamagicJwtToken', response.token)
            window.location.href = "./dashboard.html"
        }
    } catch (error) {
        console.warn(error)
        hasError = true;

        setWaringMessages(error || 'Error ao realizar a operação');
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