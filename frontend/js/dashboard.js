const cardGames = new Set(['magic', 'pokemon', 'yugioh'])

const selectBoxSelectorsMap = {
    gameSet: '[name="card_set"]',
    rarity: '[name="rarity"]',
}

function clearSelectBox(selector){
    const setSelectBox = document.querySelector(selector);
    setSelectBox.innerHTML = ""
}
async function loadSets(cardGame){
    const res = await fetch('./json/sets.json')
    const data = await res.json()
    return data[cardGame]
}

async function loadRarity(cardGame){
    const res = await fetch('./json/rarity.json')
    const data = await res.json()
    return data[cardGame]
}

async function loadSetSelect(cardGame){
    const sets = await loadSets(cardGame)
    if(!sets) return 
    const selector = selectBoxSelectorsMap['gameSet']
    const setSelectBox = document.querySelector(selector);
    clearSelectBox(selector)
    for(const set of sets){
        const option = document.createElement('option')
        option.value = set.id 
        option.textContent = set.name
        setSelectBox.appendChild(option)
    }
}
async function loadRaritySelect(cardGame){
    const raritys = await loadRarity(cardGame)
    if(!raritys) return 
    const selector = selectBoxSelectorsMap['rarity']
    const raritysSelectBox = document.querySelector(selector);
    clearSelectBox(selector)
    for(const rarity of raritys){
        const option = document.createElement('option')
        option.value = rarity.id 
        option.textContent = rarity.name
        raritysSelectBox.appendChild(option)
    }
}

async function setSelectOnChangeEvent(event){
    const cardGame = event.target.value
    if(!cardGames.has(cardGame)) return
    await loadSetSelect(cardGame)
    await loadRaritySelect(cardGame)
}

( async () => {
    const res = await fetch('./json/rarity.json')
    const data = await res.json()
    
    const newCardForm = document.getElementById('newCardForm')
    
    const setCardGameBox = document.querySelector('[name="card_game"]');
    if(!setCardGameBox) throw new Error('Erro ao carregar seleção de card game')

    setCardGameBox.addEventListener('change', setSelectOnChangeEvent)
    

})()