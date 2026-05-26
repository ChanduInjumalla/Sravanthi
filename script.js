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

  // Pre-intro NO button logic — it runs away!
  const noBtn = document.getElementById('no-btn');
  const noMsg = document.getElementById('no-msg');
  const noMessages = [
    "Haha! Can't catch me! 😜",
    "Nope! Try again! 🏃‍♀️",
    "Too slow bestie! 😂",
    "You really thought? 💀",
    "Just press YES already! 🥺",
    "I'll keep running! 🏃‍♂️💨"
  ];
  let noClickCount = 0;
  if (noBtn) {
    const dodgeNoBtn = function (e) {
      e.preventDefault();
      e.stopPropagation();
      noClickCount++;

      // Show a funny message
      if (noMsg) {
        noMsg.classList.remove('show');
        void noMsg.offsetWidth;
        noMsg.innerText = noMessages[(noClickCount - 1) % noMessages.length];
        noMsg.classList.add('show');
      }

      // Move the button to a random position inside the card
      const card = document.querySelector('.pre-intro-card');
      if (card) {
        const cardRect = card.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        const maxX = cardRect.width - btnRect.width - 20;
        const maxY = cardRect.height - btnRect.height - 20;
        const randomX = Math.floor(Math.random() * maxX) - maxX / 2;
        const randomY = Math.floor(Math.random() * maxY) - maxY / 2;
        noBtn.style.position = 'relative';
        noBtn.style.transition = 'all 0.2s ease';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
      }
    };

    noBtn.addEventListener('click', dodgeNoBtn);
    noBtn.addEventListener('touchstart', dodgeNoBtn, {passive: false});
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

        // Hide global bows in photo section
        if (sceneId === 'scene-photos') {
          document.body.classList.add('hide-bows');
        } else {
          document.body.classList.remove('hide-bows');
        }

        // Trigger fireworks only on wishing scene
        if (sceneId === 'scene-wishing') {
          startFireworks();
        } else {
          clearInterval(fireworksInterval);
          const container = document.getElementById('fireworks-container');
          if (container) container.innerHTML = '';
        }
      }
    }, 150); // slight delay to allow fade out
  }, 100); // allow click animation to play
}

function startFireworks() {
  const container = document.getElementById('fireworks-container');
  if (!container) return;

  container.innerHTML = ''; // Clear any leftover elements

  const colors = ['#ff69b4', '#ff1493', '#ffcc00', '#00ffff', '#fffb00', '#ff5722', '#e91e63', '#9c27b0', '#00e676'];

  fireworksInterval = setInterval(() => {
    const startX = Math.random() * 100; // in vw
    const targetY = 15 + Math.random() * 45; // in vh (explode at 15% to 60% height)

    const rocket = document.createElement('div');
    rocket.className = 'firework-rocket';
    rocket.style.setProperty('--start-x', `${startX}vw`);
    rocket.style.setProperty('--target-y', `${targetY}vh`);

    container.appendChild(rocket);

    // After the rocket reaches the explosion point (0.8s), trigger explosion
    setTimeout(() => {
      rocket.remove();
      createExplosion(startX, targetY);
    }, 800);
  }, 500); // launch a new rocket every 500ms

  function createExplosion(xVw, yVh) {
    const numParticles = 16 + Math.floor(Math.random() * 8); // 16 to 24 particles
    const baseColor = colors[Math.floor(Math.random() * colors.length)];
    const secColor = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      particle.style.left = `${xVw}vw`;
      particle.style.top = `${yVh}vh`;

      // Distribute particles in a 360 degree explosion shell with random velocity
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 120; // travel distance
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);

      // 70% primary color, 30% accent color
      const chosenColor = Math.random() > 0.3 ? baseColor : secColor;
      particle.style.background = chosenColor;
      particle.style.boxShadow = `0 0 6px ${chosenColor}, 0 0 12px ${chosenColor}`;

      container.appendChild(particle);

      // Clean up particle after animation finishes (1.4s)
      setTimeout(() => {
        particle.remove();
      }, 1400);
    }
  }
}

// ═══════════════════ QUIZ LOGIC ═══════════════════

