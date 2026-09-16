(() => {
    "use strict";

    const ASSET = "images/slike%20update%20stranica/";
    const SHINY_CHANCE = 1 / 64;

    const crazyImages = [
        `${ASSET}crazy%201.jpeg`,
        `${ASSET}crazy%202.jpeg`,
        `${ASSET}crazy%203.jpeg`,
        `${ASSET}crazy%20dora.jpeg`,
        `${ASSET}crazy%20slika%20dora%20sova.jpeg`,
        `${ASSET}crazy%20slika.jpeg`,
        `${ASSET}slika%20crazy%20kokos.jpeg`,
        `${ASSET}slika%20dok%20spavam%20u%20busu.jpeg`
    ];

    const memeTexts = [
        "čestitam. našao si nešto potpuno beskorisno.",
        "ovo nije trebalo biti ovdje.",
        "zašto si to kliknuo?",
        "achievement unlocked: previše slobodnog vremena",
        "oke dosta",
        "ovo je bilo skriveno s razlogom",
        "web dizajn je dosegao vrhunac",
        "Pjer je imao previše vremena"
    ];

    let titleClicks = 0;
    let chipsyClicks = 0;
    let hikingClicks = 0;
    let friendClicks = 0;
    let ankleClicks = 0;
    let footerClicks = 0;
    let typed = "";
    let lastMemeImage = "";

    function random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function randomDifferent(array, previous) {
        if (array.length < 2) return array[0];

        let picked = random(array);
        let guard = 0;

        while (picked === previous && guard < 12) {
            picked = random(array);
            guard += 1;
        }

        return picked;
    }

    function ensurePopup() {
        let popup = document.getElementById("meme-popup");

        if (!popup) {
            popup = document.createElement("div");
            popup.id = "meme-popup";
            popup.className = "meme-popup hidden";
            popup.setAttribute("role", "dialog");
            popup.setAttribute("aria-modal", "true");
            popup.innerHTML = `
                <button id="close-meme" type="button" aria-label="zatvori">x</button>
                <img id="meme-image" src="" alt="random cursed slika">
                <p id="meme-text"></p>
            `;
            document.body.appendChild(popup);
        }

        const close = popup.querySelector("#close-meme");

        if (close && !close.dataset.ready) {
            close.dataset.ready = "1";
            close.addEventListener("click", () => popup.classList.add("hidden"));
        }

        return popup;
    }

    function showMeme(customText = null, imageOverride = null) {
        const popup = ensurePopup();
        const image = popup.querySelector("#meme-image");
        const text = popup.querySelector("#meme-text");

        if (!image || !text) return;

        const nextImage = imageOverride || randomDifferent(crazyImages, lastMemeImage);
        lastMemeImage = nextImage;

        image.src = nextImage;
        text.textContent = customText || random(memeTexts);

        popup.classList.remove("hidden");
        popup.classList.remove("meme-shake");
        void popup.offsetWidth;
        popup.classList.add("meme-shake");
    }

    function ensureLightbox() {
        let lightbox = document.getElementById("image-lightbox");

        if (lightbox) return lightbox;

        lightbox = document.createElement("div");
        lightbox.id = "image-lightbox";
        lightbox.className = "image-lightbox hidden";
        lightbox.innerHTML = `
            <div class="image-lightbox-card">
                <button class="image-lightbox-close" type="button" aria-label="zatvori">x</button>
                <img id="image-lightbox-image" src="" alt="povećana slika">
                <p class="image-lightbox-caption" id="image-lightbox-caption"></p>
                <p class="image-lightbox-hint" id="image-lightbox-hint">klikni X ili izvan slike za zatvaranje</p>
            </div>
        `;

        document.body.appendChild(lightbox);

        lightbox.querySelector(".image-lightbox-close")?.addEventListener("click", () => {
            lightbox.classList.add("hidden");
        });

        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) {
                lightbox.classList.add("hidden");
            }
        });

        const largeImage = lightbox.querySelector("#image-lightbox-image");

        largeImage?.addEventListener("click", () => {
            const action = largeImage.dataset.action || "";

            if (action === "chipsy") {
                spawnChipCan(14);
                chipsyClicks += 1;

                if (!location.pathname.endsWith("/chipsy.html") && !location.pathname.endsWith("chipsy.html")) {
                    window.setTimeout(() => {
                        location.href = "chipsy.html";
                    }, 420);
                }
            }

            if (action === "icici-youtube") {
                location.href = "youtube.html";
            }
        });

        return lightbox;
    }

    function openImage(src, caption = "", action = "") {
        const lightbox = ensureLightbox();
        const image = lightbox.querySelector("#image-lightbox-image");
        const captionElement = lightbox.querySelector("#image-lightbox-caption");
        const hint = lightbox.querySelector("#image-lightbox-hint");

        if (!image || !captionElement || !hint) return;

        image.src = src;
        image.dataset.action = action;
        captionElement.textContent = caption;

        if (action === "chipsy") {
            hint.textContent = "klikni još jednom na Chipsyja";
        } else if (action === "icici-youtube") {
            hint.textContent = "klikni sliku još jednom → Dora Pjer Vlogs";
        } else {
            hint.textContent = "klikni X ili izvan slike za zatvaranje";
        }

        lightbox.classList.remove("hidden");
    }

    function ensureChipLayer() {
        let layer = document.getElementById("chip-layer");

        if (!layer) {
            layer = document.createElement("div");
            layer.id = "chip-layer";
            layer.className = "chip-layer";
            layer.setAttribute("aria-hidden", "true");
            document.body.appendChild(layer);
        }

        return layer;
    }

    function spawnChipCan(amount = 1) {
        const layer = ensureChipLayer();

        for (let i = 0; i < amount; i += 1) {
            const can = document.createElement("div");
            can.className = "chip-can";
            can.style.left = `${4 + Math.random() * 88}vw`;
            can.style.top = `${-150 - Math.random() * 180}px`;
            can.style.animationDelay = `${Math.random() * 0.18}s`;
            can.style.animationDuration = `${1.15 + Math.random() * 0.75}s`;
            can.style.transform = `rotate(${Math.random() * 50 - 25}deg)`;
            layer.appendChild(can);
            window.setTimeout(() => can.remove(), 2600);
        }
    }

    function ensureGameShortcut() {
        if (document.querySelector(".game-shortcut")) return;
        if (location.pathname.endsWith("snake.html")) return;

        const link = document.createElement("a");
        link.className = "game-shortcut";
        link.href = "snake.html";
        link.textContent = "🎮 DORA VS DINO";
        document.body.appendChild(link);
    }

    function isChipsyImage(image) {
        const src = decodeURIComponent(image.getAttribute("src") || "").toLowerCase();
        const alt = (image.getAttribute("alt") || "").toLowerCase();

        return (
            image.id === "chipsy-lab-image" ||
            image.classList.contains("chipsy-photo") ||
            src.includes("chipsi slika") ||
            src.endsWith("img2.jpg") ||
            src.endsWith("img3.jpg") ||
            alt.includes("chipsy")
        );
    }

    function chipsyHit() {
        chipsyClicks += 1;
        spawnChipCan(Math.min(1 + chipsyClicks, 9));

        const caption = document.getElementById("chipsy-caption");

        if (chipsyClicks === 2 && caption) {
            caption.textContent = "Chipsy je proizveo čips???";
        }

        if (chipsyClicks === 4) {
            openImage(
                `${ASSET}chipsi%20slika.jpeg`,
                "CHIPSY DROP. klikni još jednom.",
                "chipsy"
            );
        }

        if (chipsyClicks >= 8 && !location.pathname.endsWith("chipsy.html")) {
            spawnChipCan(20);
            window.setTimeout(() => {
                location.href = "chipsy.html";
            }, 650);
        }
    }

    const title = document.querySelector(".top h1");

    title?.addEventListener("click", () => {
        titleClicks += 1;
        showMeme(`naslov click #${titleClicks} · slika mora biti drugačija`);

        if (titleClicks === 3) {
            title.textContent = "zašto toliko klikaš naslov";
        }

        if (titleClicks === 5) {
            title.textContent = "ozbiljno prestani";
        }

        if (titleClicks >= 7) {
            document.body.classList.toggle("trash-mode");
            if (title.id === "secret-title") {
                title.textContent = "Zašto je Dora najbolja cura?";
            }
            spawnChipCan(6);
            titleClicks = 0;
        }
    });

    document.querySelectorAll("img:not(.no-lightbox)").forEach(image => {
        if (image.id === "meme-image") return;

        image.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            if (image.id === "icici-photo") {
                openImage(
                    `${ASSET}funny%20slika%20na%20plazi.jpeg`,
                    "Ičići arhiva 2/2 · klikni opet i ideš na vlogove",
                    "icici-youtube"
                );
                return;
            }

            const ankle = image.closest("#ankle-photo");
            if (ankle) {
                ankleClicks += 1;

                if (ankleClicks >= 3) {
                    const caption = ankle.querySelector("figcaption");
                    ankle.classList.remove("ankle-fall");
                    void ankle.offsetWidth;
                    ankle.classList.add("ankle-fall");

                    if (caption) caption.textContent = "i onda je stvar stvarno krenula nizbrdo";

                    window.setTimeout(() => {
                        ankle.classList.remove("ankle-fall");
                        if (caption) caption.textContent = "par trenutaka prije nego Dora padne i istegne gležanj";
                    }, 2200);

                    ankleClicks = 0;
                }
            }

            if (image.closest("#hiking-secret")) {
                hikingClicks += 1;

                if (hikingClicks >= 4) {
                    location.href = "hikes.html";
                    return;
                }
            }

            if (image.closest("#friend-secret")) {
                friendClicks += 1;
                if (friendClicks >= 3) {
                    showMeme("Konrad + Maja Leea (MLMZ) squad easter egg", `${ASSET}slika%20konrad%20i%20maja%20lea.jpeg`);
                    friendClicks = 0;
                }
            }

            if (isChipsyImage(image)) {
                chipsyHit();
                openImage(image.src, image.alt || "Chipsy", "chipsy");
                return;
            }

            openImage(image.src, image.alt || "slika");
        });
    });

    const question = document.getElementById("definitely-not-secret");

    question?.addEventListener("click", event => {
        event.preventDefault();
        showMeme("ovo je doslovno samo upitnik. ili možda nije.");
    });

    const footerSecret = document.querySelector(".footer-secret");

    footerSecret?.addEventListener("click", () => {
        footerClicks += 1;

        if (footerClicks >= 6) {
            showMeme("webmaster trenutno nije dostupan", `${ASSET}slika%20dok%20spavam%20u%20busu.jpeg`);
            footerClicks = 0;
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            document.getElementById("image-lightbox")?.classList.add("hidden");
            document.getElementById("meme-popup")?.classList.add("hidden");
            return;
        }

        if (event.key.length !== 1) return;

        typed += event.key.toLowerCase();
        typed = typed.slice(-12);

        if (typed.endsWith("dora")) {
            showMeme("tajni kod DORA prihvaćen");
            typed = "";
        }

        if (typed.endsWith("chipsy")) {
            spawnChipCan(15);
            openImage(`${ASSET}chipsi%20slika.jpeg`, "CHIPSY MODE · klikni ga", "chipsy");
            typed = "";
        }
    });

    document.addEventListener("click", event => {
        const popup = document.getElementById("meme-popup");
        if (!popup || popup.classList.contains("hidden")) return;

        if (event.target === popup) {
            popup.classList.add("hidden");
        }
    });

    ensureGameShortcut();

    if (Math.random() < SHINY_CHANCE) {
        document.body.classList.add("shiny-event");
        window.setTimeout(() => {
            showMeme("✨ SHINY PAGE! šansa: 1/64 (1.5625%). ništa korisno nisi dobio.");
        }, 650);
    }

    window.doraSite = {
        showMeme,
        openImage,
        spawnChipCan,
        crazyImages
    };
})();
