(function () {
  "use strict";

  const galleryEl = document.getElementById("gallery");
  const exhibitNavEl = document.getElementById("exhibit-nav");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxEra = document.getElementById("lightbox-era");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDesc = document.getElementById("lightbox-desc");
  const artworkCountEl = document.getElementById("artwork-count");
  const galleryCountEl = document.getElementById("gallery-count");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  const starCanvas = document.getElementById("starfield");

  const sections = Array.isArray(window.ARTWORK_SECTIONS)
    ? window.ARTWORK_SECTIONS
    : typeof ARTWORK_SECTIONS !== "undefined" && Array.isArray(ARTWORK_SECTIONS)
      ? ARTWORK_SECTIONS
      : [];

  const allArtworks = sections.flatMap(function (section, sectionIndex) {
    return section.artworks.map(function (art, artworkIndex) {
      return {
        ...art,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionNumber: sectionIndex + 1,
        artworkNumber: artworkIndex + 1,
        sectionTotal: section.artworks.length,
      };
    });
  });

  if (!sections.length || !allArtworks.length) {
    if (galleryEl) {
      galleryEl.innerHTML =
        '<p class="exhibition__empty">소장 작품을 불러오지 못했습니다. assets 폴더와 js/artworks.js를 확인해 주세요.</p>';
    }
    return;
  }

  if (artworkCountEl) {
    artworkCountEl.textContent = String(allArtworks.length);
  }

  if (galleryCountEl) {
    galleryCountEl.textContent = String(sections.length);
  }

  function encodePath(path) {
    return path
      .split("/")
      .map(function (segment) {
        return encodeURIComponent(segment);
      })
      .join("/");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function padIndex(num, total) {
    const width = Math.max(2, String(total).length);
    return String(num).padStart(width, "0");
  }

  function getNextArtwork(currentId) {
    const index = allArtworks.findIndex(function (art) {
      return art.id === currentId;
    });
    return index >= 0 ? allArtworks[index + 1] : null;
  }

  function renderSection(section, sectionIndex) {
    const sectionNumber = sectionIndex + 1;
    const intro =
      '<section class="gallery-section" id="section-' +
      escapeHtml(section.id) +
      '" data-section-id="' +
      escapeHtml(section.id) +
      '">' +
      '<header class="gallery-section__header">' +
      '<p class="gallery-section__kicker">제' +
      sectionNumber +
      "관 · " +
      escapeHtml(section.theme) +
      "</p>" +
      '<h3 class="gallery-section__title">' +
      escapeHtml(section.title) +
      "</h3>" +
      '<p class="gallery-section__title-en">' +
      escapeHtml(section.titleEn) +
      "</p>" +
      '<p class="gallery-section__desc">' +
      escapeHtml(section.description) +
      "</p>" +
      '<p class="gallery-section__count">' +
      section.artworks.length +
      " works</p>" +
      "</header>";

    const exhibits = section.artworks
      .map(function (art, artworkIndex) {
        const hydrated = allArtworks.find(function (item) {
          return item.id === art.id;
        });
        const num = artworkIndex + 1;
        const indexLabel =
          "제" +
          sectionNumber +
          "관 " +
          padIndex(num, section.artworks.length) +
          " / " +
          padIndex(section.artworks.length, section.artworks.length);
        const nextArt = getNextArtwork(art.id);
        const nextBlock = nextArt
          ? '<a class="exhibit__next" href="#exhibit-' +
            escapeHtml(nextArt.id) +
            '">다음 작품 · ' +
            escapeHtml(nextArt.title) +
            "</a>"
          : '<a class="exhibit__next" href="#visit">관람 안내로</a>';
        const visibleClass = sectionIndex === 0 && artworkIndex === 0 ? " exhibit--visible" : "";

        return (
          '<article class="exhibit' +
          visibleClass +
          '" id="exhibit-' +
          escapeHtml(art.id) +
          '" data-id="' +
          escapeHtml(art.id) +
          '" data-section-id="' +
          escapeHtml(section.id) +
          '">' +
          '<div class="exhibit__inner">' +
          '<p class="exhibit__index">' +
          indexLabel +
          "</p>" +
          '<div class="exhibit__stage">' +
          '<div class="exhibit__frame luxury-frame">' +
          '<span class="luxury-frame__corner luxury-frame__corner--tl" aria-hidden="true"></span>' +
          '<span class="luxury-frame__corner luxury-frame__corner--tr" aria-hidden="true"></span>' +
          '<span class="luxury-frame__corner luxury-frame__corner--bl" aria-hidden="true"></span>' +
          '<span class="luxury-frame__corner luxury-frame__corner--br" aria-hidden="true"></span>' +
          '<div class="luxury-frame__wood">' +
          '<div class="luxury-frame__mat">' +
          '<div class="luxury-frame__gilt">' +
          '<button class="exhibit__frame-btn" type="button" aria-label="' +
          escapeHtml(art.title) +
          ' 크게 보기">' +
          '<img src="' +
          encodePath(art.file) +
          '" alt="' +
          escapeHtml(art.title) +
          '" loading="' +
          (sectionIndex === 0 && artworkIndex < 2 ? "eager" : "lazy") +
          '" />' +
          "</button>" +
          "</div></div></div>" +
          '<div class="exhibit__shine" aria-hidden="true"></div>' +
          "</div>" +
          "</div>" +
          '<div class="exhibit__plaque">' +
          '<span class="exhibit__era">' +
          escapeHtml(art.era) +
          "</span>" +
          '<h3 class="exhibit__title">' +
          escapeHtml(art.title) +
          "</h3>" +
          '<p class="exhibit__title-en">' +
          escapeHtml(art.titleEn) +
          "</p>" +
          '<p class="exhibit__desc">' +
          escapeHtml(art.description) +
          "</p>" +
          "</div>" +
          nextBlock +
          "</div>" +
          '<div class="exhibit__divider" aria-hidden="true"></div>' +
          "</article>"
        );
      })
      .join("");

    return intro + exhibits + "</section>";
  }

  function buildExhibition() {
    if (!galleryEl) return;

    galleryEl.innerHTML = sections.map(renderSection).join("");

    galleryEl.querySelectorAll(".exhibit__frame-btn").forEach(function (btn) {
      btn.addEventListener("click", onFrameClick);
    });

    initExhibitNav();
    initExhibitReveal();
    initExhibitNavHighlight();
  }

  function initExhibitNav() {
    if (!exhibitNavEl) return;

    exhibitNavEl.innerHTML = sections
      .map(function (section, i) {
        return (
          '<a class="exhibit-nav__link" href="#section-' +
          escapeHtml(section.id) +
          '" data-id="' +
          escapeHtml(section.id) +
          '">' +
          '<span class="exhibit-nav__num">0' +
          (i + 1) +
          "</span>" +
          '<span class="exhibit-nav__text">' +
          escapeHtml(section.title) +
          "</span>" +
          '<span class="exhibit-nav__meta">' +
          section.artworks.length +
          "점</span>" +
          "</a>"
        );
      })
      .join("");
  }

  function initExhibitReveal() {
    const reveals = galleryEl.querySelectorAll(".gallery-section__header, .exhibit");
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("exhibit--visible");
        el.classList.add("gallery-section__header--visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains("gallery-section__header")) {
              entry.target.classList.add("gallery-section__header--visible");
            } else {
              entry.target.classList.add("exhibit--visible");
            }
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initExhibitNavHighlight() {
    if (!exhibitNavEl || !("IntersectionObserver" in window)) return;

    const navLinks = exhibitNavEl.querySelectorAll(".exhibit-nav__link");
    const sectionEls = galleryEl.querySelectorAll(".gallery-section");
    let activeId = sections[0] ? sections[0].id : "";

    function setActive(id) {
      if (!id || id === activeId) return;
      activeId = id;
      navLinks.forEach(function (link) {
        link.classList.toggle("exhibit-nav__link--active", link.dataset.id === id);
      });
    }

    const observer = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (visible[0]) {
          setActive(visible[0].target.dataset.sectionId);
        }
      },
      { threshold: [0.12, 0.24, 0.36], rootMargin: "-18% 0px -35% 0px" }
    );

    sectionEls.forEach(function (el) {
      observer.observe(el);
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("exhibit-nav__link--active", link.dataset.id === activeId);
    });
  }

  function onFrameClick(event) {
    const exhibit = event.currentTarget.closest(".exhibit");
    if (!exhibit) return;
    const artId = exhibit.dataset.id;
    const art = allArtworks.find(function (item) {
      return item.id === artId;
    });
    if (!art) return;
    openLightbox(art);
  }

  function openLightbox(art) {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = encodePath(art.file);
    lightboxImage.alt = art.title;
    if (lightboxEra) lightboxEra.textContent = art.era;
    if (lightboxTitle) lightboxTitle.textContent = art.title;
    if (lightboxDesc) lightboxDesc.textContent = art.description;

    lightboxImage.onerror = function () {
      if (lightboxDesc) {
        lightboxDesc.textContent = "이미지를 불러오지 못했습니다. 파일 경로를 확인해 주세요.";
      }
    };

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    if (typeof lightbox.close === "function") {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }
    document.body.style.overflow = "";
    if (lightboxImage) lightboxImage.src = "";
  }

  if (lightbox) {
    const closeBtn = lightbox.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("cancel", function () {
      document.body.style.overflow = "";
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.open) closeLightbox();
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("nav__links--open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("nav__links--open");
      });
    });
  }

  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    function () {
      if (!header) return;
      header.classList.toggle("site-header--scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  function initStarfield() {
    if (!starCanvas) return;
    const ctx = starCanvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars = [];
    let animationId = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      starCanvas.width = width;
      starCanvas.height = height;
      const count = Math.min(220, Math.floor((width * height) / 8000));
      stars = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.2,
          speed: Math.random() * 0.015 + 0.003,
          phase: Math.random() * Math.PI * 2,
        };
      });
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const twinkle =
          0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 248, 220, " + twinkle + ")";
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(draw);
  }

  buildExhibition();
  initStarfield();
})();
