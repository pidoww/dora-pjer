(() => {
  "use strict";

  const CONFIG = {
    endpoint:
      "https://kkvdaedxequoqfyyhavp.supabase.co/functions/v1/track-visit",

    heartbeatMs:
      30000,
  };

  let sessionId =
    createSessionId();

  let maxScroll = 0;

  let heartbeat = null;

  let visitStarted = false;

  let visitStarting = false;

  let endSent = false;

  /* =========================================================
     GENERAL SITE FUNCTIONS
     ========================================================= */

  function setupExternalLinks() {
    document
      .querySelectorAll(
        'a[href^="http"]',
      )
      .forEach(
        (link) => {
          try {
            const url =
              new URL(
                link.href,
                location.href,
              );

            if (
              url.hostname !==
              location.hostname
            ) {
              link.rel =
                "noopener noreferrer";
            }
          } catch {
            // Ignore invalid URLs.
          }
        },
      );
  }

  function setupLazyImages() {
    document
      .querySelectorAll(
        "img:not([loading])",
      )
      .forEach(
        (img) => {
          img.loading =
            "lazy";

          img.decoding =
            "async";
        },
      );
  }

  function setupSmoothScroll() {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (
      reducedMotion
    ) {
      return;
    }

    document.addEventListener(
      "click",
      (event) => {
        const target =
          event.target;

        if (
          !(
            target instanceof
            Element
          )
        ) {
          return;
        }

        const link =
          target.closest(
            'a[href^="#"]',
          );

        if (!link) {
          return;
        }

        const selector =
          link.getAttribute(
            "href",
          );

        if (
          !selector ||
          selector === "#"
        ) {
          return;
        }

        let destination = null;

        try {
          destination =
            document.querySelector(
              selector,
            );
        } catch {
          return;
        }

        if (
          !destination
        ) {
          return;
        }

        event.preventDefault();

        destination
          .scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
      },
    );
  }

  function setupCurrentYear() {
    const year =
      String(
        new Date()
          .getFullYear(),
      );

    document
      .querySelectorAll(
        "[data-current-year]",
      )
      .forEach(
        (element) => {
          element.textContent =
            year;
        },
      );
  }

  /* =========================================================
     SESSION
     ========================================================= */

  function createSessionId() {
    if (
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
    ) {
      return crypto.randomUUID();
    }

    const bytes =
      new Uint8Array(16);

    crypto.getRandomValues(
      bytes,
    );

    /*
     * UUID v4
     */
    bytes[6] =
      (
        bytes[6] &
        0x0f
      ) |
      0x40;

    bytes[8] =
      (
        bytes[8] &
        0x3f
      ) |
      0x80;

    const hex =
      Array.from(
        bytes,
      )
        .map(
          (byte) =>
            byte
              .toString(16)
              .padStart(
                2,
                "0",
              ),
        );

    return [
      hex
        .slice(
          0,
          4,
        )
        .join(""),

      hex
        .slice(
          4,
          6,
        )
        .join(""),

      hex
        .slice(
          6,
          8,
        )
        .join(""),

      hex
        .slice(
          8,
          10,
        )
        .join(""),

      hex
        .slice(
          10,
          16,
        )
        .join(""),
    ].join("-");
  }

  function resetSession() {
    stopHeartbeat();

    sessionId =
      createSessionId();

    maxScroll = 0;

    visitStarted =
      false;

    visitStarting =
      false;

    endSent =
      false;
  }

  /* =========================================================
     DEVICE / BROWSER INFORMATION
     ========================================================= */

  function detectBrowser() {
    const ua =
      navigator.userAgent ||
      "";

    const brands =
      navigator
        .userAgentData
        ?.brands;

    if (
      Array.isArray(
        brands,
      )
    ) {
      const names =
        brands.map(
          (item) =>
            String(
              item.brand ||
                "",
            ).toLowerCase(),
        );

      if (
        names.some(
          (name) =>
            name.includes(
              "brave",
            ),
        )
      ) {
        return "Brave";
      }
    }

    if (
      ua.includes(
        "Edg/",
      )
    ) {
      return "Microsoft Edge";
    }

    if (
      ua.includes(
        "OPR/",
      ) ||
      ua.includes(
        "Opera",
      )
    ) {
      return "Opera";
    }

    if (
      ua.includes(
        "Firefox/",
      )
    ) {
      return "Firefox";
    }

    if (
      ua.includes(
        "Chrome/",
      ) &&
      !ua.includes(
        "Edg/",
      )
    ) {
      return "Chrome";
    }

    if (
      ua.includes(
        "Safari/",
      ) &&
      !ua.includes(
        "Chrome/",
      )
    ) {
      return "Safari";
    }

    return "Unknown";
  }

  function detectOS() {
    const ua =
      navigator.userAgent ||
      "";

    const platform =
      navigator.platform ||
      "";

    if (
      /Windows/i.test(
        ua,
      )
    ) {
      return "Windows";
    }

    if (
      /Android/i.test(
        ua,
      )
    ) {
      return "Android";
    }

    if (
      /iPhone|iPad|iPod/i.test(
        ua,
      )
    ) {
      return "iOS";
    }

    if (
      /Mac/i.test(
        platform,
      ) ||
      /Mac OS/i.test(
        ua,
      )
    ) {
      return "macOS";
    }

    if (
      /Linux/i.test(
        platform,
      ) ||
      /Linux/i.test(
        ua,
      )
    ) {
      return "Linux";
    }

    return "Unknown";
  }

  function detectMobile() {
    const uaData =
      navigator
        .userAgentData;

    if (
      uaData &&
      typeof uaData.mobile ===
        "boolean"
    ) {
      return uaData.mobile;
    }

    return /Android|iPhone|iPad|iPod|Mobile/i
      .test(
        navigator.userAgent,
      );
  }

  function getTimezone() {
    try {
      return (
        Intl
          .DateTimeFormat()
          .resolvedOptions()
          .timeZone ||
        null
      );
    } catch {
      return null;
    }
  }

  function getOrientation() {
    try {
      return (
        screen
          .orientation
          ?.type ||
        null
      );
    } catch {
      return null;
    }
  }

  function getConnection() {
    return (
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection ||
      null
    );
  }

  /* =========================================================
     SCROLL
     ========================================================= */

  function updateScroll() {
    const root =
      document.documentElement;

    const body =
      document.body;

    const scrollTop =
      window.scrollY ||
      root.scrollTop ||
      body?.scrollTop ||
      0;

    const documentHeight =
      Math.max(
        root.scrollHeight ||
          0,

        body?.scrollHeight ||
          0,

        root.offsetHeight ||
          0,

        body?.offsetHeight ||
          0,
      );

    const viewportHeight =
      window.innerHeight ||
      0;

    const scrollable =
      documentHeight -
      viewportHeight;

    let percent = 100;

    if (
      scrollable > 0
    ) {
      percent =
        (
          scrollTop /
          scrollable
        ) *
        100;
    }

    percent =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            percent,
          ),
        ),
      );

    if (
      percent >
      maxScroll
    ) {
      maxScroll =
        percent;
    }
  }

  /* =========================================================
     PAYLOADS
     ========================================================= */

  function buildVisit() {
    const connection =
      getConnection();

    const uaData =
      navigator
        .userAgentData ||
      null;

    return {
      event_type:
        "visit",

      session_id:
        sessionId,

      page:
        location.href,

      page_title:
        document.title ||
        null,

      hostname:
        location.hostname,

      pathname:
        location.pathname,

      referrer:
        document.referrer ||
        "direct",

      browser:
        detectBrowser(),

      os:
        detectOS(),

      platform:
        uaData?.platform ||
        navigator.platform ||
        null,

      vendor:
        navigator.vendor ||
        null,

      mobile:
        detectMobile(),

      language:
        navigator.language ||
        null,

      timezone:
        getTimezone(),

      hardware_concurrency:
        typeof navigator
            .hardwareConcurrency ===
          "number"
          ? navigator
              .hardwareConcurrency
          : null,

      device_memory:
        typeof navigator
            .deviceMemory ===
          "number"
          ? navigator
              .deviceMemory
          : null,

      max_touch_points:
        typeof navigator
            .maxTouchPoints ===
          "number"
          ? navigator
              .maxTouchPoints
          : 0,

      touch_support:
        (
          navigator
            .maxTouchPoints >
          0
        ) ||
        (
          "ontouchstart" in
          window
        ),

      cookies_enabled:
        navigator
          .cookieEnabled,

      do_not_track:
        navigator
          .doNotTrack ||
        null,

      screen_width:
        screen.width ||
        null,

      screen_height:
        screen.height ||
        null,

      viewport_width:
        innerWidth ||
        null,

      viewport_height:
        innerHeight ||
        null,

      device_pixel_ratio:
        devicePixelRatio ||
        1,

      color_depth:
        screen.colorDepth ||
        null,

      pixel_depth:
        screen.pixelDepth ||
        null,

      screen_orientation:
        getOrientation(),

      online_status:
        navigator.onLine,

      connection_type:
        connection?.type ||
        null,

      connection_effective_type:
        connection
          ?.effectiveType ||
        null,

      connection_downlink:
        typeof connection
            ?.downlink ===
          "number"
          ? connection
              .downlink
          : null,

      connection_rtt:
        typeof connection
            ?.rtt ===
          "number"
          ? connection.rtt
          : null,

      connection_save_data:
        typeof connection
            ?.saveData ===
          "boolean"
          ? connection
              .saveData
          : null,

      ua_brands:
        Array.isArray(
          uaData?.brands,
        )
          ? uaData.brands
          : null,

      ua_mobile:
        typeof uaData
            ?.mobile ===
          "boolean"
          ? uaData.mobile
          : null,

      ua_platform:
        uaData?.platform ||
        null,
    };
  }

  function buildUpdate() {
    updateScroll();

    return {
      event_type:
        "update",

      session_id:
        sessionId,

      max_scroll_percent:
        maxScroll,
    };
  }

  function buildEnd() {
    updateScroll();

    return {
      event_type:
        "end",

      session_id:
        sessionId,

      max_scroll_percent:
        maxScroll,
    };
  }

  /* =========================================================
     NETWORK
     ========================================================= */

  async function send(
    data,
  ) {
    try {
      const response =
        await fetch(
          CONFIG.endpoint,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "text/plain;charset=UTF-8",
            },

            body:
              JSON.stringify(
                data,
              ),

            keepalive:
              true,

            credentials:
              "omit",

            cache:
              "no-store",

            referrerPolicy:
              "no-referrer",
          },
        );

      return response.ok;
    } catch {
      return false;
    }
  }

  function sendBeaconPayload(
    data,
  ) {
    const payload =
      JSON.stringify(
        data,
      );

    if (
      typeof navigator
          .sendBeacon ===
        "function"
    ) {
      try {
        const blob =
          new Blob(
            [
              payload,
            ],
            {
              type:
                "text/plain;charset=UTF-8",
            },
          );

        const accepted =
          navigator
            .sendBeacon(
              CONFIG.endpoint,
              blob,
            );

        if (
          accepted
        ) {
          return true;
        }
      } catch {
        // Use fetch fallback.
      }
    }

    try {
      fetch(
        CONFIG.endpoint,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=UTF-8",
          },

          body:
            payload,

          keepalive:
            true,

          credentials:
            "omit",

          cache:
            "no-store",

          referrerPolicy:
            "no-referrer",
        },
      );

      return true;
    } catch {
      return false;
    }
  }

  /* =========================================================
     HEARTBEAT
     ========================================================= */

  function stopHeartbeat() {
    if (
      heartbeat !==
      null
    ) {
      window.clearInterval(
        heartbeat,
      );

      heartbeat =
        null;
    }
  }

  function startHeartbeat() {
    if (
      heartbeat !==
      null
    ) {
      return;
    }

    heartbeat =
      window.setInterval(
        () => {
          if (
            !visitStarted ||
            endSent
          ) {
            return;
          }

          if (
            document
              .visibilityState !==
            "visible"
          ) {
            return;
          }

          void send(
            buildUpdate(),
          );
        },
        CONFIG.heartbeatMs,
      );
  }

  /* =========================================================
     VISIT START
     ========================================================= */

  async function startVisit() {
    if (
      visitStarted ||
      visitStarting ||
      endSent
    ) {
      return;
    }

    visitStarting =
      true;

    updateScroll();

    const success =
      await send(
        buildVisit(),
      );

    visitStarting =
      false;

    if (
      !success
    ) {
      return;
    }

    visitStarted =
      true;

    startHeartbeat();
  }

  /* =========================================================
     VISIBILITY UPDATE
     ========================================================= */

  function sendVisibilityUpdate() {
    if (
      !visitStarted ||
      endSent
    ) {
      return;
    }

    sendBeaconPayload(
      buildUpdate(),
    );
  }

  /* =========================================================
     VISIT END
     ========================================================= */

  function endVisit() {
    if (
      !visitStarted ||
      endSent
    ) {
      return;
    }

    endSent =
      true;

    stopHeartbeat();

    sendBeaconPayload(
      buildEnd(),
    );
  }

  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    setupExternalLinks();

    setupLazyImages();

    setupSmoothScroll();

    setupCurrentYear();

    updateScroll();

    void startVisit();
  }

  /* =========================================================
     EVENT LISTENERS
     ========================================================= */

  window.addEventListener(
    "scroll",
    updateScroll,
    {
      passive:
        true,
    },
  );

  window.addEventListener(
    "resize",
    updateScroll,
    {
      passive:
        true,
    },
  );

  window.addEventListener(
    "load",
    updateScroll,
    {
      once:
        true,
    },
  );

  /*
   * Kada korisnik samo prebaci tab,
   * minimizira browser ili zaključa mobitel,
   * NE završavamo session.
   *
   * Samo šaljemo zadnje stanje.
   */
  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document
          .visibilityState ===
        "hidden"
      ) {
        sendVisibilityUpdate();
      }
    },
  );

  /*
   * pagehide se koristi za stvarni odlazak
   * sa stranice / zatvaranje / reload.
   */
  window.addEventListener(
    "pagehide",
    () => {
      endVisit();
    },
  );

  /*
   * Ako browser vrati istu stranicu iz
   * back-forward cachea, tretiramo povratak
   * kao novi posjet.
   */
  window.addEventListener(
    "pageshow",
    (event) => {
      if (
        event.persisted
      ) {
        resetSession();

        updateScroll();

        void startVisit();
      }
    },
  );

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true,
      },
    );
  } else {
    init();
  }
})();
