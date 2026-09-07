import { submitNewCard } from "./cards.js"
const cardGames = new Set(['magic', 'pokemon', 'yugioh'])

const selectBoxSelectorsMap = {
    gameSet: '[name="card_set"]',
    rarity: '[name="rarity"]',
}

function clearSelectBox(selector){
    const setSelectBox = document.querySelector(selector);
    setSelectBox.innerHTML = ""
}

function toggleDisabledSubmitForm(){
    const submitButton = document.getElementById('submitNewCardButton')
    submitButton.disabled = !submitButton.disabled
}

function toggleRequest(){
    const infoDiv = document.getElementById('infoDiv') 
    infoDiv.classList.toggle('hidden')
}

function addInfoMessage(value){
    const infoDiv = document.getElementById('infoDiv')
    const warningTextSpan = document.getElementById('warningText')
    warningTextSpan.innerText = value;
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
        option.value = rarity.code 
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

async function submitNewCardForm(event){
    event.preventDefault()
    const formData = new FormData(event.target);
    toggleDisabledSubmitForm()
    toggleRequest();

    let dots = '';
    const loadingInterval = setInterval(() => {
        dots = dots.length >= 3 ? "" : dots + '.';
        addInfoMessage('Salvando nova carta ' + dots)
    }, 400 )
    
    try {
        await new Promise(r => setTimeout(r, 800));
        const response = await submitNewCard(formData)
        clearInterval(loadingInterval)
        console.log(response)
        addInfoMessage(response.message)
    } catch (error) {
        console.error(error);
        clearInterval(loadingInterval)
        addInfoMessage(error || "Erro ao salvar nova carta.")
    } finally  {
        setTimeout(() => {
            console.log('Finally...')
            toggleDisabledSubmitForm()
            addInfoMessage("")
            event.target.reset()
            toggleRequest()
        }, 5000);
    }
}   

( () => {
    document.addEventListener('DOMContentLoaded', async () => {
        const res = await fetch('./json/rarity.json')
        const data = await res.json()
        const setCardGameBox = document.querySelector('[name="card_game"]')

        if(!setCardGameBox) throw new Error('Erro ao carregar seleção de card game')
            
        setCardGameBox.addEventListener('change', setSelectOnChangeEvent)
            
        const newCardForm = document.getElementById('newCardForm')
        if(!newCardForm) throw new Error('Erro ao carregar formulário de nova carta')
        
        newCardForm.addEventListener('submit', submitNewCardForm)
    })

})()