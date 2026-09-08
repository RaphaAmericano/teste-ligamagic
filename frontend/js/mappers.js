export async function loadMappers(){
    const [setResponse, rarityResponse] = await Promise.all([
        fetch('./json/sets.json').then(r => r.json()),
        fetch('./json/rarity.json').then(r => r.json())
    ])
    const setMapper = {}
    for(const [game,sets] of Object.entries(setResponse)){
        setMapper[game] = Object.fromEntries(sets.map(s => [s.id, s.name]))
    }

    const rarityMapper = {};
    for(const[game, rarities] of Object.entries(rarityResponse)){
        rarityMapper[game] = Object.fromEntries(rarities.map(r => [r.code, r.name]))
    }

    return { setMapper, rarityMapper }
}

export function cardGameMapper(card_game){
    const cardGameMap = new Map([['magic', 'Magic: The Gathering'], ['pokemon', 'Pokémon'], ['yugioh', 'Yu-Gi-Oh!']])
    return cardGameMap.get(card_game) ?? card_game;
}