document.addEventListener('DOMContentLoaded', () => {
  // 1. Intro Typewriter
  const introText = "It's your birthday! Since you're getting older and your memory might be failing... 👵";
  const introEl = document.getElementById('intro-text');
  let i = 0;

  function typeWriter() {
    if (i < introText.length && introEl) {
      introEl.innerHTML += introText.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }

  setTimeout(typeWriter, 500);

  // Pre-intro NO button logic
  const noBtn = document.getElementById('no-btn');
  const noMsg = document.getElementById('no-msg');
  const noMessages = [
    "Please don't press no babyyyyyy",
    "Only yes is allowed 😭❤️",
    "Come on... press yes please 😌",
    "I worked hard on this! 🥺",
    "Okay now you're just being mean! 😤",
    "seriously????????!"
  ];
  let noClickCount = 0;
  let jumpInterval = null;

  if (noBtn) {
    function moveNoBtn() {
      noClickCount++;
      if (noMsg) {
        noMsg.innerText = noMessages[(noClickCount - 1) % noMessages.length];
        noMsg.classList.add('show');
      }

      // Calculate screen boundaries relative to the button's parent
      const parentRect = noBtn.parentElement.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const btnWidth = btnRect.width || 120;
      const btnHeight = btnRect.height || 50;

      const minX = 10 - parentRect.left;
      const maxX = window.innerWidth - btnWidth - 10 - parentRect.left;
      const minY = 10 - parentRect.top;
      const maxY = window.innerHeight - btnHeight - 10 - parentRect.top;

      // Always jump a good distance, but stay within the viewport limits
      let x = (80 + Math.floor(Math.random() * 80)) * (Math.random() < 0.5 ? -1 : 1);
      let y = (60 + Math.floor(Math.random() * 60)) * (Math.random() < 0.5 ? -1 : 1);

      x = Math.max(minX, Math.min(maxX, x));
      y = Math.max(minY, Math.min(maxY, y));

      noBtn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    // Desktop: keeps jumping as long as cursor is on the button
    noBtn.addEventListener('mouseenter', function () {
      moveNoBtn();
      clearInterval(jumpInterval);
      jumpInterval = setInterval(moveNoBtn, 200);
    });
    noBtn.addEventListener('mouseleave', function () {
      clearInterval(jumpInterval);
    });
    // Mobile: moves the instant your finger touches it
    noBtn.ontouchstart = function (e) { e.preventDefault(); moveNoBtn(); };
  }

  // 2. Music Player
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.innerText = '🎵';
      musicBtn.style.animation = 'none';
      musicBtn.style.transform = 'scale(1)';
    } else {
      bgMusic.play();
      musicBtn.innerText = '🎶';
      musicBtn.style.animation = 'pulse 2s infinite';
    }
    isPlaying = !isPlaying;
  });

  document.body.addEventListener('click', function firstClick() {
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.innerText = '🎶';
        musicBtn.style.animation = 'pulse 2s infinite';
      }).catch(e => console.log("Audio play failed on first click", e));
    }
    document.body.removeEventListener('click', firstClick);
  }, { once: true });

  // 3. Floating Hearts
  const heartsContainer = document.getElementById('floating-hearts');

  function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerText = ['❤️', '💕', '💖', '💗', '🌸', '✨'][Math.floor(Math.random() * 6)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
    heart.style.fontSize = (Math.random() * 15 + 12) + 'px';

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 8000);
  }

  setInterval(createHeart, 600);
});

// Scene Navigation with a slight delay for button animation
let fireworksInterval;
function goToScene(sceneId) {
  setTimeout(() => {
    document.querySelectorAll('.scene').forEach(scene => {
      scene.classList.remove('active');
    });

    setTimeout(() => {
      const target = document.getElementById(sceneId);
      if (target) {
        target.classList.add('active');
        // Scroll to top smoothly
        target.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger fireworks only on wishing scene
        if (sceneId === 'scene-wishing') {
          startFireworks();
        } else {
          clearInterval(fireworksInterval);
        }
      }
    }, 150); // slight delay to allow fade out
  }, 100); // allow click animation to play
}

function startFireworks() {
  const container = document.getElementById('fireworks-container');
  if (!container) return;

  fireworksInterval = setInterval(() => {
    const firework = document.createElement('div');
    firework.style.position = 'absolute';
    firework.style.left = Math.random() * 100 + 'vw';
    firework.style.top = Math.random() * 100 + 'vh';
    firework.style.width = '5px';
    firework.style.height = '5px';
    const colors = ['#ff69b4', '#ff1493', '#ffcc00', '#00ffff', '#fff'];
    firework.style.background = colors[Math.floor(Math.random() * colors.length)];
    firework.style.borderRadius = '50%';
    firework.style.boxShadow = `0 0 10px ${firework.style.background}, 0 0 20px ${firework.style.background}`;

    // Animate
    firework.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(10)', opacity: 0 }
    ], { duration: 1000, easing: 'ease-out' });

    container.appendChild(firework);
    setTimeout(() => firework.remove(), 1000);
  }, 300);
}

// ═══════════════════ QUIZ LOGIC ═══════════════════

