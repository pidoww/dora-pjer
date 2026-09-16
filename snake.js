(() => {
    "use strict";

    const canvas = document.getElementById("snake");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const bestElement = document.getElementById("best-score");
    const restartButton = document.getElementById("restart");

    const GRID = 8;
    const SIZE = canvas.width / GRID;
    const SPEED = 165;

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
    let timer = null;

    let best = 0;
    try {
        best = Number(localStorage.getItem("doraDinoBest")) || 0;
    } catch {}

    if (bestElement) bestElement.textContent = String(best);

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

    function endGame() {
        dead = true;
        clearInterval(timer);
        timer = null;

        drawEndMessage("DORA JE UDARILA U ZID", `uhvaćeni dinosauri: ${score}`);

        if (score >= 8 && window.doraSite?.showMeme) {
            window.setTimeout(() => {
                window.doraSite.showMeme(`Dora je prije sudara uhvatila ${score} dinosaura.`);
            }, 500);
        }
    }

    function winGame() {
        dead = true;
        clearInterval(timer);
        timer = null;
        drawEndMessage("NEMA VIŠE DINOSAURA", "napunio si svih 64 polja. ovo je zabrinjavajuće.");

        window.doraSite?.showMeme("64 polja. Dora je završila mezozoik.");
    }

    function tick() {
        if (dead) return;

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
            if (scoreElement) scoreElement.textContent = String(score);

            if (score > best) {
                best = score;
                if (bestElement) bestElement.textContent = String(best);
                try {
                    localStorage.setItem("doraDinoBest", String(best));
                } catch {}
            }

            if (snake.length >= GRID * GRID) {
                food = null;
                winGame();
                return;
            }

            food = randomFood();

            if (score === 5 && window.doraSite?.showMeme) {
                window.doraSite.showMeme("5 dinosaura. Dora postaje prijetnja mezozoiku.");
            }

            if (score === 10 && window.doraSite?.showMeme) {
                window.doraSite.showMeme("10 DINOSAURA. ovo više nije snake nego masovno izumiranje.");
            }
        } else {
            snake.pop();
        }

        draw();
    }

    function start() {
        clearInterval(timer);

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

        if (scoreElement) scoreElement.textContent = "0";

        draw();
        timer = window.setInterval(tick, SPEED);
    }

    function changeDirection(x, y) {
        if (direction.x + x === 0 && direction.y + y === 0) return;
        nextDirection = { x, y };
    }

    document.addEventListener("keydown", event => {
        const key = event.key.toLowerCase();

        if (key === "arrowup" || key === "w") {
            event.preventDefault();
            changeDirection(0, -1);
        } else if (key === "arrowdown" || key === "s") {
            event.preventDefault();
            changeDirection(0, 1);
        } else if (key === "arrowleft" || key === "a") {
            event.preventDefault();
            changeDirection(-1, 0);
        } else if (key === "arrowright" || key === "d") {
            event.preventDefault();
            changeDirection(1, 0);
        }
    });

    document.querySelectorAll("[data-dir]").forEach(button => {
        button.addEventListener("click", () => {
            const value = button.dataset.dir;
            if (value === "up") changeDirection(0, -1);
            if (value === "down") changeDirection(0, 1);
            if (value === "left") changeDirection(-1, 0);
            if (value === "right") changeDirection(1, 0);
        });
    });

    restartButton?.addEventListener("click", start);

    doraImage.addEventListener("load", draw);
    dinosaurImage.addEventListener("load", draw);

    start();
})();
