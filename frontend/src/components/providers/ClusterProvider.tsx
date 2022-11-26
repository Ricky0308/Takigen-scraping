import { useState, createContext } from "react";
import React from "react";
import type { CondCluster } from "../../types/conditions";



export const ClusterIdContext = createContext<ClusterIdContextType>({});

export const ClusterIdProvider = (props:Children) => {
    const { children } = props;
    const [clusterId, setClusterId] = useState<String | undefined>(undefined);
    return (
        <ClusterIdContext.Provider value={{clusterId, setClusterId}}>
            { children }
        </ClusterIdContext.Provider>
    )
}

type ClusterIdContextType = {
    clusterId?:String;
    setClusterId?: React.Dispatch<React.SetStateAction<String | undefined>>;
}

type Children = {
    children: React.ReactNode;
};





export const ClusterInfoContext = createContext<ClusterInfoContextType>({});

export const ClusterInfoProvider = (props:Children) => {
    const { children } = props;
    const [ clusterInfo, setClusterInfo ] = useState<ClusterInfoType | undefined>(undefined);
    return (
        <ClusterInfoContext.Provider value={{ clusterInfo, setClusterInfo }}>
            { children }
        </ClusterInfoContext.Provider>
    )
}

type ClusterInfoType = {
    id : string, 
    completed_conditions : number, 
    conditions : any[], 
    created : string, 
    data_file : string[], 
    data_path : string, 
    data_version : string, 
    in_progress : boolean, 
    name : string, 
    num_of_conditions : number,
}

type ClusterInfoContextType = {
    clusterInfo?:ClusterInfoType | undefined;
    setClusterInfo?: React.Dispatch<React.SetStateAction<ClusterInfoType | undefined>>;
} 
