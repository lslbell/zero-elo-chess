import React from "react"

export const Navbar = () => {
    return (
        <nav style={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #60F650",
            marginBottom: "20px",
        }}>
            <h1 style={{
                fontSize: "20",
                fontWeight: "normal",
                paddingBottom: "5px",
                marginBottom: "0px"
            }}>
                Zero Elo Chess
            </h1>
        </nav>
    )
}