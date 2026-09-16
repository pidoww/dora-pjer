(() => {
  "use strict";

  const CONFIG = {
    endpoint:
      "https://kkvdaedxequoqfyyhavp.supabase.co/functions/v1/track-visit",
    heartbeatMs: 30000,
  };

  let maxScroll = 0;
  let heartbeat = null;

  // =========================================================
  // GENERAL SITE FUNCTIONS
  // =========================================================

  function setupExternalLinks() {
    document
      .querySelectorAll('a[href^="http"]')
      .forEach((link) => {
        try {
          const url = new URL(
            link.href,
            location.href
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
        "img:not([loading])"
      )
      .forEach((img) => {
        img.loading = "lazy";
        img.decoding = "async";
      });
  }

  function setupSmoothScroll() {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) {
      return;
    }

    document.addEventListener(
      "click",
      (event) => {
        const link =
          event.target.closest(
            'a[href^="#"]'
          );

        if (!link) {
          return;
        }

        const selector =
          link.getAttribute("href");

        if (
          !selector ||
          selector === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            selector
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    );
  }

  function setupCurrentYear() {
    const year =
      String(
        new Date().getFullYear()
      );

    document
      .querySelectorAll(
        "[data-current-year]"
      )
      .forEach((element) => {
        element.textContent = year;
      });
  }

  // =========================================================
  // SESSION
  // =========================================================

  function getSessionId() {
    let id =
      sessionStorage.getItem(
        "dp_session_id"
      );

    if (!id) {
      id = crypto.randomUUID();

      sessionStorage.setItem(
        "dp_session_id",
        id
      );
    }

    return id;
  }

  // =========================================================
  // CLIENT INFORMATION
  // =========================================================

  function detectBrowser() {
    const ua =
      navigator.userAgent || "";

    if (ua.includes("Edg/")) {
      return "Microsoft Edge";
    }

    if (
      ua.includes("OPR/") ||
      ua.includes("Opera")
    ) {
      return "Opera";
    }

    if (ua.includes("Firefox/")) {
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
      navigator.userAgent || "";

    const platform =
      navigator.platform || "";

    if (/Windows/i.test(ua)) {
      return "Windows";
    }

    if (/Android/i.test(ua)) {
      return "Android";
    }

    if (
      /iPhone|iPad|iPod/i.test(
        ua
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

    return /Android|iPhone|iPad|iPod|Mobile/i.test(
      navigator.userAgent
    );
  }

  function getTimezone() {
    try {
      return (
        Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone || null
      );
    } catch {
      return null;
    }
  }

  function getOrientation() {
    try {
      return (
        screen.orientation?.type ||
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

  // =========================================================
  // SCROLL
  // =========================================================

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
        body?.offsetHeight || 0
      );

    const viewportHeight =
      window.innerHeight || 0;

    const scrollable =
      documentHeight -
      viewportHeight;

    let percent = 100;

    if (scrollable > 0) {
      percent =
        (scrollTop / scrollable) *
        100;
    }

    percent =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(percent)
        )
      );

    if (percent > maxScroll) {
      maxScroll = percent;
    }
  }

  // =========================================================
  // INITIAL VISIT
  // =========================================================

  function buildVisit() {
    const connection =
      getConnection();

    const uaData =
      navigator.userAgentData ||
      null;

    return {
      event_type: "visit",

      session_id:
        getSessionId(),

      page:
        location.href,

      page_title:
        document.title || null,

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
          ? navigator.deviceMemory
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
            .maxTouchPoints > 0
        ) ||
        "ontouchstart" in window,

      cookies_enabled:
        navigator.cookieEnabled,

      do_not_track:
        navigator.doNotTrack ||
        null,

      screen_width:
        screen.width || null,

      screen_height:
        screen.height || null,

      viewport_width:
        innerWidth || null,

      viewport_height:
        innerHeight || null,

      device_pixel_ratio:
        devicePixelRatio || 1,

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
        connection?.effectiveType ||
        null,

      connection_downlink:
        typeof connection
          ?.downlink ===
        "number"
          ? connection.downlink
          : null,

      connection_rtt:
        typeof connection?.rtt ===
        "number"
          ? connection.rtt
          : null,

      connection_save_data:
        typeof connection
          ?.saveData ===
        "boolean"
          ? connection.saveData
          : null,

      ua_brands:
        Array.isArray(
          uaData?.brands
        )
          ? uaData.brands
          : null,

      ua_mobile:
        typeof uaData?.mobile ===
        "boolean"
          ? uaData.mobile
          : null,

      ua_platform:
        uaData?.platform ||
        null,
    };
  }

  // =========================================================
  // SESSION UPDATE
  // =========================================================

  function buildUpdate() {
    updateScroll();

    return {
      event_type: "update",

      session_id:
        getSessionId(),

      max_scroll_percent:
        maxScroll,
    };
  }

  // =========================================================
  // NETWORK
  // =========================================================

  async function send(data) {
    try {
      const response =
        await fetch(
          CONFIG.endpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "text/plain;charset=UTF-8",
            },

            body:
              JSON.stringify(data),

            keepalive: true,

            credentials: "omit",

            cache: "no-store",

            referrerPolicy:
              "no-referrer",
          }
        );

      return response.ok;
    } catch {
      return false;
    }
  }

  function sendFinalUpdate() {
    updateScroll();

    const payload =
      JSON.stringify(
        buildUpdate()
      );

    if (
      typeof navigator
        .sendBeacon ===
      "function"
    ) {
      try {
        const blob =
          new Blob(
            [payload],
            {
              type:
                "text/plain;charset=UTF-8",
            }
          );

        if (
          navigator.sendBeacon(
            CONFIG.endpoint,
            blob
          )
        ) {
          return;
        }
      } catch {}
    }

    try {
      fetch(
        CONFIG.endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=UTF-8",
          },

          body: payload,

          keepalive: true,

          credentials: "omit",

          cache: "no-store",

          referrerPolicy:
            "no-referrer",
        }
      );
    } catch {}
  }

  // =========================================================
  // HEARTBEAT
  // =========================================================

  function startHeartbeat() {
    if (heartbeat) {
      return;
    }

    heartbeat =
      window.setInterval(
        () => {
          if (
            document
              .visibilityState ===
            "visible"
          ) {
            send(
              buildUpdate()
            );
          }
        },

        CONFIG.heartbeatMs
      );
  }

  // =========================================================
  // INIT
  // =========================================================

  async function initMetrics() {
    updateScroll();

    const sent =
      sessionStorage.getItem(
        "dp_visit_sent"
      );

    if (sent !== "1") {
      const success =
        await send(
          buildVisit()
        );

      if (success) {
        sessionStorage.setItem(
          "dp_visit_sent",
          "1"
        );
      }
    }

    startHeartbeat();
  }

  function init() {
    setupExternalLinks();
    setupLazyImages();
    setupSmoothScroll();
    setupCurrentYear();

    initMetrics();
  }

  // =========================================================
  // EVENTS
  // =========================================================

  window.addEventListener(
    "scroll",
    updateScroll,
    {
      passive: true,
    }
  );

  window.addEventListener(
    "resize",
    updateScroll,
    {
      passive: true,
    }
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document
          .visibilityState ===
        "hidden"
      ) {
        sendFinalUpdate();
      }
    }
  );

  window.addEventListener(
    "pagehide",
    sendFinalUpdate
  );

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true,
      }
    );
  } else {
    init();
  }
})();
