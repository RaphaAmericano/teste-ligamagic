import { submitNewCard } from "./cards.js"
const cardGames = new Set(['magic', 'pokemon', 'yugioh'])

const selectBoxSelectorsMap = {
    gameSet: '[name="card_set"]',
    rarity: '[name="rarity"]',
}
function resetForm(form){
    form.reset();
    clearSelectBoxes()
    const submitButton = document.getElementById('submitNewCardButton')
    submitButton.disabled = true
}
function clearSelectBox(selector){
    const setSelectBox = document.querySelector(selector);
    setSelectBox.innerHTML = ""
}

function clearSelectBoxes(){
    ["gameSet", 'rarity'].forEach((tag) => {
        const selector = selectBoxSelectorsMap[tag]
        const selectBox = document.querySelector(selector);
        selectBox.innerHTML = ""
    })
}

function toggleDisabledSubmitForm(){
    const submitButton = document.getElementById('submitNewCardButton')
    submitButton.disabled = !submitButton.disabled
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
    if(!cardGames.has(cardGame)) {
        clearSelectBoxes()
        setSubmitFormButtonDisabledState()
        return 
    }
    addInfoMessage("Carregando edições")
    await new Promise(r => setTimeout(r, 800));
    addInfoMessage("")
    await loadSetSelect(cardGame)
    await loadRaritySelect(cardGame)
    setSubmitFormButtonDisabledState()
}


async function setSubmitFormButtonDisabledState(){
    const submitButton = document.getElementById('submitNewCardButton')
    const selector = selectBoxSelectorsMap['gameSet']
    const setSelectBox = document.querySelector(selector);
    const hasOptions = setSelectBox.children.length > 0
    submitButton.disabled = !hasOptions
}
async function submitNewCardForm(event){
    event.preventDefault()
    const formData = new FormData(event.target);

    let dots = '';
    const loadingInterval = setInterval(() => {
        dots = dots.length >= 3 ? "" : dots + '.';
        addInfoMessage('Salvando nova carta ' + dots)

    }, 400 )
    
    try {
        await new Promise(r => setTimeout(r, 800));
        const response = await submitNewCard(formData)
        clearInterval(loadingInterval)
        addInfoMessage(response.message)
        resetForm(event.target)
    } catch (error) {
        console.error(error);
        console.error("message" ,error.message);
        clearInterval(loadingInterval)
        addInfoMessage(error?.message || "Erro ao salvar nova carta.")
    } finally  {
        setTimeout(() => {
            console.log('Finally...')
            addInfoMessage("")
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