const quizData = [
  {
    question: "When is our friendship anniversary? 💕",
    img: "assets/girls-meet.png",
    options: [
      "22 Nov 2022",
      "22 Nov 2021",
      "21 Nov 2022"
    ],
    correct: 1 // 22 Nov 2021 is correct (2nd option)
  },
  {
    question: "What's our favourite thing to do together? 🍦",
    img: "assets/girls-laugh.png",
    options: [
      "Eating ice cream",
      "Sitting idle & watching reels",
      "Gossiping"
    ],
    correct: 0 // Eating ice cream is correct (1st option)
  },
  {
    question: "What's the most similar thing about us? 💪",
    img: "assets/girls-hug.png",
    options: [
      "Mad",
      "Crazy",
      "Acts brave"
    ],
    correct: 2 // Acts brave is correct (3rd option)
  }
];

let currentQuestion = 0;
let quizScore = 0;
let userAnswers = [];

function startQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  userAnswers = [];
  loadQuestion();
  goToScene('scene-quiz');
}

function loadQuestion() {
  const qData = quizData[currentQuestion];

  document.getElementById('quiz-title').innerText = `Question ${currentQuestion + 1}/3`;
  document.getElementById('quiz-question').innerText = qData.question;
  document.getElementById('quiz-img').src = qData.img;

  const optionsDiv = document.getElementById('quiz-options');
  optionsDiv.innerHTML = '';

  qData.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'scrapbook-btn';
    btn.innerHTML = `<span>${opt}</span>`;
    btn.onclick = () => selectQuizAnswer(index, btn);
    optionsDiv.appendChild(btn);
  });

  // Hide the feedback area (Next button) during questions
  document.getElementById('quiz-feedback').classList.add('hidden');
}

function selectQuizAnswer(selectedIndex, btnElement) {
  // Disable all buttons after selection
  const allBtns = document.getElementById('quiz-options').querySelectorAll('button');
  allBtns.forEach(b => b.disabled = true);

  // Highlight the selected button (neutral purple, no correct/wrong reveal)
  btnElement.style.background = 'rgba(179, 157, 219, 0.4)';
  btnElement.style.borderColor = '#9b59b6';
  btnElement.style.transform = 'scale(1.03)';

  // Record the answer
  const qData = quizData[currentQuestion];
  userAnswers.push(selectedIndex);
  if (selectedIndex === qData.correct) {
    quizScore++;
  }

  // Show the "Next" button
  const feedbackDiv = document.getElementById('quiz-feedback');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('next-q-btn');

  feedbackTitle.innerText = '';
  feedbackText.innerText = '';
  feedbackDiv.classList.remove('hidden');
  nextBtn.style.display = 'inline-block';

  if (currentQuestion < quizData.length - 1) {
    nextBtn.innerHTML = '<span>Next ➡️</span>';
    nextBtn.onclick = () => {
      currentQuestion++;
      document.getElementById('scene-quiz').scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(loadQuestion, 300);
    };
  } else {
    nextBtn.innerHTML = '<span>See Results 🎯</span>';
    nextBtn.onclick = () => {
      showQuizResults();
    };
  }
}

