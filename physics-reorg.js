(() => {
    "use strict";

    function findSectionByHeading(text) {
        const heading = [...document.querySelectorAll("section.paper > h2")].find(node =>
            node.textContent.toLowerCase().includes(text.toLowerCase())
        );
        return heading?.closest("section") || null;
    }

    function removeOldMiscSection() {
        const title = [...document.querySelectorAll(".deep-section-title")].find(node =>
            node.textContent.includes("JOŠ PAR STVARI KOJE SU NAM SE VRAĆALE")
        );
        if (!title) return;

        const oldSection = title.nextElementSibling;
        if (oldSection?.matches("section.paper")) oldSection.remove();
        title.remove();
    }

    function addOrbitSections() {
        if (document.getElementById("iss-freefall")) return;

        const electromagnetismTitle = [...document.querySelectorAll(".deep-section-title")].find(node =>
            node.textContent.includes("2. ELEKTROMAGNETIZAM")
        );
        if (!electromagnetismTitle) return;

        const iss = document.createElement("section");
        iss.className = "paper";
        iss.id = "iss-freefall";
        iss.innerHTML = `
            <h2>ISS ne lebdi — stalno pada oko Zemlje</h2>
            <p>International Space Station leti oko Zemlje brzinom od približno <strong>28.000 km/h</strong> i napravi jednu orbitu za otprilike <strong>90 minuta</strong>. Astronauti unutra nisu bestežinski zato što je tamo gravitacija nestala. Na visini ISS-a Zemljina gravitacija je i dalje jaka.</p>
            <p>Poanta orbite je da postaja ima toliku bočnu brzinu da, dok gravitacija stalno zakrivljuje njezinu putanju prema Zemlji, sama Zemljina površina zakrivljuje se od nje. ISS zato cijelo vrijeme <strong>slobodno pada</strong>, samo stalno promašuje tlo.</p>
            <p>Kad bi joj naglo maknuo dovoljno orbitalne brzine, putanja više ne bi zaobilazila Zemlju nego bi sjekla atmosferu i postaja bi krenula prema dolje. Zato je rečenica „u orbiti nema gravitacije” praktički obrnuta od onoga što se stvarno događa: <strong>gravitacija upravo drži orbitu</strong>.</p>
            <p class="deep-source"><a href="https://www.nasa.gov/missions/station/spot-the-station-frequently-asked-questions/" target="_blank" rel="noopener noreferrer">NASA – ISS speed and orbit ↗</a></p>
        `;

        const apollo = document.createElement("section");
        apollo.className = "paper";
        apollo.id = "apollo-10-speed";
        apollo.innerHTML = `
            <h2>Apollo 10: najbrži ljudi u povijesti</h2>
            <p>Pri povratku s Mjeseca 26. svibnja 1969. Apollo 10 ušao je u Zemljinu atmosferu brzinom od <strong>24.791 mph</strong>, odnosno približno <strong>39.900 km/h</strong>. NASA i dalje navodi Thomasa Stafforda, Johna Younga i Eugenea Cernana kao ljude koji su postigli najveću brzinu.</p>
            <p>Ta brzina nije došla iz nekakvog „svemirskog turba”. Letjelica se vraćala iz lunarne udaljenosti i padala dublje u Zemljin gravitacijski potencijal pa joj je brzina rasla kako se približavala Zemlji. Na Entry Interfaceu — trenutku kada se reentry počinje računati kao ulazak u atmosferu — Apollo 10 imao je rekordnu brzinu za ljudsku posadu.</p>
            <p>NASA-in podcast sa Staffordom tu brzinu opisuje i kao otprilike <strong>Mach 37</strong>, ali to je zgodna usporedba, ne neka univerzalna pretvorba: Mach ovisi o lokalnoj brzini zvuka, a ona o mediju i uvjetima.</p>
            <p class="deep-source"><a href="https://www.nasa.gov/history/apollo-10-clears-the-way-for-the-first-moon-landing/" target="_blank" rel="noopener noreferrer">NASA – Apollo 10 reentry record ↗</a></p>
        `;

        electromagnetismTitle.before(iss, apollo);
    }

    function expandApolloFlashes() {
        const section = findSectionByHeading("bljeskovi koje su Apollo astronauti vidjeli zatvorenih očiju");
        if (!section || document.getElementById("phosphene-extra")) return;

        const extra = document.createElement("div");
        extra.id = "phosphene-extra";
        extra.innerHTML = `
            <h3>fosfen znači da vidiš svjetlost bez vanjskog izvora svjetlosti</h3>
            <p><strong>Fosfen</strong> je vizualni doživljaj svjetlosti koji ne nastaje zato što je običan foton iz okoline ušao kroz zjenicu. Vizualni sustav možeš pobuditi i mehanički, električno ili ionizirajućim zračenjem. Zato, primjerice, pritisak na zatvoreno oko može proizvesti uzorke i bljeskove iako u oko nije ušla nova slika izvana.</p>
            <p>Kod Apollo astronauta slučaj je puno zanimljiviji: kozmičke čestice velikih energija prolazile su kroz oko i druge dijelove vizualnog sustava. NASA-ina istraživanja zaključivala su da su izravne ionizirajuće interakcije u mrežnici vrlo vjerojatan mehanizam za barem dio tih bljeskova; razmatrana je i Čerenkovljeva emisija te izravna pobuda neuralnog tkiva.</p>
            <p>Zato „vidjeti bljesak” ne znači nužno da je negdje ispred oka postojao mali bljesak svjetlosti. Mozak dobiva signal iz vizualnog sustava i interpretira ga kao svjetlo — bez obzira na to je li ga pokrenuo normalan foton ili vrlo nenormalna kozmička čestica koja je upravo proletjela kroz tvoje oko.</p>
            <p class="deep-source"><a href="https://ntrs.nasa.gov/citations/19740010346" target="_blank" rel="noopener noreferrer">NASA NTRS – Visual light flash phenomenon ↗</a></p>
        `;
        section.appendChild(extra);
    }

    function expandCherenkovWithMach() {
        const section = findSectionByHeading("Čerenkovljevo zračenje");
        if (!section || document.getElementById("mach-number-extra")) return;

        const extra = document.createElement("div");
        extra.id = "mach-number-extra";
        extra.innerHTML = `
            <h3>i zato Mach nije jedna fiksna brzina</h3>
            <div class="physics-equation">M = v / a</div>
            <p><strong>Mach broj</strong> je omjer brzine objekta <em>v</em> i lokalne brzine zvuka <em>a</em>. Zato „Mach 1” nije jedna univerzalna vrijednost u km/h. Brzina zvuka ovisi o mediju i njegovom stanju — u zraku posebno o temperaturi.</p>
            <p>Na standardnim uvjetima blizu razine mora često se koristi broj oko 340 m/s, ali na velikoj visini hladniji zrak znači drugu brzinu zvuka. U vodi je brzina zvuka puno veća nego u zraku. Zbog toga dvije letjelice s istom brzinom u km/h mogu imati različit Mach broj ako lete kroz različite uvjete.</p>
            <p>To je upravo razlog zašto sonic-boom analogija pomaže kod Čerenkova: bitna nije neka apsolutna „zabranjena brzina”, nego odnos brzine objekta ili čestice prema brzini vala u konkretnom mediju.</p>
            <p class="deep-source"><a href="https://www.grc.nasa.gov/WWW/BGH/mach.html" target="_blank" rel="noopener noreferrer">NASA Glenn – Mach number ↗</a></p>
        `;
        section.appendChild(extra);
    }

    function addSpectrumJoke() {
        const section = findSectionByHeading("Faraday → Maxwell → Hertz");
        if (!section || document.getElementById("spectrum-joke")) return;

        const joke = document.createElement("div");
        joke.className = "misconception";
        joke.id = "spectrum-joke";
        joke.innerHTML = `<strong>važna sigurnosna napomena za ljude kojima smeta „cijeli spektar”:</strong> možda nemojte gledati u barionsku materiju. Gotovo sve što vidiš oko sebe vidiš zato što obična tvar emitira, apsorbira ili reflektira elektromagnetsko zračenje. Spektar je već posvuda.`;
        section.appendChild(joke);
    }

    removeOldMiscSection();
    addOrbitSections();
    expandApolloFlashes();
    expandCherenkovWithMach();
    addSpectrumJoke();
})();
