const LEVELS = [
  // Level 1: MCQ (3 questions)
  [
    {
      type: "mcq",
      question: "How do you say 'Hello' in Japanese?",
      options: ["konnichiwa", "sayounara", "arigatou", "sumimasen"],
      answer: "konnichiwa"
    },
    {
      type: "mcq",
      question: "What is 'Thank you' in Japanese?",
      options: ["sayounara", "arigatou", "ohayou", "hai"],
      answer: "arigatou"
    },
    {
      type: "mcq",
      question: "How do you say 'Good morning' in Japanese?",
      options: ["konbanwa", "ohayou", "oyasumi", "itadakimasu"],
      answer: "ohayou"
    }
  ],
  // Level 2: Matching (3 matching questions/sets)
  [
    {
      type: "match",
      pairs: [
        { left: "Water", right: "mizu" },
        { left: "Rice", right: "gohan" },
        { left: "Tea", right: "ocha" }
      ]
    },
    {
      type: "match",
      pairs: [
        { left: "Dog", right: "inu" },
        { left: "Cat", right: "neko" },
        { left: "Bird", right: "tori" }
      ]
    },
    {
      type: "match",
      pairs: [
        { left: "School", right: "gakkou" },
        { left: "Book", right: "hon" },
        { left: "Car", right: "kuruma" }
      ]
    }
  ],
  // Level 3: Fill in the blank + audio (3 questions) with romanized words
  [
    {
      type: "audio-fill",
      word: "inu",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "inu",
      answer: "inu"
    },
    {
      type: "audio-fill",
      word: "neko",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "neko",
      answer: "neko"
    },
    {
      type: "audio-fill",
      word: "tori",
      question: "Type the Japanese word you hear (romanized):",
      audioText: "tori",
      answer: "tori"
    }
  ]
];

let xp = 0, hearts = 3;
let currentLevel = 0, questionIndex = 0;
let maxLevelUnlocked = 0;

const mainContent = document.getElementById('mainContent');
const xpAmount = document.getElementById('xpAmount');
const heartsSpan = document.getElementById('hearts');

// ----------- UTILS --------------
function updateHUD() {
  xpAmount.textContent = xp;
  heartsSpan.textContent = "❤️".repeat(hearts);
}

