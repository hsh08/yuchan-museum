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
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  const starCanvas = document.getElementById("starfield");

  if (!Array.isArray(ARTWORKS) || ARTWORKS.length === 0) {
    if (galleryEl) {
      galleryEl.innerHTML =
        '<p class="exhibition__empty">소장 작품을 불러올 수 없습니다. assets 폴더를 확인해 주세요.</p>';
    }
    return;
  }

  if (artworkCountEl) {
    artworkCountEl.textContent = String(ARTWORKS.length);
  }

  function sortArtworks(list) {
    return [...list].sort(function (a, b) {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
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

  // 작품별 전시 홀 생성
  function buildExhibition() {
    if (!galleryEl) return;

    const sorted = sortArtworks(ARTWORKS);
    const total = sorted.length;

    galleryEl.innerHTML = sorted
      .map(function (art, i) {
        const num = i + 1;
        const indexLabel = padIndex(num, total) + " / " + padIndex(total, total);
        const nextArt = sorted[i + 1];
        const nextBlock = nextArt
          ? '<a class="exhibit__next" href="#exhibit-' +
            escapeHtml(nextArt.id) +
            '">다음 작품 · ' +
            escapeHtml(nextArt.title) +
            " ↓</a>"
          : '<a class="exhibit__next" href="#visit">관람 안내로 →</a>';

        const visibleClass = i === 0 ? " exhibit--visible" : "";

        return (
          '<article class="exhibit' +
          visibleClass +
          '" id="exhibit-' +
          escapeHtml(art.id) +
          '" data-id="' +
          escapeHtml(art.id) +
          '">' +
          '<div class="exhibit__inner">' +
          '<p class="exhibit__index">작품 ' +
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
          ' 확대 보기">' +
          '<img src="' +
          encodePath(art.file) +
          '" alt="' +
          escapeHtml(art.title) +
          '" loading="' +
          (i < 2 ? "eager" : "lazy") +
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
          "<h3 class=\"exhibit__title\">" +
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

    galleryEl.querySelectorAll(".exhibit__frame-btn").forEach(function (btn) {
      btn.addEventListener("click", onFrameClick);
    });

    initExhibitNav(sorted);
    initExhibitReveal();
    initExhibitNavHighlight(sorted);
  }

  function initExhibitNav(artworks) {
    if (!exhibitNavEl) return;

    exhibitNavEl.innerHTML = artworks
      .map(function (art, i) {
        return (
          '<a class="exhibit-nav__link" href="#exhibit-' +
          escapeHtml(art.id) +
          '" data-id="' +
          escapeHtml(art.id) +
          '">' +
          padIndex(i + 1, artworks.length) +
          ". " +
          escapeHtml(art.title) +
          "</a>"
        );
      })
      .join("");
  }

  // 스크롤 시 전시 홀 페이드인
  function initExhibitReveal() {
    const exhibits = galleryEl.querySelectorAll(".exhibit");
    if (!exhibits.length) return;

    if (!("IntersectionObserver" in window)) {
      exhibits.forEach(function (el) {
        el.classList.add("exhibit--visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("exhibit--visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    exhibits.forEach(function (el) {
      observer.observe(el);
    });
  }

  // 현재 보고 있는 작품 네비 강조
  function initExhibitNavHighlight(artworks) {
    if (!exhibitNavEl || !("IntersectionObserver" in window)) return;

    const navLinks = exhibitNavEl.querySelectorAll(".exhibit-nav__link");
    const exhibits = galleryEl.querySelectorAll(".exhibit");
    let activeId = artworks[0] ? artworks[0].id : "";

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
          .filter(function (e) {
            return e.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (visible[0]) {
          setActive(visible[0].target.dataset.id);
        }
      },
      { threshold: [0.35, 0.5, 0.65], rootMargin: "-20% 0px -20% 0px" }
    );

    exhibits.forEach(function (el) {
      observer.observe(el);
    });

    setActive(activeId);
  }

  function onFrameClick(event) {
    const exhibit = event.currentTarget.closest(".exhibit");
    if (!exhibit) return;
    const artId = exhibit.dataset.id;
    const art = ARTWORKS.find(function (item) {
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
        lightboxDesc.textContent =
          "이미지를 불러오지 못했습니다. 파일 경로를 확인해 주세요.";
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
