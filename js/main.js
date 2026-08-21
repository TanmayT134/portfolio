/* =====================================================
   PREMIUM LOADING SCREEN
===================================================== */

(() => {
  "use strict";

  const loader =
    document.getElementById("loader");

  const percent =
    document.getElementById("loader-percent");

  const progress =
    document.getElementById("loader-progress");

  const status =
    document.getElementById("loader-status");

  if (!loader) {
    document.body.classList.remove(
      "is-loading"
    );

    document.body.classList.add(
      "page-ready"
    );

    return;
  }

  /*
   * LOCK PAGE INTERACTION WHILE LOADING
   */
  document.body.classList.add(
    "is-loading"
  );

  const blockedKeys = new Set([
    " ",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "PageUp",
    "PageDown",
    "Home",
    "End"
  ]);

  const preventLoadingScroll = (event) => {
    event.preventDefault();
  };

  const preventLoadingKeys = (event) => {
    if (blockedKeys.has(event.key)) {
      event.preventDefault();
    }
  };

  const preventLoadingDrag = (event) => {
    event.preventDefault();
  };

  window.addEventListener(
    "wheel",
    preventLoadingScroll,
    { passive: false }
  );

  window.addEventListener(
    "touchmove",
    preventLoadingScroll,
    { passive: false }
  );

  window.addEventListener(
    "keydown",
    preventLoadingKeys,
    { passive: false }
  );

  window.addEventListener(
    "dragstart",
    preventLoadingDrag
  );

  /*
   * Minimum amount of time the loader
   * should remain visible.
   *
   * 4000ms = 4 seconds
   */
  const MIN_LOADING_TIME = 4000;

  const loaderStartTime =
    performance.now();

  let value = 0;

  let pageLoaded =
    document.readyState === "complete";

  let progressTimer = null;

  let finishing = false;

  /* -----------------------------------------
     STATUS MESSAGES
  ----------------------------------------- */

  const statuses = [
    "INITIALIZING EXPERIENCE",
    "LOADING INTERFACE",
    "PREPARING PROJECTS",
    "BUILDING EXPERIENCE",
    "ALMOST READY"
  ];

  const updateStatus = (
    currentValue
  ) => {

    if (!status) {
      return;
    }

    const index =
      Math.min(
        statuses.length - 1,
        Math.floor(
          currentValue /
          (100 / statuses.length)
        )
      );

    status.textContent =
      statuses[index];

  };

  /* -----------------------------------------
     UPDATE PROGRESS UI
  ----------------------------------------- */

  const updateProgress = (
    currentValue
  ) => {

    const rounded =
      Math.floor(currentValue);

    if (percent) {
      percent.textContent =
        `${rounded}%`;
    }

    if (progress) {
      progress.style.width =
        `${currentValue}%`;
    }

    updateStatus(
      currentValue
    );

  };

  /* -----------------------------------------
     PROGRESS ANIMATION
  ----------------------------------------- */

  const animateProgress = () => {

    const elapsed =
      performance.now() -
      loaderStartTime;

    /*
     * Page has loaded, but the minimum
     * loading duration has not finished.
     *
     * Keep the loader moving toward 96%
     * instead of finishing immediately.
     */

    if (
      pageLoaded &&
      elapsed < MIN_LOADING_TIME
    ) {

      if (value < 96) {

        value +=
          Math.max(
            0.35,
            (96 - value) * 0.035
          );

        if (value > 96) {
          value = 96;
        }

        updateProgress(
          value
        );

      }

      progressTimer =
        setTimeout(
          animateProgress,
          50
        );

      return;

    }

    /*
     * Real page has loaded and the
     * minimum loader duration has passed.
     */

    if (pageLoaded) {

      if (value < 100) {

        value +=
          Math.max(
            1,
            (100 - value) * 0.15
          );

        if (value > 100) {
          value = 100;
        }

        updateProgress(
          value
        );

        progressTimer =
          setTimeout(
            animateProgress,
            35
          );

        return;

      }

      finishLoader();

      return;

    }

    /*
     * Page is still loading.
     *
     * Move toward approximately 88%
     * but never get stuck at 100%.
     */

    if (value < 88) {

      value +=
        Math.max(
          0.35,
          (88 - value) * 0.035
        );

      if (value > 88) {
        value = 88;
      }

      updateProgress(
        value
      );

    }

    progressTimer =
      setTimeout(
        animateProgress,
        100
      );

  };

  /* -----------------------------------------
     FINISH LOADER
  ----------------------------------------- */

  const finishLoader = () => {

    if (finishing) {
      return;
    }

    finishing = true;

    clearTimeout(
      progressTimer
    );

    value = 100;

    updateProgress(
      100
    );

    if (status) {

      status.style.opacity =
        "0";

      setTimeout(
        () => {

          status.textContent =
            "WELCOME";

          status.style.opacity =
            "1";

        },
        150
      );

    }

    /*
     * Start the main page entrance.
     */

    setTimeout(
      () => {

        document.body.classList.add(
          "page-ready"
        );

        /*
         * Fade out the loader.
         */

        setTimeout(
          () => {

            loader.classList.add(
              "loaded"
            );

            /*
             * IMPORTANT:
             * Keep scrolling locked until
             * the loader transition finishes.
             */

            setTimeout(
              () => {

                /*
                 * Remove the loading screen.
                 */
                loader.remove();

                /*
                 * Restore normal page state.
                 */
                document.body.classList.remove(
                  "is-loading"
                );

                /*
                 * Restore normal scrolling.
                 */
                document.documentElement.style
                  .removeProperty(
                    "overflow"
                  );

                document.body.style
                  .removeProperty(
                    "overflow"
                  );

                /*
                 * IMPORTANT:
                 * Remove all temporary loading
                 * interaction blockers.
                 */
                window.removeEventListener(
                  "wheel",
                  preventLoadingScroll
                );

                window.removeEventListener(
                  "touchmove",
                  preventLoadingScroll
                );

                window.removeEventListener(
                  "keydown",
                  preventLoadingKeys
                );

                window.removeEventListener(
                  "dragstart",
                  preventLoadingDrag
                );

              },
              1000
            );

          },
          150
        );

      },
      500
    );

  };

  /* -----------------------------------------
     ACTUAL PAGE LOAD
  ----------------------------------------- */

  if (
    document.readyState ===
    "complete"
  ) {

    pageLoaded = true;

  } else {

    window.addEventListener(
      "load",
      () => {

        pageLoaded = true;

      },
      {
        once: true
      }
    );

  }

  /* -----------------------------------------
     SAFETY TIMEOUT
  -----------------------------------------

     If one external resource hangs forever,
     don't allow the portfolio to remain
     frozen indefinitely.

  ----------------------------------------- */

  setTimeout(
    () => {

      pageLoaded = true;

    },
    8000
  );

  /* -----------------------------------------
     START
  ----------------------------------------- */

  updateProgress(
    0
  );

  setTimeout(
    () => {

      animateProgress();

    },
    150
  );

})();

