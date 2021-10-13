"use strict";
// dom elements
const box1 = document.querySelector(".box");
const box2 = document.querySelector(".box1");
const item = document.querySelector(".item");
const body = document.querySelector("body");
const con = document.querySelector(".container");
const score = document.querySelector(".score");
const stage = document.querySelector(".stage");
const btnTopCon = document.querySelector(".btn-container");
const btnStart = document.querySelector(".btn-str");
const btnReset = document.querySelector(".btn-reset");
const btnPasue = document.querySelector(".btn-pause");
const btnShow = document.querySelector(".btn-show");

const timerSW = document.querySelector(".timer");
const activeState = document.querySelector(".Bonus_State");
const timerBonus = document.querySelector(".timerBonus");
const br = document.querySelectorAll(".Active-Bonus br");
const htmlTextJoyStick = `<div class="btn-container_grid">
<button class="btn btn-up">UP</button>
<button class="btn btn-right">Right</button><button class="btn btn-remove">↔</button>
<button class="btn btn-down">Down</button><button class="btn btn-left">Left</button>
</div>`;

let joystick;
let HideButton;
//variables

const box1Speed = 10;
const box2Speed = 1;
const box1SpeedMobile = 40;
const interTimeChange = 20;
const ChangeDir = 80;
const bonusTimeEnd = 10000;
const inters = null;
const screenWidth = 1200;
const bonusTimeAding = 7;
//touch setting variables

const conW = con.getBoundingClientRect().width;
const conH = con.getBoundingClientRect().height;
const conX = con.getBoundingClientRect().left;
const cony = con.getBoundingClientRect().top;
const boxW = box1.getBoundingClientRect().width;
const boxH = box1.getBoundingClientRect().height;
let box2W;
let box2H;
let itemW;
let itemH;
///////////////////////////////////////////////
let bonTimeEndCount = bonusTimeEnd / 1000;
let scorePoints = 0;
let stageLevel = 1;
let pointAdd = 1;
let countRound = 0;
let counterStage = 1;
let countBonusTime = 0;
let timerSec = 0;
let timer;
let bonusTimer;
let speedBox1;
let speedBox2;
let speedBoxM;
let interTime;
let whenChangeDir;
let interBox2;
let box2X;
let box2Y;
let box1RL;
let box1TD;
let itemX;
let itemY;
let tfEndGame = false;
let tfPauseGame = true;
let checkDOU = false;
let bonusInvisiable = false;
let bonusEx = false;
let resetActive = false;
let tfPlayGame = false;
let speedBonus = false;
let tfReset;
let numQ;
let sec;
let min;
let elEND;

let boxXEND;
let boxYEND;
let xEND;
let yEND;
let posXEND;
let posYEND;
let difXEND;
let difYEND;
////////////////////////////////////////////////////////////////////////////////////////////////////////////

reset();

//change the game to deckstop mode;
function desktopMode(str, size) {
  br.forEach((x) => (x.style.display = str));
  btnTopCon.style.marginTop = size;
  con.style.marginTop = size;
}

(window.screen.width > 1200 && desktopMode("none", "1rem")) ||
  (desktopMode("block", "0rem") && reset());

//set the game's timer run
function timerRun() {
  if (tfPauseGame) return;
  timerSec++;
  sec = Math.trunc(timerSec % 60)
    .toString()
    .padStart(2, 0);
  min = Math.trunc(timerSec / 60)
    .toString()
    .padStart(2, 0);
  timerSW.textContent = ` ${min}:${sec}`;
}

function exitFunction() {
  return tfReset || tfPauseGame || tfEndGame;
}

//change diraction
function changeDir(n) {
  return checkDOU ? n : -n;
}
//play audio function;
function audioPlay(src) {
  let audio = new Audio("./audio/" + src);
  audio.play();
}

//calculate the postion of the borders relative to the current pos
function calBorderBot(pos, box) {
  return pos + box.offsetHeight / 2;
}

