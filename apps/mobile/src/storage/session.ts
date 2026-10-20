import type { Side } from "../../../../packages/junior-contracts/src/index";
export type NativeTurn={user:string;opponent:string;strength:string;next:string};
export type NativeSession={id:string;topicId:string;title:string;side:Side;turns:NativeTurn[]};
let current:NativeSession|null=null;
export const sessionRepository={read:()=>current,write:(value:NativeSession)=>{current=value;},clear:()=>{current=null;}};
// Stage 3 replaces this in-memory adapter with encrypted device storage + optional account sync.
