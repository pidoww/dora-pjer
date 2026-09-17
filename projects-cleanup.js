(() => {
    "use strict";

    function cleanProjectIntro() {
        const main = document.querySelector("main");
        const intro = main?.querySelector(":scope > section.paper");
        if (!intro) return;

        const warning = document.querySelector("header .tiny-warning");
        if (warning) warning.textContent = "hardver opet nije ostavljen na miru";

        const title = intro.querySelector("h2");
        if (title) title.textContent = "projekti koji su završili na stolu";

        const paragraphs = [...intro.querySelectorAll("p")];
        if (paragraphs[0]) {
            paragraphs[0].textContent = "Raspberry Pi, homelab, retro konzola, visoki napon, mreže i WorldSkills. Većina je krenula s ‘ovo bi bilo fora’ i onda završila s puno više kablova i posla nego što je bilo planirano.";
        }
        paragraphs.slice(1).forEach(p => p.remove());

        const marquee = document.querySelector(".marquee-ish span");
        if (marquee) marquee.textContent = "★ RASPBERRY PI ★ HOMELAB ★ RETRO ★ OPEN SOURCE ★ MREŽE ★ HV ★ PREVIŠE KABLOVA ★";
    }

    function renameDoraGameLink() {
        document.querySelectorAll('a[href$="snake.html"]').forEach(link => {
            if (link.textContent.trim() === "Dora vs dinosauri") {
                link.textContent = "Dora skuplja dinose";
            }
        });
    }

    function removeProjects() {
        document.querySelectorAll("details.project-deep").forEach(details => {
            const summary = details.querySelector("summary")?.textContent || "";
            if (summary.includes("Mecanum line follower")) {
                details.remove();
            }
        });
    }

    function naturalizeProjectCopy() {
        document.querySelectorAll("details.project-deep p, details.project-deep h3").forEach(node => {
            let html = node.innerHTML;

            html = html.replace(
                "Bitna odluka u dizajnu je da se ",
                "Kod mene se "
            );
            html = html.replace(
                "To je važna razlika u odnosu na običan web login: VPN ne štiti samo jednu stranicu nego stvara privatni mrežni put kroz koji mogu prolaziti različiti protokoli.",
                "Za razliku od običnog web logina, VPN ne štiti samo jednu stranicu. Napravi privatni mrežni put kroz koji mogu prolaziti različiti protokoli."
            );
            html = html.replace(
                "Obrambeni slojevi se zato nadopunjuju.",
                "Zato oba imaju smisla u istom setupu."
            );
            html = html.replace(
                "To daje jednostavan audit trail bez potrebe da stalno ručno gledaš server:",
                "Tako ne moram stalno ručno gledati server:"
            );
            html = html.replace(
                "Ideja nije bila samo pokrenuti emulator na Piju, nego složiti cijeli fizički uređaj:",
                "Htio sam složiti cijeli uređaj, ne samo pokrenuti emulator na Piju:"
            );
            html = html.replace(
                "Zato je smislen pristup imati dva poznata config stanja",
                "Najjednostavnije je imati dva poznata config stanja"
            );
            html = html.replace(
                "zašto je projekt više od „instalirao sam RetroPie”",
                "što je sve trebalo složiti"
            );
            html = html.replace(
                "homelab nije „siguran zato što je Raspberry Pi”. siguran je samo onoliko koliko su dobri mrežni dizajn, konfiguracija, credentiali, updateovi i backup strategija.",
                "Raspberry Pi sam po sebi ne čini setup sigurnim. bitni su konfiguracija, updateovi, credentiali i backup."
            );
            html = html.replace(
                "Tako se na stranici ne miješaju dva različita plasmana.",
                "Izlučno i državno zato nisu isti rezultat: prvo mjesto na izlučnom, srebro na državnom."
            );

            if (html !== node.innerHTML) node.innerHTML = html;
        });

        const footerLead = document.querySelector("footer p:first-child");
        if (footerLead?.textContent.includes("PROJECT DUMP")) {
            footerLead.textContent = "PROJECT DUMP · previše kablova, premalo mjesta na stolu.";
        }
    }

    function addHomelabMailAndDns() {
        const homelab = document.querySelector("details.project-deep");
        const body = homelab?.querySelector(".project-deep-body");
        if (!body || body.querySelector(".homelab-mail-dns")) return;

        const block = document.createElement("div");
        block.className = "homelab-mail-dns";
        block.innerHTML = `
            <h3>DuckDNS: isto ime i kad ISP promijeni javnu IP adresu</h3>
            <p>Kućna veza nema nužno stalnu javnu IP adresu. Kad je ISP promijeni, VPN profil koji cilja staru adresu više ne zna gdje je kućni router. <strong>DuckDNS</strong> daje stalno DNS ime, a updater mu povremeno javi koja je trenutačna javna IP adresa.</p>
            <pre class="project-diagram">ISP promijeni javnu IP
        │
        ▼
Raspberry Pi / DDNS updater
        │  HTTPS update prema DuckDNS-u
        ▼
DuckDNS zapis = nova javna IP
        │
        ▼
VPN klijent koristi isto DNS ime
        │
        ▼
router → OpenVPN endpoint</pre>
            <p>DuckDNS ne otvara portove i ne zamjenjuje VPN ili firewall. Radi samo jednu stvar: stabilno ime pokazuje na trenutačnu javnu IP adresu.</p>
            <div class="project-warning"><strong>što ne ide u javni repo:</strong> stvarni hostname, javna IP adresa, VPN port i DuckDNS token. Token je credential i nema što raditi u javnom HTML-u, screenshotu ili logu.</div>

            <h3>Disroot mail za serverske obavijesti</h3>
            <p>Za administrativne obavijesti server koristi <strong>Disroot e-mail</strong>. Skripta ili servis složi poruku i preda je Disrootovu SMTP serveru, umjesto da Raspberry Pi pokušava sam biti javni mail-server.</p>
            <pre class="project-diagram">systemd / VPN hook / skripta
        │
        ▼
mail poruka
        │
        ▼
Disroot SMTP preko TLS-a
        │
        ▼
inbox / administrativna obavijest</pre>
            <p>Adresa i login podaci nisu u javnom kodu. Ako skripti treba credential, drži se odvojeno od repozitorija i datoteka dobije samo dozvole koje su joj potrebne.</p>

            <h3>kako se sve to spoji</h3>
            <p><strong>DuckDNS</strong> vodi VPN klijent do kućne mreže i nakon promjene IP adrese. <strong>OpenVPN</strong> daje privatni ulaz. <strong>OMV i Samba</strong> ostaju iza njega, a <strong>Disroot mail</strong> služi da server pošalje obavijest prema van bez otvaranja još jednog dolaznog servisa.</p>

            <p class="deep-source"><a href="https://www.duckdns.org/why.jsp" target="_blank" rel="noopener noreferrer">DuckDNS – zašto DDNS ↗</a> · <a href="https://www.duckdns.org/spec.jsp" target="_blank" rel="noopener noreferrer">DuckDNS update API ↗</a> · <a href="https://disroot.org/" target="_blank" rel="noopener noreferrer">Disroot ↗</a></p>
        `;

        const source = body.querySelector(".deep-source");
        if (source) body.insertBefore(block, source);
        else body.appendChild(block);
    }

    cleanProjectIntro();
    renameDoraGameLink();
    addHomelabMailAndDns();
    removeProjects();
    naturalizeProjectCopy();
})();
