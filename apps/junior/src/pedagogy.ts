import { phases, type Topic } from "./curriculum";
import type { Session, Side } from "./learning";

export type AcademyLesson = {
  id: string; number: number; title: string; level: string; minutes: number;
  promise: string; idea: string; steps: string[]; weak: string; strong: string;
  whyStrong: string[]; frame: string; drill: string;
};

export const academyLessons: AcademyLesson[] = [
  { id:"case", number:1, title:"Build a complete argument", level:"Start here", minutes:6, promise:"Turn an opinion into a case someone can follow.", idea:"A strong argument is a chain: claim → reason → example → impact. If one link is missing, the listener has to guess.", steps:["Claim: say what you want us to believe.","Reason: explain why it is true.","Example: make the reason concrete.","Impact: show why it matters."], weak:"School gardens are good because they are useful.", strong:"Schools should grow small gardens because students can observe plants changing over time. For example, a class could measure one plant each week. This matters because science becomes something students can see, not only read about.", whyStrong:["The claim answers the motion.","The example is specific and honestly hypothetical.","The final sentence links the example to learning."], frame:"I think … because … For example, … This matters because …", drill:"Choose any school rule. Build one four-sentence chain in 90 seconds." },
  { id:"warrant", number:2, title:"Explain the hidden link", level:"Foundation", minutes:5, promise:"Show how your example actually proves your claim.", idea:"The warrant is the bridge between evidence and conclusion. Do not stop after an example; explain what the example shows.", steps:["Name the example or evidence.","Ask: what does this show?","Connect that answer to the motion."], weak:"A student used a reading app and enjoyed it, so e-books are better.", strong:"An e-book can enlarge small text. This gives more readers independent access to the same book, so e-books may be the fairer choice when readability is the priority.", whyStrong:["It does not overclaim from one story.","It explains the mechanism: adjustable text improves access.","It states the condition under which the conclusion is strongest."], frame:"This shows …, which means … Therefore …", drill:"Take one example from a motion and add a two-sentence bridge to the conclusion." },
  { id:"rebuttal", number:3, title:"Rebut the strongest point", level:"Core skill", minutes:7, promise:"Answer the other side fairly and directly.", idea:"A rebuttal is not a second opening speech. Name their point, test its link, then explain what remains true on your side.", steps:["Steelman: state their best point fairly.","Answer: challenge a fact, link, size or solution.","Return: show why your case still matters."], weak:"I disagree. Phones are bad in class.", strong:"You said phones help with research. That can be true, but a shared school device can provide research without messages and games. Therefore, keeping personal phones away during lessons can protect focus without removing digital tools.", whyStrong:["The opposing idea is represented fairly.","The answer attacks the solution, not the person.","The last line returns to the motion."], frame:"You said … That matters, but … Therefore …", drill:"Write the fairest version of the other side in one sentence before answering it." },
  { id:"weighing", number:4, title:"Compare, do not just repeat", level:"Strategic", minutes:7, promise:"Explain why your reason should decide the debate.", idea:"Both sides may have real benefits. Weighing compares them by magnitude, probability, timeframe, reach or reversibility.", steps:["Choose one impact from each side.","Choose one comparison lens.","Explain why your side wins that lens."], weak:"My reason is more important.", strong:"Longer recess may remove a few minutes from lessons, but it affects every lesson that follows. If movement helps students concentrate, the learning benefit repeats across the day. On timeframe, that is more important than protecting a few minutes once.", whyStrong:["It compares two real costs.","It names the lens: timeframe.","It explains rather than merely announcing the winner."], frame:"Even if …, our impact matters more because it is more likely / affects more people / lasts longer / is harder to reverse.", drill:"Compare two impacts using exactly one lens: size, chance, speed, reach or reversibility." },
  { id:"questions", number:5, title:"Ask useful questions", level:"Interactive", minutes:6, promise:"Use questions to discover the weak link in a case.", idea:"A good crossfire question has a purpose. It clarifies a claim, tests an assumption, or reveals a trade-off.", steps:["Clarify: What exactly do you mean by …?","Test: What makes that result likely?","Trade-off: What would your plan cost or replace?","Follow up: If that is true, then how …?"], weak:"Why are you wrong?", strong:"You said every student should join a club. How would your rule work for a student who cares for a younger sibling after school?", whyStrong:["It quotes the relevant claim.","It tests whether the proposal works for everyone.","The answer could change the debate."], frame:"You said … What would happen if …?", drill:"Write one clarify question and one trade-off question for the same motion." },
  { id:"summary", number:6, title:"Collapse to one winning issue", level:"Round strategy", minutes:7, promise:"Make a strategic summary instead of listing everything again.", idea:"A summary chooses. Extend one strong reason, answer the best response to it, then weigh it against the other side.", steps:["Name the key issue.","Extend your best reason and its impact.","Answer the strongest reply.","Weigh why this issue decides the motion."], weak:"We said many things about learning, cost and fairness.", strong:"This debate comes down to fair access. Our strongest reason is that not every family has the same device. The other side says schools can offer an alternative, but two different tasks may not give equal practice. Because fairness affects who can complete the homework at all, it should come before convenience.", whyStrong:["It selects one issue.","It rebuilds the case after an answer.","It ends with comparative weighing."], frame:"This debate comes down to … Our best reason is … They answered …, but … This matters most because …", drill:"Reduce a three-point case to one issue and explain why you chose it." },
  { id:"final", number:7, title:"Deliver a clear final focus", level:"Finish strong", minutes:5, promise:"Give the listener a simple reason to choose your side.", idea:"Final focus is a decision story, not a place for new arguments. Keep only what was already developed and make the comparison unmistakable.", steps:["Decision: tell us which side to choose.","Voter: name the one decisive issue.","Comparison: explain why your impact wins.","Close: finish in one memorable sentence."], weak:"In conclusion, I still agree with my side.", strong:"Choose the pro side because rest is the decisive issue. A small amount of practice can move to Friday, but lost family and recovery time cannot be recreated after the weekend. When one option protects both wellbeing and Monday learning, it is the better rule.", whyStrong:["It contains no new major point.","It compares what can and cannot be replaced.","The final sentence returns to a clear decision."], frame:"Choose my side because … Even if …, … matters more because …", drill:"Give a three-sentence final focus with one voter and one comparison." },
  { id:"evidence", number:8, title:"Use examples honestly", level:"Research habit", minutes:6, promise:"Sound credible without inventing facts.", idea:"Examples explain; verified evidence proves. Label imagined scenarios, and never turn a guess into a statistic or source.", steps:["Say “imagine” for a hypothetical example.","Say “in my experience” only for your own experience.","For a fact, save the source and what it actually supports.","State uncertainty when you are not sure."], weak:"Studies prove that 90% of students learn better with games.", strong:"Imagine a maths game that shows why an answer is wrong. That example suggests quick feedback could help practice, but we would still need reliable evidence before claiming it works for most students.", whyStrong:["It clearly labels the imagined scenario.","It separates explanation from proof.","It identifies what evidence would still be needed."], frame:"For example, imagine … This illustrates …, but to prove … we would need …", drill:"Rewrite one unsupported statistic as an honest hypothetical example." }
];

