window.onload = getCopyrightYear();

function getCopyrightYear () {
  let date = new Date();
  let year = date.getFullYear();
  document.getElementById("copyright").innerHTML = year;
}


var ballX = 75;
var ballY = 75;
var ballSpeedX = 7; //default 5
var ballSpeedY = 9; //default 7

const brickW = 80;
const brickH = 20;
const brickGap = 2;
const brickCol = 10;
const brickRows = 14;
var brickGrid = new Array(brickCol * brickRows);
var bricksLeft = 0;

const paddleWidth = 100;
const paddleThickness = 10;
const paddleDistanceFromEdge = 60;
var paddleX = 400;

var canvas, canvasContext;

var mouseX = 0;
var mouseY = 0;

var lives = 3;

var score = 0;


//reloads pause screen
function restart(){
  location.reload();
  return false;
}


//testing loose function to stop game & show final score
function loose(){
  lives = 0;
  ballSpeedX = 0;
  ballSpeedY = 0;
}


function updateMousePos(evt){
  var rect = canvas.getBoundingClientRect(); //position on the page of the canvas
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - paddleWidth/2;

//cheat /hack to test ball in any position
  /*ballX = mouseX;
  ballY = mouseY;
  ballSpeedX = 4;
  ballSpeedY = -4;*/
}


function brickReset(){
  bricksLeft = 0;
  var i;
  for(i=0; i< 3* brickCol;i++){ //set a gutter
    brickGrid[i] = false;
  }
  for(; i<brickCol * brickRows;i++){
    if(Math.random() <0.5){ //creates random brick pattern
      brickGrid[i] = true;
      bricksLeft++;
    }
        } // end of for each brick
  } // end of brickReset func

function pause(){
  canvas =document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  drawAll();
}

window.onload = pause();


function start (){
  canvas =document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

  canvas.addEventListener('mousemove', updateMousePos)

  brickReset();
  ballReset();

  }

//Calls motion & draw functions
function updateAll(){
moveAll();
drawAll();
}

function ballReset(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;

}

function ballMove(){
  //ball update position on every frame
  ballX += ballSpeedX;
  ballY += ballSpeedY;

//ball bounce edge checking
if(ballX < 0 && ballSpeedX <0.0) { //left side
  ballSpeedX = -ballSpeedX; //if goes over the left & not already on way back flip speed
}
if(ballX > canvas.width && ballSpeedX >0.0) { //right side
  ballSpeedX = -ballSpeedX; //if goes over the right & not already on way back flip speed
}

if(ballY < 0 && ballSpeedY <0.0) { //top edge
  ballSpeedY = -ballSpeedY;
}
if(ballY > canvas.height) { //bottom of screen
  ballReset();
  lives--;
document.getElementById("lives").innerHTML = "Lives: " + lives;
  }
if (lives <=0){
  loose();
  /*
  brickReset(); //resets bricks when ball leaves screen & player looses 3 lives
  lives = 3; //restarts game
  document.getElementById("lives").innerHTML = lives + " Lives"
  score = 0; //resets score
  document.getElementById('score').innerHTML = "Score ";
*/
}
}

//helps with edge conditions
function isBrickAtColRow(col,row){
  if(col >=0 && col < brickCol &&
     row >=0 && row < brickRows){
       var brickIndexUnderCord = rowColToArrayIndex(col, row);
       return brickGrid[brickIndexUnderCord];
    }else{
      return false;
    }
}

function ballBrickHandling(){
  //collision code
  var ballBrickCol = Math.floor(ballX / brickW);
  var ballBrickRow = Math.floor(ballY / brickH);
  var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

  //to prevent bricks on edge from disappearing
  if(ballBrickCol >=0 && ballBrickCol < brickCol &&
    ballBrickRow >=0 && ballBrickRow < brickRows){

  if(isBrickAtColRow(ballBrickCol, ballBrickRow)) { //when a collision has happened
    brickGrid[brickIndexUnderBall] = false;
    bricksLeft--;
    score+=10; //adds 10 points for each brick hit
    document.getElementById('score').innerHTML = "Score: " + score;
    //console.log("score is " + score);
    //console.log(bricksLeft);

//get prev position to check if side collision or collision from bottom
    var prevBallX = ballX - ballSpeedX;
    var prevBallY = ballY - ballSpeedY;
    var prevBrickCol = Math.floor(prevBallX / brickW);
    var prevBrickRow = Math.floor(prevBallY  / brickH);

    var bothTestsFailed = true;

    if (prevBrickCol != ballBrickCol){
        if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false){ //if no brick bounce horizontally
        ballSpeedX *= -1;
        bothTestsFailed = false;
      }

    }
    if (prevBrickRow != ballBrickRow){
          if(isBrickAtColRow(ballBrickCol, prevBrickRow) == false) { //bounce vertically
          ballSpeedY *= -1;
          bothTestsFailed = false;
      }

    }


if(bothTestsFailed){   //armpit case stops ball going right through
  ballSpeedX *= -1;
  ballSpeedY *= -1;
}

  } //end of brick found
} //end of valid col and row
} //end of ballBrickHandling func

function ballPaddleHandling(){
  //ball paddle collision
  var paddleTopEdgeY = canvas.height-paddleDistanceFromEdge;
  var paddleBottomEdgeY = paddleTopEdgeY + paddleThickness;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeX = paddleLeftEdgeX + paddleWidth;
  if ( ballY > paddleTopEdgeY && // below the top of paddle
       ballY < paddleBottomEdgeY && // above bottom of paddle
       ballX > paddleLeftEdgeX && // right of the left side of the paddle
       ballX < paddleRightEdgeX) { // left of the right side of the paddle

       ballSpeedY = -ballSpeedY;

       var centerOfPaddleX = paddleX + paddleWidth/2;
       var ballDistanceFromePaddleCenterX = ballX - centerOfPaddleX;
       ballSpeedX = ballDistanceFromePaddleCenterX * 0.35;

  if(bricksLeft ==0){ //creates more bricks when ball touches paddle
    brickReset();
        } //out of bricks
      } //ball center inside paddle
  } //end of ballPaddleHandling


//Motion code in moveAll func
function moveAll(){
ballMove();
ballBrickHandling();
ballPaddleHandling();
}



function rowColToArrayIndex(col, row){
  return col + brickCol * row;
}

function drawBricks(){

  for (var eachRow = 0; eachRow < brickRows; eachRow++){
    for (var eachCol=0; eachCol<brickCol; eachCol++){

      var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

     if(brickGrid[arrayIndex]){
         colorRect(brickW*eachCol,brickH*eachRow, brickW-brickGap, brickH-brickGap, 'blue');
       } //end of is this brick here
   } //end of for each brick
}
} //end of drawBricks func


//draw code in drawAll func
function drawAll(){
  colorRect(0,0, canvas.width, canvas.height, 'black'); //clear screen
  colorCircle(ballX, ballY, 10, 'white'); //draw ball
  colorRect(paddleX, canvas.height-paddleDistanceFromEdge,
           paddleWidth, paddleThickness,'white' );
  drawBricks();



}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor){
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, 10, 0,Math.PI*2, true);
  canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor){
canvasContext.fillStyle = fillColor;
canvasContext.fillText(showWords, textX, textY);

}
