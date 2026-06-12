document.addEventListener("DOMContentLoaded", () => {
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const pageClassMap = {
    "about.html": "page-about",
    "hairball-friends.html": "page-hairball-friends",
    "mff.html": "page-mff",
    "world.html": "page-world",
    "story.html": "page-story",
    "FAQ.html": "page-faq",
    "privacypolicy.html": "page-privacypolicy"
  };

  if (pageClassMap[pageName]) {
    document.body.classList.add(pageClassMap[pageName]);
  }

  // ① ページ読み込み時：フェードイン
  document.body.classList.add("page-loaded");

  // ② ページ内リンククリック時：フェードアウトしてから遷移
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // 外部リンク・新規タブ・アンカーは除外
    const isExternal = href.startsWith('http') && !href.startsWith(window.location.origin);
    const isAnchor = href.startsWith('#');
    const isNewTab = link.target === '_blank';

    if (isExternal || isAnchor || isNewTab) {
      return; 
    }

    // 内部リンクだけフェードアウト遷移
    link.addEventListener('click', (event) => {
      event.preventDefault();

      // すでにフェードアウト中なら二重で動かさない
      if (document.body.classList.contains('page-fade-out')) return;

      document.body.classList.add('page-fade-out');

      // CSSのtransition時間(0.5s)に合わせる
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });

  // ③ 言語切り替え（EN / JP）
  const setLanguage = selected => {
    document.documentElement.lang = selected === "jp" ? "ja" : "en";
    document.querySelectorAll("[data-lang]").forEach(el => {
      el.style.display = (el.dataset.lang === selected) ? "inline" : "none";
    });
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.setAttribute("aria-pressed", String(btn.dataset.langBtn === selected));
    });
  };

  const savedLanguage = window.localStorage.getItem("ffs-language") || "en";
  setLanguage(savedLanguage);

  document.querySelectorAll("[data-lang-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.langBtn;
      window.localStorage.setItem("ffs-language", selected);
      setLanguage(selected);
    });
  });

  // ④ ハンバーガーメニュー開閉
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuToggle && mobileMenu) {
    // アイコンタップでメニューの表示 / 非表示を切り替え
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(mobileMenu.classList.contains("active")));
    });

    // モバイルメニュー内のリンクをクリックしたらメニューを閉じる（任意）
    mobileMenu.querySelectorAll("a[href]").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    });
  }

  // ⑤ 塗り絵の処理 
  const nurie = document.querySelector(".Nurie");
  if (nurie) {
    const mapping = {
      "Nurie-button-marketing": "Nurie-marketing",
      "Nurie-button-Snowboarding": "Nurie-snowboarding",
      "Nurie-button-Family_and_Friends": "Nurie-family_and_friends",
      "Nurie-button-Animals": "Nurie-Animals",
      "Nurie-button-Life_in_Canada": "Nurie-Life_in_Canada",
      "Nurie-button-Games": "Nurie-Games",
      "Nurie-button-Violin_and_Bass_Guitar": "Nurie-Violin_and_Bass_Guitar",
      "Nurie-button-Badminton": "Nurie-badminton"
    };

    Object.keys(mapping).forEach(buttonClass => {
      const button = document.querySelector(`.${buttonClass}`);
      const layerClass = mapping[buttonClass];

      if (!button) return;

      button.setAttribute("role", "button");
      button.setAttribute("tabindex", "0");

      const toggleColour = () => {
        const targetImg = document.querySelector(`.${layerClass} img`);
        if (!targetImg) return;

        // すでにONならOFFに
        if (targetImg.classList.contains("visible")) {
          targetImg.classList.remove("visible");
          button.classList.remove("active");
        } else {
          targetImg.classList.add("visible");
          button.classList.add("active");
        }
      };

      button.addEventListener("click", toggleColour);
      button.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleColour();
        }
      });
    });
  }

  // ⑥ ファーストビューは、ページ表示時に順番にポップさせる
  const heroTargets = Array.from(document.querySelectorAll([
    ".hero-title",
    ".hero-character",
    ".hero-tagline",
    ".about-hero-inner > *",
    ".haorballfriends-hero-inner > *",
    ".Hairball-friends-hero-tagline",
    ".mff-header > *",
    ".mff-hero > p",
    ".mfflp-hero-bg-img",
    ".mfflp-hero-title-img",
    ".IamMinami > *",
    ".mff-helpandsupport > h1",
    ".mff-privacypolicy > h1"
  ].join(",")));

  heroTargets.forEach((target, index) => {
    target.classList.add("hero-pop");
    target.style.setProperty("--pop-delay", `${80 + index * 110}ms`);
  });

  // ⑦ スクロールに合わせて、文字と画像を下から表示する
  const revealTargets = Array.from(document.querySelectorAll([
    "main h1",
    "main h2",
    "main h3",
    "main p",
    "main img",
    "main .soft-cta",
    ".mff-helpandsupport > *",
    ".mff-privacypolicy > *"
  ].join(","))).filter(target => {
    return !target.classList.contains("hero-pop") &&
      !target.closest(".Nurie") &&
      !target.closest(".story-paw-field") &&
      !target.closest(".site-header");
  });

  revealTargets.forEach(target => {
    target.classList.add("reveal-on-scroll");
    if (target.matches("h1, h2, h3, p") || target.querySelector("h1, h2, h3")) {
      target.classList.add("text-reveal");
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    revealTargets.forEach(target => observer.observe(target));
  } else {
    revealTargets.forEach(target => target.classList.add("is-visible"));
  }

  // ⑧ Storyページの肉球は、本文の余白にだけ点在させる
  if (document.body.classList.contains("story-page")) {
    const pawField = document.createElement("div");
    pawField.className = "story-paw-field";
    pawField.setAttribute("aria-hidden", "true");

    const pawPositions = [
      [4, 19, -12], [82, 27, 9], [8, 39, 7], [78, 48, -8],
      [3, 59, 12], [84, 67, -10], [9, 78, -6], [80, 88, 11]
    ];

    pawPositions.forEach(([left, top, rotate]) => {
      const paw = document.createElement("img");
      paw.src = "../assets/img/paw.png";
      paw.alt = "";
      paw.className = "story-paw";
      paw.style.left = `${left}%`;
      paw.style.top = `${top}%`;
      paw.style.setProperty("--paw-rotate", `${rotate}deg`);
      pawField.appendChild(paw);
    });

    document.body.appendChild(pawField);
    const sizePawField = () => {
      pawField.style.height = `${document.documentElement.scrollHeight}px`;
    };
    sizePawField();
    const paws = Array.from(pawField.children);
    let pawFrame;
    const updatePaws = () => {
      pawFrame = undefined;
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      paws.forEach(paw => {
        const pawCenter = paw.offsetTop + paw.offsetHeight / 2;
        paw.classList.toggle("is-visible", Math.abs(pawCenter - viewportCenter) < window.innerHeight * 0.85);
      });
    };

    window.addEventListener("scroll", () => {
      if (!pawFrame) pawFrame = window.requestAnimationFrame(updatePaws);
    }, { passive: true });
    window.addEventListener("resize", () => {
      sizePawField();
      updatePaws();
    });
    updatePaws();
  }
});
