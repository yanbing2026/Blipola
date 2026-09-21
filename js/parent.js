import {getSkillStats} from "./learning-engine.js";
export function getParentInsights(progress){
  const attempts=progress.attempts||[], correct=attempts.filter(a=>a.correct).length;
  const skills=Object.keys(progress.skills||{}).map(skill=>({skill,...getSkillStats(progress,skill)}));
  return {attempts:attempts.length,correct,accuracy:attempts.length?Math.round(correct/attempts.length*100):0,skillsPracticed:skills.length,rewards:progress.rewards,streak:progress.streak,skills};
}
