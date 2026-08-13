/* =========================================
   PREMIUM PAGE LOADER
========================================= */

(() => {
  const loader = document.getElementById("loader");
  const percent = document.getElementById("loader-percent");
  const progress = document.getElementById("loader-progress");
  const status = document.getElementById("loader-status");

  if (!loader) return;

  const messages = [
    "INITIALIZING EXPERIENCE",
    "LOADING INTERFACE",
    "PREPARING PROJECTS",
    "LOADING SKILLS",
    "ALMOST READY"
  ];

  let value = 0;
  let messageIndex = 0;
  let pageLoaded = false;
  let progressTimer;

  const updateStatus = (index) => {
    if (!status || index >= messages.length) return;

    status.style.opacity = "0";

    setTimeout(() => {
      status.textContent = messages[index];
      status.style.opacity = "1";
    }, 180);
  };

  const animateProgress = () => {
    /*
     * Progress intentionally moves slowly.
     * The final 10% waits for the actual page.
     */

    if (value < 88) {

      value += 1;

      if (percent) {
        percent.textContent = `${value}%`;
      }

      if (progress) {
        progress.style.width = `${value}%`;
      }

      const newMessageIndex = Math.min(
        Math.floor(value / 20),
        messages.length - 1
      );

      if (newMessageIndex !== messageIndex) {
        messageIndex = newMessageIndex;
        updateStatus(messageIndex);
      }

      progressTimer = setTimeout(
        animateProgress,
        28
      );

    } else if (pageLoaded) {

      finishLoader();

    } else {

      /*
       * Page hasn't loaded yet.
       * Hold around 88% instead of completing early.
       */

      progressTimer = setTimeout(
        animateProgress,
        100
      );
    }
  };

  const finishLoader = () => {

    clearTimeout(progressTimer);

    value = 100;

    if (percent) {
      percent.textContent = "100%";
    }

    if (progress) {
      progress.style.width = "100%";
    }

    if (status) {
      status.style.opacity = "0";

      setTimeout(() => {
        status.textContent = "WELCOME";
        status.style.opacity = "1";
      }, 150);
    }

    /*
     * Hold briefly at 100%.
     */
    setTimeout(() => {

      /*
       * Start the portfolio entrance animation.
       */
      document.body.classList.add("page-ready");

      /*
       * Give the hero/navbar animation
       * a tiny head start.
       */
      setTimeout(() => {

        /*
         * Fade/scale the loader away.
         */
        loader.classList.add("loaded");

        /*
         * Remove it after the transition.
         */
        setTimeout(() => {
          loader.remove();
        }, 1100);

      }, 150);

    }, 500);
  };

  /*
   * Wait for the actual page to finish loading.
   */

  if (document.readyState === "complete") {
    pageLoaded = true;
  } else {
    window.addEventListener(
      "load",
      () => {
        pageLoaded = true;
      },
      { once: true }
    );
  }

  /*
   * Start the controlled loading animation.
   */

  updateStatus(0);

  setTimeout(() => {
    animateProgress();
  }, 250);

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
     SMOOTH SCROLL
  ====================================================== */

  const smoothScrollTo = (target) => {

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
      behavior: reduceMotion
        ? "auto"
        : "smooth"
    });

  };


  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const target =
            link.getAttribute("href");

          if (
            !target ||
            target === "#"
          ) {
            return;
          }

          const element =
            document.querySelector(target);

          if (!element) {
            return;
          }

          event.preventDefault();

          closeMobileMenu();

          smoothScrollTo(target);

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
      document.documentElement.scrollHeight -
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


  const setActiveSection = (id) => {

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


  if ("IntersectionObserver" in window) {

    const sectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                setActiveSection(
                  entry.target.dataset.navSection
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


    sections.forEach((section) => {

      sectionObserver.observe(section);

    });

  }


  /* =====================================================
     REVEAL ANIMATIONS
  ====================================================== */

  const revealElements =
    document.querySelectorAll(".reveal");


  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {

    revealElements.forEach((element) => {

      element.classList.add("show");

    });

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


    revealElements.forEach((element) => {

      revealObserver.observe(element);

    });

  }


  /* =====================================================
     MOBILE MENU
  ====================================================== */

  const openMobileMenu = () => {

    if (!navbar || !mobileMenu) {
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

    if (!navbar || !mobileMenu) {
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

      if (window.innerWidth > 900) {
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

          initialized = true;

        }

        cursorDot.style.opacity = "1";
        cursorRing.style.opacity = "1";

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
        (mouseX - ringX) * 0.16;

      ringY +=
        (mouseY - ringY) * 0.16;

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


    requestAnimationFrame(
      cursorLoop
    );


    const interactiveElements =
      document.querySelectorAll(
        "a, button, .project-card, .skill-card, input, textarea, select"
      );


    interactiveElements.forEach(
      (element) => {

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

  }


  /* =====================================================
     MAGNETIC ELEMENTS
  ====================================================== */

  if (
    !reduceMotion &&
    window.innerWidth > 900
  ) {

    const magneticElements =
      document.querySelectorAll(
        ".magnetic"
      );


    magneticElements.forEach(
      (element) => {

        element.addEventListener(
          "mousemove",
          (event) => {

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
              `translate3d(
                                ${x * 0.08}px,
                                ${y * 0.08}px,
                                0
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

  }


  /* =====================================================
     ORBIT PARALLAX
  ====================================================== */

  const orbit =
    document.querySelector(".orbit");


  if (
    orbit &&
    !reduceMotion &&
    window.innerWidth > 900
  ) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    orbit.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          orbit.getBoundingClientRect();

        targetX =
          (
            (event.clientX - rect.left) /
            rect.width -
            0.5
          ) * 12;

        targetY =
          -(
            (
              (event.clientY - rect.top) /
              rect.height -
              0.5
            ) * 12
          );

      }
    );


    orbit.addEventListener(
      "mouseleave",
      () => {

        targetX = 0;
        targetY = 0;

      }
    );


    const orbitLoop = () => {

      currentX +=
        (targetX - currentX) *
        0.055;

      currentY +=
        (targetY - currentY) *
        0.055;

      orbit.style.transform =
        `perspective(1100px) rotateY(${currentX}deg) rotateX(${currentY}deg)`;

      requestAnimationFrame(
        orbitLoop
      );

    };


    requestAnimationFrame(
      orbitLoop
    );

  }


  /* =====================================================
     PROJECT CARD TILT
  ====================================================== */

  if (
    !reduceMotion &&
    window.innerWidth > 900
  ) {

    document
      .querySelectorAll(".project-card")
      .forEach((card) => {

        card.addEventListener(
          "mousemove",
          (event) => {

            const rect =
              card.getBoundingClientRect();

            const x =
              (
                event.clientX -
                rect.left
              ) / rect.width -
              0.5;

            const y =
              (
                event.clientY -
                rect.top
              ) / rect.height -
              0.5;

            const content =
              card.querySelector(
                ".project-main"
              );

            if (!content) {
              return;
            }

            content.style.transform =
              `translate3d(
                                ${x * 4}px,
                                ${y * 3}px,
                                0
                            )`;

          }
        );


        card.addEventListener(
          "mouseleave",
          () => {

            const content =
              card.querySelector(
                ".project-main"
              );

            if (!content) {
              return;
            }

            content.style.transform =
              "";

          }
        );

      });

  }

  /* =====================================================
 CERTIFICATE CARD MICRO INTERACTION
===================================================== */

  if (
    !reduceMotion &&
    window.innerWidth > 900
  ) {

    document
      .querySelectorAll(".certificate-card")
      .forEach((card) => {

        card.addEventListener(
          "mousemove",
          (event) => {

            const rect =
              card.getBoundingClientRect();

            const x =
              (
                event.clientX -
                rect.left
              ) / rect.width -
              0.5;

            const y =
              (
                event.clientY -
                rect.top
              ) / rect.height -
              0.5;

            const logo =
              card.querySelector(
                ".certificate-logo"
              );

            if (!logo) {
              return;
            }

            logo.style.transform =
              `
                        translate(
                            ${x * 5}px,
                            ${y * 5}px
                        )
                        rotate(${x * -5}deg)
                        scale(1.05)
                        `;

          }
        );


        card.addEventListener(
          "mouseleave",
          () => {

            const logo =
              card.querySelector(
                ".certificate-logo"
              );

            if (!logo) {
              return;
            }

            logo.style.transform = "";

          }
        );

      });

  }




  /* =====================================================
     PROJECT CASE STUDY MODALS
  ====================================================== */

  const projectModal = document.querySelector("#projectModal");
  const projectModalTitle = document.querySelector("#projectModalTitle");
  const projectModalKicker = document.querySelector("#projectModalKicker");
  const projectModalSummary = document.querySelector("#projectModalSummary");
  const projectModalNumber = document.querySelector("#projectModalNumber");
  const projectModalActions = document.querySelector("#projectModalActions");
  const projectModalOverview = document.querySelector("#projectModalOverview");
  const projectModalStack = document.querySelector("#projectModalStack");
  const projectModalFeatures = document.querySelector("#projectModalFeatures");
  const projectModalFlow = document.querySelector("#projectModalFlow");
  const projectModalMetrics = document.querySelector("#projectModalMetrics");
  const projectModalNotes = document.querySelector("#projectModalNotes");
  const projectModalScroll = document.querySelector(".project-modal-scroll");

  const projectData = {
    "01": {
      number: "01",
      kicker: "AI / DEEP LEARNING / XAI",
      title: "Explainable Brain Tumor Detection",
      summary: "An AI-powered medical imaging system that classifies brain MRI scans into four categories and makes model predictions more interpretable through Grad-CAM.",
      overview: "The system combines MRI preprocessing, a custom CNN classification pipeline, confidence and probability analysis, Grad-CAM explanations, and clinical-style PDF report generation inside an interactive Streamlit application. The project is designed for educational and research use rather than clinical diagnosis.",
      stack: ["Python", "TensorFlow", "Keras", "OpenCV", "NumPy", "Pandas", "Grad-CAM", "Streamlit", "ReportLab"],
      features: [
        "Four-class MRI classification: glioma, meningioma, pituitary and no tumor.",
        "Brain-region extraction, contrast enhancement, Gaussian noise reduction and 224 × 224 resizing.",
        "Confidence score and class-probability analysis with uncertainty awareness.",
        "Grad-CAM heatmaps to visualize influential image regions.",
        "Downloadable clinical-style PDF reports with prediction and visualization output."
      ],
      flow: ["MRI image", "Preprocessing", "CNN", "Probability analysis", "Grad-CAM", "PDF report"],
      metrics: [["MODEL", "Custom CNN"], ["CLASSES", "4"], ["INPUT", "224 × 224 MRI"], ["PERFORMANCE", "~91% accuracy"], ["DEPLOYMENT", "Streamlit"], ["EXPLAINABILITY", "Grad-CAM"]],
      notes: "The repository reports approximately 91% overall classification accuracy and documents limitations including dataset size, image quality dependence and the fact that Grad-CAM is an explanation technique rather than precise tumor segmentation.",
      live: "https://brain-mri-ai.streamlit.app/",
      github: "https://github.com/TanmayT134/Explainable-Brain-Tumor-Detection"
    },
    "02": {
      number: "02",
      kicker: "AI / COMPUTER VISION",
      title: "DeepShield",
      summary: "An end-to-end deepfake video detection platform using face detection, a fine-tuned EfficientNetB0 classifier and frame-level majority voting.",
      overview: "DeepShield processes uploaded videos by extracting frames, detecting faces with MTCNN, preprocessing the detected faces and classifying them with a fine-tuned EfficientNetB0 model. Instead of trusting a single frame, the system aggregates frame predictions through majority voting to produce a video-level result.",
      stack: ["Python", "EfficientNetB0", "MTCNN", "OpenCV", "TensorFlow", "Streamlit", "Docker", "Render"],
      features: [
        "MP4 upload with optimized frame extraction and sampling.",
        "Automatic MTCNN face detection, cropping and alignment.",
        "Fine-tuned EfficientNetB0 binary classification for real vs deepfake.",
        "Majority voting across analyzed frames for video-level prediction.",
        "Confidence analytics, processing statistics and sample analyzed faces."
      ],
      flow: ["Video", "Frame sampling", "MTCNN", "Face preprocessing", "EfficientNetB0", "Majority voting", "Result"],
      metrics: [["MODEL", "EfficientNetB0"], ["DETECTION", "MTCNN"], ["OUTPUT", "Real / Fake"], ["AGGREGATION", "Majority voting"], ["APP", "Streamlit"], ["DEPLOYMENT", "Docker + Render"]],
      notes: "The project is intended for educational, research and demonstration purposes. Its README explicitly cautions that predictions should not be treated as definitive evidence about video authenticity.",
      live: "https://deepshield-cq6f.onrender.com/",
      github: "https://github.com/TanmayT134/DeepShield"
    },
    "03": {
      number: "03",
      kicker: "FULL-STACK / WEB DEVELOPMENT",
      title: "EZStay",
      summary: "A full-stack accommodation booking platform with JWT authentication, role-based administration, REST APIs and MySQL persistence.",
      overview: "EZStay simulates a real-world accommodation booking experience. Users can browse cities, explore stays and view details, while administrators can securely manage cities and accommodation listings through protected routes and a role-based dashboard.",
      stack: ["React.js", "React Router", "Bootstrap", "Axios", "Node.js", "Express.js", "JWT", "BCrypt", "MySQL", "Postman"],
      features: [
        "User registration and secure JWT-based login.",
        "City, accommodation and stay-detail browsing experience.",
        "Protected admin dashboard with role-based authorization.",
        "RESTful backend with persistent MySQL data and foreign-key relationships.",
        "Responsive frontend built with React and Bootstrap."
      ],
      flow: ["React client", "HTTP / Axios", "Express REST API", "JWT auth", "MySQL", "Persistent data"],
      metrics: [["FRONTEND", "React.js"], ["BACKEND", "Node + Express"], ["AUTH", "JWT + BCrypt"], ["DATABASE", "MySQL"], ["API", "REST"], ["STATUS", "Local deployment"]],
      notes: "The repository notes that its hosted frontend is currently unavailable because the cloud database service expired; the complete application remains runnable locally.",
      live: null,
      github: "https://github.com/TanmayT134/EZStay"
    },
    "04": {
      number: "04",
      kicker: "JAVA / DESKTOP / DATABASE",
      title: "ATM Simulation System",
      summary: "A Java Swing desktop banking application with authentication, transaction processing, JDBC connectivity and persistent MySQL storage.",
      overview: "The application recreates core ATM workflows through a Java Swing interface. Users can register, authenticate with card details and PIN, perform banking operations and inspect transaction history, while MySQL provides persistent storage through JDBC.",
      stack: ["Java", "Swing", "JDBC", "MySQL", "OOP", "JCalendar", "Git", "GitHub"],
      features: [
        "Card number and PIN authentication with customer registration.",
        "Deposits, withdrawals, fast cash and balance enquiry.",
        "PIN management and mini-statement generation.",
        "Persistent customer and transaction records through MySQL.",
        "Layered flow from Swing UI through banking logic to JDBC and database storage."
      ],
      flow: ["Swing UI", "Authentication", "Banking services", "Transaction processing", "JDBC", "MySQL"],
      metrics: [["LANGUAGE", "Java"], ["GUI", "Swing"], ["DATABASE", "MySQL"], ["CONNECTIVITY", "JDBC"], ["SECURITY", "PIN auth"], ["TYPE", "Desktop app"]],
      notes: "The repository documents OOP, event-driven programming, CRUD operations, authentication and a layered architecture connecting the GUI, business logic and database layer.",
      live: null,
      github: "https://github.com/TanmayT134/ATM-Simulation-System-using-Java"
    }
  };

  let lastFocusedProject = null;

  const renderProjectModal = (data) => {
    if (!projectModal) return;

    projectModalKicker.textContent = data.kicker;
    projectModalTitle.textContent = data.title;
    projectModalSummary.textContent = data.summary;
    projectModalNumber.textContent = data.number;
    projectModalOverview.textContent = data.overview;
    projectModalNotes.textContent = data.notes;

    projectModalStack.innerHTML = data.stack
      .map((item) => `<span>${item}</span>`)
      .join("");

    projectModalFeatures.innerHTML = data.features
      .map((item) => `<li>${item}</li>`)
      .join("");

    projectModalFlow.innerHTML = data.flow
      .map((item, index) => `${index ? '<span class="modal-flow-arrow">→</span>' : ""}<span class="modal-flow-step">${item}</span>`)
      .join("");

    projectModalMetrics.innerHTML = data.metrics
      .map(([label, value]) => `<div class="modal-metric"><span>${label}</span><strong>${value}</strong></div>`)
      .join("");

    const actions = [];
    if (data.live) {
      actions.push(`<a class="project-modal-action primary magnetic" href="${data.live}" target="_blank" rel="noopener noreferrer">Live Demo <span>↗</span></a>`);
    }
    actions.push(`<a class="project-modal-action magnetic" href="${data.github}" target="_blank" rel="noopener noreferrer">GitHub Repository <span>↗</span></a>`);
    projectModalActions.innerHTML = actions.join("");
  };

  const openProjectModal = (id, trigger) => {
    const data = projectData[id];
    if (!projectModal || !data) return;

    lastFocusedProject = trigger || null;
    renderProjectModal(data);
    if (typeof bindCursorInteractions === "function") bindCursorInteractions(projectModal);
    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    if (projectModalScroll) projectModalScroll.scrollTop = 0;

    requestAnimationFrame(() => {
      projectModal.querySelector(".project-modal-close")?.focus();
    });
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    if (lastFocusedProject) lastFocusedProject.focus?.();
    lastFocusedProject = null;
  };

  document.querySelectorAll(".project-card[data-project]").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openProjectModal(card.dataset.project, card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProjectModal(card.dataset.project, card);
      }
    });
  });

  projectModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal?.classList.contains("open")) {
      closeProjectModal();
    }
  });

  /* Modal links are added dynamically, so refresh the cursor interaction state. */
  const bindCursorInteractions = (root = document) => {
    if (!cursorRing || reduceMotion || window.innerWidth <= 900) return;
    root.querySelectorAll("a, button, .project-card, .beyond-card, input, textarea, select").forEach((element) => {
      if (element.dataset.cursorBound === "true") return;
      element.dataset.cursorBound = "true";
      element.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      element.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });
  };

  bindCursorInteractions(projectModal);


  /* =====================================================
   CONTACT FORM
====================================================== */

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async (event) => {

        /*
         * IMPORTANT:
         * Prevent the browser from navigating away.
         */
        event.preventDefault();


        /*
         * =================================================
         * VALIDATION
         * =================================================
         */

        if (!contactForm.reportValidity()) {
          return;
        }


        /*
         * =================================================
         * HONEYPOT SPAM PROTECTION
         * =================================================
         */

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


        /*
         * =================================================
         * STATUS HELPER
         * =================================================
         */

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


        /*
         * =================================================
         * LOADING STATE
         * =================================================
         */

        setStatus(
          "Sending your message..."
        );

        if (submitButton) {

          submitButton.classList.add(
            "loading"
          );

          submitButton.disabled = true;

          const label =
            submitButton.querySelector(
              "span"
            );

          if (label) {
            label.textContent =
              "Sending...";
          }
        }


        /*
         * =================================================
         * COLLECT FORM DATA
         * =================================================
         */

        const formData =
          new FormData(
            contactForm
          );

        const payload =
          Object.fromEntries(
            formData.entries()
          );


        /*
         * =================================================
         * REPLY-TO
         * =================================================
         *
         * When you receive the email and press Reply,
         * the reply should go to the person who contacted you.
         */

        if (payload.email) {

          payload._replyto =
            payload.email;
        }


        /*
         * =================================================
         * SUBMIT WITHOUT REDIRECT
         * =================================================
         */

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
           * =================================================
           * READ RESPONSE SAFELY
           * =================================================
           *
           * Do NOT directly use:
           *
           * response.json()
           *
           * because FormSubmit can sometimes return
           * HTML instead of JSON.
           */

          const raw =
            await response.text();

          let result = {};

          try {

            result =
              raw
                ? JSON.parse(raw)
                : {};

          } catch (parseError) {

            /*
             * Response wasn't JSON.
             * Keep result as an empty object.
             */

            result = {};
          }


          /*
           * =================================================
           * DETERMINE SUCCESS
           * =================================================
           */

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


          /*
           * =================================================
           * HANDLE FAILURE
           * =================================================
           */

          if (!success) {

            throw new Error(
              responseMessage ||
              `Form service returned HTTP ${response.status}.`
            );
          }


          /*
           * =================================================
           * SUCCESS
           * =================================================
           */

          contactForm.reset();

          setStatus(
            "Message sent successfully. Thank you — I'll get back to you soon.",
            "success"
          );


          /*
           * Optional: remove success message after a while.
           * Keep it long enough for the visitor to see.
           */

          setTimeout(() => {

            if (
              formStatus &&
              formStatus.classList.contains(
                "success"
              )
            ) {

              formStatus.textContent = "";

              formStatus.className =
                "form-status";
            }

          }, 8000);


        } catch (error) {

          /*
           * =================================================
           * ERROR
           * =================================================
           */

          console.error(
            "Contact form error:",
            error
          );


          /*
           * IMPORTANT:
           * Do NOT clear the form here.
           *
           * The visitor's entered information remains
           * available so they can retry.
           */

          setStatus(
            "Unable to send your message right now. Please try again or email me directly at tawade.tanmay134@gmail.com.",
            "error"
          );

        } finally {

          /*
           * =================================================
           * RESTORE BUTTON
           * =================================================
           */

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

  setActiveSection("home");


})();