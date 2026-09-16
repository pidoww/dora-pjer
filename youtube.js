(() => {
    "use strict";

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
