import { postNewCard, putEditCard, postCardImage, getUserCards, getCardById, deleteCardById } from "./requests.js"

const CARD_GAMES = new Set(['magic', 'pokemon', 'yugioh']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function validateNewCardForm(data){
    const errors = [];

    const name_pt = data.get('name_pt')?.trim();
    const name_en = data.get('name_en')?.trim();
    const card_game = data.get('card_game');
    const card_set = data.get('card_set');
    const rarity = data.get('rarity');
    const image = data.get('image');
    console.log(image)
    if(!name_pt) errors.push('Nome em português é obrigatório')
    if(!name_en) errors.push('Nome em inglês é obrigatório')
    if(!CARD_GAMES.has(card_game)) errors.push('Card game inválido')
    if(!card_set) errors.push('Edição é obrigatória')
    if(!rarity) errors.push('Raridade é obrigatória')
    if(!image || image.size === 0) errors.push('Imagem da carta é obrigatória')

    if(image && image.size > 0 ){
        if(!ALLOWED_IMAGE_TYPES.includes(image.type)){
            errors.push("Imagem deve ser JPEG, PNG, WebP ou GIF")
        }
        if(image.size > MAX_FILE_SIZE){
            errors.push(`Imagem deve ter no máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`)
        }
    }

    return errors
}

function validateEditCardForm(data){
    const errors = [];

    const id = data.get('id')
    const name_pt = data.get('name_pt')?.trim();
    const name_en = data.get('name_en')?.trim();
    const card_game = data.get('card_game');
    const card_set = data.get('card_set');
    const rarity = data.get('rarity');
    const image = data.get('image');
    
    if(!id) errors.push('Id da carta é obrigatório')
    if(!name_pt) errors.push('Nome em português é obrigatório')
    if(!name_en) errors.push('Nome em inglês é obrigatório')
    if(!CARD_GAMES.has(card_game)) errors.push('Card game inválido')
    if(!card_set) errors.push('Edição é obrigatória')
    if(!rarity) errors.push('Raridade é obrigatória')

    if(image && image.size > 0 ){
        if(!ALLOWED_IMAGE_TYPES.includes(image.type)){
            errors.push("Imagem deve ser JPEG, PNG, WebP ou GIF")
        }
        if(image.size > MAX_FILE_SIZE){
            errors.push(`Imagem deve ter no máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`)
        }
    }

    return errors
}

function formatEditResults(results){
    const output = { success: true, messages: [], errors: [] }
    const labels = ['Dados da carta', 'Imagem'];

    results.forEach((result, index) => {
        const label = labels[index] || `Operação ${index + 1 }`;
        if(result.status === 'fulfilled'){
            output.messages.push(`${label}: ${result.value.message}`);
            if(result.value.img_url){
                output.newImageUrl = result.value.img_url;
            }
        } else {
            output.success = false;
            output.errors.push(`${label}: ${result.reason.message}`);
        }
    })

    return output;
}

export async function submitNewCard(data){
    const errors = validateNewCardForm(data)
    if(errors.length > 0){
        throw new Error(errors.join('\n'))
    }

    return await postNewCard(data)
} 

export async function submitEditCard(data){
    const errors = validateEditCardForm(data)
    const id = data.get('id');

    if(errors.length > 0){
        throw new Error(errors.join('\n'))
    }
    // promises com postCardImage
    const params = new URLSearchParams();
    for(const key of ['name_pt','name_en', 'card_game', 'card_set', 'rarity']){
        const value = data.get(key);
        if(value !== null && value !== '') params.append(key, value);
    }
    const image = data.get('image');
    const promises = [putEditCard(id, params)];
    if(image && image.size > 0){
        const imageForm = new FormData()
        imageForm.append('image', image)
        promises.push(postCardImage(id, imageForm))
    }
    const results = await Promise.allSettled(promises)
    return formatEditResults(results)
} 

export async function submitDeleteCard(card_id){
    if(!card_id) throw new Error("Id da carta a ser excluída é obrigatório");
    return await deleteCardById(card_id);
}
export async function getAllUserCards(){
    return await getUserCards();
}
export async function getUserCardById(card_id){
    return await getCardById(card_id);
}