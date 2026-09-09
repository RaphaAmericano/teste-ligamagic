import { postLogin, postSignin } from "./requests.js"
import { validateEmail } from "./utils.js"

export async function submitLogin(data){
    const { email, password } = event.target.elements
    if(!email.value || !password.value) throw Error("Password e email são obrigatórios.")
    return await postLogin(email.value.trim(), password.value.trim())
}
export async function submitSignin(data){
    const { email, password, repeatPassword } = event.target.elements
    if(!email.value || !password.value || !repeatPassword.value) throw Error("Password, repetição do password e email são obrigatórios.")
    if(password.value.trim().length < 6) throw Error("Passwords deve conter 6 caractéres.")
    if(password.value.trim() !== repeatPassword.value.trim()) throw Error("Passwords não estão iguais.")
    if(!validateEmail(email.value)) throw Error("Email inválido.")
    return await postSignin(email.value.trim(), password.value.trim())
}

export function checkJwtToken(){
    const token = localStorage.getItem('ligamagicJwtToken');
    if(!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        return false
    }
}