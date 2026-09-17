(() => {
    "use strict";

    function insertTheorySection() {
        if (document.getElementById("what-theory-means")) return;

        const main = document.querySelector("main");
        if (!main) return;

        const section = document.createElement("section");
        section.className = "paper";
        section.id = "what-theory-means";
        section.innerHTML = `
            <h2>najbitniji detalj prije svega: „teorija” u fizici ne znači pogađanje</h2>
            <p>U svakodnevnom govoru „imam teoriju” često znači „imam ideju”. U znanosti riječ ima puno jače značenje. <strong>Znanstvena teorija je široko objašnjenje prirodnih pojava koje povezuje velik broj opažanja, mjerenja, zakona i testiranih hipoteza te iz toga daje provjerljiva predviđanja.</strong></p>
            <p>Zato izraz poput <em>teorija relativnosti</em>, <em>kvantna teorija</em> ili <em>teorija evolucije</em> ne znači „možda je tako”. Teorija nije ni stepenica koja jednog dana, kad skupi dovoljno bodova, postane zakon. <strong>Zakon uglavnom opisuje obrazac ili odnos; teorija objašnjava širi skup pojava i zašto se one ponašaju kako se ponašaju.</strong></p>
            <div class="physics-deep-grid">
                <article class="physics-deep-card"><h3>činjenica</h3><p>Opažanje ili rezultat koji je opetovano potvrđen. Primjer: svjetlost se u vakuumu mjeri s istom invariantnom brzinom za inercijske promatrače.</p></article>
                <article class="physics-deep-card"><h3>hipoteza</h3><p>Konkretna testabilna ideja ili objašnjenje. Može pasti na testu, biti izmijenjena ili postati dio šire teorije.</p></article>
                <article class="physics-deep-card"><h3>zakon</h3><p>Sažet opis pravilnosti, često matematički. Newtonov zakon gravitacije, primjerice, vrlo dobro opisuje silu u svojem području primjene.</p></article>
                <article class="physics-deep-card"><h3>teorija</h3><p>Koherentan okvir koji povezuje mnogo činjenica, zakona i mjerenja te mora preživljavati nove testove i moći pogriješiti na način koji bi podaci mogli otkriti.</p></article>
            </div>
            <p>Ni vrlo uspješna teorija nije sveta. Ako bolji podaci pokažu problem, fizika je mijenja ili ograniči područje u kojem vrijedi. Newtonova mehanika nije „bačena u smeće” nakon Einsteina: i dalje je izvanredno dobra aproksimacija pri brzinama mnogo manjima od brzine svjetlosti i u slabim gravitacijskim poljima.</p>
            <p class="deep-source"><a href="https://www.aps.org/about/governance/statements/what-is-science" target="_blank" rel="noopener noreferrer">American Physical Society – What is Science? ↗</a> · <a href="https://www.nationalacademies.org/read/18290/chapter/14" target="_blank" rel="noopener noreferrer">National Academies – theory, law i hypothesis ↗</a></p>
        `;

        const nav = document.getElementById("physics-quick-nav");
        const intro = main.querySelector(".deep-note");
        if (nav?.nextSibling) main.insertBefore(section, nav.nextSibling);
        else if (intro?.nextSibling) main.insertBefore(section, intro.nextSibling);
        else main.prepend(section);
    }

    function insertRadiationRiskSection() {
        if (document.getElementById("radiation-risk-scale")) return;

        const doseHeading = [...document.querySelectorAll("h2")].find(node => node.textContent.includes("Bq, Gy, rad, Sv i rem"));
        const doseSection = doseHeading?.closest("section");
        if (!doseSection) return;

        const section = document.createElement("section");
        section.className = "paper";
        section.id = "radiation-risk-scale";
        section.innerHTML = `
            <h2>koliko je doza zapravo opasna — i zašto vrijeme potpuno mijenja priču</h2>
            <p>Broj u sievertima bez konteksta nije dovoljan. Bitni su <strong>ukupna doza, koliko brzo je primljena, vrsta zračenja i koliko je tijela ozračeno</strong>. Za procjenu dugoročnog biološkog rizika često se koristi <strong>Sv / mSv</strong>, dok se kod akutnih ozljeda tkiva i akutnog radijacijskog sindroma uglavnom govori o apsorbiranoj dozi u <strong>Gy</strong>. Kod jednoliko raspoređene vanjske gama ili X-doze vrijednosti u Gy i Sv mogu biti sličnog reda, ali to nije univerzalna konverzija za neutrone, alfa-zračenje, lokalnu dozu ili unutarnju kontaminaciju.</p>

            <div class="physics-table-wrap">
                <table class="physics-table">
                    <thead><tr><th>doza / vrijeme</th><th>što okvirno znači</th></tr></thead>
                    <tbody>
                        <tr><td><strong>~2,4 mSv kroz godinu</strong></td><td>WHO navodi otprilike toliku prosječnu godišnju dozu iz prirodnih izvora u svijetu. Ne izaziva akutni radijacijski sindrom; prirodna pozadina dosta varira ovisno o mjestu.</td></tr>
                        <tr><td><strong>~10 mSv odjednom</strong></td><td>daleko ispod doza koje tipično izazivaju akutne simptome. Takav broj sam po sebi ne govori što će se dogoditi pojedincu; kod nižih doza govori se prvenstveno o malom statističkom dugoročnom riziku.</td></tr>
                        <tr><td><strong>~100 mSv</strong></td><td>WHO navodi da epidemiološka istraživanja iznad otprilike ove razine pokazuju jasniji porast rizika raka. To je još uvijek daleko ispod tipičnog praga za akutni radijacijski sindrom.</td></tr>
                        <tr><td><strong>~0,3 Gy po cijelom tijelu, brzo</strong></td><td>CDC navodi da se blagi simptomi akutnog radijacijskog sindroma mogu pojaviti već oko ove razine.</td></tr>
                        <tr><td><strong>&gt;0,7 Gy po cijelom tijelu, brzo</strong></td><td>CDC navodi ovu razinu kao približan početak područja u kojem se može razviti puni hematopoetski odnosno bone-marrow sindrom.</td></tr>
                        <tr><td><strong>~1 Gy / približno 1 Sv za vanjsku gama/X cijelotjelesnu dozu, brzo</strong></td><td>WHO približno 1 Sv navodi kao prag na kojem se može pojaviti akutni radijacijski sindrom. Ovo vrijedi za veliku, prodornu dozu primljenu u kratkom vremenu, ne za bilo kakav zbroj od 1 Sv.</td></tr>
                        <tr><td><strong>~2,5–5 Gy po cijelom tijelu, brzo</strong></td><td>CDC navodi približan <em>LD50/60</em> raspon: dozu pri kojoj bi oko polovice izložene skupine moglo umrijeti unutar 60 dana. Ishod jako ovisi o liječenju, dobi, ozljedama i stvarnoj raspodjeli doze.</td></tr>
                        <tr><td><strong>&gt;10 Gy po cijelom tijelu, brzo</strong></td><td>tipično područje gastrointestinalnog sindroma. CDC navodi da je preživljenje tada iznimno malo čak i uz liječenje.</td></tr>
                        <tr><td><strong>&gt;50 Gy po cijelom tijelu, brzo</strong></td><td>kardiovaskularni / središnji živčani sindrom; CDC ne očekuje oporavak pri takvim cijelotjelesnim dozama.</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="misconception"><strong>Najveća zamka je uspoređivati samo konačni broj.</strong> Velika doza primljena kroz nekoliko minuta može izazvati akutnu bolest jer mnogo stanica bude oštećeno gotovo istodobno. Ako je doza raspoređena kroz dugo vrijeme, akutni učinak može biti mnogo manji jer tkivo ima vremena za popravak i zamjenu stanica. To ipak ne znači da kronična izloženost nema rizik: ukupna doza i dalje ulazi u procjenu dugoročnog rizika raka.</div>

            <h3>Černobil: ekstremno izloženi vatrogasci nisu isto što i stanovništvo Europe</h3>
            <p>WHO i UNSCEAR navode da je od oko 600 radnika prisutnih na lokaciji u rano jutro 26. travnja 1986. njih <strong>134 dobilo približno 0,8–16 Gy</strong> i razvilo akutni radijacijski sindrom. <strong>28 ih je umrlo u prva tri mjeseca.</strong> To su bile ogromne akutne cijelotjelesne doze, potpuno druga kategorija od doza koje je primila većina stanovništva.</p>
            <p>Za usporedbu, WHO navodi prosječnu efektivnu dozu od oko <strong>120 mSv</strong> među približno 530.000 registriranih radnika na sanaciji, oko <strong>30 mSv</strong> među 115.000 evakuiranih te oko <strong>9 mSv</strong> kroz prva dva desetljeća za stanovnike kontaminiranih područja. To ne znači da je rizik nula, nego da izraz „doza u Černobilu” bez navođenja skupine može značiti razliku od nekoliko redova veličine.</p>

            <h3>NE Krško: tri broja koja se lako zamijene</h3>
            <p><strong>Profesionalno izloženi radnici:</strong> NEK navodi regulatorno ograničenje od <strong>20 mSv godišnje</strong>. Na svojoj stranici navodi da je prosječna godišnja doza zaposlenika u radiološki kontroliranom području oko <strong>0,42 mSv</strong>, dok su najviše pojedinačne doze tijekom remonta oko <strong>6,68 mSv</strong>.</p>
            <p><strong>Stanovništvo oko elektrane:</strong> to nije isti limit kao za radnika. NEK-ova mjesečna izvješća navode da je cjelogodišnji radiološki utjecaj ispuštanja elektrane na pojedinca iz kritične skupine stanovništva ograničen na <strong>50 µSv godišnje = 0,05 mSv godišnje</strong>. U izvješću za kolovoz 2026. procijenjeni kumulativni utjecaj bio je samo mali dio tog dopuštenog iznosa.</p>
            <p><strong>Opći javni limit:</strong> međunarodne preporuke za planiranu dodatnu izloženost javnosti koriste <strong>1 mSv godišnje</strong>. Ograničenje od 50 µSv za utjecaj samog NEK-a zato je još uži source-specific limit i ne treba ga miješati s ukupnim javnim limitom.</p>

            <div class="misconception"><strong>Još jedna bitna stvar:</strong> „radioaktivnost ispusta” u Bq/TBq nije isto što i doza čovjeku u Sv. Bq govori koliko se raspada događa u sekundi; doza ovisi o radionuklidu, putu izlaganja, energiji, vremenu, udaljenosti i tome koliko materijala stvarno dospije do osobe.</div>

            <p class="deep-source"><a href="https://www.cdc.gov/radiation-emergencies/hcp/clinical-guidance/ars.html" target="_blank" rel="noopener noreferrer">CDC – Acute Radiation Syndrome ↗</a> · <a href="https://www.cdc.gov/radiation-emergencies/causes/radiation-thermometer.html" target="_blank" rel="noopener noreferrer">CDC – Radiation Thermometer ↗</a> · <a href="https://www.who.int/news-room/fact-sheets/detail/ionizing-radiation-and-health-effects" target="_blank" rel="noopener noreferrer">WHO – ionizing radiation and health effects ↗</a> · <a href="https://www.who.int/news-room/questions-and-answers/item/radiation-the-chernobyl-accident" target="_blank" rel="noopener noreferrer">WHO – Chernobyl doses ↗</a> · <a href="https://www.unscear.org/unscear/en/areas-of-work/chernobyl.html" target="_blank" rel="noopener noreferrer">UNSCEAR – Chernobyl ↗</a> · <a href="https://www.nek.si/hr/pogon/podrska-pogonu" target="_blank" rel="noopener noreferrer">NE Krško – radiološke doze ↗</a> · <a href="https://www.nek.si/hr/vijesti/izvjesca/izvjesce-o-radu-nek-a-za-kolovoz-2026-" target="_blank" rel="noopener noreferrer">NEK – kolovoz 2026. ↗</a></p>
        `;

        doseSection.insertAdjacentElement("afterend", section);
    }

    async function commonsImage(title) {
        const url = new URL("https://commons.wikimedia.org/w/api.php");
        url.searchParams.set("origin", "*");
        url.searchParams.set("action", "query");
        url.searchParams.set("format", "json");
        url.searchParams.set("generator", "search");
        url.searchParams.set("gsrsearch", title);
        url.searchParams.set("gsrnamespace", "6");
        url.searchParams.set("gsrlimit", "5");
        url.searchParams.set("prop", "imageinfo");
        url.searchParams.set("iiprop", "url");
        url.searchParams.set("iiurlwidth", "420");

        const response = await fetch(url.toString());
        if (!response.ok) return "";
        const data = await response.json();
        const pages = Object.values(data?.query?.pages || {});
        const page = pages.find(item => item?.imageinfo?.[0]?.thumburl || item?.imageinfo?.[0]?.url);
        return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || "";
    }

    function improveScientistImages() {
        const cards = [...document.querySelectorAll(".scientist-card[data-wiki-title]")];

        async function repair(card) {
            if (card.dataset.extraImageChecked === "1") return;
            card.dataset.extraImageChecked = "1";

            await new Promise(resolve => setTimeout(resolve, 1100));
            const slot = card.querySelector(".scientist-photo");
            if (!slot || slot.querySelector("img")) return;

            const title = card.dataset.wikiTitle || "";
            if (!title) {
                slot.hidden = true;
                return;
            }

            try {
                const imageUrl = await commonsImage(title);
                if (!imageUrl) {
                    slot.hidden = true;
                    return;
                }

                const img = document.createElement("img");
                img.src = imageUrl;
                img.alt = title;
                img.loading = "lazy";
                img.referrerPolicy = "no-referrer";
                img.addEventListener("error", () => { slot.hidden = true; }, { once: true });
                slot.replaceChildren(img);
            } catch {
                slot.hidden = true;
            }
        }

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);
                    repair(entry.target);
                });
            }, { rootMargin: "600px 0px" });
            cards.forEach(card => observer.observe(card));
        } else {
            cards.forEach(repair);
        }
    }

    insertTheorySection();
    insertRadiationRiskSection();
    improveScientistImages();
})();