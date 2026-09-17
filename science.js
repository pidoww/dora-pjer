(() => {
    "use strict";

    function rewritePhysicsIntro() {
        const intro = document.querySelector("main > .paper.deep-note");
        if (!intro) return;

        const heading = intro.querySelector("h2");
        const paragraphs = intro.querySelectorAll("p");

        if (heading) heading.textContent = "fun facts i rabbit hole";
        if (paragraphs[0]) {
            paragraphs[0].textContent = "Par stvari iz fizike koje su mi dovoljno zanimljive da završe na istoj stranici: zašto orbita nije lebdenje, što je parsec, zašto Čerenkovljevo zračenje ne krši relativnost, što Van Allenovi pojasevi stvarno znače astronautima, zašto Big Bang nije bomba koja je eksplodirala u praznom prostoru, što Schrödingerova mačka zapravo pokušava pokazati i kako se fizika kroz stoljeća nadograđivala od astronomskih opažanja do kvantne teorije.";
        }
        if (paragraphs[1]) {
            paragraphs[1].textContent = "Brojke i povijesne tvrdnje koje se mogu provjeriti imaju izvore. Gdje postoji stvarna znanstvena rasprava, to je i napisano.";
        }
    }

    function loadScript(src, onload) {
        const script = document.createElement("script");
        script.src = src;
        if (onload) script.addEventListener("load", onload, { once: true });
        document.head.appendChild(script);
    }

    function addScienceIsCollective() {
        if (document.getElementById("science-is-collective")) return;

        const theorySection = document.getElementById("what-theory-means");
        if (!theorySection) return;

        const section = document.createElement("section");
        section.className = "paper";
        section.id = "science-is-collective";
        section.innerHTML = `
            <h2>jedno ime uz otkriće nije cijela priča</h2>
            <p>U udžbenicima je praktično napisati jedno prezime uz zakon, jednadžbu ili otkriće, ali stvarna znanost skoro nikad ne izgleda kao priča u kojoj se jedan genij probudi i sam izmisli cijelo područje. Netko napravi ranije mjerenje, netko smisli bolji eksperiment, netko razvije matematiku koja to može opisati, a onda drugi ljudi godinama provjeravaju gdje ideja radi i gdje puca.</p>
            <p>Zato je bolje gledati znanost kao <strong>lanac nadogradnji</strong>. Čak i kad jedno ime ostane najpoznatije, iza rezultata obično stoje tuđi radovi, instrumenti, podaci, kritike i ponovljeni eksperimenti. Dobra ideja ne postaje prihvaćena zato što ju je rekao poznati znanstvenik, nego zato što je drugi ljudi mogu provjeriti i dobiti rezultate koji drže vodu.</p>
            <p>To isto znači da je normalno da se zasluge dijele, da se ista ideja pojavi kod više ljudi približno u isto vrijeme i da kasniji rad popravi raniji. To nije znak da je netko automatski "ukrao" ideju; često je samo znak da se puno ljudi bavilo istim problemom i gradilo na već postojećem znanju.</p>
            <p class="deep-source"><a href="https://www.nationalacademies.org/read/25303/chapter/5" target="_blank" rel="noopener noreferrer">National Academies – Science Is a Communal Enterprise ↗</a> · <a href="https://www.aps.org/about/governance/statements/what-is-science" target="_blank" rel="noopener noreferrer">American Physical Society – What is Science? ↗</a></p>
        `;

        theorySection.insertAdjacentElement("afterend", section);
    }

    function addTeslaExample() {
        if (document.getElementById("tesla-not-alone")) return;

        const collectiveSection = document.getElementById("science-is-collective");
        if (!collectiveSection) return;

        const section = document.createElement("section");
        section.className = "paper";
        section.id = "tesla-not-alone";
        section.innerHTML = `
            <h2>Tesla je dobar primjer za ovo</h2>
            <p>Nikola Tesla je stvarno napravio ogroman doprinos elektrotehnici. Njegov polifazni sustav izmjenične struje, rad na rotirajućem magnetskom polju i indukcijskim motorima bili su ključni za razvoj modernih AC sustava. To mu ne treba ni napuhavati ni umanjivati.</p>
            <p>Problem nastane kad se priča pretvori u <strong>„Tesla je praktički sve izmislio, a ostali su mu samo krali ideje”</strong>. Elektromagnetizam je postojao kao cijelo istraživačko područje desetljećima prije njegovih najpoznatijih patenata. Ørsted je pokazao vezu električne struje i magnetizma, Ampère ju je matematički razvijao, Faraday je otkrio elektromagnetsku indukciju, Maxwell je električna i magnetska opažanja spojio u teorijski okvir, a Hertz je eksperimentalno pokazao elektromagnetske valove.</p>
            <p>Ni razvoj AC motora nije priča s jednim jedinim čovjekom. Tesla je 1888. predstavio svoj polifazni sustav i dobio važne patente, ali je <strong>Galileo Ferraris neovisno radio na rotirajućem magnetskom polju i dvofaznim AC motorima</strong> te svoje rezultate javno predstavio iste godine. Smithsonian također navodi da su Westinghouseovi inženjeri dalje razradili Teslin koncept i uveli praktični dvofazni motor.</p>
            <p>To nije argument protiv Tesle — zapravo je zanimljivije od mita. Pokazuje kako stvarna tehnologija nastaje: fizika jednog čovjeka omogući eksperiment drugome, više ljudi neovisno dođe do sličnih ideja, netko ih patentira, netko poboljša konstrukciju, a netko ih pretvori u sustav koji se može masovno koristiti.</p>
            <div class="misconception"><strong>„Ako je još netko radio na istoj stvari, onda Tesla nije bio poseban.”</strong> Ne. Velik doprinos ne zahtijeva da prije tebe nije postojao nitko. Bitno je što si konkretno dodao, koliko je to bilo originalno i koliko je utjecalo na ono što je došlo poslije.</div>
            <p class="deep-source"><a href="https://www.si.edu/exhibitions/nikola-tesla-inventor-and-electrical-engineer-event-exhib-3311" target="_blank" rel="noopener noreferrer">Smithsonian – Nikola Tesla ↗</a> · <a href="https://americanhistory.si.edu/collections/object/nmah_739995" target="_blank" rel="noopener noreferrer">Smithsonian – Tesla / Westinghouse AC motor ↗</a> · <a href="https://spectrum.ieee.org/may-1888-tesla-files-his-patents-for-electric-motor" target="_blank" rel="noopener noreferrer">IEEE Spectrum – Tesla i Ferraris ↗</a> · <a href="https://www.aps.org/apsnews/2001/08/faraday-electromagnetism" target="_blank" rel="noopener noreferrer">APS – Faraday i elektromagnetizam ↗</a></p>
        `;

        collectiveSection.insertAdjacentElement("afterend", section);
    }

    function lockLooseScientistImageSearch() {
        document.querySelectorAll(".scientist-card[data-wiki-title]").forEach(card => {
            card.dataset.extraImageChecked = "1";
        });
    }

    const scientistPortraitCache = new Map();

    async function wikidataPortrait(title) {
        if (scientistPortraitCache.has(title)) return scientistPortraitCache.get(title);

        const request = (async () => {
            const searchUrl = new URL("https://www.wikidata.org/w/api.php");
            searchUrl.searchParams.set("origin", "*");
            searchUrl.searchParams.set("action", "wbsearchentities");
            searchUrl.searchParams.set("format", "json");
            searchUrl.searchParams.set("language", "en");
            searchUrl.searchParams.set("limit", "8");
            searchUrl.searchParams.set("search", title);

            const searchResponse = await fetch(searchUrl.toString());
            if (!searchResponse.ok) return "";
            const searchData = await searchResponse.json();
            const exact = (searchData.search || []).find(item =>
                (item.label || "").localeCompare(title, undefined, { sensitivity: "base" }) === 0
            );
            if (!exact?.id) return "";

            const entityUrl = new URL("https://www.wikidata.org/w/api.php");
            entityUrl.searchParams.set("origin", "*");
            entityUrl.searchParams.set("action", "wbgetentities");
            entityUrl.searchParams.set("format", "json");
            entityUrl.searchParams.set("props", "claims");
            entityUrl.searchParams.set("ids", exact.id);

            const entityResponse = await fetch(entityUrl.toString());
            if (!entityResponse.ok) return "";
            const entityData = await entityResponse.json();
            const filename = entityData.entities?.[exact.id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
            if (!filename) return "";

            const commonsUrl = new URL("https://commons.wikimedia.org/w/api.php");
            commonsUrl.searchParams.set("origin", "*");
            commonsUrl.searchParams.set("action", "query");
            commonsUrl.searchParams.set("format", "json");
            commonsUrl.searchParams.set("prop", "imageinfo");
            commonsUrl.searchParams.set("iiprop", "url");
            commonsUrl.searchParams.set("iiurlwidth", "420");
            commonsUrl.searchParams.set("titles", `File:${filename}`);

            const commonsResponse = await fetch(commonsUrl.toString());
            if (!commonsResponse.ok) return "";
            const commonsData = await commonsResponse.json();
            const page = Object.values(commonsData.query?.pages || {})[0];
            return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || "";
        })().catch(() => "");

        scientistPortraitCache.set(title, request);
        return request;
    }

    function repairMissingScientistImages() {
        const cards = [...document.querySelectorAll(".scientist-card[data-wiki-title]")];
        cards.forEach(card => { card.dataset.extraImageChecked = "1"; });

        setTimeout(() => {
            cards.forEach(async card => {
                const slot = card.querySelector(".scientist-photo");
                if (!slot || slot.querySelector("img")) return;

                const title = (card.dataset.wikiTitle || "").trim();
                if (!title) {
                    slot.hidden = true;
                    return;
                }

                const imageUrl = await wikidataPortrait(title);
                if (!imageUrl) {
                    slot.hidden = true;
                    return;
                }

                const img = document.createElement("img");
                img.alt = title;
                img.loading = "lazy";
                img.referrerPolicy = "no-referrer";
                img.addEventListener("load", () => {
                    slot.hidden = false;
                    slot.replaceChildren(img);
                }, { once: true });
                img.addEventListener("error", () => {
                    slot.hidden = true;
                }, { once: true });
                img.src = imageUrl;
            });
        }, 1400);
    }

    function addChernobylDoseDetails() {
        const section = document.getElementById("radiation-risk-scale");
        if (!section || document.getElementById("chernobyl-dose-detail")) return;

        const heading = [...section.querySelectorAll("h3")].find(node => node.textContent.includes("Černobil"));
        if (!heading) return;

        const block = document.createElement("div");
        block.id = "chernobyl-dose-detail";
        block.innerHTML = `
            <h4>što znači raspon 0,8–16 Gy kod 134 potvrđena slučaja ARS-a</h4>
            <div class="physics-table-wrap">
                <table class="physics-table">
                    <thead>
                        <tr><th>procijenjena apsorbirana doza</th><th>broj ljudi</th><th>rane smrti</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><strong>0,8–2,1 Gy</strong></td><td>41</td><td>0</td></tr>
                        <tr><td><strong>2,2–4,1 Gy</strong></td><td>50</td><td>1</td></tr>
                        <tr><td><strong>4,2–6,4 Gy</strong></td><td>22</td><td>7</td></tr>
                        <tr><td><strong>6,5–16 Gy</strong></td><td>21</td><td>20</td></tr>
                        <tr><td><strong>ukupno</strong></td><td><strong>134</strong></td><td><strong>28</strong></td></tr>
                    </tbody>
                </table>
            </div>
            <p>Ovo je dobar stvarni primjer koliko se posljedice mijenjaju s akutnom cijelotjelesnom dozom: u najnižoj skupini nije bilo ranih smrti, dok je u skupini 6,5–16 Gy umrlo 20 od 21 osobe. To nisu univerzalne "postotne šanse" za svakog čovjeka nego povijesni podaci baš za ovu skupinu pacijenata, s tadašnjim liječenjem i svim okolnostima nesreće.</p>
            <p>UNSCEAR dodatno navodi da kod još 103 liječena radnika akutni radijacijski sindrom nije bio potvrđen. Zato ni broj ljudi koji su bili pregledani ili hospitalizirani nije isto što i broj potvrđenih slučajeva ARS-a.</p>
            <p><strong>28 smrti u prva tri mjeseca</strong> odnosi se na ovu skupinu s potvrđenim ARS-om. Uz njih su dvije osobe umrle neposredno nakon nesreće od mehaničkih/termalnih ozljeda; njih nije ispravno pribrojiti kao još dvije smrti od akutnog zračenja.</p>

            <h4>ostale skupine bile su na potpuno drugoj skali</h4>
            <ul class="bad-list">
                <li><strong>oko 530.000 registriranih radnika na sanaciji:</strong> prosječna efektivna doza oko 120 mSv.</li>
                <li><strong>oko 115.000 evakuiranih:</strong> prosječno oko 30 mSv.</li>
                <li><strong>stanovnici kontaminiranih područja:</strong> prosječno oko 9 mSv kroz prva dva desetljeća.</li>
                <li><strong>ostale europske zemlje:</strong> prosječne nacionalne doze bile su manje od 1 mSv u prvoj godini nakon nesreće.</li>
            </ul>
            <p>UNSCEAR navodi i da je većina registriranih recovery workers između 1986. i 1990. primila približno <strong>0,02–0,5 Gy</strong>. To pokazuje zašto rečenica "ljudi u Černobilu dobili su X" nema smisla bez navođenja <em>koja skupina, koje vrijeme i koja vrsta doze</em>.</p>
            <p>Posebna priča su doze štitnjače od radioaktivnog joda, osobito kod djece. One se ne mogu jednostavno zamijeniti s cijelotjelesnom efektivnom dozom jer je riječ o lokalnoj dozi određenom organu i drugom putu izlaganja.</p>
            <p class="deep-source"><a href="https://www.unscear.org/unscear/en/areas-of-work/chernobyl.html" target="_blank" rel="noopener noreferrer">UNSCEAR – Chornobyl accident ↗</a> · <a href="https://www.unscear.org/unscear/uploads/documents/publications/UNSCEAR_2008_Annex-D-CORR.pdf" target="_blank" rel="noopener noreferrer">UNSCEAR 2008, Annex D ↗</a> · <a href="https://www.who.int/news-room/questions-and-answers/item/radiation-the-chernobyl-accident" target="_blank" rel="noopener noreferrer">WHO – Chernobyl doses ↗</a></p>
        `;

        const paragraphs = [];
        let node = heading.nextElementSibling;
        while (node && node.tagName === "P" && paragraphs.length < 2) {
            paragraphs.push(node);
            node = node.nextElementSibling;
        }
        const anchor = paragraphs[paragraphs.length - 1] || heading;
        anchor.insertAdjacentElement("afterend", block);
    }

    rewritePhysicsIntro();

    loadScript("/science-core.js", () => {
        loadScript("/physics-extra.js", () => {
            lockLooseScientistImageSearch();
            addScienceIsCollective();
            addTeslaExample();
            addChernobylDoseDetails();
            loadScript("/anthro-extra.js", () => {
                lockLooseScientistImageSearch();
                repairMissingScientistImages();
            });
        });
    });
})();