
function loadPuzzleNumber(n, onFail) {
    document.title = "Moojestic #" + n.toString();

    var targetPuzzle = "puzz_" + n.toString().padStart(4, '0') + ".json";
    fetch("/data/" + targetPuzzle).then(function(response) {
        return response.json();
    }).then(function(json){
        setPuzzle(n, json);
    }).catch(function(err) {
        console.warn("Can't fetch data: " + n + ":" + err);
        onFail(n);
    });
}

function todaysPuzzleIndex() {
    //Okay. I need to convert the date to a number
    var startDate = new Date("2022-03-07");
    var msPerDay = 24*60*60*1000;
    var time = new Date();
    var diff = Math.floor((time - startDate) / msPerDay);

    return diff;
}

