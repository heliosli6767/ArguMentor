import { sessionStore, type MiniSession } from "../../store/session";
const phases=["Constructive","Rebuttal","Summary","Final focus"];
const frames=["I think … because … For example … This matters because …","You said …, but … because …","This debate comes down to … It matters more because …","To sum up, choose … because …"];
Page({
  data:{session:null as MiniSession|null,text:"",phase:phases[0],frame:frames[0],complete:false},
  onShow(){const session=sessionStore.read();if(!session){wx.showToast({title:"Choose a motion first",icon:"none"});return;}const round=session.turns.length;this.setData({session,phase:phases[Math.min(round,3)],frame:frames[Math.min(round,3)],complete:round>=4});},
  input(event:WechatMiniprogram.Input){this.setData({text:event.detail.value});},
  submit(){const session=this.data.session;if(!session||!this.data.text.trim())return;const round=session.turns.length;session.turns.push({round:round+1,user:this.data.text.trim(),opponent:round===3?"Thank you. Which reason should decide the debate?":"The other side asks whether your example proves the whole claim.",strength:round===0?"You stated a position that answers the motion.":"You continued the debate instead of starting a new topic.",next:round===0?"Add one specific example and explain the link.":"Compare the two impacts directly."});sessionStore.write(session);this.setData({session,text:"",phase:phases[Math.min(round+1,3)],frame:frames[Math.min(round+1,3)],complete:session.turns.length>=4});},
  review(){wx.navigateTo({url:"/pages/review/index"});}
});