function calBorderTop(pos, box) {
  return pos - box.offsetHeight / 2;
}

function calBorderLeft(pos, box) {
  return pos - box.offsetWidth / 2;
}

function calBorderRight(pos, box) {
  return pos + box.offsetWidth / 2;
}
//cal margin width and height  of the box reletive to the container

function calMarginWidth(box) {
  return con.offsetWidth - box.offsetWidth;
}

function calMarginHeight(box) {
  return con.offsetHeight - box.offsetHeight;
}

function calMarginWidth() {
  return con.offsetWidth - box1.offsetWidth;
}

function calMarginHeight() {
  return con.offsetHeight - box1.offsetHeight;
}

//random a number
function mathRandom(min, max) {
  return Math.trunc(min + Math.random() * (max - min));
}
// random the reletive pos to box
function reletiveToBox(pos) {
  return mathRandom(0, 2) === 1
    ? pos + mathRandom(75, 125)
    : pos - mathRandom(75, 125);
}

//change color
function changeColor() {
  box1.style.backgroundColor = `rgba(${mathRandom(0, 125)},${mathRandom(
    0,
    125
  )},${mathRandom(0, 125)},0.${mathRandom(6, 9)})`;

  box2.style.backgroundColor = `rgba(${mathRandom(125, 220)},${mathRandom(
    125,
    220
  )},${mathRandom(125, 220)},0.${mathRandom(6, 9)})`;

  item.style.backgroundColor = `rgba(${mathRandom(0, 200)},${mathRandom(
    0,
    200
  )},${mathRandom(0, 200)},0.${mathRandom(6, 9)})`;
}

//check if the postion of item is vaild
function checkPos(itemS, pos, conS) {
  if (pos <= 0) return 0;
  else if (pos >= conS - itemS) return conS - itemS;
  else return pos;
}

//check the movments
function check(X1, Y1, X2, Y2) {
  if (
    //CHECKING INTERSACTING BORDERS FORM THE LEFT OF B2
    (Math.abs(calBorderLeft(X1, box1) - calBorderLeft(X2, box2)) <=
      box1.offsetWidth &&
      ((calBorderBot(Y1, box1) > calBorderTop(Y2, box2) &&
        calBorderBot(Y1, box1) <= calBorderBot(Y2, box2)) ||
        (calBorderTop(Y1, box1) > calBorderTop(Y2, box2) &&
          calBorderTop(Y1, box1) <= calBorderBot(Y2, box2)))) ||
    //CHECKING INTERSACTING BORDERS FROM THE RIGHT  OF B2

    (Math.abs(calBorderRight(X1, box1) - calBorderRight(X2, box2)) <=
      box1.offsetWidth &&
      ((calBorderBot(Y1, box1) > calBorderTop(Y2, box2) &&
        calBorderBot(Y1, box1) <= calBorderBot(Y2, box2)) ||
        (calBorderTop(Y1, box1) > calBorderTop(Y2, box2) &&
          calBorderTop(Y1, box1) <= calBorderBot(Y2, box2)))) ||
    //CHECKING INTERSACTING BORDERS FROM THE TOP OF B2
    (Math.abs(calBorderTop(Y1, box1) - calBorderTop(Y2, box2)) <=
      box1.offsetHeight &&
      ((calBorderRight(X1, box1) > calBorderLeft(X2, box2) &&
        calBorderRight(X1, box1) <= calBorderRight(X2, box2)) ||
        (calBorderLeft(X1, box1) > calBorderLeft(X2, box2) &&
          calBorderLeft(X1, box1) < calBorderRight(X2, box2)))) ||
    //CHECKING INTERSACTING BORDERS FROM THE BOTTOM OF B2
    (Math.abs(calBorderBot(Y1, box1) - calBorderBot(Y2, box2)) <=
      box1.offsetHeight &&
      ((calBorderRight(X1, box1) > calBorderLeft(X2, box2) &&
        calBorderRight(X1, box1) <= calBorderRight(X2, box2)) ||
        (calBorderLeft(X1, box1) > calBorderLeft(X2, box2) &&
          calBorderLeft(X1, box1) < calBorderRight(X2, box2))))
  )
    return true;
  else return false;
}

