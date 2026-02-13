const questions = [
  "If you’re angry, would you like me to be the one who calms you down?",
  "And sometimes, would it be okay if I tease you a little just to see you smile later?",
  "Would you let me cook your favourite biryani for you, just because you had a long day?",
  "Would you like me to surprise you with sunflowers, even when there’s no special reason?",
  "Would you enjoy sitting by the seashore with me, watching the sunset in silence?",
  "If one day could repeat, could I have more days like January 17, 2026 with you?",
  "Would you like to watch a movie with me in a theatre sometime?"
];

let index = 0;
let noClicks = 0;
let canSwap = true;
let positionsLocked = false;
let yesLockedX = 0;
let noLockedX = 0;
let biryaniYesCount = 0;
let sunflowerCount = 0;
const MAX_SUNFLOWERS = 90; // 7 clicks × 2 flowers
let seaSinkStep = 0;
let flipped = false;

const q = document.getElementById("question");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const popup = document.getElementById("biryaniPopup");
const biryaniText = document.getElementById("biryaniText");
const biryaniYes = document.getElementById("biryaniYes");
const biryaniNo = document.getElementById("biryaniNo");
const questionImage = document.getElementById("questionImage");
const imageOptions = document.getElementById("imageOptions");
const imgYes = document.getElementById("imgYes");
const imgNo = document.getElementById("imgNo");
const imgNoCard = document.getElementById("imgNoCard");
const startBtn = document.getElementById("startBtn");
const introCard = document.getElementById("introCard");
const questionCard = document.getElementById("questionCard");

startBtn.onclick = () => {
  // Hide intro card, show question card
  introCard.classList.add("hidden");
  questionCard.classList.remove("hidden");

  // Play the music (this is triggered by a user click!)
  const music = document.getElementById("bgMusic");
  music.volume = 0.4;

  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      console.log("Audio blocked, try again on next user interaction");
    });
  }
};

q.innerText = questions[index];

yes.onclick = yesAction;
no.onclick = noAction;

function yesAction() {

  // If already at last question → show image options
  if (index === questions.length - 1) {
    showImageQuestion();
    return;
  }

  index++;
  q.innerText = questions[index];

  // If the new question is the 7th one → show images
  if (index === questions.length - 1) {
    showImageQuestion();
    return;
  }

  resetButtons();
}

function lockButtonPositions() {
  const container = document.querySelector(".buttons");

  const containerRect = container.getBoundingClientRect();
  const yesRect = yes.getBoundingClientRect();
  const noRect  = no.getBoundingClientRect();

  yesLockedX = yesRect.left - containerRect.left;
  noLockedX  = noRect.left  - containerRect.left;

  yes.style.left = yesLockedX + "px";
  no.style.left  = noLockedX + "px";

  positionsLocked = true;
}

function showBiryaniPopup() {
  // 🔁 FULL RESET
  biryaniYesCount = 0;

  biryaniText.innerText = "Are you sure it’s biryani?";
  biryaniYes.innerText = "Yes";

  // safety reset (important)
  biryaniYes.style.pointerEvents = "auto";
  biryaniNo.style.pointerEvents = "auto";

  popup.classList.remove("hidden");
}

function closeBiryaniPopup() {
  popup.classList.add("hidden");
}

function noAction() {
  if (index === 2) {
    showBiryaniPopup();
    return;
  }

  if (index === 3) {
    coverNoWithSunflowers();
    return;
  }

  if (index === 5) {
    slideNoText();   // 👈 ONLY HERE
    return;
  }

  switch (index) {
    case 1:
      gradualYesMerge();
      break;
    case 4:
      slowEscape();
      break;
    case 6:
      showImageQuestion();
      break;
  }
}

biryaniYes.onclick = () => {
  // 🍛 FINAL YES → behave like Think Again
  if (biryaniYes.innerText === "Hyderabadi Biryani 🤤") {
    closeBiryaniPopup(); // go back to 3rd question
    return;
  }

  biryaniYesCount++;

  if (biryaniYesCount > 3) {
    biryaniText.innerText = "Are you sure it’s biryaniiii?";
    biryaniYes.innerText = "Hyderabadi Biryani 🤤";
    return;
  }

  biryaniText.innerText =
    "Are you sure it’s biryani" + "i".repeat(biryaniYesCount) + "?";
};

