
function getColor(c) {
    if (c == "#") {
        return "bg-correct";
    }
    if (c == "@") {
        return "bg-shuffled";
    }
    return "bg-light";
}

function createAnswerRow(n, text) {
    var div = document.createElement('div');
    div.className = "flex answer-row";
    for (var i = 0; i < n; i++) {
        div.insertAdjacentHTML('beforeend', text);
    }
    return div;
}

function createAnswerGrid(correct, shuffled) {
    var div = document.createElement('div');
    div.className = "grid answer-grid";
    div.append(createAnswerRow(correct, '<div class="answer tile correct">&#10004;</div>'));
    div.append(createAnswerRow(shuffled, '<div class="answer tile shuffled">⭯</div>'));
    return div;
}
        
function createGuessDiv(guess, doSlotColors) {
    var div = document.createElement('div');
    div.className = "word flex";
    var word = guess[0];
    for (var i = 0; i < word.length; i++) {
        var color = doSlotColors ? getColor(guess[3][i]) : "bg-light";
        var letter = document.createElement('div');
        letter.className = "letter tile " + color;
        letter.innerText = guess[0][i];
        div.append(letter);
    }

    div.append(createAnswerGrid(guess[1], guess[2]));
    return div;
}

function loadPuzzleByName(name) {
    fetch("/data/" + name).then(function(response) {
        return response.json();
    }).then(setPuzzle).catch(function(err) {
        console.warn("Can't fetch data: " + name);
    });
}

function setPuzzle(json) {
    var div = document.getElementById("puzzle");

    var guesses = json["guesses"];
    div.innerText = `hi ${guesses[0][0]}`;
    for (var i = 0; i < guesses.length; i++) {
        // addGuess(div, guesses[i], json["mode"]=="slot");
        div.append(createGuessDiv(guesses[i], json["mode"]=="slot"));
    }
}

function getPuzzleByDate(date, handler) {

}

function getTodaysPuzzle(handler) {
    return getPuzzleForDate(new Date(), handler);
}
