(() => {
    "use strict";

    const path = location.pathname.toLowerCase();
    const onChypsiPage = path.endsWith("/chipsy.html") || path.endsWith("chipsy.html");
    let rageClicks = 0;

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

    function clearRage(image) {
        if (!(image instanceof HTMLImageElement)) return;
        image.style.filter = "";
        image.style.boxShadow = "";
        image.style.transition = "filter 180ms ease, box-shadow 180ms ease";
    }

    function applyRage(image) {
        if (!isChypsiImage(image)) return;

        const progress = Math.min(rageClicks, 30) / 30;
        image.style.filter = rageClicks > 0 ? rageFilter(rageClicks) : "";
        image.style.transition = "filter 180ms ease, box-shadow 180ms ease";
        image.style.boxShadow = progress > 0.65
            ? `0 0 ${Math.round(8 + progress * 18)}px rgba(180, 0, 0, ${Math.min(0.75, progress).toFixed(2)})`
            : "";
    }

    function resetRage() {
        rageClicks = 0;
        document.querySelectorAll("img").forEach(image => {
            if (isChypsiImage(image)) clearRage(image);
        });

        const lightboxImage = document.getElementById("image-lightbox-image");
        if (lightboxImage) clearRage(lightboxImage);
    }

    document.addEventListener("click", event => {
        const image = event.target instanceof HTMLImageElement ? event.target : null;
        if (!image || !isChypsiImage(image)) return;

        const isLightboxImage = image.id === "image-lightbox-image";

        if (!onChypsiPage && !isLightboxImage) {
            resetRage();
            window.setTimeout(() => {
                const lightboxImage = document.getElementById("image-lightbox-image");
                if (lightboxImage) clearRage(lightboxImage);
            }, 0);
            return;
        }

        rageClicks = Math.min(rageClicks + 1, 30);
        applyRage(image);

        window.setTimeout(() => {
            const lightboxImage = document.getElementById("image-lightbox-image");
            if (lightboxImage && isChypsiImage(lightboxImage)) applyRage(lightboxImage);
        }, 0);
    }, true);

    const watchLightbox = () => {
        const lightbox = document.getElementById("image-lightbox");
        if (!lightbox || lightbox.dataset.rageResetReady) return;

        lightbox.dataset.rageResetReady = "1";
        const observer = new MutationObserver(() => {
            if (lightbox.classList.contains("hidden")) resetRage();
        });
        observer.observe(lightbox, { attributes: true, attributeFilter: ["class"] });
    };

    const bodyObserver = new MutationObserver(watchLightbox);
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    watchLightbox();
    resetRage();
})();
