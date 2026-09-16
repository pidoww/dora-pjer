(() => {
    "use strict";

    const ASSET = "images/slike%20update%20stranica/";
    const SHINY_CHANCE = 1 / 64;
    const onIndex = location.pathname === "/" || location.pathname.endsWith("/index.html") || location.pathname.endsWith("index.html");
    const onChypsiPage = location.pathname.endsWith("/chipsy.html") || location.pathname.endsWith("chipsy.html");
    const onSnakePage = location.pathname.endsWith("/snake.html") || location.pathname.endsWith("snake.html");
    const onHikesPage = location.pathname.endsWith("/hikes.html") || location.pathname.endsWith("hikes.html");

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

    const chypsiAnger = [
        "Chypsi te je primijetio.",
        "Chypsi: ...",
        "Chypsi te gleda.",
        "Chypsi nije oduševljen.",
        "Chypsi se počinje ljutiti.",
        "Chypsi: nemoj više.",
        "Chypsi je sad stvarno ljut.",
        "zadnje upozorenje."
    ];

    let titleClicks = 0;
    let hikingClicks = 0;
    let friendClicks = 0;
    let ankleClicks = 0;
    let footerClicks = 0;
    let iciciStep = 0;
    let chypsiStep = 0;
    let typed = "";
    let lastMemeImage = "";
    let konamiIndex = 0;

    const clickTimers = new WeakMap();
    const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

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
                <img id="meme-image" class="no-lightbox" src="" alt="random cursed slika">
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

    function closeMeme() {
        document.getElementById("meme-popup")?.classList.add("hidden");
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

    function showMemeTimed(customText = null, imageOverride = null, duration = 500) {
        showMeme(customText, imageOverride);
        window.setTimeout(closeMeme, duration);
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
                <p class="image-lightbox-hint" id="image-lightbox-hint">zatvara se samo na X</p>
            </div>
        `;

        document.body.appendChild(lightbox);

        lightbox.querySelector(".image-lightbox-close")?.addEventListener("click", () => {
            lightbox.classList.add("hidden");
            chypsiStep = 0;
        });

        const largeImage = lightbox.querySelector("#image-lightbox-image");

        largeImage?.addEventListener("click", event => {
            event.stopPropagation();

            if ((largeImage.dataset.action || "") === "chypsi") {
                advanceChypsi();
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
        hint.textContent = action === "chypsi"
            ? "klikni Chypsija još koji put · zatvara se samo na X"
            : "zatvara se samo na X";

        lightbox.classList.remove("hidden");
    }

    function setLightboxText(text, hint = null) {
        const lightbox = ensureLightbox();
        const caption = lightbox.querySelector("#image-lightbox-caption");
        const hintElement = lightbox.querySelector("#image-lightbox-hint");

        if (caption) caption.textContent = text;
        if (hint !== null && hintElement) hintElement.textContent = hint;
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
        if (onSnakePage) return;

        const link = document.createElement("a");
        link.className = "game-shortcut";
        link.href = "snake.html";
        link.textContent = "🎮 DORA VS DINO";
        document.body.appendChild(link);
    }

    function isChypsiImage(image) {
        const src = decodeURIComponent(image.getAttribute("src") || "").toLowerCase();
        const alt = (image.getAttribute("alt") || "").toLowerCase();

        return (
            image.id === "chipsy-lab-image" ||
            image.classList.contains("chipsy-photo") ||
            src.includes("chipsi slika") ||
            src.endsWith("img2.jpg") ||
            src.endsWith("img3.jpg") ||
            alt.includes("chypsi") ||
            alt.includes("chipsy")
        );
    }

    function openChypsi(image) {
        if (onChypsiPage) return;

        chypsiStep = 1;
        openImage(image.src, chypsiAnger[0], "chypsi");
    }

    function advanceChypsi() {
        if (onChypsiPage || chypsiStep < 1) return;

        chypsiStep += 1;
        const lightbox = ensureLightbox();
        const image = lightbox.querySelector("#image-lightbox-image");

        if (!image) return;

        if (chypsiStep === 2) {
            image.src = `${ASSET}chipsi%20slika.jpeg`;
            spawnChipCan(4);
            setLightboxText(chypsiAnger[1], "sad je to baš Chypsi. možda ga nemoj opet kliknuti.");
            return;
        }

        spawnChipCan(Math.min(3 + chypsiStep, 12));

        const angerText = chypsiAnger[Math.min(chypsiStep - 1, chypsiAnger.length - 1)];
        setLightboxText(angerText, "svaki klik ga još malo živcira · samo X zatvara");

        if (chypsiStep === 4) {
            image.classList.add("chypsi-angry");
        }

        if (chypsiStep === 6) {
            setLightboxText("CHYPSI SE STVARNO LJUTI.", "ozbiljno. X još uvijek radi.");
        }

        if (chypsiStep >= 8) {
            setLightboxText("oke. naljutio si Chypsija.", "prekasno za X.");
            spawnChipCan(24);
            window.setTimeout(() => {
                location.href = "chipsy.html";
            }, 700);
        }
    }

    function scheduleSingleClick(image, callback) {
        const oldTimer = clickTimers.get(image);
        if (oldTimer) window.clearTimeout(oldTimer);

        const timer = window.setTimeout(() => {
            clickTimers.delete(image);
            callback();
        }, 270);

        clickTimers.set(image, timer);
    }

    function cancelSingleClick(image) {
        const timer = clickTimers.get(image);
        if (timer) {
            window.clearTimeout(timer);
            clickTimers.delete(image);
        }
    }

    function glitchText(element, original) {
        if (!element) return;

        const junk = ["#", "%", "?", "!", "*", "7", "X"];
        let frames = 0;
        const timer = window.setInterval(() => {
            const chars = original.split("").map(char => {
                if (char === " ") return " ";
                return Math.random() < 0.28 ? random(junk) : char;
            });

            element.textContent = chars.join("");
            frames += 1;

            if (frames >= 5) {
                window.clearInterval(timer);
                element.textContent = original;
            }
        }, 55);
    }

    function triggerKonami() {
        if (!onIndex) return;

        document.body.classList.add("konami-mode");

        const banner = document.createElement("div");
        banner.className = "konami-banner";
        banner.textContent = "↑ ↑ ↓ ↓ ← → ← → B A";
        document.body.appendChild(banner);

        const title = document.getElementById("secret-title");
        if (title) glitchText(title, "KONAMI OTKLJUČAN");

        window.setTimeout(() => {
            document.body.classList.remove("konami-mode");
            banner.remove();
            if (title) title.textContent = "Zašto je Dora najbolja cura?";
        }, 5200);
    }

    const title = document.getElementById("secret-title");

    title?.addEventListener("click", () => {
        titleClicks += 1;
        showMeme(`naslov click #${titleClicks}`);

        if (titleClicks === 2) {
            glitchText(title, "Zašto je Dora najbolja cura?");
        }

        if (titleClicks === 3) {
            title.textContent = "zašto toliko klikaš naslov";
        }

        if (titleClicks === 5) {
            title.textContent = "ozbiljno prestani";
        }

        if (titleClicks >= 7) {
            document.body.classList.toggle("trash-mode");
            title.textContent = "Zašto je Dora najbolja cura?";
            titleClicks = 0;
        }
    });

    document.querySelectorAll("img:not(.no-lightbox)").forEach(image => {
        if (image.id === "meme-image") return;

        if (isChypsiImage(image) && !onChypsiPage) {
            image.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                openChypsi(image);
            });
            return;
        }

        image.addEventListener("dblclick", event => {
            event.preventDefault();
            event.stopPropagation();
            cancelSingleClick(image);
            openImage(image.src, image.alt || "slika");
        });

        image.addEventListener("click", event => {
            if (!onIndex && !onHikesPage) return;

            if (image.id === "icici-photo") {
                event.preventDefault();
                event.stopPropagation();

                scheduleSingleClick(image, () => {
                    const caption = document.getElementById("icici-caption");

                    if (iciciStep === 0) {
                        image.src = `${ASSET}funny%20slika%20na%20plazi.jpeg`;
                        image.alt = "Ičići ljetovanje nastavak";
                        if (caption) caption.textContent = "Ičići arhiva 2/2 · klikni još jednom → vlogovi";
                        iciciStep = 1;
                    } else {
                        location.href = "youtube.html";
                    }
                });
                return;
            }

            if (image.closest("#hiking-secret")) {
                event.preventDefault();
                event.stopPropagation();

                scheduleSingleClick(image, () => {
                    hikingClicks += 1;
                    const caption = document.getElementById("hiking-caption");

                    if (hikingClicks === 1 && caption) caption.textContent = "Dora s lepršavom kosom... hmm";
                    if (hikingClicks === 2 && caption) caption.textContent = "još jedan klik i ideš negdje";
                    if (hikingClicks >= 3) location.href = "hikes.html";
                });
                return;
            }

            if (image.closest("#friend-secret")) {
                scheduleSingleClick(image, () => {
                    friendClicks += 1;
                    if (friendClicks >= 3) {
                        showMeme("Konrad + Maja + Lea + Pjer + Dora (MLMZ)", `${ASSET}slika%20konrad%20i%20maja%20lea.jpeg`);
                        friendClicks = 0;
                    }
                });
                return;
            }

            const ankle = image.closest("#ankle-photo");
            if (ankle) {
                event.preventDefault();
                event.stopPropagation();

                scheduleSingleClick(image, () => {
                    ankleClicks += 1;
                    const caption = ankle.querySelector("figcaption");

                    if (ankleClicks === 1 && caption) caption.textContent = "ništa se još nije dogodilo";
                    if (ankleClicks === 2 && caption) caption.textContent = "ovo izgleda nestabilno";

                    if (ankleClicks >= 3) {
                        ankle.classList.remove("ankle-fall");
                        void ankle.offsetWidth;
                        ankle.classList.add("ankle-fall");
                        if (caption) caption.textContent = "oke sad je pala i sama slika";

                        window.setTimeout(() => {
                            ankle.classList.remove("ankle-fall");
                            if (caption) caption.textContent = "par trenutaka prije neočekivanog završetka hika";
                        }, 2200);

                        ankleClicks = 0;
                    }
                });
            }
        });
    });

    const question = document.getElementById("definitely-not-secret");

    question?.addEventListener("click", event => {
        event.preventDefault();
        showMeme("ovo je doslovno samo upitnik. ili možda nije.");
    });

    if (onIndex) {
        const footerSecret = document.querySelector(".footer-secret");

        footerSecret?.addEventListener("click", () => {
            footerClicks += 1;

            if (footerClicks >= 6) {
                showMeme("webmaster trenutno nije dostupan", `${ASSET}slika%20dok%20spavam%20u%20busu.jpeg`);
                footerClicks = 0;
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (onIndex) {
            const expected = KONAMI[konamiIndex];
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            const expectedKey = expected.length === 1 ? expected.toLowerCase() : expected;

            if (key === expectedKey) {
                konamiIndex += 1;
                if (konamiIndex === KONAMI.length) {
                    konamiIndex = 0;
                    triggerKonami();
                }
            } else if (key === (KONAMI[0].length === 1 ? KONAMI[0].toLowerCase() : KONAMI[0])) {
                konamiIndex = 1;
            } else {
                konamiIndex = 0;
            }
        }

        if (!onIndex || event.key.length !== 1) return;

        typed += event.key.toLowerCase();
        typed = typed.slice(-12);

        if (typed.endsWith("dora")) {
            showMeme("tajni kod DORA prihvaćen");
            typed = "";
        }

        if (typed.endsWith("chypsi")) {
            spawnChipCan(12);
            showMeme("CHYPSI MODE", `${ASSET}chipsi%20slika.jpeg`);
            typed = "";
        }
    });

    ensureGameShortcut();

    if (!onSnakePage && !onChypsiPage && !onHikesPage && Math.random() < SHINY_CHANCE) {
        document.body.classList.add("shiny-event");
        window.setTimeout(() => {
            showMeme("✨ SHINY PAGE! šansa: 1/64. ništa korisno nisi dobio.");
        }, 650);
    }

    window.doraSite = {
        showMeme,
        showMemeTimed,
        closeMeme,
        openImage,
        spawnChipCan,
        crazyImages
    };
})();
