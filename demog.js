(() => {
  "use strict";

  // --- Change header & button text to German when DOM is ready ---
  document.addEventListener("DOMContentLoaded", () => {
    // Header title
    const headerTitle = document.querySelector("header h1");
    if (headerTitle) {
      headerTitle.textContent = "Learn German Basics"; 
    }

    // Nav button aria-labels
    document.getElementById("prevBtn")?.setAttribute("aria-label", "Vorheriges Word");
    document.getElementById("nextBtn")?.setAttribute("aria-label", "Nächstes Word");

    // Action buttons
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) homeBtn.textContent = "Back to home page"; 
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) continueBtn.textContent = "Continue to game"; 
  });

  // --- GERMAN VOCABULARY ---
  const VOCABULARY = [
    { english: "Dog", german: "Hund", image: "dog.jpg", instruction: "'Hund' is the German word for Hund." },
    { english: "Cat", german: "Katze", image: "cat.jpg", instruction: "'Katze' is the German word for Katze." },
    { english: "Apple", german: "Apfel", image: "apple.jpg", instruction: "'Apfel' is the German word for Apfel." },
    { english: "House", german: "Haus", image: "house.jpg", instruction: "'Haus' is the German word for Haus." },
    { english: "Car", german: "Auto", image: "car.jpg", instruction: "'Auto' is the German word for Auto." },
    { english: "Good Morning", german: "Guten Morgen", image: "goodmorning.jpg", instruction: "'Guten Morgen' is the German phrase for Good Morning." },
    { english: "Thank You", german: "Danke", image: "thankyou.jpg", instruction: "'Danke' is the German word for Thank You." },
    { english: "Sorry", german: "Entschuldigung", image: "sorry.jpg", instruction: "'Entschuldigung' is the German word for Sorry." },
    { english: "School", german: "Schule", image: "school.jpg", instruction: "'Schule' is the German word for School." },
    { english: "Bird", german: "Vogel", image: "bird.jpg", instruction: "'Vogel' is the German word for Bird." }
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
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // German voice if available
    utterance.rate = 0.9; // Slightly slower for clarity
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
    card.setAttribute("aria-label", `Vokabel: ${vocab.english}, Deutsch: ${vocab.german}. Drücke die Wiedergabetaste, um die Aussprache zu hören.`);

    card.innerHTML = `
      <img src="${vocab.image}" alt="${vocab.english} Bild" />
      <div class="word-english">${vocab.english}</div>
      <div class="word-german">${vocab.german}</div>
      <button class="audio-btn" aria-label="Aussprache von ${vocab.german} abspielen">🔊</button>
      <div class="word-instruction">${vocab.instruction}</div>
    `;

    // Play synthesized audio on click
    const audioBtn = card.querySelector(".audio-btn");
    audioBtn.addEventListener("click", () => {
      speakText(vocab.german);
    });

    return card;
  }

  // Show card at current index
  function showCard(newIndex, direction) {
    if (direction !== null && (isAnimating || newIndex === currentIndex)) return;

    if (newIndex < 0) newIndex = VOCABULARY.length - 1;
    if (newIndex >= VOCABULARY.length) newIndex = 0;

    // Stop ongoing speech
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
    document.getElementById("continueBtn").addEventListener("click", () => window.location.href = "german.html");
  }

  window.addEventListener("DOMContentLoaded", init);
})();