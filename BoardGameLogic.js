let deck = [];
let discardDeck = [];
let players = [0,1];
let player1Cards;
let player2Cards;
function parser(arrayOfVar, str){
    let regex = new RegExp(arrayOfVar.join("|"), "g");
    let result = str.replaceAll(regex, "").split(" = ").filter(x => x.length>0);
    return result;
}

function parserArray(str){
    let result = str.replaceAll("card(", "").replaceAll("[","").replaceAll("]","").split("),").filter(x => x.length>0).filter(x => x !==" ");
    for(let i =0 ; i<result.length; i++){
        if(i===result.length-1){
            if(result[i][result[i].length-1]===')'){
                result[i]=result[i].replace(")","")
            }
        }
        result[i]=result[i].split(',');
    }
    return result;
}

function parserArrayBack(array){
    let result = "";
    for(let i =0 ; i<array.length; i++){
        if( i===array.length-1){
            result+= `card(${array[i][0]},${array[i][1]})`
            break;
        }
        result+= `card(${array[i][0]},${array[i][1]}),`
    }
    return result;
}


let currentCard;
let numberOfCartsOnTheDesk = 7;
function putSevenCardsOnTable(){
    let session = pl.create(1000);
    session.consult('unotest.pl');

    session.query(`deck(Deck),shuffle(Deck,Shuffled),dealCardsRes([0,1],Shuffled, 7, Res),topCard(Shuffled,Card).`);
    let temp;
    session.answer({
        success: function(answer) {
            temp = parser(["Deck","Shuffled", "Res"],session.format_answer(answer));
            deck = temp[1].slice(0, temp[1].length -2);
            player1Cards = parserArray(temp[2]).slice(0,7);
            player2Cards = parserArray(temp[2]).slice(7);
            currentCard = parserArray(temp[3]);

            let card = document.getElementById('current_card');
            card.setAttribute('src', 'images/'+currentCard[0][1]+'_'+currentCard[0][0]+'.png');

            let cards = document.getElementById('gamer_board');
            let cardsHTML='';

            for(let i = 0; i<7; i++ ) {
                cardsHTML += '<img id="gamer_cart_'+i+'" src="images/'+player1Cards[i][1]+'_'+player1Cards[i][0]+'.png" alt="'+player1Cards[i][1]+'_'+player1Cards[i][0]+'">';
            }
            cards.innerHTML = cardsHTML;

            for(let i = 0; i<7; i++ ) {
                let card = document.getElementById('gamer_cart_' + i);
                card.onclick = function(e) {
                    let idOfPressedCard = e.target.id;
                    let nameCardForProlog = card.alt.split('_');
                    //+робимо перевірку чи можна покласти карту

                    session.query(`findAllValidMoves([${parserArrayBack(player1Cards)}],card(${currentCard[0][0]},${currentCard[0][1]}),Res).`);
                    session.answer({
                        success: function(answer) {
                            let validCards = parserArray(parser(["Res"],session.format_answer(answer))[0]);
                            if(validCards.some(arr => JSON.stringify(arr) === JSON.stringify([nameCardForProlog[1],nameCardForProlog[0]]))){
                                let img = document.getElementById('current_card');
                                img.src = card.src;
                                card.remove();
                                numberOfCartsOnTheDesk--;
                                currentCard = [nameCardForProlog[1],nameCardForProlog[0]];
                            }else{
                                alert("Ви не можете використати цю карту");
                            }

                        },
                        fail: function() { console.log("fail") },
                        error: function(err) { console.log("Error "+err)},
                        limit: function() { console.log("limit") }
                    });
                }
            }
        },
        fail: function() { console.log("fail") },
        error: function(err) { console.log("Error "+err)},
        limit: function() { console.log("limit") }
    });


}

function getCardFromDeck(){
    let cards = document.getElementById('gamer_board');
    let freeNumber = 0;
    for(let i = 0; i<120; i++ ) {
        if (!document.getElementById("gamer_cart_"+i+"" )) {
            freeNumber = i;
            break;
        }
    }

    let session = pl.create(1000);
    session.consult('unotest.pl');

    session.query(`topCard(${deck},Card).`);
    let temp;
    session.answer({
        success: function(answer) {
            temp = parserArray(parser(["Card"],session.format_answer(answer))[0]);
            player1Cards.push(temp[0])

            let card = document.createElement('img');
            card.setAttribute('id', 'gamer_cart_' + freeNumber);
            card.setAttribute('src', 'images/'+temp[0][1]+'_'+temp[0][0]+'.png');
            card.setAttribute('alt', temp[0][1]+'_'+temp[0][0]);

            console.log(currentCard)
            card.onclick = function(e) {
                let idOfPressedCard = e.target.id;
                let nameCardForProlog = card.alt.split('_');
                //+робимо перевірку чи можна покласти карту

                session.query(`findAllValidMoves([${parserArrayBack(player1Cards)}],card(${currentCard[0][0]},${currentCard[0][1]}),Res).`);
                session.answer({
                    success: function(answer) {
                        console.log(nameCardForProlog);
                        console.log(session.format_answer(answer));
                        let validCards = parserArray(parser(["Res"],session.format_answer(answer))[0]);
                        console.log(validCards +"end")
                        if(validCards.some(arr => JSON.stringify(arr) === JSON.stringify([nameCardForProlog[1],nameCardForProlog[0]]))){
                            let img = document.getElementById('current_card');
                            img.src = card.src;
                            card.remove();
                            numberOfCartsOnTheDesk--;
                            currentCard = [nameCardForProlog[1],nameCardForProlog[0]];
                            player1Cards.splice( player1Cards.indexOf(currentCard), 1);
                        }else{
                            alert("Ви не можете використати цю карту");
                        }

                    },
                    fail: function() { console.log("fail") },
                    error: function(err) { console.log("Error "+err)},
                    limit: function() { console.log("limit") }
                });
            }
            cards.appendChild(card);
        },
        fail: function() { console.log("fail") },
        error: function(err) { console.log("Error "+err)},
        limit: function() { console.log("limit") }
    });
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