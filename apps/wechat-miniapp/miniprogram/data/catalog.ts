export const lessons = [
  ["case", "Build a complete argument", "Claim → reason → example → impact"],
  ["warrant", "Explain the hidden link", "Show how the example proves the claim"],
  ["rebuttal", "Rebut the strongest point", "Answer fairly and directly"],
  ["weighing", "Compare, do not repeat", "Size · chance · time · reach · reversibility"],
  ["questions", "Ask useful questions", "Clarify, test, reveal a trade-off"],
  ["summary", "Collapse to one issue", "Choose, extend, answer, weigh"],
  ["final", "Deliver final focus", "One voter and one comparison"],
  ["evidence", "Use examples honestly", "Separate examples from verified proof"]
] as const;

export const starterMotions = [
  { id:"homework", level:1, title:"Should weekends be homework-free?", context:"Think about learning, rest and family time.", pro:"Rest can help children return ready to learn.", con:"Short practice can help children remember new ideas." },
  { id:"recess", level:2, title:"Should schools have longer recess?", context:"The school day stays the same length.", pro:"Movement may help students focus later.", con:"Longer recess leaves less time for lessons." },
  { id:"phones", level:3, title:"Should phones stay outside the classroom?", context:"Consider focus, emergencies and learning tools.", pro:"Removing phones can reduce distraction.", con:"Phones can provide useful accessibility tools." }
] as const;
