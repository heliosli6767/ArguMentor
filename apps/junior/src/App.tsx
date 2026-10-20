import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock3, Download, Flag, GraduationCap, Headphones, History, LayoutGrid, Lightbulb, Menu, Mic, MicOff, Network, Pause, Play, Plus, RotateCcw, Search, Settings2, ShieldCheck, Target, Volume2, X } from "lucide-react";
import { levels, topics, phases, type Topic } from "./curriculum";
import { addTurn, createSession, demoTurn, recommendedLevel, wordCount, type Session, type Side, type Turn, type TurnRequest } from "./learning";
const ArgumentMap = lazy(() => import("./ArgumentMap"));
type View = "home" | "topics" | "path" | "history" | "room" | "review";
type Stored = { sessions: Session[]; active: Session | null };
const STORE = "argumentor-junior.v1";
const readStore = (): Stored => {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) || "{}");
    return { sessions: Array.isArray(value.sessions) ? value.sessions.filter((s: Session) => s.id && topics.some(t => t.id === s.topicId) && Array.isArray(s.turns) && s.state).slice(0, 100) : [], active: value.active?.id && value.active?.state && topics.some(t => t.id === value.active?.topicId) && Array.isArray(value.active?.turns) ? value.active : null };
  } catch { return { sessions: [], active: null }; }
};
const navItems: { view: View; label: string; Icon: typeof LayoutGrid }[] = [
  { view: "home", label: "练习空间", Icon: LayoutGrid },
  { view: "topics", label: "议题书架", Icon: BookOpen },
  { view: "path", label: "成长路径", Icon: GraduationCap },
  { view: "history", label: "练习记录", Icon: History }
];
function saveFile(data: string, name: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Mark() { return <span className="brand-mark"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="m7 25 9-17h4l9 17h-6l-5-10-5 10z" fill="currentColor"/><path d="M15 24h6v5h-6z" fill="#9cb9e0"/></svg></span>; }
function App() {
  const [stored] = useState(readStore);
  const [sessions, setSessions] = useState(stored.sessions);
  const [active, setActive] = useState<Session | null>(stored.active);
  const [view, setView] = useState<View>("home");
  const [review, setReview] = useState<Session | null>(null);
  const [setup, setSetup] = useState<Topic | null>(null);
  const [side, setSide] = useState<Side>("pro");
  const [demo, setDemo] = useState(true);
  const [status, setStatus] = useState({ live: false, provider: null as string | null });
  const [settings, setSettings] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(0);
  const [notification, setNotification] = useState("");
  const level = recommendedLevel(sessions);
  const recommended = topics.find(t => t.level === level && !sessions.some(s => s.topicId === t.id && s.completedAt)) || topics.find(t => t.level === level)!;
  const activeTopic = topics.find(t => t.id === active?.topicId);
  const completed = sessions.filter(s => s.completedAt);
  useEffect(() => {
    fetch("/api/status").then(r => r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : { live: false, provider: null }).then(v => { setStatus(v); setDemo(!v.live); }).catch(() => {});
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ sessions: sessions.slice(0,100), active })); }
    catch { setNotification("浏览器存储已满。请导出练习记录；本次记录暂时只能保留在当前页面。"); }
  }, [sessions, active]);
  useEffect(() => { if (notification) { const timer = setTimeout(() => setNotification(""), 6000); return () => clearTimeout(timer); } }, [notification]);
  function navigate(next: View) { setView(next); setMobileNav(false); window.scrollTo({ top: 0 }); }
  function start() {
    if (!setup) return;
    const session = createSession(setup, side);
    if (active && active.turns.length && !active.completedAt) setSessions(current => [active, ...current.filter(s => s.id !== active.id)]);
    setActive(session); setSetup(null); navigate("room");
  }
  function onTurn(turn: Turn) {
    if (!active) return;
    const next = addTurn(active, turn); setActive(next);
    if (next.completedAt) { setSessions(current => [next, ...current.filter(s => s.id !== next.id)]); setReview(next); }
  }
  const title = view === "room" ? "Debate studio" : view === "review" ? "A moment to reflect" : view === "topics" ? "Find a question worth asking." : view === "path" ? "One small step at a time." : view === "history" ? "Every conversation counts." : "A little practice.\nA clearer voice.";
  const zhTitle = view === "home" ? "从一个小观点，开始一场好对话。" : view === "topics" ? "从熟悉的生活出发，让思考一点点长大。" : view === "path" ? "每个阶段，只专注一件值得练习的事。" : view === "history" ? "留住你的想法，也看见每一次进步。" : "";
  return <div className="app-shell">
    <button className="mobile-menu icon-button" aria-label="打开导航" onClick={() => setMobileNav(!mobileNav)}><Menu size={22}/></button>
    {mobileNav && <button className="nav-scrim" aria-label="关闭导航" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <button className="brand" onClick={() => navigate("home")}><Mark/><span>ArguMentor<small>Junior</small></span></button>
      <div className="sidebar-caption">Your thinking space</div>
      <nav>{navItems.map(({ view: next, label, Icon }) => <button key={next} className={`nav-item ${view === next ? "active" : ""}`} onClick={() => navigate(next)}><Icon size={18}/><span>{label}</span>{view === next && <i/>}</button>)}</nav>
      <div className="sidebar-progress"><div className="progress-emblem"><Target size={20}/></div><span>慢慢来，也在向前。</span><p>先让一个理由变清楚。</p><button onClick={() => navigate("path")}>Level {level} · {levels[level-1].en}<ChevronRight size={14}/></button></div>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setSettings(true)}><Settings2 size={18}/>家长设置</button><div className="profile"><div className="avatar">J</div><div><strong>Junior learner</strong><span>我的英语练习空间</span></div><span className="profile-dot"/></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><span className="breadcrumb">My space</span><ChevronRight size={13}/><span>{navItems.find(n => n.view === view)?.label || (view === "room" ? "辩论练习" : "练习复盘")}</span></div><button className="connection" onClick={() => setSettings(true)}><i className={status.live ? "online" : ""}/>{status.live ? "对话已连接" : "示范体验"}<Settings2 size={13}/></button></header>
      {view !== "room" && view !== "review" && <div className="page-heading"><div><h1>{title}</h1><p>{zhTitle}</p></div><div className="heading-note"><Headphones size={18}/><span>English practice<br/><strong>At your own pace</strong></span></div></div>}
      {view === "home" && <>
        {active && !active.completedAt && <button className="resume-banner" onClick={() => navigate("room")}><Play size={16}/><span>继续上次的练习：{activeTopic?.zh}</span><span>第 {active.turns.length + 1} / 4 轮</span><ChevronRight size={16}/></button>}
        <section className="featured">
          <div className="featured-content"><div className="topic-meta"><span className="level-pill">Level {recommended.level}</span><span>{recommended.category}</span></div><h2>{recommended.title}</h2><p className="topic-translation">{recommended.zh}</p><div className="lesson-details"><span><Clock3 size={15}/>{levels[recommended.level - 1].minutes} 分钟</span><span><Target size={15}/>{levels[recommended.level-1].focus}</span></div><button className="primary" onClick={() => { setSide("pro"); setSetup(recommended); }}>开始今天的练习<ArrowRight size={17}/></button><p className="featured-footnote">先表达，再倾听。没有标准立场。</p></div>
          <div className="conversation-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-floor"/><div className="speech-sculpture sculpture-back"><span/><span/><span/></div><div className="speech-sculpture sculpture-front"><i/><i/></div><div className="art-caption">Two sides.<br/>A wider perspective.</div></div>
        </section>
        <div className="home-bottom"><section className="today-focus"><div className="section-heading"><h3>今天，只练好这一点</h3><span className="soft-icon"><Lightbulb size={18}/></span></div><p className="focus-english">{level === 1 ? "Give your opinion a reason." : levels[level-1].en + "."}</p><p className="muted">{levels[level-1].goal}</p><div className="sentence-pattern">I think <span>…</span> because <span>…</span></div><button className="text-button" onClick={() => navigate("path")}>看看接下来会学什么<ChevronRight size={14}/></button></section>
        <section className="rhythm"><div className="section-heading"><h3>你的练习节奏</h3><span className="muted">最近 7 天</span></div><div className="week">{Array.from({length:7},(_,i)=>{ const day=new Date(); day.setDate(day.getDate()-6+i); const practiced=completed.some(s=>new Date(s.completedAt!).toDateString()===day.toDateString()); return <div key={i} className={i === 6 ? "today" : ""}><span>{["日","一","二","三","四","五","六"][day.getDay()]}</span><i className={practiced ? "done" : ""}>{practiced ? <Check size={14}/> : i === 6 ? <span/> : null}</i></div>;})}</div><div className="rhythm-footer"><div><strong>{completed.length}</strong><span>次完整练习</span></div><p>{completed.length ? "每次开口，都留下了自己的思考。" : "第一场好对话，\n从今天开始。"}</p></div></section></div>
        <section className="more-topics"><div className="section-heading"><h3>也可以从这些问题开始</h3><button className="text-button" onClick={() => navigate("topics")}>全部议题<ChevronRight size={15}/></button></div><div className="topic-preview-grid">{topics.filter(t=>t.id!==recommended.id&&t.level===level).slice(0,3).map(t=><TopicCard key={t.id} topic={t} choose={()=>{setSide("pro");setSetup(t);}}/>)}</div></section>
      </>}
      {view === "topics" && <section><div className="library-controls"><div className="filter-tabs"><button className={!filter ? "selected" : ""} onClick={()=>setFilter(0)}>全部</button>{levels.map(l=><button key={l.id} className={filter===l.id?"selected":""} onClick={()=>setFilter(l.id)}>Level {l.id}</button>)}</div><label className="search"><Search size={16}/><input aria-label="搜索议题" placeholder="搜索议题" value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className="library-grid">{topics.filter(t=>(!filter||t.level===filter)&&`${t.title}${t.zh}${t.category}`.toLowerCase().includes(query.toLowerCase())).map(t=><TopicCard key={t.id} topic={t} choose={()=>{setSide("pro");setSetup(t);}}/>)}</div>{!topics.some(t=>(!filter||t.level===filter)&&`${t.title}${t.zh}${t.category}`.toLowerCase().includes(query.toLowerCase()))&&<div className="empty-state"><Search/><h3>没有找到这个问题</h3><p>换一个关键词，或看看其他等级。</p><button className="secondary" onClick={()=>{setFilter(0);setQuery("");}}>显示全部议题</button></div>}</section>}
      {view === "path" && <section className="learning-path"><div className="path-intro"><Target size={19}/><p>建议从 Level {level} 开始。每级完成两次各项达到 3 分的正式练习后，系统推荐下一级。示范练习不参与升级，也可以由家长手动选择等级。</p></div>{levels.map(l=><article className={`path-step ${l.id===level?"current":""}`} key={l.id}><div className="path-number">{l.id < level ? <Check size={22}/> : String(l.id).padStart(2,"0")}</div><div className="path-body"><div className="path-title"><h2>{l.title}</h2>{l.id===level&&<span className="level-pill">当前建议</span>}</div><h3>{l.en}</h3><p>{l.goal}</p><div className="path-tags"><span>{l.words} 词 / 发言</span><span>每轮一个挑战</span><span>{l.minutes} 分钟左右</span></div></div><button className="round-button" aria-label={`浏览 Level ${l.id} 议题`} onClick={()=>{setFilter(l.id);navigate("topics");}}><ArrowUpRight size={20}/></button></article>)}</section>}
      {view === "history" && <section><div className="section-heading"><h3>{sessions.length ? `${sessions.length} 场对话` : "你的练习记录"}</h3><button className="secondary small" disabled={!sessions.length} onClick={()=>saveFile(JSON.stringify({version:1,sessions},null,2),"argumentor-practice.json")}><Download size={15}/>导出记录</button></div>{!sessions.length ? <div className="empty-state"><div className="empty-symbol"><History size={32}/></div><h3>这里会留下你思考的足迹。</h3><p>完成一次练习，就能回看发言、教练反馈和论证图。</p><button className="primary" onClick={()=>{setSide("pro");setSetup(recommended);}}>开始第一场练习<ArrowRight size={16}/></button></div> : <div className="history-list">{sessions.map(s=><button key={s.id} className="history-row" onClick={()=>{setReview(s);navigate("review");}}><span className="history-icon"><BookOpen size={20}/></span><div><h3>{topics.find(t=>t.id===s.topicId)?.title}</h3><p>{new Date(s.startedAt).toLocaleDateString("zh-CN")} · Level {s.level} · {s.turns.length} 轮 · {s.completedAt ? "已完成" : "未完成"}</p></div><span className="mode-tag">{s.turns.every(t=>t.mode==="demo")?"示范练习":"正式练习"}</span><ChevronRight size={18}/></button>)}</div>}</section>}
      {view === "room" && active && activeTopic && <DebateRoom key={active.id} session={active} topic={activeTopic} demo={active.turns.length ? active.turns[0].mode==="demo" : demo} onTurn={onTurn} onPause={()=>navigate("home")} onReview={()=>{setReview(active);navigate("review");}}/>}
      {view === "review" && review && <Review session={review} onBack={()=>navigate("history")} again={()=>{setSide(review.side==="pro"?"con":"pro");setSetup(topics.find(t=>t.id===review.topicId)!);}}/>}
      <footer className="page-footer"><span>ArguMentor Junior</span><span>Think clearly. Listen kindly.</span></footer>
    </main>
    {setup && <Modal title="准备好表达你的看法了吗？" onClose={()=>setSetup(null)}><div className="setup-topic"><span className="level-pill">Level {setup.level}</span><h2>{setup.title}</h2><p>{setup.zh}</p></div><p className="setup-context">{setup.context}</p><div className="setup-label">选择你的立场</div><div className="side-choices"><button className={side==="pro"?"chosen":""} onClick={()=>setSide("pro")}><span>I agree</span><strong>我支持</strong><i>{side==="pro"&&<Check size={16}/>}</i></button><button className={side==="con"?"chosen":""} onClick={()=>setSide("con")}><span>I disagree</span><strong>我反对</strong><i>{side==="con"&&<Check size={16}/>}</i></button></div><div className="setup-label">几个会用到的词</div><div className="vocab-list">{setup.vocabulary.map(([en,zh])=><span key={en}><strong>{en}</strong>{zh}</span>)}</div><div className="session-format"><Clock3 size={17}/><span>约 {levels[setup.level-1].minutes} 分钟 · 4 轮简化 Public Forum</span></div><label className="demo-choice"><input type="checkbox" checked={demo} disabled={!status.live} onChange={e=>setDemo(e.target.checked)}/><span>示范练习<small>使用预设对方观点与结构提示，不提供 AI 评分。</small></span></label>{!status.live&&<p className="small muted">接入模型后可开启自由辩论。当前可以完整体验示范流程。</p>}<button className="primary full" onClick={start}>进入练习<ArrowRight size={17}/></button>{active&&!active.completedAt&&<p className="small muted">当前练习将保存为未完成记录。</p>}</Modal>}
    {settings && <Modal title="家长设置" onClose={()=>setSettings(false)}><div className="settings-status"><ShieldCheck size={24}/><div><h3>{status.live ? `${status.provider} 已连接` : "当前使用示范模式"}</h3><p>孩子的界面不接触模型密钥。</p></div></div><h3 className="settings-heading">连接自由辩论</h3><p className="settings-copy">本地版本：在 <code>apps/junior/.env.local</code> 中配置 <code>OPENAI_API_KEY</code> 或 <code>OPENROUTER_API_KEY</code>，再重启本项目服务。模型名称可用 <code>DEBATE_MODEL</code> 指定。</p><p className="settings-copy">线上展示版提供示范练习。自由辩论请使用已配置模型的本地版本。</p><h3 className="settings-heading">练习与记录</h3><p className="settings-copy">练习记录保存在当前浏览器。没有注册、公共排名或公开分享。语音输入调用浏览器语音识别，可能由浏览器供应商在线处理；本应用不保存音频。语音转写可先修改，再提交给对话模型。</p><button className="secondary full" disabled={!sessions.length} onClick={()=>saveFile(JSON.stringify({version:1,sessions},null,2),"argumentor-practice.json")}><Download size={16}/>导出本机练习记录</button><h3 className="settings-heading">关于这个版本</h3><p className="settings-copy">基于 ArguMentor 辩论内核，借鉴 DebateSim 的逐轮教学流程，使用 Argdown 解析论证关系。练习采用简化赛制；评分用于学习反馈，不是正式考试结果。</p></Modal>}
    {notification&&<div className="toast" role="status">{notification}</div>}
  </div>;
}
function TopicCard({topic,choose}:{topic:Topic;choose:()=>void}) {
  const Icon = topic.category==="Technology" ? Headphones : topic.category==="Our world" ? Network : BookOpen;
  return <button className={`topic-card tone-${levels[topic.level-1].color}`} onClick={choose}><div className="topic-card-top"><span className="topic-mini-icon"><Icon size={18}/></span><span>Level {topic.level}</span><ArrowUpRight size={17}/></div><h3>{topic.title}</h3><p>{topic.zh}</p><div className="topic-card-foot"><span>{topic.category}</span><span>{levels[topic.level-1].minutes} min</span></div></button>;
}
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement;
    const old=document.body.style.overflow; document.body.style.overflow="hidden";
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    const key=(e:KeyboardEvent)=>{
      if(e.key==="Escape")onClose();
      if(e.key==="Tab"){
        const items=ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),textarea,[tabindex="0"]');
        if(!items?.length)return;
        if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items[items.length-1].focus();}
        if(!e.shiftKey&&document.activeElement===items[items.length-1]){e.preventDefault();items[0].focus();}
      }
    };
    document.addEventListener("keydown",key);
    return()=>{document.body.style.overflow=old;document.removeEventListener("keydown",key);previous?.focus();};
  },[]);
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="关闭" onClick={onClose}><X size={20}/></button></div>{children}</div></div>;
}
type SpeechResult = { isFinal:boolean; 0:{transcript:string} };
type SpeechRecognitionInstance = { lang:string; continuous:boolean; interimResults:boolean; onresult:((e:{resultIndex:number;results:{length:number;[index:number]:SpeechResult}})=>void)|null; onerror:((e:{error:string})=>void)|null; onend:(()=>void)|null; start:()=>void; stop:()=>void; abort:()=>void };
function DebateRoom({session,topic,demo,onTurn,onPause,onReview}:{session:Session;topic:Topic;demo:boolean;onTurn:(turn:Turn)=>void;onPause:()=>void;onReview:()=>void}) {
  const draftKey=`argumentor-draft.${session.id}`;
  const [text,setText]=useState(()=>{try{return session.completedAt?"":localStorage.getItem(draftKey)||"";}catch{return"";}});
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[hint,setHint]=useState(false);
  const [listening,setListening]=useState(false),[interim,setInterim]=useState(""),[speaking,setSpeaking]=useState(false);
  const [seconds,setSeconds]=useState(phases[Math.min(session.turns.length,3)].seconds),[timer,setTimer]=useState(false);
  const [feedbackIndex,setFeedbackIndex]=useState<number|null>(session.turns.length?session.turns.length-1:null);
  const [tab,setTab]=useState<"coach"|"map">("coach");
  const recognizer=useRef<SpeechRecognitionInstance|null>(null);
  const busyRef=useRef(false);
  const mounted=useRef(true);
  const requestAbort=useRef<AbortController|null>(null);
  const transcriptEnd=useRef<HTMLDivElement>(null);
  const r=session.turns.length,finished=!!session.completedAt,phase=phases[Math.min(r,3)];
  const feedback=feedbackIndex!==null?session.turns[feedbackIndex]?.feedback:null;
  useEffect(()=>{if(timer&&seconds>0){const id=setTimeout(()=>setSeconds(s=>s-1),1000);return()=>clearTimeout(id);}if(seconds===0)setTimer(false);},[timer,seconds]);
  useEffect(()=>{setSeconds(phases[Math.min(r,3)].seconds);setTimer(false);setFeedbackIndex(r?r-1:null);},[r]);
  useEffect(()=>{transcriptEnd.current?.scrollIntoView({behavior:"smooth",block:"nearest"});},[r,busy]);
  useEffect(()=>{try{if(text)localStorage.setItem(draftKey,text);else localStorage.removeItem(draftKey);}catch{}},[text,draftKey]);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;requestAbort.current?.abort();recognizer.current?.abort();if("speechSynthesis"in window)window.speechSynthesis.cancel();};},[]);
  function speak(value:string){
    if(!("speechSynthesis"in window)){setError("此浏览器不支持朗读，可以阅读文字继续练习。");return;}
    window.speechSynthesis.cancel();
    if(speaking){setSpeaking(false);return;}
    const utterance=new SpeechSynthesisUtterance(value);utterance.lang="en-US";utterance.rate=0.86;
    utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setError("朗读未能启动，请检查浏览器的声音权限。");};
    setSpeaking(true);window.speechSynthesis.speak(utterance);
  }
  function microphone(){
    if(listening){recognizer.current?.stop();return;}
    const win=window as unknown as {SpeechRecognition?:new()=>SpeechRecognitionInstance;webkitSpeechRecognition?:new()=>SpeechRecognitionInstance};
    const Recognition=win.SpeechRecognition||win.webkitSpeechRecognition;
    if(!Recognition){setError("此浏览器不支持语音识别。请用 Chrome 打开本地链接，或直接输入英文。");return;}
    if("speechSynthesis"in window)window.speechSynthesis.cancel();setSpeaking(false);
    const rec=new Recognition();recognizer.current=rec;rec.lang="en-US";rec.continuous=true;rec.interimResults=true;
    rec.onresult=e=>{let partial="";for(let i=e.resultIndex;i<e.results.length;i++){const result=e.results[i];if(result.isFinal)setText(t=>(t+" "+result[0].transcript).trim());else partial+=result[0].transcript;}setInterim(partial);};
    rec.onerror=e=>{setListening(false);setInterim("");setError(e.error==="not-allowed"?"麦克风未获允许。可在浏览器中允许，或直接输入英文。":"语音识别暂时不可用，请检查网络或改用文字。");};
    rec.onend=()=>{setListening(false);setInterim("");};
    try{rec.start();setListening(true);setError("");}catch{setError("无法启动麦克风，请改用文字输入。");}
  }
  async function submit(){
    if(busyRef.current||finished||text.trim().length<2)return;
    busyRef.current=true;setBusy(true);setError("");setTimer(false);
    const input:TurnRequest={topicId:topic.id,side:session.side,level:session.level,text:text.trim(),demo,history:session.turns.map(t=>({user:t.user,opponent:t.opponent}))};
    try{
      let result;
      if(demo){await new Promise(resolve=>setTimeout(resolve,450));result=demoTurn(input);}
      else{
        requestAbort.current=new AbortController();
        const response=await fetch("/api/turn",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input),signal:AbortSignal.any([requestAbort.current.signal,AbortSignal.timeout(50000)])});
        const data=await response.json();if(!response.ok)throw new Error(data.error||"未收到反馈，请重试。");result=data;
      }
      if(!mounted.current)return;
      onTurn({...result,round:r+1,user:input.text,at:new Date().toISOString()});setText("");setHint(false);
    }catch(e){if(mounted.current)setError((e as Error).name==="TimeoutError"?"等待超时，发言已保留，请重试。":(e as Error).message);}
    finally{busyRef.current=false;if(mounted.current)setBusy(false);}
  }
  return <section className="studio">
    <div className="studio-heading"><button className="back-button" disabled={busy} onClick={onPause}><ChevronLeft size={18}/>保存并稍后继续</button><span className="mode-tag">{demo?"示范练习 · 预设对方观点":"自由辩论"}</span></div>
    <div className="studio-topic"><div><div className="topic-meta"><span className="level-pill">Level {session.level}</span><span>My position: {session.side==="pro"?"I agree":"I disagree"}</span></div><h1>{topic.title}</h1><p>{topic.zh}</p></div><div className="round-count"><strong>{Math.min(r+1,4)}</strong><span>/ 4 轮</span></div></div>
    <div className="phase-track">{phases.map((p,i)=><div key={p.name} className={`${i===r?"current":""} ${i<r?"complete":""}`}><span>{i<r?<Check size={13}/>:i+1}</span><div><strong>{p.name}</strong><small>{p.zh}</small></div></div>)}</div>
    <div className="studio-grid"><div className="conversation-panel"><div className="conversation-heading"><span><span className="live-dot"/>{finished?"本场对话已完成":"Your conversation"}</span><button className="icon-button" aria-label="朗读当前对方观点" onClick={()=>speak(session.turns.at(-1)?.opponent||topic.context)}><Volume2 size={17}/></button></div>
      <div className="transcript">
        <div className="welcome-message"><span className="speaker-avatar"><Mark/></span><div><strong>Let’s think together.</strong><p>{topic.context}</p><small>Start with your opinion and one reason. Take your time.</small></div></div>
        {session.turns.map((turn,i)=><div className="turn-pair" key={turn.at}><div className="turn-divider">{phases[i].name}</div><div className="message user-message"><span className="message-label">You</span><p>{turn.user}</p><button className="message-feedback" onClick={()=>{setFeedbackIndex(i);setTab("coach");}}>查看这一轮的反馈<ChevronRight size={12}/></button></div><div className="message opponent-message"><span className="message-label">Other side{turn.mode==="demo"&&<small>示范观点</small>}</span><p>{turn.opponent}</p><button className="text-button" onClick={()=>speak(turn.opponent)}><Volume2 size={13}/>听一遍</button></div></div>)}
        {busy&&<div className="thinking" role="status"><span/><span/><span/>正在阅读你的观点…</div>}
        <div ref={transcriptEnd}/>
      </div>
      {finished?<div className="completed-panel"><Check size={20}/><div><strong>四轮练习完成了。</strong><p>再花一点时间，回看自己最好的一个理由。</p></div><button className="primary small" onClick={onReview}>查看复盘<ArrowRight size={15}/></button></div>:<div className="composer">
        <div className="composer-heading"><label htmlFor="speech-input">现在轮到你 · {phase.zh}</label><button className={`timer ${timer?"running":""}`} onClick={()=>setTimer(!timer)} title="可选计时器，不会自动提交">{timer?<Pause size={12}/>:<Play size={12}/>} {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</button></div>
        <textarea id="speech-input" value={text} maxLength={2500} onChange={e=>setText(e.target.value)} placeholder={phase.stem} disabled={busy} rows={4}/>
        {interim&&<p className="interim">{interim}</p>}
        {hint&&<div className="hint-box"><Lightbulb size={16}/><div><strong>{phase.stem}</strong><p>{phase.hint} {levels[session.level-1].goal}</p></div></div>}
        {error&&<p className="error" role="alert">{error}</p>}
        <div className="composer-tools"><div className="button-row"><button className={`icon-button ${listening?"recording":""}`} disabled={busy} aria-label={listening?"停止录音":"开始语音输入"} onClick={microphone}>{listening?<MicOff size={19}/>:<Mic size={19}/>}</button><button className={`icon-button ${hint?"selected":""}`} title="给我一点提示" aria-label="给我一点提示" onClick={()=>setHint(!hint)}><Lightbulb size={18}/></button><span className="word-count">{wordCount(text)} 词</span></div><button className="primary small" disabled={busy||listening||text.trim().length<2} onClick={submit}>{busy?"正在分析":r===3?"完成最后一轮":"提交这一轮"}<ArrowRight size={15}/></button></div><p className="composer-note">{listening?"正在听…说完后点击停止，检查文字再提交。":`建议 ${levels[session.level-1].words} 词。可以先说，再检查文字。`}</p>
      </div>}
    </div><aside className="coach-panel"><div className="coach-tabs"><button className={tab==="coach"?"selected":""} onClick={()=>setTab("coach")}><Lightbulb size={15}/>教练笔记</button><button className={tab==="map"?"selected":""} onClick={()=>setTab("map")}><Network size={15}/>论证图</button></div>
      {tab==="map"?(session.turns.length?<Suspense fallback={<p className="empty-inline">正在整理思路…</p>}><ArgumentMap key={r} session={session}/></Suspense>:<div className="coach-empty"><Network size={28}/><h3>思路会在这里连起来</h3><p>提交第一轮后，就可以查看你的观点与对方回应。</p></div>):feedback?<div className="feedback-content"><div className="feedback-round">第 {(feedbackIndex||0)+1} 轮反馈{demo&&<span>结构提示</span>}</div><div className="coach-note positive"><span><Check size={15}/>做得好的地方</span><p>{feedback.strength}</p></div>{feedback.evidenceQuote&&<blockquote>{feedback.evidenceQuote}</blockquote>}<div className="coach-note"><span><Target size={15}/>这次改进一点</span><p>{feedback.improvement}</p></div><div className="rewrite"><span>{demo?"试试这个句型":"可以这样表达"}</span><p>{feedback.rewrite}</p><button className="text-button" onClick={()=>speak(feedback.rewrite)}><Volume2 size={13}/>听一遍</button></div><div className="language-note"><BookOpen size={15}/><p>{feedback.languageNote}</p></div><div className="next-step"><Flag size={15}/><p>{feedback.nextStep}</p></div>{feedback.scores&&<div className="mini-scores">{Object.entries(feedback.scores).map(([k,v])=><div key={k}><span>{{clarity:"清晰",reasoning:"理由",response:"回应",english:"英文"}[k]}</span><strong>{v}<small>/5</small></strong></div>)}</div>}</div>:<div className="coach-empty"><div className="coach-symbol"><Lightbulb size={26}/></div><h3>先试着说出来。</h3><p>完成这一轮后，这里会告诉你做得好的地方，以及下一步怎么改。</p><div className="first-goal"><span>本场小目标</span><strong>{levels[session.level-1].goal}</strong></div><div className="vocab-stack">{topic.vocabulary.map(([en,zh])=><div key={en}><span>{en}</span><small>{zh}</small></div>)}</div></div>}
    </aside></div>
  </section>;
}
function Review({session,onBack,again}:{session:Session;onBack:()=>void;again:()=>void}){
  const topic=topics.find(t=>t.id===session.topicId)!;
  const [tab,setTab]=useState<"notes"|"map">("notes");
  const valid=session.turns.filter(t=>t.mode==="live"&&t.feedback.scores);
  const totalWords=session.turns.reduce((sum,t)=>sum+wordCount(t.user),0);
  return <section className="review"><div className="studio-heading"><button className="back-button" onClick={onBack}><ChevronLeft size={18}/>练习记录</button><button className="secondary small" onClick={()=>saveFile(JSON.stringify(session,null,2),`debate-${topic.id}.json`)}><Download size={15}/>导出本场</button></div><div className="review-hero"><div className="review-mark"><Check size={29}/></div><h1>{session.completedAt?"Your ideas are worth hearing.":"Good thinking takes practice."}</h1><p>{session.completedAt?"你完成了一场对话。现在，让一个理由变得更好。":"这场练习还没有结束，也值得回头看看。"} </p><h2>{topic.title}</h2><div className="review-stats"><span><strong>{session.turns.length}</strong>轮表达</span><span><strong>{totalWords}</strong>个英文词</span><span><strong>{session.level}</strong>练习等级</span></div>{!valid.length&&<p className="demo-review-note">这是一场示范练习。以下为表达结构提示，不含 AI 质量评分。</p>}</div>
      {!!valid.length&&<div className="review-score-grid">{(["clarity","reasoning","response","english"] as const).map(k=>{const score=valid.reduce((sum,t)=>sum+t.feedback.scores![k],0)/valid.length;return <div key={k}><span>{{clarity:"观点清晰",reasoning:"理由与例子",response:"回应对方",english:"英文表达"}[k]}</span><strong>{score.toFixed(1)}<small>/5</small></strong><div className="score-track"><i style={{width:`${score*20}%`}}/></div></div>;})}</div>}
      <div className="review-controls"><div className="filter-tabs"><button className={tab==="notes"?"selected":""} onClick={()=>setTab("notes")}>逐轮复盘</button><button className={tab==="map"?"selected":""} onClick={()=>setTab("map")}>论证关系图</button></div><button className="secondary small" onClick={again}><RotateCcw size={15}/>换个立场再试试</button></div>
      {tab==="map"?<div className="review-map"><Suspense fallback={<p className="empty-inline">正在整理思路…</p>}><ArgumentMap session={session}/></Suspense></div>:<div className="review-notes">{session.turns.map((t,i)=><article key={i}><div className="review-note-title"><span>{String(i+1).padStart(2,"0")}</span><h3>{phases[i].name}<small>{phases[i].zh}</small></h3></div><blockquote>{t.user}</blockquote><div className="review-two-col"><div><span className="positive-text"><Check size={14}/>做得好</span><p>{t.feedback.strength}</p></div><div><span><Target size={14}/>再试一步</span><p>{t.feedback.improvement}</p></div></div><div className="review-rewrite"><span>{t.mode==="demo"?"练习句型":"改写建议"}</span><p>{t.feedback.rewrite}</p></div></article>)}</div>}
  </section>;
}
export default App;