const quizData = [
  {
    question: "Where did we actually talk for the very first time in our first year of Degree?",
    img: "assets/girls-meet.png",
    options: [
      "In the canteen fighting for samosa",
      "During that boring chemistry lab",
      "We just randomly smiled at each other in the corridor"
    ],
    correct: 1, // index 1 is correct (Chemistry lab)
    correctMsg: "Yesss! We were both so clueless! 😂",
    wrongMsg: "Oops! Your memory is really failing bestie. Try again! 👵"
  },
  {
    question: "What is our absolute funniest memory together?",
    img: "assets/girls-laugh.png",
    options: [
      "When we tripped in front of our crush",
      "When we got caught laughing in the library",
      "When you forgot my birthday last year 😒"
    ],
    correct: 1,
    correctMsg: "We couldn't stop laughing for 10 minutes straight! 🤣",
    wrongMsg: "Nooo, the library one is the best! Try again! 🤫"
  },
  {
    question: "Why are you my best friend?",
    img: "assets/girls-hug.png",
    options: [
      "Because you buy me food",
      "Because you listen to all my drama",
      "Because we are the exact same kind of crazy 💕"
    ],
    correct: 2,
    correctMsg: "Awww, I love you too! That's the correct answer! 🥺",
    wrongMsg: "While true... there is a better answer! Try again! 🥺"
  }
];

let currentQuestion = 0;

function startQuiz() {
  currentQuestion = 0;
  loadQuestion();
  goToScene('scene-quiz');
}

function loadQuestion() {
  const qData = quizData[currentQuestion];

  document.getElementById('quiz-title').innerText = `Memory Test ${currentQuestion + 1}/3`;
  document.getElementById('quiz-question').innerText = qData.question;
  document.getElementById('quiz-img').src = qData.img;

  const optionsDiv = document.getElementById('quiz-options');
  optionsDiv.innerHTML = '';

  qData.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'scrapbook-btn';
    btn.innerHTML = `<span>${opt}</span>`;
    btn.onclick = () => checkAnswer(index, btn);
    optionsDiv.appendChild(btn);
  });

  document.getElementById('quiz-feedback').classList.add('hidden');
}

function checkAnswer(selectedIndex, btnElement) {
  const qData = quizData[currentQuestion];
  const feedbackDiv = document.getElementById('quiz-feedback');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('next-q-btn');

  // Disable all buttons to prevent spam clicking
  const allBtns = document.getElementById('quiz-options').querySelectorAll('button');
  allBtns.forEach(b => b.disabled = true);

  feedbackDiv.classList.remove('hidden');

  if (selectedIndex === qData.correct) {
    btnElement.classList.add('correct-btn');
    feedbackTitle.innerText = "Correct! ✅";
    feedbackTitle.style.color = "#27ae60";
    feedbackText.innerText = qData.correctMsg;
    nextBtn.style.display = "inline-block";

    // Add extra hearts for correct answer
    for (let j = 0; j < 5; j++) {
      setTimeout(() => {
        const heartsContainer = document.getElementById('floating-hearts');
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = '💖';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = '3s';
        heart.style.fontSize = '25px';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 3000);
      }, j * 100);
    }

  } else {
    btnElement.classList.add('wrong-btn');
    document.getElementById('wrong-modal-msg').innerText = qData.wrongMsg;
    document.getElementById('wrong-modal').classList.add('active');
  }
}

function closeWrongModal() {
  document.getElementById('wrong-modal').classList.remove('active');
  const allBtns = document.getElementById('quiz-options').querySelectorAll('button');
  allBtns.forEach(b => {
    b.disabled = false;
    b.classList.remove('wrong-btn');
  });
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    // Scroll to top of quiz card when loading next question
    document.getElementById('scene-quiz').scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(loadQuestion, 300);
  } else {
    goToScene('scene-unlock');
  }
}


// ═══════════════════ LETTERS LOGIC ═══════════════════

const letterContents = [
  {
    title: "Happy B'day! 🎂",
    body: "Happy Birthday Sravanthi! 🎉 I can't believe how fast these 3 years of our degree went by. I wanted to do something unique instead of just a WhatsApp text, so I built this little corner of the internet just for us."
  },
  {
    title: "Our Friendship 💕",
    body: "From the first day of college till now, you've been my constant. Whether it was skipping classes, panicking before exams, or just talking for hours about random things... I cherish every moment. You are the best thing that happened to me in college."
  },
  {
    title: "Thank You 🌸",
    body: "Thank you for dealing with my drama, listening to my endless rants, and always being there when I needed a hug. Here's to surviving degree college and to a lifetime of friendship ahead. Love you always, Aswini. 💖"
  }
];

function openLetter(index) {
  const modal = document.getElementById('letter-modal');
  const heading = document.getElementById('letter-heading');
  const body = document.getElementById('letter-body');

  heading.innerText = letterContents[index].title;
  body.innerHTML = `<p>${letterContents[index].body}</p>`;

  modal.classList.add('show');
}

function closeLetter() {
  document.getElementById('letter-modal').classList.remove('show');
}

document.getElementById('letter-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeLetter();
  }
});


// ═══════════════════ STORY SLIDESHOW LOGIC ═══════════════════

let currentStorySlide = 0;
const totalStorySlides = 5;

function changeStory(direction) {
  // Hide current
  document.getElementById(`slide-${currentStorySlide}`).classList.remove('active');
  document.getElementById(`dot-${currentStorySlide}`).classList.remove('active');

  // Calculate next
  currentStorySlide += direction;
  if (currentStorySlide >= totalStorySlides) currentStorySlide = 0;
  if (currentStorySlide < 0) currentStorySlide = totalStorySlides - 1;

  // Show new
  document.getElementById(`slide-${currentStorySlide}`).classList.add('active');
  document.getElementById(`dot-${currentStorySlide}`).classList.add('active');
}
