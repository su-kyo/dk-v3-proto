const app = document.querySelector("#app");
const searchParams = new URLSearchParams(window.location.search);
const initialEntry = searchParams.get("entry");

const DESIGN = {
  stageWidth: 1280,
  stageHeight: 720,
};

const TIMING = {
  zoomMs: 1200,
  uiRevealMs: 760,
};

const DEBUG_STORAGE_KEY = "dk-main-proto-ver3-debug-state";
const DEBUG_ENABLED = new URLSearchParams(window.location.search).get("debug") === "1";
const DEBUG_DEFAULTS = {
  achievementOff: false,
  seedletterCompleted: false,
  aconNoticeVisible: true,
  event1Visible: true,
  event2Visible: true,
  graduationMode: false,
  subscriptionActive: true,
  show2022Curriculum: false,
};

const GENERAL_PAGE_ROUTES = {
  notice: "../dk-etc-pages/notice.html",
  "my-info": "../dk-etc-pages/my-info.html",
  "study-record": "../dk-etc-pages/study-record.html",
  "report-list": "../dk-etc-pages/report-list.html",
  settings: "../dk-etc-pages/settings.html",
};

const HOME_STATE = {
  phase: initialEntry === "landed" ? "landed" : "login",
  sidebarOpen: false,
  presetOpen: false,
  licenseTooltipOpen: false,
  routeLoadingOpen: false,
};

let DEBUG_STATE = loadDebugState();

const refs = {
  homeScreen: app.querySelector("[data-home-screen]"),
  stageRoot: app.querySelector("[data-stage-root]"),
  sidebarLayer: app.querySelector("[data-sidebar-layer]"),
  sidebarBadge: app.querySelector(".sidebar-header__badge"),
  presetLayer: app.querySelector("[data-preset-layer]"),
  routeLoadingLayer: app.querySelector("[data-route-loading]"),
  seedletterImage: app.querySelector("[data-seedletter-img]"),
  licenseTooltip: app.querySelector("[data-license-tooltip]"),
  licenseBadge: app.querySelector(".license-badge"),
  sidebarLicenseBadge: app.querySelector(".sidebar-header__badge"),
  achievementAnchor: app.querySelector("[data-achievement-anchor]"),
  tableScene: app.querySelector("[data-table-scene]"),
  aconNotice: app.querySelector("[data-acon-notice]"),
  event1: app.querySelector('[data-event-slot="event1"]'),
  event2: app.querySelector('[data-event-slot="event2"]'),
  crownProgressPanel: app.querySelector("[data-crown-progress-panel]"),
  ctaButton: app.querySelector('[data-action="cta"]'),
  ctaLabel: app.querySelector("[data-cta-label]"),
  pinoImage: app.querySelector("[data-pino-img]"),
  debugPanel: app.querySelector("[data-debug-panel]"),
};

const SEEDLETTER_IMAGES = {
  default: "./source/seedletter.png",
  done1: "./source/seedletter-done1.png",
  done2: "./source/seedletter-done2.png",
  done3: "./source/seedletter-done3.png",
};

let landingTimer = null;
let uiTimer = null;

bindEvents();
applyStageScale();
renderDebugPanel();
applyDebugState();
syncLicenseTooltip();
syncRouteLoading();
hydrateInitialView();

function bindEvents() {
  app.addEventListener("click", handleClick);
  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("storage", handleStorage);
}

function handleClick(event) {
  const trigger = event.target.closest("[data-action]");

  if (HOME_STATE.licenseTooltipOpen) {
    const tooltipArea = event.target.closest("[data-license-tooltip], .license-badge, .sidebar-header__badge");
    const sidebarControl = event.target.closest("[data-sidebar-layer], [data-action='sidebar-open'], [data-action='sidebar-close']");
    if (!tooltipArea && !sidebarControl) {
      HOME_STATE.licenseTooltipOpen = false;
      syncLicenseTooltip();
    }
  }

  if (!trigger) return;

  const action = trigger.dataset.action;

  if (action === "login") {
    startLoginFlow();
    return;
  }

  if (action === "sidebar-open") {
    setSidebarOpen(true);
    return;
  }

  if (action === "sidebar-close") {
    setSidebarOpen(false);
    return;
  }

  if (action === "object") {
    const target = trigger.dataset.target;
    if (target === "board") {
      startRouteLoading(GENERAL_PAGE_ROUTES["study-record"], "학습 기록으로 이동하는 중");
      return;
    }
  }

  if (action === "notice" || action === "notice-link") {
    startRouteLoading(GENERAL_PAGE_ROUTES.notice, "공지사항으로 이동하는 중");
    return;
  }

  if (action === "sidebar-item") {
    const navTarget = trigger.dataset.navTarget;
    const href = navTarget ? GENERAL_PAGE_ROUTES[navTarget] : "";
    if (href) {
      setSidebarOpen(false);
      startRouteLoading(href, "페이지로 이동하는 중");
      return;
    }
    setSidebarOpen(false);
    trigger.blur();
    return;
  }

  if (action === "preset-close") {
    setPresetOpen(false);
    return;
  }

  if (action === "debug-toggle") {
    const key = trigger.dataset.debugKey;
    if (key && key in DEBUG_DEFAULTS) {
      DEBUG_STATE = {
        ...DEBUG_STATE,
        [key]: !DEBUG_STATE[key],
      };
      persistDebugState();
      renderDebugPanel();
      applyDebugState();
    }
    return;
  }

  if (action === "license-tooltip") {
    if (DEBUG_STATE.subscriptionActive) return;
    HOME_STATE.licenseTooltipOpen = !HOME_STATE.licenseTooltipOpen;
    syncLicenseTooltip();
    trigger.blur();
    return;
  }

  if (action === "cta") {
    if (!DEBUG_STATE.subscriptionActive) return;
    startRouteLoading("./map.html", "학습 진행 현황으로 이동하는 중");
    return;
  }

  trigger.blur();
}

