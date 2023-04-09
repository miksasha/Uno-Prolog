let deck = [];
let discardDeck = [];
let players = [0, 1];
let player0Cards;
let player1Cards;
let currentColor;
let currentPlayer = 0;
let moveWasHappen = false;

function parser(arrayOfVar, str) {
    let regex = new RegExp(arrayOfVar.join("|"), "g");
    let result = str.replaceAll(regex, "").split(" = ").filter(x => x.length > 0);
    return result;
}

function parserArray(str) {
    let result = str.replaceAll("card(", "").replaceAll("[", "").replaceAll("]", "").split("),").filter(x => x.length > 0).filter(x => x !== " ");
    for (let i = 0; i < result.length; i++) {
        if (i === result.length - 1) {
            if (result[i][result[i].length - 1] === ')') {
                result[i] = result[i].replace(")", "")
            }
        }
        result[i] = result[i].split(',');
    }
    return result;
}

function parserArrayBack(array) {
    let result = "";
    for (let i = 0; i < array.length; i++) {
        if (i === array.length - 1) {
            result += `card(${array[i][0]},${array[i][1]})`
            break;
        }
        result += `card(${array[i][0]},${array[i][1]}),`
    }
    return result;
}


let currentCard;
let numberOfCartsOnTheDesk = 7;

function putSevenCardsOnTable() {
    let session = pl.create(10000);
    session.consult('unotest.pl');

    session.query(`deck(Deck),shuffle(Deck,Shuffled),dealCardsRes([0,1],Shuffled, 7, Res),flatten_list(Res,Fres),remove_list(Shuffled,Fres,Rres),topCard(Rres,Topcard),remove_list(Rres,[Topcard],Finalres).`);
    let temp;
    session.answer({
        success: function (answer) {
            temp = parser(["Deck", "Shuffled", "Res", "Fres", "Rres", "Topcard", "Finalres"], session.format_answer(answer));
            deck = temp[6];
            player0Cards = parserArray(temp[2]).slice(0, 7);
            player1Cards = parserArray(temp[2]).slice(7);
            currentCard = parserArray(temp[5]);
            let card = document.getElementById('current_card');
            card.setAttribute('src', 'images/' + currentCard[0][1] + '_' + currentCard[0][0] + '.png');

            let cards = document.getElementById('gamer_board');
            let cardsHTML = '';

            for (let i = 0; i < 7; i++) {
                cardsHTML += '<img id="gamer_cart_' + i + '" src="images/' + player0Cards[i][1] + '_' + player0Cards[i][0] + '.png" alt="' + player0Cards[i][1] + '_' + player0Cards[i][0] + '">';
            }
            cards.innerHTML = cardsHTML;

            for (let i = 0; i < 7; i++) {
                let card = document.getElementById('gamer_cart_' + i);
                card.onclick = function (e) {
                    let idOfPressedCard = e.target.id;
                    let nameCardForProlog = card.alt.split('_');

                    //+робимо перевірку чи можна покласти карту
                    session.query(`findAllValidMoves([${parserArrayBack(player0Cards)}],card(${currentCard}),Res).`);
                    session.answer({
                        success: function (answer) {
                            let validCards = parserArray(parser(["Res"], session.format_answer(answer))[0]);
                            if (validCards.some(arr => JSON.stringify(arr) === JSON.stringify([nameCardForProlog[1], nameCardForProlog[0]]))) {
                                let img = document.getElementById('current_card');
                                img.src = card.src;
                                card.remove();
                                numberOfCartsOnTheDesk--;
                                currentCard = [nameCardForProlog[1], nameCardForProlog[0]];

                                for (let i = 0; i < player0Cards.length; i++) {
                                    if (player0Cards[i][0] === currentCard[0] && player0Cards[i][1] === currentCard[1]) {
                                        player0Cards = player0Cards.slice(0, i).concat(player0Cards.slice(i + 1));
                                    }
                                }

                                moveWasHappen = true;

                                //+перевірка чи не має ця карта робити певні дії
                                console.log(currentCard[1]);
                                if (currentCard[1] === "wild") {
                                    popUpChooseColor();
                                }

                                let compCards = document.getElementById('comp_board');
                                if (currentCard[1] === "wild-draw4") {
                                    popUpChooseColor();
                                    moveWasHappen = false;

                                    for (let i = 0; i < 4; i++) {
                                        let newCard = document.createElement('img');
                                        newCard.setAttribute('class', 'closing_comp_cards');
                                        newCard.setAttribute('src', 'images/closing_card.png');
                                        compCards.appendChild(newCard);
                                    }

                                    //покласти 4 карти супротивнику в пролозі
                                }
                                if (currentCard[1] === "draw2") {
                                    for (let i = 0; i < 2; i++) {
                                        let newCard = document.createElement('img');
                                        newCard.setAttribute('class', 'closing_comp_cards');
                                        newCard.setAttribute('src', 'images/closing_card.png');
                                        compCards.appendChild(newCard);
                                    }
                                    //покласти 2 карти супротивнику в пролозі
                                }
                                if (currentCard[1] === "skip") {
                                    moveWasHappen = false;
                                }
                            } else {
                                alert("Ви не можете використати цю карту");
                            }

                        },
                        fail: function () {
                            console.log("fail")
                        },
                        error: function (err) {
                            console.log("Error " + err)
                        },
                        limit: function () {
                            console.log("limit")
                        }
                    });
                }
            }
        },
        fail: function () {
            console.log("fail")
        },
        error: function (err) {
            console.log("Error " + err)
        },
        limit: function () {
            console.log("limit")
        }
    });
}