//play the box2 movment
function box2Run() {
  if (tfPauseGame) return;
  if (!bonusInvisiable) tfEndGame = check(box1RL, box1TD, box2X, box2Y);

  if (tfEndGame) return endGame();
  countRound++;

  box2W = box2.getBoundingClientRect().width;
  box2H = box2.getBoundingClientRect().height;
  if (box2Y < 2) checkDOU = !checkDOU;
  else if (box2Y > con.offsetHeight - box2.offsetHeight - speedBox2 * 1.1)
    checkDOU = !checkDOU;
  else if (box2X > con.offsetWidth - box2.offsetWidth - speedBox2 * 1.1)
    checkDOU = !checkDOU;
  else if (box2X < 2) checkDOU = !checkDOU;

  //change the diraction according to the random num which decides the dircation;

  if (countRound === whenChangeDir) {
    countRound = 0;
    numQ = mathRandom(1, 6);
  }

  if (numQ === 1 || numQ === 2) box2X += changeDir(speedBox2);
  else if (numQ === 3 || numQ === 4) box2Y += changeDir(speedBox2);
  else if (numQ === 5) {
    box2X += changeDir(speedBox2);
    box2Y += changeDir(speedBox2);
  } else box2Y += changeDir(speedBox2);

  box2.style.transform = `translate(${checkPos(
    box2W,
    box2X,
    conW
  )}px, ${checkPos(box2H, box2Y, conH)}px) `;
}

//move the the active player by keyboard

function move(e) {
  e.preventDefault();
  if (exitFunction()) return;
  if (e.key === "ArrowRight")
    if (box1RL < calMarginWidth() - speedBox1)
      box1.style.transform = `translate(${(box1RL +=
        speedBox1)}px, ${box1TD}px) `;

  if (e.key === "ArrowLeft")
    if (box1RL > speedBox1)
      box1.style.transform = `translate(${(box1RL -=
        speedBox1)}px, ${box1TD}px) `;

  if (e.key === "ArrowUp")
    if (box1TD > speedBox1)
      box1.style.transform = `translate(${box1RL}px, ${(box1TD -=
        speedBox1)}px) `;

  if (e.key === "ArrowDown")
    if (box1TD < calMarginHeight() - speedBox1)
      box1.style.transform = `translate(${box1RL}px, ${(box1TD +=
        speedBox1)}px) `;

  itemPlay();
}
// joystick play in smartphone
function moveJoy(e) {
  e.preventDefault();
  if (exitFunction()) return;
  const btn = e.target;
  if (!btn.classList.contains("btn")) return;
  if (btn.classList.contains("btn-right"))
    // if (box1RL < calMarginWidth() - speedBoxM + 7)
    box1.style.transform = `translate(${checkPos(
      boxW,
      (box1RL += speedBoxM),
      conW
    )}px, ${checkPos(boxH, box1TD, conH)}px) `;
  else if (btn.classList.contains("btn-left"))
    // if (box1RL > speedBoxM - 7)
    box1.style.transform = `translate(${checkPos(
      boxW,
      (box1RL -= speedBoxM),
      conW
    )}px, ${checkPos(boxH, box1TD, conH)}px) `;
  else if (btn.classList.contains("btn-up"))
    // if (box1TD > speedBoxM - 7)
    box1.style.transform = `translate(${checkPos(
      boxW,
      box1RL,
      conW
    )}px, ${checkPos(boxH, (box1TD -= speedBoxM), conH)}px) `;
  else if (btn.classList.contains("btn-down"))
    // if (box1TD < calMarginHeight() - speedBoxM + 7)
    box1.style.transform = `translate(${checkPos(
      boxW,
      box1RL,
      conW
    )}px, ${checkPos(boxH, (box1TD += speedBoxM), conH)}px) `;

  itemPlay();
}

