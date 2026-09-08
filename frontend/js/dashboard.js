import { getAllUserCards } from "./cards.js";


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
    tdElement.innerText = card.card_game;
    return tdElement
}
function createSetTd(card){
    const tdElement = document.createElement('td')
    tdElement.innerText = card.card_set;
    return tdElement
}
function createRarityTd(card){
    const tdElement = document.createElement('td')
    tdElement.innerText = card.rarity;
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
    aElement.href = `http://localhost/edit/${card.id}`;
    aElement.dataset.id = card.id;
    aElement.innerText = "Editar";
    tdElement.appendChild(aElement);
    return tdElement;
}

function loadCardsRows(cards){
    const cardListTable = document.getElementById('cardListTable');
    const [tableHead, tableBody, tableFooter] = cardListTable.children;
    for(const card of cards ){
        console.log(card)
        const newTr = document.createElement('tr')
        newTr.append(
            createNamePtTd(card),
            createNameEnTd(card),
            createCardGameTd(card),
            createSetTd(card),
            createRarityTd(card),
            createImageTd(card),
            createEditTd(card)
        )
        
        tableBody.appendChild(newTr)
    }
    
}

(() => {
    document.addEventListener("DOMContentLoaded", async () => {
        const res = await getAllUserCards()
        
        const totalCountTd = document.getElementById('totalCount');

        if(!res) {
            // Todo: fazer um display de alerta 
            totalCountTd.innerText = 'Total: 0'
        }
        totalCountTd.innerText = `Total: ${res.count}`;
        loadCardsRows(res.items)


    })
})()