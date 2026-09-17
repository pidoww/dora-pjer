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

    function applyVerifiedCorrections() {
        document.querySelectorAll(".physics-table tbody tr").forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 2) return;

            if (cells[0].textContent.trim() === "Apollo 17" && cells[1].textContent.includes("0.51")) {
                cells[1].textContent = "≈0.55 rad";
            }
        });
    }

    function deepenRadiationSection() {
        if (document.getElementById("radiation-verified-deep")) return;

        const headings = [...document.querySelectorAll("h2")];
        const apolloHeading = headings.find(heading => heading.textContent.toLowerCase().includes("koliko su apollo posade stvarno dobile"));
        const section = apolloHeading?.closest("section");
        if (!section) return;

        const block = document.createElement("div");
        block.id = "radiation-verified-deep";
        block.innerHTML = `
            <h3>kako pravilno čitati te Apollo brojke</h3>
            <p>NASA-ini Apollo izvještaji uglavnom koriste <strong>rad</strong>, staru jedinicu apsorbirane doze. To je energija koju zračenje ostavi u materijalu: <strong>1 rad = 0.01 Gy</strong>. To nije automatski isto što i biološki ponderirana doza u sievertima. Za Sv/rem treba znati vrstu i energiju zračenja, organ/tkivo i koji se radiološki weighting model koristi.</p>

            <div class="misconception"><strong>Zato nije korektno napraviti slijepu konverziju „0.18 rad = 1.8 mSv” i završiti priču.</strong> Numerička konverzija apsorbirane doze iz rad u Gy jest jednostavna, ali prijelaz na Sv zahtijeva radiobiološki kontekst. Povijesni Apollo izvještaji također razlikuju skin dose, depth dose i procjene za blood-forming organs.</div>

            <h3>Apollo 11: tri osobna dozimetra i poseban Van Allen dosimeter</h3>
            <p>Apollo 11 Mission Report navodi neispravljene integrirane osobne vrijednosti od <strong>0.25, 0.26 i 0.28 rad</strong> za tri člana posade. Nakon korekcija i procjene NASA je zaključila da je ukupna doza svakog člana posade bila <strong>manja od 0.2 rad</strong>. Poseban Van Allen belt dosimeter kroz cijelu misiju registrirao je oko <strong>0.11 rad skin dose</strong> i <strong>0.08 rad depth dose</strong>.</p>

            <h3>Apollo 13 pokazuje razliku između dose rate i total dose</h3>
            <p>Pri izlaznom prolazu kroz pojas Apollo 13 je registrirao maksimalnu brzinu doze od približno <strong>2.27 rad/h na koži</strong> i <strong>1.35 rad/h na dubinskom kanalu</strong>. To ne znači da je posada sat vremena primala tu maksimalnu vrijednost. Završna osobna očitanja bila su oko <strong>0.29, 0.34 i 0.41 rad</strong>.</p>

            <pre class="project-diagram">dose rate = koliko brzo doza raste
            npr. rad/h

ukupna doza = integral dose-rate kroz vrijeme
            ∫ Ḋ(t) dt</pre>

            <p>To je ključ cijele Van Allen rasprave: putanja Apollo letjelice nije satima stajala u najintenzivnijoj zoni. Letjelica je prolazila kroz promjenjivo polje čestica određenom putanjom i brzinom, uz zaštitu konstrukcije, pa se konačna doza dobiva integracijom stvarne izloženosti.</p>

            <h3>zašto se različite brojke za kolovoz 1972. ne moraju međusobno pobijati</h3>
            <p>Za veliki solarni particle event iz kolovoza 1972. postoje različite NASA procjene jer ne opisuju uvijek isti scenarij. Jedan povijesni Apollo biomedical prikaz procjenjuje da bi unutar Command Modulea taj događaj mogao dati oko <strong>360 rad koži</strong> i <strong>35 rad blood-forming organs</strong>. Druge analize modeliraju čovjeka iza različitih debljina aluminija, spacesuit, storm shelter ili nezaštićenu površinu i zato daju druge vrijednosti.</p>
            <p>To nije kontradikcija dok god se uspoređuje isti organ, ista shielding geometrija, isti radiation field i ista dozimetrijska veličina. „Koliko bi astronaut dobio u eventu iz 1972.?” nema jednu univerzalnu brojku bez opisa gdje se astronaut nalazi i koliko je zaštićen.</p>

            <div class="misconception"><strong>Mit: „Van Allenovi pojasevi su smrtonosna ljuska koju čovjek ne može prijeći.”</strong><br>Stvarni problem je dozimetrijski: tok čestica nije svugdje jednak, putanja može izbjegavati najintenzivnije dijelove, letjelica ne ostaje tamo neograničeno dugo, a struktura letjelice pruža određenu zaštitu. Apollo podaci pokazuju mjerljive, ali daleko manje od akutno smrtonosnih ukupne doze tijekom stvarnih misija.</div>

            <div class="misconception"><strong>Mit: „Space radiation je samo Van Allen belt.”</strong><br>Izvan zaštite Zemljine magnetosfere važna su najmanje dva dodatna izvora: <strong>galactic cosmic rays (GCR)</strong>, stalnija visokoenergetska pozadina, i <strong>solar energetic particles (SEP)</strong>, rjeđi ali potencijalno vrlo intenzivni događaji. Za dugotrajne Moon/Mars misije upravo ta kombinacija postaje velik inženjerski i biomedicinski problem.</div>

            <p class="deep-source"><a href="https://www.nasa.gov/wp-content/uploads/static/apollo50th/pdf/A11_MissionReport.pdf" target="_blank" rel="noopener noreferrer">NASA – Apollo 11 Mission Report, radiation section ↗</a> · <a href="https://ntrs.nasa.gov/api/citations/19710003598/downloads/19710003598.pdf" target="_blank" rel="noopener noreferrer">NASA – Apollo 13 Mission Report ↗</a> · <a href="https://www.nasa.gov/wp-content/uploads/static/history/alsj/tnD7080RadProtect.pdf" target="_blank" rel="noopener noreferrer">NASA – Radiation Protection and Instrumentation ↗</a> · <a href="https://ntrs.nasa.gov/api/citations/19760005580/downloads/19760005580.pdf" target="_blank" rel="noopener noreferrer">NASA – Biomedical Results of Apollo ↗</a></p>
        `;

        section.appendChild(block);
    }

    insertOzoneSection();
    applyVerifiedCorrections();
    deepenRadiationSection();

    const summaryCache = new Map();
    const imageCache = new Map();

    async function fetchSummary(title) {
        if (summaryCache.has(title)) return summaryCache.get(title);

        const promise = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`, {
            headers: { "Accept": "application/json" }
        }).then(async response => {
            if (!response.ok) throw new Error(`Wikipedia summary ${response.status}`);
            return response.json();
        });

        summaryCache.set(title, promise);
        return promise;
    }

    async function fetchPageImage(title) {
        if (imageCache.has(title)) return imageCache.get(title);

        const url = new URL("https://en.wikipedia.org/w/api.php");
        url.searchParams.set("origin", "*");
        url.searchParams.set("action", "query");
        url.searchParams.set("format", "json");
        url.searchParams.set("prop", "pageimages");
        url.searchParams.set("piprop", "thumbnail|original");
        url.searchParams.set("pithumbsize", "420");
        url.searchParams.set("redirects", "1");
        url.searchParams.set("titles", title);

        const promise = fetch(url.toString()).then(async response => {
            if (!response.ok) throw new Error(`Wikipedia pageimages ${response.status}`);
            const data = await response.json();
            const pages = Object.values(data?.query?.pages || {});
            const page = pages[0] || {};
            return page.thumbnail?.source || page.original?.source || "";
        });

        imageCache.set(title, promise);
        return promise;
    }

    function initials(title) {
        return title.split(" ").map(part => part[0] || "").join("").slice(0, 3);
    }

    function putImage(photoSlot, imageUrl, title) {
        if (!imageUrl) {
            photoSlot.textContent = initials(title);
            return;
        }

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = title;
        img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        img.addEventListener("error", () => {
            photoSlot.textContent = initials(title);
        }, { once: true });
        photoSlot.replaceChildren(img);
    }

    async function hydrate(card) {
        if (card.dataset.loaded === "1") return;
        card.dataset.loaded = "1";

        const title = card.dataset.wikiTitle || "";
        const photoSlot = card.querySelector(".scientist-photo");
        const link = card.querySelector(".scientist-wiki-link");
        if (!title || !photoSlot) return;

        const fallbackUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

        try {
            const data = await fetchSummary(title);
            let imageUrl = data.thumbnail?.source || data.originalimage?.source || "";

            if (!imageUrl) {
                try {
                    imageUrl = await fetchPageImage(title);
                } catch {}
            }

            putImage(photoSlot, imageUrl, title);

            if (link) {
                link.href = data.content_urls?.desktop?.page || fallbackUrl;
            }
        } catch {
            try {
                const imageUrl = await fetchPageImage(title);
                putImage(photoSlot, imageUrl, title);
            } catch {
                photoSlot.textContent = initials(title);
            }

            if (link) link.href = fallbackUrl;
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
