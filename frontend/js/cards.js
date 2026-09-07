import { postNewCard } from "./requests.js"

export async function submitNewCard(data){
    // TODO: validações
    return await postNewCard(data)
} 