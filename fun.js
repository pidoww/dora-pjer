(() => {
    "use strict";

    const ASSET = "images/slike%20update%20stranica/";
    const SHINY_CHANCE = 1 / 64;

    const path = location.pathname.toLowerCase();
    const onIndex = path === "/" || path.endsWith("/index.html") || path.endsWith("index.html");
    const onChypsiPage = path.endsWith("/chipsy.html") || path.endsWith("chipsy.html");
    const onSnakePage = path.endsWith("/snake.html") || path.endsWith("snake.html");
    const onHikesPage = path.endsWith("/hikes.html") || path.endsWith("hikes.html");
    const onYoutubePage = path.endsWith("/youtube.html") || path.endsWith("youtube.html");
    const onProjectsPage = path.endsWith("/projects.html") || path.endsWith("projects.html");

    const FMHY_URL = "https://www.reddit.com/r/FREEMEDIAHECKYEAH/wiki/video/#wiki_.25B7_p-stream_forks";
    const FMHY_MORSE = ".... - - .--. ... ---... -..-. -..-. .-- .-- .-- .-.-.- .-. . -.. -.. .. - .-.-.- -.-. --- -- -..-. .-. -..-. ..-. .-. . . -- . -.. .. .- .... . -.-. -.- -.-- . .- .... -..-. .-- .. -.- .. -..-. ...- .. -.. . --- -..-. # .-- .. -.- .. ..--.- .-.-.- ..--- ..... -... --... ..--.- .--. -....- ... - .-. . .- -- ..--.- ..-. --- .-. -.- ...";

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

    const titleCodes = [
        {
            text: FMHY_MORSE,
            label: "Morse URL → FMHY video megathread (# ostaje literalno jer nema standardni međunarodni Morse znak)",
            href: FMHY_URL
        },
        {
            text: "Qapla'!  ·  nuqneH  ·  tej",
            label: "tlhIngan Hol: Qapla' = success · nuqneH = what do you want? · tej = scientist",
            href: "https://www.kli.org/duolingo/express-an-action/"
        },
        {
            text: "gur synt vf abg gur frperg",
            label: "ROT13",
            href: "https://en.wikipedia.org/wiki/ROT13"
        },
        {
            text: "01100100 01101111 01110010 01100001",
            label: "binary = dora",
            href: "https://en.wikipedia.org/wiki/Binary_number"
        },
        {
            text: "63 68 79 70 73 69",
            label: "hex",
            href: "https://en.wikipedia.org/wiki/Hexadecimal"
        },
        {
            text: "?ereh gnikool uoy era yhw",
            label: "ovo je samo naopačke",
            href: "https://xkcd.com/"
        },
        {
            text: "01000100 01010110 01000100",
            label: "stari internet problemi",
            href: "https://en.wikipedia.org/wiki/DVD_screensaver"
        }
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
    let ankleClicks = 0;
    let footerClicks = 0;
    let chypsiStep = 0;
    let projectsStep = 0;
    let typed = "";
    let lastMemeImage = "";
    let konamiIndex = 0;

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
                <a id="meme-link" class="meme-code-link hidden" href="#" target="_blank" rel="noopener noreferrer"></a>
            `;
            document.body.appendChild(popup);
        }

        if (!popup.querySelector("#meme-link")) {
            const link = document.createElement("a");
            link.id = "meme-link";
            link.className = "meme-code-link hidden";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            popup.appendChild(link);
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

    function showMeme(customText = null, imageOverride = null, code = null) {
        const popup = ensurePopup();
        const image = popup.querySelector("#meme-image");
        const text = popup.querySelector("#meme-text");
        const link = popup.querySelector("#meme-link");

        if (!image || !text || !link) return;

        const nextImage = imageOverride || randomDifferent(crazyImages, lastMemeImage);
        lastMemeImage = nextImage;

        image.src = nextImage;
        text.textContent = code?.text || customText || random(memeTexts);

        if (code?.href) {
            link.href = code.href;
            link.textContent = code.label || "otvori";
            link.classList.remove("hidden");
        } else {
            link.href = "#";
            link.textContent = "";
            link.classList.add("hidden");
        }

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
            projectsStep = 0;
        });

        const largeImage = lightbox.querySelector("#image-lightbox-image");
        largeImage?.addEventListener("click", event => {
            event.stopPropagation();
            const action = largeImage.dataset.action || "";

            if (action === "chypsi") {
                advanceChypsi();
            } else if (action === "projects") {
                advanceProjects();
            } else if (action === "pjer-random") {
                const target = Math.random() < 0.5 ? "projects.html" : "youtube.html";
                const caption = target === "projects.html"
                    ? "random izbor: Pjerovi projekti"
                    : "random izbor: Dora Pjer Vlogs";
                setLightboxText(caption, "ideš dalje...");
                window.setTimeout(() => {
                    location.href = target;
                }, 420);
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
        image.classList.remove("chypsi-angry");
        captionElement.textContent = caption;

        if (action === "chypsi") {
            hint.textContent = "klikni Chypsija još koji put · zatvara se samo na X";
        } else if (action === "projects") {
            hint.textContent = "ova slika skriva još nešto · zatvara se samo na X";
        } else if (action === "pjer-random") {
            hint.textContent = "klikni povećanu sliku: 50/50 projekti ili vlogovi · samo X zatvara";
        } else {
            hint.textContent = "zatvara se samo na X";
        }

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
            window.setTimeout(() => can.remove(), 2800);
        }
    }

    function ensureLegLayer() {
        let layer = document.getElementById("leg-layer");
        if (!layer) {
            layer = document.createElement("div");
            layer.id = "leg-layer";
            layer.className = "leg-layer";
            layer.setAttribute("aria-hidden", "true");
            document.body.appendChild(layer);
        }
        return layer;
    }

    function spawnLegs(amount = 6) {
        const layer = ensureLegLayer();
        const choices = ["🦵", "🥾", "🩹"];

        for (let i = 0; i < amount; i += 1) {
            const leg = document.createElement("div");
            leg.className = "falling-leg";
            leg.textContent = random(choices);
            leg.style.left = `${5 + Math.random() * 88}vw`;
            leg.style.animationDelay = `${Math.random() * 0.35}s`;
            leg.style.animationDuration = `${1.1 + Math.random() * 1.1}s`;
            layer.appendChild(leg);
            window.setTimeout(() => leg.remove(), 2800);
        }
    }

    function ensureGameShortcut() {
        if (document.querySelector(".game-shortcut") || onSnakePage) return;

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
            image.classList.contains("chypsi-photo") ||
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
            setLightboxText("Chypsi: ...", "sad je to baš Chypsi. možda ga nemoj opet kliknuti.");
            return;
        }

        spawnChipCan(Math.min(3 + chypsiStep, 13));
        const angerText = chypsiAnger[Math.min(chypsiStep - 1, chypsiAnger.length - 1)];
        setLightboxText(angerText, "svaki klik ga još malo živcira · samo X zatvara");

        if (chypsiStep === 4) {
            image.classList.add("chypsi-angry");
        }

        if (chypsiStep === 6) {
            setLightboxText("CHYPSI SE STVARNO LJUTI.", "ozbiljno. X još uvijek radi.");
        }

        if (chypsiStep >= 8) {
            setLightboxText("oke. naljutio si Chypsija.", "sad je prekasno.");
            spawnChipCan(24);
            window.setTimeout(() => {
                location.href = "chipsy.html";
            }, 700);
        }
    }

    function openProjects(image) {
        if (onProjectsPage) return;
        projectsStep = 1;
        openImage(image.src, "hmm. Pjer je opet završio na slici.", "projects");
    }

    function advanceProjects() {
        if (onProjectsPage || projectsStep < 1) return;
        projectsStep += 1;

        const messages = [
            "ništa posebno.",
            "oke ipak možda nešto skriva.",
            "još jedan klik?",
            "ovo više nije slučajno.",
            "dobro, evo projekata."
        ];

        setLightboxText(messages[Math.min(projectsStep - 2, messages.length - 1)], "samo X zatvara");

        if (projectsStep >= 5) {
            window.setTimeout(() => {
                location.href = "projects.html";
            }, 450);
        }
    }

    function glitchText(element, original) {
        if (!element) return;

        const junk = ["#", "%", "?", "!", "*", "7", "X", "0", "∆"];
        let frames = 0;
        const timer = window.setInterval(() => {
            element.textContent = original.split("").map(char => {
                if (char === " ") return " ";
                return Math.random() < 0.28 ? random(junk) : char;
            }).join("");

            frames += 1;
            if (frames >= 6) {
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
        }, 4200);
    }

    function triggerDvd() {
        if (document.querySelector(".dvd-bouncer")) return;

        const dvd = document.createElement("div");
        dvd.className = "dvd-bouncer";
        dvd.textContent = "DVD";
        document.body.appendChild(dvd);

        let x = 30;
        let y = 60;
        let vx = 2.8;
        let vy = 2.2;
        const started = performance.now();

        function frame(now) {
            const maxX = window.innerWidth - dvd.offsetWidth;
            const maxY = window.innerHeight - dvd.offsetHeight;

            x += vx;
            y += vy;

            if (x <= 0 || x >= maxX) vx *= -1;
            if (y <= 0 || y >= maxY) vy *= -1;

            x = Math.max(0, Math.min(maxX, x));
            y = Math.max(0, Math.min(maxY, y));
            dvd.style.transform = `translate(${x}px, ${y}px)`;

            if (now - started < 8000) {
                requestAnimationFrame(frame);
            } else {
                dvd.remove();
            }
        }

        requestAnimationFrame(frame);
    }

    function triggerMarqueeChaos(marquee) {
        if (marquee.classList.contains("marquee-chaos")) return;

        const span = marquee.querySelector("span");
        if (!span) return;

        const original = span.textContent;
        marquee.classList.add("marquee-chaos");
        span.setAttribute("aria-label", original);
        span.innerHTML = [...original].map((char, index) => {
            const safe = char === " " ? "&nbsp;" : char.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return `<b style="--letter:${index}">${safe}</b>`;
        }).join("");

        window.setTimeout(() => {
            span.textContent = original;
            span.removeAttribute("aria-label");
            marquee.classList.remove("marquee-chaos");
        }, 4200);
    }

    const title = document.getElementById("secret-title");
    title?.addEventListener("click", () => {
        titleClicks += 1;
        showMeme(null, null, random(titleCodes));

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

    document.querySelectorAll(".marquee-ish").forEach(marquee => {
        marquee.dataset.marqueeClicks = "0";
        marquee.style.cursor = "pointer";

        marquee.addEventListener("click", () => {
            const next = Number(marquee.dataset.marqueeClicks || "0") + 1;
            marquee.dataset.marqueeClicks = String(next);

            if (next === 2) {
                const span = marquee.querySelector("span");
                if (span) glitchText(span, span.textContent || "");
            }

            if (next >= 4) {
                triggerMarqueeChaos(marquee);
                marquee.dataset.marqueeClicks = "0";
            }
        });
    });

    document.querySelectorAll("img:not(.no-lightbox)").forEach(image => {
        if (image.id === "meme-image") return;

        image.addEventListener("click", event => {
            if (image.closest("#hiking-secret")) {
                event.preventDefault();
                event.stopPropagation();
                hikingClicks += 1;

                const caption = document.getElementById("hiking-caption");
                if (hikingClicks === 1 && caption) caption.textContent = "Dora s lepršavom kosom...";
                if (hikingClicks === 2 && caption) caption.textContent = "čekaj. ovo vodi nekamo.";

                if (hikingClicks >= 3) {
                    if (caption) caption.textContent = "oke našao si hike.";
                    window.setTimeout(() => {
                        location.href = "hikes.html";
                    }, 260);
                }
                return;
            }

            if (isChypsiImage(image) && !onChypsiPage) {
                event.preventDefault();
                event.stopPropagation();
                openChypsi(image);
                return;
            }

            if (image.classList.contains("pjer-random-destination")) {
                event.preventDefault();
                event.stopPropagation();
                openImage(image.src, image.alt || "Ičići", "pjer-random");
                return;
            }

            if (image.classList.contains("pjer-secret") && !onProjectsPage) {
                event.preventDefault();
                event.stopPropagation();
                openProjects(image);
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            openImage(image.src, image.alt || "slika");
        });
    });

    const anklePhoto = document.getElementById("ankle-photo");
    anklePhoto?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        ankleClicks += 1;
        const caption = document.getElementById("ankle-caption") || anklePhoto.querySelector("figcaption");

        if (ankleClicks === 1) {
            spawnLegs(5);
            if (caption) caption.textContent = "nešto s gravitacijom ovdje nije dobro";
        } else if (ankleClicks === 2) {
            spawnLegs(9);
            if (caption) caption.textContent = "🦵 noge su počele padati. odličan znak.";
        } else if (ankleClicks === 3) {
            spawnLegs(14);
            if (caption) caption.textContent = "zadnja šansa da prestaneš klikati";
            anklePhoto.classList.add("ankle-wobble");
        } else {
            spawnLegs(22);
            anklePhoto.classList.remove("ankle-wobble");
            anklePhoto.classList.add("ankle-fall-off");
            if (caption) caption.textContent = "gravitacija 1 : Dora 0";

            window.setTimeout(() => {
                anklePhoto.classList.remove("ankle-fall-off");
                if (caption) caption.textContent = "par trenutaka prije neočekivanog završetka hika";
                ankleClicks = 0;
            }, 3600);
        }
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
        const normalized = event.key.length === 1 ? event.key.toLowerCase() : event.key;

        if (normalized === KONAMI[konamiIndex]) {
            konamiIndex += 1;
            if (konamiIndex === KONAMI.length) {
                triggerKonami();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = normalized === KONAMI[0] ? 1 : 0;
        }

        if (event.key.length !== 1) return;

        typed += event.key.toLowerCase();
        typed = typed.slice(-18);

        if (typed.endsWith("dora") && onIndex) {
            showMeme("tajni kod DORA prihvaćen");
            typed = "";
        }

        if (typed.endsWith("dvd") && (onIndex || onYoutubePage)) {
            triggerDvd();
            typed = "";
        }
    });

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = String(new Date().getFullYear());
    });

    ensureGameShortcut();

    if ((onIndex || onYoutubePage) && Math.random() < SHINY_CHANCE) {
        document.body.classList.add("shiny-event");
        window.setTimeout(() => {
            showMemeTimed("✨ SHINY PAGE! 1/64.", null, 2100);
        }, 250);
        window.setTimeout(() => {
            document.body.classList.remove("shiny-event");
        }, 3000);
    }

    window.doraSite = {
        showMeme,
        showMemeTimed,
        closeMeme,
        openImage,
        spawnChipCan,
        spawnLegs,
        crazyImages
    };
})();
