"use strict";
// dom elements
const box1 = document.querySelector(".box");
const box2 = document.querySelector(".box1");
const item = document.querySelector(".item");
const body = document.querySelector("body");
const con = document.querySelector(".container");
const score = document.querySelector(".score");
const stage = document.querySelector(".stage");
const btnStart = document.querySelector(".btn-str");
const btnReset = document.querySelector(".btn-reset");
const btnPasue = document.querySelector(".btn-pause");
const joystic = document.querySelector(".btn-container_grid");
const timerSW = document.querySelector(".timer");
const activeState = document.querySelector(".Bonus_State");
const timerBonus = document.querySelector(".timerBonus");
//variables

const box1Speed = 10;
const box2Speed = 1;
const box1SpeedMobile = 40;
const interTimeChange = 20;
const ChangeDir = 100;

const bonusTimeEnd = 20000;
const inters = null;
const screenWidth = 1200;
const bonusTimeAding = 7;
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
let tfReset;
let numQ;
let sec;
let min;

////////////////////////////////////////////////////////////////////////////////////////////////////////////

reset();

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

//calculate the borders
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

//remove addEvent

function removeAddEvent() {
  document.addEventListener("keydown", move);
  joystic.addEventListener("mousedown", moveJoy);
}

//random a number
function mathRandom(min, max) {
  return Math.trunc(min + Math.random() * (max - min));
}
// random the reletive pos to box
function reletiveToBox(pos) {
  return mathRandom(0, 2) === 1
    ? pos + mathRandom(100, 150)
    : pos - mathRandom(100, 150);
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

  if (box2Y < 0) checkDOU = !checkDOU;
  else if (box2Y > con.offsetHeight - box2.offsetHeight - speedBox2)
    checkDOU = !checkDOU;
  else if (box2X > con.offsetWidth - box2.offsetWidth - speedBox2)
    checkDOU = !checkDOU;
  else if (box2X < 0) checkDOU = !checkDOU;

  if (countRound === whenChangeDir) {
    countRound = 0;
    numQ = mathRandom(1, 3);
  }
  if (numQ === 1) box2X += changeDir(speedBox2);
  else if (numQ === 2) box2Y += changeDir(speedBox2);
  else if (numQ === 3) {
    box2X += changeDir(speedBox2);
    box2Y += changeDir(speedBox2);
  } else box2Y += changeDir(speedBox2);
  box2.style.transform = `translate(${box2X}px, ${box2Y}px) `;
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
//joystic play in smartphone
function moveJoy(e) {
  e.preventDefault();
  if (exitFunction()) return;
  const btn = e.target;
  if (!btn.classList.contains("btn")) return;
  if (btn.classList.contains("btn-right"))
    if (box1RL < calMarginWidth() - speedBoxM + 5)
      box1.style.transform = `translate(${(box1RL +=
        speedBoxM)}px, ${box1TD}px) `;

  if (btn.classList.contains("btn-left"))
    if (box1RL > speedBoxM - 5)
      box1.style.transform = `translate(${(box1RL -=
        speedBoxM)}px, ${box1TD}px) `;

  if (btn.classList.contains("btn-up"))
    if (box1TD > speedBoxM - 5)
      box1.style.transform = `translate(${box1RL}px, ${(box1TD -=
        speedBoxM)}px) `;

  if (btn.classList.contains("btn-down"))
    if (box1TD < calMarginHeight() - speedBoxM + 5)
      box1.style.transform = `translate(${box1RL}px, ${(box1TD +=
        speedBoxM)}px) `;

  itemPlay();
}

//change the pos of item randomaly
function itemChangePos() {
  itemX = reletiveToBox(calMarginWidth() / 2);
  itemY = reletiveToBox(calMarginHeight() / 2);
  item.style.transform = `translate(${itemX}px, ${itemY}px) `;
}

//item-playing
function itemPlay() {
  if (check(box1RL, box1TD, itemX, itemY)) {
    itemChangePos();
    scorePoints += pointAdd;
    counterStage += pointAdd;
    score.textContent = `Score : ${scorePoints}`;
    changeStage();
    countBonusTime++;
  }

  if (!bonusEx && countBonusTime > 1 && scorePoints % bonusTimeAding === 0) {
    bonus();
  }
}

//reset the Bonus Terms
function resetBonusTerms() {
  countBonusTime = 0;
  bonusEx = true;
}

// give the player bonus if he eat the item by random a number 1-2(Invisiable or number of points )
function bonus() {
  item.classList.add("item_bonus");
  const randomBonus = mathRandom(1, 3);

  if (randomBonus === 1) {
    pointAdd = stageLevel + 1;
    item.textContent = `+${pointAdd}P`;
    resetBonusTerms();
  } else if (randomBonus === 2) {
    pointAdd = 1;
    item.textContent = `💫: O`;
    setTimeout(() => (item.textContent = `+${pointAdd}P`), 3000);
    box1.style.opacity = "0.6";
    resetBonusTerms();
    bonusInvisiable = true;
  }

  activeState.textContent = `Active-Bonus:${
    randomBonus === 1 ? "+" + pointAdd + "p" : "Invisiable"
  } 
`;

  callBonusT();

  //timeout clear and finish
  const timeOut = setTimeout(function () {
    if (!tfPauseGame) {
      countBonusTime = 0;
      pointAdd = 1;
      bonusInvisiable = false;
      bonusEx = !bonusEx;
      item.classList.remove("item_bonus");
      item.textContent = `+${1}P`;
      box1.style.opacity = "1";
      activeState.textContent = `Active-Bonus: none`;
      clearTimeout(timeOut);
      clearBonusTimer();
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
    stageLevel++;
    speedBox2 += 1;
    stage.textContent = `Stage  ${stageLevel}`;
    counterStage = 0;
  }
  if (stageLevel % 50 === 0) {
    body.style.backgroundColor = `rgba(${mathRandom(0, 255)},${mathRandom(
      0,
      255
    )},${mathRandom(0, 255)},0.${mathRandom(6, 9)})`;
    changeColor;
  }
}

// pause key function
function pauseKey(e) {
  e.preventDefault();
  if (e.key === "s" || e.key === "S") tfPauseGame = !tfPauseGame;
}

// pause button function
function pauseButton(e) {
  e.preventDefault();

  if (e.target.classList.contains("btn-pause")) tfPauseGame = !tfPauseGame;
}

//end game
function endGame() {
  clearInterval(interBox2);
  alert("gameOVER!");

  tfPauseGame = true;
}

//start the game
function play() {
  reset();
  box2.classList.remove("hidden");
  item.classList.remove("hidden");
  interBox2 = setInterval(box2Run, interTime);
  document.addEventListener("keydown", move);
  joystic.addEventListener("mousedown", moveJoy);
  timerRun();
  timer = setInterval(timerRun, 1000);
  clearBonusTimer();
  tfReset = false;
  if (window.screen.width < screenWidth) {
    joystic.classList.remove("hidden_Opc");
  }
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
  box1.style.opacity = "1";
  item.style.transform = `translate(${itemX}px, ${itemY}px) `;
  item.textContent = `+${pointAdd}P`;
  timerSW.textContent = ` ${min}:${sec}`;
  activeState.textContent = `Active-Bonus: none`;

  joystic.classList.add("remove_btn");
  joystic.classList.add("hidden_Opc");
  box2.classList.add("hidden");
  item.classList.add("hidden");

  removeAddEvent();
  clearBonusTimer();
  clearInterval(interBox2);
  changeColor();
  tfReset = true;
}

//game actions
btnStart.addEventListener("click", play);
btnReset.addEventListener("click", reset);
document.addEventListener("keydown", pauseKey);
btnPasue.addEventListener("click", pauseButton);
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
// box1.addEventListener("touchmove", touchMove);
// document.addEventListener("touchmove", touchMove);
// let c = 0;
// function touchMove(e) {
//   let touch = e.touches[0];
//   console.log(e.touches[0]);
//   // let touch = e;
//   let touchX = Math.trunc(touch.clientX);
//   let touchY = Math.trunc(touch.clientY);
//   // let posL = box1RL;
//   // let posR = 0;
//   // let posU = box1TD;
//   // let posD = 0;
//   let posRLB = box1RL;

//   let posUDB = box1TD;
//   console.log(`move: ${c++}`);
//   console.log(" ");
//   console.log("touchX:", touchX, "touchY:", touchY);
//   console.log(" ");
//   console.log("box1:", "box1RL:", box1RL, "box1TD", box1TD);

//   console.log(" ");
//   // console.log(
//   //   "currentPos",
//   //   "posL",
//   //   posL,
//   //   "posR",
//   //   posR,
//   //   "posU",
//   //   posU,
//   //   "posD",
//   //   posD
//   // );

//   // move Left
//   if (touchX < posRLB)
//     if (box1RL > 2) {
//       // posL = touchX;
//       posRLB = touchX;

//       box1.style.transform = `translate(${(box1RL -=
//         speedBox1)}px, ${box1TD}px) `;
//     }

//   // move right

//   if (touchX > posRLB)
//     if (box1RL < calMarginWidth() * 0.98) {
//       // posR = touchX;
//       posRLB = touchX;
//       box1.style.transform = `translate(${(box1RL +=
//         speedBox1)}px, ${box1TD}px) `;
//     }

//   //moveUp
//   if (touchY < posUDB)
//     if (box1TD > 0) {
//       // posU = touchY;
//       posUDB = touchY;
//       box1.style.transform = `translate(${box1RL}px, ${(box1TD -=
//         speedBox1)}px) `;
//     }

//   // move down
//   if (touchY > posUDB)
//     if (box1TD < calMarginHeight() * 0.98) {
//       // posD = touchY;
//       posUDB = touchY;
//       box1.style.transform = `translate(${box1RL}px, ${(box1TD +=
//         speedBox1)}px) `;
//     }
//   console.log(" ");
//   // console.log(
//   //   "currentPos",
//   //   "posL",
//   //   posL,
//   //   "posR",
//   //   posR,
//   //   "posU",
//   //   posU,
//   //   "posD",
//   //   posD
//   // );
// }
