import { postNewCard } from "./requests.js"

export async function submitNewCard(data){
    console.log('data', data)
    // TODO: validações
    return await postNewCard(data)
} 