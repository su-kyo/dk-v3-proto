(function () {
  const assets = {
    leaf: "./source/leaf-deco.png",
    logo: "./source/logo.svg",
    noData: "./source/no-data.png",
    noticeDemo: "./source/notice-demo.png",
  };

  const pageRoutes = {
    home: "../dk-v3/index.html?entry=landed",
    notice: "./notice.html",
    "my-info": "./my-info.html",
    "study-record": "./study-record.html",
    "report-list": "./report-list.html",
    settings: "./settings.html",
    "design-system": "./design-system.html",
  };

  const sidebarAssets = {
    leaf: "../dk-v3/source/deco-leaf-3.png",
    "my-info": "../dk-v3/source/ico-mypage.png",
    "study-record": "../dk-v3/source/ico-history.png",
    "report-list": "../dk-v3/source/ico-report.png",
    notice: "../dk-v3/source/ico-notice.png",
  };

  const starAssets = {
    0: "./source/star_empty.svg",
    1: "./source/star_1st.svg",
    2: "./source/star_2nd.svg",
    3: "./source/star_3rd.svg",
    4: "./source/star_4th.svg",
    5: "./source/star_5th.svg",
  };

  const sidebarLinks = [
    { key: "my-info", label: "내 정보" },
    { key: "study-record", label: "학습 기록" },
    { key: "report-list", label: "학습 보고서" },
    { key: "notice", label: "공지사항" },
  ];

  const chromeState = {
    sidebarOpen: false,
  };

  const SETTINGS_STORAGE_KEY = "dk-etc-settings-proto";

  const sidebarIconAssets = {
    ...sidebarAssets,
    message: "../dk-v3/source/ico-message.png",
    error: "../dk-v3/source/ico-error.png",
    app: "../dk-v3/source/ico-app.png",
    settings: "../dk-v3/source/ico-setting.png",
    logout: "../dk-v3/source/ico-logout.png",
  };

  const sidebarComposition = [
    [
      { key: "my-info", label: "내 정보", icon: sidebarIconAssets["my-info"], target: "my-info" },
      { key: "study-record", label: "학습 기록", icon: sidebarIconAssets["study-record"], target: "study-record" },
      { key: "report-list", label: "학습 보고서", icon: sidebarIconAssets["report-list"], target: "report-list" },
      { key: "message", label: "받은 쪽지함", icon: sidebarIconAssets.message },
    ],
    [
      { key: "notice", label: "공지사항", icon: sidebarIconAssets.notice, target: "notice" },
      { key: "error", label: "오류 신고", icon: sidebarIconAssets.error },
    ],
    [
      { key: "app", label: "홈 화면 추가하기", icon: sidebarIconAssets.app },
      { key: "settings", label: "환경 설정", icon: sidebarIconAssets.settings, target: "settings" },
      { key: "logout", label: "로그아웃", icon: sidebarIconAssets.logout },
    ],
  ];

  const textbookRecords = [
    {
      date: "2026-04-02",
      round: "6회차",
      subject: "국어",
      word: { grade: 5, score: "100" },
      textbook: { grade: 4, score: "90" },
      practical: { grade: 3, score: "85" },
      firstScore: "55",
      reviewScore: "-",
      reviewDate: "-",
    },
    {
      date: "2026-04-02",
      round: "5회차",
      subject: "국어",
      word: { grade: 0, score: "-" },
      textbook: { grade: 4, score: "90" },
      practical: { grade: 3, score: "85" },
      firstScore: "-",
      reviewScore: "-",
      reviewDate: "-",
    },
    {
      date: "2026-04-02",
      round: "4회차",
      subject: "국어",
      word: { grade: 5, score: "100" },
      textbook: { grade: 4, score: "90" },
      practical: { grade: 3, score: "85" },
      firstScore: "100",
      reviewScore: "80",
      reviewDate: "2026-04-03",
    },
    {
      date: "2026-04-02",
      round: "3회차",
      subject: "국어",
      word: { grade: 5, score: "100" },
      textbook: { grade: 4, score: "90" },
      practical: { grade: 3, score: "85" },
      firstScore: "79",
      reviewScore: "64",
      reviewDate: "2026-04-03",
    },
  ];

  const seedRecordMap = {
    "3레벨": [
      {
        round: "1회차",
        date: "2026-04-02",
        letters: [
          { char: "休", label: "쉴 휴" },
          { char: "勞", label: "일할 로" },
        ],
      },
      {
        round: "2회차",
        date: "2026-04-02",
        letters: [
          { char: "女", label: "여자 녀" },
          { char: "男", label: "사내 남" },
        ],
      },
      {
        round: "3회차",
        date: "2026-04-02",
        letters: [
          { char: "堂", label: "집 당" },
          { char: "院", label: "집 원" },
        ],
      },
    ],
    "4레벨": [
      {
        round: "1회차",
        date: "2026-04-05",
        letters: [
          { char: "江", label: "강 강" },
          { char: "海", label: "바다 해" },
        ],
      },
      {
        round: "2회차",
        date: "2026-04-06",
        letters: [
          { char: "林", label: "수풀 림" },
          { char: "山", label: "메 산" },
        ],
      },
    ],
    "5레벨": [],
  };

  const notices = [
    {
      id: "notice-1",
      title: "2026 학습 후기 이벤트! 에어팟의 주인공을 찾습니다.",
      date: "2026.05.14",
      body:
        "2026년 상반기 학습 후기 이벤트가 여러분의 뜨거운 성원 속에 마무리 되었습니다.\n진솔한 경험과 감동적인 변화의 순간들을 나누어 주신 모든 분께 진심으로 감사드립니다.\n치열한 심사를 거쳐 선정된 총 36명의 당첨자와 풍성한 선물 발송 일정을 지금 바로 확인해 보세요!\n\n1. 갓생 에어팟(1명)과, 스타리 텀블러(5명) :\n물품 당첨자님에게는 개별 연락을 통해 배송지 주소 확인 후 발송이 시작됩니다.\n주소확인이 완료되는 대로 금주 중 택배로 안전하게 발송됩니다.\n\n2. 맘스터치 싸이버거 세트 (30명) :\n등록된 휴대번호로 기프티콘이 일괄 발송됩니다.\n\n선정된 우수 후기들은 향후 브랜드 홈페이지 및 학습 가이드 콘텐츠 등으로 각색되어, 다른 친구들에게 공유될 예정입니다.\n\n기쁜 축하 인사를 나눠 주세요!\n아쉽게 이번에 선정되지 못했더라도 다음 이벤트의 주인공이 될 수 있으니 실망하지 마시고 열공 모드를 유지해 보세요 ^^",
      attachment: "이벤트 당첨자 발표.png",
    },
    {
      id: "notice-2",
      title: "매일국어 인스타그램 팔로우 이벤트",
      date: "2026.05.14",
    },
    {
      id: "notice-3",
      title: "2026 학습 후기 이벤트! 에어팟의 주인공을 찾습니다.",
      date: "2026.05.14",
    },
    {
      id: "notice-4",
      title: "2026 학습 후기 이벤트! 에어팟의 주인공을 찾습니다.",
      date: "2026.05.14",
    },
  ];

  const reports = [
    { number: "11", grade: "3학년", title: "2025년 9월 보고서", period: "2025.09.01~2025.09.30" },
    { number: "10", grade: "3학년", title: "2025년 9월 보고서", period: "2025.09.01~2025.09.30" },
    { number: "9", grade: "3학년", title: "2025년 9월 보고서", period: "2025.09.01~2025.09.30" },
    { number: "8", grade: "3학년", title: "2025년 9월 보고서", period: "2025.09.01~2025.09.30" },
    { number: "7", grade: "3학년", title: "2025년 9월 보고서", period: "2025.09.01~2025.09.30" },
    { number: "6", grade: "3학년", title: "2025년 9월 보고서", period: "2025.09.01~2025.09.30" },
    { number: "5", grade: "3학년", title: "2025년 9월 보고서", period: "2025.09.01~2025.09.30" },
    { number: "4", grade: "3학년", title: "2025년 8월 보고서", period: "2025.08.01~2025.08.31" },
    { number: "3", grade: "3학년", title: "2025년 7월 보고서", period: "2025.07.01~2025.07.31" },
    { number: "2", grade: "3학년", title: "진단평가 보고서", period: "" },
  ];

  const colorTokens = [
    { name: "brown950", value: "#3D2000" },
    { name: "brown900", value: "#41230C" },
    { name: "brown700", value: "#895228" },
    { name: "cream50", value: "#FEFBF3" },
    { name: "cream100", value: "#FFF8EA" },
    { name: "cream200", value: "#F8EBD3" },
    { name: "cream300", value: "#EAE0D4" },
    { name: "green700", value: "#3C7E21" },
    { name: "green500", value: "#6D9D55" },
    { name: "green400", value: "#74A12C" },
    { name: "orange500", value: "#FF6523" },
    { name: "blue500", value: "#0092FF" },
  ];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function icon(name) {
    const iconMap = {
      home: "fa-solid fa-house",
      notice: "fa-solid fa-bullhorn",
      alarm: "fa-solid fa-bell",
      menu: "fa-solid fa-bars",
      chevron: "fa-solid fa-chevron-down",
      filter: "fa-solid fa-filter",
      reset: "fa-solid fa-rotate-right",
      file: "fa-regular fa-file-lines",
      user: "fa-solid fa-user",
      at: "fa-solid fa-at",
      book: "fa-solid fa-book-open",
      calendar: "fa-solid fa-calendar-days",
    };
    const iconClass = iconMap[name];
    return iconClass ? `<i class="${iconClass} fa-fw" aria-hidden="true"></i>` : "";
  }

  function starIcon(grade) {
    const safeGrade = Number.isFinite(Number(grade)) ? Number(grade) : 0;
    const asset = starAssets[safeGrade] || starAssets[0];
    return `
      <span class="star-icon grade-${grade}" aria-hidden="true">
        <img src="${asset}" alt="">
      </span>
    `;
  }

  function renderHeader() {
    return `
      <header class="app-header">
        <div class="app-header__inner">
          <div class="app-header__info">
            <button class="home-chip" type="button" aria-label="홈">${icon("home")}</button>
            <div class="header-meta">
              <span>3-1</span>
              <span>김지우</span>
            </div>
          </div>
          <img class="app-header__logo" src="${assets.logo}" alt="매일국어 초등 로고">
          <div class="app-header__actions">
            <button class="header-icon-button" type="button" aria-label="공지사항">
              ${icon("notice")}
              <span class="header-badge">1</span>
            </button>
            <button class="header-icon-button" type="button" aria-label="알림">${icon("alarm")}</button>
            <button class="header-icon-button" type="button" aria-label="메뉴">${icon("menu")}</button>
          </div>
        </div>
      </header>
    `;
  }

  function renderPageTitle(title) {
    return `
      <div class="page-title">
        <h1>${escapeHtml(title)}</h1>
        <img class="page-title__leaf" src="${assets.leaf}" alt="" aria-hidden="true">
      </div>
    `;
  }

  function renderShell(title, content) {
    return `
      <div class="page-shell">
        ${renderChromeHeaderV2()}
        <main class="page-content">
          <section class="page-container">
            ${renderPageTitle(title)}
            ${content}
          </section>
        </main>
        ${renderChromeSidebarV2()}
      </div>
    `;
  }

  function renderChromeHeader() {
    return `
      <header class="app-header">
        <div class="app-header__inner">
          <div class="app-header__info">
            <button class="home-chip" type="button" data-nav-target="home" aria-label="홈">${icon("home")}</button>
            <div class="header-meta">
              <span>3-1</span>
              <span>홍길동</span>
            </div>
          </div>
          <img class="app-header__logo" src="${assets.logo}" alt="매일국어 초등 로고">
          <div class="app-header__actions">
            <button class="header-icon-button" type="button" data-nav-target="notice" aria-label="공지사항">
              ${icon("notice")}
              <span class="header-badge">1</span>
            </button>
            <button class="header-icon-button" type="button" aria-label="알림">${icon("alarm")}</button>
            <button class="header-icon-button" type="button" data-chrome-action="sidebar-open" aria-label="메뉴">${icon("menu")}</button>
          </div>
        </div>
      </header>
    `;
  }

  function renderChromeSidebar() {
    const currentPage = document.body.dataset.page || "";
    return `
      <div class="page-sidebar-layer" data-page-sidebar aria-hidden="true" hidden>
        <button class="page-sidebar-dim" type="button" data-chrome-action="sidebar-close" aria-label="사이드바 닫기"></button>
        <aside class="page-sidebar-panel" data-page-sidebar-panel>
          <div class="page-sidebar-panel__shell">
            <div class="page-sidebar-panel__surface">
              <div class="page-sidebar-panel__inner">
                <header class="page-sidebar-head">
                  <img class="page-sidebar-head__leaf" src="${sidebarAssets.leaf}" alt="" aria-hidden="true">
                  <div class="page-sidebar-head__row">
                    <h2>홍길동</h2>
                    <button class="page-sidebar-close" type="button" data-chrome-action="sidebar-close" aria-label="닫기">
                      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div class="page-sidebar-head__meta">
                    <span class="page-sidebar-head__term">3학년 1학기</span>
                  </div>
                </header>
                <div class="page-sidebar-groups">
                  ${sidebarComposition
                    .map(
                      (group) => `
                        <section class="page-sidebar-group">
                          ${group
                            .map((item) => {
                              const isCurrent = item.target && item.target === currentPage;
                              return `
                                <button
                                  class="page-sidebar-item ${isCurrent ? "is-current" : ""}${item.target ? "" : " is-placeholder"}"
                                  type="button"
                                  ${item.target ? `data-sidebar-target="${item.target}"` : ""}
                                  ${isCurrent ? 'aria-current="page"' : ""}
                                >
                                  <span class="page-sidebar-item__label">
                                    <img src="${item.icon}" alt="" aria-hidden="true">
                                    ${item.label}
                                  </span>
                                  <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                </button>
                              `;
                            })
                            .join("")}
                        </section>
                      `,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    `;
  }

  function renderChromeHeaderV2() {
    return `
      <header class="app-header">
        <div class="app-header__inner">
          <div class="app-header__info">
            <button class="home-chip" type="button" data-nav-target="home" aria-label="홈">${icon("home")}</button>
            <div class="header-meta">
              <span>3-1</span>
              <span>홍길동</span>
            </div>
          </div>
          <img class="app-header__logo" src="${assets.logo}" alt="매일국어 초등 로고">
          <div class="app-header__actions">
            <button class="header-icon-button" type="button" data-nav-target="notice" aria-label="공지사항">
              ${icon("notice")}
              <span class="header-badge">1</span>
            </button>
            <button class="header-icon-button" type="button" aria-label="알림">${icon("alarm")}</button>
            <button class="header-icon-button" type="button" data-chrome-action="sidebar-open" aria-label="메뉴">${icon("menu")}</button>
          </div>
        </div>
      </header>
    `;
  }

  function renderChromeSidebarV2() {
    const currentPage = document.body.dataset.page || "";
    return `
      <div class="page-sidebar-layer" data-page-sidebar aria-hidden="true" hidden>
        <button class="page-sidebar-dim" type="button" data-chrome-action="sidebar-close" aria-label="사이드바 닫기"></button>
        <aside class="page-sidebar-panel" data-page-sidebar-panel>
          <div class="page-sidebar-panel__shell">
            <div class="page-sidebar-panel__surface">
              <div class="page-sidebar-panel__inner">
                <header class="page-sidebar-head">
                  <img class="page-sidebar-head__leaf" src="${sidebarAssets.leaf}" alt="" aria-hidden="true">
                  <div class="page-sidebar-head__row">
                    <h2>홍길동</h2>
                    <button class="page-sidebar-close" type="button" data-chrome-action="sidebar-close" aria-label="닫기">
                      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div class="page-sidebar-head__meta">
                    <span class="page-sidebar-head__term">3학년 1학기</span>
                  </div>
                </header>
                <div class="page-sidebar-groups">
                  ${sidebarComposition
                    .map(
                      (group) => `
                        <section class="page-sidebar-group">
                          ${group
                            .map((item) => {
                              const isCurrent = item.target && item.target === currentPage;
                              return `
                                <button
                                  class="page-sidebar-item ${isCurrent ? "is-current" : ""}${item.target ? "" : " is-placeholder"}"
                                  type="button"
                                  ${item.target ? `data-sidebar-target="${item.target}"` : ""}
                                  ${isCurrent ? 'aria-current="page"' : ""}
                                >
                                  <span class="page-sidebar-item__label">
                                    <img src="${item.icon}" alt="" aria-hidden="true">
                                    ${item.label}
                                  </span>
                                  <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                </button>
                              `;
                            })
                            .join("")}
                        </section>
                      `,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    `;
  }

  function renderSelectMarkup(config) {
    const {
      id,
      value,
      options,
      ariaLabel,
      width = "160px",
      extraClass = "",
    } = config;
    return `
      <label class="select-wrap ${extraClass}" style="--select-width:${width}">
        <span class="visually-hidden">${escapeHtml(ariaLabel)}</span>
        <select id="${escapeHtml(id)}" aria-label="${escapeHtml(ariaLabel)}">
          ${options
            .map(
              (option) =>
                `<option value="${escapeHtml(option)}"${option === value ? " selected" : ""}>${escapeHtml(option)}</option>`,
            )
            .join("")}
        </select>
        <span class="select-icon">${icon("chevron")}</span>
      </label>
    `;
  }

  function renderEmptyState(message) {
    return `
      <div class="empty-state">
        <img src="${assets.noData}" alt="">
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }

  function getRoute(target) {
    return pageRoutes[target] || "";
  }

  function syncChromeState() {
    const sidebarLayer = document.querySelector("[data-page-sidebar]");
    if (!sidebarLayer) return;
    sidebarLayer.hidden = !chromeState.sidebarOpen;
    sidebarLayer.classList.toggle("is-open", chromeState.sidebarOpen);
    sidebarLayer.setAttribute("aria-hidden", chromeState.sidebarOpen ? "false" : "true");
    document.body.classList.toggle("has-page-sidebar-open", chromeState.sidebarOpen);
  }

  function setSidebarOpen(open) {
    chromeState.sidebarOpen = open;
    syncChromeState();
  }

  function navigateTo(target) {
    const href = getRoute(target);
    if (!href) return;
    chromeState.sidebarOpen = false;
    syncChromeState();
    window.location.href = href;
  }

  function handleChromeClick(event) {
    const chromeAction = event.target.closest("[data-chrome-action]");
    if (chromeAction) {
      const action = chromeAction.getAttribute("data-chrome-action");
      if (action === "sidebar-open") {
        setSidebarOpen(true);
      }
      if (action === "sidebar-close") {
        setSidebarOpen(false);
      }
      return;
    }

    const navTrigger = event.target.closest("[data-nav-target]");
    if (navTrigger) {
      navigateTo(navTrigger.getAttribute("data-nav-target"));
      return;
    }

    const sidebarLink = event.target.closest("[data-sidebar-target]");
    if (sidebarLink) {
      const target = sidebarLink.getAttribute("data-sidebar-target");
      if (target === document.body.dataset.page) {
        setSidebarOpen(false);
        return;
      }
      navigateTo(target);
      return;
    }

    if (event.target.closest(".page-sidebar-item.is-placeholder")) {
      return;
    }
  }

  function handleChromeKeydown(event) {
    if (event.key === "Escape" && chromeState.sidebarOpen) {
      setSidebarOpen(false);
    }
  }

  function bindChromeEvents() {
    if (bindChromeEvents.bound) return;
    document.addEventListener("click", handleChromeClick);
    document.addEventListener("keydown", handleChromeKeydown);
    bindChromeEvents.bound = true;
  }

  function renderStudyRecordPage(root) {
    const query = new URLSearchParams(window.location.search);
    const pick = (key, allowed, fallback) => {
      const value = query.get(key);
      return value && allowed.includes(value) ? value : fallback;
    };
    const state = {
      curriculum: pick("curriculum", ["2022 개정", "2015 개정"], "2022 개정"),
      level: pick("level", ["3레벨", "4레벨", "5레벨"], "3레벨"),
      review: pick("review", ["전체", "복습 완료", "복습 없음"], "전체"),
      semester: pick("semester", ["3학년 1학기", "4학년 1학기"], "3학년 1학기"),
      subject: pick("subject", ["전체", "국어", "수학"], "전체"),
      tab: pick("tab", ["textbook", "seed"], "textbook"),
    };

    function filterTextbookRecords() {
      let rows = [...textbookRecords];
      if (state.curriculum !== "2022 개정" || state.semester !== "3학년 1학기") {
        return [];
      }
      if (state.subject !== "전체") {
        rows = rows.filter((row) => row.subject === state.subject);
      }
      if (state.review === "복습 완료") {
        rows = rows.filter((row) => row.reviewDate !== "-");
      }
      if (state.review === "복습 없음") {
        rows = rows.filter((row) => row.reviewDate === "-");
      }
      return rows;
    }

    function renderRecordCell(label, value, extraClass) {
      return `<div class="cell ${extraClass || ""}" data-label="${escapeHtml(label)}">${escapeHtml(value)}</div>`;
    }

    function renderScoreCell(label, score) {
      return `
        <div class="score-stack" data-label="${escapeHtml(label)}">
          ${starIcon(score.grade)}
          <span class="value-small">${escapeHtml(score.score)}</span>
        </div>
      `;
    }

    function renderTableRows(rows) {
      return rows
        .map(
          (row) => `
            <div class="record-row">
              ${renderRecordCell("학습 일자", row.date)}
              ${renderRecordCell("회차", row.round)}
              ${renderRecordCell("과목", row.subject, "cell--subject")}
              ${renderScoreCell("단어", row.word)}
              ${renderScoreCell("교과서", row.textbook)}
              ${renderScoreCell("실전", row.practical)}
              <div class="score-stack" data-label="최초 점수"><span class="value-large">${escapeHtml(row.firstScore)}</span></div>
              <div class="score-stack" data-label="복습 점수"><span class="value-large">${escapeHtml(row.reviewScore)}</span></div>
              ${renderRecordCell("복습 일자", row.reviewDate)}
            </div>
          `,
        )
        .join("");
    }

    function renderSeedCards(records) {
      if (!records.length) {
        return renderEmptyState("학습 기록이 없어요");
      }
      return `
        <div class="seed-grid">
          ${records
            .map(
              (card) => `
                <article class="seed-card">
                  <div class="seed-card__round">${escapeHtml(card.round)}</div>
                  <div class="seed-card__letters">
                    ${card.letters
                      .map(
                        (letter) => `
                          <div class="seed-letter">
                            <div class="seed-letter__char">${escapeHtml(letter.char)}</div>
                            <div class="seed-letter__label">${escapeHtml(letter.label)}</div>
                          </div>
                        `,
                      )
                      .join("")}
                  </div>
                  <div class="seed-card__date">${escapeHtml(card.date)}</div>
                </article>
              `,
            )
            .join("")}
        </div>
      `;
    }

    function bindEvents() {
      root.querySelectorAll("[data-tab]").forEach((button) => {
        button.addEventListener("click", () => {
          state.tab = button.getAttribute("data-tab");
          render();
        });
      });

      const curriculum = root.querySelector("#study-curriculum");
      const semester = root.querySelector("#study-semester");
      const subject = root.querySelector("#study-subject");
      const review = root.querySelector("#study-review");
      const level = root.querySelector("#study-level");
      const reset = root.querySelector("#study-reset");

      if (curriculum) curriculum.addEventListener("change", (event) => { state.curriculum = event.target.value; render(); });
      if (semester) semester.addEventListener("change", (event) => { state.semester = event.target.value; render(); });
      if (subject) subject.addEventListener("change", (event) => { state.subject = event.target.value; render(); });
      if (review) review.addEventListener("change", (event) => { state.review = event.target.value; render(); });
      if (level) level.addEventListener("change", (event) => { state.level = event.target.value; render(); });
      if (reset) {
        reset.addEventListener("click", () => {
          state.curriculum = "2022 개정";
          state.level = "3레벨";
          state.review = "전체";
          state.semester = "3학년 1학기";
          state.subject = "전체";
          render();
        });
      }
    }

    function render() {
      const isTextbook = state.tab === "textbook";
      const textbookRows = filterTextbookRecords();
      const seedCards = seedRecordMap[state.level] || [];
      const summaryCount = textbookRows.length
        ? state.review === "복습 완료"
          ? 12
          : state.review === "복습 없음"
            ? 18
            : 30
        : 0;

      const content = `
        <div class="section-stack">
          <div class="tabs">
            <button class="tab-button ${isTextbook ? "is-active" : ""}" type="button" data-tab="textbook">교과서 학습</button>
            <button class="tab-button ${!isTextbook ? "is-active" : ""}" type="button" data-tab="seed">씨앗글자</button>
          </div>
          ${
            isTextbook
              ? `
                <div class="section-stack" style="gap:28px;">
                  <div class="control-row">
                    ${renderSelectMarkup({
                      ariaLabel: "교과과정 선택",
                      id: "study-curriculum",
                      options: ["2022 개정", "2015 개정"],
                      value: state.curriculum,
                    })}
                    ${renderSelectMarkup({
                      ariaLabel: "학기 선택",
                      id: "study-semester",
                      options: ["3학년 1학기", "4학년 1학기"],
                      value: state.semester,
                    })}
                    ${renderSelectMarkup({
                      ariaLabel: "과목 필터",
                      id: "study-subject",
                      options: ["전체", "국어", "수학"],
                      value: state.subject,
                    })}
                    ${renderSelectMarkup({
                      ariaLabel: "복습 필터",
                      id: "study-review",
                      options: ["전체", "복습 완료", "복습 없음"],
                      value: state.review,
                    })}
                    <button class="btn-reset" id="study-reset" type="button">
                      <span>초기화</span>
                      <span class="inline-icon">${icon("reset")}</span>
                    </button>
                  </div>
                  <div class="section-stack" style="gap:8px;">
                    <p class="summary-text">전체 <strong>${summaryCount}</strong>건</p>
                    ${
                      textbookRows.length
                        ? `
                          <div class="table-stack">
                            <div class="record-header-row">
                              <span>학습 일자</span>
                              <span>회차</span>
                              <span>과목</span>
                              <span>단어</span>
                              <span>교과서</span>
                              <span>실전</span>
                              <span>최초 점수</span>
                              <span>복습 점수</span>
                              <span>복습 일자</span>
                            </div>
                            ${renderTableRows(textbookRows)}
                          </div>
                        `
                        : renderEmptyState("학습 기록이 없어요")
                    }
                  </div>
                </div>
              `
              : `
                <div class="section-stack" style="gap:28px;">
                  <div class="control-row">
                    ${renderSelectMarkup({
                      ariaLabel: "레벨 선택",
                      id: "study-level",
                      options: ["3레벨", "4레벨", "5레벨"],
                      value: state.level,
                    })}
                  </div>
                  ${renderSeedCards(seedCards)}
                </div>
              `
          }
        </div>
      `;

      root.innerHTML = renderShell("학습 기록", content);
      syncChromeState();
      bindEvents();
    }

    render();
  }

  function renderNoticePage(root) {
    const state = { openId: notices[0].id };

    function bindEvents() {
      root.querySelectorAll("[data-notice-id]").forEach((button) => {
        button.addEventListener("click", () => {
          const noticeId = button.getAttribute("data-notice-id");
          state.openId = state.openId === noticeId ? "" : noticeId;
          render();
        });
      });
    }

    function render() {
      const content = `
        <div class="notice-list">
          ${notices
            .map((notice) => {
              const isOpen = notice.id === state.openId;
              return `
                <article class="notice-item ${isOpen ? "is-open" : ""}">
                  <button class="notice-trigger" type="button" data-notice-id="${notice.id}" aria-expanded="${isOpen}">
                    <span class="notice-trigger__title">${escapeHtml(notice.title)}</span>
                    <span class="notice-trigger__meta">
                      <span class="notice-trigger__date">${escapeHtml(notice.date)}</span>
                      <span class="notice-trigger__chevron">${icon("chevron")}</span>
                    </span>
                  </button>
                  <div class="notice-body">
                    ${
                      isOpen
                        ? `
                          <div class="notice-body__inner">
                            <img class="notice-body__image" src="${assets.noticeDemo}" alt="공지사항 첨부 예시 이미지">
                            <p class="notice-copy">${escapeHtml(notice.body)}</p>
                            <div class="attachment-row">
                              <span class="file-icon">${icon("file")}</span>
                              <span>${escapeHtml(notice.attachment)}</span>
                            </div>
                          </div>
                        `
                        : ""
                    }
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      `;

      root.innerHTML = renderShell("공지사항", content);
      syncChromeState();
      bindEvents();
    }

    render();
  }

  function renderReportListPage(root) {
    const state = {
      previewEmpty: new URLSearchParams(window.location.search).get("empty") === "1",
      sort: "최신순",
      activeReportNumber: "",
    };

    function sortedReports() {
      const list = [...reports];
      return state.sort === "오래된순" ? list.reverse() : list;
    }

    function openReport(reportNumber) {
      state.activeReportNumber = String(reportNumber || "");
      render();
    }

    function bindEvents() {
      const sortSelect = root.querySelector("#report-sort");
      if (sortSelect) {
        sortSelect.addEventListener("change", (event) => {
          state.sort = event.target.value;
          render();
        });
      }

      root.querySelectorAll("[data-report-open]").forEach((row) => {
        row.addEventListener("click", (event) => {
          if (event.target.closest("[data-report-open-button]")) return;
          openReport(row.dataset.reportOpen);
        });

        row.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          openReport(row.dataset.reportOpen);
        });
      });

      root.querySelectorAll("[data-report-open-button]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          openReport(button.dataset.reportOpenButton);
        });
      });
    }

    function render() {
      const list = state.previewEmpty ? [] : sortedReports();
      const count = list.length ? 30 : 0;
      const content = `
        <div class="section-stack">
          <div class="report-toolbar">
            <p class="summary-text">전체 <strong>${count}</strong>건</p>
            ${renderSelectMarkup({
              ariaLabel: "정렬 선택",
              id: "report-sort",
              options: ["최신순", "오래된순"],
              value: state.sort,
              width: "120px",
            })}
          </div>
          ${
            list.length
              ? `
                <div class="report-list">
                  ${list
                    .map(
                      (report) => {
                        const isActive = state.activeReportNumber === String(report.number);
                        return `
                        <article
                          class="report-row${isActive ? " is-active" : ""}"
                          tabindex="0"
                          aria-label="${escapeHtml(report.title)} 보기"
                          data-report-open="${escapeHtml(report.number)}"
                        >
                          <div class="report-row__number">${escapeHtml(report.number)}</div>
                          <div class="report-row__grade">${escapeHtml(report.grade)}</div>
                          <div class="report-row__title">${escapeHtml(report.title)}</div>
                          <div class="report-row__period">${report.period ? escapeHtml(report.period) : "-"}</div>
                          <button
                            class="btn-outline-green"
                            type="button"
                            data-report-open-button="${escapeHtml(report.number)}"
                          >보기</button>
                        </article>
                      `;
                      },
                    )
                    .join("")}
                </div>
              `
              : renderEmptyState("학습 보고서가 없어요")
          }
        </div>
      `;

      root.innerHTML = renderShell("학습 보고서", content);
      syncChromeState();
      bindEvents();
    }

    render();
  }

  function renderMyInfoPage(root) {
    const content = `
      <div class="section-stack">
        <section class="info-summary">
          <article class="summary-item">
            <span class="summary-icon">${icon("user")}</span>
            <span class="summary-kicker">학생 이름</span>
            <span class="summary-value">김지우</span>
          </article>
          <article class="summary-item">
            <span class="summary-icon">${icon("at")}</span>
            <span class="summary-kicker">아이디</span>
            <span class="summary-value">student@example.com</span>
          </article>
          <article class="summary-item">
            <span class="summary-icon">${icon("book")}</span>
            <span class="summary-kicker">학습 학기</span>
            <span class="summary-value">3학년 1학기</span>
          </article>
        </section>

        <section class="form-card">
          <div class="field-cluster">
            <h2 class="field-title">학교 정보</h2>
            <div class="field-grid-2">
              <label class="input-shell">
                <span class="visually-hidden">학교명 입력</span>
                <input class="text-input" type="text" placeholder="학교명을 입력해주세요">
              </label>
              ${renderSelectMarkup({
                ariaLabel: "학년 선택",
                id: "profile-grade",
                options: ["학년 선택", "1학년", "2학년", "3학년", "4학년", "5학년", "6학년"],
                value: "학년 선택",
                width: "100%",
              })}
            </div>
          </div>

          <div class="field-cluster">
            <h2 class="field-title">생년월일</h2>
            <div class="field-grid-2">
              <label class="input-shell">
                <span class="visually-hidden">생년월일 입력</span>
                <input class="text-input" type="text" placeholder="연도. 월. 일.">
                <span class="input-shell__icon">${icon("calendar")}</span>
              </label>
              <div class="pill-input">만 나이</div>
            </div>
          </div>

          <div class="field-cluster">
            <h2 class="field-title">전화번호</h2>
            <p class="field-help">상담이 가능한 전화번호를 입력해주세요. 학부모 전화번호를 권장해요.</p>
            <div class="field-cluster">
              <div class="field-row">
                <label class="input-shell">
                  <span class="visually-hidden">전화번호 입력</span>
                  <input class="text-input" type="text" placeholder="">
                </label>
                <button class="btn-brown" type="button">전화번호 인증</button>
              </div>
              <p class="field-help field-help--error">전화번호가 유효하지 않습니다. 전화번호를 확인해주세요.</p>
            </div>
            <div class="field-cluster">
              <div class="field-row">
                <label class="input-shell is-timer">
                  <span class="visually-hidden">인증번호 입력</span>
                  <input class="text-input" type="text" placeholder="">
                  <span class="input-shell__suffix">03:21</span>
                </label>
                <button class="btn-brown" type="button">전화번호 인증</button>
              </div>
              <p class="field-help field-help--error">인증번호가 일치하지 않습니다. 다시 입력해주세요.</p>
            </div>
          </div>
        </section>

        <section class="form-card">
          <div class="field-cluster">
            <h2 class="field-title">새 비밀번호</h2>
            <label class="input-shell">
              <span class="visually-hidden">새 비밀번호 입력</span>
              <input class="text-input" type="password" placeholder="새 비밀번호를 입력해주세요">
            </label>
          </div>
          <div class="field-cluster">
            <h2 class="field-title">새 비밀번호 확인</h2>
            <label class="input-shell">
              <span class="visually-hidden">새 비밀번호 확인 입력</span>
              <input class="text-input" type="password" placeholder="다시 입력해주세요">
            </label>
          </div>
        </section>

        <div class="action-row">
          <button class="btn-brown" type="button">취소</button>
          <button class="btn-orange" type="button">저장</button>
        </div>
      </div>
    `;

    root.innerHTML = renderShell("내 정보", content);
    syncChromeState();
  }

  function renderDesignSystemPage(root) {
    const swatches = colorTokens
      .map(
        (token) => `
          <div class="swatch">
            <div class="swatch__color" style="background:${token.value}"></div>
            <div class="swatch__meta">
              <strong>${escapeHtml(token.name)}</strong>
              <span>${escapeHtml(token.value)}</span>
            </div>
          </div>
        `,
      )
      .join("");

    const content = `
      <div class="system-layout">
        <section class="system-section">
          <h2>Color System</h2>
          <p>브라운 계열을 구조와 텍스트의 중심에 두고, 크림 계열을 배경과 카드에 사용합니다. 선택 상태와 핵심 강조는 그린으로 통일하고, 경고와 CTA는 오렌지로 구분합니다.</p>
          <div class="swatch-grid">${swatches}</div>
        </section>

        <section class="system-section">
          <h2>Typography</h2>
          <div class="type-samples">
            <div class="type-sample type-sample--title">
              <span class="type-sample__label">Page Title / 32px / NanumSquareRound ExtraBold</span>
              학습 기록
            </div>
            <div class="type-sample type-sample--heading">
              <span class="type-sample__label">Section Heading / 20px / NanumSquareRound ExtraBold</span>
              학교 정보
            </div>
            <div class="type-sample type-sample--body">
              <span class="type-sample__label">Body / 16px / Noto Sans KR</span>
              상담이 가능한 전화번호를 입력해주세요. 학부모 전화번호를 권장해요.
            </div>
          </div>
        </section>

        <section class="system-section">
          <h2>Page Layout Rules</h2>
          <div class="notes-list">
            <div class="note-pill"><strong>Container</strong><span>최대 너비 1000px, 좌우 기본 패딩 32px, 모바일에서는 12~20px로 축소합니다.</span></div>
            <div class="note-pill"><strong>Page Background</strong><span>전체 배경은 cream50을 사용해 차분한 학습 서비스 톤을 유지합니다.</span></div>
            <div class="note-pill"><strong>Vertical Rhythm</strong><span>큰 섹션 간 간격은 32px, 컴포넌트 내부 묶음은 24px 또는 16px로 정렬합니다.</span></div>
          </div>
        </section>

        <section class="system-section">
          <h2>Component Samples</h2>
          <div class="preview-grid">
            <div class="preview-card">
              <h3>GNB Sample</h3>
              <div class="soft-card" style="padding:16px; background:#41230c; border:2px solid #f8ebd3;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                  <span class="home-chip">${icon("home")}</span>
                  <img src="${assets.logo}" alt="" style="width:92px;">
                  <div style="display:flex; gap:8px;">
                    <span class="header-icon-button">${icon("notice")}</span>
                    <span class="header-icon-button">${icon("menu")}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="preview-card">
              <h3>Page Title</h3>
              ${renderPageTitle("공지사항")}
            </div>
            <div class="preview-card">
              <h3>Tabs</h3>
              <div class="tabs">
                <button class="tab-button is-active" type="button">교과서 학습</button>
                <button class="tab-button" type="button">씨앗글자</button>
              </div>
            </div>
            <div class="preview-card">
              <h3>Button Styles</h3>
              <div class="control-row">
                <button class="btn-outline-green" type="button">보기</button>
                <button class="btn-reset" type="button"><span>초기화</span><span>${icon("reset")}</span></button>
                <button class="btn-brown" type="button" style="min-width:140px;">취소</button>
                <button class="btn-orange" type="button" style="min-width:140px;">저장</button>
              </div>
            </div>
            <div class="preview-card">
              <h3>Select / Filter</h3>
              <div class="control-row">
                ${renderSelectMarkup({
                  ariaLabel: "샘플 선택",
                  id: "guide-select",
                  options: ["최신순", "오래된순"],
                  value: "최신순",
                  width: "160px",
                })}
                ${renderSelectMarkup({
                  ariaLabel: "학기 선택",
                  id: "guide-semester",
                  options: ["3학년 1학기", "4학년 1학기"],
                  value: "3학년 1학기",
                  width: "180px",
                })}
              </div>
            </div>
            <div class="preview-card">
              <h3>Form / Input</h3>
              <div class="field-cluster">
                <label class="input-shell">
                  <input class="text-input" type="text" placeholder="학교명을 입력해주세요">
                </label>
                <label class="input-shell">
                  <input class="text-input" type="text" placeholder="연도. 월. 일.">
                  <span class="input-shell__icon">${icon("calendar")}</span>
                </label>
              </div>
            </div>
            <div class="preview-card">
              <h3>Table / List Row</h3>
              <div class="report-row">
                <div class="report-row__number">11</div>
                <div class="report-row__grade">3학년</div>
                <div class="report-row__title">2025년 9월 보고서</div>
                <div class="report-row__period">2025.09.01~2025.09.30</div>
                <button class="btn-outline-green" type="button">보기</button>
              </div>
            </div>
            <div class="preview-card">
              <h3>Empty State</h3>
              <div class="empty-state" style="min-height:320px;">
                <img src="${assets.noData}" alt="">
                <p>학습 보고서가 없어요</p>
              </div>
            </div>
          </div>
        </section>

        <section class="system-section">
          <h2>Card, Radius, Spacing Notes</h2>
          <div class="notes-list">
            <div class="note-pill"><strong>Card Styles</strong><span>주요 정보 카드와 폼 카드는 흰색 배경에 cream300 보더를 사용하고, 요약 카드와 보조 카드는 cream250 또는 cream200 배경을 사용합니다.</span></div>
            <div class="note-pill"><strong>Border Radius</strong><span>대형 카드 24px, 일반 카드/필터 16px, 소형 액션 버튼 10~12px을 기본값으로 사용합니다.</span></div>
            <div class="note-pill"><strong>Spacing Rules</strong><span>섹션 내부는 8px, 16px, 24px, 32px 스케일을 우선 사용하고 임의의 값은 피합니다.</span></div>
            <div class="note-pill"><strong>Active States</strong><span>탭, 선택값, 요약 카운트의 강조는 green500과 green700 조합으로 통일합니다.</span></div>
            <div class="note-pill"><strong>Empty State</strong><span>source/no-data.png를 중심 정렬로 배치하고, 한 줄 메시지를 브라운 텍스트로 배치해 차분한 빈 상태를 유지합니다.</span></div>
          </div>
        </section>
      </div>
    `;

    root.innerHTML = renderShell("디자인 시스템", content);
    syncChromeState();
  }

  function renderStudyRecordPageV2(root) {
    const query = new URLSearchParams(window.location.search);
    const pick = (key, allowed, fallback) => {
      const value = query.get(key);
      return value && allowed.includes(value) ? value : fallback;
    };
    const pickMulti = (key, allowed, fallback) => {
      const raw = query.get(key);
      if (!raw) return [...fallback];
      const values = raw
        .split(",")
        .map((value) => value.trim())
        .filter((value) => allowed.includes(value));
      return values.length ? values : [...fallback];
    };

    const subjectOptions = [
      { value: "all", label: "전체" },
      { value: "kor", label: "국어" },
      { value: "sci", label: "과학" },
      { value: "social", label: "사회" },
    ];
    const reviewOptions = [
      { value: "all", label: "전체" },
      { value: "reviewed", label: "복습" },
      { value: "unreviewed", label: "복습 안한 일자" },
    ];

    const state = {
      curriculum: pick("curriculum", ["2022 개정", "2015 개정"], "2022 개정"),
      level: pick("level", ["3단계", "4단계", "5단계"], "3단계"),
      semester: pick("semester", ["3학년 1학기", "4학년 1학기"], "3학년 1학기"),
      subjectFilters: pickMulti("subject", ["all", "kor", "sci", "social"], ["all"]),
      reviewFilters: pickMulti("review", ["all", "reviewed", "unreviewed"], ["all"]),
      tab: pick("tab", ["textbook", "seed"], "textbook"),
    };

    function getSubjectKey(subject) {
      if (subject === "과학") return "sci";
      if (subject === "사회") return "social";
      return "kor";
    }

    function isAllSelected(list) {
      return list.includes("all");
    }

    function toggleMultiSelect(list, value) {
      if (value === "all") return ["all"];
      const current = list.filter((item) => item !== "all");
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return next.length ? next : ["all"];
    }

    function filterTextbookRecords() {
      let rows = [...textbookRecords];
      if (state.curriculum !== "2022 개정" || state.semester !== "3학년 1학기") {
        return [];
      }
      if (!isAllSelected(state.subjectFilters)) {
        rows = rows.filter((row) => state.subjectFilters.includes(getSubjectKey(row.subject)));
      }
      if (!isAllSelected(state.reviewFilters)) {
        rows = rows.filter((row) => {
          const isReviewed = row.reviewDate !== "-";
          return (
            (isReviewed && state.reviewFilters.includes("reviewed")) ||
            (!isReviewed && state.reviewFilters.includes("unreviewed"))
          );
        });
      }
      return rows;
    }

    function renderRecordCell(label, value, extraClass) {
      return `<div class="cell ${extraClass || ""}" data-label="${escapeHtml(label)}">${escapeHtml(value)}</div>`;
    }

    function renderScoreCell(label, score) {
      return `
        <div class="score-stack" data-label="${escapeHtml(label)}">
          ${starIcon(score.grade)}
          <span class="value-small">${escapeHtml(score.score)}</span>
        </div>
      `;
    }

    function renderTableRows(rows) {
      return rows
        .map(
          (row) => `
            <div class="record-row">
              ${renderRecordCell("학습 일자", row.date)}
              ${renderRecordCell("회차", row.round)}
              ${renderRecordCell("과목", row.subject, "cell--subject")}
              ${renderScoreCell("어휘", row.word)}
              ${renderScoreCell("교과", row.textbook)}
              ${renderScoreCell("실전", row.practical)}
              <div class="score-stack" data-label="최초 점수"><span class="value-large">${escapeHtml(row.firstScore)}</span></div>
              <div class="score-stack" data-label="복습 점수"><span class="value-large">${escapeHtml(row.reviewScore)}</span></div>
              ${renderRecordCell("복습 일자", row.reviewDate)}
            </div>
          `,
        )
        .join("");
    }

    function renderSeedCards(records) {
      if (!records.length) {
        return renderEmptyState("학습 기록이 없어요.");
      }
      return `
        <div class="seed-grid">
          ${records
            .map(
              (card) => `
                <article class="seed-card">
                  <div class="seed-card__round">${escapeHtml(card.round)}</div>
                  <div class="seed-card__letters">
                    ${card.letters
                      .map(
                        (letter) => `
                          <div class="seed-letter">
                            <div class="seed-letter__char">${escapeHtml(letter.char)}</div>
                            <div class="seed-letter__label">${escapeHtml(letter.label)}</div>
                          </div>
                        `,
                      )
                      .join("")}
                  </div>
                  <div class="seed-card__date">${escapeHtml(card.date)}</div>
                </article>
              `,
            )
            .join("")}
        </div>
      `;
    }

    function renderFilterGroup(title, group, options, selectedValues) {
      return `
        <div class="filter-group">
          <span class="filter-group__label">${title}</span>
          <div class="filter-chip-row">
            ${options
              .map(
                (option) => `
                  <button
                    class="filter-chip ${selectedValues.includes(option.value) ? "is-active" : ""}"
                    type="button"
                    data-filter-group="${group}"
                    data-filter-value="${option.value}"
                    aria-pressed="${selectedValues.includes(option.value) ? "true" : "false"}"
                  >${option.label}</button>
                `,
              )
              .join("")}
          </div>
        </div>
      `;
    }

    function bindEvents() {
      root.querySelectorAll("[data-tab]").forEach((button) => {
        button.addEventListener("click", () => {
          state.tab = button.getAttribute("data-tab");
          render();
        });
      });

      const curriculum = root.querySelector("#study-curriculum");
      const semester = root.querySelector("#study-semester");
      const level = root.querySelector("#study-level");
      const reset = root.querySelector("#study-reset");

      if (curriculum) {
        curriculum.addEventListener("change", (event) => {
          state.curriculum = event.target.value;
          render();
        });
      }
      if (semester) {
        semester.addEventListener("change", (event) => {
          state.semester = event.target.value;
          render();
        });
      }
      if (level) {
        level.addEventListener("change", (event) => {
          state.level = event.target.value;
          render();
        });
      }
      if (reset) {
        reset.addEventListener("click", () => {
          state.curriculum = "2022 개정";
          state.level = "3단계";
          state.semester = "3학년 1학기";
          state.subjectFilters = ["all"];
          state.reviewFilters = ["all"];
          render();
        });
      }

      root.querySelectorAll("[data-filter-group]").forEach((button) => {
        button.addEventListener("click", () => {
          const group = button.getAttribute("data-filter-group");
          const value = button.getAttribute("data-filter-value");
          if (!group || !value) return;
          if (group === "subject") {
            state.subjectFilters = toggleMultiSelect(state.subjectFilters, value);
          }
          if (group === "review") {
            state.reviewFilters = toggleMultiSelect(state.reviewFilters, value);
          }
          render();
        });
      });
    }

    function render() {
      const isTextbook = state.tab === "textbook";
      const textbookRows = filterTextbookRecords();
      const seedCards = seedRecordMap[state.level] || [];

      const content = `
        <div class="section-stack">
          <div class="tabs">
            <button class="tab-button ${isTextbook ? "is-active" : ""}" type="button" data-tab="textbook">교과서 학습</button>
            <button class="tab-button ${!isTextbook ? "is-active" : ""}" type="button" data-tab="seed">씨앗글자</button>
          </div>
          ${
            isTextbook
              ? `
                <div class="section-stack" style="gap:28px;">
                  <div class="control-row">
                    ${renderSelectMarkup({
                      ariaLabel: "교육과정 선택",
                      id: "study-curriculum",
                      options: ["2022 개정", "2015 개정"],
                      value: state.curriculum,
                    })}
                    ${renderSelectMarkup({
                      ariaLabel: "학기 선택",
                      id: "study-semester",
                      options: ["3학년 1학기", "4학년 1학기"],
                      value: state.semester,
                    })}
                    <button class="btn-reset" id="study-reset" type="button">
                      <span>초기화</span>
                      <span class="inline-icon">${icon("reset")}</span>
                    </button>
                  </div>
                  <div class="filter-panel">
                    ${renderFilterGroup("과목", "subject", subjectOptions, state.subjectFilters)}
                    ${renderFilterGroup("복습", "review", reviewOptions, state.reviewFilters)}
                  </div>
                  <div class="section-stack" style="gap:8px;">
                    <p class="summary-text">전체 <strong>${textbookRows.length}</strong>건</p>
                    ${
                      textbookRows.length
                        ? `
                          <div class="table-stack">
                            <div class="record-header-row">
                              <span>학습 일자</span>
                              <span>회차</span>
                              <span>과목</span>
                              <span>어휘</span>
                              <span>교과</span>
                              <span>실전</span>
                              <span>최초 점수</span>
                              <span>복습 점수</span>
                              <span>복습 일자</span>
                            </div>
                            ${renderTableRows(textbookRows)}
                          </div>
                        `
                        : renderEmptyState("학습 기록이 없어요.")
                    }
                  </div>
                </div>
              `
              : `
                <div class="section-stack" style="gap:28px;">
                  <div class="control-row">
                    ${renderSelectMarkup({
                      ariaLabel: "단계 선택",
                      id: "study-level",
                      options: ["3단계", "4단계", "5단계"],
                      value: state.level,
                    })}
                  </div>
                  ${renderSeedCards(seedCards)}
                </div>
              `
          }
        </div>
      `;

      root.innerHTML = renderShell("학습 기록", content);
      syncChromeState();
      bindEvents();
    }

    render();
  }

  function renderMyInfoPageV2(root) {
    const state = {
      birthDate: "",
    };

    function formatBirthDate(value) {
      if (!value) return "";
      const [year, month, day] = value.split("-");
      return `${year}. ${month}. ${day}`;
    }

    function getAgeLabel(value) {
      if (!value) return "만 나이";
      const today = new Date();
      const birthDate = new Date(`${value}T00:00:00`);
      let age = today.getFullYear() - birthDate.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      if (!hasBirthdayPassed) age -= 1;
      return `만 ${Math.max(age, 0)}세`;
    }

    function openBirthDatePicker() {
      const picker = root.querySelector("#birthdate-picker");
      if (!picker) return;
      if (typeof picker.showPicker === "function") {
        picker.showPicker();
        return;
      }
      picker.focus();
      picker.click();
    }

    function bindEvents() {
      const birthdateTrigger = root.querySelector("[data-birthdate-trigger]");
      const birthdatePicker = root.querySelector("#birthdate-picker");
      if (birthdateTrigger) {
        birthdateTrigger.addEventListener("click", openBirthDatePicker);
        birthdateTrigger.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openBirthDatePicker();
          }
        });
      }
      if (birthdatePicker) {
        birthdatePicker.addEventListener("change", (event) => {
          state.birthDate = event.target.value;
          render();
        });
      }
    }

    function render() {
      const content = `
        <div class="section-stack">
          <section class="info-summary">
            <article class="summary-item">
              <span class="summary-icon">${icon("user")}</span>
              <span class="summary-kicker">학생 이름</span>
              <span class="summary-value">홍길동</span>
            </article>
            <article class="summary-item">
              <span class="summary-icon">${icon("at")}</span>
              <span class="summary-kicker">아이디</span>
              <span class="summary-value">student@example.com</span>
            </article>
            <article class="summary-item">
              <span class="summary-icon">${icon("book")}</span>
              <span class="summary-kicker">학습 학기</span>
              <span class="summary-value">3학년 1학기</span>
            </article>
          </section>

          <section class="form-card">
            <div class="field-cluster">
              <h2 class="field-title">학교 정보</h2>
              <div class="field-grid-2">
                <label class="input-shell">
                  <span class="visually-hidden">학교명 입력</span>
                  <input class="text-input" type="text" placeholder="학교명을 입력해 주세요">
                </label>
                ${renderSelectMarkup({
                  ariaLabel: "학년 선택",
                  id: "profile-grade",
                  options: ["학년 선택", "1학년", "2학년", "3학년", "4학년", "5학년", "6학년"],
                  value: "학년 선택",
                  width: "100%",
                })}
              </div>
            </div>

            <div class="field-cluster">
              <h2 class="field-title">생년월일</h2>
              <div class="field-grid-2">
                <label class="input-shell input-shell--trigger" data-birthdate-trigger tabindex="0" role="button" aria-label="생년월일 선택">
                  <span class="visually-hidden">생년월일 선택</span>
                  <input
                    class="text-input text-input--picker"
                    type="text"
                    placeholder="생년월일을 선택해 주세요"
                    value="${escapeHtml(formatBirthDate(state.birthDate))}"
                    readonly
                  >
                  <input class="native-date-input" id="birthdate-picker" type="date" value="${escapeHtml(state.birthDate)}" tabindex="-1" aria-hidden="true">
                  <span class="input-shell__icon">${icon("calendar")}</span>
                </label>
                <div class="pill-input">${getAgeLabel(state.birthDate)}</div>
              </div>
            </div>

            <div class="field-cluster">
              <h2 class="field-title">전화번호</h2>
              <p class="field-help">상담이 가능한 전화번호를 입력해 주세요. 학생 명의 전화번호를 권장해요.</p>
              <div class="field-cluster">
                <div class="field-row">
                  <label class="input-shell">
                    <span class="visually-hidden">전화번호 입력</span>
                    <input class="text-input" type="text" placeholder="">
                  </label>
                  <button class="btn-brown" type="button">전화번호 인증</button>
                </div>
                <p class="field-help field-help--error">전화번호가 유효하지 않습니다. 전화번호를 확인해 주세요.</p>
              </div>
              <div class="field-cluster">
                <div class="field-row">
                  <label class="input-shell is-timer">
                    <span class="visually-hidden">인증번호 입력</span>
                    <input class="text-input" type="text" placeholder="">
                    <span class="input-shell__suffix">03:21</span>
                  </label>
                  <button class="btn-brown" type="button">인증번호 확인</button>
                </div>
                <p class="field-help field-help--error">인증번호가 일치하지 않습니다. 다시 입력해 주세요.</p>
              </div>
            </div>
          </section>

          <section class="form-card">
            <div class="field-cluster">
              <h2 class="field-title">새 비밀번호</h2>
              <label class="input-shell">
                <span class="visually-hidden">새 비밀번호 입력</span>
                <input class="text-input" type="password" placeholder="새 비밀번호를 입력해 주세요">
              </label>
            </div>
            <div class="field-cluster">
              <h2 class="field-title">새 비밀번호 확인</h2>
              <label class="input-shell">
                <span class="visually-hidden">새 비밀번호 확인 입력</span>
                <input class="text-input" type="password" placeholder="다시 입력해 주세요">
              </label>
            </div>
          </section>

          <div class="action-row">
            <button class="btn-brown" type="button">취소</button>
            <button class="btn-orange" type="button">저장</button>
          </div>
        </div>
      `;

      root.innerHTML = renderShell("내 정보", content);
      syncChromeState();
      bindEvents();
    }

    render();
  }

  function renderSettingsPageV2(root) {
    const fontSizes = [14, 16, 18, 20, 22, 24];
    const previewText =
      "매일국어의 귀여운 피노와 아콘은 단짝 친구입니다. 하지만 둘의 성향은 정반대입니다. 피노는 새로운 일이 일어났을때 눈이 반짝반짝하게 바로 도전하고 싶어하지만 아콘이는 무슨일이 일어나지 않을까 걱정하며 많은 고민을 합니다. 여러분은 새로운 일이 일어났을때 어떻게 행동하나요?";
    const defaults = {
      fontSize: 20,
      readingMode: "소리 모드",
      readingSpeed: "x1.2",
      deviceMode: "권장사양 모드",
      saveMessage: "",
    };

    const state = loadState();

    function loadState() {
      try {
        const raw = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}");
        return sanitizeState(raw);
      } catch (error) {
        return { ...defaults };
      }
    }

    function sanitizeState(raw) {
      const nextState = { ...defaults };
      if (fontSizes.includes(Number(raw.fontSize))) {
        nextState.fontSize = Number(raw.fontSize);
      }
      if (["소리 모드", "클릭 모드"].includes(raw.readingMode)) {
        nextState.readingMode = raw.readingMode;
      }
      if (["x0.8", "x1", "x1.2", "x1.4", "x1.8"].includes(raw.readingSpeed)) {
        nextState.readingSpeed = raw.readingSpeed;
      }
      if (["권장사양 모드", "저사양 모드"].includes(raw.deviceMode)) {
        nextState.deviceMode = raw.deviceMode;
      }
      return nextState;
    }

    function persistState() {
      const storedState = {
        fontSize: state.fontSize,
        readingMode: state.readingMode,
        readingSpeed: state.readingSpeed,
        deviceMode: state.deviceMode,
      };
      try {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(storedState));
      } catch (error) {
        // Ignore storage failures in the prototype environment.
      }
    }

    function clearSaveMessage() {
      if (!state.saveMessage) return;
      state.saveMessage = "";
    }

    function setFontSize(size) {
      if (!fontSizes.includes(size)) return;
      state.fontSize = size;
      clearSaveMessage();
      render();
    }

    function stepFontSize(direction) {
      const currentIndex = fontSizes.indexOf(state.fontSize);
      const nextIndex = Math.min(fontSizes.length - 1, Math.max(0, currentIndex + direction));
      setFontSize(fontSizes[nextIndex]);
    }

    function setOption(group, value) {
      if (!(group in defaults)) return;
      state[group] = value;
      clearSaveMessage();
      render();
    }

    function saveSettings() {
      persistState();
      state.saveMessage = "학습환경설정이 저장되었어요.";
      render();
    }

    function renderSettingOption(group, value) {
      const isActive = state[group] === value;
      return `
        <button
          class="setting-option${isActive ? " is-active" : ""}"
          type="button"
          data-setting-group="${escapeHtml(group)}"
          data-setting-value="${escapeHtml(value)}"
          aria-pressed="${isActive ? "true" : "false"}"
        >${escapeHtml(value)}</button>
      `;
    }

    function renderSettingGroup(title, helper, group, options) {
      return `
        <section class="setting-group">
          <div class="setting-group__copy">
            <h2 class="field-title">${escapeHtml(title)}</h2>
            <p class="field-help">${escapeHtml(helper)}</p>
          </div>
          <div class="setting-option-row">
            ${options.map((option) => renderSettingOption(group, option)).join("")}
          </div>
        </section>
      `;
    }

    function bindEvents() {
      root.querySelectorAll("[data-setting-group]").forEach((button) => {
        button.addEventListener("click", () => {
          setOption(button.dataset.settingGroup, button.dataset.settingValue);
        });
      });

      root.querySelectorAll("[data-font-size]").forEach((button) => {
        button.addEventListener("click", () => {
          setFontSize(Number(button.dataset.fontSize));
        });
      });

      root.querySelectorAll("[data-font-step]").forEach((button) => {
        button.addEventListener("click", () => {
          stepFontSize(Number(button.dataset.fontStep));
        });
      });

      const slider = root.querySelector("[data-font-slider]");
      if (slider) {
        slider.addEventListener("input", (event) => {
          const size = fontSizes[Number(event.target.value)] || defaults.fontSize;
          setFontSize(size);
        });
      }

      const saveButton = root.querySelector("[data-settings-save]");
      if (saveButton) {
        saveButton.addEventListener("click", saveSettings);
      }
    }

    function render() {
      const fontIndex = fontSizes.indexOf(state.fontSize);
      const sliderProgress = (fontIndex / (fontSizes.length - 1)) * 100;
      const content = `
        <div class="section-stack">
          <section class="form-card setting-card setting-card--font">
            <div class="setting-card__head">
              <div>
                <h2 class="field-title">글꼴 크기</h2>
                <p class="field-help">매일국어 학습 시 글꼴 사이즈를 조정할 수 있는 지문에서만 적용됩니다.</p>
              </div>
            </div>

            <div class="font-size-control">
              <div class="font-size-stepper">
                <button class="font-step-button" type="button" data-font-step="-1" aria-label="글꼴 크기 줄이기">
                  <i class="fa-solid fa-minus" aria-hidden="true"></i>
                </button>
                <div class="font-size-options">
                  ${fontSizes
                    .map((size) => {
                      const isActive = state.fontSize === size;
                      return `
                        <button
                          class="setting-option setting-option--size${isActive ? " is-active" : ""}"
                          type="button"
                          data-font-size="${size}"
                          aria-pressed="${isActive ? "true" : "false"}"
                        >${size}</button>
                      `;
                    })
                    .join("")}
                </div>
                <button class="font-step-button" type="button" data-font-step="1" aria-label="글꼴 크기 키우기">
                  <i class="fa-solid fa-plus" aria-hidden="true"></i>
                </button>
              </div>

              <div class="font-slider-block">
                <input
                  class="font-size-slider"
                  type="range"
                  min="0"
                  max="${fontSizes.length - 1}"
                  step="1"
                  value="${fontIndex}"
                  data-font-slider
                  aria-label="글꼴 크기 슬라이더"
                  style="--range-progress:${sliderProgress}%"
                >
                <div class="font-slider-labels" aria-hidden="true">
                  ${fontSizes.map((size) => `<span>${size}</span>`).join("")}
                </div>
              </div>
            </div>

            <div class="setting-preview">
              <p class="setting-preview__text" style="font-size:${state.fontSize}px;">${escapeHtml(previewText)}</p>
            </div>
          </section>

          <section class="form-card setting-card">
            ${renderSettingGroup(
              "책읽기 모드",
              "읽어 보기 학습의 두 가지 모드 중 한 가지를 선택해 주세요.",
              "readingMode",
              ["소리 모드", "클릭 모드"],
            )}
            ${renderSettingGroup(
              "읽기 속도",
              "소리 모드의 다섯 가지 속도 중 한 가지를 선택해 주세요.",
              "readingSpeed",
              ["x0.8", "x1", "x1.2", "x1.4", "x1.8"],
            )}
            ${renderSettingGroup(
              "저사양 모드",
              "저사양 PC 혹은 태블릿을 이용하는 학생을 위한 모드입니다.",
              "deviceMode",
              ["권장사양 모드", "저사양 모드"],
            )}
          </section>

          <div class="settings-feedback${state.saveMessage ? " is-visible" : ""}">${escapeHtml(state.saveMessage || " ")}</div>

          <div class="action-row">
            <button class="btn-brown" type="button" data-nav-target="home">홈으로</button>
            <button class="btn-orange" type="button" data-settings-save>저장하기</button>
          </div>
        </div>
      `;

      root.innerHTML = renderShell("학습환경설정", content);
      syncChromeState();
      bindEvents();
    }

    render();
  }

  function boot() {
    const root = document.getElementById("app");
    const page = document.body.dataset.page;
    if (!root || !page) return;

    bindChromeEvents();

    if (page === "study-record") {
      renderStudyRecordPageV2(root);
      return;
    }
    if (page === "notice") {
      renderNoticePage(root);
      return;
    }
    if (page === "report-list") {
      renderReportListPage(root);
      return;
    }
    if (page === "my-info") {
      renderMyInfoPageV2(root);
      return;
    }
    if (page === "settings") {
      renderSettingsPageV2(root);
      return;
    }
    if (page === "design-system") {
      renderDesignSystemPage(root);
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