// // slide the box1 with touchmove
function touchEnd(e) {
  e.preventDefault();
  if (exitFunction()) return;

  elEND = e.changedTouches[0];

  boxXEND = 0;
  boxYEND = 0;
  xEND = elEND.pageX;
  yEND = elEND.pageY;

  posXEND = xEND - conX - elEND.radiusX * 2;
  posYEND = yEND - cony - elEND.radiusY * 2;
  difXEND = posXEND - boxXEND;
  difYEND = posYEND - boxYEND;

  box1RL = checkPos(boxW, difXEND, conW);

  box1TD = checkPos(boxH, difYEND, conH);

  box1.style.transform = `translate(${box1RL}px,
${box1TD}px)`;

  boxXEND = posXEND;
  boxYEND = posYEND;

  itemPlay();
}
function checkDif(pos1X, pos2X, X, pos1Y, pos2Y, Y) {
  if (pos1X <= X && pos2X >= X && pos1Y <= Y && pos2Y >= Y) return true;
}

//move by touch the box
function touch(e) {
  e.preventDefault();
  if (exitFunction()) return;
  let el = e.touches[0];

  let x = el.pageX;
  let y = el.pageY;
  let posX = x - conX - el.radiusX * 0.9;
  let posY = y - cony - el.radiusY * 0.9;

  box1RL = checkPos(boxW, posX, conW);
  box1TD = checkPos(boxH, posY, conH);
  box1.style.transform = `translate(${box1RL}px,${box1TD}px)`;
  itemPlay();
}

//item-playing
function itemPlay() {
  if (
    check(box1RL, box1TD, itemX, itemY) ||
    checkDif(boxXEND, posXEND, itemX, boxYEND, posYEND, itemY)
  ) {
    itemW = item.getBoundingClientRect().width;
    itemH = item.getBoundingClientRect().height;
    audioPlay("mixkit-game-ball-tap-2073.wav");
    itemChangePos();
    scorePoints += pointAdd;
    counterStage += pointAdd;
    score.textContent = `Score : ${scorePoints}`;
    changeStage();
    countBonusTime++;
  }

  if (!bonusEx && countBonusTime > 1 && scorePoints % bonusTimeAding === 0) {
    item.classList.add("item_bonus");
    bonus();
  }
}
//change the pos of item randomaly
function itemChangePos() {
  itemX = reletiveToBox(calMarginWidth() / 2);
  itemY = reletiveToBox(calMarginHeight() / 2);

  item.style.transform = `translate(${checkPos(
    itemW,
    itemX,
    conW
  )}px, ${checkPos(itemH, itemY, conH)}px) `;
}

//reset the Bonus Terms
function resetBonusTerms() {
  countBonusTime = 0;
  bonusEx = true;
}

// give the player bonus if he eat the item by random a number 1-2(Invisiable or number of points )
function bonus() {
  audioPlay("mixkit-extra-bonus-in-a-video-game-2045.wav");

  const randomBonus = mathRandom(1, 4);

  if (randomBonus === 1) {
    stageLevel < 5 ? (pointAdd = stageLevel + 1) : (pointAdd = 3);
    item.textContent = `+${pointAdd}P`;
    resetBonusTerms();
  } else if (randomBonus === 2) {
    item.textContent = `💫: O`;
    setTimeout(() => (item.textContent = `+${pointAdd}P`), 2000);
    box1.style.opacity = "0.6";
    resetBonusTerms();
    bonusInvisiable = true;
  } else if (randomBonus === 3) {
    newSpeedBox2 = speedBox2;
    speedBox2 = speedBox2 / stageLevel;
    speedBonus = true;
    resetBonusTerms();
  }

  activeState.textContent = `${
    randomBonus === 1
      ? "+" + pointAdd + "p"
      : randomBonus === 2
      ? "Invisiable"
      : " Box2 speed is slower" + stageLevel
  } `;

  callBonusT();

  //timeout clear and finish
  const timeOut = setTimeout(function () {
    if (!tfPauseGame) {
      countBonusTime = 0;
      pointAdd = 1;
      bonusInvisiable = false;
      speedBonus = false;
      speedBox2 = stageLevel + 1;
      bonusEx = !bonusEx;
      item.classList.remove("item_bonus");
      item.textContent = `+${1}P`;
      box1.style.opacity = "1";
      activeState.textContent = `Off`;
      clearBonusTimer();
      clearTimeout(timeOut);
    }
  }, bonusTimeEnd);
}

