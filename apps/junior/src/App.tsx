import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock3, Download, Flag, GraduationCap, Headphones, History, LayoutGrid, Lightbulb, Menu, Mic, MicOff, Network, Pause, Play, Plus, RotateCcw, Search, Settings2, ShieldCheck, Target, Volume2, X } from "lucide-react";
import { levels, topics, phases, type Topic } from "./curriculum";
import { addTurn, createSession, demoTurn, recommendedLevel, wordCount, type Session, type Side, type Turn, type TurnRequest } from "./learning";
import Academy from "./Academy";
import Briefing from "./Briefing";
import { getRoundCoaching, getSessionReport } from "./pedagogy";
const ArgumentMap = lazy(() => import("./ArgumentMap"));
type View = "home" | "academy" | "topics" | "path" | "history" | "briefing" | "room" | "review";
type Stored = { sessions: Session[]; active: Session | null };
const STORE = "argumentor-junior.v1";
const readStore = (): Stored => {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) || "{}");
    return { sessions: Array.isArray(value.sessions) ? value.sessions.filter((s: Session) => s.id && topics.some(t => t.id === s.topicId) && Array.isArray(s.turns) && s.state).slice(0, 100) : [], active: value.active?.id && value.active?.state && topics.some(t => t.id === value.active?.topicId) && Array.isArray(value.active?.turns) ? value.active : null };
  } catch { return { sessions: [], active: null }; }
};
const navItems: { view: View; label: string; Icon: typeof LayoutGrid }[] = [
  { view: "home", label: "Practice hub", Icon: LayoutGrid },
  { view: "academy", label: "Learning hub", Icon: GraduationCap },
  { view: "topics", label: "Motion library", Icon: BookOpen },
  { view: "path", label: "Level path", Icon: Target },
  { view: "history", label: "Practice history", Icon: History }
];
function saveFile(data: string, name: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const visibleMeaning = (value: string) => /^[\x00-\x7F]+$/.test(value) ? value : "Try this word in one sentence.";
function Mark() { return <span className="brand-mark"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="m7 25 9-17h4l9 17h-6l-5-10-5 10z" fill="currentColor"/><path d="M15 24h6v5h-6z" fill="#9cb9e0"/></svg></span>; }
function App() {
  const [stored] = useState(readStore);
  const [sessions, setSessions] = useState(stored.sessions);
  const [active, setActive] = useState<Session | null>(stored.active);
  const [view, setView] = useState<View>("home");
  const [review, setReview] = useState<Session | null>(null);
  const [setup, setSetup] = useState<Topic | null>(null);
  const [briefing, setBriefing] = useState<{topic:Topic;side:Side}|null>(null);
  const [academyLesson, setAcademyLesson] = useState<string|null>(null);
  const [side, setSide] = useState<Side>("pro");
  const [demo, setDemo] = useState(true);
  const [status, setStatus] = useState({ live: false, transcription: false, provider: null as string | null });
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
    fetch("/api/status").then(r => r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : { live: false, transcription: false, provider: null }).then(v => { setStatus(v); setDemo(!v.live); }).catch(() => {});
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ sessions: sessions.slice(0,100), active })); }
    catch { setNotification("Browser storage is full. Export your history; this practice can only stay on this page for now."); }
  }, [sessions, active]);
  useEffect(() => { if (notification) { const timer = setTimeout(() => setNotification(""), 6000); return () => clearTimeout(timer); } }, [notification]);
  function navigate(next: View) { setView(next); setMobileNav(false); window.scrollTo({ top: 0 }); }
  function start(topic=setup, chosenSide=side) {
    if (!topic) return;
    const session = createSession(topic, chosenSide);
    if (active && active.turns.length && !active.completedAt) setSessions(current => [active, ...current.filter(s => s.id !== active.id)]);
    setActive(session); setSetup(null); setBriefing(null); navigate("room");
  }
  function onTurn(turn: Turn) {
    if (!active) return;
    const next = addTurn(active, turn); setActive(next);
    if (next.completedAt) { setSessions(current => [next, ...current.filter(s => s.id !== next.id)]); setReview(next); }
  }
  const title = view === "room" ? "Debate studio" : view === "review" ? "A moment to reflect" : view === "topics" ? "Find a question worth asking." : view === "path" ? "One small step at a time." : view === "history" ? "Every conversation counts." : "A little practice.\nA clearer voice.";
  const subTitle = view === "home" ? "Start with one idea. Build a thoughtful conversation." : view === "topics" ? "Begin with familiar questions, then grow the challenge." : view === "path" ? "One level, one important skill at a time." : view === "history" ? "Keep your ideas and notice your progress." : "";
  return <div className="app-shell">
    <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileNav(!mobileNav)}><Menu size={22}/></button>
    {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <button className="brand" onClick={() => navigate("home")}><Mark/><span>ArguMentor<small>Junior</small></span></button>
      <div className="sidebar-caption">Your thinking space</div>
      <nav>{navItems.map(({ view: next, label, Icon }) => <button key={next} className={`nav-item ${view === next ? "active" : ""}`} onClick={() => {if(next==="academy")setAcademyLesson(null);navigate(next);}}><Icon size={18}/><span>{label}</span>{view === next && <i/>}</button>)}</nav>
      <div className="sidebar-progress"><div className="progress-emblem"><Target size={20}/></div><span>Small steps move you forward.</span><p>Make one reason clear first.</p><button onClick={() => navigate("path")}>Level {level} · {levels[level-1].title}<ChevronRight size={14}/></button></div>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setSettings(true)}><Settings2 size={18}/>Parent settings</button><div className="profile"><div className="avatar">J</div><div><strong>Junior learner</strong><span>My English practice space</span></div><span className="profile-dot"/></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><span className="breadcrumb">My space</span><ChevronRight size={13}/><span>{navItems.find(n => n.view === view)?.label || (view === "room" ? "Debate practice" : view === "briefing" ? "Pre-debate briefing" : "Practice review")}</span></div><button className="connection" onClick={() => setSettings(true)}><i className={status.live ? "online" : ""}/>{status.live ? "Live debate connected" : "Demonstration mode"}<Settings2 size={13}/></button></header>
      {!(["room","review","academy","briefing"] as View[]).includes(view) && <div className="page-heading"><div><h1>{title}</h1><p>{subTitle}</p></div><div className="heading-note"><Headphones size={18}/><span>English practice<br/><strong>At your own pace</strong></span></div></div>}
      {view === "home" && <>
        {active && !active.completedAt && <button className="resume-banner" onClick={() => navigate("room")}><Play size={16}/><span>Resume: {activeTopic?.title}</span><span>Round {active.turns.length + 1} of 4</span><ChevronRight size={16}/></button>}
        <section className="featured">
          <div className="featured-content"><div className="topic-meta"><span className="level-pill">Level {recommended.level}</span><span>{recommended.category}</span></div><h2>{recommended.title}</h2><p className="topic-translation">{recommended.context}</p><div className="lesson-details"><span><Clock3 size={15}/>{levels[recommended.level - 1].minutes} minutes</span><span><Target size={15}/>{levels[recommended.level-1].focus}</span></div><button className="primary" onClick={() => { setSide("pro"); setSetup(recommended); }}>Start today’s practice<ArrowRight size={17}/></button><p className="featured-footnote">Speak first, then listen. There is no required position.</p></div>
          <div className="conversation-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-floor"/><div className="speech-sculpture sculpture-back"><span/><span/><span/></div><div className="speech-sculpture sculpture-front"><i/><i/></div><div className="art-caption">Two sides.<br/>A wider perspective.</div></div>
        </section>
        <div className="home-bottom"><section className="today-focus"><div className="section-heading"><h3>One skill for today</h3><span className="soft-icon"><Lightbulb size={18}/></span></div><p className="focus-english">{levels[level-1].title}</p><p className="muted">{levels[level-1].goal}</p><div className="sentence-pattern">I think <span>…</span> because <span>…</span></div><button className="text-button" onClick={() => navigate("path")}>See what comes next<ChevronRight size={14}/></button></section>
        <section className="rhythm"><div className="section-heading"><h3>Your practice rhythm</h3><span className="muted">Last 7 days</span></div><div className="week">{Array.from({length:7},(_,i)=>{ const day=new Date(); day.setDate(day.getDate()-6+i); const practiced=completed.some(s=>new Date(s.completedAt!).toDateString()===day.toDateString()); return <div key={i} className={i === 6 ? "today" : ""}><span>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][day.getDay()]}</span><i className={practiced ? "done" : ""}>{practiced ? <Check size={14}/> : i === 6 ? <span/> : null}</i></div>;})}</div><div className="rhythm-footer"><div><strong>{completed.length}</strong><span> complete practices</span></div><p>{completed.length ? "Every response leaves a trace of your thinking." : "Your first thoughtful debate starts today."}</p></div></section></div>
        <section className="more-topics"><div className="section-heading"><h3>More questions to explore</h3><button className="text-button" onClick={() => navigate("topics")}>All motions<ChevronRight size={15}/></button></div><div className="topic-preview-grid">{topics.filter(t=>t.id!==recommended.id&&t.level===level).slice(0,3).map(t=><TopicCard key={t.id} topic={t} choose={()=>{setSide("pro");setSetup(t);}}/>)}</div></section>
      </>}
      {view === "academy" && <Academy initialLessonId={academyLesson}/>}
      {view === "topics" && <section><div className="library-controls"><div className="filter-tabs"><button className={!filter ? "selected" : ""} onClick={()=>setFilter(0)}>All</button>{levels.map(l=><button key={l.id} className={filter===l.id?"selected":""} onClick={()=>setFilter(l.id)}>Level {l.id}</button>)}</div><label className="search"><Search size={16}/><input aria-label="Search motions" placeholder={`Search ${topics.length} motions`} value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className="library-grid">{topics.filter(t=>(!filter||t.level===filter)&&`${t.title}${t.context}${t.category}`.toLowerCase().includes(query.toLowerCase())).map(t=><TopicCard key={t.id} topic={t} choose={()=>{setSide("pro");setSetup(t);}}/>)}</div>{!topics.some(t=>(!filter||t.level===filter)&&`${t.title}${t.context}${t.category}`.toLowerCase().includes(query.toLowerCase()))&&<div className="empty-state"><Search/><h3>No matching motion</h3><p>Try another keyword or browse a different level.</p><button className="secondary" onClick={()=>{setFilter(0);setQuery("");}}>Show all motions</button></div>}</section>}
      {view === "path" && <section className="learning-path"><div className="path-intro"><Target size={19}/><p>Start with Level {level}. Complete two assessed practices with every skill at 3/5 or above to unlock the next recommendation. Demonstrations do not count, and a parent can still choose any level.</p></div>{levels.map(l=><article className={`path-step ${l.id===level?"current":""}`} key={l.id}><div className="path-number">{l.id < level ? <Check size={22}/> : String(l.id).padStart(2,"0")}</div><div className="path-body"><div className="path-title"><h2>{l.title}</h2>{l.id===level&&<span className="level-pill">Recommended now</span>}</div><h3>{l.focus}</h3><p>{l.goal}</p><div className="path-tags"><span>{l.words} words per speech</span><span>One challenge per round</span><span>About {l.minutes} minutes</span></div></div><button className="round-button" aria-label={`Browse Level ${l.id} motions`} onClick={()=>{setFilter(l.id);navigate("topics");}}><ArrowUpRight size={20}/></button></article>)}</section>}
      {view === "history" && <section><div className="section-heading"><h3>{sessions.length ? `${sessions.length} debates` : "Your practice history"}</h3><button className="secondary small" disabled={!sessions.length} onClick={()=>saveFile(JSON.stringify({version:1,sessions},null,2),"argumentor-practice.json")}><Download size={15}/>Export history</button></div>{!sessions.length ? <div className="empty-state"><div className="empty-symbol"><History size={32}/></div><h3>Your ideas will be saved here.</h3><p>Complete a practice to revisit your speeches, coaching and argument map.</p><button className="primary" onClick={()=>{setSide("pro");setSetup(recommended);}}>Start your first practice<ArrowRight size={16}/></button></div> : <div className="history-list">{sessions.map(s=><button key={s.id} className="history-row" onClick={()=>{setReview(s);navigate("review");}}><span className="history-icon"><BookOpen size={20}/></span><div><h3>{topics.find(t=>t.id===s.topicId)?.title}</h3><p>{new Date(s.startedAt).toLocaleDateString("en-GB")} · Level {s.level} · {s.turns.length} rounds · {s.completedAt ? "Complete" : "Unfinished"}</p></div><span className="mode-tag">{s.turns.every(t=>t.mode==="demo")?"Demonstration":"Assessed practice"}</span><ChevronRight size={18}/></button>)}</div>}</section>}
      {view === "briefing" && briefing && <Briefing topic={briefing.topic} side={briefing.side} onBack={()=>{setSetup(briefing.topic);setSide(briefing.side);setBriefing(null);navigate("topics");}} onStart={()=>start(briefing.topic,briefing.side)}/>}
      {view === "room" && active && activeTopic && <DebateRoom key={active.id} session={active} topic={activeTopic} demo={active.turns.length ? active.turns[0].mode==="demo" : demo} transcription={status.transcription} onTurn={onTurn} onPause={()=>navigate("home")} onReview={()=>{setReview(active);navigate("review");}}/>}
      {view === "review" && review && <Review session={review} onBack={()=>navigate("history")} onLearn={id=>{setAcademyLesson(id);navigate("academy");}} again={()=>{setSide(review.side==="pro"?"con":"pro");setSetup(topics.find(t=>t.id===review.topicId)!);}}/>}
      <footer className="page-footer"><span>ArguMentor Junior</span><span>Think clearly. Listen kindly.</span></footer>
    </main>
    {setup && <Modal title="Ready to make your case?" onClose={()=>setSetup(null)}><div className="setup-topic"><span className="level-pill">Level {setup.level}</span><h2>{setup.title}</h2></div><p className="setup-context">{setup.context}</p><div className="setup-label">Choose your side</div><div className="side-choices"><button className={side==="pro"?"chosen":""} onClick={()=>setSide("pro")}><span>I agree</span><strong>Support the motion</strong><i>{side==="pro"&&<Check size={16}/>}</i></button><button className={side==="con"?"chosen":""} onClick={()=>setSide("con")}><span>I disagree</span><strong>Oppose the motion</strong><i>{side==="con"&&<Check size={16}/>}</i></button></div><div className="setup-label">Useful debate words</div><div className="vocab-list">{setup.vocabulary.map(([word,meaning])=><span key={word}><strong>{word}</strong>{visibleMeaning(meaning)}</span>)}</div><div className="session-format"><Clock3 size={17}/><span>About {levels[setup.level-1].minutes} minutes · 4-round simplified Public Forum</span></div><label className="demo-choice"><input type="checkbox" checked={demo} disabled={!status.live} onChange={e=>setDemo(e.target.checked)}/><span>Demonstration<small>Prepared opposing ideas and structure hints. No AI quality scores.</small></span></label>{!status.live&&<p className="small muted">Connect a model in the local app to unlock free debate. The full demonstration flow is available now.</p>}<button className="primary full" onClick={()=>{setBriefing({topic:setup,side});setSetup(null);navigate("briefing");}}>Open pre-debate briefing<ArrowRight size={17}/></button><button className="text-button setup-skip" onClick={()=>start()}>Skip the briefing and start</button>{active&&!active.completedAt&&<p className="small muted">Your current practice will be saved as unfinished.</p>}</Modal>}
    {settings && <Modal title="Parent settings" onClose={()=>setSettings(false)}><div className="settings-status"><ShieldCheck size={24}/><div><h3>{status.live ? `${status.provider} connected` : "Demonstration mode"}</h3><p>Model keys never enter the child-facing browser bundle.</p></div></div><h3 className="settings-heading">Live debate and voice</h3><p className="settings-copy">ArguMentor does not issue its own API key. In the local app, add <code>OPENAI_API_KEY</code> or <code>OPENROUTER_API_KEY</code> to <code>apps/junior/.env.local</code>, then restart only this app. OpenAI also enables reliable recorded transcription; OpenRouter enables live debate but not this transcription route.</p><p className="settings-copy">Create an OpenAI key in the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">OpenAI Platform API key page</a>. Keep it only in <code>.env.local</code>. API use may require billing and creates provider charges.</p><p className="settings-copy">The private hosted edition provides demonstration debate and browser speech recognition where supported. For the most reliable microphone experience, use the local app with an OpenAI key.</p><h3 className="settings-heading">Practice and privacy</h3><p className="settings-copy">History stays in this browser. There is no account, public ranking or public sharing. Browser speech recognition may be processed online by the browser provider. Recorded transcription is sent only to OpenAI and is not stored by this app.</p><button className="secondary full" disabled={!sessions.length} onClick={()=>saveFile(JSON.stringify({version:1,sessions},null,2),"argumentor-practice.json")}><Download size={16}/>Export local history</button><h3 className="settings-heading">About this build</h3><p className="settings-copy">Built on ArguMentor’s debate state machine, inspired by DebateSim’s round-by-round Public Forum coaching, and parsed with Argdown. Scores are formative feedback, not an exam result.</p></Modal>}
    {notification&&<div className="toast" role="status">{notification}</div>}
  </div>;
}
function TopicCard({topic,choose}:{topic:Topic;choose:()=>void}) {
  const Icon = topic.category==="Technology" ? Headphones : topic.category==="Our world" ? Network : BookOpen;
  return <button className={`topic-card tone-${levels[topic.level-1].color}`} onClick={choose}><div className="topic-card-top"><span className="topic-mini-icon"><Icon size={18}/></span><span>Level {topic.level}</span><ArrowUpRight size={17}/></div><h3>{topic.title}</h3><p>{topic.context}</p><div className="topic-card-foot"><span>{topic.category}</span><span>{levels[topic.level-1].minutes} min</span></div></button>;
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
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="Close" onClick={onClose}><X size={20}/></button></div>{children}</div></div>;
}
type SpeechResult = { isFinal:boolean; 0:{transcript:string} };
type SpeechRecognitionInstance = { lang:string; continuous:boolean; interimResults:boolean; onresult:((e:{resultIndex:number;results:{length:number;[index:number]:SpeechResult}})=>void)|null; onerror:((e:{error:string})=>void)|null; onend:(()=>void)|null; start:()=>void; stop:()=>void; abort:()=>void };
function DebateRoom({session,topic,demo,transcription,onTurn,onPause,onReview}:{session:Session;topic:Topic;demo:boolean;transcription:boolean;onTurn:(turn:Turn)=>void;onPause:()=>void;onReview:()=>void}) {
  const draftKey=`argumentor-draft.${session.id}`;
  const [text,setText]=useState(()=>{try{return session.completedAt?"":localStorage.getItem(draftKey)||"";}catch{return"";}});
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[hint,setHint]=useState(false);
  const [listening,setListening]=useState(false),[interim,setInterim]=useState(""),[speaking,setSpeaking]=useState(false);
  const [seconds,setSeconds]=useState(phases[Math.min(session.turns.length,3)].seconds),[timer,setTimer]=useState(false);
  const [feedbackIndex,setFeedbackIndex]=useState<number|null>(session.turns.length?session.turns.length-1:null);
  const [tab,setTab]=useState<"coach"|"map">("coach");
  const recognizer=useRef<SpeechRecognitionInstance|null>(null);
  const recorder=useRef<MediaRecorder|null>(null);
  const recordingStream=useRef<MediaStream|null>(null);
  const audioChunks=useRef<Blob[]>([]);
  const busyRef=useRef(false);
  const mounted=useRef(true);
  const requestAbort=useRef<AbortController|null>(null);
  const transcriptEnd=useRef<HTMLDivElement>(null);
  const r=session.turns.length,finished=!!session.completedAt,phase=phases[Math.min(r,3)];
  const feedback=feedbackIndex!==null?session.turns[feedbackIndex]?.feedback:null;
  const feedbackCoach=feedbackIndex!==null&&session.turns[feedbackIndex]?getRoundCoaching(session.turns[feedbackIndex].user,feedbackIndex):null;
  useEffect(()=>{if(timer&&seconds>0){const id=setTimeout(()=>setSeconds(s=>s-1),1000);return()=>clearTimeout(id);}if(seconds===0)setTimer(false);},[timer,seconds]);
  useEffect(()=>{setSeconds(phases[Math.min(r,3)].seconds);setTimer(false);setFeedbackIndex(r?r-1:null);},[r]);
  useEffect(()=>{transcriptEnd.current?.scrollIntoView({behavior:"smooth",block:"nearest"});},[r,busy]);
  useEffect(()=>{try{if(text)localStorage.setItem(draftKey,text);else localStorage.removeItem(draftKey);}catch{}},[text,draftKey]);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;requestAbort.current?.abort();recognizer.current?.abort();recorder.current?.state==="recording"&&recorder.current.stop();recordingStream.current?.getTracks().forEach(track=>track.stop());if("speechSynthesis"in window)window.speechSynthesis.cancel();};},[]);
  function speak(value:string){
    if(!("speechSynthesis"in window)){setError("This browser cannot read text aloud. You can continue by reading it.");return;}
    window.speechSynthesis.cancel();
    if(speaking){setSpeaking(false);return;}
    const utterance=new SpeechSynthesisUtterance(value);utterance.lang="en-US";utterance.rate=0.86;
    utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setError("Read-aloud could not start. Check your browser’s sound permissions.");};
    setSpeaking(true);window.speechSynthesis.speak(utterance);
  }
  async function recordedTranscription(){
    if(listening){recorder.current?.stop();return;}
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){setError("This browser cannot record audio. Try current Chrome or type your response.");return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});recordingStream.current=stream;
      const preferred=["audio/webm;codecs=opus","audio/mp4","audio/webm"].find(type=>MediaRecorder.isTypeSupported(type));
      const media=new MediaRecorder(stream,preferred?{mimeType:preferred}:undefined);recorder.current=media;audioChunks.current=[];
      media.ondataavailable=e=>{if(e.data.size)audioChunks.current.push(e.data);};
      media.onerror=()=>{setListening(false);setError("Recording stopped unexpectedly. Please try again or type your response.");};
      media.onstop=async()=>{
        setListening(false);stream.getTracks().forEach(track=>track.stop());recordingStream.current=null;
        const blob=new Blob(audioChunks.current,{type:media.mimeType||"audio/webm"});audioChunks.current=[];
        if(blob.size<100)return;
        setBusy(true);setError("");
        try{const response=await fetch("/api/transcribe",{method:"POST",headers:{"Content-Type":blob.type.split(";")[0]},body:blob,signal:AbortSignal.timeout(50000)});const data=await response.json();if(!response.ok)throw new Error(data.error||"Transcription failed.");setText(current=>(current+" "+data.text).trim());}
        catch(e){setError((e as Error).name==="TimeoutError"?"Transcription timed out. Please try again or type your response.":(e as Error).message);}
        finally{setBusy(false);}
      };
      media.start();setListening(true);setError("");
    }catch{setError("Microphone access was not granted. Allow it in your browser, or type your response.");}
  }
  function microphone(){
    if(listening){recognizer.current?.stop();recorder.current?.state==="recording"&&recorder.current.stop();return;}
    if(transcription){void recordedTranscription();return;}
    const win=window as unknown as {SpeechRecognition?:new()=>SpeechRecognitionInstance;webkitSpeechRecognition?:new()=>SpeechRecognitionInstance};
    const Recognition=win.SpeechRecognition||win.webkitSpeechRecognition;
    if(!Recognition){setError("Live browser speech recognition is unavailable here. Open this page in current Chrome, or run the local app with OPENAI_API_KEY for recorded transcription.");return;}
    if("speechSynthesis"in window)window.speechSynthesis.cancel();setSpeaking(false);
    const rec=new Recognition();recognizer.current=rec;rec.lang="en-US";rec.continuous=true;rec.interimResults=true;
    rec.onresult=e=>{let partial="";for(let i=e.resultIndex;i<e.results.length;i++){const result=e.results[i];if(result.isFinal)setText(t=>(t+" "+result[0].transcript).trim());else partial+=result[0].transcript;}setInterim(partial);};
    rec.onerror=e=>{setListening(false);setInterim("");setError(e.error==="not-allowed"?"Microphone access was not granted. Allow it in your browser, or type your response.":"Browser speech recognition failed. Open the hosted page in current Chrome, or use the local app with OPENAI_API_KEY for recorded transcription.");};
    rec.onend=()=>{setListening(false);setInterim("");};
    try{rec.start();setListening(true);setError("");}catch{setError("The microphone could not start. Please type your response.");}
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
        const data=await response.json();if(!response.ok)throw new Error(data.error||"No feedback was received. Please try again.");result=data;
      }
      if(!mounted.current)return;
      onTurn({...result,round:r+1,user:input.text,at:new Date().toISOString()});setText("");setHint(false);
    }catch(e){if(mounted.current)setError((e as Error).name==="TimeoutError"?"The request timed out. Your draft is still here; please try again.":(e as Error).message);}
    finally{busyRef.current=false;if(mounted.current)setBusy(false);}
  }
  return <section className="studio">
    <div className="studio-heading"><button className="back-button" disabled={busy} onClick={onPause}><ChevronLeft size={18}/>Save and continue later</button><span className="mode-tag">{demo?"Demonstration · prepared opponent":"Live debate"}</span></div>
    <div className="studio-topic"><div><div className="topic-meta"><span className="level-pill">Level {session.level}</span><span>My position: {session.side==="pro"?"I agree":"I disagree"}</span></div><h1>{topic.title}</h1><p>{topic.context}</p></div><div className="round-count"><strong>{Math.min(r+1,4)}</strong><span>/ 4 rounds</span></div></div>
    <div className="phase-track">{phases.map((p,i)=><div key={p.name} className={`${i===r?"current":""} ${i<r?"complete":""}`}><span>{i<r?<Check size={13}/>:i+1}</span><div><strong>{p.name}</strong><small>{p.subtitle}</small></div></div>)}</div>
    <div className="studio-grid"><div className="conversation-panel"><div className="conversation-heading"><span><span className="live-dot"/>{finished?"Debate complete":"Your conversation"}</span><button className="icon-button" aria-label="Read the current opposing point aloud" onClick={()=>speak(session.turns.at(-1)?.opponent||topic.context)}><Volume2 size={17}/></button></div>
      <div className="transcript">
        <div className="welcome-message"><span className="speaker-avatar"><Mark/></span><div><strong>Let’s think together.</strong><p>{topic.context}</p><small>Start with your opinion and one reason. Take your time.</small></div></div>
        {session.turns.map((turn,i)=><div className="turn-pair" key={turn.at}><div className="turn-divider">{phases[i].name}</div><div className="message user-message"><span className="message-label">You</span><p>{turn.user}</p><button className="message-feedback" onClick={()=>{setFeedbackIndex(i);setTab("coach");}}>View this round’s feedback<ChevronRight size={12}/></button></div><div className="message opponent-message"><span className="message-label">Other side{turn.mode==="demo"&&<small>prepared point</small>}</span><p>{turn.opponent}</p><button className="text-button" onClick={()=>speak(turn.opponent)}><Volume2 size={13}/>Listen</button></div></div>)}
        {busy&&<div className="thinking" role="status"><span/><span/><span/>{listening?"Recording your response…":"Reading your argument…"}</div>}
        <div ref={transcriptEnd}/>
      </div>
      {finished?<div className="completed-panel"><Check size={20}/><div><strong>You completed all four rounds.</strong><p>Take one more moment to revisit your strongest reason.</p></div><button className="primary small" onClick={onReview}>Open review<ArrowRight size={15}/></button></div>:<div className="composer">
        <div className="composer-heading"><label htmlFor="speech-input">Your turn · {phase.subtitle}</label><button className={`timer ${timer?"running":""}`} onClick={()=>setTimer(!timer)} title="Optional timer; it never submits automatically">{timer?<Pause size={12}/>:<Play size={12}/>} {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</button></div>
        <textarea id="speech-input" value={text} maxLength={2500} onChange={e=>setText(e.target.value)} placeholder={phase.stem} disabled={busy} rows={4}/>
        {interim&&<p className="interim">{interim}</p>}
        {hint&&<div className="hint-box"><Lightbulb size={16}/><div><strong>Coach ladder · {phase.name}</strong><p><b>1. Purpose:</b> {phase.hint}</p><p><b>2. Case move:</b> {session.side==="pro"?topic.pro[Math.min(r,topic.pro.length-1)]:topic.con[Math.min(r,topic.con.length-1)]}</p><p><b>3. Pressure test:</b> {topic.questions[session.side][Math.min(r,topic.questions[session.side].length-1)]}</p><p><b>4. Build:</b> {phase.stem}</p><p><b>5. Quality check:</b> Did I make a claim, explain the link, answer the other side, and show why it matters?</p></div></div>}
        {error&&<p className="error" role="alert">{error}</p>}
        <div className="composer-tools"><div className="button-row"><button className={`icon-button ${listening?"recording":""}`} disabled={busy} aria-label={listening?"Stop voice input":"Start voice input"} title={transcription?"Record, then transcribe with OpenAI":"Use browser speech recognition"} onClick={microphone}>{listening?<MicOff size={19}/>:<Mic size={19}/>}</button><button className={`icon-button ${hint?"selected":""}`} title="Open the hint ladder" aria-label="Open the hint ladder" onClick={()=>setHint(!hint)}><Lightbulb size={18}/></button><span className="word-count">{wordCount(text)} words</span></div><button className="primary small" disabled={busy||listening||text.trim().length<2} onClick={submit}>{busy?"Working…":r===3?"Complete final round":"Submit this round"}<ArrowRight size={15}/></button></div><p className="composer-note">{listening?"Listening… Tap stop, then check the transcript before submitting.":`Aim for ${levels[session.level-1].words} words. You can speak first, then edit the transcript.`}</p>
      </div>}
    </div><aside className="coach-panel"><div className="coach-tabs"><button className={tab==="coach"?"selected":""} onClick={()=>setTab("coach")}><Lightbulb size={15}/>Coach notes</button><button className={tab==="map"?"selected":""} onClick={()=>setTab("map")}><Network size={15}/>Argument map</button></div>
      {tab==="map"?(session.turns.length?<Suspense fallback={<p className="empty-inline">Mapping your ideas…</p>}><ArgumentMap key={r} session={session}/></Suspense>:<div className="coach-empty"><Network size={28}/><h3>Your ideas will connect here</h3><p>Submit the first round to see your claim and the opposing response.</p></div>):feedback?<div className="feedback-content"><div className="feedback-round">Round {(feedbackIndex||0)+1} feedback{demo&&<span>structure guidance</span>}</div>{feedbackCoach&&<div className="structure-diagnosis"><span>STRUCTURE CHECK</span><p>{feedbackCoach.diagnostic}</p><div>{feedbackCoach.checks.filter(c=>c.expected).map(c=><i className={c.found?"found":"next"} key={c.id}>{c.found?<Check size={11}/>:<Plus size={11}/>} {c.label}</i>)}</div><small>Priority: {feedbackCoach.priority}</small></div>}<div className="coach-note positive"><span><Check size={15}/>What worked</span><p>{feedback.strength}</p></div>{feedback.evidenceQuote&&<blockquote>{feedback.evidenceQuote}</blockquote>}<div className="coach-note"><span><Target size={15}/>One improvement</span><p>{feedback.improvement}</p></div><div className="rewrite"><span>{demo?"Try this frame":"Possible revision"}</span><p>{feedback.rewrite}</p><button className="text-button" onClick={()=>speak(feedback.rewrite)}><Volume2 size={13}/>Listen</button></div><div className="language-note"><BookOpen size={15}/><p>{feedback.languageNote}</p></div><div className="next-step"><Flag size={15}/><p>{feedback.nextStep}</p></div>{feedback.scores&&<div className="mini-scores">{Object.entries(feedback.scores).map(([k,v])=><div key={k}><span>{{clarity:"Clarity",reasoning:"Reasoning",response:"Response",english:"English"}[k]}</span><strong>{v}<small>/5</small></strong></div>)}</div>}</div>:<div className="coach-empty"><div className="coach-symbol"><Lightbulb size={26}/></div><h3>Give it a first try.</h3><p>After each round, you will see what the speech contains, one exact strength, the highest-priority gap and a revision move.</p><div className="first-goal"><span>Practice goal</span><strong>{levels[session.level-1].goal}</strong></div><div className="vocab-stack">{topic.vocabulary.map(([word,meaning])=><div key={word}><span>{word}</span><small>{visibleMeaning(meaning)}</small></div>)}</div></div>}
    </aside></div>
  </section>;
}
function Review({session,onBack,onLearn,again}:{session:Session;onBack:()=>void;onLearn:(id:string)=>void;again:()=>void}){
  const topic=topics.find(t=>t.id===session.topicId)!;
  const [tab,setTab]=useState<"notes"|"map">("notes");
  const valid=session.turns.filter(t=>t.mode==="live"&&t.feedback.scores);
  const totalWords=session.turns.reduce((sum,t)=>sum+wordCount(t.user),0);
  const report=getSessionReport(session);
  return <section className="review"><div className="studio-heading"><button className="back-button" onClick={onBack}><ChevronLeft size={18}/>Practice history</button><button className="secondary small" onClick={()=>saveFile(JSON.stringify(session,null,2),`debate-${topic.id}.json`)}><Download size={15}/>Export this practice</button></div><div className="review-hero"><div className="review-mark"><Check size={29}/></div><h1>{session.completedAt?"Your ideas are worth hearing.":"Good thinking takes practice."}</h1><p>{session.completedAt?"You completed a debate. Now make one reason even stronger.":"This practice is unfinished, but it is still worth reviewing."} </p><h2>{topic.title}</h2><div className="review-stats"><span><strong>{session.turns.length}</strong>speeches</span><span><strong>{totalWords}</strong>English words</span><span><strong>{session.level}</strong>practice level</span></div>{!valid.length&&<p className="demo-review-note">This was a demonstration. The notes describe structure only and do not include AI quality scores.</p>}</div>
      {!!valid.length&&<div className="review-score-grid">{(["clarity","reasoning","response","english"] as const).map(k=>{const score=valid.reduce((sum,t)=>sum+t.feedback.scores![k],0)/valid.length;return <div key={k}><span>{{clarity:"Clear claim",reasoning:"Reason and example",response:"Response",english:"English expression"}[k]}</span><strong>{score.toFixed(1)}<small>/5</small></strong><div className="score-track"><i style={{width:`${score*20}%`}}/></div></div>;})}</div>}
      <div className="coach-report"><article><span className="card-label">BEST MOVE</span><blockquote>“{report.bestLine}”</blockquote><p>{report.strongest?`${report.strongest.label} appeared in ${report.strongest.used} of ${report.strongest.total} relevant rounds.`:"Complete more rounds to find a pattern."}</p></article><article><span className="card-label">NEXT PRIORITY</span><h3>{report.priority?.label||"Make the link more precise"}</h3><p>{report.priority?`This appeared in ${report.priority.used} of ${report.priority.total} rounds where it mattered. Focus on one clear use next time.`:"Every expected structure marker appeared. Now explain why the example proves the claim and test whether the support is reliable."}</p></article><article className="recommended-drill"><span className="card-label">COACH PLAN · 6 MIN</span><h3>{report.lesson.title}</h3><p>{report.lesson.drill}</p><button className="text-button" onClick={()=>onLearn(report.lesson.id)}>Open lesson<ArrowRight size={14}/></button></article></div>
      <div className="skill-coverage"><div className="section-heading"><h3>Skill coverage</h3><span>Used / expected in this round type</span></div><div>{report.counts.map(c=><span key={c.id}><i className={c.used===c.total?"complete":""}/><b>{c.label}</b><small>{c.used}/{c.total}</small></span>)}</div><p>This detects visible language patterns, not whether a claim is true or persuasive. Live AI feedback adds contextual evaluation when a model is connected.</p></div>
      <div className="review-controls"><div className="filter-tabs"><button className={tab==="notes"?"selected":""} onClick={()=>setTab("notes")}>Round review</button><button className={tab==="map"?"selected":""} onClick={()=>setTab("map")}>Argument map</button></div><button className="secondary small" onClick={again}><RotateCcw size={15}/>Try the other side</button></div>
      {tab==="map"?<div className="review-map"><Suspense fallback={<p className="empty-inline">Mapping your ideas…</p>}><ArgumentMap session={session}/></Suspense></div>:<div className="review-notes">{session.turns.map((t,i)=>{const coaching=getRoundCoaching(t.user,i);return <article key={i}><div className="review-note-title"><span>{String(i+1).padStart(2,"0")}</span><h3>{phases[i].name}<small>{phases[i].subtitle}</small></h3></div><blockquote>{t.user}</blockquote><div className="round-skill-row">{coaching.checks.filter(c=>c.expected).map(c=><span className={c.found?"found":"next"} key={c.id}>{c.found?<Check size={12}/>:<Plus size={12}/>} {c.label}</span>)}</div><p className="round-diagnostic">{coaching.diagnostic} <strong>Next:</strong> {coaching.priority}</p><div className="review-two-col"><div><span className="positive-text"><Check size={14}/>What worked</span><p>{t.feedback.strength}</p></div><div><span><Target size={14}/>One next step</span><p>{t.feedback.improvement}</p></div></div><div className="review-rewrite"><span>{t.mode==="demo"?"Practice frame":"Suggested revision"}</span><p>{t.feedback.rewrite}</p></div></article>})}</div>}
  </section>;
}
export default App;
