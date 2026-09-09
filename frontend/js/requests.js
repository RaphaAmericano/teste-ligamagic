import { get, post, ddelete,  postFormData, putFormData } from "./services.js"

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
export async function putEditCard(card_id, data){
    const token = localStorage.getItem('ligamagicJwtToken')
    return await putFormData(`/card/${card_id}`, data, token);
}
export async function postCardImage(card_id, data){
    const token = localStorage.getItem('ligamagicJwtToken')
    return await postFormData(`/card/${card_id}/image`, data, token);
}

export async function getUserCards(){
    const token = localStorage.getItem('ligamagicJwtToken');
    return await get('/cards', token)
}
export async function getCardById(card_id){
    const token = localStorage.getItem('ligamagicJwtToken');
    return await get(`/card/${card_id}`, token)
}
export async function deleteCardById(card_id){
    const token = localStorage.getItem('ligamagicJwtToken')
    return await ddelete(`/card/${card_id}`, token);
}