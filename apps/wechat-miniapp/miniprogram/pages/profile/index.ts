import { sessionStore } from "../../store/session";
Page({clear(){wx.showModal({title:"Clear local practice?",content:"This removes the unfinished practice from this device.",success(result){if(result.confirm){sessionStore.clear();wx.showToast({title:"Cleared"});}}});}});
