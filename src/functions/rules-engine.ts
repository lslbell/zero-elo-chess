export const getValidMove = (sourceSquare: string, targetSquare: string, piece: string, moves: string[]) => {
    // whos turn is it?
    if (piece.charAt(0) === "b") {
        if (moves.length === 0) {
            return null;
        }
        else if (moves.length % 2 === 0) {
            return null;
        }
    } else if (piece.charAt(0) === "w") {
        if (moves.length > 0) {
            if (moves.length % 2 !== 0) {
                return null;
            }
        }
    }

    console.log(sourceSquare)
    console.log(targetSquare)
    console.log(piece)
    
    // then...format move
    let move = ""
    if (piece.charAt(1) === "P") {
        move = targetSquare;
    } else {
        move = piece.charAt(1).concat(targetSquare);
    }
    console.log("Formatted move = " + move)

    // todo check if move is possible


    // todo move doesnt eval takes:(



    // castle if we can
    if (move.charAt(0) === "K") {
        console.log("king move")
        if (piece.charAt(0) === "w") {
            if (sourceSquare === "e1") {
                if (targetSquare === "g1") {
                    return "O-O"
                } else if (targetSquare === "c1") {
                    return "O-O-O"
                }
            }
        } else if (piece.charAt(0) === "b") {
            if (sourceSquare === "e8") {
                if (targetSquare === "g8") {
                    return "O-O"
                } else if (targetSquare === "c8") {
                    return "O-O-O"
                }
            }
        }
    }

    if (move) {
        return move;
    }

    return null;
}