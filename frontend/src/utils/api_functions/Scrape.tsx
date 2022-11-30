import { baseApiFunction } from "./BaseApiFunction";
import axios, { AxiosResponse } from "axios";
import { scrapeApiUrl } from "../api_urls";

export const scrape = (clusterId:string, callback:(res:AxiosResponse) => void, cookies : {[x:string]:string}) => {
    return baseApiFunction(scrapeApiUrl, "post", {}, {clusterId : clusterId}, callback, cookies);
}
