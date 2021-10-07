"use strict";
const box1 = document.querySelector(".box");
const box2 = document.querySelector(".box1");
const item = document.querySelector(".item");
const con = document.querySelector(".container");
const btnStart = document.querySelector(".btn-str");
const btnReset = document.querySelector(".btn-reset");

// const posBox = 0;
let whenChangeDir = 25;
let inter;
let box2X;
let box2Y;
let box1RL;
let box1TD;
let itemX;
let itemY;
let speedBox1 = 10;
let speedBox2 = 2;
let interTime = 100;
let tf = false;
let checkDOU = false;
let numQ;

let countRound = 0;
reset();
console.log(mathRandom(0, 1));

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

//random a number
function mathRandom(min, max) {
  return Math.trunc(min + Math.random() * (max - min));
}
//change color
function changeColor() {
  box1.style.backgroundColor = `rgba(${mathRandom(0, 255)},${mathRandom(
    0,
    255
  )},${mathRandom(0, 255)},0.${mathRandom(6, 9)})`;

  box2.style.backgroundColor = `rgba(${mathRandom(0, 255)},${mathRandom(
    0,
    255
  )},${mathRandom(0, 255)},0.${mathRandom(6, 9)})`;

  item.style.backgroundColor = `rgba(${mathRandom(0, 255)},${mathRandom(
    0,
    255
  )},${mathRandom(0, 255)},0.${mathRandom(6, 9)})`;
}

//play the box2 movment

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
//box 2 run and move;
function box2Run() {
  tf = check(box1RL, box1TD, box2X, box2Y);
  if (tf) return endGame();
  countRound++;

  if (box2Y < 0) checkDOU = !checkDOU;
  else if (box2Y > con.offsetHeight - box2.offsetHeight) checkDOU = !checkDOU;
  else if (box2X > con.offsetWidth - box2.offsetWidth) checkDOU = !checkDOU;
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
  if (!tf) {
    console.log(box1RL, box1TD);
    if (e.key === "ArrowRight")
      if (box1RL < calMarginWidth() * 0.98)
        box1.style.transform = `translate(${(box1RL +=
          speedBox1)}px, ${box1TD}px) `;
    if (e.key === "ArrowLeft")
      if (box1RL > 2)
        box1.style.transform = `translate(${(box1RL -=
          speedBox1)}px, ${box1TD}px) `;

    if (e.key === "ArrowUp")
      if (box1TD > 0)
        box1.style.transform = `translate(${box1RL}px, ${(box1TD -=
          speedBox1)}px) `;
    if (e.key === "ArrowDown")
      if (box1TD < calMarginHeight() * 0.98)
        box1.style.transform = `translate(${box1RL}px, ${(box1TD +=
          speedBox1)}px) `;
  }
}
function calMarginWidth() {
  return con.offsetWidth - box1.offsetWidth;
}

function calMarginHeight() {
  return con.offsetHeight - box1.offsetHeight;
}

//reset the game
function reset() {
  box2.classList.add("hidden");
  whenChangeDir = whenChangeDir;
  box1RL = calMarginWidth() / 2;
  box1TD = calMarginHeight() / 2;
  box2X =
    mathRandom(0, 2) === 1
      ? box1RL + mathRandom(100, 150)
      : box1RL - mathRandom(100, 150);
  box2Y =
    mathRandom(0, 2) === 1
      ? box1TD + mathRandom(100, 150)
      : box1TD - mathRandom(100, 150);
  itemX = mathRandom(0, 400);
  itemY = mathRandom(0, 400);
  tf = false;
  checkDOU = false;
  clearInterval(inter);
  box2.style.transform = `translate(${mathRandom(1, 430)}px, ${mathRandom(
    1,
    430
  )}px`;
  box1.style.transform = `translate(${
    (con.offsetWidth - box1.offsetWidth) / 2
  }px, ${(con.offsetHeight - box1.offsetHeight) / 2}px) `;
  item.style.transform = `translate(${itemX}px, ${itemY}px) `;
  changeColor();
}

//end game
function endGame() {
  clearInterval(inter);
  reset();
  alert("gameOVER!");
}

//start the game
function play() {
  if (!tf) {
    reset();
    box2.classList.remove("hidden");
    inter = setInterval(box2Run, 10);
    document.addEventListener("keydown", move);
  }
}

//game actions
btnStart.addEventListener("click", play);
btnReset.addEventListener("click", reset);

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
