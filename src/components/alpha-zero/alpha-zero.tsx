import React,
{
    useEffect,
    useState
} from "react"
import { Chessboard } from "react-chessboard";
import {
    STARTING_POSITION,
    convertPgnToMoveArray,
    pgnToFenList,
} from "../../functions/pgn-to-fen";
import {
    game1,
    game2,
    game3,
    game4,
    game5
} from "../../games/games";

export const AlphaZero = () => {
    const [positionFen, setPositionFen] = useState<string>(STARTING_POSITION);
    const [userFen, setUserFen] = useState<string>();
    const [fens, setFens] = useState<string[]>(pgnToFenList(convertPgnToMoveArray(game3)));
    const [randomNum, setRandomNumber] = useState<number>(0);
    const [streak, setStreak] = useState<number>(0);
    const [boardSize, setBoardSize] = useState<number>(600);

    useEffect(() => {
        const width = window.innerWidth;
        if (width < 600) {
            setBoardSize(380);
        }
    }, []);

    const handleClickNext = () => {
        const max = fens.length - 10;
        let chosenNum = Math.floor(Math.random() * max) + 2;
        chosenNum = chosenNum % 2 !== 0 ? chosenNum = chosenNum + 1 : chosenNum;
        setPositionFen(fens[chosenNum])
        setRandomNumber(chosenNum);
        return () => { 0 };
    }

    useEffect(() => {
        if (userFen) {
            let beforeStreak = streak;
            let streakNew = 0;
            if (fens) {
                if (randomNum) {
                    if (userFen === fens[randomNum + 1]) {
                        streakNew = beforeStreak + 1;
                    }
                }
            }
            setStreak(streakNew)
        } else {
            console.log("Something went wrong...")
            setPositionFen(STARTING_POSITION)
        }
        return () => { 0 };
    }, [userFen])

    const handlePieceMove = (targetSquare: string, piece: string) => {
        if (targetSquare) {
            if (piece) {
                let move = "";
                if (piece.charAt(1) === "P") {
                    move = targetSquare;
                } else {
                    move = piece.charAt(1).concat(targetSquare);
                }
                const fen = pgnToFenList([move], positionFen)[1]
                setUserFen(fen);
                setPositionFen(fen);
            }
        }
        return true;
    }

    return (
        <div style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "5px"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px"
            }}>
                {// jsx ? bad
                    <Chessboard
                        boardWidth={boardSize}
                        position={positionFen}
                        animationDuration={300}
                        boardOrientation={"white"}
                        onPieceDrop={(sourceSquare, targetSquare, piece) => handlePieceMove(targetSquare, piece)}
                    />
                    }
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "5px"
            }}>
                <button
                    onClick={handleClickNext}
                    style={{
                        width: "100%",
                        fontSize: "large",
                        padding: "5px",
                        border: "1px solid #60F650",
                        borderRadius: "5px",
                        color: "#60F650",
                        backgroundColor: "#1B1C1B",
                        cursor: "pointer"
                    }}>
                    {positionFen !== STARTING_POSITION ? "Next" : "Start"}
                </button>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <p style={{
                    fontSize: `x-large`
                }}>
                    {streak}🔥
                </p>
            </div>
        </div>
    );
};