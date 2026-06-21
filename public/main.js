/* ============================================================
   SYEDFLIGHTS — main.js
   ============================================================ */

/* ============================================================
   1. NAVIGATION — Mobile Menu Toggle
   ============================================================ */
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

// FIX 1: Guard clause — prevents crash if elements are missing in DOM
if (menuBtn && navLinks && menuBtnIcon) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");

    // UPGRADE 1: Accessibility — tell screen readers menu state
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when a nav link is clicked
  navLinks.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
    menuBtn.setAttribute("aria-expanded", "false");
  });

  // UPGRADE 2: Close menu when clicking outside navbar (better UX)
  document.addEventListener("click", (e) => {
    const isInsideNav = menuBtn.contains(e.target) || navLinks.contains(e.target);
    if (!isInsideNav && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuBtnIcon.setAttribute("class", "ri-menu-line");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // UPGRADE 3: Close menu on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuBtnIcon.setAttribute("class", "ri-menu-line");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.focus(); // Return focus to menu button
    }
  });
}

/* ============================================================
   2. ACTIVE NAV LINK — Highlight current section in navbar
   UPGRADE 4: Was completely missing in original
   ============================================================ */
const sections = document.querySelectorAll("section[id], header[id], footer[id]");
const allNavLinks = document.querySelectorAll(".nav__links a");

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.4,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      allNavLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

/* ============================================================
   3. SCROLL REVEAL ANIMATIONS
   FIX 2: Added prefers-reduced-motion check — animations
   won't run for users who have this OS setting enabled
   ============================================================ */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion && typeof ScrollReveal !== "undefined") {
  const scrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
    // UPGRADE 5: Added easing for smoother, more professional feel
    easing: "cubic-bezier(0.5, 0, 0, 1)",
    // UPGRADE 6: Reset false — elements stay visible once revealed
    reset: false,
  };

  // Hero Section
  ScrollReveal().reveal(".header__image img", {
    ...scrollRevealOption,
    origin: "right",
  });
  ScrollReveal().reveal(".header__content p", {
    ...scrollRevealOption,
    delay: 300,
  });
  ScrollReveal().reveal(".header__content h1", {
    ...scrollRevealOption,
    delay: 600,
  });
  ScrollReveal().reveal(".header__btns", {
    ...scrollRevealOption,
    delay: 900,
    // FIX 3: Reduced from 1500ms — felt too slow, users left before seeing it
  });

  // Destinations
  ScrollReveal().reveal(".destination__card", {
    ...scrollRevealOption,
    interval: 200,
    // FIX 4: Reduced interval from 500ms to 200ms — cards now appear quicker
  });

  // Journey cards
  // UPGRADE 7: Was missing in original — journey cards now animate in
  ScrollReveal().reveal(".journey__card", {
    ...scrollRevealOption,
    interval: 200,
    origin: "bottom",
  });

  // Showcase Section
  ScrollReveal().reveal(".showcase__image img", {
    ...scrollRevealOption,
    origin: "left",
  });
  ScrollReveal().reveal(".showcase__content h4", {
    ...scrollRevealOption,
    delay: 300,
  });
  ScrollReveal().reveal(".showcase__content p", {
    ...scrollRevealOption,
    delay: 500,
  });
  ScrollReveal().reveal(".showcase__btn", {
    ...scrollRevealOption,
    delay: 700,
    // FIX 5: Reduced from 1500ms — was too delayed
  });

  // Banner Stats
  ScrollReveal().reveal(".banner__card", {
    ...scrollRevealOption,
    interval: 200,
  });

  // Discover Cards
  ScrollReveal().reveal(".discover__card", {
    ...scrollRevealOption,
    interval: 200,
  });

  // UPGRADE 8: Reveal section headers too — was missing in original
  ScrollReveal().reveal(".section__header", {
    ...scrollRevealOption,
    distance: "30px",
  });
  ScrollReveal().reveal(".section__description", {
    ...scrollRevealOption,
    distance: "20px",
    delay: 200,
  });
}

/* ============================================================
   4. SWIPER TESTIMONIALS
   FIX 6: Original had slidesPerView: 3 hardcoded — broke on
   mobile showing 3 tiny cards. Now responsive breakpoints added.
   ============================================================ */
