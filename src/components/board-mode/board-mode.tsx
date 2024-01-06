import React, { Dispatch, SetStateAction, useState } from "react"

export const BoardMode = (
    props: {
        mode: number,
        setMode: Dispatch<SetStateAction<any>>
    }
) => {
    const modes = ["Normal mode", "AlphaZero trainer", "GM trainer"];

    return (
        <>
            <div style={{
                display: "flex",
                marginBottom: "20px"
            }}>
                {
                    modes.map((m: string, index: number) => {
                        return (
                                <button
                                    key={m}
                                    onClick={() => props.setMode(index)}
                                    style={{
                                        width: "100%",
                                        fontSize: "large",
                                        padding: "5px",
                                        border: "1px solid #60F650",
                                        borderRadius: "5px",
                                        color: "#60F650",
                                        backgroundColor: `${props.mode === index ? "black" : "#1B1C1B"}`,
                                        marginRight: "5px",
                                        cursor: "pointer"
                                    }}>
                                    {m}
                                </button >
                        )
                    })
                }
            </div >
        </>
    )
}