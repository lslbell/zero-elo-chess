export const STARTING_POSITION = "rnbqkbnr/pppppppp/11111111/11111111/11111111/11111111/PPPPPPPP/RNBQKBNR";

export const gameMoves = '1. d4 e6 2. e4 d5 3. Nc3 Nf6 4. e5 Nfd7 5. f4 c5 6. Nf3 cxd4 7. Nb5 Bb4 + 8. Bd2 Bc5 9. b4 Be7 10. Nbxd4 Nc6 11. c3 a5 12. b5 Nxd4 13. cxd4 Nb6 14. a4 Nc4 15. Bd3 Nxd2 16. Kxd2 Bd7 17. Ke3 b6 18. g4 h5 19. Qg1 hxg4 20. Qxg4 Bf8 21. h4 Qe7 22. Rhc1 g6 23. Rc2 Kd8 24. Rac1 Qe8 25. Rc7 Rc8 26. Rxc8+ Bxc8 27. Rc6 Bb7 28. Rc2 Kd7 29. Ng5 Be7 30. Bxg6 Bxg5 31. Qxg5 fxg6 32. f5 Rg8 33. Qh6 Qf7 34. f6 Kd8 35. Kd2 Kd7 36. Rc1 Kd8 37. Qe3 Qf8 38. Qc3 Qb4 39. Qxb4 axb4 40. Rg1 b3 41. Kc3 Bc8 42. Kxb3 Bd7 43. Kb4 Be8 44. Ra1 Kc7 45. a5 Bd7 46. axb6 + Kxb6 47. Ra6+ Kb7 48. Kc5 Rd8 49. Ra2 Rc8+ 50. Kd6 Be8 51. Ke7 g5 52. hxg5'

export const convertPgnToMoveArray = (pgn: string) => {
    const moves = pgn.split(/\d+\.\s/);
    const eachMove = [];
    for (let i in moves) {
        let x = moves[i].split(" ")
        let firstMove = x[0]
        let secondMove = x.slice(1).join("")
        if (firstMove && secondMove) {
            if(firstMove !== "+") {
                eachMove.push(firstMove)
            }
            if(secondMove !== "+") {
                eachMove.push(secondMove)
            }
        }
    }
    return eachMove;
}


export const pgnToFenList = (pgn: string): string[] => {
    const moves = convertPgnToMoveArray(pgn);
    let fens = [STARTING_POSITION];
    for (let i in moves) {
        let move = moves[i].replaceAll("+", "");
        let isPawn = (moves[i].length < 3 || moves[i].charAt(0).match(/[a-z]{1}/)) || false;
        let piece = isPawn ? "P" : move.charAt(0);
        let colour = parseInt(i) % 2 == 0 ? "white" : "black";
        let fen = fens[i]
        let fenBoard = fens[i].split(" ");

        const x = move.charCodeAt(move.length - 2) - 96;    // 1-8
        const y = parseInt(move.charAt(move.length - 1));   // 1-8 // 0 is back rank
        let board = fenBoard[0].split("/")
        const piece_case = colour === "white" ? piece.toUpperCase() : piece.toLowerCase()
        console.log("Piece=" + piece + ", move=" + move)
        console.log("---------------")

        let row_copy = board[board.length - y].split("");
        row_copy[x - 1] = piece_case;
        board[board.length - y] = row_copy.join("");

        switch (piece) {
            case "P":
                let isEnPassant = false; //isPawn && moves[i].charAt(0).match(/[a-z]{1}/) || todo
                if (isEnPassant) {
                    // todo need 2 delete two row squares

                } else if (move.includes("x")) {
                    let direction = move.charCodeAt(0) - move.charCodeAt(2);
                    let copy = board[(colour === "white" ? y + 1 : board.length - y - 1)].split("");
                    copy[x - 1 + direction] = "1";
                    board[(colour === "white" ? y + 1 : board.length - y - 1)] = copy.join("");
                } else {
                    // console.log(board[y + 1])
                    if (board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)][x - 1] === piece_case) {
                        let copy = board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)].split("");
                        copy[x - 1] = "1";
                        board[(colour === "white" ? board.length - y + 1 : board.length - y - 1)] = copy.join("");
                    } else { // is a 2 jump
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
                                console.log("found rook on y")
                                console.log(board[y_candidate])
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
                for (let row in board) { // todo direct find for Q > 1 
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

        if (i === "92") break;

    }
    return fens;
}

pgnToFenList(gameMoves)