if (typeof Swiper !== "undefined") {
  const swiper = new Swiper(".swiper", {
    // UPGRADE 9: Auto width based on slide content
    slidesPerView: "auto",
    spaceBetween: 20,
    loop: true,

    // FIX 7: Added responsive breakpoints
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      540: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },

    // UPGRADE 10: Added autoplay — carousel moves on its own
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    // UPGRADE 11: Added keyboard navigation for accessibility
    keyboard: {
      enabled: true,
    },

    // UPGRADE 12: Added grab cursor for better desktop UX
    grabCursor: true,
  });
}

/* ============================================================
   5. NAVBAR SHADOW ON SCROLL
   UPGRADE 13: Was completely missing — nav now gets a shadow
   when user scrolls down, looks more professional
   ============================================================ */
const nav = document.querySelector("nav");

if (nav) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
      nav.style.backdropFilter = "blur(8px)";
    } else {
      nav.style.boxShadow = "none";
      nav.style.backdropFilter = "none";
    }
  });
}

/* ============================================================
   6. BACK TO TOP BUTTON
   UPGRADE 14: Was completely missing — added smooth scroll
   back to top button that appears after scrolling down
   ============================================================ */
const backToTopBtn = document.createElement("button");
backToTopBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
backToTopBtn.setAttribute("aria-label", "Back to top");
backToTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background-color: #2887ff;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(40, 135, 255, 0.4);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
  z-index: 999;
`;
document.body.appendChild(backToTopBtn);

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTopBtn.style.opacity = "1";
    backToTopBtn.style.transform = "translateY(0)";
  } else {
    backToTopBtn.style.opacity = "0";
    backToTopBtn.style.transform = "translateY(20px)";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================================================
   7. FLIGHT SEARCH (Demo data, client-side only)
   UPGRADE: Simulates a real flight search experience —
   great talking point in interviews about array methods,
   filtering, DOM manipulation, and form handling
   ============================================================ */
(function initFlightSearch() {
  const searchForm = document.querySelector(".search__form");
  if (!searchForm) return;

  const tabs = document.querySelectorAll(".search__tab");
  const returnField = document.getElementById("return-field");
  const fromInput = document.getElementById("search-from");
  const toInput = document.getElementById("search-to");
  const departInput = document.getElementById("search-depart");
  const swapBtn = document.getElementById("swap-btn");
  const searchBtn = document.getElementById("search-btn");
  const resultsSection = document.getElementById("search-results");
  const resultsGrid = document.getElementById("results-grid");
  const emptyState = document.getElementById("search-empty");

  // Set min date to today
  const today = new Date().toISOString().split("T")[0];
  if (departInput) departInput.min = today;
  const returnInput = document.getElementById("search-return");
  if (returnInput) returnInput.min = today;

  // Trip type tabs
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.tab === "roundtrip") {
        returnField.style.display = "flex";
      } else {
        returnField.style.display = "none";
      }
    });
  });

  // Swap From/To cities
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const temp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = temp;
    });
  }

  // Demo airline data for generated results
  const airlines = [
    { name: "SyedFlights Air", icon: "ri-flight-takeoff-line" },
    { name: "SkyLine Express", icon: "ri-plane-line" },
    { name: "Global Wings", icon: "ri-flight-land-line" },
  ];

  function generateFlights(from, to) {
    // Generates 3 randomized demo flights between chosen cities
    return airlines.map((airline, i) => {
      const basePrice = 250 + i * 120 + Math.floor(Math.random() * 80);
      const hours = 2 + i;
      const minutes = Math.floor(Math.random() * 60);
      return {
        airline: airline.name,
        icon: airline.icon,
        from: from || "Origin",
        to: to || "Destination",
        duration: `${hours}h ${minutes}m`,
        stops: i === 0 ? "Non-stop" : `${i} Stop${i > 1 ? "s" : ""}`,
        price: basePrice,
      };
    });
  }

  function renderFlights(flights) {
    resultsGrid.innerHTML = flights
      .map(
        (f) => `
        <div class="flight__result">
          <div class="flight__info">
            <div class="flight__airline">
              <i class="${f.icon}"></i>
              <span>${f.airline}</span>
            </div>
            <div class="flight__route">
              <span>${f.from}</span>
              <span class="route__line"></span>
              <span>${f.to}</span>
            </div>
            <div class="flight__route">
              <i class="ri-time-line"></i>
              <span>${f.duration} · ${f.stops}</span>
            </div>
          </div>
          <div class="flight__price">
            <h4>$${f.price}</h4>
            <span>per person</span>
            <br/>
            <button class="btn flight__book__btn" type="button">Select</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const from = fromInput.value.trim();
      const to = toInput.value.trim();
      const depart = departInput.value;

      // Basic validation
      if (!from || !to || !depart) {
        // UPGRADE: Inline shake animation to draw attention to empty fields
        [fromInput, toInput, departInput].forEach((input) => {
          if (!input.value.trim()) {
            input.style.borderColor = "#e74c3c";
            setTimeout(() => {
              input.style.borderColor = "";
            }, 1500);
          }
        });
        resultsSection.style.display = "none";
        emptyState.style.display = "none";
        return;
      }

      if (from.toLowerCase() === to.toLowerCase()) {
        emptyState.querySelector("p").textContent =
          "Departure and destination cities cannot be the same.";
        emptyState.style.display = "block";
        resultsSection.style.display = "none";
        return;
      }

      // Simulate a brief loading state for realism
      searchBtn.disabled = true;
      const originalHTML = searchBtn.innerHTML;
      searchBtn.innerHTML = '<i class="ri-loader-4-line"></i> Searching...';

      setTimeout(() => {
        const flights = generateFlights(from, to);
        renderFlights(flights);
        resultsSection.style.display = "block";
        emptyState.style.display = "none";
        resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });

        searchBtn.disabled = false;
        searchBtn.innerHTML = originalHTML;
      }, 700);
    });
  }
})();