// set Bonus Timer
function callBonusT() {
  bonusTimerRun();
  bonusTimer = setInterval(bonusTimerRun, 1000);
  timerBonus.classList.remove("hidden_Opc");
}

function bonusTimerRun() {
  if (!tfPauseGame) timerBonus.textContent = `for: ${bonTimeEndCount--}`;
}

function clearBonusTimer() {
  clearInterval(bonusTimer);
  timerBonus.classList.add("hidden_Opc");
  bonTimeEndCount = bonusTimeEnd / 1000;
}

//change the stage of the player after 10 points
function changeStage() {
  if (counterStage >= 10) {
    audioPlay("level-completed.mp3");
    stageLevel++;
    if (!speedBonus && stageLevel % 4 === 0) speedBox2 += 0.5;

    stage.textContent = `Stage  ${stageLevel}`;
    counterStage = 0;
  }
  if (stageLevel > 5) whenChangeDir = 70;
  if ((scorePoints % 100 >= 0 && scorePoints % 100 < 2) && scorePoints >= 100) {
    body.style.backgroundColor = `rgba(${mathRandom(0, 255)},${mathRandom(
      0,
      255
    )},${mathRandom(0, 255)},0.${mathRandom(6, 9)})`;
    changeColor;
  }
}

// Show the joyStick button
function openJoystick() {
  btnShow.insertAdjacentHTML("afterend", htmlTextJoyStick);
  btnShow.classList.add("hidden");
  joystick = document.querySelector(".btn-container_grid");
  HideButton = document.querySelector(".btn-remove");
  HideButton.addEventListener("click", HideButtons);
  joystick.classList.remove("hidden");
  joystick.classList.remove("hidden_Opc");
  joystick.addEventListener("mousedown", moveJoy);
}
// Hide the joyStick button
function HideButtons() {
  joystick.classList.add("hidden");
  joystick.classList.add("hidden_Opc");
  joystick.removeEventListener("mousedown", moveJoy);
  btnShow.classList.remove("hidden");
}

// pause key function
function pauseKey(e) {
  e.preventDefault();
  if (e.key === "s" || e.key === "S") tfPauseGame = !tfPauseGame;
}

// pause button function
function pauseButton(e) {
  e.preventDefault();

  if (e.target.classList.contains("btn-pause")) {
    tfPauseGame = !tfPauseGame;
    if (!tfEndGame && tfPlayGame) {
      e.target.dataset.start =
        e.target.dataset.start === "Pause"
          ? "Resume"
          : e.target.dataset.start === "Resume" && "Pause";
      e.target.textContent = `${e.target.dataset.start} Game`;
    }
  }
}

//end game
function endGame() {
  audioPlay("Disappoint-fail-timpani-crash-sound-effect.mp3");
  clearInterval(interBox2);
  alert("gameOVER!");
  tfPauseGame = true;
}

//start the game
function play() {
  reset();
  audioPlay("success-sound-effect.mp3");
  box2.classList.remove("hidden");
  item.classList.remove("hidden");
  interBox2 = setInterval(box2Run, interTime);
  document.addEventListener("keydown", move);
  timerRun();
  timer = setInterval(timerRun, 1000);
  clearBonusTimer();
  tfReset = false;
  tfPlayGame = true;
  if (window.screen.width < screenWidth) {
    box1.addEventListener("touchend", touchEnd);
    box1.classList.add("box_transition");
  } else desktopMode("none", "1rem");
}

