(() => {
    "use strict";

    const hammer = document.getElementById("schrodinger-hammer");
    const target = document.getElementById("schrodinger-target");
    const photo = document.getElementById("schrodinger-photo");
    const message = document.getElementById("bonk-message");
    const countElement = document.getElementById("bonk-count");
    const progressFill = document.getElementById("bonk-progress-fill");
    const bonkButton = document.getElementById("bonk-button");
    const chipsButton = document.getElementById("chips-button");
    const image = document.getElementById("chipsy-lab-image");
    const physicsHint = document.getElementById("schrodinger-hint");

    if (!bonkButton || !chipsButton || !image) return;

    const ASSET = "images/slike%20update%20stranica/";
    const MAX_BONKS = 40;

    const messages = [
        "BONK. Schrödinger ovo definitivno nije stavio u originalni misaoni eksperiment.",
        "Chypsi je upravo kolabirao raspoloženje, ne valnu funkciju.",
        "laboratorij je sada 12% manje akademski.",
        "mjerenje je izvršeno vrlo neprofesionalno.",
        "peer review je upravo napustio chat.",
        "čips je opažen. eksperiment je kompromitiran.",
        "Schrödinger razmatra promjenu profesije.",
        "Chypsi: miau. fizika: ???",
        "čekić nema mjesto u Copenhagen interpretaciji.",
        "ovo nije kako je Born definirao vjerojatnost."
    ];

    let bonks = 0;
    let schrodingerClicks = 0;
    let redirecting = false;

    function random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function updateProgress() {
        if (countElement) countElement.textContent = String(bonks);
        if (progressFill) progressFill.style.width = `${Math.min(100, (bonks / MAX_BONKS) * 100)}%`;
    }

    function spawnBonkText() {
        if (!target) return;

        const text = document.createElement("div");
        text.textContent = "BONK!";
        text.style.position = "absolute";
        text.style.left = `${48 + Math.random() * 30}%`;
        text.style.top = `${8 + Math.random() * 26}%`;
        text.style.zIndex = "20";
        text.style.pointerEvents = "none";
        text.style.font = "900 24px Arial, sans-serif";
        text.style.color = "#e13232";
        text.style.webkitTextStroke = "1px #111";
        text.style.textShadow = "3px 3px 0 #ffe969";
        text.style.transform = `rotate(${Math.random() * 20 - 10}deg) scale(.65)`;
        text.style.opacity = "0";

        const stage = target.closest(".chypsi-bonk-stage") || target.parentElement;
        stage?.appendChild(text);

        text.animate(
            [
                { opacity: 0, transform: "translateY(8px) rotate(-8deg) scale(.55)" },
                { opacity: 1, transform: "translateY(-4px) rotate(4deg) scale(1.18)", offset: 0.32 },
                { opacity: 1, transform: "translateY(-12px) rotate(-3deg) scale(1)", offset: 0.72 },
                { opacity: 0, transform: "translateY(-28px) rotate(8deg) scale(.9)" }
            ],
            { duration: 520, easing: "ease-out" }
        );

        window.setTimeout(() => text.remove(), 560);
    }

    function animateHammer() {
        if (!hammer || !target) return;

        const hammerRect = hammer.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const hammerCx = hammerRect.left + hammerRect.width / 2;
        const hammerCy = hammerRect.top + hammerRect.height / 2;
        const targetCx = targetRect.left + targetRect.width * 0.36;
        const targetCy = targetRect.top + targetRect.height * 0.38;

        const dx = targetCx - hammerCx;
        const dy = targetCy - hammerCy;

        hammer.getAnimations().forEach(animation => animation.cancel());

        hammer.animate(
            [
                { transform: "translate(0, 0) rotate(-42deg) scale(1)" },
                { transform: `translate(${dx * -0.08}px, ${dy * -0.08}px) rotate(-65deg) scale(1.03)`, offset: 0.24 },
                { transform: `translate(${dx * 0.54}px, ${dy * 0.48}px) rotate(38deg) scale(1.18)`, offset: 0.58 },
                { transform: `translate(${dx * 0.22}px, ${dy * 0.16}px) rotate(9deg) scale(1.06)`, offset: 0.74 },
                { transform: "translate(0, 0) rotate(-42deg) scale(1)" }
            ],
            {
                duration: 360,
                easing: "cubic-bezier(.18,.8,.25,1)"
            }
        );

        spawnBonkText();
    }

    function hitSchrodinger() {
        if (!target) return;
        target.classList.remove("hit");
        void target.offsetWidth;
        target.classList.add("hit");
        window.setTimeout(() => target.classList.remove("hit"), 300);
    }

    function randomizeChypsi() {
        if (!image || bonks === 0 || bonks % 10 !== 0) return;

        const options = [
            `${ASSET}chipsi%20slika.jpeg`,
            `${ASSET}crazy%20slika.jpeg`,
            `${ASSET}slika%20crazy%20kokos.jpeg`
        ];

        image.src = random(options);
    }

    function goPhysics(reason) {
        if (redirecting) return;
        redirecting = true;

        if (message) message.textContent = reason;
        if (progressFill) progressFill.style.width = "100%";
        window.doraSite?.spawnChipCan(28);

        window.setTimeout(() => {
            location.href = "physics.html";
        }, 800);
    }

    function bonk() {
        if (redirecting) return;

        bonks += 1;
        animateHammer();
        hitSchrodinger();
        updateProgress();

        window.doraSite?.spawnChipCan(Math.min(1 + Math.floor(bonks / 4), 10));
        if (message) message.textContent = random(messages);

        if (bonks === 5 && message) {
            message.textContent = "5/40. Chypsi tek zagrijava čekić.";
        }

        if (bonks === 10 && message) {
            message.textContent = "10/40. Schrödinger počinje preispitivati 1935.";
        }

        if (bonks === 20 && message) {
            message.textContent = "20/40. ovo je već postalo ozbiljan nedostatak nadzora.";
            document.body.classList.add("trash-mode");
            window.setTimeout(() => document.body.classList.remove("trash-mode"), 1500);
        }

        if (bonks === 30 && message) {
            message.textContent = "30/40. Chypsi ima više bonkova nego ovaj eksperiment akademske vrijednosti.";
        }

        if (bonks >= MAX_BONKS) {
            goPhysics("40/40. laboratorij više ne preuzima odgovornost.");
            return;
        }

        randomizeChypsi();
    }

    function chipsOnly() {
        window.doraSite?.spawnChipCan(18);
        if (message) message.textContent = "uspješna industrijska proizvodnja čipsa. bez dodatne fizike.";
    }

    function clickSchrodinger() {
        if (redirecting) return;

        schrodingerClicks += 1;
        const comments = [
            "Schrödinger te ignorira.",
            "Schrödinger te je primijetio.",
            "ovo mu se očito ne sviđa.",
            "situacija postaje neugodna.",
            "oke, sad je dosta."
        ];

        if (physicsHint) physicsHint.textContent = comments[Math.min(schrodingerClicks, comments.length - 1)];

        [photo, target].forEach(node => {
            node?.animate(
                [
                    { transform: "rotate(0deg) scale(1)" },
                    { transform: "rotate(-2deg) scale(1.025)" },
                    { transform: "rotate(1deg) scale(1)" }
                ],
                { duration: 230 }
            );
        });

        if (schrodingerClicks >= 5) {
            goPhysics("Schrödinger je napustio laboratorij.");
        }
    }

    bonkButton.addEventListener("click", bonk);
    image.addEventListener("click", bonk);
    chipsButton.addEventListener("click", chipsOnly);

    document.querySelectorAll(".schrodinger-secret").forEach(node => {
        node.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            clickSchrodinger();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === " " && !event.repeat) {
            event.preventDefault();
            bonk();
        }
    });

    updateProgress();
})();
