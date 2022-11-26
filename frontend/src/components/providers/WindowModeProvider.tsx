import { useState, createContext } from "react";
import React from "react";

type ContextType = {
    windowMode?:String;
    setWindowMode?: React.Dispatch<React.SetStateAction<String>>;
}

type Children = {
    children: React.ReactNode;
};

export const WindowModeContext = createContext<ContextType>({});

export const WindowModeProvider = (props:Children) => {
    const { children } = props;
    const [ windowMode, setWindowMode ] = useState<String>("info");
    return (
        <WindowModeContext.Provider value={{windowMode, setWindowMode}}>
            { children }
        </WindowModeContext.Provider>
    )
}