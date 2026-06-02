const app = document.querySelector("#map-app");
const modalRoot = document.querySelector("#modal-root");

const MAP_ASSET = "./source/";
const NODE_ASSET = "./source/node-new/";
const DEBUG_ENABLED = new URLSearchParams(window.location.search).get("debug") === "1";
const GENERAL_PAGE_ROUTES = {
  home: "./index.html?entry=landed",
  notice: "../dk-etc-pages/notice.html",
  "my-info": "../dk-etc-pages/my-info.html",
  "study-record": "../dk-etc-pages/study-record.html",
  "report-list": "../dk-etc-pages/report-list.html",
  settings: "../dk-etc-pages/settings.html",
};

const DESIGN = {
  stageWidth: 1280,
  stageHeight: 720,
  roadWidth: 1280,
  roadHeight: 452,
  roadTop: 258,
  bgWidth: 1920,
  segmentCount: 9,
  worldWidth: 1280 * 9,
};

const TERM = {
  id: "g3s1",
  label: "3학년 1학기",
  curriculumYear: "2015",
  type: "high",
  totalChapters: 72,
  subjects: ["kor", "sci"],
  trainings: ["word", "textbook", "practice"],
};

const SUBJECTS = {
  kor: { id: "kor", label: "국어", asset: "subject-kor.png", selectedAsset: "subject-kor-selected.png" },
  sci: { id: "sci", label: "과학", asset: "subject-sci.png", selectedAsset: "subject-sci-selected.png" },
};

const TRAININGS = {
  word: { id: "word", label: "단어" },
  textbook: { id: "textbook", label: "교과서" },
  practice: { id: "practice", label: "실전" },
};

const PARALLAX = {
  backgroundFactor: 0.5,
};

const DEBUG_STORAGE_KEY = "dk-main-proto-ver3-debug-state";
const DEBUG_DEFAULTS = {
  achievementOff: false,
  seedletterCompleted: false,
  aconNoticeVisible: true,
  event1Visible: true,
  event2Visible: true,
  graduationMode: false,
  subscriptionActive: true,
};

const COMPLETION_TIMING = {
  focusMs: 820,
  spotlightMs: 340,
  completeOutroMs: 460,
  completeIntroMs: 600,
  reviewOutroMs: 360,
  reviewIntroMs: 540,
  holdMs: 160,
};

const BG_TILE_STEP = DESIGN.bgWidth;
const BG_FILES = {
  spring: "map-bg1-spring-1920.svg",
  mixing: "map-bg1-mixing-1920.svg",
  summer: "map-bg1-summer-1920.svg",
};
const BG_TILE_SEQUENCE = [
  { left: -BG_TILE_STEP, theme: "spring", extra: true },
  { left: 0, theme: "spring" },
  { left: BG_TILE_STEP, theme: "mixing" },
  { left: BG_TILE_STEP * 2, theme: "summer" },
  { left: BG_TILE_STEP * 3, theme: "summer", extra: true },
];

const ROAD_THEME_BY_SEGMENT = [
  "spring",
  "spring",
  "spring",
  "spring",
  "summer",
  "summer",
  "summer",
  "summer",
  "summer",
];

const EXTRA_ROAD_TILES = [
  { left: -DESIGN.roadWidth, theme: "spring", extra: true },
  { left: DESIGN.worldWidth, theme: "summer", extra: true },
];

const SEGMENT_NODE_POSITIONS = [
  { x: 168, y: 488 },
  { x: 444, y: 398 },
  { x: 748, y: 394 },
  { x: 632, y: 540 },
  { x: 404, y: 624 },
  { x: 676, y: 658 },
  { x: 956, y: 650 },
  { x: 1178, y: 584 },
];

const SEGMENT_STATE_TEMPLATES = [
  ["done", "done", "done", "done", "done", "progress", "default", "lock"],
  ["done", "done", "done", "done", "done", "default", "default", "lock"],
  ["done", "done", "done", "done", "done", "progress", "default", "lock"],
  ["done", "done", "done", "done", "default", "default", "lock", "lock"],
  ["done", "done", "done", "done", "default", "progress", "default", "lock"],
  ["done", "done", "done", "default", "default", "default", "lock", "lock"],
  ["done", "done", "done", "default", "default", "progress", "lock", "lock"],
  ["done", "done", "default", "default", "default", "default", "lock", "lock"],
  ["done", "default", "default", "default", "default", "default", "lock", "lock"],
];

const DONE_LEVEL_SEQUENCE = [2, 3, 1, 4, 5];
const SCORE_PRESETS = {
  1: [100, 98, 99, 97, 100, 99],
  2: [93, 91, 89, 90, 92, 88],
  3: [84, 83, 81, 79, 82, 80],
  4: [72, 70, 68, 66, 69, 65],
  5: [58, 56, 54, 52, 55, 50],
};

const DONE_PLATES = {
  2: "plate-2nd.svg",
  3: "plate-3rd.svg",
  4: "plate-4th.svg",
  5: "plate-5th.svg",
};

const FIRST_PLATES = {
  spring: "plate-spring-1st.svg",
  summer: "plate-summer-1st.svg",
};

const FLAGS = {
  spring: {
    1: "flag-spring-1st.svg",
    2: "flag-spring-2nd.svg",
    3: "flag-spring-3rd.svg",
    4: "flag-spring-4th.svg",
    5: "flag-spring-5th.svg",
  },
  summer: {
    1: "flag-summer-1st.svg",
    2: "flag-summer-2nd.svg",
    3: "flag-summer-3rd.svg",
    4: "flag-summer-4th.svg",
    5: "flag-summer-5th.svg",
  },
};

const CROWNS = {
  spring: "crown-spring.svg",
  summer: "crown-summer.svg",
};

const state = {
  chapters: buildChapters(),
  lastLearning: null,
};

let DEBUG_STATE = loadDebugState();

let activeModal = null;
let transientScene = null;
let learningSession = null;
let rememberedScrollLeft = 0;
let modalOpenTimer = null;
let dragState = null;
let suppressChapterClickUntil = 0;
let currentScale = 1;
let sidebarOpen = false;
let routeLoading = null;
let completionSequence = null;
let debugPanelOpen = false;
let curriculumNoticeOpen = true;

