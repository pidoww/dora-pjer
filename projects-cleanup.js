(() => {
    "use strict";

    function cleanProjectIntro() {
        const main = document.querySelector("main");
        const intro = main?.querySelector(":scope > section.paper");
        if (!intro) return;

        const title = intro.querySelector("h2");
        if (title) title.textContent = "projekti i stvari koje su završile na stolu";

        const paragraphs = [...intro.querySelectorAll("p")];
        if (paragraphs[0]) {
            paragraphs[0].textContent = "Raspberry Pi, homelab, retro konzola, visoki napon, mreže i WorldSkills. Uglavnom stvari koje su krenule iz ideje ‘ovo bi bilo fora’ i onda postale puno veći projekt nego što je bilo planirano.";
        }
        paragraphs.slice(1).forEach(p => p.remove());

        const marquee = document.querySelector(".marquee-ish span");
        if (marquee) marquee.textContent = "★ RASPBERRY PI ★ HOMELAB ★ RETRO ★ OPEN SOURCE ★ MREŽE ★ HV ★ PREVIŠE KABLOVA ★";
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
            <h3>DuckDNS: isto ime čak i kad ISP promijeni javnu IP adresu</h3>
            <p>Kućna internet veza nema nužno stalnu javnu IP adresu. Ako ISP promijeni adresu, stari bookmark ili VPN profil koji cilja direktno na IP više ne bi znao gdje je kućni router. <strong>DuckDNS</strong> rješava baš taj problem: daje DNS ime, a mali updater periodično javi DuckDNS-u koja je trenutačna javna IP adresa.</p>
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
            <p>DuckDNS <strong>ne otvara portove</strong>, ne zaobilazi firewall i nije zamjena za VPN. On samo prevodi stabilno ime u trenutačnu IP adresu. Router i dalje odlučuje koji je promet dopušten i kamo se prosljeđuje.</p>
            <div class="project-warning"><strong>namjerno nije javno:</strong> stvarni DuckDNS hostname, trenutačna javna IP adresa, VPN port i DuckDNS token nisu navedeni na ovoj stranici. Token je credential i ne pripada u javni GitHub repo, HTML, screenshot ili log koji se objavljuje.</div>

            <h3>Disroot mail za serverske obavijesti</h3>
            <p>Server koristi <strong>Disroot e-mail</strong> za slanje administrativnih obavijesti — primjerice kada skripta ili servis želi poslati event/log na mail. To je praktično jer server ne mora sam glumiti javni mail-server; autentificira se prema SMTP servisu i preda mu poruku za slanje.</p>
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
            <p>Na stranici nema e-mail adrese ni credentiala. Isto vrijedi i za konfiguraciju servera: lozinka ili drugi mail credential ne bi trebao biti hardkodiran u javnom repozitoriju. Ako skripta treba credential, drži se izvan javnog koda i datoteka treba imati minimalne dozvole.</p>

            <h3>zašto ova kombinacija ima smisla</h3>
            <p><strong>DuckDNS</strong> rješava pronalazak kućne mreže izvana. <strong>OpenVPN</strong> rješava siguran privatni ulaz. <strong>OMV/Samba</strong> ostaju iza tog ulaza. <strong>Disroot mail</strong> ide u drugom smjeru: server može poslati obavijest van bez izlaganja dodatnog inbound servisa.</p>

            <p class="deep-source"><a href="https://www.duckdns.org/why.jsp" target="_blank" rel="noopener noreferrer">DuckDNS – zašto DDNS ↗</a> · <a href="https://www.duckdns.org/spec.jsp" target="_blank" rel="noopener noreferrer">DuckDNS update API ↗</a> · <a href="https://disroot.org/" target="_blank" rel="noopener noreferrer">Disroot ↗</a></p>
        `;

        const source = body.querySelector(".deep-source");
        if (source) body.insertBefore(block, source);
        else body.appendChild(block);
    }

    cleanProjectIntro();
    addHomelabMailAndDns();
    removeProjects();
})();
