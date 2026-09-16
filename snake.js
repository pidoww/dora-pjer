(() => {
    "use strict";

    const canvas = document.getElementById("snake");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const bestElement = document.getElementById("best-score");
    const levelElement = document.getElementById("game-level");
    const restartButton = document.getElementById("restart");

    const GRID = 8;
    const SIZE = canvas.width / GRID;
    const START_SPEED = 190;
    const MIN_SPEED = 92;

    const doraImage = new Image();
    doraImage.src = "images/slike%20update%20stranica/slika%20dora%20za%20snake%20game.jpeg";

    const dinosaurImage = new Image();
    dinosaurImage.src = "images/slike%20update%20stranica/dinosaur.png";

    let snake = [];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let food = { x: 6, y: 4 };
    let score = 0;
    let dead = false;
    let paused = false;
    let timer = null;
    let touchStart = null;

    let best = 0;
    try {
        best = Number(localStorage.getItem("doraDinoBest")) || 0;
    } catch {}

    if (bestElement) bestElement.textContent = String(best);

    function currentLevel() {
        return 1 + Math.floor(score / 3);
    }

    function currentSpeed() {
        return Math.max(MIN_SPEED, START_SPEED - score * 8);
    }

    function updateHud() {
        if (scoreElement) scoreElement.textContent = String(score);
        if (bestElement) bestElement.textContent = String(best);
        if (levelElement) levelElement.textContent = String(currentLevel());
    }

    function randomFood() {
        const free = [];

        for (let y = 0; y < GRID; y += 1) {
            for (let x = 0; x < GRID; x += 1) {
                if (!snake.some(part => part.x === x && part.y === y)) {
                    free.push({ x, y });
                }
            }
        }

        if (free.length === 0) return null;
        return free[Math.floor(Math.random() * free.length)];
    }

    function drawBackground() {
        ctx.fillStyle = "#f3edcf";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(0,0,0,.16)";
        ctx.lineWidth = 1;

        for (let i = 0; i <= GRID; i += 1) {
            const p = i * SIZE;

            ctx.beginPath();
            ctx.moveTo(p, 0);
            ctx.lineTo(p, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, p);
            ctx.lineTo(canvas.width, p);
            ctx.stroke();
        }
    }

    function drawSquareImage(image, x, y, fallback, padding = 3) {
        const px = x * SIZE + padding;
        const py = y * SIZE + padding;
        const size = SIZE - padding * 2;

        if (image.complete && image.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(px, py, size, size);
            ctx.clip();

            const sourceRatio = image.naturalWidth / image.naturalHeight;
            let sx = 0;
            let sy = 0;
            let sw = image.naturalWidth;
            let sh = image.naturalHeight;

            if (sourceRatio > 1) {
                sw = image.naturalHeight;
                sx = (image.naturalWidth - sw) / 2;
            } else {
                sh = image.naturalWidth;
                sy = (image.naturalHeight - sh) / 2;
            }

            ctx.drawImage(image, sx, sy, sw, sh, px, py, size, size);
            ctx.restore();
            return;
        }

        ctx.fillStyle = fallback;
        ctx.fillRect(px, py, size, size);
    }

    function draw() {
        drawBackground();

        snake.forEach((part, index) => {
            drawSquareImage(
                doraImage,
                part.x,
                part.y,
                index === 0 ? "#d44f34" : "#e58c6d",
                index === 0 ? 1 : 5
            );

            if (index === 0) {
                ctx.strokeStyle = "#111";
                ctx.lineWidth = 3;
                ctx.strokeRect(part.x * SIZE + 2, part.y * SIZE + 2, SIZE - 4, SIZE - 4);
            }
        });

        if (food) {
            drawSquareImage(dinosaurImage, food.x, food.y, "#4c9b43", 2);
        }
    }

    function drawEndMessage(title, subtitle) {
        draw();
        ctx.fillStyle = "rgba(0,0,0,.79)";
        ctx.fillRect(0, canvas.height / 2 - 64, canvas.width, 128);
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold 34px Arial";
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "17px Arial";
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 30);
    }

    function stopTimer() {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }

    function startTimer() {
        stopTimer();
        if (dead || paused) return;
        timer = window.setInterval(tick, currentSpeed());
    }

    function pulseCatch() {
        canvas.classList.remove("dino-caught");
        void canvas.offsetWidth;
        canvas.classList.add("dino-caught");
        window.setTimeout(() => canvas.classList.remove("dino-caught"), 160);
    }

    function milestone(text) {
        if (window.doraSite?.showMemeTimed) {
            window.doraSite.showMemeTimed(text, null, 500);
            return;
        }

        window.doraSite?.showMeme?.(text);
        window.setTimeout(() => window.doraSite?.closeMeme?.(), 500);
    }

    function endGame() {
        dead = true;
        stopTimer();
        drawEndMessage("DORA JE UDARILA U ZID", `uhvaćeni dinosauri: ${score} · Enter za opet`);
    }

    function winGame() {
        dead = true;
        stopTimer();
        drawEndMessage("NEMA VIŠE DINOSAURA", "arena je puna. ovo je zabrinjavajuće.");
        milestone("Dora je završila mezozoik.");
    }

    function tick() {
        if (dead || paused) return;

        direction = nextDirection;

        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        if (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= GRID ||
            head.y >= GRID ||
            snake.some(part => part.x === head.x && part.y === head.y)
        ) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (food && head.x === food.x && head.y === food.y) {
            score += 1;
            pulseCatch();

            if (score > best) {
                best = score;
                try {
                    localStorage.setItem("doraDinoBest", String(best));
                } catch {}
            }

            updateHud();

            if (snake.length >= GRID * GRID) {
                food = null;
                winGame();
                return;
            }

            food = randomFood();
            startTimer();

            if (score === 5) {
                milestone("5 dinosaura. Dora postaje prijetnja mezozoiku.");
            }

            if (score === 10) {
                milestone("10 DINOSAURA. ovo više nije snake nego masovno izumiranje.");
            }

            if (score === 15) {
                milestone("15 dinosaura. ovo je već osobni problem dinosaura.");
            }
        } else {
            snake.pop();
        }

        draw();
    }

    function start() {
        stopTimer();

        snake = [
            { x: 3, y: 4 },
            { x: 2, y: 4 },
            { x: 1, y: 4 }
        ];

        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        food = randomFood();
        score = 0;
        dead = false;
        paused = document.hidden;

        updateHud();
        draw();
        startTimer();
    }

    function changeDirection(x, y) {
        if (dead) return;

        if (nextDirection.x + x === 0 && nextDirection.y + y === 0) return;
        nextDirection = { x, y };
    }

    function handleDirectionKey(key) {
        if (key === "arrowup" || key === "w") {
            changeDirection(0, -1);
            return true;
        }

        if (key === "arrowdown" || key === "s") {
            changeDirection(0, 1);
            return true;
        }

        if (key === "arrowleft" || key === "a") {
            changeDirection(-1, 0);
            return true;
        }

        if (key === "arrowright" || key === "d") {
            changeDirection(1, 0);
            return true;
        }

        return false;
    }

    document.addEventListener("keydown", event => {
        const key = event.key.toLowerCase();

        if (dead && (key === "enter" || key === " ")) {
            event.preventDefault();
            start();
            return;
        }

        if (handleDirectionKey(key)) {
            event.preventDefault();
        }
    });

    document.querySelectorAll("[data-dir]").forEach(button => {
        const act = event => {
            event.preventDefault();
            const value = button.dataset.dir;
            if (value === "up") changeDirection(0, -1);
            if (value === "down") changeDirection(0, 1);
            if (value === "left") changeDirection(-1, 0);
            if (value === "right") changeDirection(1, 0);
        };

        button.addEventListener("pointerdown", act);
    });

    canvas.addEventListener("touchstart", event => {
        const touch = event.changedTouches[0];
        touchStart = { x: touch.clientX, y: touch.clientY };
        event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchend", event => {
        if (!touchStart) return;

        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStart.x;
        const dy = touch.clientY - touchStart.y;
        touchStart = null;

        if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            changeDirection(dx > 0 ? 1 : -1, 0);
        } else {
            changeDirection(0, dy > 0 ? 1 : -1);
        }

        event.preventDefault();
    }, { passive: false });

    document.addEventListener("visibilitychange", () => {
        paused = document.hidden;

        if (paused) {
            stopTimer();
        } else if (!dead) {
            startTimer();
        }
    });

    restartButton?.addEventListener("click", start);

    doraImage.addEventListener("load", draw);
    dinosaurImage.addEventListener("load", draw);

    start();
})();
