import { ENV } from "../config/env";

type RequestOptions = { path:string; method?:"GET"|"POST"; data?:unknown };
export function request<T>({path,method="GET",data}:RequestOptions):Promise<T>{
  if(!ENV.apiBaseUrl) return Promise.reject(new Error("Live service is not configured."));
  return new Promise((resolve,reject)=>wx.request({
    url:`${ENV.apiBaseUrl}${path}`, method, data,
    header:{"content-type":"application/json"}, timeout:45000,
    success(result){if(result.statusCode>=200&&result.statusCode<300)resolve(result.data as T);else reject(new Error("The service is temporarily unavailable."));},
    fail(){reject(new Error("Check the network and try again."));}
  }));
}
