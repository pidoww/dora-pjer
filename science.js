(() => {
    "use strict";

    function loadScript(src, onload) {
        const script = document.createElement("script");
        script.src = src;
        if (onload) script.addEventListener("load", onload, { once: true });
        document.head.appendChild(script);
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

    loadScript("/science-core.js", () => {
        loadScript("/physics-extra.js", () => {
            addChernobylDoseDetails();
            loadScript("/anthro-extra.js");
        });
    });
})();
