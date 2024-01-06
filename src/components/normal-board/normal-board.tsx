import React, { useEffect, useState } from "react"
import { Chessboard } from "react-chessboard";
import { STARTING_POSITION, pgnToFenList } from "../../functions/pgn-to-fen";
import { getValidMove } from "../../functions/rules-engine";

export const NormalBoard = () => {
    const [boardSize, setBoardSize] = useState<number>(600);
    const [fens, setFens] = useState<string[]>([STARTING_POSITION]);
    const [moves, setMoves] = useState<(string)[]>([]);

    const handlePieceMove = (sourceSquare: string, targetSquare: string, piece: string) => {
        if (moves) {
            let move = getValidMove(sourceSquare, targetSquare, piece, moves);
            if (move) {
                let movesUpdated = [] as any;
                if (moves.length > 0) {
                    movesUpdated = [...moves, move]
                } else {
                    movesUpdated = [move]
                }
                console.log("moves updated = ")
                console.log(movesUpdated)
                setMoves(movesUpdated)

                // basically send the previous fen and the new move
                let fen = pgnToFenList(movesUpdated, fens[fens.length - 1]);
                let newFens = [...fens, fen[fen.length - 1]]
                setFens(newFens);
            } else {
                console.log("Invalid move!")
            }
        }
        return true;
    }

    const getMoveNum = (index: number) => {
        if (index % 2 === 0) {
            let moveNum = (index / 2) + 1
            return moveNum.toString() + ".";
        }
        return null;
    }

    useEffect(() => {
        const width = window.innerWidth;
        if (width < 600) {
            setBoardSize(380);
        }
    }, []);

    return (
        <>
            <Chessboard
                boardWidth={boardSize}
                position={fens[fens.length - 1]} //  migth neeed separate state
                animationDuration={300}
                boardOrientation={"white"}
                onPieceDrop={
                    (sourceSquare, targetSquare, piece) => (
                        handlePieceMove(sourceSquare, targetSquare, piece)
                    )
                }
            />
            <div style={{
                marginTop: "10px",
                display: "flex",
            }}>
                <button
                    // onClick={() => }
                    style={{
                        width: "100%",
                        fontSize: "large",
                        padding: "5px",
                        border: "1px solid #60F650",
                        borderRadius: "5px",
                        color: "#60F650",
                        marginRight: "5px",
                        cursor: "pointer",
                        backgroundColor: "#1B1C1B"
                    }}>
                    {"<"}
                </button >
                <button
                    // onClick={() => }
                    style={{
                        width: "100%",
                        fontSize: "large",
                        padding: "5px",
                        border: "1px solid #60F650",
                        borderRadius: "5px",
                        color: "#60F650",
                        marginRight: "5px",
                        cursor: "pointer",
                        backgroundColor: "#1B1C1B"
                    }}>
                    {">"}
                </button >
            </div>
            <p>Moves:</p>
            <div style={{
                display: "flex",
                // flexWrap: "wrap",
                // maxWidth:"50%"
            }}>
                {
                    moves && moves.map((m: string, index: number) => {
                        return (
                            <div key={m + index + "moves"} style={{
                                display: "flex",
                                // flexWrap: "wrap",
                                // maxWidth:"50%"
                            }}>
                                <p style={{ marginRight: "5px" }}>
                                    {getMoveNum(index)}
                                </p>
                                <p style={{
                                    marginRight: "5px"
                                }}>
                                    {m}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}