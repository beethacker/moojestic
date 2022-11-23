
var canvas = {};
var ctx = {};
var particles = [];
var fireworks = [];
var lastAnimateTime = 0;
var GRAVITY = 1;

function randBetween(a, b) {
    return Math.random()*(b-a)+a;
}

function randColor(hue) {
    return `hsl(${hue}, 100%, 50%`;
}

function createRandomFirework(minDelay, maxDelay) {
    cx = randBetween(20, canvas.width-20);
    cy = randBetween(20, canvas.height-20);
    return {
        delay: randBetween(minDelay, maxDelay),
        color: randBetween(0, 360),
        x: cx,
        y: cy,
        exploded: false
    }
}

function explode(firework) {
    firework.exploded = true;
    for (var i = 0; i < 30; i++) {
        particles.push(randomParticleAt(firework.x, firework.y, firework.color, 30));
    }
}

function randomParticleAt(x, y, baseHue, hueDiff) {
    var hue = Math.trunc(randBetween(baseHue-hueDiff, baseHue+hueDiff));
    return {
        x: x, 
        y: y, 
        vx: randBetween(-5, 5), 
        vy: randBetween(-5, -20), 
        life: randBetween(15, 30), 
        color: randColor(hue),
        on: true,
    };
}

function startVictory() {
    canvas = document.getElementById("victory-canvas");
    canvas.className = "show-victory";
    ctx = canvas.getContext("2d");
    //NOTE this doesn't work until we've actually built out the rest of the 
    // so running it right at the start doesn't work! :)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Create random fireworks that'll explode periodically!
    for (var i = 0; i < 10; i++) {
        fireworks.push(i < 3 ? createRandomFirework(1, 10) : createRandomFirework(10, 100));
    }

    //Kick off animation
    requestAnimationFrame(animateVictory);
}

function drawVictory() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.fillStyle = ("white");
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < fireworks.length; i++) {
        var f = fireworks[i];
        f.delay--;
        if (f.delay < 0 && !f.exploded) {
            explode(f);
        }
    }
    fireworks = fireworks.filter(function(e, i, arr) {
        return !e.exploded;
    });

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (p.on) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 2*Math.PI, false);
            ctx.fill();
        }
        if (p.life < 15 && Math.random() < 0.5) {
            p.on = !p.on;
        }
        // ctx.fillRect(p.x, p.y, 10, 10);

        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY;
        p.life--;
    }
    //Remove all dead particles!
    particles = particles.filter(function(e, i, arr) {
        return e.life >= 0;
    });
}

function animateVictory(timestamp) {
    const elapsed = timestamp - lastAnimateTime;
    if (elapsed > 100) {
        lastAnimateTime = timestamp;
        drawVictory();
    }

    if (particles.length > 0 || fireworks.length > 0) {
        requestAnimationFrame(animateVictory);
    }
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/* Play on pageload to test
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(startVictory, 2000);
});
*/