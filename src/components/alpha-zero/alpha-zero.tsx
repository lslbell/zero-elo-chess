import React,
{
    useEffect,
    useState
} from "react"
import { Chessboard } from "react-chessboard";
import {
    pgnToFenList,
    STARTING_POSITION
} from "../../functions/pgn-to-fen";
import {
    game1,
    game2,
    game3,
    game4,
    game5
} from "../../games/games";

export const AlphaZero = () => {
    const [positionFen, setFenPosition] = useState<string>(STARTING_POSITION);
    const [userFen, setUserFen] = useState<string>("");
    const [fens, setFens] = useState<string[]>([]);
    const [randomNum, setRandomNumber] = useState<number>();
    const [userStreak, setUserStreak] = useState<number>(0);
    let games = [game1, game2, game3, game4, game5];

    useEffect(() => {
        const fenList = pgnToFenList(games[0]);
        setFens(fenList);
        const max = fenList.length - 3;
        const min = 0;
        let random_num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (random_num % 2 !== 0) {
            random_num += random_num;
        }
        setFenPosition(fenList[random_num])
        setRandomNumber(random_num);
    }, [userStreak])

    useEffect(() => {
        if (userFen && randomNum && positionFen) {

            console.log("User fen = " + userFen)
            console.log("Correct fen = " + fens[randomNum + 1])
            console.log(randomNum)

            if (userFen && randomNum && userFen === fens[randomNum + 1]) {
                console.log("correct guess");
                setUserStreak(userStreak + 1);
            } else {
                console.log("Incorrect guess");
            }
        }
    }, [userFen])

    const handlePieceMove = (targetSquare: string, piece: string) => {
        const move = piece.charAt(1) === "P" ? targetSquare : piece.charAt(1).concat(targetSquare);
        const newFen = pgnToFenList(move, positionFen)[1]
        setUserFen(newFen);
        return true;
    }

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
                position={positionFen}
                boardOrientation={"white"}
                onPieceDrop={(sourceSquare, targetSquare, piece) => handlePieceMove(targetSquare, piece)}
            />
            <div>
                <p>Streak: {userStreak}🔥</p>
            </div>
        </div>
    );
};