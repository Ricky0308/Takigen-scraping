import { SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";

import { baseApiFunction, useBaseApiFunction } from "./BaseApiFunction";
import { clusterListApiUrl, checkClusterExistApiUrl, createCondClusterApiUrl } from "../api_urls";

/**
 * @returns クラスター選択などで使用するための id + name のリスト
 */
export const useClusterSimpleList = (callback:(res : AxiosResponse) => void, target:any[]=[]) => {
    return useBaseApiFunction(clusterListApiUrl, "get", {"params" : {"type" : "simple_list"}}, {}, callback, target)
}

/**
 * @param cluster_id 
 * @returns ClusterDetailで表示するための情報, ターゲットクラスターをidで指定する
 * サンプルid : "11b67197-c220-4454-b178-cfc57fcde90d"
 */
export const useClusterDetail = (cluster_id : String | undefined, callback:(res : AxiosResponse) => void, target:any[]=[]) => {
    const params = {
        "type" : "detail", 
        "cluster_id" : cluster_id
    }
    return useBaseApiFunction(clusterListApiUrl, "get", {"params" : params}, {},callback, target)
}



/**
 *  @returns ClusterCardで表示する情報が紐づけられたClusterのarray
 */
// export const useClusterList = (setState:SetStateAction<any>) => {
//     return useBaseApiFunction(clusterListApiUrl, "get", {"params" : {"type" : "list"}}, setState)
// }

/**
 * 引数のclusterIdに該当するクラスターが存在するかのチェック
 * hooksではないため、useEfffectの中で使える
 * @param clusterId 
 * @returns boolean 
 */
export const clusterExistCheck = (clusterId:string) => {
    return axios.get(checkClusterExistApiUrl, {"params" : {"id" : clusterId}})
}

export const useClusterCreate = (data:any, callback:(res : AxiosResponse) => void) => {
    return useBaseApiFunction(createCondClusterApiUrl, "post", {}, data, callback);
}