/* ============================================================
   8. CONTACT FORM VALIDATION & SUBMISSION
   UPGRADE: Client-side validation + simulated submission.
   To make this send real emails, connect to EmailJS
   (https://www.emailjs.com) — free tier available.
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const subjectError = document.getElementById("subject-error");
  const messageError = document.getElementById("message-error");

  const submitBtn = document.getElementById("contact-submit");
  const submitText = document.getElementById("submit-text");
  const submitLoading = document.getElementById("submit-loading");
  const formSuccess = document.getElementById("form-success");

  function validateField(input, errorEl, message, validatorFn) {
    const isValid = validatorFn(input.value.trim());
    if (!isValid) {
      input.classList.add("invalid");
      errorEl.textContent = message;
    } else {
      input.classList.remove("invalid");
      errorEl.textContent = "";
    }
    return isValid;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isNameValid = validateField(
      nameInput,
      nameError,
      "Please enter your name",
      (v) => v.length >= 2
    );
    const isEmailValid = validateField(
      emailInput,
      emailError,
      "Please enter a valid email address",
      (v) => emailRegex.test(v)
    );
    const isSubjectValid = validateField(
      subjectInput,
      subjectError,
      "Please select a subject",
      (v) => v.length > 0
    );
    const isMessageValid = validateField(
      messageInput,
      messageError,
      "Message must be at least 10 characters",
      (v) => v.length >= 10
    );

    const allValid =
      isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (!allValid) return;

    // UPGRADE: Real submission to the backend instead of a simulated delay
    submitBtn.disabled = true;
    submitText.style.display = "none";
    submitLoading.style.display = "inline-flex";
    formSuccess.style.display = "none";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          subject: subjectInput.value,
          message: messageInput.value.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      formSuccess.querySelector("p").textContent = data.message;
      formSuccess.style.display = "flex";
      form.reset();

      setTimeout(() => {
        formSuccess.style.display = "none";
      }, 5000);
    } catch (err) {
      messageError.textContent = err.message;
      messageInput.classList.add("invalid");
    } finally {
      submitBtn.disabled = false;
      submitText.style.display = "inline-flex";
      submitLoading.style.display = "none";
    }
  });

  // Real-time validation as user types (clears error once corrected)
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("invalid");
    });
  });
  subjectInput.addEventListener("change", () => {
    subjectInput.classList.remove("invalid");
  });
})();

/* ============================================================
   9. NEWSLETTER SUBSCRIBE HANDLER
   (Moved from inline <script> in HTML to main.js)
   ============================================================ */
function handleSubscribe(e) {
  e.preventDefault();
  const emailField = document.getElementById("subscribe-email");
  const msg = document.getElementById("subscribe-msg");
  const formEl = document.getElementById("subscribe-form");

  if (emailField && emailField.value) {
    formEl.reset();
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 4000);
  }
}

/* ============================================================
   11. AUTHENTICATION — Sign In / Create Account / Session
   Talks to the Express + SQLite backend. Token is kept in
   memory only (not localStorage) per this environment's
   constraints — for a production deploy, store the JWT in
   localStorage or, better, an httpOnly cookie set by the server.
   ============================================================ */
