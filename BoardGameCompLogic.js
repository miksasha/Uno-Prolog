let deckCamp = [];
let comp0Cards;
let comp1Cards;
let currentColor;
let freeNumberForComp = 0;

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


function getSevenCardsToComps(){
    let session = pl.create(1000);
    session.consult('unotest.pl');

    session.query(`deck(Deck),shuffle(Deck,Shuffled),dealCardsRes([0,1],Shuffled, 7, Res),topCard(Shuffled,Card).`);
    let temp;
    session.answer({
        success: function(answer) {
            temp = parser(["Deck","Shuffled", "Res","Card"],session.format_answer(answer));
            deckCamp = temp[1].slice(0, temp[1].length -2);
            comp0Cards = parserArray(temp[2]).slice(0,7);
            comp1Cards = parserArray(temp[2]).slice(7);
            currentCard = parserArray(temp[3]);

            let card = document.getElementById('current_card');
            card.setAttribute('src', 'images/'+currentCard[0][1]+'_'+currentCard[0][0]+'.png');

            let cardsFor1Comp = document.getElementById('comp_first_board');
            let cardsHTML='';
            for(let i = 0; i<7; i++ ) {
                cardsHTML += '<img id="gamer_cart_'+freeNumberForComp+'" ' +
                    'src="images/'+comp0Cards[i][1]+'_'+comp0Cards[i][0]+'.png" ' +
                    'alt="'+comp0Cards[i][1]+'_'+comp0Cards[i][0]+'">';
                freeNumberForComp++;
            }
            cardsFor1Comp.innerHTML = cardsHTML;

            let cardsFor2Comp = document.getElementById('comp_second_board');
            cardsHTML='';
            for(let i = 0; i<7; i++ ) {
                cardsHTML += '<img id="gamer_cart_'+freeNumberForComp+'" ' +
                    'src="images/'+comp1Cards[i][1]+'_'+comp1Cards[i][0]+'.png" ' +
                    'alt="'+comp1Cards[i][1]+'_'+comp1Cards[i][0]+'">';
                freeNumberForComp++;
            }
            cardsFor2Comp.innerHTML = cardsHTML;

        },
        fail: function() { console.log("fail") },
        error: function(err) { console.log("Error "+err)},
        limit: function() { console.log("limit") }
    });
}

function moveToNextPlayer(){

}