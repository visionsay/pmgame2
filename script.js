const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');

let pokemons = [];
let cards = [];
let flippedCards = [];
let matchedCards = [];
let score = 0;

const fetchPokemons = async () => {
  for (let i = 1; i <= 16; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();
    pokemons.push(data);
  }
  createCards();
};

const createCards = () => {
  const duplicatedPokemons = [...pokemons, ...pokemons];
  duplicatedPokemons.sort(() => Math.random() - 0.5);

  duplicatedPokemons.forEach(pokemon => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.pokemonId = pokemon.id;

    const frontView = document.createElement('div');
    frontView.classList.add('front');

    const image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    frontView.appendChild(image);

    const backView = document.createElement('div');
    backView.classList.add('back');
    const pokemonName = document.createElement('p');
    pokemonName.textContent = pokemon.name;
    backView.appendChild(pokemonName);

    card.appendChild(frontView);
    card.appendChild(backView);
    card.addEventListener('click', flipCard);
    cards.push(card);
    gameBoard.appendChild(card);
  });
};

const flipCard = (e) => {
  const card = e.currentTarget;
  if (flippedCards.length < 2 && !card.classList.contains('flipped') && !matchedCards.includes(card)) {
    card.classList.add('flipped');
    flippedCards.push(card);
  }
  if (flippedCards.length === 2) {
    checkMatch();
  }
};

const checkMatch = () => {
  const [card1, card2] = flippedCards;
  if (card1.dataset.pokemonId === card2.dataset.pokemonId) {
    matchedCards.push(card1, card2);
    flippedCards = [];
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    if (matchedCards.length === cards.length) {
      messageDisplay.textContent = 'Congratulations! You won!';
    }
  } else {
    messageDisplay.textContent = 'Oops, try again!';
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      messageDisplay.textContent = '';
    }, 1000);
  }
};

fetchPokemons();
