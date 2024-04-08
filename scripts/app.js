const placeholder = document.querySelector('.placeholder');
const imagesPlaceholder = document.querySelector('.images-placeholder');
const hint = document.querySelector('.hint span');
const guess = document.querySelector('.guess p');

const keyboard = [...document.querySelectorAll('.keyboard-row span')];

let userGuess = [];
let maxGuess = 6;

let correctGuess = 0;
let incorrectGuess = 0;

const handleClick = function(event){
    keyboardClick(event.target);
    event.target.removeEventListener('click', handleClick);
};

function keyboardClick(event){
    let content = '';
    let char = event.textContent;
    correctGuess = 0;

    keyword = keyword.toLowerCase();
    userGuess.push(char.toLowerCase());


    for(const char of keyword){
        if(userGuess.includes(char)){
            content += `<span>${char}</span>`;
            correctGuess++;
        }
        else{
            content += `<span>_</span>`;
        };
    };

    if(keyword.includes(char.toLowerCase())){
        event.classList.add('disable-correct');

        if(correctGuess === keyword.trim().length){
            gameWin();
        };
    }
    else{
        event.classList.add('disable-incorrect');
        incorrectGuess++;
        imagesPlaceholder.innerHTML = `<img src="images/${incorrectGuess+1}.jpg" alt="hangmang">`;
        shakeElement(placeholder);

        if(incorrectGuess >= 6){
            gameLose();
        };
    };

    guess.innerHTML = `Incorrect guess ${incorrectGuess}/${maxGuess}`;
    placeholder.innerHTML = content;
}

function gameStart(data1, data2){
    console.log(data1, data2)

    keyboard.forEach(function(char){
        char.addEventListener('click', handleClick);
    });

    keyword = data1;
    keyword_hint = data2;

    for(const char of keyword){
        placeholder.innerHTML += `<span>_</span>`;
    };
    
    hint.innerHTML += keyword_hint;
    guess.innerHTML = `Incorrect guess ${incorrectGuess}/${maxGuess}`;

}

function gameWin(){
    imagesPlaceholder.innerHTML += `<span class="button">Play Again!</span>`;
    imagesPlaceholder.innerHTML += `<h2 class="correct-display">Correct!</h2>`;

    
    keyboard.forEach(function(key){
        key.classList.add('disabled');
        key.removeEventListener('click', handleClick);
    });
    
    playAgainBtn = document.querySelector('.button');
    playAgainBtn.addEventListener('click', function(){
        gameReset();
    });

    // setTimeout(function(){
    //     gameReset()
    // }, 30000)
}

function gameLose(){
    imagesPlaceholder.innerHTML += `<span class="button">Play Again!</span>`;
    imagesPlaceholder.innerHTML += `<h2 class="incorrect-display">Incorrect</h2>`;
    keyboard.forEach(function(key){
        key.classList.add('disabled');
        key.removeEventListener('click', handleClick);
    });

    playAgainBtn = document.querySelector('.button');
    playAgainBtn.addEventListener('click', function(){
        gameReset();
    });

    // setTimeout(function(){
    //     gameReset()
    // }, 30000)
}

function gameReset(){
    console.log('Game Reset')
    userGuess = [];
    correctGuess = 0;
    incorrectGuess = 0;

    placeholder.innerHTML = '';
    imagesPlaceholder.innerHTML = `<img src="images/1.jpg" alt="hangmang">`;
    guess.innerHTML = `Incorrect guess ${incorrectGuess}/${maxGuess}`;

    keyboard.forEach(function(key){
        key.removeAttribute('class');
    });

    getWordFromJSON()
    .then((result) => {
        gameStart(result['word'], result['definition']);
    })  
    .catch(error => {
        console.error('Error:', error);
    });
}

function shakeElement(element, magnitude = 16, duration = 500) {
    const startTime = performance.now();
    // Select all span elements within the target element
    const spans = element.querySelectorAll('span');

    // Assuming all spans should initially have the same color for simplification
    const originalColor = spans.length > 0 ? getComputedStyle(spans[0]).color : 'rgb(0, 0, 0)';
    const targetColor = "rgb(255, 0, 0)"; // Red

    const shakeAndColor = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = elapsedTime / duration;

        // Calculate the shake amount
        const shakeAmount = (1 - progress) * magnitude * Math.sin(progress * (Math.PI * 10));

        // Interpolate color based on progress for each span
        const currentColor = interpolateColor(originalColor, targetColor, progress);

        if (elapsedTime < duration) {
            element.style.transform = `translateX(${shakeAmount}px)`;
            spans.forEach(span => {
                span.style.color = currentColor; // Apply the interpolated color to each span
            });
            requestAnimationFrame(shakeAndColor);
        } else {
            element.style.transform = 'translateX(0)'; // Reset position
            spans.forEach(span => {
                span.style.color = originalColor; // Reset color of spans
            });
        }
    };

    requestAnimationFrame(shakeAndColor);
}

function interpolateColor(color1, color2, factor) {
    let color1Rgb = color1.match(/\d+/g).map(Number);
    let color2Rgb = color2.match(/\d+/g).map(Number);
    let result = color1Rgb.slice(); // Clone the color1 array
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2Rgb[i] - color1Rgb[i]));
    }
    return `rgb(${result.join(', ')})`;
}


gameReset();


// For using API to get words
//
// getWordFromAPI(keywordUrl, definitionUrl, options)
//     .then((result) => {
//         gameStart(result[0], result[1]);
//     })  
//     .catch(error => {
//         console.error('Error:', error);
//     });