function handleKeydown(event) {
  if (event.key !== "Escape") return;

  if (HOME_STATE.sidebarOpen) {
    setSidebarOpen(false);
    return;
  }

  if (HOME_STATE.presetOpen) {
    setPresetOpen(false);
    return;
  }

  if (HOME_STATE.licenseTooltipOpen) {
    HOME_STATE.licenseTooltipOpen = false;
    syncLicenseTooltip();
    return;
  }

  if (DEBUG_ENABLED && HOME_STATE.phase === "landed") {
    setPresetOpen(true);
  }
}

function startLoginFlow() {
  if (HOME_STATE.phase !== "login") return;

  HOME_STATE.phase = "intro";
  app.classList.add("is-transitioning");
  app.classList.add("is-home");
  refs.homeScreen.setAttribute("aria-hidden", "false");

  clearTimeout(landingTimer);
  clearTimeout(uiTimer);

  requestAnimationFrame(() => {
    app.classList.add("is-landed");
  });

  uiTimer = window.setTimeout(() => {
    app.classList.add("is-ui-visible");
  }, TIMING.uiRevealMs);

  landingTimer = window.setTimeout(() => {
    HOME_STATE.phase = "landed";
    app.classList.remove("is-transitioning");
  }, TIMING.zoomMs);
}

function setSidebarOpen(open) {
  HOME_STATE.sidebarOpen = open;
  refs.sidebarLayer.hidden = !open;
  refs.sidebarLayer.classList.toggle("is-open", open);
  refs.sidebarLayer.setAttribute("aria-hidden", String(!open));
  HOME_STATE.licenseTooltipOpen = open && !DEBUG_STATE.subscriptionActive;
  syncLicenseTooltip();
}

function setPresetOpen(open) {
  HOME_STATE.presetOpen = open;
  refs.presetLayer.hidden = !open;
  refs.presetLayer.classList.toggle("is-open", open);
  refs.presetLayer.setAttribute("aria-hidden", String(!open));
}

function applyDebugState() {
  refs.seedletterImage.src = DEBUG_STATE.seedletterCompleted
    ? SEEDLETTER_IMAGES.done1
    : SEEDLETTER_IMAGES.default;

  setElementVisible(refs.achievementAnchor, !DEBUG_STATE.achievementOff);
  refs.tableScene?.classList.toggle("is-achievement-hidden", DEBUG_STATE.achievementOff);
  setElementVisible(refs.aconNotice, DEBUG_STATE.aconNoticeVisible);
  setElementVisible(refs.event1, DEBUG_STATE.event1Visible);
  setElementVisible(refs.event2, DEBUG_STATE.event2Visible);
  setElementVisible(refs.crownProgressPanel, DEBUG_STATE.graduationMode);

  if (refs.pinoImage) {
    refs.pinoImage.src = DEBUG_STATE.graduationMode ? "./source/pino-graduate.svg" : "./source/pino.svg";
  }

  if (refs.ctaLabel) {
    refs.ctaLabel.textContent = DEBUG_STATE.graduationMode ? "왕관모으러 가기" : "학습하러 가기";
  }

  if (refs.ctaButton) {
    refs.ctaButton.disabled = !DEBUG_STATE.subscriptionActive;
    refs.ctaButton.setAttribute("aria-disabled", String(!DEBUG_STATE.subscriptionActive));
  }

  setElementVisible(refs.sidebarLicenseBadge, !DEBUG_STATE.subscriptionActive);
  HOME_STATE.licenseTooltipOpen = HOME_STATE.sidebarOpen && !DEBUG_STATE.subscriptionActive;

  syncLicenseTooltip();
}

function applyStageScale() {
  const scale = Math.max(
    window.innerWidth / DESIGN.stageWidth,
    window.innerHeight / DESIGN.stageHeight,
  );

  document.documentElement.style.setProperty("--stage-scale", String(scale));
  positionLicenseTooltip();
}

