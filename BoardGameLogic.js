
//підключення прологу
//const pl = require("tau-prolog");

let numberOfCartsOnTheDesk = 7;
function putSevenCardsOnTable(){
    let cards = document.getElementById('gamer_board');
    let cardsHTML='';
    for(let i = 0; i<7; i++ ) {
        //додати інтеграцію різних карт
        cardsHTML += '<img id="gamer_cart_'+i+'" src="images/0_red.png">';
    }
    cards.innerHTML = cardsHTML;

    for(let i = 0; i<7; i++ ) {
        let card = document.getElementById('gamer_cart_' + i);
        card.onclick = function(e) {
            let idOfPressedCard = e.target.id;

            //робимо перевірку чи можна покласти карту
            let check = true;
            if(check){
                let img = document.getElementById('current_card');
                img.src = card.src;
                card.remove();
                numberOfCartsOnTheDesk--;
            }else{
                alert("Ви не можете використати цю карту");
            }
        }
    }
}

function getCardFromDeck(){
    const session = pl.create();
    session.consult("D:/Prolog/Tau-Prolog/uno.pl");

    // Get the deck of cards using deck/1 predicate
    const queryDeck = "deck(Deck).";
    session.query(queryDeck);
    const resultDeck = session.answer();
    const deck = resultDeck.list;

    const queryTopCard = `topCard(${JSON.stringify(deck)}, TopCard).`;
    session.query(queryTopCard);

    // Get the result from the Prolog engine
    const result = session.answer();
    const topCard = result.links.TopCard;

    console.log(topCard);
    return topCard;

    // let cards = document.getElementById('gamer_board');
    // let freeNumber = 0;
    // for(let i = 0; i<120; i++ ) {
    //     if (!document.getElementById("gamer_cart_"+i+"" )) {
    //         freeNumber = i;
    //         break;
    //     }
    // }
    // //додати інтеграцію різних карт
    // let card = document.createElement('img');
    // card.setAttribute('id', 'gamer_cart_' + freeNumber);
    // card.setAttribute('src', 'images/0_yellow.png');
    //
    // card.onclick = function(e) {
    //     let idOfPressedCard = e.target.id;
    //
    //     //робимо перевірку чи можна покласти карту
    //     let check = true;
    //     if (check) {
    //         let img = document.getElementById('current_card');
    //         img.src = card.src;
    //         card.remove();
    //         numberOfCartsOnTheDesk--;
    //     } else {
    //         alert("Ви не можете використати цю карту");
    //     }
    // }
    // cards.appendChild(card);
}

let checkUNO = false;
function UNO(){
    let cards = document.getElementById('gamer_board');
    if(cards.childElementCount === 1){
        alert("Ви вчасно натиснули на кнопку! UNO - зараховано");
        checkUNO = true;
    }else{
        alert("У вас не 1 карта, наразі ви не можете сказати UNO");
        checkUNO = false;
    }
}

function finishTheStep(){
    let cards = document.getElementById('gamer_board');
    if(cards.childElementCount === 1){
        if(!checkUNO) {
            alert("Упс. Ви забули натиснути UNO");
            getCardFromDeck();
            getCardFromDeck();
        }
    }
    checkUNO = false;

    //починає працювати комп

    //дія компа
    let stepOfTheComp = true;//true якщо комп ходить картою, false якщо берез колоди карту
    let compCards = document.getElementById('comp_board');
    if(stepOfTheComp){
        let lastChild = compCards.lastChild;
        compCards.removeChild(lastChild);
        if(compCards.childElementCount === 0){
            alert("Комп'ютер переміг! Вам повезе наступного разу");
            window.location.href = "index.html";
        }
    }else{
        let card = document.createElement('img');
        card.setAttribute('class', 'closing_comp_cards');
        card.setAttribute('src', 'images/closing_card.png');
        compCards.appendChild(card);
    }
}

function popUpChooseColor(){
    let popUp = document.getElementById('popup_chose_color');
    popUp.style.visibility = "visible";
}

function chooseColor(valueOfColor){
    let popUp = document.getElementById('popup_chose_color');
    popUp.style.visibility = "hidden";
    return valueOfColor;
}