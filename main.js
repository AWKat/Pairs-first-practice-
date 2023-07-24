const gameContainer = document.querySelector('.game');
const colors = ["aqua", "aquamarine", "crimson", "blue", "dodgerblue", "gold", "greenyellow", "teal"];
const colorsPicklist = [...colors, ...colors];
const gameCardCount = colorsPicklist.length;
const restartButton = document.querySelector('.restart__button');

//Game state
let flippedCard = 0;
let activeCard = null;
let awaitingEndOfMove = false;
let gameFinished = false;
let timerId;

function buildCard (color) {
    const element = document.createElement ('div');

    element.classList.add('game__card');

    element.setAttribute('data-color', color);
    element.setAttribute('data-flipped', 'false');

    element.addEventListener('click', () => {
        const flipped = element.getAttribute('data-flipped');

        if (awaitingEndOfMove 
            || flipped === 'true' 
            || element === activeCard) {// ход еще не завершен
            return;
        }

        element.style.backgroundColor = color;// если условие не выполнено, тогда устанавливается цвет фона карточки, это приводит к тому, что текущая карточка становится открытой.

        if (!activeCard) { //переменная представляет собой предыдущую открытую карточку. если activeCard не определена, то текущая карточка element становитсяактивной карточкой, это означает, что текущая карточка будет открыта, и ее цвет останется видимым.
            activeCard = element;

            return;
        }

        const colorToMatch = activeCard.getAttribute('data-color');

        if (colorToMatch === color) {
            element.setAttribute('data-flipped', 'true');
            activeCard.setAttribute('data-flipped', 'true');
            awaitingEndOfMove = false;
            activeCard = null;
            flippedCard += 2;

            if (flippedCard === gameCardCount) {
                setTimeout(() => {
                    alert ('You won!');
                },500)
                clearTimeout(timerId);
            }

            return;
        }

        awaitingEndOfMove = true;//если условие if (!activeCard) не выполняется, значит у нас уже есть активная карточка для сравнения. В этом случае переменная awaitingEndOfMove устанавливается в true, чтобы предотвратить открытие других карточек во время ожидания завершения хода.

        setTimeout(() => {
            element.style.backgroundColor = null;
            activeCard.style.backgroundColor = null;//сбрасываем карточки

            awaitingEndOfMove = false;
            activeCard = null;//позволяет снова открывать новые карточки
        }, 1000);
    });

    return element;
}

function startGame() {
    
    //Build up card

    for (let i = 0; i < gameCardCount; i++) {
        const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
        const color = colorsPicklist[randomIndex];
        const card = buildCard(color);

        colorsPicklist.splice(randomIndex, 1);//удаляем выбранный цвет
        gameContainer.appendChild(card)
    }

    // Timer
    
    timerId = setTimeout(() => {
        if (!gameFinished) {
            gameFinished = true;
            alert('Game over, time is out!');
        }
    }, 60000);
}

startGame();

restartButton.addEventListener('click', restartGame) 

function restartGame() {
    flippedCard = 0;
    activeCard = null;
    awaitingEndOfMove = false;
    gameFinished = false;
    clearTimeout(timerId);
    gameContainer.innerHTML = '';

    colorsPicklist.push(...colors, ...colors);

    startGame();
};