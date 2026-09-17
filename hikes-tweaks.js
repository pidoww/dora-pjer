(() => {
    "use strict";

    const caption = document.getElementById("ankle-caption");
    if (!caption) return;

    const correctCaption = "fotka s hikea na kojem je Dora kasnije ozlijedila gležanj";
    const outdatedCaption = "par trenutaka prije neočekivanog završetka hika";

    const keepCopyCorrect = () => {
        if (caption.textContent.trim() === outdatedCaption) {
            caption.textContent = correctCaption;
        }
    };

    new MutationObserver(keepCopyCorrect).observe(caption, {
        childList: true,
        characterData: true,
        subtree: true
    });
})();