export type SkillCheck = { id:string; label:string; found:boolean; expected:boolean; evidence:string; tip:string };
const sentenceWith = (text:string, pattern:RegExp) => text.split(/(?<=[.!?])\s+/).find(s=>pattern.test(s))?.trim().slice(0,180) || "";
const definitions = [
  {id:"claim",label:"Clear claim",pattern:/\b(i think|i believe|i agree|i disagree|should|should not|choose|my position)\b/i,tip:"State exactly what you want the listener to believe."},
  {id:"reason",label:"Reason",pattern:/\b(because|since|the reason|so that)\b/i,tip:"Use “because” and explain why the claim is true."},
  {id:"example",label:"Example or evidence",pattern:/\b(for example|for instance|such as|imagine|according to|in my experience)\b/i,tip:"Add one specific, honest example; label it if it is hypothetical."},
  {id:"impact",label:"Impact link",pattern:/\b(this matters|this shows|this means|therefore|as a result|so students|so people)\b/i,tip:"Explain what changes and why the listener should care."},
  {id:"response",label:"Direct response",pattern:/\b(you said|your point|the other side|however|although|even if|but)\b/i,tip:"Name one opposing point fairly before answering it."},
  {id:"weighing",label:"Comparison",pattern:/\b(more important|matters more|more likely|less likely|affects more|longer|shorter|harder to reverse|bigger|smaller|compared with|before)\b/i,tip:"Compare impacts by size, chance, timeframe, reach or reversibility."},
  {id:"signpost",label:"Organisation",pattern:/\b(first|second|my strongest reason|this debate comes down to|to sum up|in conclusion|finally)\b/i,tip:"Use a signpost so the listener knows where the speech is going."}
];
const expectedByRound = [new Set(["claim","reason","example","impact"]),new Set(["response","reason","impact"]),new Set(["response","weighing","impact","signpost"]),new Set(["claim","weighing","impact","signpost"])];

