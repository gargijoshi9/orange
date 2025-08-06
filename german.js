// ---- Demo German Data for 3 Levels -----------
const LEVELS = [
  // Level 1: MCQ (5 questions)
  [
    {
      type: "mcq",
      question: "How do you say 'Good morning' in German?",
      options: ["Guten Morgen", "Gute Nacht", "Dankeschön", "Entschuldigung"],
      answer: "Guten Morgen",
      instructions: "Select the correct German phrase for 'Good morning'."
    },
    {
      type: "mcq",
      question: "What is 'Thank you' in German?",
      options: ["Bitte", "Hallo", "Danke", "Tschüss"],
      answer: "Danke",
      instructions: "Select the correct German word for 'Thank you'."
    },
    {
      type: "mcq",
      question: "How do you say 'Goodbye' in German?",
      options: ["Auf Wiedersehen", "Hallo", "Bitte", "Ja"],
      answer: "Auf Wiedersehen",
      instructions: "Select the correct German phrase for 'Goodbye'."
    },
    {
      type: "mcq",
      question: "What does 'Ja' mean?",
      options: ["No", "Yes", "Please", "Thanks"],
      answer: "Yes",
      instructions: "Choose the English meaning of 'Ja'."
    },
    {
      type: "mcq",
      question: "How do you say 'Sorry' in German?",
      options: ["Entschuldigung", "Danke", "Guten Tag", "Hallo"],
      answer: "Entschuldigung",
      instructions: "Select the German word for 'Sorry'."
    }
  ],

  // Level 2: Matching (5 sets)
  [
    {
      type: "match",
      pairs: [
        { left: "Apple", right: "Apfel" },
        { left: "Bread", right: "Brot" },
        { left: "Water", right: "Wasser" }
      ],
      instructions: "Drag the correct German words to their English equivalents. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "Dog", right: "Hund" },
        { left: "Cat", right: "Katze" },
        { left: "Bird", right: "Vogel" }
      ],
      instructions: "Drag the correct German words to their English equivalents. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "Car", right: "Auto" },
        { left: "House", right: "Haus" },
        { left: "School", right: "Schule" }
      ],
      instructions: "Drag the correct German words to their English equivalents. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "Milk", right: "Milch" },
        { left: "Egg", right: "Ei" },
        { left: "Cheese", right: "Käse" }
      ],
      instructions: "Drag the correct German words to their English equivalents. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "Sun", right: "Sonne" },
        { left: "Moon", right: "Mond" },
        { left: "Star", right: "Stern" }
      ],
      instructions: "Drag the correct German words to their English equivalents. Use Undo to revert last pairing."
    }
  ],

  // Level 3: Audio Fill (5 questions)
  [
    {
      type: "audio-fill",
      word: "Hund",
      question: "Type the German word you hear:",
      audioText: "Hund",
      answer: "Hund",
      instructions: "Listen carefully and type the German word you hear. To hear the audio, click the 🔊 button."
    },
    {
      type: "audio-fill",
      word: "Katze",
      question: "Type the German word you hear:",
      audioText: "Katze",
      answer: "Katze",
      instructions: "Listen carefully and type the German word you hear. To hear the audio, click the 🔊 button."
    },
    {
      type: "audio-fill",
      word: "Vogel",
      question: "Type the German word you hear:",
      audioText: "Vogel",
      answer: "Vogel",
      instructions: "Listen carefully and type the German word you hear. To hear the audio, click the 🔊 button."
    },
    {
      type: "audio-fill",
      word: "Haus",
      question: "Type the German word you hear:",
      audioText: "Haus",
      answer: "Haus",
      instructions: "Listen carefully and type the German word you hear. To hear the audio, click the 🔊 button."
    },
    {
      type: "audio-fill",
      word: "Auto",
      question: "Type the German word you hear:",
      audioText: "Auto",
      answer: "Auto",
      instructions: "Listen carefully and type the German word you hear. To hear the audio, click the 🔊 button."
    }
  ]
];

