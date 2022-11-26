import axios, { AxiosResponse } from "axios";
import { useEffect, useState, useContext } from "react";
import { baseApiUrl, scrapeApiUrl, testApiUrl } from "../utils/api_urls";
import { useParams } from "react-router";

import { ClusterIdProvider, ClusterIdContext, ClusterInfoProvider, ClusterInfoContext } from "../components/providers/ClusterProvider";
import { SearchMetaInfo } from "../components/Search/SearchMetaInfo";
import { SearchWindow } from "../components/Search/SearchWindow";
import { clusterExistCheck, useClusterDetail } from "../utils/api_functions/Conditions";
import { ConditionWindow } from "../components/Search/ConditionWindow";


const SearchPageContent = () => {
    // クラスターの対象が<SearchMetaInfo>で決定し, それをSearchPage下全てのcomponentsが共有
    const { clusterId, setClusterId } = useContext(ClusterIdContext);
    const { clusterInfo, setClusterInfo } = useContext(ClusterInfoContext);
    const { fixed_id } = useParams();
    useEffect(()=>{
        if(fixed_id){
            clusterExistCheck(fixed_id)
                .then(res => {
                    if (res.data){ setClusterId!(fixed_id); }
                })
        }
    }, [])
    const clusterDetailCallback = (res:AxiosResponse) => {setClusterInfo!(res.data)}
    useClusterDetail(clusterId, clusterDetailCallback, [clusterId]);
    return (
        <>
        <SearchMetaInfo/>
        <SearchWindow/>
        <ConditionWindow/>
        </>   
    )
}

export const SearchPage = () => {
    // <ClusterIdProvider>を使用するためのラッパー
    return (
        <ClusterInfoProvider>
            <ClusterIdProvider>
                <SearchPageContent/>
            </ClusterIdProvider>
        </ClusterInfoProvider>
    )
}