function syncLicenseTooltip() {
  refs.licenseTooltip.hidden = !HOME_STATE.licenseTooltipOpen;
  refs.licenseTooltip.classList.toggle("is-open", HOME_STATE.licenseTooltipOpen);
  refs.licenseTooltip.setAttribute("aria-hidden", String(!HOME_STATE.licenseTooltipOpen));
  if (refs.licenseBadge) {
    refs.licenseBadge.setAttribute("aria-expanded", String(HOME_STATE.licenseTooltipOpen));
  }
  if (HOME_STATE.licenseTooltipOpen) {
    requestAnimationFrame(positionLicenseTooltip);
  }
}

function renderDebugPanel() {
  if (!refs.debugPanel) return;
  refs.debugPanel.innerHTML = `
    <section class="debug-panel__group">
      <h3 class="debug-panel__group-title">공통</h3>
      ${renderDebugRow("씨앗글자 완료", "home / map 씨앗글자 완료 버전", "seedletterCompleted")}
    </section>
    <section class="debug-panel__group">
      <h3 class="debug-panel__group-title">Home 전용</h3>
      ${renderDebugRow("업적 off", "업적책과 업적 배지 숨김", "achievementOff")}
      ${renderDebugRow("아콘 공지사항", "말풍선 공지 show / hide", "aconNoticeVisible")}
      ${renderDebugRow("이벤트1", "바닷속 도서관 버튼", "event1Visible")}
      ${renderDebugRow("이벤트2", "이벤트 타이틀 버튼", "event2Visible")}
      ${renderDebugRow("졸업모드", "CTA / 왕관 UI / 피노 교체", "graduationMode")}
      ${renderDebugRow("이용기간", "off 시 CTA 비활성", "subscriptionActive")}
    </section>
  `;
}

function renderDebugRow(label, hint, key) {
  const active = Boolean(DEBUG_STATE[key]);
  const stateLabel = active ? "ON" : "OFF";
  return `
    <div class="debug-panel__row">
      <div class="debug-panel__label">
        <strong class="debug-panel__name">${label}</strong>
        <span class="debug-panel__hint">${hint}</span>
      </div>
      <button
        class="debug-toggle ${active ? "is-on" : ""}"
        type="button"
        data-action="debug-toggle"
        data-debug-key="${key}"
        aria-pressed="${active ? "true" : "false"}"
      >${stateLabel}</button>
    </div>
  `;
}

function loadDebugState() {
  try {
    const raw = window.localStorage.getItem(DEBUG_STORAGE_KEY);
    if (!raw) return { ...DEBUG_DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEBUG_DEFAULTS, ...parsed };
  } catch {
    return { ...DEBUG_DEFAULTS };
  }
}

function persistDebugState() {
  try {
    window.localStorage.setItem(DEBUG_STORAGE_KEY, JSON.stringify(DEBUG_STATE));
  } catch {}
}

function syncRouteLoading() {
  refs.routeLoadingLayer.hidden = !HOME_STATE.routeLoadingOpen;
  refs.routeLoadingLayer.classList.toggle("is-open", HOME_STATE.routeLoadingOpen);
  refs.routeLoadingLayer.setAttribute("aria-hidden", String(!HOME_STATE.routeLoadingOpen));
  const label = refs.routeLoadingLayer.querySelector("span");
  if (label && refs.routeLoadingLayer.dataset.label) {
    label.textContent = refs.routeLoadingLayer.dataset.label;
  }
}

function startRouteLoading(href, label) {
  HOME_STATE.routeLoadingOpen = true;
  refs.routeLoadingLayer.dataset.label = label;
  syncRouteLoading();
  window.setTimeout(() => {
    window.location.href = href;
  }, 620);
}

function hydrateInitialView() {
  if (initialEntry !== "landed") return;
  app.classList.add("is-home", "is-landed", "is-ui-visible");
  refs.homeScreen.setAttribute("aria-hidden", "false");
}

function handleResize() {
  applyStageScale();
}

function handleStorage(event) {
  if (event.key !== DEBUG_STORAGE_KEY) return;
  DEBUG_STATE = loadDebugState();
  renderDebugPanel();
  applyDebugState();
}

function positionLicenseTooltip() {
  const tooltip = refs.licenseTooltip;
  if (!tooltip) return;

  const tooltipRect = tooltip.getBoundingClientRect();
  const safeMargin = 16;

  if (HOME_STATE.sidebarOpen && refs.sidebarBadge) {
    const badgeRect = refs.sidebarBadge.getBoundingClientRect();
    const left = Math.max(
      safeMargin,
      badgeRect.left - tooltipRect.width - 14,
    );
    const top = Math.max(
      safeMargin,
      badgeRect.top + badgeRect.height / 2 - tooltipRect.height / 2,
    );

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    return;
  }

  const anchor = refs.licenseBadge;
  const stageRoot = refs.stageRoot;
  if (!anchor || !stageRoot) return;

  const anchorRect = anchor.getBoundingClientRect();
  const left = Math.min(
      window.innerWidth - tooltipRect.width - safeMargin,
      anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2,
    );
  const top = Math.max(safeMargin, anchorRect.bottom + 12);

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function setElementVisible(element, visible) {
  if (!element) return;
  element.hidden = !visible;
  element.style.display = visible ? "" : "none";
  element.setAttribute("aria-hidden", String(!visible));
}
