(() => {
    "use strict";

    function insertHomelabDeepDive() {
        const homelab = document.querySelector(".project-deep");
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
        if (sourceRow) {
            body.insertBefore(extra, sourceRow);
        } else {
            body.appendChild(extra);
        }
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