function getCardFromDeck() {
    let cards = document.getElementById('gamer_board');
    let freeNumber = 0;
    for (let i = 0; i < 120; i++) {
        if (!document.getElementById("gamer_cart_" + i + "")) {
            freeNumber = i;
            break;
        }
    }
    moveWasHappen = true;

    let session = pl.create(10000);
    session.consult('unotest.pl');
    session.query(`topCard(${deck},Card),remove_list(${deck},[Card],Finalres).`);
    let temp = [];
    session.answer({
        success: function (answer) {
            temp[0] = parserArray(parser(["Card", "Finalres"], session.format_answer(answer))[0])[0];
            temp[1] = parserArray(parser(["Card", "Finalres"], session.format_answer(answer))[1]);
            deck = `[${parserArrayBack(temp[1])}]`;
            player0Cards.push(temp[0])

            let card = document.createElement('img');
            card.setAttribute('id', 'gamer_cart_' + freeNumber);
            card.setAttribute('src', 'images/' + temp[0][1] + '_' + temp[0][0] + '.png');
            card.setAttribute('alt', temp[0][1] + '_' + temp[0][0]);

            card.onclick = function (e) {
                let idOfPressedCard = e.target.id;
                let nameCardForProlog = card.alt.split('_');

                //+робимо перевірку чи можна покласти карту
                session.query(`findAllValidMoves([${parserArrayBack(player0Cards)}],card(${currentCard}),Res).`);
                session.answer({
                    success: function (answer) {
                        let validCards = parserArray(parser(["Res"], session.format_answer(answer))[0]);
                        if (validCards.some(arr => JSON.stringify(arr) === JSON.stringify([nameCardForProlog[1], nameCardForProlog[0]]))) {
                            let img = document.getElementById('current_card');
                            img.src = card.src;
                            card.remove();
                            numberOfCartsOnTheDesk--;
                            currentCard = [nameCardForProlog[1], nameCardForProlog[0]];

                            for (let i = 0; i < player0Cards.length; i++) {
                                if (player0Cards[i][0] === currentCard[0] && player0Cards[i][1] === currentCard[1]) {
                                    player0Cards = player0Cards.slice(0, i).concat(player0Cards.slice(i + 1));
                                }
                            }


                            // //перевірка чи не має ця карта робити певні дії
                            //+перевірка чи не має ця карта робити певні дії
                            console.log(currentCard[1]);
                            if (currentCard[1] === "wild") {
                                popUpChooseColor();
                            }

                            let compCards = document.getElementById('comp_board');
                            if (currentCard[1] === "wild-draw4") {
                                popUpChooseColor();
                                moveWasHappen = false;

                                for (let i = 0; i < 4; i++) {
                                    let newCard = document.createElement('img');
                                    newCard.setAttribute('class', 'closing_comp_cards');
                                    newCard.setAttribute('src', 'images/closing_card.png');
                                    compCards.appendChild(newCard);
                                }

                                //покласти 4 карти супротивнику в пролозі
                            }
                            if (currentCard[1] === "draw2") {
                                for (let i = 0; i < 2; i++) {
                                    let newCard = document.createElement('img');
                                    newCard.setAttribute('class', 'closing_comp_cards');
                                    newCard.setAttribute('src', 'images/closing_card.png');
                                    compCards.appendChild(newCard);
                                }
                                //покласти 2 карти супротивнику в пролозі
                            }
                            if (currentCard[1] === "skip") {
                                moveWasHappen = false;
                            }

                        } else {
                            alert("Ви не можете використати цю карту");
                        }

                    },
                    fail: function () {
                        console.log("fail")
                    },
                    error: function (err) {
                        console.log("Error " + err)
                    },
                    limit: function () {
                        console.log("limit")
                    }
                });
            }
            cards.appendChild(card);
        },
        fail: function () {console.log("fail")},
        error: function (err) {console.log("Error " + err)},
        limit: function () {console.log("limit")}
    });
}

