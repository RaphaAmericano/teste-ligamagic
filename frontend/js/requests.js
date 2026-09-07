import { get, post, postFormData } from "./services.js"

export async function postLogin(email, password){
    return await post('/login', { email, password})
}
export async function postSignin(email, password){
    return await post('/register', { email, password })
}
export async function postNewCard(data){
    const token = localStorage.getItem('ligamagicJwtToken')
    return await postFormData('/card', data , token)
}

export async function getUserCards(){
    const token = localStorage.getItem('ligamagicJwtToken');
    return await get('/cards', token)
}