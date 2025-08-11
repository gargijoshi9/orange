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
    document.getElementById("prevBtn")?.setAttribute("aria-label", "Mae no Tango");
    document.getElementById("nextBtn")?.setAttribute("aria-label", "Tsugi no Tango");

    // Action buttons
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) homeBtn.textContent = "⬅ Back to Home Page"; 
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) continueBtn.textContent = "Continue to Game ➡"; 
  });

  // --- JAPANESE VOCABULARY (ROMAJI) WITH AUDIO FILES ---
  const VOCABULARY = [
    { english: "Dog", japanese: "Inu", image: "dog.jpg", instruction: "'Inu' is the Japanese word for Dog.", audio: "audio/inu.mp3" },
    { english: "Cat", japanese: "Neko", image: "cat.jpg", instruction: "'Neko' is the Japanese word for Cat.", audio: "audio/neko.mp3" },
    { english: "Apple", japanese: "Ringo", image: "apple.jpg", instruction: "'Ringo' is the Japanese word for Apple.", audio: "audio/ringo.mp3" },
    { english: "House", japanese: "Ie", image: "house.jpg", instruction: "'Ie' is the Japanese word for House.", audio: "audio/ie.mp3" },
    { english: "Car", japanese: "Kuruma", image: "car.jpg", instruction: "'Kuruma' is the Japanese word for Car.", audio: "audio/kuruma.mp3" },
    { english: "Good Morning", japanese: "Ohayou", image: "goodmorning.jpg", instruction: "'Ohayou' is the Japanese way to say Good Morning.", audio: "audio/ohayou.mp3" },
    { english: "Thank You", japanese: "Arigatou", image: "thankyou.jpg", instruction: "'Arigatou' is the Japanese way to say Thank You.", audio: "audio/arigatou.mp3" },
    { english: "Sorry", japanese: "Sumimasen", image: "sorry.jpg", instruction: "'Sumimasen' is the Japanese way to say Sorry.", audio: "audio/sumimasen.mp3" },
    { english: "School", japanese: "Gakkou", image: "school.jpg", instruction: "'Gakkou' is the Japanese word for School.", audio: "audio/gakkou.mp3" },
    { english: "Bird", japanese: "Tori", image: "bird.jpg", instruction: "'Tori' is the Japanese word for Bird.", audio: "audio/tori.mp3" }
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

  // Create a card element from vocabulary item — includes audio button
  function createCard(vocab) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Vocabulary: ${vocab.english}, Japanese (romaji): ${vocab.japanese}`);

    card.innerHTML = `
      <img src="${vocab.image}" alt="${vocab.english} image" />
      <div class="word-english">${vocab.english}</div>
      <div class="word-japanese">${vocab.japanese}</div>
      <button class="audio-btn" aria-label="Play pronunciation for ${vocab.japanese}">🔊</button>
      <div class="word-instruction">${vocab.instruction}</div>
    `;

    // Play audio on click
    const audioBtn = card.querySelector(".audio-btn");
    audioBtn.addEventListener("click", () => {
      if (vocab.audio) new Audio(vocab.audio).play();
      else alert("No audio file available for this word.");
    });

    return card;
  }

  // Show card at current index
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

    // Animated change
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

  function updateProgress() {
    progressIndicator.textContent = `Word ${currentIndex + 1} of ${VOCABULARY.length}`;
  }

  function setupNavigation() {
    prevBtn.addEventListener("click", () => showCard(currentIndex - 1, "prev"));
    nextBtn.addEventListener("click", () => showCard(currentIndex + 1, "next"));
  }

  function init() {
    initTheme();
    showCard(currentIndex, null);
    setupNavigation();

    document.getElementById("homeBtn").addEventListener("click", () => window.location.href = "index.html");
    document.getElementById("continueBtn").addEventListener("click", () => window.location.href = "main-japanese.html");
  }

  window.addEventListener("DOMContentLoaded", init);
})();
