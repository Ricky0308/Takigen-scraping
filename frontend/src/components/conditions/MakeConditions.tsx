import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { baseApiUrl, scrapeApiUrl, conditionsApiUrl } from "../../utils/api_urls";
import { type Condition, CondCluster } from "../../types/conditions";
import { expCondCluster } from "../../types/conditions";

export const MakeConditions = () => {
    const [newCond, setNewCond] = useState<string>('');
    const condCluster:CondCluster = expCondCluster;
    const data = {condCluster:condCluster, clusterName:"ricky-new", accountId:"270080be-1e64-419c-baf3-07c028603955"}
    useEffect(()=>{
        axios.post(conditionsApiUrl, data)
            .then((res: AxiosResponse<string>)=>{
                console.log(res.data);
                setNewCond(res.data);
            })
    },[]);
    return(
        <>
            { newCond || 'nothing is fetched yet' }
            <div>{ scrapeApiUrl }</div>
        </>
    )
}