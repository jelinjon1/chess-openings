let openingsData = {};
import { Chess } from "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.13.3/chess.min.js";

const chess = new Chess();
console.log(chess.fen()); // Should print the starting position FEN

fetch("openings.json")
    .then((response) => response.json())
    .then((data) => {
        openingsData = data;
        console.log("Openings data loaded:", openingsData);
    })
    .catch((error) => console.error("Failed to load openings data:", error));

function pieceTheme(piece) {
    return "img/chesspieces/club/" + piece + ".png";
}

function onDrop(source, target, piece, newPos, oldPos, orientation) {
    const move = chess.move({ from: source, to: target });

    if (move === null) {
        return "snapback";
    }
    // console.log("Move:", move);

    // board.position(chess.fen()); // Update the board after the move

    const opening = openingsData["responses"][move.san];

    if (opening) {
        console.log("Opening:", opening.description);

        // Fetch and display possible responses
        if (opening.responses) {
            displayResponses(opening.responses);
        }
        openingsData = opening;
    } else {
        console.log("No opening data for move:", move.san);
    }
}

function displayResponses(responses) {
    const movesDiv = document.getElementById("moves");
    movesDiv.innerHTML = ""; // Clear previous moves

    for (const [move, details] of Object.entries(responses)) {
        const moveDiv = document.createElement("div");
        moveDiv.textContent = `${move}: ${details.description}`;
        moveDiv.onclick = () => {
            board.position(details.fen || details.position);
            console.log("Playing response:", move);
        };
        movesDiv.appendChild(moveDiv);
    }
}

var config = {
    draggable: true,
    moveSpeed: "normal",
    snapbackSpeed: 500,
    snapSpeed: 100,
    pieceTheme: pieceTheme,
    onDrop: onDrop,
    position: "start",
};
var board = Chessboard("board1", config);