renderMap();
applyScale();
bindGlobalEvents();

function buildChapters() {
  const chapters = [];
  let doneOrdinal = 0;

  for (let segmentIndex = 0; segmentIndex < DESIGN.segmentCount; segmentIndex += 1) {
    const template = SEGMENT_STATE_TEMPLATES[segmentIndex];
    template.forEach((status, slotIndex) => {
      const number = segmentIndex * SEGMENT_NODE_POSITIONS.length + slotIndex + 1;
      const pattern = SEGMENT_NODE_POSITIONS[slotIndex];
      const chapter = {
        id: `ch${number}`,
        number,
        title: `${number}회차`,
        x: segmentIndex * DESIGN.roadWidth + pattern.x,
        y: pattern.y,
        locked: status === "lock",
        startedAt: null,
        firstCompletedAt: null,
        lastReviewedAt: null,
        scoreLevel: null,
        scores: createBlankScores(),
      };

      if (status === "progress") {
        applyProgressPreset(chapter);
      }

      if (status === "done") {
        const scoreLevel = DONE_LEVEL_SEQUENCE[doneOrdinal % DONE_LEVEL_SEQUENCE.length];
        chapter.scoreLevel = scoreLevel;
        applyScoresFromPreset(chapter.scores, SCORE_PRESETS[scoreLevel]);
        chapter.firstCompletedAt = `2026-03-${String((doneOrdinal % 21) + 1).padStart(2, "0")}`;
        if (doneOrdinal % 4 === 0) {
          chapter.lastReviewedAt = `2026-04-${String((doneOrdinal % 18) + 2).padStart(2, "0")}`;
        }
        doneOrdinal += 1;
      }

      chapters.push(chapter);
    });
  }

  return chapters;
}

function createBlankScores() {
  return {
    kor: { word: null, textbook: null, practice: null },
    sci: { word: null, textbook: null, practice: null },
  };
}

function applyScoresFromPreset(scores, values) {
  const order = [
    ["kor", "word"],
    ["kor", "textbook"],
    ["kor", "practice"],
    ["sci", "word"],
    ["sci", "textbook"],
    ["sci", "practice"],
  ];

  order.forEach(([subjectId, trainingId], index) => {
    scores[subjectId][trainingId] = values[index] ?? null;
  });
}

function applyProgressPreset(chapter) {
  const variant = chapter.number % 4;
  const partials = [
    [["kor", "word", 96], ["kor", "textbook", 92], ["kor", "practice", 90], ["sci", "word", 88], ["sci", "textbook", 91]],
    [["kor", "word", 84], ["kor", "textbook", 86], ["sci", "word", 82], ["sci", "textbook", 79], ["sci", "practice", 80]],
    [["kor", "word", 77], ["kor", "practice", 81], ["sci", "word", 74], ["sci", "textbook", 76], ["sci", "practice", 78]],
    [["kor", "textbook", 69], ["kor", "practice", 72], ["sci", "word", 67], ["sci", "textbook", 70], ["sci", "practice", 73]],
  ][variant];

  partials.forEach(([subjectId, trainingId, score]) => {
    chapter.scores[subjectId][trainingId] = score;
  });
  chapter.startedAt = `2026-04-${String((chapter.number % 18) + 2).padStart(2, "0")}`;
}

function getChapters() {
  return state.chapters.slice().sort((a, b) => a.number - b.number);
}

function getCurrentChapter(chapterId) {
  return state.chapters.find((chapter) => chapter.id === chapterId) || null;
}

function getCompletedScores(chapter) {
  return TERM.subjects.flatMap((subjectId) =>
    TERM.trainings
      .map((trainingId) => chapter.scores?.[subjectId]?.[trainingId])
      .filter((score) => Number.isFinite(score))
  );
}

function getChapterState(chapter) {
  if (chapter.locked) return "locked";
  const completedCount = getCompletedScores(chapter).length;
  if (completedCount === 0 && !chapter.startedAt) return "not_started";
  if (completedCount >= TERM.subjects.length * TERM.trainings.length) return "completed";
  return "in_progress";
}

