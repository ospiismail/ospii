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

  function initRegisterDemo() {
    const form = document.getElementById("registerForm");
    const email = document.getElementById("registerEmail");
    const msg = document.getElementById("registerMsg");
    if (!form || !email || !msg) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      msg.classList.remove("error");
      const value = email.value.trim();
      if (!value) {
        msg.textContent = "Vul je e-mailadres in.";
        msg.classList.add("error");
        return;
      }
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!ok) {
        msg.textContent = "Vul een geldig e-mailadres in.";
        msg.classList.add("error");
        return;
      }
      msg.textContent = "Bedankt! Je staat op de early access lijst.";
      form.reset();
    });
  }

  if (page === "landing") {
    initSmoothScroll();
    initMobileMenu();
  }
  if (page === "login") {
    initLoginDemo();
  }
  if (page === "register") {
    initRegisterDemo();
  }
})();
