import { submitNewCard, submitEditCard, getUserCardById } from "./cards.js"
const cardGames = new Set(['magic', 'pokemon', 'yugioh'])

const submitFormFunctions = {
    create: submitNewCard,
    edit: submitEditCard
}

const selectBoxSelectorsMap = {
    game_set: '[name="card_set"]',
    rarity: '[name="rarity"]',
}

const formInputMap = {
    id: '[name="id"]',
    name_pt: '[name="name_pt"]',
    name_en: '[name="name_en"]',
    card_game: '[name="card_game"]',
}

function resetForm(form){
    form.reset();
    clearSelectBoxes()
    clearImagePreview()
    const submitButton = document.getElementById('submitNewCardButton')
    submitButton.disabled = true
}
function clearSelectBox(selector){
    const setSelectBox = document.querySelector(selector);
    setSelectBox.innerHTML = ""
}

function clearSelectBoxes(){
    ["game_set", 'rarity'].forEach((tag) => {
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

function updateImagePreview(event){
    const file = event.target.files[0];
    if(file){
        const previewImageBlock = document.getElementById('imagePreview')
        const [labelTag, imgTag ] = previewImageBlock.children;
        labelTag.innerText = "Pré visualização da imagem"
        imgTag.src = URL.createObjectURL(file);
        previewImageBlock.classList.remove('hidden')
    }
}

function clearImagePreview(){
    const previewImageBlock = document.getElementById('imagePreview')
        const [labelTag, imgTag ] = previewImageBlock.children;
        previewImageBlock.classList.add('hidden')
        labelTag.innerText = ""
}

function updateUploadedImagePreview(imgUrl){
    if(!imgUrl) return
    const previewImageBlock = document.getElementById('imagePreview')
    const [labelTag, imgTag ] = previewImageBlock.children;
    imgTag.src = imgUrl
}

function editMainHeaderText(value){
    const titleTag = document.getElementById('pageTitle');
    titleTag.innerText = value;
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
    const selector = selectBoxSelectorsMap['game_set']
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
    const selector = selectBoxSelectorsMap['game_set']
    const setSelectBox = document.querySelector(selector);
    const hasOptions = setSelectBox.children.length > 0
    submitButton.disabled = !hasOptions
}

async function submitCardForm(event){
    event.preventDefault()
    const formData = new FormData(event.target);
    const action = formData.get('id') ? 'edit' : 'create'; 
    const submitFn = submitFormFunctions[action];

    const feedBackMessage = {
        create: 'Salvando nova carta ',
        edit: 'Atualizando carta '
    }

    let dots = '';
    const loadingInterval = setInterval(() => {
        dots = dots.length >= 3 ? "" : dots + '.';
        addInfoMessage(feedBackMessage[action] + dots)
    }, 400 )
    
    
 
    try {
        await new Promise(r => setTimeout(r, 800));
        const response = await submitFn(formData)
        clearInterval(loadingInterval)
        addInfoMessage(response.message)
        if(action === "create") resetForm(event.target)
        if(action === "edit"){
            console.log(response)
            const msg = [...response.messages, ...response.errors].join(' | ')
            console.log(msg)
            addInfoMessage(msg)
            const name_pt = formData.get('name_pt')
            updateUploadedImagePreview(response.newImageUrl)
            editMainHeaderText(`Editar carta: ${name_pt}`)
        }
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



function populateForm(card){
    editMainHeaderText(`Editar carta: ${card.name_pt}`);
    const inputNameKeys = Object.keys(formInputMap)
    for(const key of inputNameKeys){
        const tag = document.querySelector(formInputMap[key]);
        tag.value = card[key]
        if(key === 'card_game'){
            tag.dispatchEvent(new Event('change'))
        }
    }

    const imagePreviewDiv = document.getElementById('imagePreview');
    imagePreviewDiv.classList.remove('hidden');
    const [label, img] = imagePreviewDiv.children;
    img.src = card.img_url
    
    const setSelect = document.querySelector(selectBoxSelectorsMap['game_set'])
    const raritySelect = document.querySelector(selectBoxSelectorsMap['rarity'])
    
    setTimeout(() => {
        setSelect.value = card.card_set;
        raritySelect.value =  card.rarity;

    }, 1000)
    

}

async function loadCardForEdit(card_id){
    const card = await getUserCardById(card_id);
    populateForm(card)
}

( () => {

    const urlParams = new URLSearchParams(window.location.search);
    const editCardId = urlParams.get('id');
    const isEditing = !!editCardId;

    document.addEventListener('DOMContentLoaded', async () => {
        const res = await fetch('./json/rarity.json')
        const data = await res.json()
        const setCardGameBox = document.querySelector('[name="card_game"]')

        if(!setCardGameBox) throw new Error('Erro ao carregar seleção de card game')
            
        setCardGameBox.addEventListener('change', setSelectOnChangeEvent)
            
        const newCardForm = document.getElementById('newCardForm')
        if(!newCardForm) throw new Error('Erro ao carregar formulário de nova carta')
        
        newCardForm.addEventListener('submit', submitCardForm)

        if(isEditing){
            await loadCardForEdit(editCardId)
        } else {
            const imageInput = document.querySelector('[name="image"]');
            imageInput.addEventListener('change', updateImagePreview)
        }
        


    })

})()