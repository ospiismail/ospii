/*
  ospii shared script
  - mobile menu (landing)
  - smooth in-page navigation
  - mockup login submit feedback
*/
(function () {
  const page = document.body.getAttribute("data-page");

  function initSmoothScroll() {
    const links = Array.from(document.querySelectorAll('a[href^="#"]'));
    for (const link of links) {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        event.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function initMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    const openBtn = document.getElementById("openMenuBtn");
    const closeBtn = document.getElementById("closeMenuBtn");
    if (!menu || !openBtn || !closeBtn) return;

    const closeMenu = () => {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
    };
    const openMenu = () => {
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
    };

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    menu.addEventListener("click", (event) => {
      if (event.target === menu) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    const menuLinks = Array.from(menu.querySelectorAll("a"));
    for (const link of menuLinks) {
      link.addEventListener("click", closeMenu);
    }
  }

  function initLoginDemo() {
    const form = document.getElementById("loginForm");
    const msg = document.getElementById("formMsg");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    if (!form || !msg || !username || !password) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      msg.classList.remove("error");
      const user = username.value.trim();
      const pass = password.value.trim();

      if (!user || !pass) {
        msg.textContent = "Vul gebruikersnaam en wachtwoord in.";
        msg.classList.add("error");
        return;
      }

      if (pass !== "huntington") {
        msg.textContent = "Onjuist wachtwoord. Gebruik: huntington";
        msg.classList.add("error");
        return;
      }

      try {
        window.sessionStorage.setItem("health.auth.v1", "1");
        window.sessionStorage.setItem("health.username.v1", user);
        window.sessionStorage.setItem("health.justLoggedIn.v1", "1");
        window.localStorage.setItem("health.patientName.v1", user);
      } catch {
        // Ignore storage errors and still navigate for demo flow.
      }

      msg.textContent = "Inloggen gelukt. Je wordt doorgestuurd...";
      window.setTimeout(() => {
        window.location.href = "app-home.html";
      }, 300);
    });
  }

  function initFeatureSwiper() {
    const root = document.querySelector(".featureSwiper");
    if (!root || typeof window.Swiper !== "function") return () => {};
    const wrapper = root.querySelector(".swiper-wrapper");
    const slides = Array.from(root.querySelectorAll(".swiper-slide"));

    let instance = null;
    const shouldEnable = () => window.matchMedia("(max-width: 880px)").matches;
    const cleanupDesktopState = () => {
      root.classList.remove("swiper-initialized", "swiper-horizontal", "swiper-backface-hidden");
      root.style.removeProperty("overflow");
      if (wrapper) {
        wrapper.style.removeProperty("transform");
        wrapper.style.removeProperty("transition-duration");
        wrapper.style.removeProperty("width");
      }
      for (const slide of slides) {
        slide.style.removeProperty("width");
        slide.style.removeProperty("margin-right");
      }
    };

    const sync = () => {
      if (shouldEnable()) {
        if (instance) return;
        instance = new window.Swiper(root, {
          slidesPerView: 1.12,
          spaceBetween: 12,
          grabCursor: true,
          pagination: {
            el: root.querySelector(".swiper-pagination"),
            clickable: true
          }
        });
        return;
      }
      if (instance) {
        instance.destroy(true, true);
        instance = null;
      }
      cleanupDesktopState();
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }

  function initLandingOrbRandomWalk() {
    if (page !== "landing") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const start = performance.now();
    const seedA = Math.random() * Math.PI * 2;
    const seedB = Math.random() * Math.PI * 2;
    const seedC = Math.random() * Math.PI * 2;
    const seedD = Math.random() * Math.PI * 2;
    const seedE = Math.random() * Math.PI * 2;
    const seedF = Math.random() * Math.PI * 2;

    const setVar = (name, value) => root.style.setProperty(name, value);
    const noise = (t, a, b, c) =>
      Math.sin(t * a + seedA) * 0.55 +
      Math.sin(t * b + seedB) * 0.30 +
      Math.sin(t * c + seedC) * 0.15;

    const frame = (now) => {
      const t = (now - start) / 1000;

      const nx = noise(t, 0.23, 0.47, 0.11);
      const ny = noise(t, 0.19, 0.41, 0.09);
      const nbx = Math.sin(t * 0.37 + seedD) * 0.8;
      const nby = Math.sin(t * 0.31 + seedE) * 0.8;
      const nscale = Math.sin(t * 0.18 + seedF);
      const nangle = (Math.sin(t * 0.07 + seedC) + 1) * 180;

      setVar("--orb-shift-x", `${(nx * 34).toFixed(2)}px`);
      setVar("--orb-shift-y", `${(ny * 30).toFixed(2)}px`);
      setVar("--orb-before-x", `${(nbx * 16).toFixed(2)}px`);
      setVar("--orb-before-y", `${(nby * 14).toFixed(2)}px`);
      setVar("--orb-scale", (1 + nscale * 0.045).toFixed(3));
      setVar("--orb-before-scale", (1 + nscale * 0.06).toFixed(3));
      setVar("--orb-angle", `${nangle.toFixed(2)}deg`);
      setVar("--orb-sat", (1.08 + Math.sin(t * 0.26 + seedA) * 0.08).toFixed(3));
      setVar("--orb-blur", `${(0.22 + Math.sin(t * 0.22 + seedB) * 0.16).toFixed(2)}px`);
      setVar("--orb-glow-a", `${(58 + Math.sin(t * 0.33 + seedD) * 10).toFixed(2)}px`);
      setVar("--orb-glow-b", `${(98 + Math.sin(t * 0.27 + seedE) * 14).toFixed(2)}px`);
      setVar("--orb-glow-alpha-a", (0.20 + Math.sin(t * 0.29 + seedF) * 0.05).toFixed(3));
      setVar("--orb-glow-alpha-b", (0.22 + Math.sin(t * 0.25 + seedA) * 0.05).toFixed(3));
      setVar("--orb-before-opacity", (0.84 + Math.sin(t * 0.21 + seedB) * 0.08).toFixed(3));

      window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
  }

  if (page === "landing") {
    initSmoothScroll();
    initMobileMenu();
    initFeatureSwiper();
    initLandingOrbRandomWalk();
  }
  if (page === "login") {
    initLoginDemo();
  }
})();


