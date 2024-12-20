const chess = new Chess();
const board = Chessboard("board", {
    position: "start",
});

const openings = {
    e4: {
        description: "King's Pawn Opening",
        moves: {
            e5: {
                description: "Open Game",
                moves: {
                    Nf3: {
                        description: "Italian Game",
                        moves: {
                            Nc6: {
                                description: "Two Knights Defense",
                                moves: {},
                            },
                            Bc5: {
                                description: "Italian Game - Giuoco Piano",
                                moves: {},
                            },
                        },
                    },
                    d4: {
                        description: "Scotch Game",
                        moves: {},
                    },
                },
            },
            c5: {
                description: "Sicilian Defense",
                moves: {
                    Nf3: {
                        description: "Open Sicilian",
                        moves: {},
                    },
                    Nc3: {
                        description: "Closed Sicilian",
                        moves: {},
                    },
                },
            },
        },
    },
};

const breadcrumb = document.getElementById("breadcrumb");
const movesDiv = document.getElementById("moves");
const currentPath = [];

function renderBreadcrumb() {
    breadcrumb.innerHTML = "";
    currentPath.forEach((move, index) => {
        const li = document.createElement("li");
        li.textContent = move;
        li.onclick = () => {
            currentPath.splice(index + 1);
            renderMoves();
            renderBreadcrumb();
            resetBoardToCurrentPath();
        };
        breadcrumb.appendChild(li);
    });
}

function renderMoves() {
    let node = openings;
    currentPath.forEach((move) => {
        node = node["moves"][move];
    });

    movesDiv.innerHTML = "";
    for (const [move, details] of Object.entries(node.moves)) {
        const div = document.createElement("div");
        div.className = "move";
        div.textContent = `${move}: ${details.description}`;
        div.onclick = () => {
            currentPath.push(move);
            renderMoves();
            renderBreadcrumb();
            updateBoard(move);
        };
        movesDiv.appendChild(div);
    }
}

function resetBoardToCurrentPath() {
    chess.reset();
    currentPath.forEach((move) => chess.move(move));
    board.position(chess.fen());
}

function updateBoard(move) {
    chess.move(move);
    board.position(chess.fen());
}

// Initial render
renderMoves();
renderBreadcrumb();