(() => {
  "use strict";

  /* =====================================================
     CONFIG
  ====================================================== */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =====================================================
     DOM
  ====================================================== */

  const body = document.body;

  const navbar =
    document.querySelector(".navbar");

  const menuToggle =
    document.querySelector(".menu-toggle");

  const mobileMenu =
    document.querySelector(".mobile-menu");

  const cursorDot =
    document.querySelector(".cursor-dot");

  const cursorRing =
    document.querySelector(".cursor-ring");

  const progressBar =
    document.querySelector(".page-progress span");

  const contactForm =
    document.querySelector("#contactForm");

  const formStatus =
    document.querySelector("#formStatus");

  const submitButton =
    document.querySelector(".submit-button");

  /* =====================================================
     THEME SYSTEM
  ====================================================== */

  const THEME_KEY = "tanmay-theme";

  const themeToggle =
    document.querySelector("[data-theme-toggle]");

  const themeIcon =
    document.querySelector("[data-theme-icon]");

  const themeLabel =
    document.querySelector("[data-theme-label]");

  const getStoredTheme = () => {
    const storedTheme =
      localStorage.getItem(THEME_KEY);

    if (
      storedTheme === "light" ||
      storedTheme === "dark"
    ) {
      return storedTheme;
    }

    return "dark";
  };

  const updateThemeMeta = (theme) => {
    let themeColor =
      document.querySelector(
        'meta[name="theme-color"]'
      );

    if (!themeColor) {
      themeColor =
        document.createElement("meta");

      themeColor.setAttribute(
        "name",
        "theme-color"
      );

      document.head.appendChild(themeColor);
    }

    themeColor.setAttribute(
      "content",
      theme === "light"
        ? "#F5F7F8"
        : "#071014"
    );
  };

  const updateThemeToggle = (theme) => {
    if (!themeToggle) {
      return;
    }

    const isLight =
      theme === "light";

    themeToggle.setAttribute(
      "aria-pressed",
      String(isLight)
    );

    themeToggle.setAttribute(
      "aria-label",
      isLight
        ? "Switch to dark mode"
        : "Switch to light mode"
    );

    themeToggle.setAttribute(
      "title",
      isLight
        ? "Switch to dark mode"
        : "Switch to light mode"
    );

    if (themeIcon) {
      themeIcon.textContent =
        isLight
          ? "☀"
          : "☾";
    }

    if (themeLabel) {
      themeLabel.textContent =
        isLight
          ? "Light"
          : "Dark";
    }
  };

  const applyTheme = (
    theme,
    save = true
  ) => {
    const normalizedTheme =
      theme === "light"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme =
      normalizedTheme;

    document.documentElement.style.colorScheme =
      normalizedTheme;

    if (save) {
      localStorage.setItem(
        THEME_KEY,
        normalizedTheme
      );
    }

    updateThemeToggle(
      normalizedTheme
    );

    updateThemeMeta(
      normalizedTheme
    );
  };

  /*
   * Apply the saved theme immediately.
   * This runs before the rest of the page
   * initialization.
   */
  applyTheme(
    getStoredTheme(),
    false
  );

  if (themeToggle) {
    themeToggle.addEventListener(
      "click",
      () => {
        const currentTheme =
          document.documentElement.dataset.theme ||
          "dark";

        const nextTheme =
          currentTheme === "dark"
            ? "light"
            : "dark";

        applyTheme(
          nextTheme,
          true
        );
      }
    );
  }

  /* =====================================================
     SMOOTH SCROLL
  ====================================================== */

  const smoothScrollTo = (
    target
  ) => {
    const element =
      document.querySelector(target);

    if (!element) {
      return;
    }

    const navbarOffset =
      window.innerWidth <= 900
        ? 85
        : 110;

    const top =
      element.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top,
      behavior:
        reduceMotion
          ? "auto"
          : "smooth"
    });
  };

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const target =
            link.getAttribute(
              "href"
            );

          if (
            !target ||
            target === "#"
          ) {
            return;
          }

          const element =
            document.querySelector(
              target
            );

          if (!element) {
            return;
          }

          event.preventDefault();

          closeMobileMenu();

          smoothScrollTo(
            target
          );
        }
      );
    });

  /* =====================================================
     NAVBAR SCROLL STATE
  ====================================================== */

  const updateNavbar = () => {

    if (!navbar) {
      return;
    }

    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );
  };

  /* =====================================================
     PAGE PROGRESS
  ====================================================== */

  const updateProgress = () => {

    if (!progressBar) {
      return;
    }

    const scrollTop =
      window.scrollY;

    const scrollHeight =
      document.documentElement
        .scrollHeight -
      window.innerHeight;

    const progress =
      scrollHeight > 0
        ? scrollTop / scrollHeight
        : 0;

    progressBar.style.width =
      `${progress * 100}%`;
  };

  /* =====================================================
     ACTIVE NAV SECTION
  ====================================================== */

  const sections =
    document.querySelectorAll(
      "[data-nav-section]"
    );

  const desktopNavLinks =
    document.querySelectorAll(
      ".desktop-nav a[data-section]"
    );

  const mobileNavLinks =
    document.querySelectorAll(
      ".mobile-menu a[data-section]"
    );

  const setActiveSection = (
    id
  ) => {

    [
      ...desktopNavLinks,
      ...mobileNavLinks
    ].forEach((link) => {

      link.classList.toggle(
        "active",
        link.dataset.section === id
      );

    });

  };

  if (
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                setActiveSection(
                  entry.target.dataset
                    .navSection
                );

              }

            }
          );

        },
        {
          root: null,
          rootMargin:
            "-35% 0px -55% 0px",
          threshold: 0
        }
      );

    sections.forEach(
      (section) => {

        sectionObserver.observe(
          section
        );

      }
    );

  }

  /* =====================================================
     REVEAL ANIMATIONS
  ====================================================== */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );

  if (
    reduceMotion ||
    !(
      "IntersectionObserver"
      in window
    )
  ) {

    revealElements.forEach(
      (element) => {

        element.classList.add(
          "show"
        );

      }
    );

  } else {

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "show"
                );

                revealObserver.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach(
      (element) => {

        revealObserver.observe(
          element
        );

      }
    );

  }

  /* =====================================================
     MOBILE MENU
  ====================================================== */

  const openMobileMenu = () => {

    if (
      !navbar ||
      !mobileMenu
    ) {
      return;
    }

    navbar.classList.add(
      "menu-open"
    );

    mobileMenu.classList.add(
      "open"
    );

    body.classList.add(
      "menu-active"
    );

    menuToggle?.setAttribute(
      "aria-expanded",
      "true"
    );

  };

  function closeMobileMenu() {

    if (
      !navbar ||
      !mobileMenu
    ) {
      return;
    }

    navbar.classList.remove(
      "menu-open"
    );

    mobileMenu.classList.remove(
      "open"
    );

    body.classList.remove(
      "menu-active"
    );

    menuToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

  }

  menuToggle?.addEventListener(
    "click",
    () => {

      const isOpen =
        mobileMenu?.classList.contains(
          "open"
        );

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }

    }
  );

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 900
      ) {

        closeMobileMenu();

      }

    }
  );

  /* =====================================================
     CUSTOM CURSOR
  ====================================================== */

  if (
    !reduceMotion &&
    window.innerWidth > 900 &&
    cursorDot &&
    cursorRing
  ) {

    let mouseX =
      window.innerWidth / 2;

    let mouseY =
      window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    let initialized = false;

    window.addEventListener(
      "mousemove",
      (event) => {

        mouseX =
          event.clientX;

        mouseY =
          event.clientY;

        if (!initialized) {

          ringX =
            mouseX;

          ringY =
            mouseY;

          initialized =
            true;

        }

        cursorDot.style.opacity =
          "1";

        cursorRing.style.opacity =
          "1";

        cursorDot.style.transform =
          `translate3d(
            ${mouseX}px,
            ${mouseY}px,
            0
          ) translate(-50%, -50%)`;

      },
      {
        passive: true
      }
    );

    const cursorLoop = () => {

      ringX +=
        (mouseX - ringX) *
        0.16;

      ringY +=
        (mouseY - ringY) *
        0.16;

      cursorRing.style.transform =
        `translate3d(
          ${ringX}px,
          ${ringY}px,
          0
        ) translate(-50%, -50%)`;

      requestAnimationFrame(
        cursorLoop
      );

    };

    cursorLoop();

  }

  /* =====================================================
     MAGNETIC INTERACTIONS
  ====================================================== */

  const magneticElements =
    document.querySelectorAll(
      ".magnetic"
    );

  magneticElements.forEach(
    (element) => {

      element.addEventListener(
        "mousemove",
        (event) => {

          if (
            reduceMotion ||
            window.innerWidth <= 900
          ) {
            return;
          }

          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          element.style.transform =
            `translate(
              ${x * 0.12}px,
              ${y * 0.12}px
            )`;

        }
      );

      element.addEventListener(
        "mouseleave",
        () => {

          element.style.transform =
            "";

        }
      );

    }
  );

  /* =====================================================
     PROJECT CASE STUDY MODALS
  ====================================================== */

  const projectModal =
    document.querySelector(
      "#projectModal"
    );

  const projectModalTitle =
    document.querySelector(
      "#projectModalTitle"
    );

  const projectModalKicker =
    document.querySelector(
      "#projectModalKicker"
    );

  const projectModalSummary =
    document.querySelector(
      "#projectModalSummary"
    );

  const projectModalNumber =
    document.querySelector(
      "#projectModalNumber"
    );

  const projectModalActions =
    document.querySelector(
      "#projectModalActions"
    );

  const projectModalOverview =
    document.querySelector(
      "#projectModalOverview"
    );

  const projectModalStack =
    document.querySelector(
      "#projectModalStack"
    );

  const projectModalFeatures =
    document.querySelector(
      "#projectModalFeatures"
    );

  const projectModalFlow =
    document.querySelector(
      "#projectModalFlow"
    );

  const projectModalMetrics =
    document.querySelector(
      "#projectModalMetrics"
    );

  const projectModalNotes =
    document.querySelector(
      "#projectModalNotes"
    );

  const projectModalScroll =
    document.querySelector(
      ".project-modal-scroll"
    );

  const projectData = {

    "01": {

      number: "01",

      kicker:
        "AI / DEEP LEARNING / XAI",

      title:
        "Explainable Brain Tumor Detection",

      summary:
        "An AI-powered medical imaging system that classifies brain MRI scans into four categories and makes model predictions more interpretable through Grad-CAM.",

      overview:
        "The system combines MRI preprocessing, a custom CNN classification pipeline, confidence and probability analysis, Grad-CAM explanations, and clinical-style PDF report generation inside an interactive Streamlit application. The project is designed for educational and research use rather than clinical diagnosis.",

      stack: [
        "Python",
        "TensorFlow",
        "Keras",
        "OpenCV",
        "NumPy",
        "Pandas",
        "Grad-CAM",
        "Streamlit",
        "ReportLab"
      ],

      features: [
        "Four-class MRI classification: glioma, meningioma, pituitary and no tumor.",
        "Brain-region extraction, contrast enhancement, Gaussian noise reduction and 224 × 224 resizing.",
        "Confidence score and class-probability analysis with uncertainty awareness.",
        "Grad-CAM heatmaps to visualize influential image regions.",
        "Downloadable clinical-style PDF reports with prediction and visualization output."
      ],

      flow: [
        "MRI image",
        "Preprocessing",
        "CNN",
        "Probability analysis",
        "Grad-CAM",
        "PDF report"
      ],

      metrics: [
        ["MODEL", "Custom CNN"],
        ["CLASSES", "4"],
        ["INPUT", "224 × 224 MRI"],
        ["PERFORMANCE", "~91% accuracy"],
        ["DEPLOYMENT", "Streamlit"],
        ["EXPLAINABILITY", "Grad-CAM"]
      ],

      notes:
        "The repository reports approximately 91% overall classification accuracy and documents limitations including dataset size, image quality dependence and the fact that Grad-CAM is an explanation technique rather than precise tumor segmentation.",

      live:
        "https://brain-mri-ai.streamlit.app/",

      github:
        "https://github.com/TanmayT134/Explainable-Brain-Tumor-Detection"

    },

    "02": {

      number: "02",

      kicker:
        "AI / COMPUTER VISION",

      title:
        "DeepShield",

      summary:
        "An end-to-end deepfake video detection platform using face detection, a fine-tuned EfficientNetB0 classifier and frame-level majority voting.",

      overview:
        "DeepShield processes uploaded videos by extracting frames, detecting faces with MTCNN, preprocessing the detected faces and classifying them with a fine-tuned EfficientNetB0 model. Instead of trusting a single frame, the system aggregates frame predictions through majority voting to produce a video-level result.",

      stack: [
        "Python",
        "EfficientNetB0",
        "MTCNN",
        "OpenCV",
        "TensorFlow",
        "Streamlit",
        "Docker",
        "Render"
      ],

      features: [
        "MP4 upload with optimized frame extraction and sampling.",
        "Automatic MTCNN face detection, cropping and alignment.",
        "Fine-tuned EfficientNetB0 binary classification for real vs deepfake.",
        "Majority voting across analyzed frames for video-level prediction.",
        "Confidence analytics, processing statistics and sample analyzed faces."
      ],

      flow: [
        "Video",
        "Frame sampling",
        "MTCNN",
        "Face preprocessing",
        "EfficientNetB0",
        "Majority voting",
        "Result"
      ],

      metrics: [
        ["MODEL", "EfficientNetB0"],
        ["DETECTION", "MTCNN"],
        ["OUTPUT", "Real / Fake"],
        ["AGGREGATION", "Majority voting"],
        ["APP", "Streamlit"],
        ["DEPLOYMENT", "Docker + Render"]
      ],

      notes:
        "The project is intended for educational, research and demonstration purposes. Its README explicitly cautions that predictions should not be treated as definitive evidence about video authenticity.",

      live:
        "https://deepshield-cq6f.onrender.com/",

      github:
        "https://github.com/TanmayT134/DeepShield"

    },

    "03": {

      number: "03",

      kicker:
        "FULL-STACK / WEB DEVELOPMENT",

      title:
        "EZStay",

      summary:
        "A full-stack accommodation booking platform with JWT authentication, role-based administration, REST APIs and MySQL persistence.",

      overview:
        "EZStay simulates a real-world accommodation booking experience. Users can browse cities, explore stays and view details, while administrators can securely manage cities and accommodation listings through protected routes and a role-based dashboard.",

      stack: [
        "React.js",
        "React Router",
        "Bootstrap",
        "Axios",
        "Node.js",
        "Express.js",
        "JWT",
        "BCrypt",
        "MySQL",
        "Postman"
      ],

      features: [
        "User registration and secure JWT-based login.",
        "City, accommodation and stay-detail browsing experience.",
        "Protected admin dashboard with role-based authorization.",
        "RESTful backend with persistent MySQL data and foreign-key relationships.",
        "Responsive frontend built with React and Bootstrap."
      ],

      flow: [
        "React client",
        "HTTP / Axios",
        "Express REST API",
        "JWT auth",
        "MySQL",
        "Persistent data"
      ],

      metrics: [
        ["FRONTEND", "React.js"],
        ["BACKEND", "Node + Express"],
        ["AUTH", "JWT + BCrypt"],
        ["DATABASE", "MySQL"],
        ["API", "REST"],
        ["STATUS", "Local deployment"]
      ],

      notes:
        "The repository notes that its hosted frontend is currently unavailable because the cloud database service expired; the complete application remains runnable locally.",

      live:
        null,

      github:
        "https://github.com/TanmayT134/EZStay"

    },

    "04": {

      number: "04",

      kicker:
        "JAVA / DESKTOP / DATABASE",

      title:
        "ATM Simulation System",

      summary:
        "A Java Swing desktop banking application with authentication, transaction processing, JDBC connectivity and persistent MySQL storage.",

      overview:
        "The application recreates core ATM workflows through a Java Swing interface. Users can register, authenticate with card details and PIN, perform banking operations and inspect transaction history, while MySQL provides persistent storage through JDBC.",

      stack: [
        "Java",
        "Swing",
        "JDBC",
        "MySQL",
        "OOP",
        "JCalendar",
        "Git",
        "GitHub"
      ],

      features: [
        "Card number and PIN authentication with customer registration.",
        "Deposits, withdrawals, fast cash and balance enquiry.",
        "PIN management and mini-statement generation.",
        "Persistent customer and transaction records through MySQL.",
        "Layered flow from Swing UI through banking logic to JDBC and database storage."
      ],

      flow: [
        "Swing UI",
        "Authentication",
        "Banking services",
        "Transaction processing",
        "JDBC",
        "MySQL"
      ],

      metrics: [
        ["LANGUAGE", "Java"],
        ["GUI", "Swing"],
        ["DATABASE", "MySQL"],
        ["CONNECTIVITY", "JDBC"],
        ["SECURITY", "PIN auth"],
        ["TYPE", "Desktop app"]
      ],

      notes:
        "The repository documents OOP, event-driven programming, CRUD operations, authentication and a layered architecture connecting the GUI, business logic and database layer.",

      live:
        null,

      github:
        "https://github.com/TanmayT134/ATM-Simulation-System-using-Java"

    }

  };

  let lastFocusedProject =
    null;

  const renderProjectModal = (
    data
  ) => {

    if (!projectModal) {
      return;
    }

    projectModalKicker.textContent =
      data.kicker;

    projectModalTitle.textContent =
      data.title;

    projectModalSummary.textContent =
      data.summary;

    projectModalNumber.textContent =
      data.number;

    projectModalOverview.textContent =
      data.overview;

    projectModalNotes.textContent =
      data.notes;

    projectModalStack.innerHTML =
      data.stack
        .map(
          (item) =>
            `<span>${item}</span>`
        )
        .join("");

    projectModalFeatures.innerHTML =
      data.features
        .map(
          (item) =>
            `<li>${item}</li>`
        )
        .join("");

    projectModalFlow.innerHTML =
      data.flow
        .map(
          (item, index) =>
            `${index
              ? '<span class="modal-flow-arrow">→</span>'
              : ""
            }<span class="modal-flow-step">${item}</span>`
        )
        .join("");

    projectModalMetrics.innerHTML =
      data.metrics
        .map(
          ([label, value]) =>
            `<div class="modal-metric">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>`
        )
        .join("");

    const actions = [];

    if (data.live) {

      actions.push(
        `<a
          class="project-modal-action primary magnetic"
          href="${data.live}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Live Demo
          <span>↗</span>
        </a>`
      );

    }

    actions.push(
      `<a
        class="project-modal-action magnetic"
        href="${data.github}"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub Repository
        <span>↗</span>
      </a>`
    );

    projectModalActions.innerHTML =
      actions.join("");

  };

  const openProjectModal = (
    id,
    trigger
  ) => {

    const data =
      projectData[id];

    if (
      !projectModal ||
      !data
    ) {
      return;
    }

    lastFocusedProject =
      trigger || null;

    renderProjectModal(
      data
    );

    if (
      typeof bindCursorInteractions ===
      "function"
    ) {

      bindCursorInteractions(
        projectModal
      );

    }

    projectModal.classList.add(
      "open"
    );

    projectModal.setAttribute(
      "aria-hidden",
      "false"
    );

    body.classList.add(
      "modal-open"
    );

    if (
      projectModalScroll
    ) {

      projectModalScroll.scrollTop =
        0;

    }

    requestAnimationFrame(
      () => {

        projectModal
          .querySelector(
            ".project-modal-close"
          )
          ?.focus();

      }
    );

  };

  const closeProjectModal = () => {

    if (!projectModal) {
      return;
    }

    projectModal.classList.remove(
      "open"
    );

    projectModal.setAttribute(
      "aria-hidden",
      "true"
    );

    body.classList.remove(
      "modal-open"
    );

    if (
      lastFocusedProject
    ) {

      lastFocusedProject.focus?.();

    }

    lastFocusedProject =
      null;

  };

  document
    .querySelectorAll(
      ".project-card[data-project]"
    )
    .forEach(
      (card) => {

        card.setAttribute(
          "tabindex",
          "0"
        );

        card.setAttribute(
          "role",
          "button"
        );

        card.addEventListener(
          "click",
          (event) => {

            if (
              event.target.closest(
                "a, button"
              )
            ) {
              return;
            }

            openProjectModal(
              card.dataset.project,
              card
            );

          }
        );

        card.addEventListener(
          "keydown",
          (event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              openProjectModal(
                card.dataset.project,
                card
              );

            }

          }
        );

      }
    );

  projectModal?.addEventListener(
    "click",
    (event) => {

      if (
        event.target.closest(
          "[data-modal-close]"
        )
      ) {

        closeProjectModal();

      }

    }
  );

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        projectModal?.classList.contains(
          "open"
        )
      ) {

        closeProjectModal();

      }

    }
  );

  /* =====================================================
     CERTIFICATE DETAILS MODALS
  ====================================================== */

  const certificateModal =
    document.querySelector("#certificateModal");

  const certificateData = {
    "01": {
      number: "01",
      kicker: "DEEP LEARNING / VERIFIED",
      title: "Fundamentals of Deep Learning",
      summary: "A verified NVIDIA credential demonstrating structured learning in deep learning fundamentals and neural-network concepts.",
      overview: "This credential complements my AI project work by strengthening the fundamentals behind neural-network based solutions and practical deep learning workflows.",
      issuer: "NVIDIA Deep Learning Institute",
      date: "JAN 2026",
      skills: ["Deep Learning", "Neural Networks", "Python", "AI Fundamentals", "Model Training"],
      credential: "https://learn.nvidia.com/certificates?id=ptSVONjcRg64i40RU4yD3w"
    },
    "02": {
      number: "02",
      kicker: "CLOUD / VERIFIED",
      title: "AWS Cloud Quest: Cloud Practitioner",
      summary: "A verified AWS learning credential covering foundational cloud concepts and AWS services.",
      overview: "This credential supports my understanding of cloud fundamentals and complements the deployment and backend concepts I use while building software projects.",
      issuer: "Amazon Web Services",
      date: "AUG 2025",
      skills: ["Cloud Fundamentals", "AWS", "Cloud Services", "Security Basics", "Architecture Basics"],
      credential: "https://www.credly.com/badges/1e5367fd-2a52-403d-b9e7-44d762b0ff18/public_url"
    },
    "03": {
      number: "03",
      kicker: "DATABASE / VERIFIED",
      title: "Introduction to MongoDB",
      summary: "A MongoDB University credential covering core concepts for working with MongoDB and document-oriented data.",
      overview: "This credential complements my database work across full-stack applications and strengthens my understanding of document databases alongside SQL and MySQL.",
      issuer: "MongoDB University",
      date: "JUN 2025",
      skills: ["MongoDB", "Document Databases", "NoSQL", "Data Modeling", "Database Fundamentals"],
      credential: "https://ti-user-certificates.s3.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/5a9338f5-2346-44d5-b06f-3c098e7be6b7-tanmay-tawade-33ad8f12-9974-4755-af1b-8f230ceafa38-certificate.pdf"
    },
    "04": {
      number: "04",
      kicker: "WEB DEVELOPMENT / VERIFIED",
      title: "Web Development",
      summary: "An Internshala Training credential supporting my foundation in practical web development.",
      overview: "This certification complements the web applications I have built using HTML, CSS, JavaScript and related frontend technologies, and represents an early step in my development journey.",
      issuer: "Internshala Training",
      date: "FEB 2025",
      skills: ["HTML", "CSS", "JavaScript", "Web Development", "Responsive Design"],
      credential: "https://trainings.internshala.com/s/v/3562517/89be5f59"
    }
  };

  let lastFocusedCertificate = null;

  const openCertificateModal = (id, trigger) => {
    const data = certificateData[id];
    if (!certificateModal || !data) return;

    lastFocusedCertificate = trigger || null;

    certificateModal.querySelector("#certificateModalKicker").textContent = data.kicker;
    certificateModal.querySelector("#certificateModalTitle").textContent = data.title;
    certificateModal.querySelector("#certificateModalSummary").textContent = data.summary;
    certificateModal.querySelector("#certificateModalNumber").textContent = data.number;
    certificateModal.querySelector("#certificateModalOverview").textContent = data.overview;
    certificateModal.querySelector("#certificateModalIssuer").textContent = data.issuer;
    certificateModal.querySelector("#certificateModalDate").textContent = data.date;
    certificateModal.querySelector("#certificateModalSkills").innerHTML =
      data.skills.map((skill) => `<span>${skill}</span>`).join("");

    certificateModal.querySelector("#certificateModalActions").innerHTML = `
      <a class="detail-modal-action magnetic"
         href="${data.credential}"
         target="_blank"
         rel="noopener noreferrer">
        View Credential
        <span>↗</span>
      </a>`;

    bindCursorInteractions(certificateModal);
    certificateModal.classList.add("open");
    certificateModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    certificateModal.querySelector(".detail-modal-scroll")?.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => certificateModal.querySelector(".detail-modal-close")?.focus());
  };

  const closeCertificateModal = () => {
    if (!certificateModal) return;
    certificateModal.classList.remove("open");
    certificateModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    lastFocusedCertificate?.focus?.();
    lastFocusedCertificate = null;
  };

  document.querySelectorAll(".certificate-card[data-certificate]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openCertificateModal(card.dataset.certificate, card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCertificateModal(card.dataset.certificate, card);
      }
    });
  });

  certificateModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-certificate-modal-close]")) closeCertificateModal();
  });


  /* =====================================================
     BEYOND CODE STORY MODALS
  ====================================================== */

  const beyondModal =
    document.querySelector("#beyondModal");

  const beyondData = {
    "01": {
      number: "01",
      kicker: "MUSIC / DISCIPLINE",
      title: "Tabla Visharad",
      summary: "A long-term practice in music that shaped patience, rhythm, consistency and respect for fundamentals.",
      overview: "Years of disciplined Tabla practice have taught me to slow down, repeat the fundamentals and build consistency before trying to improvise. That mindset carries into how I learn software: understand the core ideas first, then build complexity on top of them.",
      values: ["Discipline", "Rhythm", "Patience", "Consistency", "Focus"],
      note: "Technology is a major part of my journey, but music has taught me lessons about practice and mastery that are difficult to learn from code alone."
    },
    "02": {
      number: "02",
      kicker: "COMMUNITY / SERVICE",
      title: "Giving back",
      summary: "Being part of a community beyond professional work has shaped how I think about responsibility, participation and service.",
      overview: "As a member of Shrimant Bhausaheb Rangari Ganpati Trust, Pune, I value community participation and contributing beyond my professional work. It is an important reminder that building a career is only one part of being useful to the people around me.",
      values: ["Community", "Service", "Responsibility", "Participation", "Teamwork"],
      note: "I prefer to keep this section grounded in genuine participation rather than making broad claims about social impact."
    },
    "03": {
      number: "03",
      kicker: "CONTINUOUS LEARNING / GROWTH",
      title: "Always learning",
      summary: "I treat learning as an ongoing process and use projects to turn new concepts into practical understanding.",
      overview: "I keep learning beyond individual courses and projects — strengthening software engineering fundamentals, exploring system design, improving full-stack development skills and experimenting with AI. Building something is often how I make a new concept stick.",
      values: ["Curiosity", "Growth", "Software Engineering", "System Design", "AI"],
      note: "The goal is not to collect technologies. It is to understand them well enough to build useful, maintainable software."
    }
  };

  let lastFocusedBeyond = null;

  const openBeyondModal = (id, trigger) => {
    const data = beyondData[id];
    if (!beyondModal || !data) return;

    lastFocusedBeyond = trigger || null;

    beyondModal.querySelector("#beyondModalKicker").textContent = data.kicker;
    beyondModal.querySelector("#beyondModalTitle").textContent = data.title;
    beyondModal.querySelector("#beyondModalSummary").textContent = data.summary;
    beyondModal.querySelector("#beyondModalNumber").textContent = data.number;
    beyondModal.querySelector("#beyondModalOverview").textContent = data.overview;
    beyondModal.querySelector("#beyondModalNote").textContent = data.note;
    beyondModal.querySelector("#beyondModalValues").innerHTML =
      data.values.map((value) => `<span>${value}</span>`).join("");

    bindCursorInteractions(beyondModal);
    beyondModal.classList.add("open");
    beyondModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    beyondModal.querySelector(".detail-modal-scroll")?.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => beyondModal.querySelector(".detail-modal-close")?.focus());
  };

  const closeBeyondModal = () => {
    if (!beyondModal) return;
    beyondModal.classList.remove("open");
    beyondModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    lastFocusedBeyond?.focus?.();
    lastFocusedBeyond = null;
  };

  document.querySelectorAll(".beyond-card[data-beyond]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openBeyondModal(card.dataset.beyond, card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBeyondModal(card.dataset.beyond, card);
      }
    });
  });

  beyondModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-beyond-modal-close]")) closeBeyondModal();
  });


  /* =====================================================
     DETAIL MODAL KEYBOARD HANDLING
  ====================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (projectModal?.classList.contains("open")) {
      closeProjectModal();
      return;
    }

    if (certificateModal?.classList.contains("open")) {
      closeCertificateModal();
      return;
    }

    if (beyondModal?.classList.contains("open")) {
      closeBeyondModal();
    }
  });

  /* =====================================================
     CURSOR INTERACTIONS
  ====================================================== */

  const bindCursorInteractions = (
    root = document
  ) => {

    if (
      !cursorRing ||
      reduceMotion ||
      window.innerWidth <= 900
    ) {
      return;
    }

    root
      .querySelectorAll(
        "a, button, .project-card, .beyond-card, input, textarea, select"
      )
      .forEach(
        (element) => {

          if (
            element.dataset.cursorBound ===
            "true"
          ) {
            return;
          }

          element.dataset.cursorBound =
            "true";

          element.addEventListener(
            "mouseenter",
            () => {

              cursorRing.classList.add(
                "active"
              );

            }
          );

          element.addEventListener(
            "mouseleave",
            () => {

              cursorRing.classList.remove(
                "active"
              );

            }
          );

        }
      );

  };

  bindCursorInteractions(
    document
  );

  document.querySelectorAll(".about-photo img").forEach((image) => {
    image.addEventListener("error", () => {
      image.src = "assets/profile-placeholder.svg";
    });
  });


  /* =====================================================
     CONTACT FORM
  ====================================================== */

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async (event) => {

        /*
         * Prevent the browser from
         * navigating away.
         */

        event.preventDefault();

        /* =================================================
           VALIDATION
        ================================================= */

        if (
          !contactForm.reportValidity()
        ) {
          return;
        }

        /* =================================================
           HONEYPOT SPAM PROTECTION
        ================================================= */

        const honey =
          contactForm.querySelector(
            '[name="_honey"]'
          );

        if (
          honey &&
          honey.value.trim() !== ""
        ) {
          return;
        }

        /* =================================================
           STATUS HELPER
        ================================================= */

        const setStatus = (
          message,
          type = ""
        ) => {

          if (!formStatus) {
            return;
          }

          formStatus.textContent =
            message;

          formStatus.className =
            type
              ? `form-status ${type}`
              : "form-status";

        };

        /* =================================================
           LOADING STATE
        ================================================= */

        setStatus(
          "Sending your message..."
        );

        if (submitButton) {

          submitButton.classList.add(
            "loading"
          );

          submitButton.disabled =
            true;

          const label =
            submitButton.querySelector(
              "span"
            );

          if (label) {

            label.textContent =
              "Sending...";

          }

        }

        /* =================================================
           COLLECT FORM DATA
        ================================================= */

        const formData =
          new FormData(
            contactForm
          );

        const payload =
          Object.fromEntries(
            formData.entries()
          );

        /* =================================================
           REPLY-TO
        ================================================= */

        if (payload.email) {

          payload._replyto =
            payload.email;

        }

        /* =================================================
           SUBMIT WITHOUT REDIRECT
        ================================================= */

        try {

          const response =
            await fetch(
              contactForm.action,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  "Accept":
                    "application/json"
                },

                body:
                  JSON.stringify(
                    payload
                  )
              }
            );

          /*
           * Read response safely.
           */

          const raw =
            await response.text();

          let result = {};

          try {

            result =
              raw
                ? JSON.parse(raw)
                : {};

          } catch (
          parseError
          ) {

            result = {};

          }

          /* =================================================
             DETERMINE SUCCESS
          ================================================= */

          const responseMessage =
            String(
              result.message || ""
            );

          const serviceReportedError =
            /error|invalid|unable|activate|captcha|failed/i
              .test(
                responseMessage
              );

          const success =
            response.ok &&
            result.success !== false &&
            !serviceReportedError;

          /* =================================================
             HANDLE FAILURE
          ================================================= */

          if (!success) {

            throw new Error(
              responseMessage ||
              `Form service returned HTTP ${response.status}.`
            );

          }

          /* =================================================
             SUCCESS
          ================================================= */

          contactForm.reset();

          setStatus(
            "Message sent successfully. Thank you — I'll get back to you soon.",
            "success"
          );

          setTimeout(
            () => {

              if (
                formStatus &&
                formStatus.classList.contains(
                  "success"
                )
              ) {

                formStatus.textContent =
                  "";

                formStatus.className =
                  "form-status";

              }

            },
            8000
          );

        } catch (
        error
        ) {

          console.error(
            "Contact form error:",
            error
          );

          /*
           * Do NOT clear the form
           * when sending fails.
           */

          setStatus(
            "Unable to send your message right now. Please try again or email me directly at tawade.tanmay134@gmail.com.",
            "error"
          );

        } finally {

          /* =================================================
             RESTORE BUTTON
          ================================================= */

          if (submitButton) {

            submitButton.classList.remove(
              "loading"
            );

            submitButton.disabled =
              false;

            const label =
              submitButton.querySelector(
                "span"
              );

            if (label) {

              label.textContent =
                "Send message";

            }

          }

        }

      }
    );

  }

  /* =====================================================
     SCROLL EVENTS
  ====================================================== */

  let ticking = false;

  const handleScroll = () => {

    if (ticking) {
      return;
    }

    window.requestAnimationFrame(
      () => {

        updateNavbar();

        updateProgress();

        ticking = false;

      }
    );

    ticking = true;

  };

  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true
    }
  );

  /* =====================================================
     INITIAL STATE
  ====================================================== */

  updateNavbar();

  updateProgress();

  setActiveSection(
    "home"
  );

})();
