import axios, { Axios } from "axios";
import { Cookies } from "react-cookie";
import { CookieSetOptions } from "universal-cookie";
import { refreshTokenObtainApiUrl } from "../api_urls";


export const refreshAccessToken = (cookies:{[x:string]:any}, setCookies:(name: string, value: any, options?: CookieSetOptions | undefined) => void) => {
    if (cookies.refreshtoken){
        axios.post(refreshTokenObtainApiUrl, {"refresh" : cookies.refreshtoken})
        .then(res => {
            setCookies("accesstoken", res.data.access, {path:"/"});
        })
        .catch( e => {
            // 別のウィンドウで開く
            console.log("別のウィンドウでログインページを開く");
        })
    }
}
