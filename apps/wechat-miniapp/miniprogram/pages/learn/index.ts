import { lessons } from "../../data/catalog";
Page({data:{lessons},openLesson(event:WechatMiniprogram.BaseEvent){const id=event.currentTarget.dataset.id;wx.showModal({title:"Lesson ready",content:`${id} is scaffolded for the shared content package.`,showCancel:false});}});
