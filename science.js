(() => {
    "use strict";

    function insertOzoneSection() {
        if (document.getElementById("ozone-physics")) return;

        const main = document.querySelector("main");
        if (!main) return;

        const section = document.createElement("section");
        section.className = "paper";
        section.id = "ozone-physics";
        section.innerHTML = `
            <h2>ozon, korona i zašto HV modul uopće može stvarati O₃</h2>
            <p>Ozon je alotrop kisika: molekula O₃. U električnom izboju elektroni mogu dobiti dovoljno energije da sudarima disociraju O₂. Pojednostavljena reakcija kojom se to često prikazuje je:</p>
            <div class="physics-equation">e⁻ + O₂ → e⁻ + O + O</div>
            <p>Slobodni atom kisika zatim može reagirati s O₂. Treće tijelo M — u zraku često N₂ ili O₂ — odnosi dio energije i stabilizira produkt:</p>
            <div class="physics-equation">O + O₂ + M → O₃ + M</div>
            <p>To nije cijela plazma-kemijska mreža. U stvarnom izboju postoje pobuđena stanja, ioni, radikali i konkurentne reakcije koje O₃ i stvaraju i uništavaju. Zato količina ozona ne ovisi samo o „naponu”, nego o geometriji električnog polja, struji, temperaturi, sastavu i vlažnosti plina, načinu izboja i vremenu zadržavanja plina.</p>

            <h3>korona nije isto što i veliki luk</h3>
            <p>Korona je djelomični električni izboj koji nastaje ondje gdje je lokalno električno polje dovoljno jako za ionizaciju, ali cijeli razmak još nije postao vodljivi kanal. Oštri vrhovi i tanke žice pojačavaju lokalno polje zbog male zakrivljenosti površine. Veliki električni luk, nasuprot tome, stvara vrući, jako vodljiv kanal i znatno više grije plin. Spektakularnija iskra zato ne znači automatski učinkovitiju proizvodnju ozona.</p>

            <div class="scientist-grid">
                <article class="scientist-card" data-wiki-title="Martinus van Marum">
                    <div class="scientist-photo">MVM</div>
                    <div class="scientist-info"><h3>Martinus van Marum</h3><p>1785. primijetio je neobičan miris i kemijske učinke nakon električnog iskrenja. Nije još identificirao novu tvar, ali to su među najranijim zabilježenim opažanjima fenomena koji danas povezujemo s ozonom.</p><a class="scientist-wiki-link" href="#" target="_blank" rel="noopener noreferrer">Wikipedia ↗</a></div>
                </article>

                <article class="scientist-card" data-wiki-title="Christian Friedrich Schönbein">
                    <div class="scientist-photo">CFS</div>
                    <div class="scientist-info"><h3>Christian Friedrich Schönbein</h3><p>1840. prepoznao je da isti karakteristični miris nastaje u različitim električnim i kemijskim procesima te je tvar nazvao ozone, prema grčkom glagolu za „mirisati”. NASA-ina povijest istraživanja ozona upravo 1840. navodi kao ključni trenutak identifikacije.</p><a class="scientist-wiki-link" href="#" target="_blank" rel="noopener noreferrer">Wikipedia ↗</a></div>
                </article>

                <article class="scientist-card" data-wiki-title="Jacques-Louis Soret">
                    <div class="scientist-photo">JLS</div>
                    <div class="scientist-info"><h3>Jacques-Louis Soret</h3><p>U 1860-ima pokazao je da molekularna formula ozona odgovara O₃. To je važno jer „ozon” nije samo električno modificiran obični O₂ nego zasebna molekularna vrsta s tri atoma kisika.</p><a class="scientist-wiki-link" href="#" target="_blank" rel="noopener noreferrer">Wikipedia ↗</a></div>
                </article>

                <article class="scientist-card" data-wiki-title="Werner von Siemens">
                    <div class="scientist-photo">WS</div>
                    <div class="scientist-info"><h3>Werner von Siemens</h3><p>EPA-ina povijesna literatura o ozonaciji navodi Siemensov uređaj iz 1857. kao izvorište konstrukcije električnih discharge ozonizatora: plin prolazi kroz električno polje između elektroda odvojenih dielektrikom, koncept koji je kasnije razvijen u industrijske ozonatore.</p><a class="scientist-wiki-link" href="#" target="_blank" rel="noopener noreferrer">Wikipedia ↗</a></div>
                </article>
            </div>

            <div class="misconception"><strong>Česta zabuna:</strong> miris nakon iskrenja nije dokaz da uređaj proizvodi „čisti ozon”. Električni izboji u zraku mogu stvarati više reaktivnih vrsta, uključujući i dušikove okside, ovisno o uvjetima.</div>
            <div class="misconception"><strong>Sigurnost:</strong> ozon je reaktivan respiratorni iritans. EPA navodi da pri koncentracijama koje ne prelaze javnozdravstvene granice ozon općenito nije učinkovit univerzalni čistač zraka, dok veće koncentracije mogu oštetiti pluća.</div>
            <p class="deep-source"><a href="https://ntrs.nasa.gov/citations/19990115807" target="_blank" rel="noopener noreferrer">NASA NTRS – History of Ozone Research: From Schonbein to the Present ↗</a> · <a href="https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=20006FGE.TXT" target="_blank" rel="noopener noreferrer">EPA – history of electric-discharge ozone generators ↗</a> · <a href="https://www.epa.gov/indoor-air-quality-iaq/ozone-generators-are-sold-air-cleaners" target="_blank" rel="noopener noreferrer">EPA – ozone health / air-cleaner claims ↗</a></p>
        `;

        const finalSection = [...main.querySelectorAll("section")].find(node => node.classList.contains("center"));
        if (finalSection) {
            main.insertBefore(section, finalSection);
        } else {
            main.appendChild(section);
        }
    }

    insertOzoneSection();

    const cache = new Map();

    async function fetchSummary(title) {
        if (cache.has(title)) return cache.get(title);

        const promise = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`, {
            headers: { "Accept": "application/json" }
        }).then(async response => {
            if (!response.ok) throw new Error(`Wikipedia ${response.status}`);
            return response.json();
        });

        cache.set(title, promise);
        return promise;
    }

    async function hydrate(card) {
        if (card.dataset.loaded === "1") return;
        card.dataset.loaded = "1";

        const title = card.dataset.wikiTitle || "";
        const photoSlot = card.querySelector(".scientist-photo");
        const link = card.querySelector(".scientist-wiki-link");
        if (!title || !photoSlot) return;

        try {
            const data = await fetchSummary(title);
            const imageUrl = data.thumbnail?.source || data.originalimage?.source || "";

            if (imageUrl) {
                const img = document.createElement("img");
                img.src = imageUrl;
                img.alt = title;
                img.loading = "lazy";
                img.referrerPolicy = "no-referrer";
                photoSlot.replaceChildren(img);
            } else {
                photoSlot.textContent = title.split(" ").map(part => part[0] || "").join("").slice(0, 3);
            }

            if (link) {
                link.href = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
            }
        } catch {
            photoSlot.textContent = title.split(" ").map(part => part[0] || "").join("").slice(0, 3);
            if (link) {
                link.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
            }
        }
    }

    const cards = [...document.querySelectorAll("[data-wiki-title]")];

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                hydrate(entry.target);
            });
        }, { rootMargin: "500px 0px" });

        cards.forEach(card => observer.observe(card));
    } else {
        cards.forEach(hydrate);
    }

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = String(new Date().getFullYear());
    });
})();