let xp = 0, hearts = 3;
let currentLevel = 0, questionIndex = 0;
let maxLevelUnlocked = 0;

const mainContent = document.getElementById('mainContent');
const xpAmount = document.getElementById('xpAmount');
const heartsSpan = document.getElementById('hearts');

const gameOverSound = new Audio('game-over-sound.mp3'); // Provide path

// ----------- UTILS --------------
function updateHUD() {
  xpAmount.textContent = xp;
  heartsSpan.textContent = "❤️".repeat(hearts);
}

function playFeedback(isCorrect) {
  if (isCorrect) {
    playSound(true);
  } else {
    playSound(false);
  }
}

function playSound(isCorrect) {
  const sound = document.getElementById(isCorrect ? 'audio-correct' : 'audio-wrong');
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function ttsSpeak(text, lang='de-DE') {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  }
}
window.ttsSpeak = ttsSpeak;

// ----------- UI FLOW -------------
function startApp() {
  xp = 0; hearts = 3; currentLevel = 0; questionIndex = 0;
  maxLevelUnlocked = 0;
  updateHUD();
  showLevelMenu();
}

function showLevelMenu() {
  mainContent.innerHTML = `
    <div class="level-select">
      <div class="level-circle level-1">
        <div class="level-label">LEVEL 1</div>
        <div class="level-circle-outer"><span class="level-star">★</span></div>
        <button class="level-btn" onclick="goToLevel(0)">Start</button>
      </div>
      <div class="level-circle level-2 ${maxLevelUnlocked < 1 ? "level-locked" : ""}">
        <div class="level-label">LEVEL 2</div>
        <div class="level-circle-outer"><span class="level-star">★</span></div>
        <button class="level-btn" onclick="goToLevel(1)" ${maxLevelUnlocked < 1 ? "disabled" : ""}>${maxLevelUnlocked < 1 ? "Locked" : "Start"}</button>
      </div>
      <div class="level-circle level-3 ${maxLevelUnlocked < 2 ? "level-locked" : ""}">
        <div class="level-label">LEVEL 3</div>
        <div class="level-circle-outer"><span class="level-star">★</span></div>
        <button class="level-btn" onclick="goToLevel(2)" ${maxLevelUnlocked < 2 ? "disabled" : ""}>${maxLevelUnlocked < 2 ? "Locked" : "Start"}</button>
      </div>
    </div>
  `;
}

window.goToLevel = function(levelIdx) {
  currentLevel = levelIdx;
  questionIndex = 0;
  updateHUD();
  showQuestion();
};

function showQuestion() {
  updateHUD();
  clearFeedbackPopup();
  let levelArr = LEVELS[currentLevel];
  if (questionIndex >= levelArr.length) {
    showLevelComplete();
    return;
  }
  let q = levelArr[questionIndex];
  mainContent.innerHTML = `<div class="instruction-banner">${q.instructions || ""}</div>`;
  if (q.type === "mcq") renderMCQ(q);
  else if (q.type === "match") renderMatching(q);
  else if (q.type === "audio-fill") renderAudioFill(q);
}

