// preloader 100% screen //
document.addEventListener("DOMContentLoaded", () => {
  let progress = 0;
  const progressText = document.getElementById("progress-text");
  const preloader = document.getElementById("preloader");

  document.body.style.overflow = "hidden";

  function updateProgress() {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 11) + 8;
      if (progress > 100) progress = 100;

      progressText.textContent = progress + "%";

      const delay = Math.floor(Math.random() * 200) + 20;
      setTimeout(updateProgress, delay);
    } else {
      // Pause at 100% before sliding
      setTimeout(() => {
        preloader.classList.add("preloader-finish");

        // Re-enable scrolling when preloader slides away
        document.body.style.overflow = "auto";

        setTimeout(() => {
          preloader.style.display = "none";
        }, 1000); // match CSS transition
      }, 500); // pause time
    }
  }

  updateProgress();
});

  
   document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.about-content-text').forEach(el => {
    observer.observe(el);
  });
});

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  window.addEventListener('load', () => {
    const debugMarkers = false;

    const tags = document.querySelectorAll('.skills .tag');
    if (!tags.length) {
      console.warn('GSAP: no elements found with selector ".skills .tag"');
      return;
    }

    gsap.from(tags, {
      scrollTrigger: {
        trigger: ".skills",
        start: "top 80%",
        end: "bottom top",
        toggleActions: "play none none none",
        markers: debugMarkers
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out"
    });

    gsap.from(".projects .projects-content", {
      scrollTrigger: {
        trigger: ".projects",
        start: "top 75%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.18,
      ease: "power3.out"
    });

    gsap.from(".projects .projects-content-images img", {
      scrollTrigger: {
        trigger: ".projects",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      scale: 0.98,
      duration: 0.9,
      stagger: 0.18,
      ease: "power3.out"
    });
  });

AOS.init({ duration: 800, once: true });
gsap.registerPlugin(ScrollTrigger);

// Formspree (contact form)
// Toast-based Formspree handler
document
  .getElementById("contact-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const toast = document.getElementById("form-toast");
    const toastText = document.getElementById("form-toast-text");

    function showToast(message, type = "success", duration = 3000) {
      toastText.textContent = message;
      toast.classList.remove("hidden", "success", "error");
      toast.classList.add(type);
      requestAnimationFrame(() => toast.classList.add("show"));
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 500);
      }, duration);
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        showToast("Message sent successfully!", "success");
        form.reset();
      } else {
        showToast("Oops! Something went wrong.", "error");
      }
    } catch (error) {
      showToast("Network error. Please try again later.", "error");
    }
  });

// ---------- Project "Read more" toggles ----------
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.querySelectorAll(".project-toggle").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    const blocks = panel.querySelectorAll(".detail-block");
    const arrow = btn.querySelector(".arrow");
    const label = btn.querySelector(".label");

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onComplete: () => ScrollTrigger.refresh(),
      onReverseComplete: () => {
        gsap.set(panel, { visibility: "hidden" });
        ScrollTrigger.refresh();
      },
    });

    tl.set(panel, { visibility: "visible" })
      .fromTo(panel, { height: 0 }, { height: "auto", duration: 0.6 })
      .fromTo(
        blocks,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.12 },
        "-=0.3",
      )
      .to(arrow, { rotation: 180, duration: 0.4 }, 0);

    if (reduceMotion) tl.timeScale(100);

    let open = false;
    btn.addEventListener("click", () => {
      open = !open;
      btn.setAttribute("aria-expanded", open);
      label.textContent = open ? "Show less" : "Read more";
      open ? tl.play() : tl.reverse();
    });
  });
});

// ---------- Navbar / menu / transitions ----------
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const pageTransition = document.getElementById("page-transition");
  const allNavLinks = navLinks.querySelectorAll("a");
  const logoLink = document.querySelector(".navbar .logo-img").parentElement;

  const footerLinks = document.querySelectorAll(".footer-links a");

  // Toggle mobile menu
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Close mobile menu when clicking/tapping outside of it
  document.addEventListener("click", (e) => {
    const isOpen = navLinks.classList.contains("open");
    const clickedInsideMenu = navLinks.contains(e.target);
    const clickedToggle = menuToggle.contains(e.target);

    if (isOpen && !clickedInsideMenu && !clickedToggle) {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("open");
    }
  });

  // Overlay page transition handler
  function handleTransition(href) {
    pageTransition.classList.add("active");

    setTimeout(() => {
      const targetSection = document.querySelector(href);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);

    setTimeout(() => {
      pageTransition.classList.add("exit");

      setTimeout(() => {
        pageTransition.classList.remove("active", "exit");
      }, 600);
    }, 600);
  }

  // Navbar link clicks
  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        menuToggle.classList.remove("active");
        navLinks.classList.remove("open");
        handleTransition(href);
      }
    });
  });

  // Footer link clicks
  footerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        handleTransition(href);
      }
    });
  });

  // Logo click: scroll to top with transition
  logoLink.addEventListener("click", (e) => {
    e.preventDefault();

    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");

    pageTransition.classList.add("active");

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 300);

    setTimeout(() => {
      pageTransition.classList.add("exit");

      setTimeout(() => {
        pageTransition.classList.remove("active", "exit");
      }, 600);
    }, 600);
  });
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
