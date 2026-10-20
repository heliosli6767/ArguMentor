import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronLeft, Clock3, GraduationCap, Lightbulb, Target } from "lucide-react";
import { academyLessons, type AcademyLesson } from "./pedagogy";

const KEY="argumentor-academy.v1";
function readDone(){try{return new Set<string>(JSON.parse(localStorage.getItem(KEY)||"[]"));}catch{return new Set<string>();}}

export default function Academy({initialLessonId}:{initialLessonId?:string|null}){
  const [lesson,setLesson]=useState<AcademyLesson|null>(()=>academyLessons.find(item=>item.id===initialLessonId)||null);
  const [done,setDone]=useState(readDone);
  useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify([...done]));}catch{}},[done]);
  useEffect(()=>{if(initialLessonId)setLesson(academyLessons.find(item=>item.id===initialLessonId)||null);},[initialLessonId]);
  if(lesson)return <Lesson lesson={lesson} completed={done.has(lesson.id)} back={()=>setLesson(null)} complete={()=>setDone(current=>new Set([...current,lesson.id]))}/>;
  return <section className="academy">
    <div className="academy-hero"><div><span className="eyebrow"><GraduationCap size={14}/>Learning hub</span><h2>Learn the move.<br/>Then practise it.</h2><p>Eight short lessons show what strong debating looks like, why it works, and how to try it yourself.</p></div><div className="academy-progress"><strong>{done.size}<small>/8</small></strong><span>lessons explored</span><div><i style={{width:`${done.size/8*100}%`}}/></div></div></div>
    <div className="academy-route"><span>YOUR ROUTE</span><p>Start with a complete argument, then learn to answer, compare and close.</p></div>
    <div className="lesson-grid">{academyLessons.map(item=><button key={item.id} className="lesson-card" onClick={()=>setLesson(item)}><div className="lesson-card-top"><span>{String(item.number).padStart(2,"0")}</span>{done.has(item.id)?<i className="lesson-done"><Check size={13}/>Explored</i>:<i>{item.level}</i>}</div><h3>{item.title}</h3><p>{item.promise}</p><div><span><Clock3 size={13}/>{item.minutes} min</span><ArrowRight size={16}/></div></button>)}</div>
  </section>;
}

function Lesson({lesson,completed,back,complete}:{lesson:AcademyLesson;completed:boolean;back:()=>void;complete:()=>void}){
  const [reveal,setReveal]=useState(false);
  return <section className="academy lesson-page"><button className="back-button" onClick={back}><ChevronLeft size={18}/>All lessons</button>
    <div className="lesson-title"><span>LESSON {String(lesson.number).padStart(2,"0")} · {lesson.minutes} MIN</span><h2>{lesson.title}</h2><p>{lesson.promise}</p></div>
    <div className="lesson-layout"><div className="lesson-main">
      <article className="concept-card"><span className="soft-icon"><Lightbulb size={18}/></span><div><h3>The big idea</h3><p>{lesson.idea}</p></div></article>
      <article className="steps-card"><span className="card-label">THE MOVE</span>{lesson.steps.map((step,i)=><div className="lesson-step" key={step}><span>{i+1}</span><p>{step}</p></div>)}</article>
      <article className="example-lab"><div className="section-heading"><div><span className="card-label">WHAT GOOD LOOKS LIKE</span><h3>Compare the two versions</h3></div><BookOpen size={19}/></div><div className="example-weak"><span>Needs work</span><p>{lesson.weak}</p></div><div className="example-strong"><span>Stronger version</span><p>{lesson.strong}</p></div><button className="secondary small" onClick={()=>setReveal(!reveal)}>{reveal?"Hide the coach’s thinking":"Why is this stronger?"}<ArrowRight size={14}/></button>{reveal&&<ul className="why-list">{lesson.whyStrong.map(x=><li key={x}><Check size={14}/>{x}</li>)}</ul>}</article>
    </div><aside className="lesson-side"><article><Target size={18}/><span className="card-label">SENTENCE FRAME</span><p>{lesson.frame}</p></article><article><Clock3 size={18}/><span className="card-label">MINI DRILL</span><p>{lesson.drill}</p></article><button className={`primary full ${completed?"complete-button":""}`} onClick={complete}>{completed?<><Check size={16}/>Lesson explored</>:<>Mark as explored<ArrowRight size={16}/></>}</button><p className="tiny-note">Exploring a lesson is not a score. Try the move in a debate to make it yours.</p></aside></div>
  </section>;
}