function getAverageScore(chapter) {
  const scores = getCompletedScores(chapter);
  if (!scores.length) return null;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function getScoreLevelFromAverage(score) {
  if (!Number.isFinite(score)) return null;
  if (score === 100) return 1;
  if (score >= 88) return 2;
  if (score >= 76) return 3;
  if (score >= 64) return 4;
  return 5;
}

function getMapScoreLevel(chapter) {
  if (getChapterState(chapter) !== "completed") return null;
  return chapter.scoreLevel || getScoreLevelFromAverage(getAverageScore(chapter));
}

function getStarLevel(score) {
  if (!Number.isFinite(score)) return "empty";
  if (score <= 19) return 1;
  if (score <= 39) return 2;
  if (score <= 59) return 3;
  if (score <= 79) return 4;
  return 5;
}

function getStarAsset(score) {
  const level = getStarLevel(score);
  return level === "empty" ? "training-score-empty.svg" : `training-score-${level}.svg`;
}

function getScoreGrade(score) {
  const level = getScoreLevelFromAverage(score);
  if (level === 1) return "A";
  if (level === 2) return "B";
  if (level === 3) return "C";
  if (level === 4) return "D";
  if (level === 5) return "F";
  return null;
}

function getReviewScoreLevel(subjectId, previousLevel) {
  if (subjectId === "kor") return 1;
  const candidates = [1, 2, 3, 4, 5].filter((level) => level !== previousLevel);
  return candidates[Math.floor(Math.random() * candidates.length)] || 1;
}

function getProgressMeta() {
  const doneCount = getChapters().filter((chapter) => getChapterState(chapter) === "completed").length;
  return {
    count: doneCount,
    text: `${doneCount}/${TERM.totalChapters}`,
    value: doneCount / TERM.totalChapters,
  };
}

function getSeasonForChapter(number) {
  return number <= 36 ? "spring" : "summer";
}

function getNodeVisual(chapter) {
  const chapterState = getChapterState(chapter);
  const season = getSeasonForChapter(chapter.number);
  const scoreLevel = getMapScoreLevel(chapter);

  if (chapterState === "locked") {
    return { plate: `${NODE_ASSET}plate-lock.svg` };
  }

  if (chapterState === "not_started") {
    return { plate: `${NODE_ASSET}plate-default.svg` };
  }

  if (chapterState === "in_progress") {
    return {
      plate: `${NODE_ASSET}plate-progress.svg`,
      tent: `${MAP_ASSET}tent.png`,
      deco: `${MAP_ASSET}node-ing-deco.png`,
    };
  }

  const plate =
    scoreLevel === 1
      ? `${NODE_ASSET}${FIRST_PLATES[season]}`
      : `${NODE_ASSET}${DONE_PLATES[scoreLevel]}`;

  return {
    plate,
    flag: `${NODE_ASSET}${FLAGS[season][scoreLevel]}`,
    crown: scoreLevel === 1 ? `${NODE_ASSET}${CROWNS[season]}` : null,
  };
}

function renderMap() {
  const progress = getProgressMeta();
  app.innerHTML = `
    <div class="map-scroll" data-map-scroll>
      <div class="map-stage">
        <div class="map-world">
          <div class="map-background-layer" aria-hidden="true">
            ${renderBgTiles()}
          </div>
          <div class="map-road-layer" aria-hidden="true">
            ${renderRoadTiles()}
          </div>
          <div class="map-nodes-layer">
            ${getChapters().map(renderChapterNode).join("")}
          </div>
        </div>
      </div>
    </div>

    ${renderTopBar(progress)}

    <button class="map-seedletter" type="button" aria-label="씨앗글자">
      <img src="${getMapSeedletterAsset()}" alt="씨앗글자" />
      <span class="map-seedletter__label">씨앗글자</span>
    </button>

    ${renderCompletionOverlay()}
    ${renderSidebar()}
    ${renderDebugPanel()}
    ${renderLoading()}
    ${learningSession ? renderLearningView() : ""}
  `;

  const scrollEl = app.querySelector("[data-map-scroll]");
  scrollEl.scrollLeft = Math.min(rememberedScrollLeft || getStartGutter(), getMaxScrollLeft(scrollEl));
  syncParallax(scrollEl);

  scrollEl.addEventListener("scroll", () => {
    rememberedScrollLeft = scrollEl.scrollLeft;
    syncParallax(scrollEl);
  });

  scrollEl.addEventListener("wheel", handleHorizontalWheel, { passive: false });
  attachDrag(scrollEl);

  app.querySelectorAll("[data-chapter-id]").forEach((button) => {
    button.addEventListener("click", () => handleChapterClick(button.dataset.chapterId));
  });

  app.querySelector("[data-go-home]").addEventListener("click", () => {
    startRouteLoading("./index.html?entry=landed", "트리하우스로 돌아가는 중");
  });

  app.querySelector("[data-gear-toggle]")?.addEventListener("click", () => {
    startRouteLoading(GENERAL_PAGE_ROUTES.settings, "학습환경설정으로 이동하는 중");
  });

  app.querySelector("[data-curriculum-notice-close]")?.addEventListener("click", () => {
    curriculumNoticeOpen = false;
    renderMap();
  });

  app.querySelector("[data-sidebar-open]").addEventListener("click", () => setSidebarOpen(true));
  app.querySelector("[data-sidebar-close]").addEventListener("click", () => setSidebarOpen(false));
  app.querySelector("[data-sidebar-dim]").addEventListener("click", () => setSidebarOpen(false));
  app.querySelector("[data-debug-close]")?.addEventListener("click", () => setDebugPanelOpen(false));
  app.querySelector("[data-debug-dim]")?.addEventListener("click", () => setDebugPanelOpen(false));
  app.querySelectorAll("[data-debug-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.debugKey;
      if (!key || !(key in DEBUG_DEFAULTS)) return;
      DEBUG_STATE = {
        ...DEBUG_STATE,
        [key]: !DEBUG_STATE[key],
      };
      persistDebugState();
      renderMap();
    });
  });
  app.querySelectorAll("[data-map-link]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mapLink === "home") {
        startRouteLoading("./index.html?entry=landed", "트리하우스로 돌아가는 중");
        return;
      }
      setSidebarOpen(false);
    });
  });

  app.querySelectorAll("[data-map-link]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.mapLink;
      const href = target ? GENERAL_PAGE_ROUTES[target] : "";
      if (!href || target === "home") return;
      startRouteLoading(href, "페이지로 이동하는 중");
    });
  });

  app.querySelector(".map-seedletter").addEventListener("click", () => {
    app.querySelector(".map-seedletter").animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-10px) scale(1.04)" },
        { transform: "translateY(0) scale(1)" },
      ],
      { duration: 420, easing: "cubic-bezier(.18,1.2,.3,1)" }
    );
  });

  if (learningSession) attachLearningEvents();
}

function getMapSeedletterAsset() {
  return DEBUG_STATE.seedletterCompleted ? `${MAP_ASSET}seedletter-done1.png` : `${MAP_ASSET}seedletter.png`;
}

function renderBgTiles() {
  return BG_TILE_SEQUENCE.map(
    ({ left, theme }) =>
      `<img class="map-bg-tile" src="${MAP_ASSET}${BG_FILES[theme]}" alt="" style="left:${left}px" />`
  ).join("");
}

function renderRoadTiles() {
  const mainTiles = ROAD_THEME_BY_SEGMENT.map((theme, index) => {
    const left = index * DESIGN.roadWidth;
    return `<img class="map-road-tile" src="${MAP_ASSET}road-${theme}.svg" alt="" style="left:${left}px" />`;
  });

  const bufferTiles = EXTRA_ROAD_TILES.map(
    ({ left, theme }) => `<img class="map-road-tile" src="${MAP_ASSET}road-${theme}.svg" alt="" style="left:${left}px" />`
  );

  return [...bufferTiles.slice(0, 1), ...mainTiles, ...bufferTiles.slice(1)].join("");
}

