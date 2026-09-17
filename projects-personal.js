(() => {
    "use strict";

    function replaceHtml(selector, from, to) {
        document.querySelectorAll(selector).forEach(node => {
            if (!node.innerHTML.includes(from)) return;
            node.innerHTML = node.innerHTML.replace(from, to);
        });
    }

    function closeAllProjects() {
        document.querySelectorAll("details.project-deep").forEach(details => {
            details.open = false;
            details.removeAttribute("open");
        });
    }

    function personalizeIntro() {
        const intro = document.querySelector("main > section.paper");
        const first = intro?.querySelector("p");
        if (first) {
            first.textContent = "Raspberry Pi, homelab, retro konzola, visoki napon, mreže i WorldSkills. Uglavnom stvari koje sam krenuo raditi jer mi je palo na pamet ‘ovo bi bilo fora’, a onda su završile s puno više kablova i posla nego što sam planirao.";
        }

        if (intro && !intro.querySelector(".project-open-hint")) {
            const hint = document.createElement("p");
            hint.className = "small-text project-open-hint";
            hint.textContent = "klikni na projekt ako te zanimaju detalji.";
            intro.appendChild(hint);
        }
    }

    function personalizeProjects() {
        replaceHtml(
            "details.project-deep p",
            "Srce homelaba je <strong>Raspberry Pi 5 s 8 GB RAM-a</strong>. Projekt je krenuo kao kućni NAS, ali se s vremenom pretvorio u mali self-hosted server: storage, SMB file sharing, udaljeni pristup preko VPN-a, HTTPS administracija, automatizacija i nadzor događaja.",
            "Homelab sam složio oko <strong>Raspberry Pi 5 s 8 GB RAM-a</strong>. Krenuo sam s idejom običnog kućnog NAS-a, a s vremenom sam mu dodao SMB shareove, udaljeni pristup preko VPN-a, HTTPS administraciju, automatizaciju i obavijesti."
        );

        replaceHtml(
            "details.project-deep p",
            "Na serveru se mogu vezati systemd servisi/timeri i OpenVPN hook skripte uz određene događaje: start/stop servisa, VPN connect/disconnect, periodične provjere ili druge administrativne događaje. Skripta zatim može zapisati event u log ili poslati e-mail kroz SMTP relay.",
            "Na serveru koristim systemd servise/timere i OpenVPN hook skripte za stvari poput starta i gašenja servisa, VPN spajanja, periodičnih provjera i drugih događaja. Kad se nešto od toga dogodi, skripta može zapisati event u log ili mi poslati mail preko SMTP-a."
        );

        replaceHtml(
            "details.project-deep p",
            "Retro konzola je mali samostalni emulacijski uređaj napravljen oko <strong>Raspberry Pi 4</strong>, RetroPie/Raspberry Pi OS-a i <strong>5-inčnog DSI ekrana</strong>.",
            "Retro konzolu sam složio oko <strong>Raspberry Pi 4</strong>, RetroPie/Raspberry Pi OS-a i <strong>5-inčnog DSI ekrana</strong>."
        );

        replaceHtml(
            "details.project-deep p",
            "Ovdje su zapravo dva odvojena rezultata koja vrijedi razlikovati. Na izlučnom natjecanju u Zadru tim <strong>Pjer Flajhar + Vito Radman</strong> osvojio je <strong>1. mjesto</strong> i izborio plasman na državno. Nekoliko mjeseci poslije na državnom WorldSkills Croatia 2026 isti je tim u disciplini Robotika osvojio <strong>2. mjesto — srebrnu medalju</strong>. Mentor je bio <strong>Marko Kovač</strong>.",
            "Na izlučnom natjecanju u Zadru sam s <strong>Vitom Radmanom</strong> osvojio <strong>1. mjesto</strong> i plasman na državno. Nekoliko mjeseci poslije sam s njim na državnom WorldSkills Croatia 2026 osvojio <strong>2. mjesto — srebrnu medalju</strong> u Robotici. Mentor mi je bio <strong>Marko Kovač</strong>."
        );

        replaceHtml(
            "details.project-deep p",
            "U zadnje zabilježenom setupu korišten je OpenVPN 2.6.x.",
            "Na svom setupu koristim OpenVPN 2.6.x."
        );
        replaceHtml(
            "details.project-deep p",
            "U ovom setupu DCO je bio <strong>off</strong>",
            "Kod mene je DCO <strong>off</strong>"
        );
        replaceHtml(
            "details.project-deep h3",
            "AES-CBC warning koji smo vidjeli",
            "AES-CBC warning koji sam dobio"
        );
        replaceHtml(
            "details.project-deep p",
            "U setupu su dva glavna storage diska: jedan oko 1.8 TB i drugi oko 916 GB, izloženi kao shareovi <strong>BLACK</strong> i <strong>BLUE</strong>.",
            "Imam dva glavna storage diska: jedan oko 1.8 TB i drugi oko 916 GB. Preko Sambe ih izlažem kao shareove <strong>BLACK</strong> i <strong>BLUE</strong>."
        );

        replaceHtml(
            "details.project-deep h3",
            "što nam govori iskra od približno 15 mm",
            "što mi govori iskra od približno 15 mm"
        );
        replaceHtml(
            "details.project-deep p",
            "U projektu smo vidjeli iskru reda <strong>15 mm</strong>.",
            "Na tom modulu sam dobio iskru reda <strong>15 mm</strong>."
        );
        replaceHtml(
            "details.project-deep p",
            "U starom testiranju HV impuls je mogao pobuditi malu neonku u ispitivaču i bez čvrstog galvanijskog kontakta.",
            "Kad sam testirao HV modul, impuls je mogao pobuditi malu neonku u ispitivaču i bez čvrstog galvanijskog kontakta."
        );
        replaceHtml(
            "details.project-deep .project-warning",
            "ovaj dio dokumentira stari projekt i fiziku, nije vodič",
            "ovdje opisujem svoj stari projekt i fiziku iza njega; ovo nije vodič"
        );

        replaceHtml(
            "details.project-deep p",
            "U zadnjoj zabilježenoj konfiguraciji line-follow PID je bio približno",
            "U zadnjoj verziji koju sam koristio line-follow PID je bio približno"
        );
        replaceHtml(
            "details.project-deep .misconception strong",
            "Dva pregorena drivera ne dokazuju jedan konkretan uzrok.",
            "To što su mi dva drivera pregorjela ne dokazuje jedan konkretan uzrok."
        );

        replaceHtml(
            "details.project-deep h3",
            "security model ovog setupa",
            "kako sam složio sigurnost ovog setupa"
        );
        replaceHtml(
            "details.project-deep .project-warning strong",
            "što ne ide u javni repo:",
            "što ne stavljam u javni repo:"
        );
        replaceHtml(
            "details.project-deep p",
            "Za administrativne obavijesti server koristi <strong>Disroot e-mail</strong>.",
            "Za administrativne obavijesti koristim <strong>Disroot e-mail</strong>."
        );
        replaceHtml(
            "details.project-deep p",
            "Adresa i login podaci nisu u javnom kodu.",
            "Adresu i login podatke ne držim u javnom kodu."
        );
    }

    personalizeIntro();
    personalizeProjects();
    closeAllProjects();
})();
