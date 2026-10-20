import { starterMotions } from "../../data/catalog";
Page({data:{motions:starterMotions},choose(event:WechatMiniprogram.BaseEvent){wx.navigateTo({url:`/pages/briefing/index?id=${event.currentTarget.dataset.id}&side=pro`});}});
