import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import { Navbar } from './components/navbar/navbar';
import { AlphaZero } from './components/alpha-zero/alpha-zero';
import { BoardMode } from './components/board-mode/board-mode';
import { NormalBoard } from './components/normal-board/normal-board';

const App = () => {
    const [mode, setMode] = useState<number>(0);

    const getMode = () => {
        switch (mode) {
            case 0:
                return (
                    <NormalBoard />
                )
            case 1:
                return (
                    <AlphaZero />
                )
            case 2:
                return (
                    <>
                    </>
                )
        }
        return null;
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
            margin: "0px",
            // width: "100%",
            height: "100vh",
            paddingLeft: "10px",
            paddingRight: "10px",
            color: "#60F650",
            overflowX: "hidden",
            backgroundColor: "#1B1C1B"
        }}>
            <div>
                <Navbar />
                <BoardMode mode={mode} setMode={setMode} />
                {getMode()}
            </div>
        </div >
    );
};

export default hot(module)(App);