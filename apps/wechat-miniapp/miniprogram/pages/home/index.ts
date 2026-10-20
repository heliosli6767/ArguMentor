Page({
  data:{hasSession:false},
  onShow(){this.setData({hasSession:Boolean(wx.getStorageSync("argumentor.junior.session.v1"))});},
  openTopics(){wx.switchTab({url:"/pages/topics/index"});},
  openLearn(){wx.switchTab({url:"/pages/learn/index"});},
  resume(){wx.navigateTo({url:"/pages/debate/index"});}
});
