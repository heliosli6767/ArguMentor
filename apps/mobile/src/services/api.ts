const runtime=globalThis as typeof globalThis&{process?:{env?:Record<string,string|undefined>}};
const baseUrl=runtime.process?.env?.EXPO_PUBLIC_API_BASE_URL||"";
export async function apiRequest<T>(path:string,init?:RequestInit):Promise<T>{
  if(!baseUrl)throw new Error("Live service is not configured.");
  const response=await fetch(`${baseUrl}${path}`,{...init,headers:{"content-type":"application/json",...init?.headers}});
  const value=await response.json();
  if(!response.ok)throw new Error(value?.error||"The service is temporarily unavailable.");
  return value as T;
}
