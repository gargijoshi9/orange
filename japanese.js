// ---- Demo Japanese Data for 3 Levels -----------
const LEVELS = [
  // Level 1: MCQ (5 questions for consistency)
  [
    {
      type: "mcq",
      question: "How do you say 'Hello' in Japanese?",
      options: ["konnichiwa", "sayounara", "arigatou", "sumimasen"],
      answer: "konnichiwa",
      instructions: "Select the correct Japanese greeting for 'Hello'."
    },
    {
      type: "mcq",
      question: "What is 'Thank you' in Japanese?",
      options: ["sayounara", "arigatou", "ohayou", "hai"],
      answer: "arigatou",
      instructions: "Select the correct Japanese phrase for 'Thank you'."
    },
    {
      type: "mcq",
      question: "How do you say 'Good morning' in Japanese?",
      options: ["konbanwa", "ohayou", "oyasumi", "itadakimasu"],
      answer: "ohayou",
      instructions: "Select the correct Japanese phrase for 'Good morning'."
    },
    {
      type: "mcq",
      question: "What does 'hai' mean?",
      options: ["Yes", "No", "Maybe", "Please"],
      answer: "Yes",
      instructions: "Select the English meaning of 'hai'."
    },
    {
      type: "mcq",
      question: "How do you say 'Sorry' in Japanese?",
      options: ["sumimasen", "arigatou", "konbanwa", "ohayou"],
      answer: "sumimasen",
      instructions: "Select the correct Japanese phrase for 'Sorry'."
    }
  ],

  // Level 2: Matching (5 sets)
  [
    {
      type: "match",
      pairs: [
        { left: "Water", right: "mizu" },
        { left: "Rice", right: "gohan" },
        { left: "Tea", right: "ocha" }
      ],
      instructions: "Drag the correct Japanese words (romanized) to the English words. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "Dog", right: "inu" },
        { left: "Cat", right: "neko" },
        { left: "Bird", right: "tori" }
      ],
      instructions: "Drag the correct Japanese words (romanized) to the English words. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "School", right: "gakkou" },
        { left: "Book", right: "hon" },
        { left: "Car", right: "kuruma" }
      ],
      instructions: "Drag the correct Japanese words (romanized) to the English words. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "Milk", right: "gyuunyuu" },
        { left: "Egg", right: "tamago" },
        { left: "Cheese", right: "chiizu" }
      ],
      instructions: "Drag the correct Japanese words (romanized) to the English words. Use Undo to revert last pairing."
    },
    {
      type: "match",
      pairs: [
        { left: "Sun", right: "taiyou" },
        { left: "Moon", right: "tsuki" },
        { left: "Star", right: "hoshi" }
      ],
      instructions: "Drag the correct Japanese words (romanized) to the English words. Use Undo to revert last pairing."
    }
  ],

  // Level 3: Audio Fill (5 questions)
  [
    {
      type: "audio-fill",
      word: "inu",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "inu",
      answer: "inu",
      instructions: "Listen to the audio and type the word you hear."
    },
    {
      type: "audio-fill",
      word: "neko",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "neko",
      answer: "neko",
      instructions: "Listen to the audio and type the word you hear."
    },
    {
      type: "audio-fill",
      word: "tori",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "tori",
      answer: "tori",
      instructions: "Listen to the audio and type the word you hear."
    },
    {
      type: "audio-fill",
      word: "gakkou",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "gakkou",
      answer: "gakkou",
      instructions: "Listen to the audio and type the word you hear."
    },
    {
      type: "audio-fill",
      word: "kuruma",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "kuruma",
      answer: "kuruma",
      instructions: "Listen to the audio and type the word you hear."
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

// NEW feature 
const MAX_HEARTS = 3;
let heartRegenTime = 25; // seconds 
let heartRegenTimer;

// Heart Regeneration 
function startHeartRegen() {
    
    if (heartRegenTimer) return;

    let timeLeft = heartRegenTime;

    heartRegenTimer = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            if (hearts < MAX_HEARTS) {
                hearts++;
                updateHUD();
                
                if (hearts >= MAX_HEARTS) { //heart full check 
                    clearInterval(heartRegenTimer);
                    heartRegenTimer = null;
                } else {
                    
                    timeLeft = heartRegenTime;
                }
            } else {
                clearInterval(heartRegenTimer);
                heartRegenTimer = null; //timer stop 
            }
        }
    }, 1000);
}


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
    if (hearts > 0) { // updated here 
        hearts--;
        startHeartRegen();
    }
  }
  updateHUD();
  playFeedback(isCorrect);

  const msg = isCorrect ? 'Correct!' : `Incorrect. ${correctAnswerText ? `The correct answer is: ${correctAnswerText}` : ''}`;
  showFeedbackPopup(msg, isCorrect);

  if (hearts <= 0) {
  // Save the spot where they lost
  sessionStorage.setItem("resumeLevel", currentLevel);      // updated here 
  sessionStorage.setItem("resumeQuestion", questionIndex);
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
let confettiIntervalId; // Global so we can clear it later

function showLevelComplete() {
  if (maxLevelUnlocked < currentLevel + 1 && currentLevel < 2) maxLevelUnlocked = currentLevel + 1;

  if (currentLevel === 2) {
    sessionStorage.setItem('finalXP', xp);
    window.location.href = "last.html";
    return;
  }

  mainContent.innerHTML = `
    <div class="level-complete-container animated-fade-in">
      <div class="confetti-wrapper"></div>
      <div class="feedback positive big-feedback">Level Complete!</div>
      <div class="level-summary big-summary">
        <div>XP earned: ${xp}</div>
        <div style="margin: 20px 0;"></div>
        <div>Hearts left: ${"❤️".repeat(hearts)}</div>
      </div>
      <div class="level-btn-group">
        <button class="level-btn1" onclick="stopConfetti(); showLevelMenu()">Back to level menu</button>
        ${
          (currentLevel < 2 && maxLevelUnlocked >= currentLevel + 1)
            ? `<button class="level-btn1" onclick="stopConfetti(); goToLevel(${currentLevel + 1})">
                 Continue to Level ${currentLevel + 2}
               </button>`
            : ''
        }
      </div>
      <audio id="success-sound" src="success.mp3" preload="auto"></audio>
    </div>
  `;

  const confettiWrapper = document.querySelector('.confetti-wrapper');

  confettiIntervalId = setInterval(() => {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.setProperty('--fall-duration', (Math.random() * 3 + 3) + 's');
    confetti.style.setProperty('--confetti-color', getRandomColor());
    confettiWrapper.appendChild(confetti);

    // Clean up old confetti
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }, 100); // drop one every 100ms

   const successSound = document.getElementById('success-sound');
if (successSound) {
  successSound.play().catch((e) => {
    console.warn("Auto-play blocked by browser:", e);
  });
}
}

function getRandomColor() {
  const colors = ['#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#ff69b4'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function stopConfetti() {
  clearInterval(confettiIntervalId);
}

function showGameOver() {
  let nextHeartIn = heartRegenTime; // seconds until regeneration starts

  mainContent.innerHTML = `
    <div class="gameover-container animated-fade-in">
      <div class="feedback negative big-feedback">Game Over <br/> Out of hearts!</div>
      <div class="xp-scored big-summary">XP scored: ${xp}</div>
      <div style="font-size:1.2rem; text-align: center;">Please wait for a heart to regenerate if you want to continue...</div>
      <div id="countdown" style="font-size:2rem; margin-top:10px;">
        Next heart in: ${nextHeartIn}s
      </div>
      <div style="margin-top:20px;">
        <button class="level-btn" onclick="startApp()">Back to main menu</button>
      </div>
    </div>
  `;

  
  startHeartRegen();

 
  let countdownInterval = setInterval(() => {
    nextHeartIn--;
    const cDownEl = document.getElementById("countdown");
    if (cDownEl) {
      cDownEl.textContent = `Next heart in: ${nextHeartIn}s`;
    }
    // Reset timer for next heart
    if (nextHeartIn <= 0) {
      nextHeartIn = heartRegenTime;
    }
  }, 1000);

  // Check if heart regenerated and continue
 let waitCheck = setInterval(() => {
  if (hearts > 0) {
    clearInterval(waitCheck);
    clearInterval(countdownInterval);

    // Get the saved position
    let resumeLevel = parseInt(sessionStorage.getItem("resumeLevel"), 10);
    let resumeQ = parseInt(sessionStorage.getItem("resumeQuestion"), 10);

    if (!isNaN(resumeLevel) && !isNaN(resumeQ)) {
      currentLevel = resumeLevel;
      questionIndex = resumeQ;
      updateHUD();
      showQuestion(); // Resume exactly where player lost
    } else {
      // Fallback if somehow not saved
      goToLevel(currentLevel);
    }
  }
}, 1000);

}


// Initialize
updateHUD();
startApp();
