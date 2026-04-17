(function () {
  const data = JSON.parse(JSON.stringify(window.FigmaMuseumData));

  const state = {
    route: data.initialRoute || "/museum",
    signedToday: data.signedToday,
    appPoints: data.appPoints,
    signStreak: data.signStreak,
    bookAsked: false,
    bookQuestion: "",
    bookAnswer: null,
    bookOpening: false,
    bookRemaining: 3,
    bookCollected: data.bookExperience ? data.bookExperience.home.collectionCount : 4,
    bookCollectionPreview: null,
    craftStoryWatched: false,
    treeStep: 0,
    treeTasksDone: {
      water: false,
      patrol: false,
      quiz: false
    },
    treePledge: "",
    palaTab: "home",
    palaDetailIndex: 0,
    palaVoicePlaying: false,
    palaVoiceTime: 0
  };

  const app = document.getElementById("app");
  const tabBar = document.getElementById("tabBar");
  const deviceNotch = document.querySelector(".device__notch");
  const assetLoader = document.getElementById("assetLoader");
  const assetLoaderFill = document.getElementById("assetLoaderFill");
  const assetLoaderText = document.getElementById("assetLoaderText");
  let palaVoiceTimer = null;
  const preloadedImageUrls = new Set();
  const cssImageUrls = [];
  const staticImageRoutes = new Set(["/", "/map", "/profile"]);

  const rootTabRoute = {
    home: "/",
    map: "/map",
    explore: "/explore",
    me: "/profile"
  };

  const routesWithTabs = new Set(["/explore", "/museum"]);

  function iconSvg(type, color) {
    const stroke = `stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    if (type === "home") {
      return `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M3 9L11 3L19 9V19H14V14H8V19H3V9Z" ${stroke}></path></svg>`;
    }
    if (type === "map") {
      return `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="9" r="3" ${stroke}></circle><path d="M11 14C11 14 5 17 5 10A6 6 0 0 1 17 10C17 17 11 14 11 14Z" ${stroke}></path></svg>`;
    }
    if (type === "explore") {
      return `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="7" ${stroke}></circle><path d="M8 14L11 6L14 11L11 12.5L8 14Z" ${stroke.replace('stroke-width="1.5"', 'stroke-width="1.3"')}></path></svg>`;
    }
    return `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="8" r="3.5" ${stroke}></circle><path d="M3 19C3 15 6.5 12 11 12C15.5 12 19 15 19 19" ${stroke}></path></svg>`;
  }

  function arrowIcon(color) {
    return `<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3L11 8L6 13" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>`;
  }

  function backIcon(color) {
    return `<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4L6 10L12 16" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>`;
  }

  function isExpiringFigmaAsset(value) {
    return typeof value === "string" && value.includes("figma.com/api/mcp/asset");
  }

  function tabIconMarkup(id, active) {
    const asset = data.tabBarIcons ? data.tabBarIcons[id] : "";
    const useAsset = asset && !isExpiringFigmaAsset(asset) && ((id === "explore" && active) || (id !== "explore" && !active));
    if (useAsset) {
      return `<img class="tabbar__icon-image" src="${asset}" alt="" />`;
    }

    const color = active ? "#fff" : "#a8a29f";
    return iconSvg(id, color);
  }

  function closeIcon(color) {
    return `<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5L15 15M15 5L5 15" stroke="${color}" stroke-width="2" stroke-linecap="round"></path></svg>`;
  }

  function planeIcon(color) {
    return `<svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true"><path d="M17 4L9 12" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M17 4L12 17L9 12L4 9L17 4Z" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" fill="none"></path></svg>`;
  }

  function starIcon(color) {
    return `<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3L12.2 7.3L17 8L13.5 11.3L14.3 16L10 13.7L5.7 16L6.5 11.3L3 8L7.8 7.3L10 3Z" stroke="${color}" stroke-width="1.5" fill="none" stroke-linejoin="round"></path></svg>`;
  }

  function saveIcon(color) {
    return `<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8V15H15V8" stroke="${color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 4V12" stroke="${color}" stroke-width="1.7" stroke-linecap="round"></path><path d="M7 9L10 12L13 9" stroke="${color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  }

  function shareIcon(color) {
    return `<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="10" r="1.7" fill="${color}"></circle><circle cx="14.5" cy="5" r="1.7" fill="${color}"></circle><circle cx="14.5" cy="15" r="1.7" fill="${color}"></circle><path d="M6.5 9L13 5.8M6.5 11L13 14.2" stroke="${color}" stroke-width="1.4" fill="none" stroke-linecap="round"></path></svg>`;
  }

  function libraryIcon(color) {
    return `<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 5.5H9V15H4V5.5Z" stroke="${color}" stroke-width="1.5" fill="none"></path><path d="M11 5.5H16V15H11V5.5Z" stroke="${color}" stroke-width="1.5" fill="none"></path></svg>`;
  }

  function traceTargetIcon() {
    return `
      <span class="trace-target-icon" aria-hidden="true">
        <span class="trace-target-icon__ring"></span>
        <span class="trace-target-icon__core"></span>
        <span class="trace-target-icon__line trace-target-icon__line--top"></span>
        <span class="trace-target-icon__line trace-target-icon__line--right"></span>
        <span class="trace-target-icon__line trace-target-icon__line--bottom"></span>
        <span class="trace-target-icon__line trace-target-icon__line--left"></span>
      </span>
    `;
  }

  function craftStageGlyph(type) {
    const glyphMap = {
      done: "✓",
      challenge: "✣",
      "locked-medal": "◎",
      "locked-crown": "♛"
    };

    return `<span class="craft-stage-glyph craft-stage-glyph--${type}">${glyphMap[type] || "•"}</span>`;
  }

  function craftTrackButton(track) {
    if (track.status === "active") {
      return `
        <button class="craft-home-card__btn craft-home-card__btn--active" type="button" data-nav="/craft-kapen">
          <span>继续修炼</span>
          ${arrowIcon("#0C0B08")}
        </button>
      `;
    }

    return `
      <button class="craft-home-card__btn craft-home-card__btn--locked" type="button" disabled>
        <span>⛒</span>
        <span>待解锁</span>
      </button>
    `;
  }

  function batteryMarkup(dark) {
    const cls = dark ? "statusbar statusbar--dark" : "statusbar statusbar--light";
    return `
      <div class="${cls}">
        <span>9:41</span>
        <div class="statusbar__signal">
          <span>5G</span>
          <div class="battery"><div class="battery__fill"></div></div>
        </div>
      </div>
    `;
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function scrollIcon(color) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6A2.5 2.5 0 0 1 9 3.5h8.5v17H9A2.5 2.5 0 0 1 6.5 18V6Z" stroke="${color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.5 6v12" stroke="${color}" stroke-width="1.7" stroke-linecap="round"></path><path d="M9.5 7.5h5.5M9.5 11h5.5M9.5 14.5h4" stroke="${color}" stroke-width="1.7" stroke-linecap="round"></path></svg>`;
  }

  function eyeIcon(color) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6.5 5.5 12 5.5 21.5 12 21.5 12 17.5 18.5 12 18.5 2.5 12 2.5 12Z" stroke="${color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="12" cy="12" r="3" stroke="${color}" stroke-width="1.7" fill="none"></circle></svg>`;
  }

  function earIcon(color) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9.5a6 6 0 1 0-12 0c0 3 2.2 4.5 3.7 5.7 1.1.9 1.8 1.5 1.8 2.8 0 .9.7 1.5 1.5 1.5s1.5-.6 1.5-1.5" stroke="${color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 8.2a2.8 2.8 0 0 1 2.8 2.8c0 1.6-.8 2.3-1.7 3.1-.6.5-1.1 1-1.1 1.9" stroke="${color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  }

  function rewindIcon(color) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8 4.5 12 9 16" stroke="${color}" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.5 8 15 12l4.5 4" stroke="${color}" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 8v8" stroke="${color}" stroke-width="1.9" fill="none" stroke-linecap="round"></path></svg>`;
  }

  function playIcon(color) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" fill="${color}"></path></svg>`;
  }

  function pauseIcon(color) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="5" width="4" height="14" rx="1.2" fill="${color}"></rect><rect x="13" y="5" width="4" height="14" rx="1.2" fill="${color}"></rect></svg>`;
  }

  function forwardIcon(color) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 8 4.5 4-4.5 4" stroke="${color}" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><path d="m4.5 8 4.5 4-4.5 4" stroke="${color}" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 8v8" stroke="${color}" stroke-width="1.9" fill="none" stroke-linecap="round"></path></svg>`;
  }

  function palaTabIcon(type, color) {
    if (type === "home") return iconSvg("home", color);
    if (type === "explain") return scrollIcon(color);
    if (type === "detail") return eyeIcon(color);
    return earIcon(color);
  }

  function buildNarrationSegments(text, duration) {
    const phrases = text
      .split(/(?<=[。！？；，])/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    const chunks = [];

    phrases.forEach((phrase) => {
      const compact = phrase.replace(/\s+/g, "");
      if (compact.length <= 18) {
        chunks.push(compact);
        return;
      }

      for (let index = 0; index < compact.length; index += 18) {
        chunks.push(compact.slice(index, index + 18));
      }
    });

    const totalLength = chunks.join("").length || 1;
    let consumed = 0;

    return chunks.map((chunk) => {
      const startTime = Math.round(consumed / totalLength * duration);
      consumed += chunk.length;
      return { text: chunk, startTime };
    });
  }

  function getNarrationChunk(segments, seconds) {
    let activeIndex = 0;

    segments.forEach((segment, index) => {
      if (segment.startTime <= seconds) {
        activeIndex = index;
      }
    });

    return segments.slice(activeIndex).map((segment) => segment.text).join("");
  }

  const palaVoiceSegments = buildNarrationSegments(
    data.palaHouse.guideText.join(""),
    data.palaHouse.voiceDuration
  );

  function isImageSource(value) {
    if (typeof value !== "string") return false;
    if (value.startsWith("data:image/")) return true;
    if (value.startsWith("assets/")) return true;
    if (isExpiringFigmaAsset(value)) return true;
    if (value.includes("images.unsplash.com")) return true;
    return /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(value);
  }

  function escapeSvgText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function svgDataUri(markup) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;
  }

  function buildFallbackImageSrc(label, className) {
    const classText = String(className || "");
    const compact = /icon|tabbar__icon-image|points-pill__icon|explore-mark__icon|chevron|done/i.test(classText);

    if (compact) {
      return svgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
          <rect width="80" height="80" rx="22" fill="#F4EFE5"/>
          <circle cx="40" cy="40" r="18" fill="none" stroke="#C8A76F" stroke-width="4"/>
          <circle cx="40" cy="40" r="6" fill="#0F6E56"/>
        </svg>
      `);
    }

    const title = escapeSvgText((label || "罗布人村寨").trim().slice(0, 18) || "罗布人村寨");

    return svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#143A35"/>
            <stop offset="100%" stop-color="#0C0B08"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#bg)"/>
        <circle cx="980" cy="120" r="210" fill="#D4A96A" fill-opacity="0.18"/>
        <circle cx="180" cy="720" r="230" fill="#1D9E75" fill-opacity="0.14"/>
        <rect x="56" y="56" width="1088" height="688" rx="42" fill="none" stroke="#D4A96A" stroke-opacity="0.26" stroke-width="2"/>
        <text x="88" y="118" fill="#F5E6CC" font-size="64" font-weight="700" font-family="'PingFang SC','Microsoft YaHei',sans-serif">${title}</text>
        <text x="88" y="184" fill="#C9B08A" font-size="30" font-family="'PingFang SC','Microsoft YaHei',sans-serif">原始 Figma 图链已过期，当前使用本地演示占位图</text>
      </svg>
    `);
  }

  function applyImageFallback(img) {
    if (!img || img.dataset.fallbackApplied === "true") return;
    const src = img.getAttribute("src") || "";
    if (!src || src.startsWith("data:image/")) return;
    img.dataset.fallbackApplied = "true";
    img.classList.add("is-fallback-image");
    img.src = buildFallbackImageSrc(img.getAttribute("alt") || "", img.className || "");
  }

  function bindImageFallbacks(root) {
    if (!root) return;
    root.querySelectorAll("img").forEach((img) => {
      if (img.dataset.fallbackBound === "true") return;
      img.dataset.fallbackBound = "true";

      if (isExpiringFigmaAsset(img.getAttribute("src") || "")) {
        applyImageFallback(img);
        return;
      }

      img.addEventListener("error", function () {
        applyImageFallback(img);
      });

      if (img.complete && img.naturalWidth === 0) {
        applyImageFallback(img);
      }
    });
  }

  function collectImageSources(input, bucket) {
    if (!input) return;
    if (Array.isArray(input)) {
      input.forEach((item) => collectImageSources(item, bucket));
      return;
    }

    if (typeof input === "object") {
      Object.values(input).forEach((value) => collectImageSources(value, bucket));
      return;
    }

    if (isImageSource(input)) {
      bucket.add(input);
    }
  }

  function updateAssetLoader(loaded, total) {
    if (!assetLoader || !assetLoaderFill || !assetLoaderText) return;
    const safeTotal = Math.max(total, 1);
    const percent = Math.round((loaded / safeTotal) * 100);
    assetLoaderFill.style.width = `${percent}%`;
    assetLoaderText.textContent = loaded >= total ? `图片已缓存 ${total}/${total}` : `正在缓存 ${loaded}/${total}`;
  }

  function preloadImage(url) {
    if (!url || preloadedImageUrls.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const image = new Image();
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        preloadedImageUrls.add(url);
        resolve();
      };
      const timer = window.setTimeout(finish, 8000);

      image.onload = () => {
        window.clearTimeout(timer);
        finish();
      };
      image.onerror = () => {
        window.clearTimeout(timer);
        finish();
      };
      image.decoding = "async";
      image.loading = "eager";
      image.src = url;
    });
  }

  async function preloadAppImages() {
    const allUrls = new Set(cssImageUrls);
    collectImageSources(data, allUrls);
    const urls = Array.from(allUrls);

    if (!urls.length) {
      updateAssetLoader(1, 1);
      return;
    }

    let loaded = 0;
    updateAssetLoader(0, urls.length);

    await Promise.all(
      urls.map((url) =>
        preloadImage(url).finally(() => {
          loaded += 1;
          updateAssetLoader(loaded, urls.length);
        })
      )
    );
  }

  function hideAssetLoader() {
    if (!assetLoader) return;
    assetLoader.classList.add("is-hidden");
  }

  function stopPalaVoiceTimer() {
    state.palaVoicePlaying = false;
    if (palaVoiceTimer !== null) {
      window.clearInterval(palaVoiceTimer);
      palaVoiceTimer = null;
    }
  }

  function startPalaVoiceTimer() {
    if (state.palaVoiceTime >= data.palaHouse.voiceDuration) {
      state.palaVoiceTime = 0;
    }

    state.palaVoicePlaying = true;

    if (palaVoiceTimer !== null) {
      return;
    }

    palaVoiceTimer = window.setInterval(() => {
      if (state.route !== "/courtyard-pala" || state.palaTab !== "voice" || !state.palaVoicePlaying) {
        stopPalaVoiceTimer();
        return;
      }

      state.palaVoiceTime = Math.min(state.palaVoiceTime + 1, data.palaHouse.voiceDuration);

      if (state.palaVoiceTime >= data.palaHouse.voiceDuration) {
        stopPalaVoiceTimer();
      }

      render();
    }, 1000);
  }

  function renderTabBar() {
    const visible = routesWithTabs.has(state.route);
    tabBar.classList.toggle("is-hidden", !visible);
    if (!visible) {
      tabBar.innerHTML = "";
      return;
    }

    const activeTab = state.route === "/profile" ? "me" : "explore";
    const items = [
      { id: "home", label: "首页" },
      { id: "map", label: "地图" },
      { id: "explore", label: "探索" },
      { id: "me", label: "我的" }
    ];

    tabBar.innerHTML = items
      .map((item) => {
        const active = item.id === activeTab;
        return `
          <button class="tabbar__item ${active ? "is-active" : ""}" data-tab="${item.id}" type="button">
            <span class="tabbar__icon">${tabIconMarkup(item.id, active)}</span>
            <span>${item.label}</span>
            <span class="tabbar__dot"></span>
          </button>
        `;
      })
      .join("");
  }

  function renderExplore() {
    const availableMiniCards = data.miniCards.filter((card) => !card.dimmed);
    const upcomingMiniCards = data.miniCards.filter((card) => card.dimmed);

    return `
      <div class="screen screen--light">
        ${batteryMarkup(false)}
        <div class="page-top page-top--explore">
          <div class="explore-mark" aria-hidden="true">
            <img class="explore-mark__icon" src="${data.exploreHeaderIcon}" alt="" />
          </div>
          <div class="page-title page-title--dark">探索</div>
          <div class="points-pill points-pill--warn points-pill--compact">
            <img class="points-pill__icon" src="${data.explorePointsIcon}" alt="" />
            <span>${state.appPoints}</span>
          </div>
        </div>

        <div class="content content--explore">
          <div class="announce">
            <div class="announce__text">
              <span class="announce__dot"></span>
              <span>今日签到 +5 积分，已连续 ${state.signStreak} 天</span>
            </div>
            <button class="announce__btn" data-action="sign" type="button">${state.signedToday ? "已签到" : "签到"}</button>
          </div>

          <p class="section-kicker">本期重点体验</p>

          ${data.exploreCards
            .map(
              (card) => `
                <div class="card surface-dark hero-tile" data-nav="/${card.id}">
                  <div class="hero-tile__media">
                    <img src="${card.image}" alt="${card.title}" />
                    <div class="hero-tile__overlay">
                      <div class="hero-tile__label">${card.hall}</div>
                      <div class="hero-tile__title">${card.title}</div>
                      <div class="hero-tile__tag">${card.tag}</div>
                    </div>
                  </div>
                  <div class="hero-tile__meta">
                    <div class="hero-tile__row">
                      <small>${card.progressLabel}</small>
                      <strong>${card.points}</strong>
                    </div>
                    <div class="progress"><div class="progress__fill" style="width:${card.progress}%;background:${card.progressColor};"></div></div>
                  </div>
                </div>
              `
            )
            .join("")}

          <div class="mini-grid mini-grid--featured">
            ${availableMiniCards
              .map(
                (card) => `
                  <div class="card surface-dark mini-tile" data-nav="/${card.id}">
                    <div class="mini-tile__media">
                      <img src="${card.image}" alt="${card.title}" />
                    </div>
                    <div class="mini-tile__body">
                      <div class="mini-tile__title">${card.title}</div>
                      <div class="mini-tile__desc">${card.desc}</div>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>

          <p class="section-kicker section-kicker--upcoming">即将上线</p>

          <div class="mini-grid mini-grid--upcoming">
            ${upcomingMiniCards
              .map(
                (card) => `
                  <div class="card surface-dark mini-tile mini-tile--dimmed">
                    <div class="mini-tile__media">
                      <img src="${card.image}" alt="${card.title}" />
                    </div>
                    <div class="mini-tile__body">
                      <div class="mini-tile__title">${card.title}</div>
                      <div class="mini-tile__desc">${card.desc}</div>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderStaticPage(page) {
    return `
      <div class="screen static-screen">
        <img class="static-screen__image" src="${page.image}" alt="${page.title}" />
        <div class="static-screen__tab-replace" aria-hidden="true">
          <span class="static-screen__tab-mask static-screen__tab-mask--icon"></span>
          <span class="static-screen__tab-mask static-screen__tab-mask--label"></span>
          <span class="static-screen__tab-icon">${iconSvg("explore", "#7b8086")}</span>
          <span class="static-screen__tab-label">探索</span>
        </div>
        <div class="static-screen__hotspots" aria-hidden="true">
          <button class="static-screen__hotspot" data-nav="/" type="button" aria-label="首页"></button>
          <button class="static-screen__hotspot" data-nav="/map" type="button" aria-label="地图"></button>
          <button class="static-screen__hotspot" data-nav="/explore" type="button" aria-label="探索"></button>
          <button class="static-screen__hotspot" data-nav="/profile" type="button" aria-label="我的"></button>
        </div>
      </div>
    `;
  }

  function renderMuseum() {
    return `
      <div class="screen screen--light">
        <div class="museum-hero">
          <img src="${data.museum.hero}" alt="沉浸式文化博物馆" />
          ${
            data.museum.heroOverlay
              ? `
                <div class="museum-hero__overlay-art">
                  <img src="${data.museum.heroOverlay}" alt="" />
                </div>
              `
              : ""
          }
          <div class="museum-hero__shade"></div>
          <div class="museum-hero__content">
            <div class="museum-hero__top">
              <span>9:41</span>
              <div class="statusbar__signal">
                <span>5G</span>
                <div class="battery"><div class="battery__fill"></div></div>
              </div>
            </div>
            <div class="museum-hero__toolbar">
              <button class="icon-btn icon-btn--glass" data-nav="/explore" type="button" aria-label="back">${backIcon("#ffffff")}</button>
            </div>
            <div class="museum-hero__bottom">
              <h1>沉浸式文化博物馆</h1>
              <p>走进罗布人的千年生活与智慧</p>
            </div>
          </div>
        </div>

        <div class="content content--museum">
          <div class="card surface entry-card" data-nav="/courtyard">
            <div class="entry-card__banner">
              <img src="${data.museum.courtyardImage}" alt="七小院导览" />
              <span class="entry-card__flag">线路导览</span>
            </div>
            <div class="entry-card__body">
              <div class="entry-card__title">
                <img class="entry-card__icon" src="${data.museum.icons.courtyard}" alt="" />
                <span>七小院导览</span>
              </div>
              <div class="entry-card__desc">线上逛七院 · 扫码集勋章</div>
            </div>
          </div>

          <div class="card surface entry-card" data-nav="/exhibition">
            <div class="entry-card__banner">
              <img src="${data.museum.exhibitionImage}" alt="罗布云逛展" />
              <span class="entry-card__flag">360° 全景</span>
            </div>
            <div class="entry-card__body">
              <div class="entry-card__title">
                <img class="entry-card__icon" src="${data.museum.icons.exhibition}" alt="" />
                <span>罗布云逛展</span>
              </div>
              <div class="entry-card__desc">360°看非遗珍品</div>
            </div>
          </div>

          <div class="elder-card" data-action="notice-elder">
            <div class="elder-card__avatar"><img src="${data.museum.elderImage}" alt="AI百岁老人" /></div>
            <div class="elder-card__body">
              <div class="elder-card__title">
                <img class="elder-card__title-icon" src="${data.museum.icons.ai}" alt="" />
                <span>AI百岁老人 · 立即对话</span>
              </div>
              <div class="elder-card__desc">聆听千年智慧，沉浸式交互体验</div>
            </div>
            <div>${arrowIcon("rgba(255,255,255,0.6)")}</div>
          </div>

          <div class="card surface passport-box">
            <div class="passport-box__head">
              <strong>
                <img class="entry-card__icon" src="${data.museum.icons.passport}" alt="" />
                <span>文化护照进度</span>
              </strong>
              <span>${data.passportProgress}/7</span>
            </div>
            <div class="passport-box__track">
              <div class="progress__fill" style="width:${Math.round((data.passportProgress / 7) * 100)}%;background:${"#1d9e75"};"></div>
            </div>
            <div class="passport-box__badges">
              ${data.museum.badges
                .map(
                  (badge) => `
                    <span class="passport-chip ${badge.done ? "passport-chip--done" : ""}">
                      <img class="passport-chip__icon" src="${badge.done ? data.museum.icons.badgeDone : data.museum.icons.badgeTodo}" alt="" />
                      <span>${badge.label}</span>
                    </span>
                  `
                )
                .join("")}
            </div>
            <div class="passport-box__action" data-nav="/profile">查看完整护照 ${arrowIcon("#0F6E56")}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCourtyard() {
    const completed = data.courtyards.filter((item) => item.checked).length;

    return `
      <div class="screen screen--light courtyard-screen">
        ${batteryMarkup(false)}
        <div class="page-top courtyard-screen__top">
          <button class="icon-btn icon-btn--light" data-nav="/museum" type="button" aria-label="back">${backIcon("#1a1a17")}</button>
          <div class="page-title page-title--dark">七小院导览</div>
          <div class="courtyard-progress-pill">
            <img src="${data.courtyardUi.progressIcon}" alt="" />
            <span>${completed}/7</span>
          </div>
        </div>
        <div class="courtyard-screen__progress">
          <div class="courtyard-screen__bar">
            <div class="progress__fill" style="width:${(completed / data.courtyards.length) * 100}%;background:#6DDC84;"></div>
          </div>
          <p>沿着村寨的七重记忆，慢慢完成你的文化护照。</p>
        </div>
        <div class="courtyard-list">
          ${data.courtyards
            .map(
              (item, index) => `
                <button
                  class="courtyard-card ${item.checked ? "is-done" : ""} ${item.route ? "is-featured" : ""}"
                  type="button"
                  ${item.route ? `data-nav="${item.route}"` : `data-action="courtyard-soon" data-name="${item.name}"`}
                >
                  <span class="courtyard-card__media">
                    <img src="${item.image}" alt="${item.name}" />
                    <span class="courtyard-card__index">${index + 1}</span>
                  </span>
                  <span class="courtyard-card__body">
                    <span class="courtyard-card__head">
                      <strong>${item.name}</strong>
                      ${
                        item.checked
                          ? `<span class="courtyard-card__done"><img src="${data.courtyardUi.doneIcon}" alt="" /></span>`
                          : ""
                      }
                    </span>
                    <span class="courtyard-card__theme">${item.theme}</span>
                    <span class="courtyard-card__desc">${item.desc}</span>
                    <span class="courtyard-card__cta ${item.checked ? "is-done" : ""}">
                      <span>${item.checked ? "已打卡" : "去打卡"}</span>
                      ${
                        item.checked
                          ? ""
                          : `<img src="${data.courtyardUi.arrowIcon}" alt="" />`
                      }
                    </span>
                  </span>
                </button>
              `
            )
            .join("")}
        </div>
        <div class="courtyard-footer">
          <button class="courtyard-footer__button" data-nav="/profile" type="button">
            <img src="${data.courtyardUi.passportIcon}" alt="" />
            <span>我的文化护照</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderPalaArtwork(slide, thumb) {
    return `
      <div class="pala-artwork ${thumb ? "pala-artwork--thumb" : ""}">
        <img src="${slide.image}" alt="${slide.name}" />
      </div>
    `;
  }

  function renderPalaHouse() {
    const pala = data.palaHouse;
    const activeSlide = pala.detailSlides[state.palaDetailIndex];
    const isHome = state.palaTab === "home";
    const isExplain = state.palaTab === "explain";
    const isDetail = state.palaTab === "detail";
    const isVoice = state.palaTab === "voice";
    const voiceProgress = Math.round((state.palaVoiceTime / pala.voiceDuration) * 100);
    const narration = getNarrationChunk(palaVoiceSegments, state.palaVoiceTime);
    const tabs = [
      { key: "home", label: "首页" },
      { key: "explain", label: "讲解" },
      { key: "detail", label: "查看" },
      { key: "voice", label: "语音" }
    ];

    return `
      <div class="screen pala-screen ${isDetail ? "is-detail" : ""}">
        <div class="pala-scene ${isDetail ? "pala-scene--detail" : ""}">
          ${
            isDetail
              ? renderPalaArtwork(activeSlide, false)
              : `<img class="pala-scene__image" src="${pala.heroImage}" alt="${pala.title}" />`
          }
          <div class="pala-scene__veil"></div>
          <div class="pala-scene__texture"></div>
        </div>

        <div class="pala-shell">
          ${batteryMarkup(true)}

          <div class="pala-topbar">
            <button class="icon-btn icon-btn--glass pala-topbar__button" data-nav="/courtyard" type="button" aria-label="back">${backIcon("#FFF7ED")}</button>
            <div class="pala-topbar__pill">${pala.eyebrow}</div>
            <button class="icon-btn icon-btn--glass pala-topbar__button" data-action="pala-more" type="button" aria-label="more">${starIcon("#F6D7A2")}</button>
          </div>

          <div class="pala-copy ${isDetail ? "pala-copy--detail" : ""}">
            <span>${isDetail ? "纹样查看" : pala.eyebrow}</span>
            <h1>${isDetail ? activeSlide.name : pala.title}</h1>
            <p>${isDetail ? activeSlide.caption : pala.subtitle}</p>
          </div>

          ${
            isHome
              ? `
                <div class="pala-home-panel">
                  <div class="pala-home-panel__stats">
                    ${pala.stats
                      .map(
                        (item) => `
                          <div class="pala-stat-pill">
                            <small>${item.label}</small>
                            <strong>${item.value}</strong>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                  <div class="pala-home-panel__moments">
                    ${pala.homeMoments
                      .map(
                        (item) => `
                          <div class="pala-moment-card">
                            <strong>${item.title}</strong>
                            <p>${item.desc}</p>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              `
              : ""
          }

          ${isExplain || isVoice ? '<button class="pala-dismiss" data-action="pala-dismiss" type="button" aria-label="dismiss"></button>' : ""}

          ${
            isExplain
              ? `
                <section class="pala-sheet pala-sheet--explain">
                  <div class="pala-sheet__grab"></div>
                  <div class="pala-sheet__head">
                    <small>文字讲解</small>
                    <h3>${pala.guideTitle}</h3>
                  </div>
                  <div class="pala-sheet__copy">
                    ${pala.guideText.map((paragraph) => `<p>${paragraph}</p>`).join("")}
                  </div>
                </section>
              `
              : ""
          }

          ${
            isDetail
              ? `
                <section class="pala-sheet pala-sheet--detail">
                  <div class="pala-sheet__topline">
                    <strong>${activeSlide.name}</strong>
                    <span>${state.palaDetailIndex + 1} / ${pala.detailSlides.length}</span>
                  </div>
                  <div class="pala-sheet__lead">${pala.detailDescription}</div>
                  <div class="pala-sheet__caption">${activeSlide.caption}</div>
                  <div class="pala-thumb-row">
                    ${pala.detailSlides
                      .map(
                        (slide, index) => `
                          <button class="pala-thumb ${index === state.palaDetailIndex ? "is-active" : ""}" data-action="pala-thumb" data-index="${index}" type="button">
                            <span class="pala-thumb__visual">${renderPalaArtwork(slide, true)}</span>
                            <span>${slide.short}</span>
                          </button>
                        `
                      )
                      .join("")}
                  </div>
                </section>
              `
              : ""
          }

          ${
            isVoice
              ? `
                <section class="pala-sheet pala-sheet--voice">
                  <div class="pala-sheet__topline">
                    <strong>帕拉孜小屋语音讲解</strong>
                    <span>${formatTime(Math.round(state.palaVoiceTime))} / ${formatTime(pala.voiceDuration)}</span>
                  </div>
                  <div class="pala-voice__status">${state.palaVoicePlaying ? "正在播放" : "点击播放继续聆听"}</div>
                  <div class="pala-voice__text">${narration}</div>
                  <div class="pala-voice__bar">
                    <span style="width:${voiceProgress}%;"></span>
                  </div>
                  <div class="pala-voice__controls">
                    <button class="pala-control" data-action="pala-seek-back" type="button">${rewindIcon("#FFF7ED")}</button>
                    <button class="pala-control pala-control--primary" data-action="pala-toggle-voice" type="button">
                      ${state.palaVoicePlaying ? pauseIcon("#20130B") : playIcon("#20130B")}
                    </button>
                    <button class="pala-control" data-action="pala-seek-forward" type="button">${forwardIcon("#FFF7ED")}</button>
                  </div>
                </section>
              `
              : ""
          }

          <nav class="pala-tabbar">
            ${tabs
              .map(
                (item) => `
                  <button class="pala-tabbar__item ${state.palaTab === item.key ? "is-active" : ""}" data-action="pala-tab" data-tab="${item.key}" type="button">
                    <span class="pala-tabbar__icon">${palaTabIcon(item.key, state.palaTab === item.key ? "#D4A96A" : "rgba(255,248,241,0.62)")}</span>
                    <span>${item.label}</span>
                  </button>
                `
              )
              .join("")}
          </nav>
        </div>
      </div>
    `;
  }

  function renderExhibition() {
    return `
      <div class="screen screen--light list-screen">
        ${batteryMarkup(false)}
        <div class="page-top">
          <button class="icon-btn icon-btn--light" data-nav="/museum" type="button" aria-label="back">${backIcon("#1a1a17")}</button>
          <div class="page-title page-title--dark">罗布云逛展</div>
          <div class="points-pill points-pill--green">14件珍品</div>
        </div>
        <div class="exhibition-grid">
          ${data.exhibits
            .map(
              (item) => `
                <div class="exhibit-card">
                  <div class="exhibit-card__media">
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="exhibit-card__name">${item.name}</div>
                  </div>
                  <div class="exhibit-card__body">
                    <span class="tag-badge" style="color:${item.color};background:${item.color}12;border-color:${item.color}25;">${item.level}</span>
                    <div class="exhibit-card__desc">${item.desc}</div>
                    <div class="exhibit-card__link">查看 ${arrowIcon("#0F6E56")}</div>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderCraftHome() {
    const home = data.craftHome;

    return `
      <div class="screen craft-home-screen">
        <div class="craft-home-hero">
          <img src="${home.heroImage}" alt="${home.title}" />
          <div class="craft-home-hero__shade"></div>
          <div class="craft-home-hero__content">
            ${batteryMarkup(true)}
            <div class="craft-home-hero__toolbar">
              <button class="icon-btn craft-home-back" data-nav="/explore" type="button">${backIcon("#D4A96A")}</button>
              <div class="craft-home-points">✦ ${state.appPoints}</div>
            </div>
            <div class="craft-home-copy">
              <div class="craft-home-copy__kicker">
                <span></span>
                <em>${home.kicker}</em>
                <span></span>
              </div>
              <h1>${home.title}</h1>
              <p>${home.subtitle}</p>
            </div>
          </div>
        </div>

        <div class="craft-home-body">
          <div class="craft-home-divider">
            <span class="craft-home-divider__dot"></span>
            <span class="craft-home-divider__line"></span>
            <span class="craft-home-divider__star">✦</span>
            <span class="craft-home-divider__line"></span>
            <span class="craft-home-divider__dot"></span>
          </div>

          ${data.craftTracks
            .map(
              (track, index) => `
                <div class="craft-home-track">
                  <div class="craft-home-card ${track.status === "active" ? "is-active" : "is-locked"}">
                    <div class="craft-home-card__media">
                      <img src="${track.image}" alt="${track.name}" />
                      <div class="craft-home-card__shade" style="background:linear-gradient(166deg, ${track.accent}33 6%, rgba(12,11,8,0.92) 68%);"></div>
                      <span class="craft-home-card__index" style="color:${track.accent};border-color:${track.accent}55;">${index + 1}</span>
                      ${
                        track.status === "active"
                          ? `<span class="craft-home-card__symbol">${track.icon}</span>`
                          : `<span class="craft-home-card__lock">⛒</span>`
                      }
                    </div>
                    <div class="craft-home-card__body">
                      <div class="craft-home-card__head">
                        <h2>${track.name}</h2>
                        ${
                          track.status === "active"
                            ? '<span class="craft-home-card__badge">修炼中</span>'
                            : ""
                        }
                      </div>
                      <p class="craft-home-card__hook">「${track.hook}」</p>
                      <div class="craft-home-card__cert" style="color:${track.accent};">⌘ 认证：${track.cert}</div>
                      <div class="craft-home-card__footer">
                        <div class="craft-home-card__progress-block">
                          <div class="craft-home-card__progress-pips">
                            ${Array.from({ length: track.total })
                              .map(
                                (_, pipIndex) => `
                                  <span class="${pipIndex < track.progress ? "is-on" : ""}" style="${pipIndex < track.progress ? `background:${track.accent};` : ""}"></span>
                                `
                              )
                              .join("")}
                          </div>
                          <span class="craft-home-card__progress-text">${track.status === "active" ? `${track.progress}/${track.total} 阶段` : "未解锁"}</span>
                        </div>
                        ${craftTrackButton(track)}
                      </div>
                    </div>
                  </div>
                  ${index < data.craftTracks.length - 1 ? '<div class="craft-home-link"></div>' : ""}
                </div>
              `
            )
            .join("")}
        </div>

        <div class="craft-home-dock">
          <button class="craft-home-dock__btn" type="button" data-action="craft-cert-soon">
            <span>⌘</span>
            <span>${home.certificateLabel}</span>
            ${arrowIcon("#D4A96A")}
          </button>
        </div>
      </div>
    `;
  }

  function renderCraftJourney() {
    const journey = data.craftJourney;
    const progressWidth = (journey.progress.current / journey.progress.total) * 100;

    return `
      <div class="screen craft-screen craft-screen--journey">
        <div class="craft-journey-hero">
          <img src="${journey.heroImage}" alt="${journey.title}" />
          <div class="craft-journey-hero__shade"></div>
          <div class="craft-journey-hero__content">
            ${batteryMarkup(true)}
            <div class="craft-journey-hero__toolbar">
              <button class="icon-btn craft-journey-back" data-nav="/craft" type="button">${backIcon("#D4A96A")}</button>
            </div>
            <div class="craft-journey-hero__copy">
              <div class="craft-journey-hero__title-row">
                <span class="craft-journey-hero__emoji">${journey.emoji}</span>
                <h1>${journey.title}</h1>
              </div>
              <p>${journey.subtitle}</p>
              <div class="craft-journey-progress">
                <div class="craft-journey-progress__bar">
                  <div class="craft-journey-progress__fill" style="width:${progressWidth}%;"></div>
                </div>
                <strong>${journey.progress.current}/${journey.progress.total}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="craft-journey-body">
          ${journey.steps
            .map((step, index) => {
              const stepAction = step.ctaRoute
                ? `data-nav="${step.ctaRoute}"`
                : step.ctaAction
                  ? `data-action="${step.ctaAction}"`
                  : "";

              return `
                <div class="craft-step-row craft-step-row--${step.status}">
                  <div class="craft-step-rail">
                    ${craftStageGlyph(step.nodeType)}
                    <span class="craft-step-line ${index === journey.steps.length - 1 ? "is-hidden" : ""}"></span>
                  </div>
                  <div class="craft-step-card ${step.highlight ? "is-active" : ""} ${step.status === "locked" ? "is-locked" : ""}">
                    <div class="craft-step-card__head">
                      <div>
                        <h2>${step.title}</h2>
                        <p class="craft-step-card__sub">${step.sub}</p>
                      </div>
                      <span class="craft-step-card__badge craft-step-card__badge--${step.status}">${step.statusLabel}</span>
                    </div>
                    <p class="craft-step-card__desc">${step.desc}</p>
                    <div class="craft-step-card__footer">
                      <div class="craft-step-card__reward">
                        <span>★</span>
                        <span>${step.reward}</span>
                      </div>
                      ${
                        step.ctaLabel
                          ? `
                            <button class="craft-step-card__cta" type="button" ${stepAction}>
                              <span>${step.ctaLabel}</span>
                              ${arrowIcon("#D4A96A")}
                            </button>
                          `
                          : ""
                      }
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderCraftStory() {
    const story = data.craftStory;
    const watchProgress = state.craftStoryWatched ? 100 : story.progress;

    return `
      <div class="screen craft-story-screen">
        ${batteryMarkup(true)}
        <div class="craft-story-top">
          <button class="icon-btn craft-story-back" data-nav="/craft-kapen" type="button">${backIcon("#D4A96A")}</button>
          <div class="craft-story-top__title">
            <strong>${story.title}</strong>
            <span>${story.stageLabel}</span>
          </div>
          <div class="craft-story-top__placeholder"></div>
        </div>

        <div class="craft-story-body">
          <div class="craft-story-hook">
            <div class="craft-story-hook__kicker">
              <span>✦</span>
              <span>${story.hookLabel}</span>
            </div>
            <h1>${story.hookTitle}</h1>
            <p>${story.hookDesc}</p>
          </div>

          <button class="craft-video-card ${state.craftStoryWatched ? "is-watched" : ""}" type="button" data-action="craft-watch-video">
            <div class="craft-video-card__media">
              <img src="${story.videoImage}" alt="${story.title}" />
              <div class="craft-video-card__shade"></div>
              <div class="craft-video-card__play">
                <span class="craft-video-card__triangle"></span>
              </div>
              <div class="craft-video-card__caption">${story.videoDuration}</div>
            </div>
            <div class="craft-video-card__progress">
              <span style="width:${watchProgress}%;"></span>
            </div>
            <div class="craft-video-card__footer">
              <span>${story.unlockRule}</span>
              <strong>${story.reward}</strong>
            </div>
          </button>

          <div class="craft-story-divider">
            <span></span>
            <em>背景故事</em>
            <span></span>
          </div>

          ${story.stories
            .map(
              (item) => `
                <div class="craft-story-note">
                  <h2>${item.title}</h2>
                  <p>${item.desc}</p>
                </div>
              `
            )
            .join("")}
        </div>

        <div class="craft-story-dock">
          <button class="craft-story-dock__btn ${state.craftStoryWatched ? "is-ready" : ""}" type="button" ${state.craftStoryWatched ? 'data-action="craft-finish-story"' : "disabled"}>
            ${state.craftStoryWatched ? "完成并返回修炼页" : "请先观看视频"}
          </button>
        </div>
      </div>
    `;
  }

  function renderBookHome() {
    const home = data.bookExperience.home;
    const segments = Array.from({ length: home.collectionTotal })
      .map((_, index) => `<span class="${index < state.bookCollected ? "is-on" : ""}"></span>`)
      .join("");

    return `
      <div class="screen book-home-screen">
        ${batteryMarkup(true)}

        <div class="book-home-top">
          <div class="book-home-topbar">
            <button class="icon-btn book-home-back" data-nav="/explore" type="button" aria-label="back">${backIcon("#D4A96A")}</button>
          </div>
          <div class="book-home-copy">
            <div class="book-home-copy__kicker">
              <span></span>
              <em>${home.kicker}</em>
              <span></span>
            </div>
            <h1>${home.title}</h1>
            <p>${home.subtitle}</p>
          </div>

          <div class="book-home-pills">
            <div class="book-home-pill book-home-pill--gold"><span>✦</span><strong>${state.appPoints}</strong></div>
            <div class="book-home-pill"><span>今日剩余提问：</span><strong>${state.bookRemaining}次</strong></div>
          </div>
        </div>

        <div class="book-home-stage">
          <button class="book-home-cover ${state.bookOpening ? "is-opening" : ""}" data-action="open-book" type="button" aria-label="打开答案之书">
            <span class="book-home-cover__glow"></span>
            <span class="book-home-cover__spark book-home-cover__spark--tl"></span>
            <span class="book-home-cover__spark book-home-cover__spark--tr"></span>
            <span class="book-home-cover__spark book-home-cover__spark--bl"></span>
            <span class="book-home-cover__spark book-home-cover__spark--br"></span>
            <img src="${home.coverImage}" alt="答案之书" />
          </button>
          <div class="book-home-hint">${home.hint}</div>
        </div>

        <button class="book-home-collection" type="button" data-action="book-library-soon">
          <div class="book-home-collection__head">
            <div class="book-home-collection__title">${libraryIcon("#D4A96A")}<span>${home.collectionTitle}</span></div>
            <div class="book-home-collection__count">${state.bookCollected}/${home.collectionTotal} 页</div>
          </div>
          <div class="book-home-collection__progress">${segments}</div>
          <div class="book-home-collection__cta">
            <span>${home.collectionCta}</span>
            ${arrowIcon("#8E6A36")}
          </div>
        </button>
      </div>
    `;
  }

  function renderBookAsk() {
    const ask = data.bookExperience.ask;
    const question = state.bookQuestion || "";
    const ready = question.trim().length > 0;

    return `
      <div class="screen book-ask-screen">
        ${batteryMarkup(true)}
        <div class="book-ask-top">
          <button class="icon-btn book-ask-back" data-nav="/book" type="button">${backIcon("#D4A96A")}</button>
          <div class="book-ask-title">${ask.title}</div>
          <div class="book-ask-top__placeholder"></div>
        </div>

        <div class="book-ask-hero">
          <div class="book-ask-elder">🧓</div>
          <div class="book-ask-elder__name">${ask.elderName}</div>
          <h1>${ask.prompt}</h1>
          <p>${ask.subtitle}</p>
        </div>

        <div class="book-ask-form">
          <div class="book-ask-field">
            <textarea id="bookQuestionInput" maxlength="20" placeholder="${ask.placeholder}">${question}</textarea>
            <div class="book-ask-field__count" data-book-count>${question.length}/20</div>
          </div>
          <button class="book-ask-submit ${ready ? "is-ready" : ""}" data-book-submit data-action="ask-book" type="button" ${ready ? "" : "disabled"}>
            ${planeIcon(ready ? "#D4A96A" : "rgba(255,255,255,0.3)")}
            <span>问老人</span>
          </button>
        </div>

        <div class="book-ask-footer">${ask.footerHint}</div>
      </div>
    `;
  }

  function renderBookAnswer() {
    const answer = state.bookAnswer || data.bookAnswers[0];
    const meta = data.bookExperience.answer;
    const askAgainDisabled = state.bookRemaining <= 0;

    return `
      <div class="screen book-answer-screen">
        ${batteryMarkup(true)}
        <div class="book-answer-top">
          <button class="icon-btn book-answer-top__btn" data-action="book-close-answer" type="button">${closeIcon("#ffffff")}</button>
          <div class="book-answer-scene">${meta.scene}</div>
          <button class="icon-btn book-answer-top__btn" data-action="book-favorite-soon" type="button">${starIcon("#D4A96A")}</button>
        </div>

        <div class="book-answer-stage">
          <div class="book-answer-card">
            <div class="book-answer-card__theme">
              <span></span>
              <em>${answer.theme}</em>
              <span></span>
            </div>
            <h1>${answer.quote.replace(/。$/, "")}</h1>
            <p class="book-answer-card__decode">${answer.decode.replace(/。$/, "")}</p>
            <div class="book-answer-card__ornament">
              <span></span>
              <em>✦</em>
              <span></span>
            </div>
            <div class="book-answer-card__sign">罗布人村寨 · 答案之书</div>
          </div>
          <div class="book-answer-question">你问：「${state.bookQuestion || "今天开心吗"}」</div>
        </div>

        <div class="book-answer-actions">
          <button class="book-answer-btn" type="button" data-action="book-save-card">
            ${saveIcon("rgba(255,255,255,0.6)")}
            <span>保存卡片</span>
          </button>
          <button class="book-answer-btn book-answer-btn--gold" type="button" data-action="book-share-card">
            ${shareIcon("#D4A96A")}
            <span>分享给朋友</span>
          </button>
          <button class="book-answer-btn" type="button" data-action="book-ask-again" ${askAgainDisabled ? "disabled" : ""}>
            <span>⟳</span>
            <span>再问(${state.bookRemaining})</span>
          </button>
        </div>

        <button class="book-answer-detail" type="button" data-action="book-story-soon">
          <div class="book-answer-detail__copy">
            <div class="book-answer-detail__title">${libraryIcon("#D4A96A")}<span>${meta.detailTitle}</span></div>
            <p>${meta.detailDesc}</p>
          </div>
          ${arrowIcon("#8E6A36")}
        </button>
      </div>
    `;
  }

  function renderBookCollection() {
    const collection = data.bookExperience.collection;
    const total = collection.fragments.length;
    const unlockedCount = Math.min(state.bookCollected, total);
    const progressSegments = Array.from({ length: total })
      .map((_, index) => `<span class="${index < unlockedCount ? "is-on" : ""}"></span>`)
      .join("");
    const preview = state.bookCollectionPreview !== null ? collection.fragments[state.bookCollectionPreview] : null;

    return `
      <div class="screen book-collection-screen">
        ${batteryMarkup(true)}

        <div class="book-collection-top">
          <button class="icon-btn book-collection-back" data-nav="/book" type="button" aria-label="back">${backIcon("#D4A96A")}</button>
          <div class="book-collection-title">${collection.title}</div>
          <div class="book-collection-top__placeholder"></div>
        </div>

        <div class="book-collection-progress">
          <div class="book-collection-progress__head">
            <span>${collection.unlockedLabel}</span>
            <strong>${unlockedCount}/${total} 页</strong>
          </div>
          <div class="book-collection-progress__bar">${progressSegments}</div>
        </div>

        <div class="book-collection-body">
          <div class="book-fragment-grid">
            ${collection.fragments
              .map((fragment, index) => {
                const unlocked = index < unlockedCount;
                return `
                  <button
                    class="book-fragment-card ${unlocked ? "is-unlocked" : "is-locked"}"
                    type="button"
                    ${unlocked ? `data-action="book-fragment-open" data-index="${index}"` : "disabled"}
                  >
                    <span class="book-fragment-card__index">${index + 1}</span>
                    ${
                      unlocked
                        ? `
                          <span class="book-fragment-card__emoji">${fragment.emoji}</span>
                          <span class="book-fragment-card__name">${fragment.title}</span>
                        `
                        : `
                          <span class="book-fragment-card__lock"><img src="${collection.icons.lock}" alt="" /></span>
                          <span class="book-fragment-card__locked">未解锁</span>
                        `
                    }
                  </button>
                `;
              })
              .join("")}
          </div>

          <div class="book-collection-achievement">
            <div class="book-collection-achievement__icon"><img src="${collection.icons.achievement}" alt="" /></div>
            <div class="book-collection-achievement__copy">
              <strong>${collection.achievementTitle}</strong>
              <p>${collection.achievementDesc}</p>
            </div>
            <span class="book-collection-achievement__count">${unlockedCount}/${total}</span>
          </div>

          <button class="book-collection-store" type="button" data-action="book-points-store">
            <span class="book-collection-store__lead">
              <span class="book-collection-store__icon"><img src="${collection.icons.store}" alt="" /></span>
              <span>${collection.storeLabel}</span>
            </span>
            <img class="book-collection-store__chevron" src="${collection.icons.chevron}" alt="" />
          </button>
        </div>

        <div class="book-collection-footer">
          <button class="book-collection-cta" type="button" data-nav="/book-ask">${collection.ctaLabel}</button>
        </div>

        ${
          preview
            ? `
              <div class="book-fragment-preview">
                <button class="book-fragment-preview__scrim" type="button" data-action="book-fragment-close" aria-label="close"></button>
                <div class="book-fragment-preview__dialog">
                  <div class="book-fragment-preview__emoji">${preview.emoji}</div>
                  <h3>${preview.title}</h3>
                  <p>${preview.hint}</p>
                  <div class="book-fragment-preview__page">
                    <span></span>
                    <em>第 ${state.bookCollectionPreview + 1} 页</em>
                    <span></span>
                  </div>
                  <button class="book-fragment-preview__close" type="button" data-action="book-fragment-close">关闭</button>
                </div>
              </div>
            `
            : ""
        }
      </div>
    `;
  }

  function renderBook() {
    if (state.route === "/book") return renderBookHome();
    if (state.route === "/book-collection") return renderBookCollection();
    if (state.route === "/book-ask") return renderBookAsk();
    if (state.route === "/book-answer") return renderBookAnswer();
    return renderBookHome();
  }

  function getTreeEnergy() {
    return data.treeDailyTasks.reduce((total, task) => total + (state.treeTasksDone[task.key] ? task.points : 0), data.treeDashboard.baseEnergy);
  }

  function getTreeCompletedCount() {
    return data.treeDailyTasks.filter((task) => state.treeTasksDone[task.key]).length;
  }

  function renderTreeTaskSheet() {
    const completedCount = getTreeCompletedCount();
    const totalCount = data.treeDashboard.dailyTotal || data.treeDailyTasks.length;

    return `
      <div class="tree-task-sheet">
        <div class="tree-task-sheet__header">
          <div class="tree-task-sheet__title"><span>⚡</span><span>每日任务</span></div>
          <div class="tree-task-sheet__badge">${completedCount}/${totalCount} 已完成</div>
        </div>

        ${data.treeDailyTasks
          .map((task) => {
            const done = state.treeTasksDone[task.key];
            return `
              <div class="tree-daily-card">
                <div class="tree-daily-card__lead">
                  <div class="tree-daily-card__icon" style="background:${task.tint};color:${task.color};">${task.emoji}</div>
                  <div class="tree-daily-card__body">
                    <div class="tree-daily-card__row">
                      <strong>${task.title}</strong>
                      <span style="color:${task.color};">+${task.points}g</span>
                    </div>
                    <p>${task.desc}</p>
                  </div>
                </div>
                <button class="tree-daily-card__cta ${done ? "is-done" : ""}" ${done ? 'type="button" disabled' : `type="button" data-action="${task.action}"`} style="${done ? "" : `background:${task.color};box-shadow:0 6px 18px ${task.shadow};`}">${done ? "已完成" : task.actionLabel}</button>
              </div>
            `;
          })
          .join("")}

        <div class="tree-quick-links">
          ${data.treeQuickLinks
            .map(
              (item) => `
                <button class="tree-quick-link" type="button" data-action="${item.action}">
                  <span class="tree-quick-link__icon">${item.key === "trace" ? traceTargetIcon() : item.icon}</span>
                  <span>${item.label}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderTreeDashboard(tasksOpen) {
    const energy = getTreeEnergy();
    const progressPercent = Math.min(Math.round((energy / data.treeDashboard.maxEnergy) * 100), 100);
    const currentStageIndex = Math.max(
      data.treeStages.findIndex((item) => item.title === data.treeDashboard.stage),
      1
    );

    return `
      <div class="screen tree-screen tree-screen--oasis">
        <div class="tree-oasis">
          ${batteryMarkup(true)}

          <div class="tree-oasis__sun"></div>
          <div class="tree-oasis__cloud tree-oasis__cloud--left"></div>
          <div class="tree-oasis__cloud tree-oasis__cloud--center"></div>
          <div class="tree-oasis__cloud tree-oasis__cloud--right"></div>

          <div class="tree-oasis__toolbar">
            <button class="tree-orb-btn" type="button" data-nav="/explore" aria-label="back">${backIcon("#F5E6CC")}</button>
            <div class="tree-profile-pill">
              <span class="tree-profile-pill__leaf">🌿</span>
              <span class="tree-profile-pill__name">${data.treeDashboard.treeId}</span>
              <span class="tree-profile-pill__level">${data.treeDashboard.level}</span>
            </div>
            <button class="tree-orb-btn tree-orb-btn--trace" type="button" data-action="tree-trace" aria-label="trace">${traceTargetIcon()}</button>
          </div>

          <div class="tree-energy-card">
            <div class="tree-energy-card__value">
              <span class="tree-energy-card__dot"></span>
              <strong>${energy}</strong>
              <span class="tree-energy-card__unit">g</span>
            </div>
            <div class="tree-energy-card__label">成长能量</div>
          </div>

          <div class="tree-progress-panel">
            <div class="tree-progress-row">
              <span>${data.treeDashboard.stage}</span>
              <div class="tree-progress-bar"><div class="tree-progress-bar__fill" style="width:${progressPercent}%;"></div></div>
              <span>${energy}/${data.treeDashboard.maxEnergy}</span>
            </div>
            <div class="tree-stage-rail">
              ${data.treeStages
                .map(
                  (item, index) => `
                    <div class="tree-stage-node ${index < currentStageIndex ? "is-done" : ""} ${index === currentStageIndex ? "is-active" : ""}">
                      <span>${item.emoji}</span>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>

          ${data.treeDashboard.bubbles
            .map(
              (bubble) => `
                <div class="tree-energy-bubble" style="left:${bubble.left};top:${bubble.top};">${bubble.label}</div>
              `
            )
            .join("")}

          ${tasksOpen ? renderTreeTaskSheet() : ""}

          <div class="tree-oasis__terrain">
            <div class="tree-dune tree-dune--1"></div>
            <div class="tree-dune tree-dune--2"></div>
            <div class="tree-dune tree-dune--3"></div>
            <div class="tree-dune tree-dune--4"></div>
            <div class="tree-shrub tree-shrub--left"></div>
            <div class="tree-shrub tree-shrub--center"></div>
            <div class="tree-shrub tree-shrub--right"></div>
            <div class="tree-cactus tree-cactus--left"></div>
            <div class="tree-cactus tree-cactus--right"></div>
            <div class="tree-sapling">
              <div class="tree-sapling__trunk"></div>
              <div class="tree-sapling__crown tree-sapling__crown--left"></div>
              <div class="tree-sapling__crown tree-sapling__crown--center"></div>
              <div class="tree-sapling__crown tree-sapling__crown--right"></div>
            </div>
          </div>

          <div class="tree-oasis__dock">
            <div class="tree-friends">
              <div class="tree-friends__avatars">
                ${data.treeDashboard.friends
                  .map(
                    (friend) => `
                      <span class="tree-friends__avatar" style="color:${friend.color};background:${friend.bg};">${friend.name}</span>
                    `
                  )
                  .join("")}
              </div>
              <div class="tree-friends__body">
                <strong>好友排行</strong>
                <p>5位好友一起守护</p>
              </div>
            </div>

            <button class="tree-dock-primary" type="button" data-action="${tasksOpen ? "tree-close-tasks" : "tree-water"}">
              <span class="tree-dock-primary__icon">${tasksOpen ? "💧" : "💧"}</span>
              <span>${tasksOpen ? "收起" : "浇水"}</span>
            </button>

            <button class="tree-dock-side ${tasksOpen ? "is-active" : ""}" type="button" data-action="${tasksOpen ? "tree-close-tasks" : "tree-open-tasks"}">
              <span class="tree-dock-side__icon">${tasksOpen ? "⌃" : "⌄"}</span>
              <span>任务</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderTreeTrace() {
    const energy = getTreeEnergy();

    return `
      <div class="screen tree-trace-screen">
        ${batteryMarkup(true)}
        <div class="page-top tree-trace__top">
          <button class="icon-btn icon-btn--gold" data-action="tree-back-tasks" type="button">${backIcon("#D4A96A")}</button>
          <div class="page-title page-title--light">胡杨数字溯源</div>
          <div style="width:32px;"></div>
        </div>

        <div class="tree-trace__content">
          <div class="tree-trace__hero">
            <img src="${data.treeTrace.heroImage}" alt="胡杨数字溯源" />
            <div class="tree-trace__hero-overlay"></div>
            <div class="tree-trace__hero-badge">${data.treeCode}</div>
            <div class="tree-trace__hero-pin">⌖</div>
            <div class="tree-trace__hero-meta">
              <span>📍 ${data.treeTrace.location}</span>
              <span>${data.treeTrace.gps}</span>
            </div>
          </div>

          <div class="tree-trace__weather">
            <div class="tree-trace__weather-main">
              <div class="tree-trace__weather-icon"><span class="tree-trace__weather-glyph"></span></div>
              <div>
                <strong>${data.treeTrace.weatherTitle}</strong>
                <p>${data.treeTrace.weatherSub}</p>
              </div>
            </div>
            <div class="tree-trace__temp">${data.treeTrace.temperature}<small>°C</small></div>
          </div>

          <div class="tree-trace__section-title"><span class="tree-trace__section-mark"></span><span>成长日记</span></div>
          <div class="tree-trace__timeline">
            ${data.treeTrace.timeline
              .map(
                (entry, index) => `
                  <div class="tree-trace__entry ${index === 0 ? "is-latest" : ""}">
                    <div class="tree-trace__entry-line"></div>
                    <div class="tree-trace__entry-dot" style="background:${entry.accent};color:${entry.accent};"></div>
                    <div class="tree-trace__entry-copy">
                      <span class="tree-trace__entry-date">${entry.date}</span>
                      <span class="tree-trace__entry-icon">${entry.icon}</span>
                      <span class="tree-trace__entry-text">${entry.text}</span>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>

          <div class="tree-trace__section-title"><span class="tree-trace__section-mark tree-trace__section-mark--edit"></span><span>护林宣言</span></div>
          <div class="tree-trace__pledge">
            <textarea id="treePledge" class="tree-trace__textarea" placeholder="写下你的守护宣言...">${state.treePledge}</textarea>
            <button class="tree-trace__share" type="button" data-action="tree-share-card">✈ 生成分享卡片</button>
          </div>

          <div class="tree-trace__footer-energy">当前成长能量 ${energy}g</div>
        </div>
      </div>
    `;
  }

  function renderTree() {
    if (state.treeStep === 0) {
      return `
        <div class="screen tree-screen screen--warm">
          ${batteryMarkup(false)}
          <div class="page-top">
            <button class="icon-btn icon-btn--light" data-nav="/explore" type="button">${backIcon("#1A1008")}</button>
            <div class="page-title page-title--dark" style="opacity:0.6;font-size:14px;font-weight:600;">胡杨养成计划</div>
            <div style="width:36px;"></div>
          </div>
          <div class="tree-step tree-step--hero">
            <div class="tree-sky"></div>
            <div class="tree-ground"></div>
            <div class="tree-hero-copy">
              <div class="tree-hero-copy__line"><span></span><em>罗布人村寨 · 胡杨守护计划</em><span></span></div>
              <h1>认领一颗胡杨树</h1>
              <p class="tree-hero-copy__sub">守护千年绿洲 · 见证生命奇迹</p>
              <p class="tree-hero-copy__meta">三千年不死 · 不倒 · 不朽</p>
              <div class="tree-benefits">
                <div class="tree-benefit"><div>🌱</div><strong>0元认养</strong><small>免费领取</small></div>
                <div class="tree-benefit"><div>📈</div><strong>每日成长</strong><small>趣味养成</small></div>
                <div class="tree-benefit"><div>🎁</div><strong>解锁权益</strong><small>阶段奖励</small></div>
              </div>
              <button class="tree-hero-btn" data-action="tree-next" type="button">了解养成计划 ${arrowIcon("#ffffff")}</button>
            </div>
          </div>
        </div>
      `;
    }

    if (state.treeStep === 1 || state.treeStep === 2) {
      return `
        <div class="screen tree-screen screen--warm">
          ${batteryMarkup(false)}
          <div class="page-top">
            <button class="icon-btn icon-btn--light" data-action="tree-prev" type="button">${backIcon("#1A1008")}</button>
            <div class="page-title page-title--dark" style="opacity:0.6;font-size:14px;font-weight:600;">胡杨养成计划</div>
            <button class="icon-btn icon-btn--light" data-action="tree-home" type="button">⌂</button>
          </div>
          <div class="tree-body">
            <h2 class="tree-body__title">${state.treeStep === 1 ? "四阶段成长之路" : "三类每日能量任务"}</h2>
            <p class="tree-body__desc">${state.treeStep === 1 ? "积累能量，见证胡杨从种子到英雄树的蜕变" : "每天完成任务获取能量，加速胡杨成长"}</p>
            ${
              state.treeStep === 1
                ? data.treeStages
                    .map(
                      (item) => `
                        <div class="tree-stage-card">
                          <div class="tree-stage-card__head">
                            <div class="tree-stage-card__icon" style="background:linear-gradient(135deg, ${item.color}15, ${item.color}08);border:1.5px solid ${item.color}20;">${item.emoji}</div>
                            <div>
                              <strong>${item.title}</strong>
                              <div class="range-badge" style="background:${item.color}12;color:${item.color};">${item.range}</div>
                              <p>${item.desc}</p>
                              <div class="tree-stage-card__reward">${item.reward}</div>
                            </div>
                          </div>
                          <div class="tree-stage-card__progress" style="background:${item.color}10;">
                            <div class="progress__fill" style="width:${item.progress}%;background:linear-gradient(90deg, ${item.color}60, ${item.color});"></div>
                          </div>
                        </div>
                      `
                    )
                    .join("")
                : data.treeTasks
                    .map(
                      (task) => `
                        <div class="task-card">
                          <div class="task-card__emoji" style="background:linear-gradient(135deg, ${task.color}15, ${task.color}08);border:1.5px solid ${task.color}20;">${task.emoji}</div>
                          <div class="task-card__body">
                            <strong>${task.title}</strong>
                            <p>${task.desc}</p>
                          </div>
                        </div>
                      `
                    )
                    .join("") +
                  `<div class="tree-card"><strong>数字溯源系统</strong><p>GPS实时定位 · 天气同步 · 成长日记 · 区块链存证，每一份守护都真实可溯。</p></div>`
            }
            <button class="tree-secondary-btn" data-action="${state.treeStep === 1 ? "tree-next" : "tree-adopt"}" type="button">${state.treeStep === 1 ? "继续看每日任务" : "立即认养胡杨"}</button>
          </div>
        </div>
      `;
    }

    if (state.treeStep === 3) {
      return renderTreeDashboard(false);
    }

    if (state.treeStep === 4) {
      return renderTreeDashboard(true);
    }

    return renderTreeTrace();
  }

  function renderProfile() {
    return `
      <div class="screen profile-screen">
        ${batteryMarkup(true)}
        <div class="profile-header">
          <div class="profile-row">
            <h1>我的</h1>
            <button class="icon-btn icon-btn--light" type="button" aria-label="settings">⚙</button>
          </div>
          <div class="profile-card">
            <div class="profile-card__avatar">🧑</div>
            <div class="profile-card__body">
              <strong>${data.userName}</strong>
              <p>ID: ${data.userId}</p>
            </div>
            <div class="profile-level">✦ Lv.3</div>
          </div>
        </div>

        <div class="profile-body">
          ${data.profilePanels
            .map(
              (panel) => `
                <div class="profile-panel">
                  <div class="profile-panel__head" style="color:${panel.accent};">
                    <span>${panel.icon}</span>
                    <span>${panel.title}</span>
                  </div>
                  <div class="profile-panel__content">
                    <div>
                      <strong>${panel.main}</strong>
                      <p>${panel.sub}</p>
                    </div>
                    <div class="profile-panel__value" style="color:${panel.accent};">${panel.value}</div>
                  </div>
                </div>
              `
            )
            .join("")}

          <div class="profile-panel profile-tree" data-nav="/tree">
            <div class="profile-tree__row">
              <div class="profile-tree__icon">🌱</div>
              <div style="flex:1;">
                <strong>我的胡杨</strong>
                <div class="profile-tree__meta">
                  <span class="profile-tree__code">${data.treeCode}</span>
                  <span class="profile-tree__stage">三年幼苗</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <div class="profile-tree__bar"><div class="progress__fill" style="width:${(data.treeGrowth / 600) * 100}%;background:linear-gradient(90deg, #D4A96A, #81C784);"></div></div>
                  <span style="color:rgba(255,255,255,0.3);font-size:9px;">${data.treeGrowth}/600</span>
                </div>
              </div>
              <div>${arrowIcon("rgba(212,169,106,0.4)")}</div>
            </div>
          </div>

          <div class="profile-stats">
            ${data.profileStats
              .map(
                (item) => `
                  <div class="profile-stat">
                    <strong style="color:${item.color};">${item.value}</strong>
                    <span>${item.label}</span>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderScreen() {
    if (state.route === "/") return renderStaticPage(data.staticPages.home);
    if (state.route === "/map") return renderStaticPage(data.staticPages.map);
    if (state.route === "/explore") return renderExplore();
    if (state.route === "/museum") return renderMuseum();
    if (state.route === "/courtyard") return renderCourtyard();
    if (state.route === "/courtyard-pala") return renderPalaHouse();
    if (state.route === "/exhibition") return renderExhibition();
    if (state.route === "/craft") return renderCraftHome();
    if (state.route === "/craft-kapen") return renderCraftJourney();
    if (state.route === "/craft-story") return renderCraftStory();
    if (String(state.route).startsWith("/book")) return renderBook();
    if (state.route === "/tree") return renderTree();
    if (state.route === "/profile") return renderStaticPage(data.staticPages.profile);
    return renderMuseum();
  }

  function render() {
    app.innerHTML = renderScreen();
    if (deviceNotch) {
      deviceNotch.classList.toggle("is-hidden", staticImageRoutes.has(state.route));
    }
    renderTabBar();
    bindImageFallbacks(app);
    bindImageFallbacks(tabBar);
    bindEvents();
  }

  function navigate(route) {
    if (!String(route).startsWith("/book")) {
      state.bookOpening = false;
    }
    if (route !== "/book-collection") {
      state.bookCollectionPreview = null;
    }
    if (route !== "/courtyard-pala") {
      stopPalaVoiceTimer();
    } else if (state.route !== "/courtyard-pala") {
      state.palaTab = "home";
      state.palaDetailIndex = 0;
      state.palaVoiceTime = 0;
      state.palaVoicePlaying = false;
    }
    state.route = route;
    render();
  }

  function bindEvents() {
    app.querySelectorAll("[data-nav]").forEach((node) => {
      node.addEventListener("click", function () {
        const route = node.getAttribute("data-nav");
        if (route) navigate(route);
      });
    });

    app.querySelectorAll("[data-action]").forEach((node) => {
      node.addEventListener("click", function () {
        const action = node.getAttribute("data-action");

        if (action === "sign") {
          if (state.signedToday) {
            window.alert("今天已经签到过了");
            return;
          }
          state.signedToday = true;
          state.signStreak += 1;
          state.appPoints += 5;
          render();
          return;
        }

        if (action === "notice-elder") {
          window.alert("AI百岁老人对话页面还在补充中，这里先保留入口风格。");
          return;
        }

        if (action === "courtyard-soon") {
          const name = node.getAttribute("data-name") || "这座小院";
          window.alert(`${name}的落地页还在补充中，这里先保留导览入口。`);
          return;
        }

        if (action === "pala-more") {
          window.alert("帕拉孜小屋的扩展入口还在补充中，这里先保留头部交互。");
          return;
        }

        if (action === "pala-tab") {
          const nextTab = node.getAttribute("data-tab") || "home";
          if (nextTab !== "voice") {
            stopPalaVoiceTimer();
          }
          state.palaTab = nextTab;
          render();
          return;
        }

        if (action === "pala-dismiss") {
          stopPalaVoiceTimer();
          state.palaTab = "home";
          render();
          return;
        }

        if (action === "pala-thumb") {
          state.palaDetailIndex = Number(node.getAttribute("data-index") || 0);
          render();
          return;
        }

        if (action === "pala-toggle-voice") {
          if (state.palaVoicePlaying) {
            stopPalaVoiceTimer();
          } else {
            state.palaTab = "voice";
            startPalaVoiceTimer();
          }
          render();
          return;
        }

        if (action === "pala-seek-back") {
          const resume = state.palaVoicePlaying;
          stopPalaVoiceTimer();
          state.palaVoiceTime = Math.max(0, state.palaVoiceTime - 15);
          if (resume) {
            startPalaVoiceTimer();
          }
          render();
          return;
        }

        if (action === "pala-seek-forward") {
          const resume = state.palaVoicePlaying;
          stopPalaVoiceTimer();
          state.palaVoiceTime = Math.min(data.palaHouse.voiceDuration, state.palaVoiceTime + 15);
          if (resume && state.palaVoiceTime < data.palaHouse.voiceDuration) {
            startPalaVoiceTimer();
          }
          render();
          return;
        }

        if (action === "open-book") {
          if (state.bookRemaining <= 0) {
            window.alert("今天的提问次数已经用完了");
            return;
          }
          if (state.bookOpening) return;
          state.bookOpening = true;
          render();
          const currentRoute = state.route;
          window.setTimeout(() => {
            if (state.route !== currentRoute || !state.bookOpening) return;
            state.bookOpening = false;
            navigate("/book-ask");
          }, 850);
          return;
        }

        if (action === "craft-stage2-soon") {
          window.alert("阶段 2 的分步学习页还在补充中，这里先保留入口。");
          return;
        }

        if (action === "craft-challenge-soon") {
          window.alert("阶段 3 的挑战页还在补充中，这里先保留挑战入口。");
          return;
        }

        if (action === "craft-cert-soon") {
          window.alert("技艺证书页还在补充中，这里先保留入口。");
          return;
        }

        if (action === "craft-watch-video") {
          state.craftStoryWatched = true;
          render();
          return;
        }

        if (action === "craft-finish-story") {
          navigate("/craft-kapen");
          return;
        }

        if (action === "ask-book") {
          const field = document.getElementById("bookQuestionInput");
          const value = field ? field.value.trim().slice(0, 20) : state.bookQuestion.trim().slice(0, 20);
          if (!value) {
            window.alert("先写下你的问题");
            return;
          }
          if (state.bookRemaining <= 0) {
            window.alert("今天的提问次数已经用完了");
            return;
          }
          state.bookAsked = true;
          state.bookQuestion = value;
          state.bookAnswer = data.bookAnswers[Math.floor(Math.random() * data.bookAnswers.length)];
          state.bookRemaining = Math.max(0, state.bookRemaining - 1);
          state.bookCollected = Math.min(state.bookCollected + 1, data.bookExperience.home.collectionTotal);
          navigate("/book-answer");
          return;
        }

        if (action === "book-close-answer") {
          state.bookQuestion = "";
          state.bookAnswer = null;
          navigate("/book");
          return;
        }

        if (action === "book-ask-again") {
          if (state.bookRemaining <= 0) {
            window.alert("今天的提问次数已经用完了");
            return;
          }
          state.bookQuestion = "";
          state.bookAnswer = null;
          navigate("/book-ask");
          return;
        }

        if (action === "book-library-soon") {
          navigate("/book-collection");
          return;
        }

        if (action === "book-fragment-open") {
          const index = Number(node.getAttribute("data-index"));
          if (!Number.isNaN(index)) {
            state.bookCollectionPreview = index;
            render();
          }
          return;
        }

        if (action === "book-fragment-close") {
          state.bookCollectionPreview = null;
          render();
          return;
        }

        if (action === "book-points-store") {
          window.alert("积分商城页还在补充中，这里先保留入口。");
          return;
        }

        if (action === "book-save-card") {
          window.alert("保存卡片功能先保留为演示入口。");
          return;
        }

        if (action === "book-share-card") {
          window.alert("分享给朋友功能先保留为演示入口。");
          return;
        }

        if (action === "book-story-soon") {
          window.alert("谚语故事页还在补充中，这里先保留入口。");
          return;
        }

        if (action === "book-favorite-soon") {
          window.alert("收藏答案卡功能先保留为演示入口。");
          return;
        }

        if (action === "tree-next") {
          state.treeStep = Math.min(state.treeStep + 1, 2);
          render();
          return;
        }

        if (action === "tree-prev") {
          state.treeStep = Math.max(state.treeStep - 1, 0);
          render();
          return;
        }

        if (action === "tree-home") {
          state.treeStep = 0;
          render();
          return;
        }

        if (action === "tree-adopt") {
          state.treeStep = 3;
          render();
          return;
        }

        if (action === "tree-water") {
          state.treeTasksDone.water = true;
          state.treeStep = 4;
          render();
          return;
        }

        if (action === "tree-open-tasks") {
          state.treeStep = 4;
          render();
          return;
        }

        if (action === "tree-close-tasks") {
          state.treeStep = 3;
          render();
          return;
        }

        if (action === "tree-do-water") {
          state.treeTasksDone.water = true;
          render();
          return;
        }

        if (action === "tree-do-patrol") {
          state.treeTasksDone.patrol = true;
          render();
          return;
        }

        if (action === "tree-do-quiz") {
          state.treeTasksDone.quiz = true;
          render();
          return;
        }

        if (action === "tree-trace") {
          state.treeStep = 5;
          render();
          return;
        }

        if (action === "tree-back-tasks") {
          state.treeStep = 4;
          render();
          return;
        }

        if (action === "tree-soon") {
          window.alert("这个入口还在补充中，先保留页面样式。");
          return;
        }

        if (action === "tree-share-card") {
          const field = document.getElementById("treePledge");
          state.treePledge = field ? field.value.trim() : state.treePledge;
          window.alert("分享卡片演示入口已保留，下一版可以继续做成真实弹层。");
          render();
        }
      });
    });

    const bookInput = document.getElementById("bookQuestionInput");
    if (bookInput) {
      const countNode = app.querySelector("[data-book-count]");
      const submitNode = app.querySelector("[data-book-submit]");

      bookInput.addEventListener("input", function () {
        const nextValue = bookInput.value.slice(0, 20);
        if (bookInput.value !== nextValue) {
          bookInput.value = nextValue;
        }

        state.bookQuestion = nextValue;

        if (countNode) {
          countNode.textContent = `${nextValue.length}/20`;
        }

        if (submitNode) {
          const ready = nextValue.trim().length > 0;
          submitNode.disabled = !ready;
          submitNode.classList.toggle("is-ready", ready);
          submitNode.innerHTML = `${planeIcon(ready ? "#D4A96A" : "rgba(255,255,255,0.3)")}<span>问老人</span>`;
        }
      });
    }

    tabBar.querySelectorAll("[data-tab]").forEach((node) => {
      node.addEventListener("click", function () {
        const tab = node.getAttribute("data-tab");
        const route = rootTabRoute[tab] || "/";
        navigate(route);
      });
    });
  }

  function bootstrap() {
    render();
    preloadAppImages();
  }

  bootstrap();
})();