function showQuizResults() {
  const feedbackDiv = document.getElementById('quiz-feedback');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('next-q-btn');

  // Hide the question content
  document.getElementById('quiz-question').style.display = 'none';
  document.getElementById('quiz-options').style.display = 'none';
  document.querySelector('.quiz-card .character-wrap').style.display = 'none';

  document.getElementById('quiz-title').innerText = `Your Score: ${quizScore}/3`;

  feedbackDiv.classList.remove('hidden');

  if (quizScore === 3) {
    // PASSED — all correct!
    feedbackTitle.innerText = "Perfect Score! 🎉💕";
    feedbackTitle.style.color = "#27ae60";
    feedbackText.innerText = "You really do remember everything about us! You passed the bestie test! 🥺💖";
    nextBtn.innerHTML = '<span>Continue to Surprise ➡️</span>';
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = () => {
      // Reset quiz UI for next time
      resetQuizUI();
      goToScene('scene-unlock');
    };

    // Celebration hearts
    for (let j = 0; j < 10; j++) {
      setTimeout(() => {
        const heartsContainer = document.getElementById('floating-hearts');
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = ['💖', '🌸', '✨', '💕', '🎉'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = '3s';
        heart.style.fontSize = '25px';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 3000);
      }, j * 150);
    }
  } else {
    // FAILED — show punishment + retry
    feedbackTitle.innerText = "Oops! You Failed! 😢";
    feedbackTitle.style.color = "#e74c3c";
    feedbackText.innerHTML = `You got <strong>${quizScore}/3</strong> correct. You need <strong>3/3</strong> to pass!<br><br>` +
      `<span style="font-size: 1.3rem;">🍫 <strong>Punishment:</strong> You owe me a chocolate next time we meet!</span>`;
    nextBtn.innerHTML = '<span>Try Again 🔄</span>';
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = () => {
      resetQuizUI();
      startQuiz();
    };
  }
}

function resetQuizUI() {
  // Restore hidden elements for next attempt
  document.getElementById('quiz-question').style.display = '';
  document.getElementById('quiz-options').style.display = '';
  document.querySelector('.quiz-card .character-wrap').style.display = '';
}

function closeWrongModal() {
  document.getElementById('wrong-modal').classList.remove('active');
}

function nextQuestion() {
  // Legacy — no longer used but kept for safety
}

// ═══════════════════ LETTERS LOGIC ═══════════════════

const letterContents = [
  {
    title: "Happy B'day! 🎂",
    body: "Happy Birthday Sravanthi! 🎉🎂 I still can't believe how fast those 3 chaotic years of our degree went by! 🎓 I wanted to do something super unique instead of just a boring WhatsApp text, so I built this little corner of the internet just for you. Hope it puts the biggest smile on your beautiful face today! Here's to another beautiful year of you being you! 🥰💖"
  },
  {
    title: "Our Friendship 💕",
    body: "Dear Carrots,<br><br>I'm glad life helped you find a diamond like me in college. ♡<br>I hope you've received enough love in life… and if not, don't worry, I'll keep giving you more every single day.<br><br>I know the distance hurts sometimes, but distance can never separate hearts that truly care for each other. No matter how far we are, my love for you will always stay close. 🤍<br><br>— junnu 💕"
  },
  {
    title: "Thank You 🌸",
    body: "Thank you for being my absolute rock! 🌸 For putting up with my drama, listening to my late-night rants, and always being there whenever I needed a warm hug. College would have been so boring without you. Here's to surviving degree college and to a lifetime of friendship ahead. Love you to the moon and back! 💖✨"
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

// ═══════════════════ PHOTO VIEWER LOGIC ═══════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scatter-photo, .polaroid-frame').forEach(photoCard => {
    photoCard.style.cursor = 'pointer';
    photoCard.addEventListener('click', () => {
      const imgEl = photoCard.querySelector('.frame-img img');
      if (!imgEl) return;
      
      const viewerModal = document.getElementById('photo-viewer-modal');
      const viewerImg = document.getElementById('viewer-img');
      const frameEl = document.getElementById('viewer-frame');
      
      viewerImg.src = imgEl.src;
      
      // Reset all modal classes
      viewerImg.className = '';
      frameEl.classList.remove('modal-rotate-frame');
      
      // Apply correct rotation and zoom classes to remove baked-in gaps
      if (imgEl.classList.contains('rotate-fix')) {
        frameEl.classList.add('modal-rotate-frame');
        viewerImg.classList.add('modal-rotate-fix');
      }
      if (imgEl.classList.contains('pure-chaos-fix')) {
        viewerImg.classList.add('modal-chaos-fix');
      }
      if (imgEl.classList.contains('zoom-1')) {
        viewerImg.classList.add('modal-zoom-1');
      }
      if (imgEl.classList.contains('zoom-2')) {
        viewerImg.classList.add('modal-zoom-2');
      }
      
      viewerModal.classList.add('active');
    });
  });
});

function closePhotoModal() {
  document.getElementById('photo-viewer-modal').classList.remove('active');
}
