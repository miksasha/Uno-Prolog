let deckCamp = [];
let comp0Cards;
let comp1Cards;
let currentColor;
let freeNumberForComp = 0;
let currentPlayer = 0;

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


function getSevenCardsToComps() {
    let session = pl.create(10000);
    session.consult('unotest.pl');

    session.query(`deck(Deck),shuffle(Deck,Shuffled),dealCardsRes([0,1],Shuffled, 7, Res),flatten_list(Res,Fres),remove_list(Shuffled,Fres,Rres),topCard(Rres,Topcard),remove_list(Rres,[Topcard],Finalres).`);
    let temp;
    session.answer({
        success: function (answer) {
            temp = parser(["Deck", "Shuffled", "Res", "Topcard", "Fres", "Rres", "Finalres"], session.format_answer(answer));


            deckCamp = temp[6];
            comp0Cards = parserArray(temp[2]).slice(0, 7);
            comp1Cards = parserArray(temp[2]).slice(7);
            currentCard = parserArray(temp[5]);

            let card = document.getElementById('current_card');
            card.setAttribute('src', 'images/' + currentCard[0][1] + '_' + currentCard[0][0] + '.png');

            //покладені карти для 1 компа
            let cardsFor1Comp = document.getElementById('comp_first_board');
            let cardsHTML = '';
            for (let i = 0; i < 7; i++) {
                cardsHTML += '<img id="' + comp0Cards[i][1] + '_' + comp0Cards[i][0] + '" ' +
                    'src="images/' + comp0Cards[i][1] + '_' + comp0Cards[i][0] + '.png" ' +
                    'alt="' + comp0Cards[i][1] + '_' + comp0Cards[i][0] + '">';
                freeNumberForComp++;
            }
            cardsFor1Comp.innerHTML = cardsHTML;

            //покладені карти для 2 компа
            let cardsFor2Comp = document.getElementById('comp_second_board');
            cardsHTML = '';
            for (let i = 0; i < 7; i++) {
                cardsHTML += '<img id="' + comp1Cards[i][1] + '_' + comp1Cards[i][0] + '" ' +
                    'src="images/' + comp1Cards[i][1] + '_' + comp1Cards[i][0] + '.png" ' +
                    'alt="' + comp1Cards[i][1] + '_' + comp1Cards[i][0] + '">';
                freeNumberForComp++;
            }
            cardsFor2Comp.innerHTML = cardsHTML;

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

function moveToNextPlayer() {
    let session = pl.create(10000);
    session.consult('unotest.pl');
    if (currentPlayer === 0) {
        console.log(`[${parserArrayBack(comp0Cards)}]`)
        console.log(`[${parserArrayBack(comp1Cards)}]`)
        console.log(`card(${currentCard[0][0]},${currentCard[0][1]})`)
        console.log(`remove_list([${parserArrayBack(comp0Cards)}]`)
        console.log(`findAllValidMoves([${parserArrayBack(comp0Cards)}],card(${currentCard}),Res),findBestMove([${parserArrayBack(comp0Cards)}], [${parserArrayBack(comp1Cards)}], card(${currentCard[0][0]},${currentCard[0][1]}), 3, -1000, 1000, BestScore, BestMove),remove_list([${parserArrayBack(comp0Cards)}],[BestMove],Finalres).`)
        session.query(`findAllValidMoves([${parserArrayBack(comp0Cards)}],card(${currentCard}),Res),findBestMove([${parserArrayBack(comp0Cards)}], [${parserArrayBack(comp1Cards)}], card(${currentCard[0][0]},${currentCard[0][1]}), 3, -1000, 1000, BestScore, BestMove),remove_list([${parserArrayBack(comp0Cards)}],[BestMove],Finalres).`);
        session.answer({
            success: function (answer) {
                let allValidMoves = parserArray(parser(["BestScore", "BestMove", "Finalres", "Res"], session.format_answer(answer))[0])
                let bestCard = parserArray(parser(["BestScore", "BestMove", "Finalres", "Res"], session.format_answer(answer))[2]);
                comp0Cards = parserArray(parser(["BestScore", "BestMove", "Finalres", "Res"], session.format_answer(answer))[3]);
                console.log(allValidMoves)
                console.log("bestCard "+bestCard)
                console.log("comp0Cards "+comp0Cards)
                //['yellow', '0']
                if (allValidMoves.length > 0) {
                    currentCard = bestCard;
                    for (let i = 0; i < comp0Cards.length; i++) {
                        if (comp0Cards[i][0] === currentCard[0] && comp0Cards[i][1] === currentCard[1]) {
                            comp0Cards = comp0Cards.slice(0, i).concat(comp0Cards.slice(i + 1));
                        }
                    }

                    //+перевірка чи не має ця карта робити певні дії
                    if (currentCard[0][1] === "wild") {
                        alert("Комп'ютер обрав " + currentCard[0][0]);
                    }

                    if (currentCard[0][1] === "wild-draw4") {
                        alert("Комп'ютер обрав " + currentCard[0]);
                        setTimeout(function () {
                            getFromDeckForComp(1);
                        }, 1000);
                        setTimeout(function () {
                            getFromDeckForComp(1);
                        }, 1000);
                        setTimeout(function () {
                            getFromDeckForComp(1);
                        }, 1000);
                        getFromDeckForComp(1);
                    }
                    if (currentCard[0][1] === "draw2") {
                        setTimeout(function () {
                            getFromDeckForComp(1);
                        }, 1000);
                        getFromDeckForComp(1);
                    }
                    if (currentCard[0][1] === "skip") {
                      currentPlayer = 0;
                    }else{
                        currentPlayer = 1;
                    }


                    let img = document.getElementById('current_card');
                    img.src = `images/${currentCard[0][1]}_${currentCard[0][0]}.png`;

                    console.log(`${currentCard[0][1]}_${currentCard[0][0]}`)
                    let compCards = document.getElementById(`${currentCard[0][1]}_${currentCard[0][0]}`);
                    compCards.outerHTML = "";

                    if (comp0Cards.length === 0) {
                        alert("Комп'ютер переміг! Вам повезе наступного разу");
                        window.location.href = "index.html";
                    }
                }else{
                    getFromDeckForComp(0);
                }
            },
            fail: function () {console.log("fail")},
            error: function (err) {console.log("Error " + err)},
            limit: function () {console.log("limit")}
        });

    }else{
        console.log(`[${parserArrayBack(comp0Cards)}]`)
        console.log(`[${parserArrayBack(comp1Cards)}]`)
        console.log(`card(${currentCard[0][0]},${currentCard[0][1]})`)
        console.log(`remove_list([${parserArrayBack(comp1Cards)}]`)
        console.log(`findAllValidMoves([${parserArrayBack(comp1Cards)}],card(${currentCard}),Res),findBestMove([${parserArrayBack(comp1Cards)}], [${parserArrayBack(comp0Cards)}], card(${currentCard[0][0]},${currentCard[0][1]}), 3, -1000, 1000, BestScore, BestMove),remove_list([${parserArrayBack(comp1Cards)}],[BestMove],Finalres).`)
        session.query(`findAllValidMoves([${parserArrayBack(comp1Cards)}],card(${currentCard}),Res),findBestMove([${parserArrayBack(comp1Cards)}], [${parserArrayBack(comp0Cards)}], card(${currentCard[0][0]},${currentCard[0][1]}), 3, -1000, 1000, BestScore, BestMove),remove_list([${parserArrayBack(comp1Cards)}],[BestMove],Finalres).`);
        session.answer({
            success: function (answer) {
                let allValidMoves = parserArray(parser(["BestScore", "BestMove", "Finalres", "Res"], session.format_answer(answer))[0])
                let bestCard = parserArray(parser(["BestScore", "BestMove", "Finalres", "Res"], session.format_answer(answer))[2]);
                comp1Cards = parserArray(parser(["BestScore", "BestMove", "Finalres", "Res"], session.format_answer(answer))[3]);
                console.log(allValidMoves)
                console.log("bestCard "+bestCard)
                console.log("comp0Cards "+comp1Cards)
                //['yellow', '0']
                if (allValidMoves.length > 0) {
                    currentCard = bestCard;
                    for (let i = 0; i < comp1Cards.length; i++) {
                        if (comp1Cards[i][0] === currentCard[0] && comp1Cards[i][1] === currentCard[1]) {
                            comp1Cards = comp1Cards.slice(0, i).concat(comp1Cards.slice(i + 1));
                        }
                    }

                    //+перевірка чи не має ця карта робити певні дії
                    if (currentCard[0][1] === "wild") {
                        alert("Комп'ютер обрав " + currentCard[0]);
                    }

                    if (currentCard[0][1] === "wild-draw4") {
                        alert("Комп'ютер обрав " + currentCard[0]);
                        setTimeout(function () {
                            getFromDeckForComp(0);
                        }, 1000);
                        setTimeout(function () {
                            getFromDeckForComp(0);
                        }, 1000);
                        setTimeout(function () {
                            getFromDeckForComp(0);
                        }, 1000);
                        getFromDeckForComp(0);
                    }
                    if (currentCard[0][1] === "draw2") {
                        setTimeout(function () {
                            getFromDeckForComp(0);
                        }, 1000);
                        getFromDeckForComp(0);
                    }
                    if (currentCard[0][1] === "skip") {
                        currentPlayer = 1;
                    }else{
                        currentPlayer = 0;
                    }


                    let img = document.getElementById('current_card');
                    img.src = `images/${currentCard[0][1]}_${currentCard[0][0]}.png`;

                    console.log(`${currentCard[0][1]}_${currentCard[0][0]}`)
                    let compCards = document.getElementById(`${currentCard[0][1]}_${currentCard[0][0]}`);
                    console.log("Inner = "+compCards.innerHTML)
                    compCards.outerHTML = "";

                    if (comp1Cards.length === 0) {
                        alert("Комп'ютер переміг! Вам повезе наступного разу");
                        window.location.href = "index.html";
                    }
                }else{
                    getFromDeckForComp(1);
                }
            },
            fail: function () {console.log("fail")},
            error: function (err) {console.log("Error " + err)},
            limit: function () {console.log("limit")}
        });
    }
}

function getFromDeckForComp(localPlayerNumber){

    let session = pl.create(10000);
    session.consult('unotest.pl');
    session.query(`topCard(${deck},Card),remove_list(${deck},[Card],Finalres).`);
    let temp = [];
    session.answer({
        success: function (answer) {
            temp[0] = parserArray(parser(["Card", "Finalres"], session.format_answer(answer))[0])[0];
            temp[1] = parserArray(parser(["Card", "Finalres"], session.format_answer(answer))[1]);
            deck = `[${parserArrayBack(temp[1])}]`;
            if(localPlayerNumber===0)
                comp0Cards.push(temp[0])
            else
                comp1Cards.push(temp[0])

            let card = document.createElement('img');
            card.setAttribute('id', `${temp[0][1]}_${temp[0][0]}`);
            card.setAttribute('src', 'images/' + temp[0][1] + '_' + temp[0][0] + '.png');
            card.setAttribute('alt', temp[0][1] + '_' + temp[0][0]);

            if(localPlayerNumber===0){
                let cardBoard = document.getElementById('comp_first_board');
                let cardsHTML = '';
                cardsHTML += '<img id="' + temp[0][1] + '_' + temp[0][0] + '" ' +
                        'src="images/' + temp[0][1] + '_' + temp[0][0] + '.png" ' +
                        'alt="' + temp[0][1] + '_' + temp[0][0] + '">';
                cardBoard.innerHTML = cardsHTML;
            }else{
                let cardBoard = document.getElementById('comp_second_board');
                let cardsHTML = '';
                cardsHTML += '<img id="' + temp[0][1] + '_' + temp[0][0] + '" ' +
                    'src="images/' + temp[0][1] + '_' + temp[0][0] + '.png" ' +
                    'alt="' + temp[0][1] + '_' + temp[0][0] + '">';
                cardBoard.innerHTML = cardsHTML;
            }
        },
        fail: function () {console.log("fail")},
        error: function (err) {console.log("Error " + err)},
        limit: function () {console.log("limit")}
    });

}