//reset the game
function reset() {
  speedBox1 = box1Speed;
  speedBox2 = box2Speed;
  speedBoxM = box1SpeedMobile;
  interTime = interTimeChange;
  whenChangeDir = ChangeDir;
  tfEndGame = false;
  checkDOU = false;
  tfPauseGame = false;
  bonusInvisiable = false;
  bonusEx = false;
  tfPlayGame = false;
  pointAdd = 1;
  countBonusTime = 0;
  scorePoints = 0;
  stageLevel = 1;
  counterStage = 0;
  min = "00";
  sec = "00";
  timerSec = 0;
  clearInterval(timer);
  box1RL = calMarginWidth() / 2;
  box1TD = calMarginHeight() / 2;
  box2X = reletiveToBox(box1RL);
  box2Y = reletiveToBox(box1TD);
  itemX = reletiveToBox(box1RL);
  itemY = reletiveToBox(box1TD);
  score.textContent = `Score : ${scorePoints}`;
  stage.textContent = `Stage  ${stageLevel}`;
  box2.style.transform = `translate(${box2X}px, ${box2Y}px`;
  box1.style.transform = `translate(${calMarginWidth() / 2}px, ${
    calMarginHeight() / 2
  }px) `;
  body.style.backgroundColor = "inherit";
  box1.style.opacity = "1";
  item.style.transform = `translate(${itemX}px, ${itemY}px) `;
  item.textContent = `+${pointAdd}P`;
  timerSW.textContent = ` ${min}:${sec}`;
  activeState.textContent = `Off`;
  btnPasue.textContent = "Pasue Game";
  btnPasue.dataset.start = "Pause";
  box2.classList.add("hidden");
  item.classList.add("hidden");
  item.classList.remove("item_bonus");
  box1.classList.remove("box_transition");
  document.addEventListener("keydown", move);
  clearBonusTimer();
  clearInterval(interBox2);
  changeColor();
  tfReset = true;
}

//game actions
document.addEventListener("DOMContentLoaded", function () {
  alert(" ©Copyright 2021 by Rom Orlovich .All Rights Reserved ");
});
box1.addEventListener("touchmove", touch);
btnStart.addEventListener("click", play);
document.addEventListener("keydown", pauseKey);
btnPasue.addEventListener("click", pauseButton);
btnReset.addEventListener("click", reset);
btnShow.addEventListener("click", openJoystick);
//checking:
//   console.log(
//     "cube1:",
//     "right:",
//     calBorderRight(box1RL, box1),
//     "left:",
//     calBorderLeft(box1RL, box1),
//     "top:",
//     calBorderTop(box1TD, box1),
//     "bottom:",
//     calBorderBot(box1TD, box1),
//     "cube2:",
//     "right:",
//     calBorderRight(box2X, box2),
//     "left:",
//     calBorderLeft(box2X, box2),
//     "top:",
//     calBorderTop(box2Y, box2),
//     "bottom:",
//     calBorderBot(box2Y, box2)
//   );

//   console.log(
//     "cube1",
//     box1RL,
//     box1TD,

//     "cube2",
//     box2X,
//     box2Y
//   );
// console.log(
//   "width:",
//   con.offsetWidth,
//   "height:",
//   con.offsetHeight,
//   "width:",
//   body.offsetWidth,
//   "height:",
//   body.offsetHeight
// );

// console.log(
//   "min-width:",
//   body.offsetWidth - con.offsetWidth,
//   "max-width",
//   con.offsetWidth,
//   "min-height:",
//   calBorderBot(con.offsetHeight / 2, con),
//   "max-height",
//   body.offsetHeight / 2 - con.offsetHeight / 2
// );
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//
