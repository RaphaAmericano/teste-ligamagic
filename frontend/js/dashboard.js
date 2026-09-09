import { getAllUserCards, submitDeleteCard } from "./cards.js";
import { loadMappers, cardGameMapper } from "./mappers.js";

let setMapper = {};
let rarityMapper = {};

function getSetName(card){ 
    const card_set = setMapper[card.card_game]?.[card.card_set] ?? card.card_set;
    return card_set;
}

function getRarity(card){
    const card_set = rarityMapper[card.card_game]?.[card.rarity] ?? card.rarity;
    return card_set;
} 

function createNamePtTd(card){
    const tdElement = document.createElement('td')
    tdElement.innerText = card.name_pt
    return tdElement
}
function createNameEnTd(card){
    const tdElement = document.createElement('td')
    tdElement.innerText = card.name_en
    return tdElement
}
function createCardGameTd(card){
    const tdElement = document.createElement('td')
    tdElement.innerText = cardGameMapper(card.card_game);
    return tdElement
}
function createSetTd(card){
    const tdElement = document.createElement('td')
    tdElement.innerText = getSetName(card);
    return tdElement
}
function createRarityTd(card){
    const tdElement = document.createElement('td')
    tdElement.innerText = getRarity(card);
    return tdElement
}
function createImageTd(card){
    const tdElement = document.createElement('td')
    const imageElement = document.createElement('img')
    imageElement.src = card.img_url;
    imageElement.style.maxWidth = '50px';
    imageElement.alt = card.name_pt
    tdElement.appendChild(imageElement)
    return tdElement
}
function createEditTd(card){
    const tdElement = document.createElement('td');
    const aElement = document.createElement('a');
    aElement.href = `./card.html?id=${card.id}`;
    aElement.dataset.id = card.id;
    aElement.innerText = "Editar";
    tdElement.appendChild(aElement);
    return tdElement;
}
function createDeleteTd(card){
    const tdElement = document.createElement('td');
    const buttonElement = document.createElement('button');
    
    // buttonElement.dataset.id = card.id;
    buttonElement.value = card.id;
    buttonElement.innerText = "Excluir";
    buttonElement.type = "button"
    console.log(buttonElement)
    // add event listener
    buttonElement.addEventListener('click', openDeleteModal)
    tdElement.appendChild(buttonElement);
    
    return tdElement;
}

function loadCardsRows(cards){
    const cardListTable = document.getElementById('cardListTable');
    const [tableHead, tableBody, tableFooter] = cardListTable.children;
    for(const card of cards ){
        const newTr = document.createElement('tr')
        newTr.append(
            createNamePtTd(card),
            createNameEnTd(card),
            createCardGameTd(card),
            createSetTd(card),
            createRarityTd(card),
            createImageTd(card),
            createEditTd(card),
            createDeleteTd(card)
        )
        
        tableBody.appendChild(newTr)
    }
    
}

function addInfoMessage(value){
    const infoMessageDiv = document.getElementById('infoMessage')
    infoMessageDiv.innerText = value
}

async function submitDeleteForm(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get('id');
    
    if(!id) return;
    try {
        const response = await submitDeleteCard(id);
        addInfoMessage()
        // location.reload()
    } catch (error) {
        addInfoMessage(error)
    } finally {
        setTimeout(() => {
            addInfoMessage('')
        }, 5000)
    }
}

function openDeleteModal(event){
    console.log(event) 
    const deleteForm = document.getElementById('deleteForm');
    const [ label, input] = deleteForm.children
    console.log(input)
    console.log(event.target.value)
    input.value = event.target.value;
}

(() => {
    
    document.addEventListener("DOMContentLoaded", async () => {
        const mappers = await loadMappers()
        setMapper = mappers.setMapper;
        rarityMapper = mappers.rarityMapper;
        const res = await getAllUserCards()
        const totalCountTd = document.getElementById('totalCount');
        if(!res) {
            totalCountTd.innerText = 'Total: 0'
        }
        totalCountTd.innerText = `Total: ${res.count}`;
        loadCardsRows(res.items)

        const deleteForm = document.getElementById('deleteForm')
        deleteForm.addEventListener('submit', submitDeleteForm)
    })
})()