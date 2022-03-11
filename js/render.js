
var guessDivs = {};

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

const SHUFFLE_TILE = '<img class="answer tile shuffled" src="/img/move_button_transparent.png"></img>';
const CORRECT_TILE = '<div class="answer tile correct">&#10004;</div>';
function createAnswerGrid(correct, shuffled) {
    var div = document.createElement('div');
    div.className = "grid answer-grid";
    div.append(createAnswerRow(correct,CORRECT_TILE));
    div.append(createAnswerRow(shuffled, SHUFFLE_TILE));
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
                    letter.insertAdjacentHTML('beforeend', CORRECT_TILE);
                    break;
                case SlotType.SHUFFLED:
                    letter.className += " border-shuffled";
                    letter.insertAdjacentHTML('beforeend', SHUFFLE_TILE);
                    break;
            }
        }

        div.append(letter);
    }

    if (!insetSlots) {
        div.append(createAnswerGrid(counts[0], counts[1]));
    }
    guessDivs[word] = div;
    return div;
}

function setPuzzle(n, json) {
    document.getElementById("date").innerText = "Puzzle #" + n;
    var div = document.getElementById("puzzle");
    var answerArea = document.getElementById("answer-area");
    answerArea.className = "";

    guessDivs = {};
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
    
    correctAnswer = answer;
}


/* Guess validation */
function slotsAreEqual(slotsA, slotsB) {
    return false;
}

function countsAreEquals(countsA, countsB) {
    return false;
}

function checkUserGuessAgainstClue(guess, answer, clue, mode) {
    return false;
}

function findGuessErrors(userGuess, puzzle) {
   var result = {};
   for (var i = 0; i < puzzle["clues"].length; i++) {

   }

   return result; 
}

function showErrorFeedback(userGuess, puzzle) {
    feedback.innerText = "That's not it, keep guessing!";
}