
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
    session.consult("uno.pl");

    // Get the deck of cards using deck/1 predicate
    const queryDeck = "deck(Deck).";
    session.query(queryDeck);
    const resultDeck = session.answer();
    const deck = resultDeck.list.Deck;

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
}