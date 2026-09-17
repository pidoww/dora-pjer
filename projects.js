(() => {
    "use strict";

    function insertHomelabDeepDive() {
        const homelab = document.querySelectorAll(".project-deep")[0];
        const body = homelab?.querySelector(".project-deep-body");
        if (!body || body.querySelector(".homelab-extra")) return;

        const extra = document.createElement("div");
        extra.className = "homelab-extra";
        extra.innerHTML = `
            <h3>mrežna topologija: LAN nije isto što i VPN subnet</h3>
            <p>Kućni LAN je odvojena IP mreža od virtualne mreže koju stvara OpenVPN. Kad se laptop ili mobitel spoji izvana, prvo dobije adresu na VPN tunelu. Tek onda routing pravila dopuštaju promet iz tog virtualnog sučelja prema uređajima u kućnoj mreži.</p>
            <pre class="project-diagram">udaljeni uređaj
   │
   │ internet
   ▼
router / NAT
   │
   │ samo OpenVPN port ide prema Pi-ju
   ▼
Raspberry Pi 5
   │
   ├── VPN virtualni interface
   │       │
   │       └── routing prema LAN-u
   │
   └── LAN 192.168.1.0/24
           │
           ├── OMV web admin
           ├── Samba / SMB
           └── ostali lokalni uređaji</pre>
            <p>To je sigurnosno bitna razlika: SMB shareovi i OMV administracija ne moraju biti direktno dostupni s javnog interneta. Izvana je dovoljno doći do VPN-a, a nakon autentikacije pristupati internim servisima kroz tunel.</p>
            <h3>što NAT i port forwarding zapravo rade</h3>
            <p>Router prema internetu predstavlja cijeli kućni LAN jednom javnom IPv4 adresom. NAT vodi evidenciju aktivnih veza i prevodi privatne adrese uređaja u javnu adresu routera. Port forwarding je namjerna iznimka: promet koji stigne na odabrani javni UDP port šalje se prema OpenVPN serveru na Raspberry Piju.</p>
            <p>To ne znači da je cijeli Raspberry Pi „otvoren internetu”. Izložen je samo servis koji sluša na proslijeđenom portu. Upravo zato nema potrebe posebno forwardati SMB portove 445/139 ili OMV admin web-port prema internetu.</p>
            <h3>OpenVPN: control channel i data channel</h3>
            <p>OpenVPN veza ima dvije konceptualno različite zadaće. <strong>Control channel</strong> koristi TLS za autentikaciju, razmjenu ključeva i dogovaranje parametara veze. <strong>Data channel</strong> zatim tim dogovorenim ključevima štiti stvarne IP pakete koji prolaze kroz tunel.</p>
            <p>U zadnje zabilježenom setupu korišten je OpenVPN 2.6.x. Kod te generacije može postojati i <strong>DCO — Data Channel Offload</strong>. Kad je DCO omogućen i kompatibilan s konfiguracijom, obrada data-channel prometa seli se iz OpenVPN userspace procesa u kernel, čime se smanjuje broj kopiranja paketa i CPU overhead. U ovom setupu DCO je bio <strong>off</strong>, što nije kvar: VPN i dalje normalno radi, samo promet obrađuje klasični userspace OpenVPN put.</p>
            <div class="misconception"><strong>DCO off ≠ VPN nije šifriran.</strong> DCO mijenja gdje se obrađuje data-channel promet, prvenstveno zbog performansi. Ne predstavlja „on/off” prekidač same VPN enkripcije.</div>
            <h3>AES-CBC warning koji smo vidjeli</h3>
            <p>OpenVPN 2.6 može upozoravati na stariju konfiguraciju koja još navodi AES-CBC data cipher. CBC nije isto što i „nema enkripcije”, ali moderni OpenVPN preferira AEAD načine poput AES-GCM ili ChaCha20-Poly1305 zato što u jednom konstrukcijskom modelu daju i povjerljivost i autentikaciju podataka te se bolje uklapaju u moderni OpenVPN cipher negotiation.</p>
            <p>Zato warning nije bio znak da je tunel odjednom otvoren tekst, nego indikator da se konfiguracija oslanja na legacy-kompatibilni dio OpenVPN stacka.</p>
            <h3>OMV nije filesystem</h3>
            <p>OpenMediaVault je administracijski sloj iznad Linuxa. Disk i filesystem postoje ispod njega; OMV zatim kroz web sučelje upravlja mountovima, shared folderima, korisnicima, privilegijama i servisima kao što je SMB/CIFS. Zato brisanje Samba share definicije nije isto što i brisanje samih podataka s diska.</p>
            <pre class="project-diagram">fizički HDD
   ▼
Linux block device
   ▼
filesystem + mount point
   ▼
OMV Shared Folder
   ▼
Samba share [BLACK] / [BLUE]
   ▼
Windows / Linux / Android klijent</pre>
            <h3>BLACK i BLUE</h3>
            <p>U setupu su dva glavna storage diska: jedan oko 1.8 TB i drugi oko 916 GB, izloženi kao shareovi <strong>BLACK</strong> i <strong>BLUE</strong>. Klijent ne mora znati gdje je konkretni disk mountan u Linux filesystemu — preko SMB-a vidi logičko ime sharea, dok OMV/Samba mapiraju to ime na stvarni direktorij.</p>
            <h3>HTTPS na OMV admin stranici</h3>
            <p>HTTPS i VPN rješavaju različite slojeve. VPN štiti put od udaljenog uređaja do kućne mreže. HTTPS dodatno štiti samu HTTP sesiju prema OMV-u. Kod self-signed certifikata browser može javiti da certifikatu „ne vjeruje” jer ga nije potpisao javno poznati Certificate Authority; to nije isto što i tvrdnja da promet nije šifriran.</p>
            <h3>što je zapravo dobar security model ovog setupa</h3>
            <ol class="bad-list">
                <li>javno izložiti samo VPN ulaz koji stvarno treba biti dostupan izvana;</li>
                <li>SMB, OMV admin i ostale interne servise ostaviti na LAN/VPN strani;</li>
                <li>koristiti zasebne korisnike i minimalne potrebne dozvole za shareove;</li>
                <li>redovno patchati Raspberry Pi OS, OpenVPN, OMV i Samba;</li>
                <li>držati backup bitnih podataka odvojeno od samog NAS-a — dva diska u istom serveru nisu automatski backup jedan drugoga.</li>
            </ol>
            <p class="deep-source"><a href="https://openvpn.net/connect-docs/openvpn-dco.html" target="_blank" rel="noopener noreferrer">OpenVPN – Data Channel Offload ↗</a> · <a href="https://docs.openmediavault.org/" target="_blank" rel="noopener noreferrer">openmediavault dokumentacija ↗</a> · <a href="https://www.samba.org/" target="_blank" rel="noopener noreferrer">Samba ↗</a></p>
        `;

        const sourceRow = body.querySelector(".deep-source");
        if (sourceRow) body.insertBefore(extra, sourceRow);
        else body.appendChild(extra);
    }

    function insertRetroDeepDive() {
        const retro = document.querySelectorAll(".project-deep")[1];
        const body = retro?.querySelector(".project-deep-body");
        if (!body || body.querySelector(".retro-extra")) return;

        const extra = document.createElement("div");
        extra.className = "retro-extra";
        extra.innerHTML = `
            <h3>što je zapravo cijeli software stack</h3>
            <p><strong>RetroPie nije jedan emulator.</strong> To je sloj skripti, konfiguracije i frontenda koji na Raspberry Pi OS-u povezuje više emulatora i alata u jednu konzolsku cjelinu. EmulationStation služi kao preglednik biblioteke i launcher; zatim se za odabrani sustav pokreće konkretni emulator ili libretro core.</p>
            <pre class="project-diagram">gamepad
   │
   ▼
Linux input
   │
   ▼
EmulationStation
   │  odabir igre
   ▼
RetroPie runcommand / emulator config
   │
   ├── libretro core + RetroArch
   │        ili
   └── standalone emulator
            │
            ▼
      emulirani CPU/GPU/audio
            │
            ▼
       Linux DRM/KMS + ALSA
            │
       ┌────┴────┐
       ▼         ▼
      DSI       HDMI</pre>
            <h3>ROM nije emulator</h3>
            <p>ROM image je kopija sadržaja memorije originalnog cartridgea/diska ili drugog medija. Sam po sebi nije izvršni program za ARM procesor Raspberry Pija. Emulator implementira ponašanje originalne konzole: instrukcijski set CPU-a, mapiranje memorije, timere, interrupt logiku, grafičke registre, audio hardver i druge periferije. Tek kroz taj model originalni kod dobiva okruženje koje očekuje.</p>
            <h3>zašto različiti emulatori iste konzole ne rade jednako</h3>
            <p>Emulacija je kompromis između točnosti i brzine. Interpreter može izvršavati emulirane instrukcije korak po korak, dok dinamička rekompilacija prevodi blokove instrukcija u kod host procesora radi većih performansi. Grafički plugin/core može pakete originalnog GPU-a pretvarati u moderne OpenGL/Vulkan pozive, ali brži shortcut ponekad znači i veći rizik od grafičkih razlika u odnosu na originalni hardver.</p>
            <h3>DSI ekran nije „mali HDMI”</h3>
            <p>DSI je <strong>Display Serial Interface</strong>, zaseban display link koji ide kroz ribbon kabel do panela/bridge elektronike. Na modernom Raspberry Pi OS grafički stack uglavnom koristi DRM/KMS, koji displaye izlaže kao konektore poput <code>DSI-1</code> i <code>HDMI-A-1</code>. HDMI s druge strane uključuje vlastiti link, EDID pregovaranje s monitorom/TV-om i obično drukčije rezolucije i timings.</p>
            <p>Zato prelazak između ugrađenog 5-inčnog DSI ekrana i TV-a nije samo „isti kabel na drugom mjestu”. Sustav mora odabrati pravi output, mode/resolution i eventualno scaling/orientation tako da EmulationStation i emulatori završe na željenom displayu.</p>
            <h3>zašto su dva moda bila korisna</h3>
            <p>Za mali ugrađeni ekran želiš konzistentnu rezoluciju, čitljiv frontend i ponašanje koje ne ovisi o tome je li TV spojen. Za TV želiš HDMI output i rezoluciju/timing koji odgovaraju vanjskom displayu. Ideja zasebnih DSI/HDMI konfiguracijskih modova zato je praktična: promijeniš boot/display konfiguraciju, reboot i uređaj se digne s pravilnim primarnim izlazom.</p>
            <h3>input latency i zašto je bitna baš kod retro igara</h3>
            <p>Od tipke do slike postoji cijeli lanac: kontroler šalje input, kernel ga obradi, emulator ga pročita, odradi emulirani frame, renderer nacrta sliku, compositor/display pipeline je preda panelu, a panel je tek onda fizički osvježi. Zato „igra radi 60 FPS” ne garantira automatski isti osjećaj kao originalna konzola; frame pacing, vsync, bluetooth/USB kontroler i display mogu dodati latenciju.</p>
            <h3>zašto 3D-printano kućište nije samo kozmetika</h3>
            <p>Kućište određuje mehaničku stabilnost DSI ribbon kabela, položaj portova, protok zraka oko Raspberry Pija, pristup SD kartici i konektorima te koliko je ekran zaštićen od torzije. Kod malog all-in-one uređaja raspored elektronike i mehanika postaju dio istog dizajna, a ne dvije odvojene stvari.</p>
            <div class="misconception"><strong>Česta zabuna:</strong> RetroPie nije operacijski sustav koji „pretvara Raspberry Pi u staru konzolu”. Raspberry Pi i dalje izvršava Linux/ARM kod; emulator softverski modelira originalni hardver, a RetroPie organizira cijeli stack oko toga.</div>
            <p class="deep-source"><a href="https://retropie.org.uk/" target="_blank" rel="noopener noreferrer">RetroPie ↗</a> · <a href="https://www.raspberrypi.com/documentation/computers/configuration.html" target="_blank" rel="noopener noreferrer">Raspberry Pi display configuration ↗</a> · <a href="https://www.raspberrypi.com/documentation/accessories/display.html" target="_blank" rel="noopener noreferrer">Raspberry Pi DSI display docs ↗</a></p>
        `;

        const sourceRow = body.querySelector(".deep-source");
        if (sourceRow) body.insertBefore(extra, sourceRow);
        else body.appendChild(extra);
    }

    function insertRobotDeepDive() {
        const robot = document.querySelectorAll(".project-deep")[2];
        const body = robot?.querySelector(".project-deep-body");
        if (!body || body.querySelector(".robot-extra")) return;

        const extra = document.createElement("div");
        extra.className = "robot-extra";
        extra.innerHTML = `
            <h3>mecanum: kako četiri kotača mogu napraviti bočno gibanje</h3>
            <p>Mecanum kotač ima valjčiće postavljene pod kutom, pa kontaktna sila svakog kotača nije usmjerena samo naprijed/natrag. Kombiniranjem smjerova vrtnje sva četiri kotača njihove se uzdužne i bočne komponente mogu zbrajati ili poništavati. Zato ista baza može ići naprijed, rotirati oko svoje osi ili napraviti gotovo čisti strafe bez zakretanja cijelog robota.</p>

            <pre class="project-diagram">naprijed:
FL →    FR →
RL →    RR →

strafe desno, pojednostavljeno:
FL →    FR ←
RL ←    RR →

rotacija u mjestu:
FL →    FR ←
RL →    RR ←</pre>

            <p>Oznake FL/FR/RL/RR znače front-left, front-right, rear-left i rear-right. Točan predznak ovisi o tome kako su kotači fizički orijentirani i kako je definiran pozitivan smjer motora, ali ideja je ista: svaki motor doprinosi translaciji i/ili rotaciji.</p>

            <h3>zašto isti PWM ne znači istu brzinu</h3>
            <p>Četiri nominalno ista DC motora nisu četiri savršeno jednaka sustava. Razlikuju se trenje u gearboxu, otpor namota, pritisak kotača, masa na pojedinom kutu robota, napon pod opterećenjem i stanje podloge. Zato otvorena petlja tipa „svima PWM 30” može dati četiri različite stvarne brzine.</p>
            <p>Hall encoderi daju povratnu informaciju o okretanju osovine/motora. Driver može iz brojanja impulsa procijeniti brzinu i prilagoditi izlaz kako bi se približio zadanoj vrijednosti. To je razlog zašto encoder feedback jako pomaže mecanum robotu: bočno gibanje posebno brzo pokaže i malu razliku između kotača.</p>

            <h3>AB encoder: ne govori samo koliko se nešto vrti</h3>
            <p>Dva kanala A i B daju kvadraturne impulse pomaknute u fazi. Brojanjem bridova dobiva se pomak, a redoslijed A/B omogućuje određivanje smjera vrtnje. Iz promjene broja impulsa kroz poznati vremenski interval može se procijeniti brzina.</p>

            <h3>IR polje i položaj crte</h3>
            <p>Osam IR kanala ne mora se tretirati samo kao osam boolean vrijednosti. Svakom kanalu možeš pridružiti položaj lijevo/desno od centra, a iz aktivnih senzora dobiti ponderirani položaj crte. Razlika između željenog centra i izmjerenog položaja postaje <strong>error</strong> za regulator.</p>

            <pre class="project-diagram">IR senzori:
[-3] [-2] [-1] [0] [0] [+1] [+2] [+3]
             │
             └── željeni centar

error = izmjereni položaj crte - centar</pre>

            <h3>PID: zašto sva tri člana postoje</h3>
            <p><strong>P — proportional</strong> daje korekciju proporcionalnu trenutačnoj pogrešci. Veći error znači jači odgovor. Ako je Kp premalen robot sporo reagira; ako je previsok lako oscilira preko crte.</p>
            <p><strong>I — integral</strong> akumulira pogrešku kroz vrijeme. Može ispraviti stalni mali bias — primjerice ako mehanička asimetrija stalno vuče robot na istu stranu. Mana je integral windup ako se akumulira dok sustav fizički ne može ispraviti error.</p>
            <p><strong>D — derivative</strong> gleda koliko se error brzo mijenja. Ako robot velikom brzinom ulazi prema crti, D može prigušiti korekciju prije nego P dio napravi veliki overshoot.</p>

            <div class="physics-equation">u(t) = Kp·e(t) + Ki∫e(t)dt + Kd·de(t)/dt</div>

            <p>U zadnjoj zabilježenoj konfiguraciji line-follow PID je bio približno <strong>Kp 0.26, Ki 0.02, Kd 0.18</strong>. Ti brojevi nemaju univerzalno značenje izvan ovog robota jer ovise o skali senzorske pogreške, loop periodu, motornoj komandi i mehanici.</p>

            <h3>zašto state machine ide iznad PID-a</h3>
            <p>PID je dobar dok problem glasi „slijedi kontinuiranu crtu”. Ali raskrižje, 90° zavoj, gubitak crte, prepreka ili puna poprečna linija nisu ista regulacijska situacija. Zato robot ima diskretna stanja poput <code>FOLLOW_LINE</code>, <code>TURN_L_90</code>, <code>TURN_R_90</code>, <code>SEARCH_LINE</code>, <code>STRAFE</code>, <code>FRONT_BUMP</code>, <code>BACK_BUMP</code> i <code>FULL_LINE_STOP</code>.</p>

            <pre class="project-diagram">senzori + uvjeti
       │
       ▼
 STATE MACHINE
       │
       ├── FOLLOW_LINE ── PID korekcija
       ├── TURN_90 ────── unaprijed definirani manevar
       ├── SEARCH_LINE ── traženje crte
       ├── STRAFE ─────── mecanum bočni vektor
       └── BUMP/STOP ─── sigurnosna reakcija</pre>

            <h3>zašto strafe ima preload i ramp</h3>
            <p>Idealni kinematički model pretpostavlja da kotač odmah proizvede željenu silu. Stvarni mecanum valjčići imaju trenje i zazor, motor ima inerciju, a gearbox backlash. Kratki preload i zatim ramp mogu pomoći da svi kotači „sjednu” u bočni režim prije nego se očekuje stabilna putanja.</p>

            <h3>I²C: više uređaja na istim dvjema signalnim linijama</h3>
            <p>Motor/encoder modul na adresi <code>0x34</code> i IR modul na <code>0x5D</code> mogu dijeliti SDA i SCL jer ih razlikuju 7-bitne adrese. Arduino Mega je master: šalje adresu uređaja, a samo odabrani slave odgovara. To štedi pinove i ožičenje, ali znači da bus mora imati ispravne pull-up otpornike i kompatibilne naponske razine.</p>

            <h3>power chain</h3>
            <pre class="project-diagram">Einhell baterija ~18 V
        │
        ▼
     buck converter
        │  reguliranih ~12 V
        ▼
  motorni power rail
        │
   ┌────┼────┬────┐
   ▼    ▼    ▼    ▼
  M1   M2   M3   M4

logika / Arduino / I²C moraju imati zajedničku referencu mase s driverom</pre>
            <p>Buck converter ne služi samo „da broj bude manji”. On aktivno regulira viši baterijski napon na napon prikladniji motorima. Pri ubrzanju i zastoju motora struja može snažno porasti, pa dimenzioniranje napajanja i drivera mora gledati vršne/stall uvjete, ne samo mirnu nominalnu potrošnju.</p>

            <div class="misconception"><strong>Dva pregorena drivera ne dokazuju jedan konkretan uzrok.</strong> Mogući stresovi uključuju velike struje pri zastoju/promjeni smjera, termičko opterećenje, regenerativne naponske špiceve ili naponske uvjete izvan onoga što driver dobro podnosi. Bez mjerenja napona, struje i temperature bilo bi nagađanje tvrditi koji je točno mehanizam bio kriv.</div>

            <p class="deep-source"><a href="https://docs.arduino.cc/hardware/mega-2560" target="_blank" rel="noopener noreferrer">Arduino Mega 2560 dokumentacija ↗</a> · <a href="https://en.wikipedia.org/wiki/Mecanum_wheel" target="_blank" rel="noopener noreferrer">Mecanum wheel – geometrija / povijest ↗</a> · <a href="https://en.wikipedia.org/wiki/PID_controller" target="_blank" rel="noopener noreferrer">PID controller ↗</a></p>
        `;

        const sourceRow = body.querySelector(".deep-source");
        if (sourceRow) body.insertBefore(extra, sourceRow);
        else body.appendChild(extra);
    }

    function ensureLightbox() {
        let lightbox = document.getElementById("project-lightbox");
        if (lightbox) return lightbox;

        lightbox = document.createElement("div");
        lightbox.id = "project-lightbox";
        lightbox.className = "image-lightbox hidden";
        lightbox.innerHTML = `
            <div class="image-lightbox-card">
                <button class="image-lightbox-close" type="button" aria-label="zatvori">x</button>
                <img id="project-lightbox-image" src="" alt="povećana projektna slika">
                <p class="image-lightbox-caption" id="project-lightbox-caption"></p>
                <p class="image-lightbox-hint">zatvara se samo na X</p>
            </div>
        `;

        document.body.appendChild(lightbox);
        lightbox.querySelector(".image-lightbox-close")?.addEventListener("click", () => {
            lightbox.classList.add("hidden");
        });

        return lightbox;
    }

    insertHomelabDeepDive();
    insertRetroDeepDive();
    insertRobotDeepDive();

    document.querySelectorAll(".project-zoom, .project-card img").forEach(image => {
        image.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const lightbox = ensureLightbox();
            const large = lightbox.querySelector("#project-lightbox-image");
            const caption = lightbox.querySelector("#project-lightbox-caption");
            if (!large || !caption) return;

            large.src = image.src;
            large.alt = image.alt || "projekt";
            caption.textContent = image.alt || "projekt";
            lightbox.classList.remove("hidden");
        });
    });

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = String(new Date().getFullYear());
    });
})();
