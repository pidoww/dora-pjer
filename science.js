(() => {
    "use strict";

    const cache = new Map();

    async function fetchSummary(title) {
        if (cache.has(title)) return cache.get(title);

        const promise = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`, {
            headers: { "Accept": "application/json" }
        }).then(async response => {
            if (!response.ok) throw new Error(`Wikipedia ${response.status}`);
            return response.json();
        });

        cache.set(title, promise);
        return promise;
    }

    async function hydrate(card) {
        if (card.dataset.loaded === "1") return;
        card.dataset.loaded = "1";

        const title = card.dataset.wikiTitle || "";
        const photoSlot = card.querySelector(".scientist-photo");
        const link = card.querySelector(".scientist-wiki-link");
        if (!title || !photoSlot) return;

        try {
            const data = await fetchSummary(title);
            const imageUrl = data.thumbnail?.source || data.originalimage?.source || "";

            if (imageUrl) {
                const img = document.createElement("img");
                img.src = imageUrl;
                img.alt = title;
                img.loading = "lazy";
                img.referrerPolicy = "no-referrer";
                photoSlot.replaceChildren(img);
            } else {
                photoSlot.textContent = title.split(" ").map(part => part[0] || "").join("").slice(0, 3);
            }

            if (link) {
                link.href = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
            }
        } catch {
            photoSlot.textContent = title.split(" ").map(part => part[0] || "").join("").slice(0, 3);
            if (link) {
                link.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
            }
        }
    }

    const cards = [...document.querySelectorAll("[data-wiki-title]")];

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                hydrate(entry.target);
            });
        }, { rootMargin: "500px 0px" });

        cards.forEach(card => observer.observe(card));
    } else {
        cards.forEach(hydrate);
    }

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = String(new Date().getFullYear());
    });
})();