// Feedback popup covering question content with animation
function showFeedbackPopup(msg, positive) {
  clearFeedbackPopup();
  const popup = document.createElement('div');
  popup.className = `feedback-popup ${positive ? 'positive' : 'negative'}`;
  popup.innerHTML = `<div class="popup-content">${msg}</div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

function clearFeedbackPopup() {
  document.querySelectorAll('.feedback-popup').forEach(el => el.remove());
}

function afterAnswered(isCorrect, correctAnswerText='') {
  if (isCorrect) {
    xp += 10;
  } else {
    hearts--;
  }
  updateHUD();
  playFeedback(isCorrect);

  const msg = isCorrect ? 'Correct!' : `Incorrect. ${correctAnswerText ? `The correct answer is: ${correctAnswerText}` : ''}`;
  showFeedbackPopup(msg, isCorrect);

  if (hearts <= 0) {
    setTimeout(() => {
      gameOverSound.play();
      showGameOver();
    }, 2000);
  } else {
    setTimeout(() => {
      questionIndex++;
      if (questionIndex >= LEVELS[currentLevel].length) {
        showLevelComplete();
      } else {
        showQuestion();
      }
    }, 2000);
  }
}

// Activities
function renderMCQ(q) {
  mainContent.innerHTML += `
    <div class="activity mcq-activity" role="group" aria-label="Multiple Choice Question">
      <div class="mcq-question">${q.question}</div>
      <div class="options-grid"></div>
    </div>
  `;
  const optionsGrid = document.querySelector('.options-grid');
  let answered = false;

  q.options.forEach(opt => {
    let btn = document.createElement('button');
    btn.className = 'mcq-btn';
    btn.textContent = opt;
    btn.type = 'button';
    btn.onclick = () => {
      if (answered) return;
      answered = true;
      btn.blur();
      afterAnswered(opt === q.answer, q.answer);
      disableMCQButtons();
    };
    optionsGrid.appendChild(btn);
  });
  function disableMCQButtons() {
    document.querySelectorAll('.mcq-btn').forEach(btn => btn.disabled = true);
  }
}

function renderMatching(q) {
  const lefts = q.pairs.map(p => p.left);
  let rights = q.pairs.map(p => p.right);
  rights = rights.slice().sort(() => Math.random() - 0.5);

  mainContent.innerHTML += `
    <div class="activity match-activity" role="group" aria-label="Matching Question">
      <div class="match-question">${q.question || "Drag the correct German word to each English word:"}</div>
      <div class="drag-pair-wrap">
        <ul class="dd-list" id="ddLeft"></ul>
        <ul class="dd-list" id="ddRight"></ul>
      </div>
      <div class="action-buttons">
        <button class="undo-btn" id="btnUndo" disabled>Undo</button>
        <!-- Submit button will be appended here -->
      </div>
    </div>
  `;
  const leftList = document.getElementById('ddLeft');
  const rightList = document.getElementById('ddRight');
  const undoBtn = document.getElementById('btnUndo');
  const actionsContainer = document.querySelector('.action-buttons');

  lefts.forEach((left, idx) => {
    let li = document.createElement('li');
    li.innerHTML = `<b>${left}</b> <div class="dd-drop" data-left-idx="${idx}" tabindex="0" aria-label="Drop here"></div>`;
    leftList.appendChild(li);
  });

  rights.forEach(right => {
    let li = document.createElement('li');
    li.className = "dd-item";
    li.setAttribute('draggable', 'true');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Draggable: ${right}`);
    li.textContent = right;
    li.dataset.right = right;
    li.addEventListener('dragstart', dragStartHandler);
    li.addEventListener('keydown', ddKeyboardHandler);
    rightList.appendChild(li);
  });

  let dragged;
  let dropHistory = [];

  function dragStartHandler(e) {
    dragged = this;
    this.classList.add('dragging');
    e.dataTransfer.setData('text', this.dataset.right);
  }
  rightList.addEventListener('dragend', () => {
    document.querySelectorAll('.dd-item').forEach(el => el.classList.remove('dragging'));
  });

  document.querySelectorAll('.dd-drop').forEach(dropZone => {
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      let rightWord = e.dataTransfer.getData('text');
      if (dropZone.textContent.trim().length) return;
      dropZone.textContent = rightWord;
      dropZone.classList.add('dd-matched');
      if (dragged) {
        dragged.style.visibility = 'hidden';
        dropHistory.push({ dropZone: dropZone, dragged: dragged });
        undoBtn.disabled = false;
      }
      checkIfAllMatched();
    });
  });

  undoBtn.addEventListener('click', () => {
    if (dropHistory.length === 0) return;
    const last = dropHistory.pop();
    last.dropZone.textContent = '';
    last.dropZone.classList.remove('dd-matched');
    last.dragged.style.visibility = 'visible';
    undoBtn.disabled = dropHistory.length === 0;
  });

  function ddKeyboardHandler(e) {
    if (e.key === "Enter") {
      let focusedDrop = document.activeElement;
      if (focusedDrop.classList.contains('dd-drop') && focusedDrop.textContent.trim().length === 0) {
        focusedDrop.textContent = this.dataset.right;
        focusedDrop.classList.add('dd-matched');
        this.style.visibility = "hidden";
        dropHistory.push({ dropZone: focusedDrop, dragged: this });
        undoBtn.disabled = false;
        checkIfAllMatched();
      }
    }
  }

  function checkIfAllMatched() {
    let drops = document.querySelectorAll('.dd-drop');
    let filled = Array.from(drops).every(d => d.textContent.trim().length);
    if(filled && !document.querySelector('.match-activity .submit-btn')) {
      let btn = document.createElement('button');
      btn.className = 'submit-btn';
      btn.textContent = 'Submit';
      btn.onclick = () => {
        if (btn.disabled) return;
        btn.disabled = true;
        let correct = true;
        let correctList = q.pairs.map(p => p.right);
        drops.forEach((d, i) => {
          if(d.textContent.trim() !== correctList[i]) correct = false;
        });
        let answerString = q.pairs.map(p => `${p.left} = <b>${p.right}</b>`).join(', ');
        afterAnswered(correct, answerString);
      };
      actionsContainer.appendChild(btn);
    }
  }
}

