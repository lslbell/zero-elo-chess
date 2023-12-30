import React, { useEffect, useState } from "react"
import { Chessboard } from "react-chessboard";
import { gameMoves, pgnToFenList, STARTING_POSITION } from "../../functions/pgn-to-fen/pgnToFen";

export const AlphaZero = () => {
    const [position, setPosition] = useState(STARTING_POSITION);

    useEffect(() => {
        const fenList = pgnToFenList(gameMoves);
        setPosition(fenList[fenList.length - 1])
    }, [])

    return (
        <div style={{
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h3 style={{
                fontWeight: "normal"
            }}>
                AlphaZero
            </h3>
            <p>
                {">"} Build your move-picking intuition guessing AlphaZero's moves.
            </p>

            <Chessboard
                id="ClickToMove"
                boardWidth={600}
                animationDuration={200}
                position={position}
                boardOrientation={"white"}
            // arePiecesDraggable={false}
            // onSquareClick={onSquareClick}
            />
        </div>
    );
};