const Auth = (function initAuth() {
  let currentUser = null;
  let currentToken = null;

  // ---- DOM refs ----
  const overlay = document.getElementById("auth-overlay");
  const closeBtn = document.getElementById("auth-close");
  const tabs = document.querySelectorAll(".auth__tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginAlert = document.getElementById("login-alert");
  const signupAlert = document.getElementById("signup-alert");

  const accountBtn = document.getElementById("account-btn");
  const accountBtnLabel = document.getElementById("account-btn-label");
  const navAccountLink = document.getElementById("nav-account-link");

  if (!overlay || !accountBtn) return null; // page doesn't include auth UI

  // ---- Modal open/close ----
  function openModal(tab = "login") {
    overlay.classList.add("open");
    switchTab(tab);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    clearAlerts();
  }

  function clearAlerts() {
    [loginAlert, signupAlert].forEach((el) => {
      el.classList.remove("show", "error", "success");
      el.textContent = "";
    });
  }

  function switchTab(tab) {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.authTab === tab));
    loginForm.style.display = tab === "login" ? "grid" : "none";
    signupForm.style.display = tab === "signup" ? "grid" : "none";
    clearAlerts();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.authTab));
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  accountBtn.addEventListener("click", () => {
    if (currentUser) {
      toggleAccountDropdown();
    } else {
      openModal("login");
    }
  });

  if (navAccountLink) {
    navAccountLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentUser) {
        window.location.hash = "#search";
      } else {
        openModal("login");
        document.getElementById("nav-links").classList.remove("open");
      }
    });
  }

  function showAlert(el, message, type) {
    el.textContent = message;
    el.classList.remove("error", "success");
    el.classList.add("show", type);
  }

  // ---- Account dropdown (shown after login) ----
  let dropdownEl = null;

  function toggleAccountDropdown() {
    if (dropdownEl) {
      dropdownEl.classList.toggle("open");
      return;
    }
    buildDropdown();
    dropdownEl.classList.add("open");
  }

  function buildDropdown() {
    const wrapper = document.createElement("div");
    wrapper.className = "account__dropdown";
    accountBtn.parentNode.insertBefore(wrapper, accountBtn);
    wrapper.appendChild(accountBtn);

    dropdownEl = document.createElement("div");
    dropdownEl.className = "account__dropdown__menu";
    dropdownEl.innerHTML = `
      <div class="account__dropdown__header">
        <strong>${escapeHtml(currentUser.fullName)}</strong>
        <span>${escapeHtml(currentUser.email)}</span>
      </div>
      <button class="account__dropdown__item" id="dropdown-my-trips">
        <i class="ri-bookmark-3-line"></i> My Saved Trips
      </button>
      <button class="account__dropdown__item danger" id="dropdown-logout">
        <i class="ri-logout-box-line"></i> Sign Out
      </button>
    `;
    wrapper.appendChild(dropdownEl);

    dropdownEl.querySelector("#dropdown-my-trips").addEventListener("click", () => {
      dropdownEl.classList.remove("open");
      document.getElementById("search").scrollIntoView({ behavior: "smooth" });
      loadSavedTrips();
    });
    dropdownEl.querySelector("#dropdown-logout").addEventListener("click", logout);

    document.addEventListener("click", (e) => {
      if (dropdownEl && !wrapper.contains(e.target)) {
        dropdownEl.classList.remove("open");
      }
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Update navbar UI based on auth state ----
  function refreshAccountUI() {
    if (currentUser) {
      accountBtnLabel.textContent = currentUser.fullName.split(" ")[0];
      accountBtn.querySelector("i").className = "ri-user-fill";
      accountBtn.classList.add("logged-in");
      if (navAccountLink) navAccountLink.textContent = "MY ACCOUNT";
      loadSavedTrips();
    } else {
      accountBtnLabel.textContent = "Sign In";
      accountBtn.querySelector("i").className = "ri-user-line";
      accountBtn.classList.remove("logged-in");
      if (navAccountLink) navAccountLink.textContent = "SIGN IN";
      const panel = document.getElementById("saved-trips-panel");
      if (panel) panel.style.display = "none";
    }
  }

  // ---- LOGIN ----
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlerts();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const submitBtn = document.getElementById("login-submit");

    setSubmitLoading(submitBtn, true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      currentUser = data.user;
      currentToken = data.token;
      showAlert(loginAlert, data.message, "success");
      refreshAccountUI();

      setTimeout(closeModal, 800);
    } catch (err) {
      showAlert(loginAlert, err.message, "error");
    } finally {
      setSubmitLoading(submitBtn, false);
    }
  });

  // ---- SIGNUP ----
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlerts();

    const fullName = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const submitBtn = document.getElementById("signup-submit");

    setSubmitLoading(submitBtn, true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Signup failed.");
      }

      currentUser = data.user;
      currentToken = data.token;
      showAlert(signupAlert, data.message, "success");
      refreshAccountUI();

      setTimeout(closeModal, 800);
    } catch (err) {
      showAlert(signupAlert, err.message, "error");
    } finally {
      setSubmitLoading(submitBtn, false);
    }
  });

  function setSubmitLoading(btn, isLoading) {
    const text = btn.querySelector(".auth__submit__text");
    const loading = btn.querySelector(".auth__submit__loading");
    btn.disabled = isLoading;
    text.style.display = isLoading ? "none" : "inline-flex";
    loading.style.display = isLoading ? "inline-flex" : "none";
  }

  function logout() {
    currentUser = null;
    currentToken = null;
    if (dropdownEl) dropdownEl.classList.remove("open");
    refreshAccountUI();
  }

  // ---- Authenticated fetch helper ----
  async function authFetch(url, options = {}) {
    if (!currentToken) throw new Error("Not logged in.");
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${currentToken}`,
      },
    });
  }

  // ---- Saved trips ----
  async function loadSavedTrips() {
    const panel = document.getElementById("saved-trips-panel");
    const grid = document.getElementById("saved-trips-grid");
    if (!panel || !currentUser) return;

    try {
      const res = await authFetch("/api/bookings");
      const data = await res.json();
      if (!data.success) return;

      if (data.bookings.length === 0) {
        panel.style.display = "none";
        return;
      }

      panel.style.display = "block";
      grid.innerHTML = data.bookings
        .map(
          (b) => `
        <div class="saved__trip__card" data-id="${b.id}">
          <div class="saved__trip__info">
            <strong>${escapeHtml(b.from_city)} → ${escapeHtml(b.to_city)}</strong>
            <span class="saved__trip__meta">
              <i class="ri-calendar-line"></i> ${b.depart_date}${b.return_date ? " – " + b.return_date : ""}
              · ${b.passengers} passenger${b.passengers > 1 ? "s" : ""}
            </span>
          </div>
          <button class="saved__trip__delete" data-delete-id="${b.id}" aria-label="Remove trip">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      `
        )
        .join("");

      grid.querySelectorAll("[data-delete-id]").forEach((btn) => {
        btn.addEventListener("click", () => deleteSavedTrip(btn.dataset.deleteId));
      });
    } catch (err) {
      console.error("Failed to load saved trips:", err);
    }
  }

  async function deleteSavedTrip(id) {
    try {
      await authFetch(`/api/bookings/${id}`, { method: "DELETE" });
      loadSavedTrips();
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  }

  async function saveTrip(tripData) {
    if (!currentUser) {
      openModal("login");
      return { success: false, requiresAuth: true };
    }
    try {
      const res = await authFetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });
      const data = await res.json();
      if (data.success) loadSavedTrips();
      return data;
    } catch (err) {
      return { success: false, message: "Could not save trip." };
    }
  }

  // Public API used by the flight search module below
  return {
    isLoggedIn: () => !!currentUser,
    getUser: () => currentUser,
    saveTrip,
    openModal,
  };
})();

/* ============================================================
   12. WIRE "Select" BUTTON IN FLIGHT RESULTS TO SAVE TRIP
   Hooks into the flight search results rendered earlier and
   makes the "Select" button actually save a trip via the API.
   ============================================================ */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".flight__book__btn");
  if (!btn || !Auth) return;

  const card = btn.closest(".flight__result");
  if (!card) return;

  const from = document.getElementById("search-from")?.value || "";
  const to = document.getElementById("search-to")?.value || "";
  const depart = document.getElementById("search-depart")?.value || "";
  const returnDate = document.getElementById("search-return")?.value || "";
  const passengers = document.getElementById("search-passengers")?.value || 1;

  const originalText = btn.textContent;
  btn.textContent = "Saving...";
  btn.disabled = true;

  const result = await Auth.saveTrip({
    fromCity: from,
    toCity: to,
    departDate: depart,
    returnDate: returnDate || null,
    passengers: Number(passengers),
  });

  if (result.success) {
    btn.textContent = "Saved ✓";
    btn.classList.add("saved");
  } else if (result.requiresAuth) {
    btn.textContent = originalText;
  } else {
    btn.textContent = "Try Again";
    setTimeout(() => (btn.textContent = originalText), 1500);
  }
  btn.disabled = false;
});
