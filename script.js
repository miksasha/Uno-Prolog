// Select the game board element
const gameBoard = document.getElementById('game-board');

// Create a Tau Prolog engine
const prolog = pl.create();

// Load the Prolog code into the engine
prolog.consult('uno.pl');

// Query the engine to get the initial game state
let gameState = {};
prolog.query('game_state(GameState).', function(answer) {
    gameState = answer[0].GameState;
});

// Update the interface with the initial game state
updateInterface();

// Send a player move to the engine
function sendMove(card) {
    // Send the player move to the engine
    prolog.query(play_card(card.color, card.value, GameState, NewGameState), function(answer) {
        // Check if the move was successful
        if (answer.length > 0) {
            // Update the game state with the new state
            gameState = answer[0].NewGameState;

            // Update the interface with the new game state
            updateInterface();
        } else {
            // Display an error message
            alert('Invalid move!');
        }
    });
}

// Query the engine to get the updated game state
function updateGameState() {
    prolog.query('game_state(GameState).', function(answer) {
        gameState = answer[0].GameState;
    });
}
// Add a click event listener to the game board
gameBoard.addEventListener('click', function(event) {

    // Get the card that was clicked
    const card = event.target;

    // Check if the card is a playable card
    if (card.classList.contains('playable')) {
        // Send the card to the Prolog engine
        prolog.sendCard(card);

        // Update the game state and interface
        updateGameState();
        updateInterface();
    }
});

// Select the draw pile element
const drawPile = document.getElementById('draw-pile');

// Add a click event listener to the draw pile
drawPile.addEventListener('click', function(event) {
    // Get the draw pile card
    const card = event.target;

    // Check if the draw pile card can be drawn
    if (card.classList.contains('drawable')) {
        // Send a draw request to the Prolog engine
        prolog.drawCard();

        // Update the game state and interface
        updateGameState();
        updateInterface();
    }
});

// Select the discard pile element
const discardPile = document.getElementById('discard-pile');

// Add a click event listener to the discard pile
discardPile.addEventListener('click', function(event) {
    // Get the discard pile card
    const card = event.target;

    // Check if the discard pile card can be picked up
    if (card.classList.contains('pickupable')) {
        // Send a pickup request to the Prolog engine
        prolog.pickupCard();

        // Update the game state and interface
        updateGameState();
        updateInterface();
    }
});