function renderChapterNode(chapter) {
  const visual = getNodeVisual(chapter);
  const chapterState = getChapterState(chapter);
  const sequenceForChapter = completionSequence?.chapterId === chapter.id ? completionSequence : null;
  const transientMarkup =
    !sequenceForChapter && transientScene?.chapterId === chapter.id && chapterState === "not_started"
      ? `
        <span class="map-node-transient-scene ${transientScene.phase}">
          <img class="map-node-tent transient-tent" src="${MAP_ASSET}tent.png" alt="" />
          <img class="map-node-deco transient-deco" src="${MAP_ASSET}node-ing-deco.png" alt="" />
        </span>
      `
      : "";

  return `
    <div class="map-chapter ${chapterState}${sequenceForChapter ? " is-sequence-target" : ""}" style="left:${chapter.x}px; top:${chapter.y}px">
      <button
        class="map-chapter__button ${chapterState}${sequenceForChapter ? " is-transitioning" : ""}"
        type="button"
        ${chapterState === "locked" ? "disabled aria-disabled=\"true\"" : `data-chapter-id="${chapter.id}"`}
        aria-label="${chapter.number}회차 ${chapterState === "locked" ? "잠금" : "열기"}"
      >
        ${
          sequenceForChapter
            ? renderCompletionTransitionNode(sequenceForChapter)
            : `${renderNodeVisualMarkup(visual)}${transientMarkup}`
        }
      </button>
      <div class="map-chapter__label">${chapter.number}회차</div>
    </div>
  `;
}

function renderNodeVisualMarkup(visual, classMap = {}) {
  return `
    <img class="map-node-plate ${classMap.plate || ""}" src="${visual.plate}" alt="" />
    ${visual.flag ? `<img class="map-node-flag ${classMap.flag || ""}" src="${visual.flag}" alt="" />` : ""}
    ${visual.crown ? `<img class="map-node-crown ${classMap.crown || ""}" src="${visual.crown}" alt="" />` : ""}
    ${visual.tent ? `<img class="map-node-tent ${classMap.tent || ""}" src="${visual.tent}" alt="" />` : ""}
    ${visual.deco ? `<img class="map-node-deco ${classMap.deco || ""}" src="${visual.deco}" alt="" />` : ""}
  `;
}

function renderCompletionTransitionNode(sequence) {
  if (sequence.mode === "complete") {
    if (sequence.phase === "focus" || sequence.phase === "spotlight") {
      return renderNodeVisualMarkup(sequence.fromVisual);
    }

    if (sequence.phase === "outro") {
      return `
        <span class="map-node-transition-layer map-node-transition-layer--old">
          ${renderNodeVisualMarkup(sequence.fromVisual, {
            tent: "is-complete-exit",
            deco: "is-complete-exit",
          })}
        </span>
      `;
    }

    return `
      <span class="map-node-transition-layer map-node-transition-layer--new">
        ${renderNodeVisualMarkup(sequence.toVisual, {
          plate: "is-complete-plate-in",
          flag: "is-complete-flag-in",
          crown: "is-complete-crown-in",
        })}
      </span>
    `;
  }

  if (sequence.phase === "focus" || sequence.phase === "spotlight") {
    return renderNodeVisualMarkup(sequence.fromVisual);
  }

  if (sequence.phase === "outro") {
    return `
      <span class="map-node-transition-layer map-node-transition-layer--old">
        ${renderNodeVisualMarkup(sequence.fromVisual, {
          flag: "is-review-flag-out",
          crown: "is-review-crown-out",
        })}
      </span>
    `;
  }

  return `
    <span class="map-node-transition-layer map-node-transition-layer--new">
      ${renderNodeVisualMarkup(sequence.toVisual, {
        plate: "is-review-plate-in",
        flag: "is-review-flag-in",
        crown: "is-review-crown-in",
      })}
    </span>
  `;
}

function renderCompletionOverlay() {
  if (!completionSequence || completionSequence.phase === "focus" || !completionSequence.spotlight) return "";
  const { x, y } = completionSequence.spotlight;
  return `
    <div
      class="map-completion-overlay${completionSequence.overlayAnimate ? " is-animate" : ""}"
      aria-hidden="true"
      style="--spotlight-x:${x}px; --spotlight-y:${y}px;"
    ></div>
  `;
}

function renderTopBar(progress) {
  return `
    <header class="map-topbar">
      <div class="map-topbar__actions">
        <button class="map-icon-button" type="button" data-go-home aria-label="홈으로 이동">
          <span class="map-icon-button__surface">
            <span class="map-icon-button__bolts map-icon-button__bolts--left" aria-hidden="true"><span></span><span></span></span>
            <span class="map-icon-button__bolts map-icon-button__bolts--right" aria-hidden="true"><span></span><span></span></span>
            <i class="fa-solid fa-house"></i>
          </span>
        </button>
        <div class="map-gear-anchor">
          <button class="map-icon-button" type="button" data-gear-toggle aria-label="환경 설정으로 이동">
            <span class="map-icon-button__surface">
              <span class="map-icon-button__bolts map-icon-button__bolts--left" aria-hidden="true"><span></span><span></span></span>
              <span class="map-icon-button__bolts map-icon-button__bolts--right" aria-hidden="true"><span></span><span></span></span>
              <i class="fa-solid fa-gear"></i>
            </span>
          </button>
        </div>
      </div>

      <div class="map-semester-stack">
        <div class="map-semester-panel">
          <div class="map-semester-panel__surface">
            <div class="map-semester-panel__stripes" aria-hidden="true"></div>
            <div class="map-semester-panel__inner">
              <button class="map-semester-panel__arrow" type="button" aria-label="이전 학기" disabled>
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <div class="map-semester-panel__body">
                <div class="map-semester-panel__label">${TERM.label} <span class="map-semester-panel__curriculum">(${TERM.curriculumYear})</span></div>
                <div class="map-semester-panel__progress">
                  <div class="map-semester-panel__fill" style="width:${Math.round(progress.value * 100)}%"></div>
                  <span class="map-semester-panel__value">${progress.text}</span>
                </div>
              </div>
              <button class="map-semester-panel__arrow" type="button" aria-label="다음 학기" disabled>
                <i class="fa-solid fa-chevron-right"></i>
              </button>
              <span class="map-semester-panel__bolts map-semester-panel__bolts--left" aria-hidden="true"><span></span><span></span></span>
              <span class="map-semester-panel__bolts map-semester-panel__bolts--right" aria-hidden="true"><span></span><span></span></span>
            </div>
          </div>
        </div>
        ${
          curriculumNoticeOpen
            ? `
              <div class="map-curriculum-notice" role="status" aria-live="polite">
                <div class="map-curriculum-notice__text">2022년 개정 교육과정 준비중이에요!</div>
                <button
                  class="map-curriculum-notice__close"
                  type="button"
                  data-curriculum-notice-close
                  aria-label="교육과정 안내 닫기"
                >
                  <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>
              </div>
            `
            : ""
        }
      </div>

      <div class="map-topbar__actions map-topbar__actions--right">
        <button class="map-icon-button" type="button" data-sidebar-open aria-label="메뉴 열기">
          <span class="map-icon-button__surface">
            <span class="map-icon-button__bolts map-icon-button__bolts--left" aria-hidden="true"><span></span><span></span></span>
            <span class="map-icon-button__bolts map-icon-button__bolts--right" aria-hidden="true"><span></span><span></span></span>
            <i class="fa-solid fa-bars"></i>
          </span>
        </button>
      </div>
    </header>
  `;
}

