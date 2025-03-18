document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let attempts = 0;
    let matches = 0;
    let flippedCards = [];
    let lockBoard = false;

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const attemptsCounter = document.getElementById('attempts');
    const matchesCounter = document.getElementById('matches');
    const restartButton = document.getElementById('restart-button');
    const winMessage = document.getElementById('win-message');

    // Emoji pairs for cards
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    
    // Double the emojis to create pairs
    const cardSymbols = [...emojis, ...emojis];

    // Initialize game
    function initGame() {
      attempts = 0;
      matches = 0;
      flippedCards = [];
      lockBoard = false;
      
      attemptsCounter.textContent = attempts;
      matchesCounter.textContent = matches;
      winMessage.style.display = 'none';
      gameBoard.innerHTML = '';
      
      // Shuffle cards
      const shuffledSymbols = shuffleArray([...cardSymbols]);
      
      // Create cards
      shuffledSymbols.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        gameBoard.appendChild(card);
      });
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Create a card element
    function createCard(symbol, index) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.symbol = symbol;
      card.dataset.index = index;
      
      // Card front (question mark)
      const cardFront = document.createElement('div');
      cardFront.classList.add('card-front');
      
      
      // Card back (emoji)
      const cardBack = document.createElement('div');
      cardBack.classList.add('card-back');
      cardBack.textContent = symbol;
      
      // Add front and back to card
      card.appendChild(cardFront);
      card.appendChild(cardBack);
      
      // Add click event
      card.addEventListener('click', flipCard);
      
      return card;
    }

    // Handle card flip
    function flipCard() {
      // Prevent flipping if board is locked or card is already flipped
      if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
      }
      
      // Flip the card
      this.classList.add('flipped');
      flippedCards.push(this);
      
      // Check if we have 2 flipped cards
      if (flippedCards.length === 2) {
        lockBoard = true;
        attempts++;
        attemptsCounter.textContent = attempts;
        
        // Check for match
        checkForMatch();
      }
    }

    // Check if the two flipped cards match
    function checkForMatch() {
      const [firstCard, secondCard] = flippedCards;
      const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
      
      if (isMatch) {
        // Mark cards as matched
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        // Remove click event
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        // Update matches count
        matches++;
        matchesCounter.textContent = matches;
        
        // Check for win
        if (matches === emojis.length) {
          setTimeout(() => {
            winMessage.style.display = 'block';
          }, 500);
        }
      } else {
        // Flip cards back
        setTimeout(() => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
        }, 1000);
      }
      
      // Reset for next turn
      setTimeout(() => {
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }

    // Restart game
    restartButton.addEventListener('click', initGame);
    
    // Initialize the game on load
    initGame();
  });