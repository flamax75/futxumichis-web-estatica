const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const installButton = document.querySelector(".install-app");
let deferredInstallPrompt = null;

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  if (!(installButton instanceof HTMLButtonElement)) {
    return;
  }

  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

if (installButton instanceof HTMLButtonElement) {
  installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    installButton.hidden = true;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  });
}

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  if (installButton instanceof HTMLButtonElement) {
    installButton.hidden = true;
  }
});

const animatedTitles = document.querySelectorAll(".hero-copy h1, .section-heading h2, .contact h2");

animatedTitles.forEach((title) => {
  const text = title.textContent || "";
  title.setAttribute("aria-label", text);
  title.classList.add("animated-title");
  title.textContent = "";

  let letterIndex = 0;
  text.split(/(\s+)/).forEach((part) => {
    if (!part.trim()) {
      title.appendChild(document.createTextNode(part));
      return;
    }

    const word = document.createElement("span");
    word.className = "title-word";
    title.appendChild(word);

    Array.from(part).forEach((character) => {
      const letter = document.createElement("span");
      const spread = 28 + (letterIndex % 5) * 8;
      const direction = letterIndex % 2 === 0 ? 1 : -1;

      letter.className = "title-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = character;
      letter.style.setProperty("--letter-index", String(letterIndex));
      letter.style.setProperty("--letter-x", `${direction * spread}px`);
      letter.style.setProperty("--letter-y", `${(letterIndex % 3 - 1) * 26}px`);
      letter.style.setProperty("--letter-rotate", `${direction * (8 + letterIndex % 7)}deg`);
      word.appendChild(letter);
      letterIndex += 1;
    });
  });
});

if ("IntersectionObserver" in window) {
  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-formed");
          titleObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.32 }
  );

  animatedTitles.forEach((title) => titleObserver.observe(title));
} else {
  animatedTitles.forEach((title) => title.classList.add("is-formed"));
}
