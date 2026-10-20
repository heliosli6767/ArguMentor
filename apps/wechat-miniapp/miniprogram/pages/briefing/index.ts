import { starterMotions } from "../../data/catalog";
Page({
  data:{motion:starterMotions[0],side:"pro" as "pro"|"con"},
  onLoad(query:{id?:string;side?:"pro"|"con"}){this.setData({motion:starterMotions.find(item=>item.id===query.id)||starterMotions[0],side:query.side||"pro"});},
  setPro(){this.setData({side:"pro"});},setCon(){this.setData({side:"con"});},
  start(){const {motion,side}=this.data;wx.setStorageSync("argumentor.junior.session.v1",{topicId:motion.id,title:motion.title,side,turns:[],startedAt:new Date().toISOString()});wx.navigateTo({url:"/pages/debate/index"});}
});