function renderSidebar() {
  return `
    <div class="map-sidebar-layer${sidebarOpen ? " is-open" : ""}" aria-hidden="${sidebarOpen ? "false" : "true"}">
      <button class="map-sidebar-dim" type="button" data-sidebar-dim aria-label="사이드바 닫기"></button>
      <aside class="map-sidebar-panel">
        <div class="map-sidebar-panel__shell">
          <div class="map-sidebar-panel__surface">
            <div class="map-sidebar-panel__inner">
              <div class="map-sidebar-head">
                <img class="map-sidebar-head__leaf" src="${MAP_ASSET}deco-leaf-3.png" alt="" />
                <div class="map-sidebar-head__row">
                  <h2>홍길동</h2>
                  <button class="map-sidebar-close" type="button" data-sidebar-close aria-label="닫기">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <div class="map-sidebar-head__meta">
                  <span class="map-sidebar-head__term">3학년 1학기</span>
                  ${!DEBUG_STATE.subscriptionActive ? '<button class="map-sidebar-head__badge" type="button">이용권 등록 필요</button>' : ""}
                </div>
              </div>

              <div class="map-sidebar-groups">
                <section class="map-sidebar-group">
                  ${renderSidebarLink("ico-mypage.png", "내 정보")}
                  ${renderSidebarLink("ico-history.png", "학습 기록")}
                  ${renderSidebarLink("ico-report.png", "학습 보고서")}
                  ${renderSidebarLink("ico-message.png", "받은 쪽지함")}
                </section>
                <section class="map-sidebar-group">
                  ${renderSidebarLink("ico-notice.png", "공지사항")}
                  ${renderSidebarLink("ico-error.png", "오류 신고")}
                </section>
                <section class="map-sidebar-group">
                  ${renderSidebarLink("ico-app.png", "홈 화면 추가하기")}
                  ${renderSidebarLink("ico-setting.png", "환경 설정")}
                  ${renderSidebarLink("ico-logout.png", "로그아웃")}
                </section>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderDebugPanel() {
  return `
    <div class="map-debug-layer${debugPanelOpen ? " is-open" : ""}" aria-hidden="${debugPanelOpen ? "false" : "true"}">
      <button class="map-debug-dim" type="button" data-debug-dim aria-label="디버그 패널 닫기"></button>
      <section class="map-debug-modal" role="dialog" aria-modal="true" aria-labelledby="map-debug-title">
        <button class="map-debug-modal__close" type="button" data-debug-close aria-label="닫기">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <h2 id="map-debug-title">디버그 상태 컨트롤</h2>
        <div class="debug-panel">
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
            ${renderDebugRow("이용기간", "off 시 CTA 비활성 + 이용권 경고", "subscriptionActive")}
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderDebugRow(label, hint, key) {
  const active = Boolean(DEBUG_STATE[key]);
  return `
    <div class="debug-panel__row">
      <div class="debug-panel__label">
        <strong class="debug-panel__name">${label}</strong>
        <span class="debug-panel__hint">${hint}</span>
      </div>
      <button
        class="debug-toggle ${active ? "is-on" : ""}"
        type="button"
        data-debug-key="${key}"
        aria-pressed="${active ? "true" : "false"}"
      >${active ? "ON" : "OFF"}</button>
    </div>
  `;
}

function renderSidebarLink(iconAsset, label, target = "") {
  const resolvedTarget =
    target ||
    {
      "ico-mypage.png": "my-info",
      "ico-history.png": "study-record",
      "ico-report.png": "report-list",
      "ico-notice.png": "notice",
      "ico-setting.png": "settings",
    }[iconAsset] ||
    "";
  return `
    <button class="map-sidebar-item" type="button" data-map-link="${resolvedTarget}">
      <span class="map-sidebar-item__label"><img src="${MAP_ASSET}${iconAsset}" alt="" />${label}</span>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;
}

function renderLoading() {
  return `
    <div class="map-route-loading${routeLoading ? " is-open" : ""}" aria-hidden="${routeLoading ? "false" : "true"}">
      <div class="map-route-loading__chip">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>${routeLoading?.label || "이동하는 중"}</span>
      </div>
    </div>
  `;
}

function renderModalShell(chapter) {
  const chapterState = getChapterState(chapter);
  const average = getAverageScore(chapter);
  const grade = getScoreGrade(average);
  return `
    <div class="modal-layer" data-modal-layer>
      <section class="chapter-modal" role="dialog" aria-modal="true" aria-label="${chapter.title} 상세">
        ${renderWoodPanel(chapter, chapterState, average, grade)}
        <div class="blanket"></div>
        ${renderSubjectsShell(chapter)}
        ${renderTrainingRailShell()}
        ${renderDateInfo(chapter)}
        <button class="cta-button" type="button" data-start-training disabled>
          <span>훈련 시작</span>
        </button>
      </section>
    </div>
  `;
}

function renderWoodPanel(chapter, chapterState, average, grade) {
  const isDone = chapterState === "completed";
  return `
    <div class="wood-panel">
      <button class="close-button" type="button" data-close-modal aria-label="닫기"><i class="fa-solid fa-xmark"></i></button>
      ${
        isDone
          ? `<div class="chapter-title-small">${chapter.title}</div>
             <div class="score-badge">${grade}</div>
             <div class="score-row">${average}점</div>`
          : `<div class="chapter-title-main">${chapter.title}</div>`
      }
    </div>
  `;
}

function renderSubjectsShell(chapter) {
  return `
    <div class="subjects-area">
      ${TERM.subjects.map((subjectId) => renderSubjectCardShell(chapter, subjectId)).join("")}
    </div>
  `;
}

function renderSubjectCardShell(chapter, subjectId) {
  const subject = SUBJECTS[subjectId];
  const stars = TERM.trainings
    .map((trainingId) => {
      const score = chapter.scores?.[subjectId]?.[trainingId];
      return `<img src="${MAP_ASSET}${getStarAsset(score)}" alt="${TRAININGS[trainingId].label} ${scoreLabel(score)}" />`;
    })
    .join("");

  return `
    <article class="subject-card">
      <button class="subject-button" type="button" data-subject-id="${subjectId}" aria-pressed="false">
        <img data-subject-img="${subjectId}" src="${MAP_ASSET}${subject.asset}" alt="${subject.label}" />
      </button>
      <div class="subject-name">${subject.label}</div>
      <div class="star-row">${stars}</div>
    </article>
  `;
}

function renderTrainingRailShell() {
  const buttons = [0, 1, 2]
    .map(
      (index) => `
        <button class="training-button is-hidden" type="button" data-training-index="${index}">
          <span class="training-label"></span>
          <img class="training-star" src="${MAP_ASSET}training-score-empty.svg" alt="" />
          <span class="training-score-text"></span>
        </button>
      `
    )
    .join("");

  return `<div class="training-rail left is-hidden" aria-hidden="true">${buttons}</div>`;
}

function renderDateInfo(chapter) {
  if (!chapter.firstCompletedAt && !chapter.lastReviewedAt) return "";
  return `
    <div class="date-info">
      ${chapter.firstCompletedAt ? `<div><strong>완료</strong> ${chapter.firstCompletedAt}</div>` : ""}
      ${chapter.lastReviewedAt ? `<div><strong>복습</strong> ${chapter.lastReviewedAt}</div>` : ""}
    </div>
  `;
}

function renderLearningView() {
  const chapter = getCurrentChapter(learningSession.chapterId);
  const subject = SUBJECTS[learningSession.subjectId];
  const training = TRAININGS[learningSession.trainingId];

  return `
    <main class="learning-view">
      <section class="learning-card">
        <h1>학습중</h1>
        <p>${TERM.label} · ${chapter.title}</p>
        <p>${subject.label} · ${training.label}</p>
        <div class="learning-actions">
          <button class="cancel-button" type="button" data-cancel-learning>학습 취소</button>
          <button class="complete-button" type="button" data-complete-learning>훈련 완료</button>
        </div>
      </section>
    </main>
  `;
}

function handleChapterClick(chapterId) {
  if (completionSequence) return;
  if (Date.now() < suppressChapterClickUntil) return;
  window.clearTimeout(modalOpenTimer);
  const chapter = getCurrentChapter(chapterId);
  if (!chapter) return;

  const chapterState = getChapterState(chapter);
  if (chapterState === "locked") return;

  if (chapterState === "completed" || chapterState === "in_progress") {
    transientScene = null;
    renderMap();
    openModal(chapterId);
    return;
  }

  transientScene = { chapterId, phase: "entering" };
  renderMap();

  modalOpenTimer = window.setTimeout(() => {
    transientScene = { chapterId, phase: "idle" };
    renderMap();
    openModal(chapterId);
  }, 860);
}

function openModal(chapterId, options = {}) {
  const restored = options.selection || null;
  activeModal = {
    chapterId,
    startedDuringModal: false,
    selectedSubject: restored?.subjectId || null,
    selectedTraining: restored?.trainingId || null,
  };
  renderModal();
}

function renderModal() {
  if (!activeModal) return;
  const chapter = getCurrentChapter(activeModal.chapterId);
  if (!chapter) return;

  if (!modalRoot.querySelector(".modal-layer")) {
    modalRoot.innerHTML = renderModalShell(chapter);
    modalRoot.querySelector("[data-modal-layer]").addEventListener("click", (event) => {
      if (event.target.matches("[data-modal-layer]")) closeModal();
    });
    modalRoot.querySelector("[data-close-modal]").addEventListener("click", () => closeModal());
    modalRoot.querySelectorAll("[data-subject-id]").forEach((button) => {
      button.addEventListener("click", () => selectSubject(button.dataset.subjectId));
    });
    modalRoot.querySelectorAll("[data-training-index]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.trainingId) selectTraining(button.dataset.trainingId);
      });
    });
    modalRoot.querySelector("[data-start-training]").onclick = startTraining;
    requestAnimationFrame(() => modalRoot.querySelector(".modal-layer")?.classList.add("is-open"));
  }

  updateModalContent();
}

function updateModalContent() {
  if (!activeModal) return;
  const chapter = getCurrentChapter(activeModal.chapterId);
  const modal = modalRoot.querySelector(".chapter-modal");
  if (!chapter || !modal) return;

  const canStart = Boolean(activeModal.selectedSubject && activeModal.selectedTraining);
  updateSubjectDom(chapter);
  updateTrainingDom(chapter);
  modalRoot.querySelector("[data-start-training]").disabled = !canStart;
}

function updateSubjectDom(chapter) {
  modalRoot.querySelectorAll("[data-subject-id]").forEach((button) => {
    const subjectId = button.dataset.subjectId;
    const subject = SUBJECTS[subjectId];
    const active = activeModal.selectedSubject === subjectId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector("[data-subject-img]").src = `${MAP_ASSET}${active ? subject.selectedAsset : subject.asset}`;
  });
}

function updateTrainingDom(chapter) {
  const rail = modalRoot.querySelector(".training-rail");
  const selectedSubject = activeModal.selectedSubject;
  const subjectIndex = TERM.subjects.indexOf(selectedSubject);
  const direction = subjectIndex === 0 ? "left" : "right";

  rail.className = `training-rail ${direction}${selectedSubject ? "" : " is-hidden"}`;
  rail.setAttribute("aria-hidden", String(!selectedSubject));

  rail.querySelectorAll("[data-training-index]").forEach((button) => {
    const trainingId = TERM.trainings[Number(button.dataset.trainingIndex)];
    if (!selectedSubject || !trainingId) {
      button.classList.add("is-hidden");
      button.dataset.trainingId = "";
      return;
    }

    const score = chapter.scores?.[selectedSubject]?.[trainingId];
    button.dataset.trainingId = trainingId;
    button.classList.remove("is-hidden");
    button.classList.toggle("active", activeModal.selectedTraining === trainingId);
    button.querySelector(".training-label").textContent = TRAININGS[trainingId].label;
    const star = button.querySelector(".training-star");
    star.src = `${MAP_ASSET}${getStarAsset(score)}`;
    star.alt = scoreLabel(score);
    button.querySelector(".training-score-text").textContent = Number.isFinite(score) ? `${score}점` : "미학습";
  });
}

function selectSubject(subjectId) {
  activeModal.selectedSubject = subjectId;
  activeModal.selectedTraining = null;
  updateModalContent();
}

function selectTraining(trainingId) {
  activeModal.selectedTraining = trainingId;
  updateModalContent();
}

function startTraining() {
  const chapter = getCurrentChapter(activeModal.chapterId);
  if (!chapter || !activeModal.selectedSubject || !activeModal.selectedTraining) return;

  chapter.startedAt = chapter.startedAt || getTodayString();
  chapter.locked = false;
  activeModal.startedDuringModal = true;
  learningSession = {
    chapterId: chapter.id,
    subjectId: activeModal.selectedSubject,
    trainingId: activeModal.selectedTraining,
  };
  state.lastLearning = learningSession;
  modalRoot.innerHTML = "";
  activeModal = null;
  transientScene = null;
  renderMap();
}

function attachLearningEvents() {
  app.querySelector("[data-complete-learning]").addEventListener("click", completeLearning);
  app.querySelector("[data-cancel-learning]").addEventListener("click", cancelLearning);
}

function completeLearning() {
  const session = learningSession;
  const chapter = getCurrentChapter(session.chapterId);
  const beforeChapter = JSON.parse(JSON.stringify(chapter));
  const wasCompleted = getChapterState(beforeChapter) === "completed";
  const previousVisual = getNodeVisual(beforeChapter);
  const previousLevel = getMapScoreLevel(beforeChapter);

  chapter.scores[session.subjectId][session.trainingId] = makeMockScore();
  chapter.startedAt = chapter.startedAt || getTodayString();
  chapter.locked = false;

  const isCompleted = getChapterState(chapter) === "completed";
  if (isCompleted) {
    if (wasCompleted) {
      const reviewedLevel = getReviewScoreLevel(session.subjectId, previousLevel);
      chapter.scoreLevel = reviewedLevel;
      applyScoresFromPreset(chapter.scores, SCORE_PRESETS[reviewedLevel]);
    } else {
      chapter.scoreLevel = getScoreLevelFromAverage(getAverageScore(chapter));
    }
  }
  if (isCompleted && !chapter.firstCompletedAt) {
    chapter.firstCompletedAt = getTodayString();
  } else if (wasCompleted) {
    chapter.lastReviewedAt = getTodayString();
  }

  learningSession = null;
  const selection = {
    subjectId: session.subjectId,
    trainingId: session.trainingId,
  };

  if (isCompleted) {
    startCompletionSequence({
      chapterId: session.chapterId,
      mode: wasCompleted ? "review" : "complete",
      fromVisual: previousVisual,
      toVisual: getNodeVisual(chapter),
      selection,
    });
    return;
  }

  renderMap();
  openModal(session.chapterId, { selection });
}

function cancelLearning() {
  const session = learningSession;
  learningSession = null;
  renderMap();
  openModal(session.chapterId, {
    selection: {
      subjectId: session.subjectId,
      trainingId: session.trainingId,
    },
  });
}

function closeModal(options = {}) {
  window.clearTimeout(modalOpenTimer);
  if (!activeModal && !options.silent) return;

  const chapterId = activeModal?.chapterId;
  const chapter = chapterId ? getCurrentChapter(chapterId) : null;
  const shouldReverse =
    chapter &&
    transientScene?.chapterId === chapterId &&
    getChapterState(chapter) === "not_started" &&
    !activeModal.startedDuringModal;

  const layer = modalRoot.querySelector(".modal-layer");
  if (layer) layer.classList.remove("is-open");
  window.setTimeout(() => {
    modalRoot.innerHTML = "";
  }, 240);

  activeModal = null;
  if (shouldReverse) {
    transientScene = { chapterId, phase: "exiting" };
    renderMap();
    window.setTimeout(() => {
      if (transientScene?.chapterId === chapterId) {
        transientScene = null;
        renderMap();
      }
    }, 560);
  } else if (!options.silent) {
    transientScene = null;
    renderMap();
  }
}

function applyScale() {
  const viewportHeight = Math.max(360, window.innerHeight || DESIGN.stageHeight);
  currentScale = viewportHeight / DESIGN.stageHeight;
  document.documentElement.style.setProperty("--map-scale", String(currentScale));
  document.documentElement.style.setProperty("--world-w", `${DESIGN.worldWidth}px`);
  document.documentElement.style.setProperty("--scaled-world-w", `${DESIGN.worldWidth * currentScale}px`);
  document.documentElement.style.setProperty("--scaled-world-h", `${DESIGN.stageHeight * currentScale}px`);
  document.documentElement.style.setProperty("--start-gutter", `${getStartGutter()}px`);
  document.documentElement.style.setProperty("--end-gutter", `${getEndGutter()}px`);
}

function getStartGutter() {
  return Math.round(Math.max(92, Math.min(window.innerWidth * 0.18, 240)));
}

function getEndGutter() {
  return Math.round(Math.max(18, Math.min(window.innerWidth * 0.035, 44)));
}

function getViewportWorldWidth(scrollEl) {
  return scrollEl.clientWidth / currentScale;
}

function getMaxWorldScroll(scrollEl) {
  return Math.max(0, DESIGN.worldWidth - getViewportWorldWidth(scrollEl));
}

function getWorldScroll(scrollEl) {
  return Math.max(0, (scrollEl.scrollLeft - getStartGutter()) / currentScale);
}

function getMaxScrollLeft(scrollEl) {
  return getStartGutter() + getMaxWorldScroll(scrollEl) * currentScale;
}

function syncParallax(scrollEl) {
  const worldScroll = getWorldScroll(scrollEl);
  const bgShift = worldScroll * PARALLAX.backgroundFactor;
  document.documentElement.style.setProperty("--bg-shift", `${bgShift}px`);
}

function scrollToWorldX(worldX) {
  const scrollEl = app.querySelector("[data-map-scroll]");
  if (!scrollEl) return;
  const maxWorldScroll = getMaxWorldScroll(scrollEl);
  const targetWorld = Math.max(
    0,
    Math.min(worldX - getViewportWorldWidth(scrollEl) / 2, maxWorldScroll)
  );
  rememberedScrollLeft = getStartGutter() + targetWorld * currentScale;
  scrollEl.scrollTo({ left: rememberedScrollLeft, behavior: "smooth" });
}

function getChapterViewportCenter(chapterId) {
  const button = app.querySelector(`[data-chapter-id="${chapterId}"]`);
  if (!button) return null;
  const rect = button.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2 + 18,
  };
}

function startCompletionSequence({ chapterId, mode, fromVisual, toVisual, selection }) {
  const outroMs = mode === "review" ? COMPLETION_TIMING.reviewOutroMs : COMPLETION_TIMING.completeOutroMs;
  const introMs = mode === "review" ? COMPLETION_TIMING.reviewIntroMs : COMPLETION_TIMING.completeIntroMs;

  completionSequence = {
    chapterId,
    mode,
    phase: "focus",
    fromVisual,
    toVisual,
    selection,
    spotlight: null,
    overlayAnimate: false,
  };
  renderMap();
  scrollToWorldX(getCurrentChapter(chapterId).x);

  window.setTimeout(() => {
    if (!completionSequence || completionSequence.chapterId !== chapterId) return;
    completionSequence.spotlight = getChapterViewportCenter(chapterId);
    completionSequence.overlayAnimate = true;
    completionSequence.phase = "spotlight";
    renderMap();
    completionSequence.overlayAnimate = false;

    window.setTimeout(() => {
      if (!completionSequence || completionSequence.chapterId !== chapterId) return;
      completionSequence.phase = "outro";
      renderMap();

      window.setTimeout(() => {
        if (!completionSequence || completionSequence.chapterId !== chapterId) return;
        completionSequence.phase = "intro";
        renderMap();

        window.setTimeout(() => {
          if (!completionSequence || completionSequence.chapterId !== chapterId) return;
          completionSequence = null;
          renderMap();
          openModal(chapterId, { selection });
        }, introMs + COMPLETION_TIMING.holdMs);
      }, outroMs + COMPLETION_TIMING.holdMs);
    }, COMPLETION_TIMING.spotlightMs);
  }, COMPLETION_TIMING.focusMs);
}

function handleHorizontalWheel(event) {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.preventDefault();
  const scrollEl = event.currentTarget;
  scrollEl.scrollLeft = Math.max(0, Math.min(scrollEl.scrollLeft + event.deltaY, getMaxScrollLeft(scrollEl)));
}

function attachDrag(scrollEl) {
  scrollEl.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button, a, input, select, textarea, [role='button']")) return;
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: scrollEl.scrollLeft,
      dragging: false,
      captured: false,
    };
  });

  scrollEl.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (!dragState.dragging && Math.hypot(dx, dy) > 6) {
      dragState.dragging = true;
      if (!dragState.captured) {
        scrollEl.setPointerCapture?.(event.pointerId);
        dragState.captured = true;
      }
      scrollEl.classList.add("is-dragging");
      document.body.classList.add("is-map-dragging");
    }
    if (!dragState.dragging) return;
    event.preventDefault();
    scrollEl.scrollLeft = Math.max(0, Math.min(dragState.startScrollLeft - dx, getMaxScrollLeft(scrollEl)));
  });

  const endDrag = (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    if (dragState.dragging) suppressChapterClickUntil = Date.now() + 250;
    scrollEl.classList.remove("is-dragging");
    document.body.classList.remove("is-map-dragging");
    if (dragState.captured) scrollEl.releasePointerCapture?.(event.pointerId);
    dragState = null;
  };

  scrollEl.addEventListener("pointerup", endDrag);
  scrollEl.addEventListener("pointercancel", endDrag);
  scrollEl.addEventListener("lostpointercapture", () => {
    scrollEl.classList.remove("is-dragging");
    document.body.classList.remove("is-map-dragging");
    dragState = null;
  });
}

function setSidebarOpen(isOpen) {
  if (completionSequence) return;
  sidebarOpen = isOpen;
  const layer = app.querySelector(".map-sidebar-layer");
  if (!layer) return;
  layer.classList.toggle("is-open", isOpen);
  layer.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

function setDebugPanelOpen(isOpen) {
  if (completionSequence) return;
  debugPanelOpen = isOpen;
  renderMap();
}

function startRouteLoading(url, label) {
  if (routeLoading) return;
  routeLoading = { url, label };
  sidebarOpen = false;
  renderMap();
  window.setTimeout(() => {
    window.location.href = url;
  }, 1180);
}

function bindGlobalEvents() {
  if (bindGlobalEvents.bound) return;
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (sidebarOpen) {
      setSidebarOpen(false);
      return;
    }
    if (activeModal) {
      closeModal();
      return;
    }
    if (debugPanelOpen) {
      setDebugPanelOpen(false);
      return;
    }
    if (DEBUG_ENABLED && !learningSession) {
      setDebugPanelOpen(true);
      return;
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== DEBUG_STORAGE_KEY) return;
    DEBUG_STATE = loadDebugState();
    if (!learningSession) renderMap();
  });

  window.addEventListener("resize", () => {
    applyScale();
    const scrollEl = app.querySelector("[data-map-scroll]");
    if (scrollEl) {
      rememberedScrollLeft = Math.min(rememberedScrollLeft, getMaxScrollLeft(scrollEl));
      scrollEl.scrollLeft = rememberedScrollLeft;
      syncParallax(scrollEl);
    }
  });

  bindGlobalEvents.bound = true;
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

function makeMockScore() {
  const lowChance = Math.random() < 0.16;
  const min = lowChance ? 26 : 62;
  const max = 100;
  return Math.round(min + Math.random() * (max - min));
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function scoreLabel(score) {
  return Number.isFinite(score) ? `${score}점` : "미학습";
}
