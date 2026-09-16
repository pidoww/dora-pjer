(() => {
  "use strict";

  const CONFIG = {
    endpoint:
      "https://kkvdaedxequoqfyyhavp.supabase.co/functions/v1/track-visit",
  };

  let sessionId = createSessionId();
  let maxScroll = 0;

  let visitStarted = false;
  let visitStarting = false;

  /*
   * Je li za trenutni session pokrenut pending_end.
   *
   * Ovo NE znači da je unload beacon već poslan.
   */
  let pendingEndDispatched = false;
  let pendingEndPromise = null;

  /*
   * Posebno pratimo unload beacon.
   *
   * Ovo je bitno jer visibilitychange može prvo poslati
   * obični fetch, ali pagehide i dalje mora imati pravo
   * poslati svoj pouzdani beacon fallback.
   */
  let unloadBeaconSent = false;

  let resumeRunning = false;

  /* =========================================================
     SITE
     ========================================================= */

  function setupExternalLinks() {
    document
      .querySelectorAll('a[href^="http"]')
      .forEach((link) => {
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
        } catch {}
      });
  }

  function setupLazyImages() {
    document
      .querySelectorAll(
        "img:not([loading])",
      )
      .forEach((img) => {
        img.loading = "lazy";
        img.decoding = "async";
      });
  }

  function setupSmoothScroll() {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (reducedMotion) {
      return;
    }

    document.addEventListener(
      "click",
      (event) => {
        const target =
          event.target;

        if (
          !(target instanceof Element)
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

        let destination;

        try {
          destination =
            document.querySelector(
              selector,
            );
        } catch {
          return;
        }

        if (!destination) {
          return;
        }

        event.preventDefault();

        destination.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
    );
  }

  function setupCurrentYear() {
    const year =
      String(
        new Date().getFullYear(),
      );

    document
      .querySelectorAll(
        "[data-current-year]",
      )
      .forEach((element) => {
        element.textContent =
          year;
      });
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

    bytes[6] =
      (bytes[6] & 0x0f) |
      0x40;

    bytes[8] =
      (bytes[8] & 0x3f) |
      0x80;

    const hex =
      Array.from(bytes).map(
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
        .slice(0, 4)
        .join(""),

      hex
        .slice(4, 6)
        .join(""),

      hex
        .slice(6, 8)
        .join(""),

      hex
        .slice(8, 10)
        .join(""),

      hex
        .slice(10, 16)
        .join(""),
    ].join("-");
  }

  function resetSession() {
    sessionId =
      createSessionId();

    maxScroll = 0;

    visitStarted = false;
    visitStarting = false;

    pendingEndDispatched =
      false;

    pendingEndPromise =
      null;

    unloadBeaconSent =
      false;

    resumeRunning =
      false;

    updateScroll();
  }

  /* =========================================================
     DEVICE / BROWSER
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
      Array.isArray(brands)
    ) {
      const names =
        brands.map(
          (item) =>
            String(
              item.brand || "",
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
      ua.includes("Edg/")
    ) {
      return "Microsoft Edge";
    }

    if (
      ua.includes("OPR/") ||
      ua.includes("Opera")
    ) {
      return "Opera";
    }

    if (
      ua.includes("Firefox/")
    ) {
      return "Firefox";
    }

    if (
      ua.includes("Chrome/") &&
      !ua.includes("Edg/")
    ) {
      return "Chrome";
    }

    if (
      ua.includes("Safari/") &&
      !ua.includes("Chrome/")
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
      /Windows/i.test(ua)
    ) {
      return "Windows";
    }

    if (
      /Android/i.test(ua)
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
      /Mac/i.test(platform) ||
      /Mac OS/i.test(ua)
    ) {
      return "macOS";
    }

    if (
      /Linux/i.test(platform) ||
      /Linux/i.test(ua)
    ) {
      return "Linux";
    }

    return "Unknown";
  }

  function detectMobile() {
    const uaData =
      navigator.userAgentData;

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
        root.scrollHeight || 0,
        body?.scrollHeight || 0,
        root.offsetHeight || 0,
        body?.offsetHeight || 0,
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
     VISIT PAYLOAD
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

  /* =========================================================
     SESSION STATE PAYLOAD
     ========================================================= */

  function buildSessionState(
    eventType,
  ) {
    updateScroll();

    const connection =
      getConnection();

    return {
      event_type:
        eventType,

      session_id:
        sessionId,

      max_scroll_percent:
        maxScroll,

      viewport_width:
        innerWidth ||
        null,

      viewport_height:
        innerHeight ||
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
    };
  }

  /* =========================================================
     REQUEST
     ========================================================= */

  async function post(
    data,
    keepalive = false,
  ) {
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

          keepalive,

          credentials:
            "omit",

          cache:
            "no-store",

          referrerPolicy:
            "no-referrer",
        },
      );

    let result = null;

    try {
      result =
        await response.json();
    } catch {
      result = null;
    }

    return {
      ok:
        response.ok,

      status:
        response.status,

      data:
        result,
    };
  }

  /* =========================================================
     START VISIT
     ========================================================= */

  async function startVisit() {
    if (
      visitStarted ||
      visitStarting
    ) {
      return;
    }

    visitStarting =
      true;

    updateScroll();

    try {
      const result =
        await post(
          buildVisit(),
        );

      if (
        result.ok
      ) {
        visitStarted =
          true;
      }
    } catch {
      // Initial tracking failed.
    } finally {
      visitStarting =
        false;
    }
  }

  /* =========================================================
     PENDING END - NORMAL FETCH
     ========================================================= */

  function sendPendingEnd() {
    if (
      !visitStarted
    ) {
      return Promise.resolve();
    }

    if (
      pendingEndDispatched
    ) {
      return (
        pendingEndPromise ||
        Promise.resolve()
      );
    }

    pendingEndDispatched =
      true;

    /*
     * Namjerno NE vraćamo pendingEndDispatched na false
     * ako fetch baci error.
     *
     * Ako se korisnik vrati, želimo da RESUME svejedno
     * ode serveru i poništi eventualni pending end.
     *
     * Ako korisnik stvarno zatvori tab, pagehide beacon
     * će napraviti zaseban pokušaj.
     */
    pendingEndPromise =
      post(
        buildSessionState(
          "pending_end",
        ),
        true,
      )
        .catch(() => {
          return null;
        });

    return pendingEndPromise;
  }

  /* =========================================================
     PENDING END - UNLOAD BEACON
     ========================================================= */

  function sendPendingEndBeacon() {
    /*
     * Ovdje namjerno NE provjeravamo:
     *
     * pendingEndDispatched
     *
     * jer je upravo to uzrokovalo prethodni bug.
     *
     * visibilitychange je možda pokušao poslati normalni
     * fetch, ali taj request browser može ubiti tijekom
     * zatvaranja taba.
     *
     * Zato stvarni unload uvijek dobiva jedan beacon pokušaj.
     */
    if (
      !visitStarted ||
      unloadBeaconSent
    ) {
      return;
    }

    unloadBeaconSent =
      true;

    pendingEndDispatched =
      true;

    const payload =
      JSON.stringify(
        buildSessionState(
          "pending_end",
        ),
      );

    if (
      typeof navigator
          .sendBeacon ===
        "function"
    ) {
      try {
        const queued =
          navigator.sendBeacon(
            CONFIG.endpoint,

            new Blob(
              [payload],
              {
                type:
                  "text/plain;charset=UTF-8",
              },
            ),
          );

        if (queued) {
          return;
        }
      } catch {}
    }

    /*
     * Ako sendBeacon nije dostupan ili browser
     * odbije queueati request, pokušaj keepalive fetch.
     */
    try {
      void fetch(
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
    } catch {}
  }

  /* =========================================================
     RESUME
     ========================================================= */

  async function resumeVisit() {
    if (
      !visitStarted ||
      !pendingEndDispatched ||
      resumeRunning
    ) {
      return;
    }

    resumeRunning =
      true;

    try {
      /*
       * Ako je visibilitychange poslao normalni pending_end
       * fetch, pričekamo ga.
       *
       * Time sprječavamo race:
       *
       * resume
       * ↓
       * pending_end
       *
       * jer bi u tom slučaju pending_end mogao doći nakon
       * resumea i pogrešno završiti aktivni session.
       */
      if (
        pendingEndPromise
      ) {
        try {
          await pendingEndPromise;
        } catch {}
      } else {
        /*
         * Ako je postojao samo sendBeacon/pagehide,
         * nemamo Promise koji možemo čekati.
         *
         * Kratko čekanje daje beaconu vremena da dođe
         * do servera prije resume requesta.
         */
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              350,
            ),
        );
      }

      let result = null;

      /*
       * Resume je važan jer sprječava lažni END.
       * Zato imamo nekoliko kratkih retry pokušaja.
       */
      for (
        let attempt = 0;
        attempt < 3;
        attempt += 1
      ) {
        try {
          result =
            await post(
              buildSessionState(
                "resume",
              ),
            );

          if (
            result.ok
          ) {
            break;
          }
        } catch {}

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              350,
            ),
        );
      }

      if (
        result?.ok &&
        result.data?.active ===
          true
      ) {
        /*
         * Session je još aktivan.
         *
         * Ponovno dopuštamo budući pending end i
         * budući unload beacon.
         */
        pendingEndDispatched =
          false;

        pendingEndPromise =
          null;

        unloadBeaconSent =
          false;

        return;
      }

      if (
        result?.ok &&
        result.data?.ended ===
          true
      ) {
        /*
         * Korisnik se vratio tek nakon što je grace
         * period već završio stari session.
         *
         * Tada je ispravno napraviti novi session.
         */
        resetSession();

        await startVisit();

        return;
      }

      /*
       * Ako server trenutno nije dostupan, ne stvaramo
       * automatski novi session jer bi to moglo proizvesti
       * duplikate.
       */
    } finally {
      resumeRunning =
        false;
    }
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
     EVENTS
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

  /*
   * Tab samo ode u background.
   *
   * Pokrećemo pending_end, ali backend još NE završava
   * posjet. Ima 15 sekundi grace perioda.
   */
  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.visibilityState ===
        "hidden"
      ) {
        void sendPendingEnd();

        return;
      }

      if (
        document.visibilityState ===
        "visible"
      ) {
        void resumeVisit();
      }
    },
  );

  /*
   * STVARNI ODLAZAK / UNLOAD
   *
   * Čak i ako je visibilitychange već pokušao poslati
   * pending_end fetch, ovdje šaljemo zaseban beacon.
   */
  window.addEventListener(
    "pagehide",
    () => {
      sendPendingEndBeacon();
    },
  );

  /*
   * Dodatni browser fallback.
   *
   * unloadBeaconSent sprječava da pagehide +
   * beforeunload pošalju dva beacona.
   */
  window.addEventListener(
    "beforeunload",
    () => {
      sendPendingEndBeacon();
    },
  );

  /*
   * Ako browser vrati stranicu iz back-forward cachea,
   * ista sesija se pokušava nastaviti.
   */
  window.addEventListener(
    "pageshow",
    (event) => {
      if (
        event.persisted
      ) {
        void resumeVisit();
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