biryaniNo.onclick = () => {
  // go back to SAME third question
  popup.classList.add("hidden");
  q.innerText = questions[2];
};

function updateBiryaniText() {
  let text = "Are you sure it’s biryani";
  if (biryaniYesCount > 0) {
    text += "i".repeat(biryaniYesCount);
  }
  text += "?";
  biryaniText.innerText = text;
}

function gradualYesMerge() {

  // Lock positions once
  if (!positionsLocked) {
    lockButtonPositions();
  }

  const yesRect = yes.getBoundingClientRect();
  const noRect  = no.getBoundingClientRect();

  let yesLeft = parseFloat(yes.style.left);
  const yesWidth = yesRect.width;

  const yesRight = yesLeft + yesWidth;
  const noRight  = noLockedX + noRect.width;

  // ✅ FULLY COVERED
  if (yesRight >= noRight) {

    // Snap perfectly aligned
    yes.style.left = (noRight - yesWidth) + "px";

    no.style.opacity = "0";
    no.style.pointerEvents = "none";
    yes.style.zIndex = "10";

    return;
  }

  // 🔥 Faster movement
  const STEP_PX = 115;  // Increase for fewer clicks (20–35 is good range)

  yes.style.transition = "left 0.15s ease";
  yes.style.left = (yesLeft + STEP_PX) + "px";
}

document.addEventListener("mousemove", (e) => {
  if (index !== 0) return;

  const rect = no.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const distance = Math.hypot(e.clientX - cx, e.clientY - cy);

  const ENTER_RADIUS = 140;
  const EXIT_RADIUS = 220;

  if (distance < ENTER_RADIUS && canSwap) {
    swapButtons();
    canSwap = false;
  }

  if (distance > EXIT_RADIUS) {
    canSwap = true;
  }
});

function swapButtons() {
  const yesLeft = yes.style.left || "20%";
  const noLeft = no.style.left || "60%";

  yes.style.left = noLeft;
  no.style.left = yesLeft;
} 

function coverNoWithSunflowers() {
  if (sunflowerCount >= MAX_SUNFLOWERS) {
    no.style.pointerEvents = "none"; // 🚫 inactive
    no.style.cursor = "default";     // optional UX
    return;
  }

  const noRect = no.getBoundingClientRect();

  for (let i = 0; i < 2; i++) {
    const sun = document.createElement("span");
    sun.className = "no-sunflower";
    sun.innerText = "🌻";

    // random spread inside NO button
    const x = Math.random() * (noRect.width - 22);
    const y = Math.random() * (noRect.height - 22);
    const rotation = Math.random() * 360;
    const scale = 0.7 + Math.random() * 0.6;

    sun.style.left = `${x}px`;
    sun.style.top = `${y}px`;
    sun.style.setProperty("--rot", `${rotation}deg`);
    sun.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

    no.appendChild(sun);
  }

  sunflowerCount += 2;
}

function resetButtons() {
  yes.style.transition = "none";
  yes.style.transform = "none";
  yes.innerText = "Yes";
  no.style.opacity = "1";
  no.style.pointerEvents = "auto";
  no.innerHTML = `
    <span class="no-text">No</span>
    <span class="no-replace">More like 17th’s</span>
  `;
  sunflowerCount = 0;
  seaSinkStep = 0;
  no.style.bottom = "auto";
  no.style.top = "auto";
  no.style.transform = "translateY(0)";
  no.style.pointerEvents = "auto";
  no.style.cursor = "pointer";     
  yes.style.left = "20%";
  no.style.left = "60%";
  no.style.width = "130px";
  const noText = no.querySelector(".no-text");
  const replaceText = no.querySelector(".no-replace");
  document.querySelector(".buttons").style.display = "block";
  document.querySelector(".card").classList.remove("with-image");
  noText.style.opacity = "1";
  noText.style.transform = "translate(-50%, -50%)";
  replaceText.style.opacity = "0";
  replaceText.style.transform = "translate(120%, -50%)";
  positionsLocked = false;
  canSwap = true;
  q.innerText = questions[index];
  // Restore buttons if coming back
  // document.querySelector(".buttons").style.display = "block";
  questionImage.classList.add("hidden");
  imageOptions.classList.add("hidden");
  yes.style.display = "inline-block";
  no.style.display = "inline-block";
}

