import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { baseApiUrl, scrapeApiUrl, testApiUrl } from "../utils/api_urls";
import { type Condition, CondCluster } from "../types/conditions";
import { expCondCluster } from "../types/conditions";

export const ApiTest = () => {
    const [msg, setMsg] = useState<string>('');
    const condCluster:CondCluster = expCondCluster;
    useEffect(()=>{
        axios.post(scrapeApiUrl, {condCluster:"413a8025-4690-486b-ae98-5ececec64b05", targetCompany:"タキゲン製造（株）"})
            .then((res: AxiosResponse<string>)=>{
                console.log(res.data);
                // setMsg(res.data);
            })
    },[]);
    return(
        <>
            { msg || 'nothing is fetched yet' }
            <div>{ scrapeApiUrl }</div>
        </>
    )
}