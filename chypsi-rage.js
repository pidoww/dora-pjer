(() => {
    "use strict";

    const STORAGE_KEY = "chypsiRageClicks";
    let rageClicks = Number(sessionStorage.getItem(STORAGE_KEY) || "0");

    function isChypsiImage(image) {
        if (!(image instanceof HTMLImageElement)) return false;

        const src = decodeURIComponent(image.getAttribute("src") || "").toLowerCase();
        const alt = (image.getAttribute("alt") || "").toLowerCase();

        return (
            image.id === "chipsy-lab-image" ||
            image.classList.contains("chypsi-photo") ||
            image.classList.contains("chipsy-photo") ||
            src.includes("chipsi slika") ||
            src.endsWith("img2.jpg") ||
            src.endsWith("img3.jpg") ||
            alt.includes("chypsi") ||
            alt.includes("chipsy")
        );
    }

    function rageFilter(clicks) {
        const progress = Math.min(clicks, 30) / 30;
        const sepia = (progress * 0.92).toFixed(2);
        const saturation = (1 + progress * 4.8).toFixed(2);
        const hue = Math.round(-32 * progress);
        const contrast = (1 + progress * 0.38).toFixed(2);
        const brightness = (1 - progress * 0.06).toFixed(2);

        return `sepia(${sepia}) saturate(${saturation}) hue-rotate(${hue}deg) contrast(${contrast}) brightness(${brightness})`;
    }

    function applyRage(image) {
        if (!isChypsiImage(image)) return;

        const progress = Math.min(rageClicks, 30) / 30;
        image.style.filter = rageFilter(rageClicks);
        image.style.transition = "filter 180ms ease, box-shadow 180ms ease";
        image.style.boxShadow = progress > 0.65
            ? `0 0 ${Math.round(8 + progress * 18)}px rgba(180, 0, 0, ${Math.min(0.75, progress).toFixed(2)})`
            : "";
    }

    function applyToAllChypsi() {
        document.querySelectorAll("img").forEach(image => {
            if (isChypsiImage(image)) applyRage(image);
        });
    }

    applyToAllChypsi();

    document.addEventListener("click", event => {
        const image = event.target instanceof HTMLImageElement ? event.target : null;
        if (!image || !isChypsiImage(image)) return;

        rageClicks = Math.min(rageClicks + 1, 30);
        sessionStorage.setItem(STORAGE_KEY, String(rageClicks));
        applyRage(image);

        window.setTimeout(() => {
            const lightboxImage = document.getElementById("image-lightbox-image");
            if (lightboxImage && isChypsiImage(lightboxImage)) applyRage(lightboxImage);
            applyToAllChypsi();
        }, 0);
    }, true);
})();