function yesCoversNo() {
  const noRect = no.getBoundingClientRect();
  const yesRect = yes.getBoundingClientRect();

  const dx = noRect.left - yesRect.left;
  const dy = noRect.top - yesRect.top;

  yes.style.transition = "transform 1.2s ease-in-out";
  no.style.transition = "opacity 0.5s ease";

  yes.style.transform = `translate(${dx}px, ${dy}px) scale(1.7)`;

  setTimeout(() => {
    no.style.opacity = "0";
  }, 900);
}

function yesMovesTowardNo() {
  yes.style.left = "45%";
}

function slowEscape() {
  seaSinkStep++;

  no.style.transition = "transform 0.6s ease-in";

  // each click moves it down more
  const moveY = seaSinkStep * 100;

  no.style.transform = `translateY(${moveY}px)`;

  // once fully sunk → disable clicks
  if (moveY > window.innerHeight * 0.5) {
    no.style.pointerEvents = "none";
  }
}

function slideNoText() {
  const noText = no.querySelector(".no-text");
  const replaceText = no.querySelector(".no-replace");

  if (replaceText.style.opacity === "1") {
    index++;
    q.innerText = questions[index];
    resetButtons();

    if (index === 6) {
      showImageQuestion();
    }

    return;
  }
  // slide out left
  noText.style.transform = "translate(-160%, -50%)";
  noText.style.opacity = "0";

  // slide in center
  replaceText.style.transform = "translate(-50%, -50%)";
  replaceText.style.opacity = "1";

  no.style.pointerEvents = "auto";
}

function showImageQuestion() {

  // Hide full button container (not just buttons)
  document.querySelector(".buttons").style.display = "none";

  // Add floating spacing class
  document.querySelector(".card").classList.add("with-image");

  questionImage.classList.remove("hidden");
  imageOptions.classList.remove("hidden");
}

imgYes.onclick = () => {
  // If no image already flipped → go to end
  showEnd();
};

imgNoCard.onclick = () => {

  if (!flipped) {
    flipped = true;
    imgNoCard.classList.add("flipped");

    // disable further transform animations
    setTimeout(() => {
      imgNoCard.querySelector(".flip-inner").style.transition = "none";
    }, 600);

    return;
  }

  showEnd();
};

function showEnd() {

  questionCard.classList.add("hidden");
  introCard.classList.remove("hidden");

  introCard.innerHTML = `
    <div class="end-message">

      <!-- Sunflowers at the top -->
      <div style="text-align:center; margin-bottom: 15px;">
        <span style="display:inline-block; transform: rotate(45deg); font-size:40px;">🌻</span>
        <span style="display:inline-block; transform: rotate(0deg); font-size:40px; margin-left:-25px;">🌻</span>
      </div>


      <p>
        I can see you like the fish below, watching the starfish from far away.
        But if we were two sunflowers, I would still turn toward you
        even if every other sunflower turns toward the sun.
      </p>

      <p>
        It’s not just about liking you.
        I want to live this life with you.
        Maybe just a small place in your heart
        even half is enough for me.
      </p>

      <p>
        We might be different. I may not know everything you like or dislike yet.
        But I will ask. I will learn.
        And I will try to do those things for you all my life.
      </p>

      <p>
        You know I can change,
        I can do anything for you,
        except leave you.
        I want you to be strong about us.
      </p>

      <p>
        I don’t know why I like you,
        because I <strong>_ _ _ _</strong> you.
        And that doesn’t need a reason. 
        I just want to be yours.
      </p>

      <p style="margin-top:25px; font-weight:600;">
        The blank is there because I want to say it while looking into your eyes.
        <br>
        Let’s meet.
      </p>
    </div>
  `;

}
