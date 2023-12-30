import React from 'react';
import { hot } from 'react-hot-loader';
import { Navbar } from './components/navbar/navbar';
import { AlphaZero } from './components/alpha-zero/alpha-zero';

const App = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
            width: "100%"
        }}>
            <div>
                <Navbar />
                <AlphaZero />
            </div>
        </div >
    );
};

export default hot(module)(App);