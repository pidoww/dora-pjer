(() => {
    "use strict";

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
