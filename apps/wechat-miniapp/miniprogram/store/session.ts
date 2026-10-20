export type MiniTurn={round:number;user:string;opponent:string;strength:string;next:string};
export type MiniSession={topicId:string;title:string;side:"pro"|"con";turns:MiniTurn[];startedAt:string};
const KEY="argumentor.junior.session.v1";
export const sessionStore={
  read():MiniSession|null{try{return wx.getStorageSync(KEY)||null;}catch{return null;}},
  write(value:MiniSession){wx.setStorageSync(KEY,value);},
  clear(){wx.removeStorageSync(KEY);}
};
