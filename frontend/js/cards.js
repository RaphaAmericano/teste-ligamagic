import { postNewCard } from "./requests.js"

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

export async function submitNewCard(data){
    const errors = validateNewCardForm(data)

    if(errors.length > 0){
        throw new Error(errors.join('\n'))
    }

    return await postNewCard(data)
} 