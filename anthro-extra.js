(() => {
    "use strict";

    function rewriteManTheHunter() {
        const block = document.getElementById("man-hunter-verified-deep");
        if (!block) return;

        const section = block.closest("section");
        const chapter = [...document.querySelectorAll(".deep-section-title")].find(node =>
            node.textContent.includes("MAN THE HUNTER") ||
            node.textContent.includes("ANTROPOLOGIJA") ||
            node.textContent.includes("PALEOLITHIC")
        );

        if (chapter) chapter.textContent = "7. WOMEN IN THE PALEOLITHIC";

        const heading = section?.querySelector(":scope > h2");
        if (heading) heading.textContent = "Women in the Paleolithic: ne, žene nisu samo sjedile kraj vatre";

        const directParagraphs = section ? [...section.children].filter(node => node.tagName === "P") : [];
        if (directParagraphs[0]) {
            directParagraphs[0].innerHTML = "Kad zamisliš paleolitik, vrlo je lako automatski složiti istu scenu: <strong>muškarci s kopljima odlaze u lov, žene ostaju uz vatru, skupljaju biljke i čuvaju djecu</strong>. Problem je što je ta slika puno urednija od stvarnih dokaza.";
        }
        if (directParagraphs[1]) {
            directParagraphs[1].innerHTML = "Paleolitik traje ogroman raspon vremena i prostora. Ne postoji jedan univerzalni ‘paleolitički lifestyle’, a još manje jedan prirodni pravilnik koji je svakom spolu unaprijed dodijelio posao. Ono što nalazimo izgleda puno fleksibilnije, ovisno o okolišu, tehnologiji, plijenu, djeci, sezoni i konkretnoj grupi.";
        }

        block.dataset.feministRewrite = "1";
        block.innerHTML = `
            <h3>prvo: odakle nam uopće slika ‘man the hunter, woman the gatherer’?</h3>
            <p><em>Man the Hunter</em> bio je naziv velikog antropološkog simpozija održanog 1966., a zbornik je izašao 1968. Lov je tada bio ogroman dio rasprave o tome što je čovjeka učinilo čovjekom: suradnja, alati, dijeljenje hrane, inteligencija, planiranje.</p>
            <p>Tu nastaje problem ako u startu pretpostaviš da je lov muška stvar. Ako je <strong>lov glavni motor ljudske evolucije</strong>, a lovac je automatski muškarac, muškarac vrlo lako postane glavni lik cijele priče o nastanku čovjeka.</p>
            <p>I fora je da čak ni rezultati tog simpozija nisu bili jednostavno ‘muškarci hrane grupu, žene sjede doma’. Podaci lovačko-sakupljačkih društava već su tada pokazivali koliko su biljni resursi, skupljanje i ženski rad važni za svakodnevnu prehranu. Ali popularna verzija priče zadržala je puno jednostavniju sliku.</p>

            <div class="misconception"><strong>nije poanta da su antropolozi izmislili jednu veliku zavjeru.</strong> puno banalniji problem je da ljudi lako projiciraju društvena pravila svog vremena u daleku prošlost i onda ih počnu tretirati kao prirodu.</div>

            <h3>gathering nije bio side quest</h3>
            <p>Veliki lov izgleda dramatično. Koplje, životinja od nekoliko stotina kilograma, opasnost, meso za cijelu grupu. Sakupljanje korijenja, gomolja, voća, sjemenki, orašastih plodova, školjki ili malih životinja ne izgleda tako filmski — ali hrana ne mora izgledati epski da bi bila ono od čega stvarno preživiš.</p>
            <p>U mnogim dokumentiranim lovačko-sakupljačkim društvima skupljanje daje velik i pouzdan dio kalorija, dok je veliki lov puno varijabilniji: nekad se vratiš s ogromnom količinom hrane, nekad se vratiš bez ičega. To ne znači da su žene uvijek skupljale, muškarci uvijek lovili ili da je isti omjer vrijedio svugdje. Znači samo da je ideja ‘pravi hranitelj = lovac’ dosta loš način za čitanje takvih ekonomija.</p>
            <p>Skupljanje također nije samo hodanje okolo i branje bobica. Treba znati <strong>što je jestivo, gdje raste, kada sazrijeva, kako se obrađuje, što je otrovno, gdje ima vode i kako se resursi mijenjaju kroz sezonu</strong>. To je ozbiljna ekološka baza znanja.</p>

            <h3>oke, ali jesu li žene stvarno lovile?</h3>
            <p>Da. Ne znači da su žene u svakoj skupini lovile istu vrstu plijena jednako često kao muškarci, ali tvrdnja <strong>‘žene nisu lovile’</strong> jednostavno je previše jaka.</p>
            <p>Jedan od najboljih arheoloških primjera je <strong>Wilamaya Patjxa</strong> u Andama. U oko 9000 godina starom grobu mlade žene pronađen je komplet kamenih projektila i alata povezanih s lovom i obradom velikog plijena. Autori rada zatim su pregledali druge rane američke pokope povezane s lovačkom opremom i zaključili da se ženski lov ne može tretirati kao nekakva nezamisliva iznimka.</p>
            <p>Postoje i etnografski zapisi žena koje ciljano love. Rad iz 2023. našao je izvještaje o ženskom lovu u velikom dijelu društava koje je pregledao. Oko metodologije tog rada nastala je rasprava i 2024. objavljena je korekcija, pa brojku iz tog rada ne treba pretvarati u univerzalnu statistiku za cijelo čovječanstvo. Ali osnovna stvar ostaje: <strong>stroga zabrana ženskog lova nije univerzalna ljudska konstanta.</strong></p>

            <h3>‘ali muškarci su jači’ nije cijelo objašnjenje</h3>
            <p>Muškarci u prosjeku imaju veću apsolutnu mišićnu masu i snagu, posebno gornjeg dijela tijela. To je stvarno. Ali iz toga ne slijedi ‘zato žene ne mogu loviti’. Lov nije natjecanje u bench pressu.</p>
            <p>Lov može uključivati sate hodanja, trčanje, praćenje tragova, zasjedu, mreže, projektile, grupnu koordinaciju, pse, zamke i poznavanje terena. Sarah Lacy i Cara Ocobock zato upozoravaju da ženska fiziologija sama po sebi nije dokaz da žene nisu bile sposobne za zahtjevne aktivnosti ili lov. <strong>Sposobnost i stvarna društvena učestalost nisu ista stvar</strong>, ali biologija nije dovoljno jednostavna da iz prosječne razlike u snazi izvučemo cijelu podjelu rada kroz prapovijest.</p>

            <h3>što su onda žene radile u paleolitiku?</h3>
            <p>Najpošteniji odgovor je: <strong>puno različitih stvari, a mi za velik dio njih ne možemo samo pogledati alat i pročitati spol osobe koja ga je koristila.</strong></p>
            <ul class="bad-list">
                <li><strong>skupljanje i obrada hrane:</strong> biljke, gomolji, sjemenke, plodovi, školjke, sitni plijen i sve što nakon skupljanja treba očistiti, razbiti, samljeti, kuhati ili spremiti;</li>
                <li><strong>lov u dijelu društava i situacija:</strong> samostalno, u grupi, mrežama, zamkama ili projektilima, ovisno o okolišu i vrsti plijena;</li>
                <li><strong>skrb o djeci, bolesnima i starijima:</strong> ali vrlo vjerojatno ne kao posao jedne izolirane majke — ljudska djeca su preskupa za takav sustav;</li>
                <li><strong>dijeljenje hrane i društvene veze:</strong> preživljavanje male mobilne grupe ovisi o tome da hrana, informacije i pomoć kruže među ljudima;</li>
                <li><strong>obrada kože, vlakana i drugih organskih materijala:</strong> ogroman dio tehnologije prapovijesti slabo se očuva upravo zato što nije napravljen od kamena ili kosti.</li>
            </ul>
            <p>To zadnje je dosta bitno. Arheologija najbolje čuva ono što je tvrdo. Kamen može ostati stotinama tisuća godina; košara, konop, drvena posuda, odjeća ili biljna hrana uglavnom ne. Ako se fokusiraš samo na ono što se najbolje fosilizira, lako dobiješ iskrivljenu sliku svakodnevnog života.</p>

            <h3>ljudi nisu čimpanze s boljim kopljem</h3>
            <p>Još jedan dio videa koji mi je puno bolji od stare ‘alpha male’ priče je <strong>reverse dominance hierarchy</strong>. Ideja Christophera Boehma je da su u mnogim egalitarnim ljudskim grupama ostali članovi zajednice sposobni udružiti se protiv osobe koja pokušava sve kontrolirati — kroz ismijavanje, kritiku, neposluh, protjerivanje ili, u ekstremnim slučajevima, zajedničku prisilu.</p>
            <p>To ne znači da je svaki paleolitički kamp bio feministička utopija bez nasilja, ljubomore ili statusa. I ne možemo današnja lovačko-sakupljačka društva samo kopirati unatrag 40.000 godina. Ali pokazuje nešto važno: <strong>trajna hijerarhija u kojoj jedan najjači muškarac automatski vlada svima nije jedini ‘prirodni’ način ljudskog društva.</strong></p>
            <p>Ljudi su ekstremno kooperativna vrsta. Naša djeca ovise o odraslima godinama, hrana se dijeli, znanje se prenosi, a skrb često prelazi granice bioloških roditelja. Ako želiš objasniti ljudsku evoluciju samo natjecanjem najjačih mužjaka, fali ti ogroman dio priče.</p>

            <h3>pa zašto onda danas postoji toliko patrijarhalnih društava?</h3>
            <p>Nema jednog trenutka u kojem je netko izumio patrijarhat i od tada sve krenulo nizbrdo. Postoji više hipoteza i procesi su se razlikovali između regija.</p>
            <p>Jedna važna promjena je <strong>poljoprivreda</strong>: stalno zemljište, višak hrane, skladištenje, nasljeđivanje i imovina stvaraju sasvim drukčije uvjete od male mobilne skupine koja većinu stvari mora nositi sa sobom. Studija Alesine, Giuliano i Nunna našla je vezu između povijesne upotrebe pluga i kasnijih nejednakijih rodnih normi. To nije dokaz da je ‘plug stvorio patrijarhat’, ali je dobar primjer kako tehnologija i ekonomija mogu dugoročno promijeniti rodnu podjelu rada.</p>
            <p>Na to se mogu nadovezati nasljeđivanje zemlje i bogatstva, veće populacije, organizirano ratovanje, države, porezi i institucije koje mogu učiniti hijerarhije puno stabilnijima nego u maloj mobilnoj grupi. Zato je puno sigurnije govoriti o <strong>razvoju patrijarhalnih sustava</strong> nego izmišljati jedan univerzalni uzrok.</p>

            <div class="misconception"><strong>poanta nije ‘žene su zapravo sve radile’.</strong> To bi samo zamijenilo jedan crtić drugim. Poanta je da dokazi ne podržavaju jednostavan univerzalni scenarij u kojem su muškarci aktivni lovci, izumitelji i hranitelji, a žene pasivna pozadina ljudske evolucije.</div>

            <h3>najzanimljiviji dio cijele priče</h3>
            <p>Meni je zapravo najzanimljivije koliko je lako društvenu ulogu pretvoriti u priču o biologiji. Ako dovoljno puta vidiš ilustraciju gdje je muškarac s kopljem naprijed, a žena s djetetom u pozadini, nakon nekog vremena to više ni ne izgleda kao interpretacija. Izgleda kao činjenica.</p>
            <p>A stvarna prapovijest je puno neurednija: muškarci su skupljali, žene su lovile, ljudi su dijelili hranu, brinuli se jedni o drugima i mijenjali podjelu rada ovisno o tome što je u tom trenutku imalo smisla. <strong>Ljudska fleksibilnost je puno bolja priča od ‘tako je priroda odredila’.</strong></p>

            <p class="deep-source"><a href="https://www.youtube.com/watch?v=FHUBXfJ71pw" target="_blank" rel="noopener noreferrer">Jackdaw – You've Been Lied to About Cavewomen ↗</a> · <a href="https://www.noemamag.com/the-man-the-hunter-myth-wont-go-away" target="_blank" rel="noopener noreferrer">Noema – The ‘Man the Hunter’ Myth Won't Go Away ↗</a> · <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7673694/" target="_blank" rel="noopener noreferrer">Science Advances – Female hunters of the early Americas ↗</a> · <a href="https://anthrosource.onlinelibrary.wiley.com/doi/10.1111/aman.13914" target="_blank" rel="noopener noreferrer">American Anthropologist – Woman the Hunter ↗</a> · <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0287101" target="_blank" rel="noopener noreferrer">PLOS ONE – women hunting in ethnographic records ↗</a> · <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0309543" target="_blank" rel="noopener noreferrer">PLOS ONE – correction ↗</a> · <a href="https://academic.oup.com/qje/article-abstract/128/2/469/1943509" target="_blank" rel="noopener noreferrer">QJE – Women and the Plough ↗</a></p>
        `;
    }

    rewriteManTheHunter();
})();
