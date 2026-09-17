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
        "BONK. Schrödinger nije ovo stavio u originalni misaoni eksperiment.",
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

    function animateHammer() {
        if (!hammer) return;
        hammer.classList.remove("bonk");
        void hammer.offsetWidth;
        hammer.classList.add("bonk");
    }

    function hitSchrodinger() {
        if (!target) return;
        target.classList.remove("hit");
        void target.offsetWidth;
        target.classList.add("hit");
        window.setTimeout(() => target.classList.remove("hit"), 280);
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
            message.textContent = "20/40. pola puta do physics.html. ovo je postalo commitment.";
            document.body.classList.add("trash-mode");
            window.setTimeout(() => document.body.classList.remove("trash-mode"), 1500);
        }

        if (bonks === 30 && message) {
            message.textContent = "30/40. Chypsi ima više bonkova nego ovaj eksperiment ima akademske vrijednosti.";
        }

        if (bonks >= MAX_BONKS) {
            goPhysics("40/40. dosta. idi pročitaj pravu fiziku.");
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
        const hints = [
            "hint: portret Schrödingera izgleda previše klikabilno.",
            "Schrödinger te je primijetio.",
            "oke, ovo očito nije samo fotografija.",
            "još malo i završit ćeš duboko u fizici.",
            "zadnji klik prije rupe bez dna."
        ];

        if (physicsHint) physicsHint.textContent = hints[Math.min(schrodingerClicks, hints.length - 1)];

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
            goPhysics("oke. Schrödinger shortcut otključan.");
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
