import { sessionStore } from "../../store/session";
Page({data:{session:sessionStore.read()},again(){wx.switchTab({url:"/pages/topics/index"});},openLearn(){wx.switchTab({url:"/pages/learn/index"});}});
