
const SlotType = {
    NONE: 0,
    CORRECT: 1,
    SHUFFLED: 2
} 

function histogram(word) {
    var result = {};
    for (var i = 0; i < word.length; i++) {
        var c = word[i];
        if (result[c] === undefined) {
            result[c] = 0;
        }
        result[c]++;
    }
    return result;
}

function computeSlots(answer, guess) {
    var histA = histogram(answer);
    var slots = Array(answer.length).fill(SlotType.NONE);

    for (var i = 0; i < guess.length; i++) {
        if (answer[i] == guess[i]) {
            slots[i] = SlotType.CORRECT;
            histA[answer[i]]--;
        }
    }

    for (var i = 0; i < guess.length; i++) {
        if (slots[i] != SlotType.CORRECT) {
            var c = guess[i];
            if (histA[c] > 0) {
                histA[c]--;
                slots[i] = SlotType.SHUFFLED;
            }
        }
    }

    return slots;
}

function computeCountsFromSlots(slots) {
    var correct = 0;
    var shuffled = 0;
    for (var i = 0; i < slots.length; i++) {
        switch(slots[i]) {
            case SlotType.CORRECT:
                correct++;
                break;

            case SlotType.SHUFFLED:
                shuffled++;
                break;
        }
    }
    return [correct, shuffled];
}

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
        
function createGuessDiv(answer, word, insetSlots) {
    var div = document.createElement('div');
    var slots = computeSlots(answer, word);
    var counts = computeCountsFromSlots(slots);
    div.className = "word flex";
    for (var i = 0; i < word.length; i++) {
        var letter = document.createElement('div');
        letter.className = "letter tile bg-light";
        letter.innerText = word[i];
        if (insetSlots) {
            switch(slots[i]) {
                case SlotType.CORRECT:
                    letter.className += " border-correct";
                    letter.insertAdjacentHTML('beforeend', '<div class="answer tile correct">&#10004;</div>');
                    break;
                case SlotType.SHUFFLED:
                    letter.className += " border-shuffled";
                    letter.insertAdjacentHTML('beforeend', '<div class="answer tile shuffled">⭯</div>');
                    break;
            }
        }

        div.append(letter);
    }

    if (!insetSlots) {
        div.append(createAnswerGrid(counts[0], counts[1]));
    }
    return div;
}

function loadPuzzleByName(name) {
    fetch("/data/" + name).then(function(response) {
        return response.json();
    }).then(setPuzzle).catch(function(err) {
        console.warn("Can't fetch data: " + name + ":" + err);
    });
}

function setPuzzle(json) {
    var div = document.getElementById("puzzle");

    var answer = json["answer"];
    var guesses = json["clues"];
    for (var i = 0; i < guesses.length; i++) {
        if (json["mode"]=="slot") {
            div.append(createGuessDiv(answer, guesses[i], true));
        }
        else if (json["mode"]=="count") {
            div.append(createGuessDiv(answer, guesses[i], false));
        }
    }
}

function getPuzzleByDate(date, handler) {

}

function getTodaysPuzzle(handler) {
    return getPuzzleForDate(new Date(), handler);
}
