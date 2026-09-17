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
        if (heading) heading.textContent = "Man the Hunter: problem nije samo lov nego muški ‘default’ u priči o čovjeku";

        const directParagraphs = section ? [...section.children].filter(node => node.tagName === "P") : [];
        if (directParagraphs[0]) {
            directParagraphs[0].innerHTML = "Feministička kritika ovog modela pogađa nešto veće od pitanja je li poneka žena lovila. Kad se priča o nastanku ‘čovjeka’ gradi oko aktivnosti koja se unaprijed proglasi muškom, onda muškarac vrlo lako postane <strong>defaultni predstavnik cijele vrste</strong>, a ženski rad završi kao fusnota. Upravo je to androcentrizam koji su antropologinje i arheologinje počele sustavno prozivati desetljećima.";
        }
        if (directParagraphs[1]) {
            directParagraphs[1].innerHTML = "Ne treba izmišljati zavjeru u kojoj je svaki pojedini autor svjesno sjeo i odlučio ‘zadržati muškarce na vlasti’. Dovoljno je da disciplina nastane u društvu i akademiji u kojima su muškarci imali daleko više institucionalne moći, da se muške aktivnosti smatraju važnijima i da se te pretpostavke zatim projiciraju unatrag u prapovijest. Rezultat može biti sustavno pristran i bez jedne centralne namjere.";
        }

        block.innerHTML = `
            <h3>zašto je feministička kritika bila potrebna</h3>
            <p>Sally Slocum je još 1975. u tekstu <em>Woman the Gatherer: Male Bias in Anthropology</em> napala upravo tu slijepu točku: antropologija je često pitala što su radili muškarci i onda njihove aktivnosti predstavljala kao ono što je ‘napravilo čovjeka’. Sakupljanje, skrb, dijeljenje hrane, nošenje djece, obrada biljaka, društvene mreže i drugi poslovi u kojima su žene bile vidljivije tretirani su kao manje evolucijski zanimljivi.</p>
            <p>Kasnija feministička arheologija proširila je kritiku. Problem nije samo da su žene bile izostavljene iz slika prošlosti nego i da su moderni stereotipi o muškarcima — lovac, ratnik, vođa, hranitelj — vraćani tisućama godina unatrag kao da su prirodna i nepromjenjiva ljudska konstanta.</p>

            <div class="misconception"><strong>Poanta nije ‘sad žene moraju biti glavni lik umjesto muškaraca’.</strong> Poanta je prestati uzimati današnje rodne pretpostavke kao početnu postavku za čitanje prapovijesti. Dokaz treba određivati rekonstrukciju, a ne obrnuto.</div>

            <h3>žene jesu lovile — to više nije ozbiljno sporno</h3>
            <p>Postoje etnografski i arheološki primjeri žena koje namjerno love. Wilamaya Patjxa u Andama jedan je od najpoznatijih primjera: oko 9000 godina star ženski pokop pronađen je uz komplet alata povezan s lovom na veliki plijen. Noviji arheološki pregledi također upozoravaju da je stroga formula ‘muškarac lovi / žena skuplja’ često bila pretpostavka prije nego zaključak iz materijalnih podataka.</p>
            <p>Rad Anderson i sur. iz 2023. pronašao je izvještaje o ženskom lovu u velikom dijelu pregledanih etnografskih društava. Taj rad je kasnije dobio formalnu korekciju i oko metodologije postoji rasprava, pa njegovih poznatih 79% ne treba pretvarati u univerzalnu brojku za cijelu ljudsku vrstu. Ali jedna stvar ostaje čvrsta: tvrdnja da žene ‘nisu lovile’ ne stoji.</p>

            <h3>zašto ‘Man the Hunter’ nije nevina etiketa</h3>
            <p>Povijesni simpozij iz 1966. bio je širi i složeniji od mema koji je kasnije ostao iza njega. Ipak, retrospektivni radovi o hunter-gatherer istraživanju opisuju kako su seksistički jezik i zanemarivanje ženskih uloga vrlo brzo izazvali feminističku kritiku. U popularnoj verziji priče lov postaje motor inteligencije, suradnje, tehnologije i ‘civilizacije’, a zatim se gotovo sav taj evolucijski kredit automatski pripiše muškarcima.</p>
            <p>To je epistemološki problem: ako unaprijed odlučiš da je aktivnost koja te najviše zanima muška, a onda baš tu aktivnost proglasiš glavnim motorom ljudskosti, dobio si kružni argument koji vrlo uredno stavlja muškarca u središte priče.</p>

            <h3>spolna podjela rada može postojati bez priče da je muškarac ‘pravi čovjek’</h3>
            <p>Feministički pristup ne traži da se ignoriraju stvarne razlike među populacijama. U mnogim dokumentiranim foragerskim društvima postoji spolno strukturirana podjela rada, a muškarci u mnogima češće love određene vrste plijena. Ali obrasci nisu isti svugdje, nisu apsolutni i ne daju pravo da se iz njih napravi univerzalna priča o cijeloj ljudskoj evoluciji.</p>
            <p>Ekologija, trudnoća, dojenje, briga o djeci, vrsta plijena, udaljenost, tehnologija, mreže, psi, zamke, grupni pogoni, rizik i način dijeljenja hrane mijenjaju trošak i korist različitih aktivnosti. ‘Tko lovi?’ zato je empirijsko pitanje za određeno društvo, vrijeme i okoliš — ne pravilo koje se unaprijed upisuje u biologiju.</p>

            <h3>i da, isti obrazac moći vrijedi gledati i kod religije — ali bez lažne jednostavnosti</h3>
            <p>Feministička sociologija religije dugo proučava kako religijske institucije, pravila i slike božanskog mogu legitimirati mušku vlast: muško svećenstvo, muški ‘glava obitelji’, pravila o poslušnosti žena ili ideju da je rodna hijerarhija božanski određena. Kad se društvena hijerarhija predstavi kao sveta ili prirodna, puno ju je teže dovesti u pitanje.</p>
            <p>Ali bilo bi previše tvrditi da je <strong>religija kao pojava nastala samo zato da bi muškarci zadržali moć</strong>. Religija je starija i raznovrsnija od jedne takve funkcije, a antropološka objašnjenja njezina nastanka uključuju ritual, koheziju grupe, objašnjavanje svijeta, odnos prema smrti, identitet, autoritet i mnogo drugih procesa. Preciznija tvrdnja je: <strong>religijske institucije i patrijarhat kroz povijest su se u mnogim društvima međusobno pojačavali, a religijski autoritet se može koristiti za legitimiranje rodne hijerarhije.</strong></p>

            <div class="misconception"><strong>Meni je ovdje najzanimljivije pitanje tko dobiva status ‘normalnog čovjeka’.</strong> Ako knjiga, rekonstrukcija ili teorija muškarca tretira kao univerzalnu osobu, a ženu kao posebnu podkategoriju koju treba naknadno objasniti, već je donesena velika pretpostavka prije nego što su dokazi uopće progovorili.</div>

            <p class="deep-source"><a href="https://academic.oup.com/edited-volume/28290/chapter-abstract/214483060" target="_blank" rel="noopener noreferrer">Oxford Handbook – gender studies i Man the Hunter ↗</a> · <a href="https://link.springer.com/article/10.1007/s11759-010-9149-1" target="_blank" rel="noopener noreferrer">Archaeologies – androcentrizam u arheologiji ↗</a> · <a href="https://anthrosource.onlinelibrary.wiley.com/doi/10.1111/aman.13914" target="_blank" rel="noopener noreferrer">American Anthropologist – Woman the Hunter ↗</a> · <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10306201/" target="_blank" rel="noopener noreferrer">PLOS ONE – ženski lov u etnografskim zapisima ↗</a> · <a href="https://compass.onlinelibrary.wiley.com/doi/10.1111/j.1751-9020.2011.00439.x" target="_blank" rel="noopener noreferrer">Sociology Compass – žene i rodno tradicionalne religije ↗</a> · <a href="https://www.cambridge.org/core/journals/journal-of-demographic-economics/article/gender-and-religion-a-survey/5A8571DEC9EE28C42FE8DFC503B3F8D8" target="_blank" rel="noopener noreferrer">Cambridge – gender and religion survey ↗</a></p>
        `;
    }

    rewriteManTheHunter();
})();
