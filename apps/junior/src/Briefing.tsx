import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronLeft, HelpCircle, Lightbulb, Scale, Target } from "lucide-react";
import type { Topic } from "./curriculum";
import type { Side } from "./learning";
import { buildModelCase } from "./pedagogy";

export default function Briefing({topic,side,onBack,onStart}:{topic:Topic;side:Side;onBack:()=>void;onStart:()=>void}){
  const pro=useMemo(()=>buildModelCase(topic,"pro"),[topic]), con=useMemo(()=>buildModelCase(topic,"con"),[topic]);
  const mine=side==="pro"?pro:con, theirs=side==="pro"?con:pro;
  const [planner,setPlanner]=useState({claim:"",reason:"",example:"",impact:""});
  const filled=Object.values(planner).filter(Boolean).length;
  return <section className="briefing"><button className="back-button" onClick={onBack}><ChevronLeft size={18}/>Change motion or side</button>
    <div className="briefing-hero"><span className="eyebrow"><BookOpen size={14}/>Pre-debate briefing</span><h1>{topic.title}</h1><p>{topic.context}</p><div><span className="level-pill">Level {topic.level}</span><span>My position: {side==="pro"?"I agree":"I disagree"}</span></div></div>
    <div className="briefing-grid"><div className="briefing-main">
      <article className="motion-lens"><div><Scale size={20}/><span className="card-label">THE REAL DECISION</span></div><h2>Which trade-off should matter most?</h2><p>Do not try to prove that your side has no cost. Show why its benefit is more important than the strongest cost raised by the other side.</p></article>
      <div className="model-cases"><CaseCard label="Strong pro example" side="pro" model={pro}/><CaseCard label="Strong con example" side="con" model={con}/></div>
      <article className="clash-card"><span className="card-label">THE MAIN CLASH</span><div><p><strong>Your best path</strong>{mine.claim} {mine.impact}</p><span>VERSUS</span><p><strong>Their best reply</strong>{theirs.claim} {theirs.impact}</p></div></article>
      <article className="question-bank"><div className="section-heading"><div><span className="card-label">QUESTION LAB</span><h3>Questions that move the debate</h3></div><HelpCircle size={19}/></div>{topic.questions[side].map((q,i)=><div key={q}><span>{i+1}</span><p>{q}</p><small>{i===0?"Tests the plan":i===1?"Asks for support":"Finds the priority"}</small></div>)}</article>
    </div><aside className="case-planner"><div className="section-heading"><div><span className="card-label">YOUR CASE</span><h3>Plan before you speak</h3></div><Target size={18}/></div><p className="planner-note">Write notes, not a script. These stay in this browser and are not submitted.</p>{(["claim","reason","example","impact"] as const).map((key,i)=><label key={key}><span>{i+1}. {key}</span><textarea rows={2} value={planner[key]} onChange={e=>setPlanner({...planner,[key]:e.target.value})} placeholder={{claim:"What do you want us to believe?",reason:"Why is it true?",example:"What specific situation shows it?",impact:"Why should we care?"}[key]}/></label>)}<div className="planner-status"><i style={{width:`${filled/4*100}%`}}/><span>{filled}/4 links planned</span></div><div className="briefing-tip"><Lightbulb size={15}/><p>You may start with an empty planner. The model cases are examples of structure, not lines to memorise.</p></div><button className="primary full" onClick={onStart}>Start the debate<ArrowRight size={17}/></button></aside></div>
  </section>;
}
function CaseCard({label,side,model}:{label:string;side:Side;model:ReturnType<typeof buildModelCase>}){
  const [open,setOpen]=useState(false);
  return <article className={`model-case ${side}`}><div className="model-case-heading"><span>{label}</span><i>{side==="pro"?"SUPPORT":"OPPOSE"}</i></div><p className="model-speech">{model.speech}</p><button className="text-button" onClick={()=>setOpen(!open)}>{open?"Hide the structure":"Show the structure"}<ArrowRight size={13}/></button>{open&&<div className="case-anatomy"><p><b>Claim</b>{model.claim}</p><p><b>Reason</b>{model.reason}</p><p><b>Example</b>{model.example}</p><p><b>Impact</b>{model.impact}</p></div>}</article>;
}
