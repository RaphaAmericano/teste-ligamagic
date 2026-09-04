import { post } from "./services.js"

export async function postLogin(email, password){
    return await post('/login', { email, password})
}
export async function postSignin(email, password, repeatPassword){
    return await post('/register', { email, password })
}