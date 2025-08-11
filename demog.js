(() => {
  "use strict";

  // --- GERMAN VOCABULARY WITH AUDIO FILES ---
  const VOCABULARY = [
    {
      english: "Dog",
      german: "Hund",
      image: "dog.jpg",
      instruction: "'Hund' (hoond) is the German word for Dog.",
      audio: "audio/hund.mp3"
    },
    {
      english: "Cat",
      german: "Katze",
      image: "cat.jpg",
      instruction: "'Katze' (kaht-ze) is the German word for Cat.",
      audio: "audio/katze.mp3"
    },
    {
      english: "Apple",
      german: "Apfel",
      image: "apple.jpg",
      instruction: "'Apfel' (ahp-fel) is the German word for Apple.",
      audio: "audio/apfel.mp3"
    },
    {
      english: "House",
      german: "Haus",
      image: "house.jpg",
      instruction: "'Haus' (hows) is the German word for House.",
      audio: "audio/haus.mp3"
    },
    {
      english: "Car",
      german: "Auto",
      image: "car.jpg",
      instruction: "'Auto' (ow-toh) is the German word for Car.",
      audio: "audio/auto.mp3"
    },
    {
      english: "Bird",
      german: "Vogel",
      image: "bird.jpg",
      instruction: "'Vogel' (foh-gel) is the German word for Bird.",
      audio: "audio/vogel.mp3"
    },
    {
      english: "Thank You",
      german: "Danke",
      image: "thankyou.jpg",
      instruction: "'Danke' (dahn-ke) is the German way to say Thank You.",
      audio: "audio/danke.mp3"
    },
    {
      english: "Good Morning",
      german: "Guten Morgen",
      image: "goodmorning.jpg",
      instruction: "'Guten Morgen' (goo-ten mor-gen) is the German way to say Good Morning.",
      audio: "audio/gutenmorgen.mp3"
    },
    {
      english: "School",
      german: "Schule",
      image: "school.jpg",
      instruction: "'Schule' (shoo-le) is the German word for School.",
      audio: "audio/schule.mp3"
    },
    {
      english: "Sorry",
      german: "Entschuldigung",
      image: "sorry.jpg",
      instruction: "'Entschuldigung' (ent-shool-dee-goong) is the German way to say Sorry.",
      audio: "audio/entschuldigung.mp3"
    }
  ];

  const carouselContainer = document.getElementById("carouselContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressIndicator = document.getElementById("progressIndicator");
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");

  let currentIndex = 0;
  let isAnimating = false;

  // THEME SWITCH
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

  // CREATE CARD WITH AUDIO BUTTON
  function createCard(vocab) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Vocabulary: ${vocab.english}, German: ${vocab.german}`);

    card.innerHTML = `
      <img src="${vocab.image}" alt="${vocab.english} image" />
      <div class="word-english">${vocab.english}</div>
      <div class="word-german">${vocab.german}</div>
      <button class="audio-btn" aria-label="Play pronunciation for ${vocab.german}">🔊</button>
      <div class="word-instruction">${vocab.instruction}</div>
    `;

    // Add audio play event
    const audioBtn = card.querySelector(".audio-btn");
    audioBtn.addEventListener("click", () => {
      const audio = new Audio(vocab.audio);
      audio.play();
    });

    return card;
  }

  // SHOW CARD
  function showCard(newIndex, direction) {
    if (direction !== null && (isAnimating || newIndex === currentIndex)) return;

    if (newIndex < 0) newIndex = VOCABULARY.length - 1;
    if (newIndex >= VOCABULARY.length) newIndex = 0;

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

    isAnimating = true;
    const outgoingCard = carouselContainer.querySelector(".card");
    const incomingCard = createCard(VOCABULARY[newIndex]);

    incomingCard.style.transform = direction === "next" ? "translateX(100%)" : "translateX(-100%)";
    incomingCard.style.opacity = "0";
    carouselContainer.appendChild(incomingCard);

    void incomingCard.offsetWidth;

    if (outgoingCard) {
      outgoingCard.style.transform = direction === "next" ? "translateX(-100%)" : "translateX(100%)";
      outgoingCard.style.opacity = "0";
    }

    incomingCard.style.transform = "translateX(0)";
    incomingCard.style.opacity = "1";

    incomingCard.addEventListener("transitionend", () => {
      if (outgoingCard) carouselContainer.removeChild(outgoingCard);
      currentIndex = newIndex;
      updateProgress();
      isAnimating = false;
      incomingCard.focus();
    }, { once: true });
  }

  // UPDATE PROGRESS
  function updateProgress() {
    progressIndicator.textContent = `Word ${currentIndex + 1} of ${VOCABULARY.length}`;
  }

  // SETUP NAVIGATION
  function setupNavigation() {
    prevBtn.addEventListener("click", () => {
      showCard(currentIndex - 1, "prev");
    });
    nextBtn.addEventListener("click", () => {
      showCard(currentIndex + 1, "next");
    });
  }

  // INIT APP
  function init() {
    initTheme();
    showCard(currentIndex, null);
    setupNavigation();

    document.getElementById("homeBtn").addEventListener("click", () => {
      window.location.href = "index.html";
    });
    document.getElementById("continueBtn").addEventListener("click", () => {
      window.location.href = "main-german.html";
    });
  }

  window.addEventListener("DOMContentLoaded", init);
})();
