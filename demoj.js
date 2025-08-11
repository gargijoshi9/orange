(() => {
  "use strict";

  // --- Change header & button text to Romanized Japanese when DOM is ready ---
  document.addEventListener("DOMContentLoaded", () => {
    // Header title
    const headerTitle = document.querySelector("header h1");
    if (headerTitle) {
      headerTitle.textContent = "Learn Japanese basics"; 
    }

    // Nav button aria-labels
    const prevBtnEl = document.getElementById("prevBtn");
    if (prevBtnEl) {
      prevBtnEl.setAttribute("aria-label", "Mae no Tango"); // Previous word
    }
    const nextBtnEl = document.getElementById("nextBtn");
    if (nextBtnEl) {
      nextBtnEl.setAttribute("aria-label", "Tsugi no Tango"); // Next word
    }

    // Action buttons
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) {
      homeBtn.textContent = "⬅ Back to Home Page"; 
    }
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) {
      continueBtn.textContent = "Continue to Game ➡"; 
    }
  });

  // --- JAPANESE VOCABULARY (ROMAJI) ---
  const VOCABULARY = [
    {
      english: "Dog",
      japanese: "Inu",
      image: "assets/dog.jpg",
      instruction: "'Inu' is the Japanese word for Dog."
    },
    {
      english: "Cat",
      japanese: "Neko",
      image: "assets/cat.jpg",
      instruction: "'Neko' is the Japanese word for Cat."
    },
    {
      english: "Apple",
      japanese: "Ringo",
      image: "assets/apple.jpg",
      instruction: "'Ringo' is the Japanese word for Apple."
    },
    {
      english: "House",
      japanese: "Ie",
      image: "assets/house.jpg",
      instruction: "'Ie' is the Japanese word for House."
    },
    {
      english: "Car",
      japanese: "Kuruma",
      image: "assets/car.jpg",
      instruction: "'Kuruma' is the Japanese word for Car."
    },
    {
      english: "Good Morning",
      japanese: "Ohayou",
      image: "assets/goodmorning.jpg",
      instruction: "'Ohayou' is the Japanese way to say Good Morning."
    },
    {
      english: "Thank You",
      japanese: "Arigatou",
      image: "assets/thankyou.jpg",
      instruction: "'Arigatou' is the Japanese way to say Thank You."
    },
    {
      english: "Sorry",
      japanese: "Sumimasen",
      image: "assets/sorry.jpg",
      instruction: "'Sumimasen' is the Japanese way to say Sorry."
    },
    {
      english: "School",
      japanese: "Gakkou",
      image: "assets/school.jpg",
      instruction: "'Gakkou' is the Japanese word for School."
    },
    {
      english: "Bird",
      japanese: "Tori",
      image: "assets/bird.jpg",
      instruction: "'Tori' is the Japanese word for Bird."
    }
  ];

  const carouselContainer = document.getElementById("carouselContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressIndicator = document.getElementById("progressIndicator");
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");

  let currentIndex = 0;
  let isAnimating = false;

  // Initialize dark/light theme
  function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
    document.body.classList.toggle("light-mode", savedTheme === "light");

    toggleThemeBtn.addEventListener("click", () => {
      const darkActive = document.body.classList.toggle("dark-mode");
      document.body.classList.toggle("light-mode", !darkActive);
      localStorage.setItem("theme", darkActive ? "dark" : "light");
    });
  }

  // Create a card element from vocabulary item
  function createCard(vocab) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.setAttribute(
      "aria-label",
      `Vocabulary: ${vocab.english}, Japanese (romaji): ${vocab.japanese}`
    );

    card.innerHTML = `
      <img src="${vocab.image}" alt="${vocab.english} image" />
      <div class="word-english">${vocab.english}</div>
      <div class="word-japanese">${vocab.japanese}</div>
      <div class="word-instruction">${vocab.instruction}</div>
    `;

    return card;
  }

  // Show card at current index with sliding animation
  function showCard(newIndex, direction) {
    if (direction !== null && (isAnimating || newIndex === currentIndex)) return;

    if (newIndex < 0) newIndex = VOCABULARY.length - 1;
    if (newIndex >= VOCABULARY.length) newIndex = 0;

    // --- First load (no animation) ---
    if (direction === null) {
      carouselContainer.innerHTML = "";
      const card = createCard(VOCABULARY[newIndex]);
      card.style.transform = "translateX(0)";
      card.style.opacity = "1";
      carouselContainer.appendChild(card);
      currentIndex = newIndex;
      updateProgress();
      card.focus();
      return;
    }

    // --- Animated Card Change ---
    isAnimating = true;
    const outgoingCard = carouselContainer.querySelector(".card");
    const incomingCard = createCard(VOCABULARY[newIndex]);

    if (direction === "next") {
      incomingCard.style.transform = "translateX(100%)";
    } else {
      incomingCard.style.transform = "translateX(-100%)";
    }
    incomingCard.style.opacity = "0";
    carouselContainer.appendChild(incomingCard);

    void incomingCard.offsetWidth; // force reflow

    if (outgoingCard) {
      if (direction === "next") {
        outgoingCard.style.transform = "translateX(-100%)";
      } else {
        outgoingCard.style.transform = "translateX(100%)";
      }
      outgoingCard.style.opacity = "0";
    }

    incomingCard.style.transform = "translateX(0)";
    incomingCard.style.opacity = "1";

    incomingCard.addEventListener(
      "transitionend",
      () => {
        if (outgoingCard) {
          carouselContainer.removeChild(outgoingCard);
        }
        currentIndex = newIndex;
        updateProgress();
        isAnimating = false;
        incomingCard.focus();
      },
      { once: true }
    );
  }

  // Update progress text
  function updateProgress() {
    progressIndicator.textContent = `Word ${currentIndex + 1} of ${VOCABULARY.length}`;
  }

  // Set up event listeners for navigation
  function setupNavigation() {
    prevBtn.addEventListener("click", () => {
      showCard(currentIndex - 1, "prev");
    });

    nextBtn.addEventListener("click", () => {
      showCard(currentIndex + 1, "next");
    });
  }

  // Initialize everything
  function init() {
    initTheme();
    showCard(currentIndex, null);
    setupNavigation();

    document.getElementById("homeBtn").addEventListener("click", () => {
      window.location.href = "index.html";
    });

    document.getElementById("continueBtn").addEventListener("click", () => {
      window.location.href = "main-japanese.html";
    });
  }

  window.addEventListener("DOMContentLoaded", init);
})();