function playFeedback(isCorrect) {
  if (isCorrect) {
    showFeedback("Correct!", true);
    playSound(true);
  } else {
    showFeedback("Incorrect.", false);
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

// TTS for audio question (Level 3)
function ttsSpeak(text, lang='ja-JP') {
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
      <div class="level-circle level-2 ${maxLevelUnlocked<1 ? "level-locked" : ""}">
        <div class="level-label">LEVEL 2</div>
        <div class="level-circle-outer"><span class="level-star">★</span></div>
        <button class="level-btn" onclick="goToLevel(1)" ${maxLevelUnlocked<1 ? "disabled" : ""}>${maxLevelUnlocked<1 ? "Locked" : "Start"}</button>
      </div>
      <div class="level-circle level-3 ${maxLevelUnlocked<2 ? "level-locked" : ""}">
        <div class="level-label">LEVEL 3</div>
        <div class="level-circle-outer"><span class="level-star">★</span></div>
        <button class="level-btn" onclick="goToLevel(2)" ${maxLevelUnlocked<2 ? "disabled" : ""}>${maxLevelUnlocked<2 ? "Locked" : "Start"}</button>
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
  clearFeedback();
  let levelArr = LEVELS[currentLevel];
  if (questionIndex >= levelArr.length) {
    showLevelComplete();
    return;
  }
  let q = levelArr[questionIndex];
  if (q.type === "mcq") renderMCQ(q);
  else if (q.type === "match") renderMatching(q);
  else if (q.type === "audio-fill") renderAudioFill(q);
}

function afterAnswered(isCorrect, correctAnswerText) {
  if (isCorrect) xp += 10;
  else hearts--;
  updateHUD();
  playFeedback(isCorrect);
  if(!isCorrect && correctAnswerText){
    showFeedback(`The correct answer is: <b>${correctAnswerText}</b>`, false, true);
  }
  showContinuePrompt();
}

function showContinuePrompt() {
  // Prevent multiple continue prompts
  if (document.getElementById('continuePrompt')) return;

  const cDiv = document.createElement('div');
  cDiv.id = "continuePrompt";
  cDiv.innerHTML = `
    <div>Do you want to continue?</div>
    <button class="continue-btn" id="btnYes">Yes</button>
    <button class="continue-btn" id="btnNo">No</button>
  `;
  mainContent.appendChild(cDiv);

  document.getElementById('btnYes').onclick = () => {
    cDiv.remove();
    questionIndex++;
    if (hearts > 0) showQuestion();
    else showGameOver();
  };

  document.getElementById('btnNo').onclick = () => {
    cDiv.remove();
    const totalQuestions = LEVELS[currentLevel].length;
    if (questionIndex + 1 >= totalQuestions) {
      showLevelComplete();
    } else {
      showLevelMenu();
    }
  };
}

function showFeedback(msg, pos, allowHTML) {
  clearFeedback();
  let fb = document.createElement('div');
  fb.className = "feedback " + (pos ? "positive" : "negative");
  if(allowHTML) fb.innerHTML = msg; else fb.textContent = msg;
  mainContent.appendChild(fb);
}

function clearFeedback() {
  [...document.querySelectorAll('.feedback')].forEach(el => el.remove());
}

// ========== ACTIVITIES =============

function renderMCQ(q) {
  mainContent.innerHTML = `
    <div class="activity" role="group" aria-label="Multiple Choice Question">
      <div>${q.question}</div>
      <div class="options-grid"></div>
    </div>
  `;
  const optionsGrid = document.querySelector('.options-grid');
  q.options.forEach(opt => {
    let btn = document.createElement('button');
    btn.className = 'mcq-btn';
    btn.textContent = opt;
    btn.setAttribute('type', 'button');
    btn.onclick = () => {
      btn.blur();
      afterAnswered(opt === q.answer, q.answer);
    };
    optionsGrid.appendChild(btn);
  });
}

function renderMatching(q) {
  let lefts = q.pairs.map(p=>p.left);
  let rights = q.pairs.map(p=>p.right);
  rights = rights.slice().sort(() => Math.random() - 0.5);

  mainContent.innerHTML = `<div class="activity" role="group" aria-label="Matching Question">
    <div>Drag the correct Japanese word (romanized) to each English word:</div>
    <div class="drag-pair-wrap">
      <ul class="dd-list" id="ddLeft"></ul>
      <ul class="dd-list" id="ddRight"></ul>
    </div>
  </div>`;
  const leftList = document.getElementById('ddLeft');
  const rightList = document.getElementById('ddRight');

  lefts.forEach((left, idx) => {
    let li = document.createElement('li');
    li.innerHTML = `<b>${left}</b> <div class="dd-drop" data-left-idx="${idx}" tabindex="0" aria-label="Drop here"></div>`;
    leftList.appendChild(li);
  });

  rights.forEach((right, idx) => {
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
    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('dragover'); });
    dropZone.addEventListener('drop', function(e){
      e.preventDefault(); 
      dropZone.classList.remove('dragover');
      let rightWord = e.dataTransfer.getData('text');
      if(dropZone.textContent.trim().length) return;
      dropZone.textContent = rightWord;
      dropZone.classList.add('dd-matched');
      if(dragged) dragged.style.visibility = 'hidden';
      checkIfAllMatched();
    });
  });

  function ddKeyboardHandler(e){
    if(e.key === "Enter") {
      let focusedDrop = document.activeElement;
      if (focusedDrop.classList.contains('dd-drop') && focusedDrop.textContent.trim().length === 0) {
        focusedDrop.textContent = this.dataset.right;
        focusedDrop.classList.add('dd-matched');
        this.style.visibility = "hidden";
        checkIfAllMatched();
      }
    }
  }

  function checkIfAllMatched() {
    let drops = document.querySelectorAll('.dd-drop');
    let filled = Array.from(drops).every(d => d.textContent.trim().length);
    if(filled && !document.querySelector('.submit-btn')) {
      let btn = document.createElement('button');
      btn.className = 'submit-btn';
      btn.textContent = 'Submit';

      btn.onclick = () => {
        if (btn.disabled) return; // Prevent double submit
        btn.disabled = true;

        let correct = true;
        let correctList = q.pairs.map(p => p.right);
        drops.forEach((d, i) => {
          if(d.textContent.trim() !== correctList[i]) correct = false;
        });
        let answerString = q.pairs.map(p => `${p.left} = <b>${p.right}</b>`).join(', ');
        afterAnswered(correct, answerString);
      };
      mainContent.appendChild(btn);
    }
  }
}

function renderAudioFill(q) {
  mainContent.innerHTML = `
    <div class="activity" aria-label="Fill in the blank with audio">
      <div>${q.question}</div>
      <button class="audio-btn" onclick="ttsSpeak('${q.audioText.replace(/'/g, "\\'")}', 'ja-JP')" title="Play Audio">🔊</button>
      <form id="audioFillForm" autocomplete="off" style="display:inline;">
        <input class="input-blank" type="text" aria-label="Your answer" required />
        <button class="submit-btn" type="submit">Submit</button>
      </form>
    </div>
  `;
  const form = document.getElementById('audioFillForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  form.onsubmit = e => {
    e.preventDefault();
    if (submitBtn.disabled) return; // Prevent double submit
    submitBtn.disabled = true;

    let val = form.querySelector('input').value.trim();
    afterAnswered(val.toLowerCase() === q.answer.toLowerCase(), q.answer);
  };
}

// ========== COMPLETION ROUTINES =============
function showGameOver() {
  mainContent.innerHTML = `
    <div class="gameover-container">
      <div class="feedback negative">Game Over. Out of hearts!</div>
      <div class="xp-scored">XP scored: ${xp}</div>
      <button class="level-btn" onclick="startApp()">Back to main menu</button>
    </div>
  `;
}


function showLevelComplete() {
  if (maxLevelUnlocked < currentLevel + 1 && currentLevel < 2) maxLevelUnlocked = currentLevel + 1;

  if(currentLevel === 2){
    sessionStorage.setItem('finalXP', xp);
    window.location.href = "last.html";
    return;
  }
  
 mainContent.innerHTML = `
  <div class="level-complete-container">
    <div class="feedback positive">Level Complete!</div>
    <div class="level-summary">
      <div>XP for this level: ${xp}</div>
      <div style="margin: 20px 0;"></div>
      <div>Hearts left: ${hearts}</div>
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

// ========== INIT ===========
updateHUD();
startApp();