function renderAudioFill(q) {
  mainContent.innerHTML = `
  <div class="instruction-banner">${q.instructions || ""}</div>
    <div class="activity audio-fill-activity" aria-label="Fill in the blank with audio">
      
      <div>${q.question}</div>
      
      <form id="audioFillForm" autocomplete="off" style="text-align:center; margin-top:1rem;">
      <button class="audio-btn" onclick="ttsSpeak('${q.audioText.replace(/'/g, "\\'")}', 'de-DE')" title="Play Audio">🔊</button>
        <input class="input-blank" type="text" aria-label="Your answer" required />
        <br />
        <button class="submit-btn" type="submit" style="margin-top:0.5rem; width: 100px;">Submit</button>
      </form>
      
    </div>
  `;
  const form = document.getElementById('audioFillForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  let formSubmitted = false;
  form.onsubmit = e => {
    e.preventDefault();
    if (formSubmitted) return;
    formSubmitted = true;
    submitBtn.disabled = true;
    let val = form.querySelector('input').value.trim();
    afterAnswered(val.toLowerCase() === q.answer.toLowerCase(), q.answer);
  };
}

function showLevelComplete() {
  if (maxLevelUnlocked < currentLevel + 1 && currentLevel < 2) maxLevelUnlocked = currentLevel + 1;

  if(currentLevel === 2){
    sessionStorage.setItem('finalXP', xp);
    window.location.href = "last.html";
    return;
  }

  mainContent.innerHTML = `
    <div class="level-complete-container animated-fade-in">
      <div class="feedback positive big-feedback">Level Complete!</div>
      <div class="level-summary big-summary">
        <div><strong>XP earned:</strong> ${xp}</div>
        <div style="margin: 20px 0;"></div>
        <div><strong>Hearts left:</strong> ${"❤️".repeat(hearts)}</div>
      </div>
      <div class="level-btn-group">
        <button class="level-btn1" onclick="showLevelMenu()">Back to level menu</button>
        ${
          (currentLevel < 2 && maxLevelUnlocked >= currentLevel + 1)
            ? `<button class="level-btn1" onclick="goToLevel(${currentLevel + 1})">
                 Continue to Level ${currentLevel + 2}
               </button>`
            : ''
        }
      </div>
    </div>
  `;
}

function showGameOver() {
  mainContent.innerHTML = `
    <div class="gameover-container animated-fade-in">
      <div class="feedback negative big-feedback">Game Over. Out of hearts!</div>
      <div class="xp-scored big-summary">XP scored: ${xp}</div>
      <button class="level-btn" onclick="startApp()">Back to main menu</button>
    </div>
  `;
}

// Initialize
updateHUD();
startApp();
