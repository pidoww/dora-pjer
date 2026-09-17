(() => {
    "use strict";

    function rewriteManTheHunter() {
        const block = document.getElementById("man-hunter-verified-deep");
        if (!block || block.dataset.feministRewrite === "1") return;
        block.dataset.feministRewrite = "1";

        const section = block.closest("section");
        const chapter = [...document.querySelectorAll(".deep-section-title")].find(node => node.textContent.includes("MAN THE HUNTER"));
        if (chapter) chapter.textContent = "7. ANTROPOLOGIJA: TKO JE UOPĆE DOBIO ULOGU ‘ČOVJEKA’?";

        const heading = section?.querySelector(":scope > h2");
        if (heading) heading.textContent = "Man the Hunter: kad je muškarac postao ‘defaultni čovjek’";

        const directParagraphs = section ? [...section.children].filter(node => node.tagName === "P") : [];
        if (directParagraphs[0]) {
            directParagraphs[0].innerHTML = "Meni je najveći problem s ovom pričom to što nije samo rekla ‘muškarci su često lovili’. Napravila je nešto puno veće: <strong>muški lov stavila je u središte priče o nastanku cijelog čovjeka</strong>. Kad lov proglasiš glavnim motorom inteligencije, suradnje, tehnologije i društva, a lov unaprijed tretiraš kao mušku stvar, muškarac vrlo lako postane predstavnik cijele vrste, dok žene završe kao dodatak priči.";
        }
        if (directParagraphs[1]) {
            directParagraphs[1].innerHTML = "Ne moramo tvrditi da je svaki autor svjesno sjeo i odlučio ‘napisat ću ovo da muškarci ostanu na vlasti’. Za takvu namjeru trebaju dokazi. Ali možemo vrlo normalno reći da su antropologiju dugo oblikovali <strong>patrijarhalno društvo, muške akademske institucije i pretpostavka da su muške aktivnosti važnije</strong>. Kad takav pogled preneseš na prapovijest, dobiješ prošlost koja jako nalikuje rodnim pravilima vlastitog vremena.";
        }

        block.innerHTML = `
            <h3>ovo je baš dobar primjer androcentrizma</h3>
            <p><strong>Androcentrizam</strong> znači da se muško iskustvo uzima kao neutralno i univerzalno, a žensko kao posebna kategorija koju treba dodatno objasniti. U starijoj antropologiji to se vidi posvuda: lovac, ratnik, vođa i hranitelj zamišljaju se kao muškarci, a onda se baš te aktivnosti predstavljaju kao glavne stvari koje su oblikovale ljudsku povijest.</p>
            <p>Sally Slocum je još 1975. u <em>Woman the Gatherer: Male Bias in Anthropology</em> pogodila srž problema. Ako pitaš samo što su muškarci radili i onda njihove aktivnosti koristiš da objasniš evoluciju cijele vrste, rezultat nije neutralna slika čovjeka. Sakupljanje, obrada biljaka, dijeljenje hrane, skrb o djeci, društvene veze i drugi poslovi povezivani sa ženama lako postanu nevidljivi ili se tretiraju kao manje važni.</p>
            <p>Kasnija feministička arheologija otišla je još dalje: upozorila je da su moderni stereotipi poput ‘muškarac = lovac/ratnik/vođa’ često vraćani tisućama godina unatrag kao da su biološki zakon. To onda više nije samo loš izbor riječi nego način na koji pretpostavka počne određivati što će se uopće tražiti i kako će se nalaz protumačiti.</p>

            <div class="misconception"><strong>Poanta nije zamijeniti ‘muškarac je sve radio’ s ‘žena je sve radila’.</strong> Poanta je prestati unaprijed dodjeljivati uloge spolu pa tek onda tražiti dokaze koji odgovaraju toj slici.</div>

            <h3>žene su lovile. pitanje je zašto je to toliko dugo zvučalo ‘neočekivano’</h3>
            <p>Arheološki i etnografski podaci pokazuju da su žene u različitim društvima namjerno lovile. Jedan od najpoznatijih primjera je Wilamaya Patjxa u Andama: oko 9000 godina star pokop mlade žene pronađen je uz komplet kamenih projektila i alata povezanih s lovom i obradom plijena. Osteološki i biomolekularni podaci podupiru identifikaciju osobe kao žene.</p>
            <p>Rad Anderson i sur. iz 2023. u 63 društva s dovoljno jasnim opisima strategija lova pronašao je izvještaje o ženskom lovu u 79% njih. Taj rad je 2024. dobio formalnu korekciju i oko metodologije postoji rasprava, pa tih 79% ne treba pretvarati u univerzalnu stopu za cijelu ljudsku vrstu. Ali ruši puno jednostavniju tvrdnju da je lov bio isključivo muška aktivnost.</p>
            <p>Još je zanimljivije koliko su raniji nalazi često čitani kroz rodni stereotip: oružje ili lovački alat u muškom grobu lako se tumačio kao dokaz zanimanja, dok se isti tip predmeta uz ženski kostur znao objašnjavati ritualom, statusom ili nečim drugim. Upravo takve interpretativne navike feministička arheologija pokušava rasklopiti.</p>

            <h3>‘Man the Hunter’ nije samo starinski naslov</h3>
            <p>Simpozij <em>Man the Hunter</em> iz 1966. bio je važan za razvoj hunter-gatherer istraživanja i nije ga pošteno svesti na jednu karikaturu. Ali retrospektiva u <em>Oxford Handbooku</em> otvoreno navodi da je objavljeni zbornik vrlo brzo izazvao feminističku reakciju zbog <strong>seksističkog jezika i izostavljanja ženskih uloga</strong>. Drugim riječima, kritika nije neka moderna internet intervencija; pojavila se gotovo odmah čim je taj okvir postao utjecajan.</p>
            <p>Problem s popularnom verzijom priče je kružan: prvo se lov definira kao muška aktivnost, zatim se lov proglasi glavnim motorom ljudske evolucije, a onda se iz toga zaključi da su muškarci bili glavni pokretači ljudske evolucije. Ako ti je rod već ugrađen u prvu pretpostavku, završni zaključak teško može biti neutralan.</p>

            <h3>podjela rada nije isto što i vječni prirodni poredak</h3>
            <p>U mnogim dokumentiranim lovačko-sakupljačkim društvima stvarno postoji spolno strukturirana podjela rada i muškarci u mnogima češće love određeni plijen. Feministički pristup ne treba to skrivati. Ali obrasci nisu isti svugdje, nisu apsolutni i sami po sebi ne dokazuju da je stroga podjela ‘muškarac lovi / žena skuplja’ bila univerzalna kroz cijelu ljudsku evoluciju.</p>
            <p>Trudnoća, dojenje, skrb o djeci, vrsta plijena, udaljenost, sezona, tehnologija, zamke, psi, grupni lov, rizik i način dijeljenja hrane mijenjaju što se isplati i tko što radi. Zato je ‘tko lovi?’ empirijsko pitanje za konkretno društvo i vrijeme, a ne pravilo koje se može unaprijed napisati u biologiju.</p>

            <div class="misconception"><strong>Najzanimljivije pitanje meni više nije ‘jesu li žene mogle loviti?’</strong> Naravno da jesu. Zanimljivije je zašto je znanosti toliko dugo bilo prirodno zamišljati muškarca kao aktivnog tvorca povijesti, a ženu kao pozadinu koju se tek kasnije mora vratiti u kadar.</div>

            <h3>religija i patrijarhat: kad društveno pravilo dobije status svetog pravila</h3>
            <p>Religija nije automatski isto što i patrijarhat, ali bilo bi jednako pogrešno praviti se da između njih povijesno nema veze. U mnogim velikim religijskim tradicijama najviši autoriteti, tumači svetih tekstova i formalne institucije stoljećima su bili uglavnom muškarci. Kad baš ta institucija određuje tko smije voditi, propovijedati, nasljeđivati autoritet ili donositi pravila o obitelji i seksualnosti, rodna hijerarhija dobiva puno jaču podlogu od običnog ‘tako smo navikli’.</p>
            <p>Tu mi je najvažniji mehanizam <strong>legitimiranja moći</strong>. Ako se kaže da muškarac treba biti glava obitelji, da je ženska poslušnost moralna vrlina ili da je određena podjela uloga dio božanskog poretka, društveno pravilo više ne izgleda kao nešto što su ljudi napravili i mogu promijeniti. Izgleda kao nešto iznad ljudi. Upravo zato religijski autoritet može biti vrlo učinkovit alat za održavanje rodne hijerarhije.</p>
            <p>To se ne mora događati kroz nekakav tajni plan. Institucija može desetljećima ili stoljećima ponavljati pravila koja su nastala u već patrijarhalnom društvu, davati im teološko opravdanje i zatim ih prenositi novim generacijama kao moralnu normu. Patrijarhat tada hrani religijsku interpretaciju, a religijska interpretacija zauzvrat hrani patrijarhat.</p>
            <p>Ali žene unutar religija nisu samo pasivne osobe kojima se nešto radi. Feministička sociologija religije pokazuje da žene religijske tekstove i prakse također reinterpretiraju, osporavaju autoritete, stvaraju vlastite zajednice ili iz istih tradicija izvlače argumente za jednakost. Zato mi je loše i jedno i drugo pojednostavljenje: i ‘religija samo tlači žene’ i ‘religija nema nikakve veze s rodnom moći’.</p>

            <div class="misconception"><strong>Je li onda religija nastala samo zato da bi muškarci kontrolirali žene?</strong> Za to nemamo dobar dokaz. Antropologija nema jednu prihvaćenu priču o nastanku religije; postoje modeli vezani uz kogniciju, ritual, društvenu koheziju, moralna pravila, identitet, supernaturalne agente i druge procese. Puno je čvršća tvrdnja da su <strong>postojeće religijske institucije u mnogim društvima mogle preuzeti, opravdati i učvrstiti već postojeće patrijarhalne odnose moći</strong>.</div>
            <p>Meni je zato zanimljivije pitati <strong>tko ima pravo govoriti u ime boga, tko tumači tekst i kome ta interpretacija daje autoritet</strong>. Tu se puno bolje vidi odnos religije i moći nego u jednostavnoj tvrdnji da je sva religija izmišljena samo radi kontrole.</p>

            <p class="deep-source"><a href="https://onlinelibrary.wiley.com/doi/10.1002/9781119092797.ch30" target="_blank" rel="noopener noreferrer">Wiley Blackwell – Sex and Gender in the Study of Religion ↗</a> · <a href="https://compass.onlinelibrary.wiley.com/doi/10.1111/j.1751-9020.2011.00439.x" target="_blank" rel="noopener noreferrer">Sociology Compass – women's agency in gender-traditional religions ↗</a> · <a href="https://onlinelibrary.wiley.com/doi/full/10.1111/jssr.12781" target="_blank" rel="noopener noreferrer">Journal for the Scientific Study of Religion – gender, sexuality and religion ↗</a> · <a href="https://www.cambridge.org/core/journals/journal-of-demographic-economics/article/gender-and-religion-a-survey/5A8571DEC9EE28C42FE8DFC503B3F8D8" target="_blank" rel="noopener noreferrer">Cambridge – Gender and religion survey ↗</a> · <a href="https://www.annualreviews.org/content/journals/10.1146/annurev.anthro.37.081407.085201" target="_blank" rel="noopener noreferrer">Annual Review of Anthropology – evolutionary perspectives on religion ↗</a></p>

            <p class="deep-source"><a href="https://academic.oup.com/edited-volume/28290/chapter-abstract/214483060" target="_blank" rel="noopener noreferrer">Oxford Handbook – gender studies i Man the Hunter ↗</a> · <a href="https://link.springer.com/article/10.1007/s11759-010-9149-1" target="_blank" rel="noopener noreferrer">Archaeologies – androcentrizam u arheologiji ↗</a> · <a href="https://anthrosource.onlinelibrary.wiley.com/doi/10.1111/aman.13914" target="_blank" rel="noopener noreferrer">American Anthropologist – Woman the Hunter ↗</a> · <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7673694/" target="_blank" rel="noopener noreferrer">Science Advances – Wilamaya Patjxa ↗</a> · <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0287101" target="_blank" rel="noopener noreferrer">PLOS ONE – ženski lov u etnografskim zapisima ↗</a> · <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0309543" target="_blank" rel="noopener noreferrer">PLOS ONE – korekcija 2024. ↗</a></p>
        `;
    }

    rewriteManTheHunter();
})();
