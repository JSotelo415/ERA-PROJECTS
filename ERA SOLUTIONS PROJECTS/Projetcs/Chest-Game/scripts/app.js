const gameBoard = document.querySelector("#gameboard"); //selecting game baord and saving it into a  VAR
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const width = 8; //<--width of the gameboard will havve to maybe do a nested

let playerGo = "black";
playerDisplay.textContent = "black";
let startPositionId; //will store the current id the pieces are at
let draggedElement;
let draggedPiece;

// prettier-ignore
const startPieces = [
  //empty array were all game pieces will be stored //this is an array of 64 items
  rook, knight, bishop,queen,king,bishop,knight,rook,
  pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
  rook, knight, bishop,queen,king,bishop,knight,rook,
];

function createBoard() {
  //goal is to inject this baord into my div in index
  startPieces.forEach((startPieces, i) => {
    const square = document.createElement("div"); // this is the sqaure that the grid makes by looping thru the arrray
    square.classList.add("square"); //adding a prop/artibute to target square when i talk about they div
    square.innerHTML = startPieces; // adding each piece into a square so it sets the html into the element of square
    square.firstChild?.setAttribute("draggable", true);
    square.classList.add("beige");
    //i want to track what square im in so i can check what square im at by checking the square id oor what index in in the array
    const row = Math.floor((63 - i) / 8) + 1; //f
    // console.log(row);
    if (row % 2 === 0) {
      square.classList.add(i % 2 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 ? "brown" : "beige");
    }
    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    } else if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }
    square.setAttribute("square-id", i);
    gameBoard.append(square);
  });
}
createBoard();

const allSquares = document.querySelectorAll(" .square"); //selecting all elements in gameboard with sqaure in it
// console.log(allSquares);

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragstart); //adds an event to to square so if it drags its able to capture that event . With this we could target aeach piece whenever it moves and be able to place it in new places ass well as knowing what piecve is which this is thanks to the 2D array and mapping thru them or forn looping thru the array and and setting them up
  square.addEventListener("dragover", dragover);
  square.addEventListener("drop", dragdrop);
});

function dragstart(e) {
  // console.log("playergo", playerGo);
  // console.log("e target", e.target.getAttribute("data-piece"));
  draggedPiece = e.target.getAttribute("data-piece");
  startPositionId = Number(e.target.parentNode.getAttribute("square-id"));
  // console.log(startPositionId);
  draggedElement = e.target;

  // console.log(draggedElement);
}

function dragover(e) {
  e.preventDefault();
}
function dragdrop(e) {
  e.preventDefault();
  e.stopPropagation();
  // console.log(e);
  // console.log("end2", e.toElement);
  // console.log(startPositionId);
  // console.log("piece", draggedPiece);
  const target = e.target.closest(".square");
  if (!target || target === draggedElement.parentNode) return;

  const correctGo = draggedElement.firstChild.classList.contains(playerGo); //could add
  const taken = e.target.classList.contains("piece");
  const validMove = checkIfValid(target);
  console.log("validMOve?", validMove);

  console.log(correctGo);
  if (!correctGo) return;
  const opponentGo = playerGo === "white" ? "black" : "white";
  console.log(opponentGo);

  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
  //sudo code
  // let startPositionId = Number(e.target.parentNode.getAttribute("square-id")); //passing these two variablesto all my pieces to  vigure out the rules
  let endPositionId = Number(e.toElement.getAttribute("square-id")); //isset
  //switch case instead of if else
  if (correctGo) {
    if (takenByOpponent && validMove) {
      console.log("in the if correct go");

      e.target.append(draggedElement);
      e.target.remove();
      changePlayer();
      return;
    }
    //prettier-ignore
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = "you cant do that";
            console.log("in the if correct go");

      setTimeout(() => infoDisplay.textContent = "", 2000);

      return;
    }
    if (validMove) {
      e.target.append(draggedElement);
      console.log("in the if correct go");

      changePlayer();
      return;
    }
    //now check this
  }

  e.target.append(draggedElement);
  changePlayer();
}

function changePlayer() {
  if (playerGo === "black") {
    reverseIds(); // Just call the function, no need to capture a return value
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds(); // Just call the function, no need to capture a return value
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}
// prettier-ignore
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", allSquares.length - 1 - i); // Reverse the IDs
  });
  console.log("IDs have been reversed.");
}

function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", i); // Revert the IDs to their original order
  });
  console.log("IDs have been reverted.");
}

function checkIfValid(target) {
  console.log("in checkifvalid", target);
  const targetId = Number(target.getAttribute("square-id"));

  const startId = Number(startPositionId);
  console.log("tarid", targetId);
  const piece = draggedElement.getAttribute("data-piece");
  console.log("startId", startId);
  console.log("piece", piece);
  let isValid = false; // Initialize a boolean to track validity

  //prettier-ignore
  switch (piece) {
    case "pawn":
      const startRow = [8, 9, 10, 11, 12, 13, 14, 15]; // Single logic for both sides
    console.log(piece);
    
      // Moving forward by one square
      if (startId + width === targetId && !target.firstChild) {
        console.log("Pawn moves forward one square");
        isValid = true;
      }

      // Moving forward by two squares on first move
      if (
        startRow.includes(startId) &&
        startId + width * 2 === targetId &&
        !document.querySelector(`[square-id='${startId + width}']`).firstChild &&
        !target.firstChild
      ) {
        console.log("Pawn moves forward two squares from starting position");
        isValid = true;
      }

      // Capturing diagonally
      if (
        (startId + width - 1 === targetId || startId + width + 1 === targetId) &&
        target.firstChild
      ) {
        console.log("Pawn captures diagonally");
        isValid = true;
      }
      break;

    // Logic for other pieces...

    default:
      break;
  }

  console.log("isValid:", isValid);
  return isValid; // Ensure a boolean is returned
}

// let endPositionId =
//   Number(e.toElement.getAttribute("square-id")) ||
//   target.parentNode.getAttribute("square-id"); //isset

//if cae within chesspiece that checks the pawns current position , and know the row it its in the starting rowit can move over twiceif not
function chessPiecePawn(start, end) {
  let result = true;
  console.log("start", start);
  console.log("end", end);
  // if(start >= 40 && start =<)
  // if (start === 48 && end === 40) {
  //   //the rules of a pawn should be the condistion
  //   result = true;
  // }

  return result;
}
