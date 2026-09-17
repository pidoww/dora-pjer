(() => {
    "use strict";

    function loadScript(src, onload) {
        const script = document.createElement("script");
        script.src = src;
        if (onload) script.addEventListener("load", onload, { once: true });
        document.head.appendChild(script);
    }

    loadScript("/science-core.js", () => {
        loadScript("/physics-extra.js", () => {
            loadScript("/anthro-extra.js");
        });
    });
})();
