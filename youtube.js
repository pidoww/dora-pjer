(() => {
    "use strict";

    async function loadTitle(card) {
        const videoId = card.dataset.videoCard || "";
        const titleElement = card.querySelector("[data-video-title]");
        if (!titleElement || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const endpoints = [
            `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`,
            `https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint, { mode: "cors" });
                if (!response.ok) continue;
                const data = await response.json();
                if (typeof data.title === "string" && data.title.trim()) {
                    titleElement.textContent = data.title.trim();
                    return;
                }
            } catch {}
        }

        if (videoId === "iCHrMzWQnbE") {
            titleElement.textContent = "Dora Pjer Vlogs — prvi video";
        }
    }

    document.querySelectorAll("[data-video-card]").forEach(card => {
        loadTitle(card);
    });

    document.querySelectorAll("[data-video-id]").forEach(button => {
        button.addEventListener("click", () => {
            const videoId = button.dataset.videoId || "";
            const shell = button.closest(".video-player-shell");

            if (!shell || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;

            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.title = "Dora Pjer Vlogs video";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";

            shell.innerHTML = "";
            shell.appendChild(iframe);
        });
    });
})();