let checkUNO = false;

function UNO() {
    let cards = document.getElementById('gamer_board');
    if (cards.childElementCount === 1) {
        alert("Ви вчасно натиснули на кнопку! UNO - зараховано");
        checkUNO = true;
    } else {
        alert("У вас не 1 карта, наразі ви не можете сказати UNO");
        checkUNO = false;
    }
}

function finishTheStep() {
    if (moveWasHappen) {
        let cards = document.getElementById('gamer_board');
        if (cards.childElementCount === 1) {
            if (!checkUNO) {
                alert("Упс. Ви забули натиснути UNO");
                setTimeout(function () {
                    getCardFromDeck();
                }, 1000);
                getCardFromDeck();
            }
        }
        checkUNO = false;
        moveWasHappen = false;

        //починає працювати комп

        let session = pl.create(10000);
        session.consult('unotest.pl');
        console.log(`[${parserArrayBack(player1Cards)}]`)
        console.log(`[${parserArrayBack(player0Cards)}]`)
        console.log(`card(${currentCard[0]},${currentCard[1]})`)
        session.query(`findBestMove([${parserArrayBack(player1Cards)}], [${parserArrayBack(player0Cards)}], card(${currentCard[0][0]},${currentCard[0][1]}), 3, -1000, 1000, BestScore, BestMove),remove_list([${parserArrayBack(player1Cards)}],[BestMove],Finalres).`);
        session.answer({
            success: function (answer) {
                let bestCard = parserArray(parser(["BestScore", "BestMove","Finalres"], session.format_answer(answer))[1]);
                player1Cards = parserArray(parser(["BestScore", "BestMove","Finalres"], session.format_answer(answer))[2]);
                console.log(player1Cards)
                //['yellow', '0']

                currentCard = bestCard;
                for(let i = 0; i < player1Cards.length; i++) {
                    if (player1Cards[i][0] === currentCard[0] && player1Cards[i][1] === currentCard[1]) {
                        player1Cards = player1Cards.slice(0, i).concat(player1Cards.slice(i + 1));
                    }
                }
                console.log(currentCard)
                console.log(currentCard[0][1])

                //+перевірка чи не має ця карта робити певні дії
                if (currentCard[0][1] === "wild") {
                    alert("Комп'ютер обрав " + currentCard[0]);
                }

                if (currentCard[0][1] === "wild-draw4") {
                    alert("Комп'ютер обрав " + currentCard[0]);
                    setTimeout(function () {
                        getCardFromDeck();
                    }, 1000);
                    setTimeout(function () {
                        getCardFromDeck();
                    }, 1000);
                    setTimeout(function () {
                        getCardFromDeck();
                    }, 1000);
                    getCardFromDeck();
                }
                if (currentCard[0][1] === "draw2") {
                    setTimeout(function () {
                        getCardFromDeck();
                    }, 1000);
                    getCardFromDeck();
                }
                if (currentCard[0][1] === "skip") {
                    finishTheStep();
                }

                let compCards = document.getElementById('comp_board');
                let child = compCards.firstChild;
                let childToRemove = compCards.children[0];
                compCards.removeChild(childToRemove);

                let img = document.getElementById('current_card');
                img.src = `images/${bestCard[0][1]}_${bestCard[0][0]}.png`;

                if (compCards.childElementCount === 0) {
                    alert("Комп'ютер переміг! Вам повезе наступного разу");
                    window.location.href = "index.html";
                }
            },
            fail: function () {console.log("fail")},
            error: function (err) {console.log("Error " + err)},
            limit: function () {console.log("limit")}
        });

        //дія компа
        let stepOfTheComp = true;//true якщо комп ходить картою, false якщо берез колоди карту

        //let compCards = document.getElementById('comp_board');
        // if (stepOfTheComp) {
        //     let lastChild = compCards.lastChild;
        //     compCards.removeChild(lastChild);
        //     if (compCards.childElementCount === 0) {
        //         alert("Комп'ютер переміг! Вам повезе наступного разу");
        //         window.location.href = "index.html";
        //     }
        // } else {
        //     let card = document.createElement('img');
        //     card.setAttribute('class', 'closing_comp_cards');
        //     card.setAttribute('src', 'images/closing_card.png');
        //     compCards.appendChild(card);
        // }
    } else {
        alert("Ще досі ваш хід");
    }
}

function popUpChooseColor() {
    let popUp = document.getElementById('popup_chose_color');
    popUp.style.visibility = "visible";
}

function chooseColor(valueOfColor) {
    let popUp = document.getElementById('popup_chose_color');
    popUp.style.visibility = "hidden";
    currentColor = valueOfColor;
    currentCard[0] = valueOfColor;
    return valueOfColor;
}