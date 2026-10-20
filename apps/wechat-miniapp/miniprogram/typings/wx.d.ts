declare namespace WechatMiniprogram { interface BaseEvent { currentTarget:{dataset:Record<string,string>} } interface Input { detail:{value:string} } }
declare const wx:any;
declare function Page(options:Record<string,unknown>):void;
declare function App(options:Record<string,unknown>):void;
