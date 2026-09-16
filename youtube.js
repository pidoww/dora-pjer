(() => {
    "use strict";

    const USER_UPLOADS = "Dora_Pjer_Vlogs";

    document.querySelectorAll("[data-video-index]").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.videoIndex || 0);
            const shell = button.closest(".video-player-shell");

            if (!shell) return;

            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed?listType=user_uploads&list=${encodeURIComponent(USER_UPLOADS)}&index=${index}&autoplay=1&rel=0`;
            iframe.title = `Dora Pjer Vlogs video ${index + 1}`;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";

            shell.innerHTML = "";
            shell.appendChild(iframe);
        });
    });
})();
