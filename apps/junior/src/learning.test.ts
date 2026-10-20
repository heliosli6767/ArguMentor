import { test } from "node:test";
import assert from "node:assert/strict";
import { addTurn, createSession, demoTurn, makeArgdown, recommendedLevel, requestSchema, normalizeQuote } from "./learning";
import { topics } from "./curriculum";
import { parseGraph } from "./ArgumentMap";

test("ArguMentor state machine completes exactly four child practice turns", () => {
  let session = createSession(topics[0], "pro");
  for (let i=0; i<4; i++) {
    assert.equal(session.state.awaitingSpeaker, "user");
    const request = { topicId: topics[0].id, level: 1, side: "pro" as const, text: "I think weekends should be homework-free because children need rest.", demo: true, history: session.turns.map(t=>({user:t.user,opponent:t.opponent})) };
    const result = demoTurn(request);
    session = addTurn(session, { ...result, user: request.text, round: i+1, at: new Date().toISOString() });
    assert.equal(session.turns.length, i+1);
  }
  assert.equal(session.state.status,"completed");
  assert.equal(session.state.awaitingSpeaker,"none");
  assert.ok(session.completedAt);
  assert.equal(session.turns[0].feedback.scores,null);
  assert.equal(recommendedLevel([session, {...session,id:"second"}]),1,"demonstrations must not unlock assessed levels");
});
test("demonstration opponent takes the other side", () => {
  const input={topicId:"homework",level:1,text:"I support this.",demo:true,history:[]};
  assert.match(demoTurn({...input,side:"pro"}).opponent,/practice/);
  assert.match(demoTurn({...input,side:"con"}).opponent,/rest/);
});
test("quotes must actually occur in learner input", () => {
  const feedback = demoTurn({topicId:"homework",level:1,text:"My opinion",demo:true,side:"pro",history:[]}).feedback;
  assert.equal(normalizeQuote({...feedback,evidenceQuote:"invented"}, "My opinion").evidenceQuote,"");
});
test("request limits reject excessive turns and arbitrary level", () => {
  assert.equal(requestSchema.safeParse({topicId:"homework",level:6,text:"hello",side:"pro",demo:false,history:[]}).success,false);
  assert.equal(requestSchema.safeParse({topicId:"homework",level:1,text:"hello",side:"pro",demo:false,history:Array(4).fill({user:"x",opponent:"y"})}).success,false);
});
test("Argdown parses actual exported debate including hostile syntax as plain text", async () => {
  let session = createSession(topics[0],"pro");
  const text="I think [homework]: <extra> should be limited.\n\n# injected\n  - [Bad]: hello";
  const result=demoTurn({topicId:"homework",level:1,text,side:"pro",demo:true,history:[]});
  session=addTurn(session,{...result,user:text,round:1,at:new Date().toISOString()});
  const graph=await parseGraph(makeArgdown(session));
  assert.equal(graph.nodes.length,3);
  assert.equal(graph.edges.length,2);
  assert.ok(graph.nodes.some(n=>n.text.includes("homework")));
  assert.ok(graph.edges.some(e=>/attack|contrary/i.test(e.type)));
  assert.ok(graph.edges.some(e=>/support|entails/i.test(e.type)));
});

test("progress requires two completed assessed sessions and cannot skip a level", () => {
  let session=createSession(topics[0],"pro");
  for(let i=0;i<4;i++){
    const text="I think children need rest because learning takes energy.";
    const result=demoTurn({topicId:"homework",level:1,text,side:"pro",demo:true,history:session.turns.map(t=>({user:t.user,opponent:t.opponent}))});
    session=addTurn(session,{...result,mode:"live",feedback:{...result.feedback,scores:{clarity:3,reasoning:3,response:3,english:3}},user:text,round:i+1,at:new Date().toISOString()});
  }
  assert.equal(recommendedLevel([session]),1);
  assert.equal(recommendedLevel([session,{...session,id:"second"}]),2);
  assert.equal(recommendedLevel([{...session,level:2},{...session,id:"second",level:2}]),1);
});

test("Argdown editor rejects input with no statements", async () => {
  await assert.rejects(parseGraph(""));
  await assert.rejects(parseGraph("# Only a heading\n"));
});
