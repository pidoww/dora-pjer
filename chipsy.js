(() => {
    "use strict";

    const hammer = document.getElementById("schrodinger-hammer");
    const target = document.getElementById("schrodinger-target");
    const photo = document.getElementById("schrodinger-photo");
    const message = document.getElementById("bonk-message");
    const countElement = document.getElementById("bonk-count");
    const bonkButton = document.getElementById("bonk-button");
    const chipsButton = document.getElementById("chips-button");
    const image = document.getElementById("chipsy-lab-image");

    if (!bonkButton || !chipsButton) return;

    const ASSET = "images/slike%20update%20stranica/";

    const messages = [
        "Schrödinger nije ovo stavio u originalni eksperiment.",
        "BONK. valna funkcija se osjeća ugroženo.",
        "Chypsi odbija komentirati događaj.",
        "laboratorij je sada 12% manje kvantan.",
        "mjerenje je izvršeno vrlo neprofesionalno.",
        "peer review je upravo napustio chat.",
        "čips je opažen. eksperiment je kompromitiran.",
        "Schrödinger traži godišnji odmor.",
        "Chypsi: miau. fizika: ???"
    ];

    let bonks = 0;

    function random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function animateHammer() {
        if (!hammer) return;
        hammer.classList.remove("bonk");
        void hammer.offsetWidth;
        hammer.classList.add("bonk");
    }

    function shakeTarget() {
        if (!target) return;

        target.animate(
            [
                { transform: "translateX(0) rotate(3deg)" },
                { transform: "translateX(-10px) rotate(-5deg)" },
                { transform: "translateX(9px) rotate(7deg)" },
                { transform: "translateX(-4px) rotate(0deg)" },
                { transform: "translateX(0) rotate(3deg)" }
            ],
            {
                duration: 360,
                easing: "linear"
            }
        );

        if (photo) {
            photo.animate(
                [
                    { filter: "contrast(1)", transform: "scale(1)" },
                    { filter: "contrast(1.6)", transform: "scale(.96)" },
                    { filter: "contrast(1)", transform: "scale(1)" }
                ],
                { duration: 330 }
            );
        }
    }

    function randomizeChypsi() {
        if (!image || bonks % 5 !== 0) return;

        const options = [
            `${ASSET}chipsi%20slika.jpeg`,
            `${ASSET}crazy%20slika.jpeg`,
            `${ASSET}slika%20crazy%20kokos.jpeg`
        ];

        image.src = random(options);
    }

    function bonk() {
        bonks += 1;

        animateHammer();
        shakeTarget();
        window.doraSite?.spawnChipCan(Math.min(2 + bonks, 12));

        if (countElement) countElement.textContent = String(bonks);
        if (message) message.textContent = random(messages);

        if (bonks === 5 && message) {
            message.textContent = "5 BONKOVA. Chypsi je sada istovremeno gladan i nije gladan.";
        }

        if (bonks === 10) {
            window.doraSite?.showMeme("10 bonkova. kvantna mehanika je službeno odustala.", `${ASSET}crazy%20slika%20dora%20sova.jpeg`);
        }

        if (bonks === 15 && message) {
            message.textContent = "15 BONKOVA. LABORATORIJ JE PRESTAO GLUMITI DA JE OZBILJAN.";
            document.body.classList.add("trash-mode");
            window.doraSite?.spawnChipCan(30);
        }

        if (bonks >= 20) {
            bonks = 0;
            if (countElement) countElement.textContent = "0";
            if (message) message.textContent = "timeline resetiran. nitko ništa nije vidio.";
            document.body.classList.remove("trash-mode");
        }

        randomizeChypsi();
    }

    function chipsOnly() {
        window.doraSite?.spawnChipCan(18);

        if (message) {
            message.textContent = "uspješna industrijska proizvodnja čipsa.";
        }
    }

    bonkButton.addEventListener("click", bonk);
    chipsButton.addEventListener("click", chipsOnly);

    document.addEventListener("keydown", event => {
        if (event.key === " " && !event.repeat) {
            event.preventDefault();
            bonk();
        }
    });
})();
