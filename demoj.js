(() => {
  "use strict";

  // --- Change header & button text to Romanized Japanese when DOM is ready ---
  document.addEventListener("DOMContentLoaded", () => {
    // Header title
    const headerTitle = document.querySelector("header h1");
    if (headerTitle) {
      headerTitle.textContent = "Learn Japanese Basics"; 
    }

    // Nav button aria-labels
    document.getElementById("prevBtn")?.setAttribute("aria-label", "Mae no Tango");
    document.getElementById("nextBtn")?.setAttribute("aria-label", "Tsugi no Tango");

    // Action buttons
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) homeBtn.textContent = " Back to Home Page"; 
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) continueBtn.textContent = "Continue to Game "; 
  });

  // --- JAPANESE VOCABULARY (ROMAJI) ---
  const VOCABULARY = [
    { english: "Dog", japanese: "Inu", image: "dog.jpg", instruction: "'Inu' is the Japanese word for Dog." },
    { english: "Cat", japanese: "Neko", image: "cat.jpg", instruction: "'Neko' is the Japanese word for Cat." },
    { english: "Apple", japanese: "Ringo", image: "apple.jpg", instruction: "'Ringo' is the Japanese word for Apple." },
    { english: "House", japanese: "Ie", image: "house.jpg", instruction: "'Ie' is the Japanese word for House." },
    { english: "Car", japanese: "Kuruma", image: "car.jpg", instruction: "'Kuruma' is the Japanese word for Car." },
    { english: "Good Morning", japanese: "Ohayou", image: "goodmorning.jpg", instruction: "'Ohayou' is the Japanese way to say Good Morning." },
    { english: "Thank You", japanese: "Arigatou", image: "thankyou.jpg", instruction: "'Arigatou' is the Japanese way to say Thank You." },
    { english: "Sorry", japanese: "Sumimasen", image: "sorry.jpg", instruction: "'Sumimasen' is the Japanese way to say Sorry." },
    { english: "School", japanese: "Gakkou", image: "school.jpg", instruction: "'Gakkou' is the Japanese word for School." },
    { english: "Bird", japanese: "Tori", image: "bird.jpg", instruction: "'Tori' is the Japanese word for Bird." }
  ];

  const carouselContainer = document.getElementById("carouselContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressIndicator = document.getElementById("progressIndicator");
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");

  let currentIndex = 0;
  let isAnimating = false;

  // === TEXT-TO-SPEECH FUNCTION ===
  function speakText(text) {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
    window.speechSynthesis.cancel(); // stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // Use Japanese voice if available
    utterance.rate = 0.9; // slightly slower for learning
    speechSynthesis.speak(utterance);
  }

// THEME SWITCH
function initTheme() {
  const toggleBtn = document.getElementById("darkModeToggle");

  // Read the stored preference
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "enabled") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    toggleBtn.textContent = "🌙";
  }

  // Toggle when user clicks button
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  });
}

  // Create a card element — audio now from speech synthesis
  function createCard(vocab) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Vocabulary: ${vocab.english}, Japanese (romaji): ${vocab.japanese}. Press play to hear pronunciation.`);

    card.innerHTML = `
      <img src="${vocab.image}" alt="${vocab.english} image" />
      <div class="word-english">${vocab.english}</div>
      <div class="word-japanese">${vocab.japanese}</div>
      <button class="audio-btn" aria-label="Play pronunciation for ${vocab.japanese}">🔊</button>
      <div class="word-instruction">${vocab.instruction}</div>
    `;

    // Play synthesized audio on click
    const audioBtn = card.querySelector(".audio-btn");
    audioBtn.addEventListener("click", () => {
      speakText(vocab.japanese);
    });

    return card;
  }

  // Show card at current index
  function showCard(newIndex, direction) {
    if (direction !== null && (isAnimating || newIndex === currentIndex)) return;

    if (newIndex < 0) newIndex = VOCABULARY.length - 1;
    if (newIndex >= VOCABULARY.length) newIndex = 0;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

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
    document.getElementById("continueBtn").addEventListener("click", () => window.location.href = "japanese.html");
  }

  window.addEventListener("DOMContentLoaded", init);
})();
