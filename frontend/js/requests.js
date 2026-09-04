import { post } from "./services.js"

export async function postLogin(email, password){
    await post('/login', { email, password})
}
export async function postSignin(email, password, repeatPassword){
    await post('/register', { email, password })
}