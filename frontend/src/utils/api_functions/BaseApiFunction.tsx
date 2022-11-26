import { useCookies } from "react-cookie";
import { useState, useEffect, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router";

import { refreshTokenObtainApiUrl } from "../api_urls";

/**
 * 基本的なAPI通信を行うreact hook。
 * 特別な処理が必要なAPI通信はこのhookを利用したカスタムhookを利用する。
 * 通信を行う前にcookie値が使用可能かを確かめ、使用不可能であればrefreshtokenを取得する。
 * @param api_url 
 * @param method 
 * @param config Http通信のパラメータ(ヘッダなど)
 * @param callback requestの帰り値を引数に取る関数
 * @returns api_urlから返された値をもつPromiseオブジェクト
 */
export const useBaseApiFunction = async(
        api_url:string, 
        method:"get"|"post", 
        config:any={}, 
        data:any={},
        callback:(res : AxiosResponse) => void, 
        targetState:any[] = [], 
    ) => {
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies();
    const [refreshed, setRefreshed] = useState(false);

    if (cookies.accesstoken){
        const headers_with_token = {headers:{"Authorization": "Bearer " + cookies.accesstoken, ...config.headers!}};
        config =  {...config, ...headers_with_token}
    }

    const request_to_backend = () => {
        if (method === "get"){
            return axios.get(api_url, config)
        }else{
            return axios.post(api_url, config, data);
        }
    }

    useEffect(()=>{
        request_to_backend()
            .then((res)=>{
                callback(res);
            })
            .catch((e)=>{
                if (! refreshed && cookies.refreshtoken) {
                    axios.post(refreshTokenObtainApiUrl, {"refresh" : cookies.refreshtoken})
                        .then(res => {
                            console.log("refresh token がセットされました");
                            setCookies("accesstoken", res.data.access, {path:"/"});
                            setRefreshed(true);
                        })
                        .catch( e => {
                            navigate("/login");
                        })
                    console.log("refreshtokenがある場合");
                    request_to_backend()
                        .then((res)=>{
                            callback(res);
                        })
                }
            })
    }, targetState)
}


/**
 * react hooksではないAPIの関数
 * accesstokenが期限切れの場合はうまく機能しない(要改善)
 * @param api_url 
 * @param method 
 * @param config 
 * @param data 
 * @param callback 
 * @param cookies 
 * @returns 
 */
export const baseApiFunction = async(
    api_url:string, 
    method:"get"|"post", 
    config:any={}, 
    data:any={},
    callback:(res : AxiosResponse) => void, 
    cookies : {[x:string]:string}
    ) => {
        if (cookies.accesstoken){
            const headers_with_token = {headers:{"Authorization": "Bearer " + cookies.accesstoken, ...config.headers!}};
            config =  {...config, ...headers_with_token}
        }

        if (method === "get"){
            return axios.get(api_url, config)
                .then(res => {
                    callback(res)
                })
        }else{
            return axios.post(api_url, config, data)
                .then(res => {
                    callback(res)
                })
        }
    }