export function analyseSpeech(text:string, round:number):SkillCheck[]{
  const expected=expectedByRound[Math.min(round,3)];
  return definitions.map(d=>({id:d.id,label:d.label,found:d.pattern.test(text),expected:expected.has(d.id),evidence:sentenceWith(text,d.pattern),tip:d.tip}));
}

export function getRoundCoaching(text:string, round:number){
  const checks=analyseSpeech(text,round), expected=checks.filter(c=>c.expected), missing=expected.find(c=>!c.found);
  const found=expected.filter(c=>c.found);
  return {
    checks,
    diagnostic: found.length ? `I can see ${found.map(c=>c.label.toLowerCase()).join(" and ")}.` : "The position is visible, but the reasoning chain is not clear yet.",
    priority: missing?.tip || `The ${phases[round].name.toLowerCase()} has the expected structure. Now make each link more precise.`,
    lessonId: missing?.id === "response" ? "rebuttal" : missing?.id === "weighing" ? "weighing" : missing?.id === "signpost" ? (round===3?"final":"summary") : missing?.id === "example" ? "evidence" : missing?.id === "impact" ? "warrant" : "case"
  };
}

export function getSessionReport(session:Session){
  const rounds=session.turns.map((t,i)=>getRoundCoaching(t.user,i));
  const expected=rounds.flatMap(r=>r.checks.filter(c=>c.expected));
  const counts=definitions.map(d=>({id:d.id,label:d.label,used:expected.filter(c=>c.id===d.id&&c.found).length,total:expected.filter(c=>c.id===d.id).length})).filter(x=>x.total);
  const strongest=[...counts].sort((a,b)=>(b.used/b.total)-(a.used/a.total))[0];
  const priority=[...counts].filter(x=>x.used<x.total).sort((a,b)=>(a.used/a.total)-(b.used/b.total))[0];
  const bestLine=session.turns.flatMap((t,i)=>analyseSpeech(t.user,i).filter(c=>c.found&&c.expected).map(c=>({text:c.evidence,weight:c.id==="weighing"?3:c.id==="response"?2:1}))).filter(x=>x.text).sort((a,b)=>b.weight-a.weight||b.text.length-a.text.length)[0]?.text || session.turns[0]?.user.slice(0,180) || "No speech yet.";
  const lessonId=priority?.id==="response"?"rebuttal":priority?.id==="weighing"?"weighing":priority?.id==="signpost"?"summary":priority?.id==="example"?"evidence":priority?.id==="impact"?"warrant":priority?"case":"warrant";
  return {counts,strongest,priority,bestLine,lesson:academyLessons.find(l=>l.id===lessonId)!};
}

export function buildModelCase(topic:Topic, side:Side){
  const points=side==="pro"?topic.pro:topic.con;
  const position=side==="pro"?"support":"oppose";
  const example=`Imagine a decision-maker testing this idea in the situation above. ${points[1]}`;
  return {
    claim:`I ${position} the motion because ${points[0].replace(/[.]$/,"").toLowerCase()}.`,
    reason:points[1], example,
    impact:`This matters because ${points[2].replace(/[.]$/,"").toLowerCase()}.`,
    speech:`I ${position} the motion because ${points[0].replace(/[.]$/,"").toLowerCase()}. ${example} This matters because ${points[2].replace(/[.]$/,"").toLowerCase()}.`
  };
}
