export const baseApiUrl = "http://localhost:8000/api/";
export const testApiUrl = baseApiUrl + "test/"

// スクレイピングのためのurl
export const scrapeApiUrl = baseApiUrl + "scrape/"

export const conditionsApiUrl = baseApiUrl + "conditions/"

export const checkClusterExistApiUrl =  baseApiUrl + "cluster/exists";

// アカウントに紐づいた条件クラスターを取得するためのurl
export const clusterListApiUrl = baseApiUrl + "cluster/list"

export const createCondClusterApiUrl = baseApiUrl + "cluster/create/"

// cookie値となるトークンを得るためのurl
export const tokenObtainApiUrl = baseApiUrl + "token/"
// トークンの有効期限が切れた際にトークンを更新するためのurl
export const refreshTokenObtainApiUrl = baseApiUrl + "token/refresh/"

