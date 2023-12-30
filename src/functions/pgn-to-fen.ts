export const STARTING_POSITION = "rnbqkbnr/pppppppp/11111111/11111111/11111111/11111111/PPPPPPPP/RNBQKBNR";

export const convertPgnToMoveArray = (pgn: string) => {
    const moves = pgn.split(/\d+\.\s/);
    const eachMove = [];
    for (let i in moves) {
        let x = moves[i].split(" ")
        let firstMove = x[0]
        let secondMove = x.slice(1).join("")
            if (firstMove && firstMove !== "+") {
                eachMove.push(firstMove)
            }
            if (secondMove && secondMove !== "+") {
                eachMove.push(secondMove)
            }
    }
    return eachMove;
}

export const pgnToFenList = (pgn: string, previousFen?: string | undefined): string[] => {
    const moves = convertPgnToMoveArray(pgn);
    let fens = [previousFen ? previousFen : STARTING_POSITION];
    for (let i in moves) {
        let move = moves[i].replaceAll("+", "");
        let isPawn = (move.length < 3 || move.charAt(0).match(/[a-z]{1}/)) || false;
        let piece = isPawn ? "P" : move.charAt(0);
        let colour = parseInt(i) % 2 == 0 ? "white" : "black";
        let fen = fens[i]
        let fenBoard = fens[i].split(" ");
        const x = move.charCodeAt(move.length - 2) - 96;    // 1-8
        const y = parseInt(move.charAt(move.length - 1));   // 1-8 // 0 is back rank
        let board = fenBoard[0].split("/")
        const piece_case = colour === "white" ? piece.toUpperCase() : piece.toLowerCase()
        // console.log("Piece=" + piece + ", move=" + move)
        // console.log("---------------")

        let row_copy = board[board.length - y].split("");
        row_copy[x - 1] = piece_case;
        board[board.length - y] = row_copy.join("");

        console.log("Piece is = " + piece)
        switch (piece) {
            case "P":
                let isEnPassant = false; //isPawn && moves[i].charAt(0).match(/[a-z]{1}/) || todo
                if (isEnPassant) {
                    // todo need 2 delete two row squares
                } else if (move.charAt(2) === "=") {
                    let row_copy = board[board.length - y].split("");
                    row_copy[x - 1] = move.charAt(move.length - 1); // Q / N etc...
                    board[board.length - y] = row_copy.join("");

                    let copy = board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)].split("");
                    copy[x - 1] = "1";
                    board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)] = copy.join("");
                } else if (move.charAt(1) === "x") {
                    let direction = move.charCodeAt(0) - move.charCodeAt(2);
                    let copy = board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)].split("");
                    copy[x - 1 + direction] = "1";
                    board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)] = copy.join("");
                } else {
                    if (board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)][x - 1] === piece_case) {
                        let copy = board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)].split("");
                        copy[x - 1] = "1";
                        board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)] = copy.join("");
                    } else {
                        let copy = board[(colour === "white" ? board.length - y + 2 : board.length - y - 2)].split("");
                        copy[x - 1] = "1";
                        board[(colour === "white" ? board.length - y + 2 : board.length - y - 2)] = copy.join("");
                    }
                }
                break;
            case "N":
                if (move.length > 3 && !move.includes("x")) { // find directly 
                    let y_square = move.charCodeAt(1) - 96;
                    for (let row in board) {
                        if (board[row][y_square - 1] === (piece_case)) {
                            let copy = board[row].split("");
                            copy[y_square - 1] = "1";
                            board[row] = copy.join("");
                            break;
                        }
                    }
                } else {
                    move.replace("x", "");
                    for (let y_scale = -2; y_scale < 3; y_scale++) {
                        if (y_scale === 0) continue;
                        let y_candidate = board.length - y + y_scale; // good
                        if (y_candidate >= 0 && y_candidate <= 7) {
                            for (let j = -1; j < 2; j++) {
                                if (j === 0) continue;
                                let mult = y_scale % 2 === 0 ? 1 : 2;
                                let j_x_mult = j * mult;
                                let x_candidate = x - 1 + j_x_mult;
                                if (x_candidate >= 0 && x_candidate <= 7) {
                                    if (board[y_candidate][x_candidate] === piece_case) {
                                        let row_copy = board[y_candidate].split("");
                                        row_copy[x_candidate] = "1";
                                        board[y_candidate] = row_copy.join("");
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case "B":
                // new algo
                for (let row in board) {
                    let r = x - 1;
                    let c = board.length - y;
                    let diff = parseInt(row) - c
                    let target_sqr_left = r - diff;
                    let target_sqr_right = r + diff;
                    if (c != parseInt(row)) {
                        if (target_sqr_left >= 0 && target_sqr_left <= 7) {
                            if (board[row][target_sqr_left] === piece_case) {
                                let row_copy = board[row].split("");
                                row_copy[target_sqr_left] = "1";
                                board[row] = row_copy.join("")
                                break;
                            }
                        }
                        if (target_sqr_right >= 0 && target_sqr_right <= 7) {
                            if (board[row][target_sqr_right] === piece_case) {
                                let row_copy = board[row].split("");
                                row_copy[target_sqr_right] = "1";
                                board[row] = row_copy.join("")
                                break;
                            }
                        }
                    }
                }

                break;
            case "R":
                if (move.length >= 4 && move.charAt(1) !== "x") {
                    let x_candidate = x - 1 + move.charCodeAt(1) - move.charCodeAt(move.length - 2);
                    if (x_candidate >= 0 && x_candidate <= 7) {
                        let row_copy = board[board.length - y].split("");
                        row_copy[x_candidate] = "1";
                        board[board.length - y] = row_copy.join("");
                    }
                } else {
                    // look for closest rook on cross adjacent squares
                    let factor = 1;
                    let located_rook = false;
                    while (factor <= 7 || !located_rook) {
                        for (let i = -1; i < 2; i++) {
                            if (i === 0) continue;
                            let x_candidate = x - 1 + (i * factor);
                            let y_candidate = board.length - y + (i * factor);
                            if (y_candidate >= 0 && y_candidate <= 7 && board[y_candidate][x - 1] === piece_case) {
                                let row_copy = board[y_candidate].split("");
                                row_copy[x - 1] = "1";
                                board[y_candidate] = row_copy.join("");
                                located_rook = true;
                                break;
                            } else if (x_candidate >= 0 && x_candidate <= 7 && board[board.length - y][x_candidate] === piece_case) {
                                let row_copy = board[board.length - y].split("");
                                row_copy[x_candidate] = "1";
                                board[board.length - y] = row_copy.join("");
                                located_rook = true;
                                break;
                            }
                        }
                        if (located_rook) break;
                        factor++;
                    }
                }
                break;
            case "Q":
                // look by iterating around the possible moves -- currently buggy
                for (let row in board) {
                    let row_copy = board[row].split("")
                    for (let i in row_copy) {
                        if (parseInt(row) !== board.length - y && parseInt(i) !== x && row_copy[i] === piece_case) {
                            row_copy[i] = "1";
                            board[row] = row_copy.join("");
                        }
                    }
                }
                break;
            case "K":
                let row = board.length - y - 1 // row below
                let locatedKing = false;
                while (!locatedKing) {
                    for (let y_candidate = 0; y_candidate < 3; y_candidate++) {
                        let x_candidate = y_candidate + x - 2;
                        if (
                            !(row === (board.length - y) && x_candidate === (x - 1)) &&
                            x_candidate >= 0 &&
                            x_candidate < 8 &&
                            row >= 0 &&
                            row < 8 &&
                            board[row][x_candidate] === piece_case) {
                            let row_copy = board[row].split("");
                            row_copy[x_candidate] = "1";
                            board[row] = row_copy.join("");
                            locatedKing = true;
                            break;
                        }
                    }
                    if (row === board.length - y + 1) locatedKing = true;
                    row++;
                }
                break;
        }

        fenBoard[0] = board.join("/");
        fen = fenBoard.join(" ")
        fens.push(fen)
    }
    // console.log(fens)
    return fens;
}


