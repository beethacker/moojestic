
var guessDivs = {};
var currentAnswer = [];

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

function createDifficultyDiv(difficulty) {
    var div = document.createElement("div");
    if (difficulty) {
        for (var i = 0; i < 5; i++) {
            if (i < difficulty) {
                div.insertAdjacentHTML('beforeend', '<span class="star">&#9733;</span>');
            }
            else {
                div.insertAdjacentHTML('beforeend', '<span class="star">&#9734;</span>');
            }
        }
    }
    return div;
}


function setPuzzle(n, json) {
    var answer = json["answer"];
    var guesses = json["clues"];
    correctAnswer = answer;
    loadedPuzzle = json;

    document.getElementById("date").innerText = "Puzzle #" + n;
    var div = document.getElementById("puzzle");
    var answerArea = document.getElementById("answer-area");
    answerArea.className = "";

    guessDivs = {};
    for (var i = 0; i < guesses.length; i++) {
        if (json["mode"]=="slot") {
            div.append(createGuessDiv(answer, guesses[i], true));
        }
        else if (json["mode"]=="count") {
            div.append(createGuessDiv(answer, guesses[i], false));
        }
    }

    var answerDiv = document.getElementById("answer-tiles");
    currentAnswer = Array(answer.length);
    for (var i = 0; i < answer.length; i++) {
        // answerDiv.insertAdjacentHTML("beforeEnd", "<input type='text' class='answer-box' id='answer"+i+"' oninput='onAnswerInput(this)'/>");
        var answerTile = document.createElement("input");
        answerTile.className = "answer-box";
        answerTile.id = "answer" + i;
        answerTile.setAttribute("oninput", "onAnswerInput(this)");
        answerDiv.append(answerTile);
    }

    //-----------
    // Determine letters that are still available!  (Only for SLOT mode I think?)
    if (json["mode"] == "slot") {
        document.getElementById("available-area").className = "available-area-on";
        var start = 'a'.charCodeAt(0);
        for (var i = 0; i < 26; i++) {
            var char = String.fromCharCode(start + i);
            document.getElementById("av-" + char).className="available-yes";
        }
        var excludeLetters = getExcludedLetters(json);
        for (var i = 0; i < excludeLetters.length; i++) {
            var ex = excludeLetters[i];
            var cell = document.getElementById("av-" + ex);
            cell.className = "available-no";
        }
    }
    else {
        document.getElementById("available-area").className = "available-area-off";
    }

    // Show difficulty
    div = document.getElementById("difficulty");
    div.append(createDifficultyDiv(json["level"]));
}


function getExcludedLetters(json) {
    var result = [];
    var answer = json["answer"];
    for (var i = 0; i < json["clues"].length; i++) {
        var clue = json["clues"][i];
        var slots = computeSlots(answer, clue);
        for (var j = 0; j < slots.length; j++) {
            if (slots[j] == 0) {
                result.push(clue[j]);
            }
        }
    }

    return result;
}

/* Answer checking! */
function currentGuessAsString(guessArray) {
    var result = ""
    for (var i = 0; i < guessArray.length; i++) {
       result += guessArray[i]; 
    }
    return result;
}

function allLettersFilled(guessArray) {
    for (var i =  0; i < guessArray.length; i++) {
        if (guessArray[i] === undefined || guessArray[i].length == 0 || guessArray[i] == " ") {
            return false;
        }
    }
    return true;
}

function onAnswerInput(field) {
    var answerLength= correctAnswer.length;
    var fieldID = field.id;
    var num = Number(fieldID.charAt(fieldID.length-1));
    if (field.value[0].toLowerCase() != currentAnswer[num]) {
        field.value = field.value[0].toLowerCase();
    }
    else {
        field.value = field.value[field.value.length - 1].toLowerCase();
    }
    currentAnswer[num] = field.value;

    var next = (num+1)%answerLength;
    var nextField = document.getElementById("answer" + next);
    nextField.focus();

    // Check answer!!
    checkAnswer();
}

function checkAnswer() {
    var feedbackTag = document.getElementById("feedback");
    feedbackTag.innerText = "";
    var currentGuessTxt = currentGuessAsString(currentAnswer);
    if (currentGuessTxt === correctAnswer) {
        document.getElementById("answer-tiles").className += " solved";
        //make all the inputs read only!
        for (var i = 0; i < correctAnswer.length; i++) {
            document.getElementById("answer"+i).readOnly = true;
        }
        clearErrorFeedback();
        feedbackTag.innerText = "You got it!";
        startVictory();
    }
    else if (allLettersFilled(currentAnswer)) {
        showErrorFeedback(currentGuessTxt, loadedPuzzle);
    }
    else {
        clearErrorFeedback();
    }
}

function onAnswerTextChanged(field) {
    if (field.value.length > correctAnswer.length) {
        field.value = field.value.substring(0, correctAnswer.length);
    }
    if (field.value.length == correctAnswer.length) {
        if (field.value.toLowerCase() == correctAnswer) {
            field.className = "solved";
            field.setAttribute("disabled", "disabled");
            clearButton.className = "hidden";
            feedbackTag.innerText = "You got it!";
        } 
        else {
            showErrorFeedback(field.value.toLowerCase(), loadedPuzzle);
        }
    }
    else {
        clearErrorFeedback();
    }
}

/* Guess validation */
function slotsAreEqual(slotsA, slotsB) {
    for (var i = 0; i < slotsA.length; i++) {
        if (slotsA[i] != slotsB[i]) {
            return false;
        }
    }
    return true;
}

function countsAreEqual(countsA, countsB) {
    return countsA[0]==countsB[0] && countsA[1]==countsB[1];
}

function checkUserGuessAgainstClue(guess, answer, clue, mode) {
    var slotsA = computeSlots(answer, clue);
    var slotsB = computeSlots(guess, clue);
    if (mode == "slot") {
        return slotsAreEqual(slotsA, slotsB);
    }

    var countsA = computeCountsFromSlots(slotsA);
    var countsB = computeCountsFromSlots(slotsB);
    return countsAreEqual(countsA, countsB);
}

function findGuessErrors(userGuess, puzzle) {
    console.log(JSON.stringify(puzzle));
   var result = [];
   var answer = puzzle["answer"];
   var failCount = 0;
   for (var i = 0; i < puzzle["clues"].length; i++) {
        var clue = puzzle["clues"][i];
        if (!checkUserGuessAgainstClue(userGuess, answer, clue, puzzle["mode"])) {
            result.push(clue);
        }
   }

   return result; 
}

function clearErrorFeedback() {
    var puzzle = loadedPuzzle;
    feedbackTag.innerText = "";
    for (var i = 0; i < puzzle["clues"].length; i++) {
        guessDivs[puzzle["clues"][i]].classList.remove("error");
    }
}

function showErrorFeedback(userGuess, puzzle) {
    clearErrorFeedback();
    var wrong = findGuessErrors(userGuess, puzzle);
    if (wrong.length > 0) {
        feedbackTag.innerText = "Answer doesn't match some clues!";
        for (var i = 0; i < wrong.length; i++) {
            guessDivs[wrong[i]].className += " error";
        }
    }
    else {
        feedbackTag.innerText = "Answer matches all clues, but there's another word!";
    }
}