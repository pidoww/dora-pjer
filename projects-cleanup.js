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
})();
