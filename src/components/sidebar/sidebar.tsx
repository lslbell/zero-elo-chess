import React from "react"

export const Sidebar = () => {

    return (
        <div style={{
            padding: "0px",
            borderRight: "2px solid #64748b",
            position: "absolute",
            maxWidth: "20%",
            width: "10%",
            height: "100%"
        }}>
            <div onClick={() => {

            }}
                style={{
                    marginBottom: "20px"
                }}
            >
                Play like AlphaZero
            </div>
            <div>
                Play like a GM
            </div>
        </div>
    )
}