(() => {
    "use strict";

    const canvas = document.getElementById("snake");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const bestElement = document.getElementById("best-score");
    const levelElement = document.getElementById("game-level");
    const restartButton = document.getElementById("restart");
    const rewardBox = document.getElementById("side-reward");
    const rewardImage = document.getElementById("side-reward-image");
    const rewardText = document.getElementById("side-reward-text");

    const MOBILE_MODE = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    document.body.classList.toggle("mobile-game-mode", MOBILE_MODE);

    const GRID = 8;
    const SIZE = canvas.width / GRID;
    const START_SPEED = MOBILE_MODE ? 265 : 205;
    const MIN_SPEED = MOBILE_MODE ? 135 : 88;
    const ASSET = "images/slike%20update%20stranica/";

    const levelArt = [
        { image: `${ASSET}crazy%201.jpeg`, text: "dinosauri još nisu zabrinuti" },
        { image: `${ASSET}crazy%202.jpeg`, text: "situacija postaje čudna" },
        { image: `${ASSET}crazy%203.jpeg`, text: "mezozoik gubi kontrolu" },
        { image: `${ASSET}crazy%20dora.jpeg`, text: "Dora eskalira" },
        { image: `${ASSET}crazy%20slika%20dora%20sova.jpeg`, text: "sova zna što si napravio" },
        { image: `${ASSET}crazy%20slika.jpeg`, text: "ovo je već osobno" },
        { image: `${ASSET}slika%20crazy%20kokos.jpeg`, text: "nema više pravila" }
    ];

    const doraImage = new Image();
    doraImage.src = `${ASSET}slika%20dora%20za%20snake%20game.jpeg`;

    const dinosaurSources = [
        `${ASSET}dinosaur.png`,
        `${ASSET}tyrannosaurus-rex-dinosaur-23090111.jpg`,
        "images/dinosaurus%20parasaurolopus.jpg",
        "images/brachiosaurus-dinosaurs-toy-isolated-white-background-clipping-path-dinosaur-jurassic-morrison-formation-north-87172614.jpg"
    ];

    const dinosaurImages = dinosaurSources.map(src => {
        const image = new Image();
        image.src = src;
        return image;
    });

    let currentDinosaurImage = dinosaurImages[0];

    function pickRandomDinosaur() {
        currentDinosaurImage = dinosaurImages[Math.floor(Math.random() * dinosaurImages.length)];
    }

    let snake = [];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let food = null;
    let score = 0;
    let dead = false;
    let paused = false;
    let timer = null;
    let touchStart = null;
    let shownLevel = 0;

    let best = 0;
    try {
        best = Number(localStorage.getItem("doraDinoBest")) || 0;
    } catch {}

    function currentLevel() {
        return 1 + Math.floor(score / 3);
    }

    function currentSpeed() {
        const levelDrop = (currentLevel() - 1) * (MOBILE_MODE ? 7 : 13);
        const scoreDrop = score * (MOBILE_MODE ? 1.5 : 3);
        return Math.max(MIN_SPEED, START_SPEED - levelDrop - scoreDrop);
    }

    function levelArtFor(level) {
        return levelArt[(Math.max(1, level) - 1) % levelArt.length];
    }

    function updateLevelArt(force = false) {
        if (!rewardBox || !rewardImage || !rewardText) return;

        const level = currentLevel();
        if (!force && level === shownLevel) return;

        shownLevel = level;
        const art = levelArtFor(level);
        rewardImage.src = art.image;
        rewardText.textContent = `level ${level} · ${art.text}`;
        rewardBox.classList.remove("level-change");
        void rewardBox.offsetWidth;
        rewardBox.classList.add("level-change");
        window.setTimeout(() => rewardBox.classList.remove("level-change"), 560);
    }

    function updateHud() {
        if (scoreElement) scoreElement.textContent = String(score);
        if (bestElement) bestElement.textContent = String(best);
        if (levelElement) levelElement.textContent = String(currentLevel());
        updateLevelArt();
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
        pickRandomDinosaur();
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

            const ratio = image.naturalWidth / image.naturalHeight;
            let sx = 0;
            let sy = 0;
            let sw = image.naturalWidth;
            let sh = image.naturalHeight;

            if (ratio > 1) {
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
                index === 0 ? 1 : 4
            );

            if (index === 0) {
                ctx.strokeStyle = "#111";
                ctx.lineWidth = 3;
                ctx.strokeRect(part.x * SIZE + 2, part.y * SIZE + 2, SIZE - 4, SIZE - 4);
            }
        });

        if (food) {
            drawSquareImage(currentDinosaurImage, food.x, food.y, "#4c9b43", 1);
        }
    }

    function drawEndMessage(title, subtitle) {
        draw();
        ctx.fillStyle = "rgba(0,0,0,.79)";
        ctx.fillRect(0, canvas.height / 2 - 68, canvas.width, 136);
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 11);
        ctx.font = "16px Arial";
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 31);
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
        window.setTimeout(() => canvas.classList.remove("dino-caught"), 150);
    }

    function lose(reason) {
        dead = true;
        stopTimer();

        const restartText = MOBILE_MODE ? "stisni OPET ispod" : "Enter za opet";
        if (reason === "self") {
            drawEndMessage("DORA JE UGRIZLA SAMU SEBE", `uhvaćeni dinosauri: ${score} · ${restartText}`);
        } else {
            drawEndMessage("DORA JE UDARILA U ZID", `uhvaćeni dinosauri: ${score} · ${restartText}`);
        }
    }

    function winGame() {
        dead = true;
        stopTimer();
        drawEndMessage("NEMA VIŠE DINOSAURA", "arena je puna. ovo je zabrinjavajuće.");
        if (rewardText) rewardText.textContent = "Dora je završila mezozoik.";
    }

    function tick() {
        if (dead || paused) return;

        direction = nextDirection;

        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
        if (hitWall) {
            lose("wall");
            return;
        }

        const hitSelf = snake.some(part => part.x === head.x && part.y === head.y);
        if (hitSelf) {
            lose("self");
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
        shownLevel = 0;

        updateHud();
        updateLevelArt(true);
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
            if (value === "right")
