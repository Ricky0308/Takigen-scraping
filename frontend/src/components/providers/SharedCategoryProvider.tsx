import { useState, createContext } from "react";
import React from "react";

import { conditionCategories, categoryOptions } from "../../utils/condition_info/Categories";

type ContextType = {
    sharedCategory?:string[];
    setSharedCategory?: React.Dispatch<React.SetStateAction<string[]>>;
}

type Children = {
    children: React.ReactNode;
};

export const SharedCategoryContext = createContext<ContextType>({});

export const SharedCategoryProvider = (props:Children) => {
    const { children } = props;
    const [ sharedCategory, setSharedCategory ] = useState<string[]>([]);
    return (
        <SharedCategoryContext.Provider value={{ sharedCategory, setSharedCategory }}>
            { children }
        </SharedCategoryContext.Provider>
    )
}

