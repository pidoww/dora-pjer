(() => {
    "use strict";

    document.querySelectorAll("details.project-deep > summary").forEach(summary => {
        summary.textContent = summary.textContent.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "").trim();
    });

    const intro = document.querySelector("main > section.paper");
    const introText = intro?.querySelector("p");
    if (introText) {
        introText.textContent = "Raspberry Pi, homelab, retro konzola, visoki napon, mreže i WorldSkills. Uglavnom stvari koje sam krenuo raditi jer mi je palo na pamet ‘ovo bi bilo fora’, a onda su završile s puno više konfiguracije, testiranja i popravljanja nego što sam planirao.";
    }

    const marquee = document.querySelector(".marquee-ish span");
    if (marquee) {
        marquee.textContent = "★ RASPBERRY PI ★ HOMELAB ★ RETRO ★ OPEN SOURCE ★ MREŽE ★ HV ★ PREVIŠE DEBUGGINGA ★";
    }

    const footerLead = document.querySelector("footer p:first-child");
    if (footerLead) {
        footerLead.textContent = "PROJECT DUMP · više testiranja nego što je bilo u planu.";
    }
})();
