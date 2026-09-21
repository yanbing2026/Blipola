import {chooseLearningAction,getDifficulty,getRecommendationReason} from "./learning-engine.js";
import {getHint,getExplanation,getHintLevel} from "./hints.js";
import {say,responseFor} from "./dialogue.js";
export function createBlipola({progress}){
  return {
    recommend(skill,item){const action=chooseLearningAction(progress,skill,item);return{action,difficulty:getDifficulty(progress,skill,item),reason:getRecommendationReason(progress,skill,item),message:say(action==="NEW"?"newSkill":action==="CHALLENGE"?"challenge":"practice")};},
    hint(context){return getHint({...context,level:getHintLevel(context.wrongAttempts||0)});},
    explain(context){return getExplanation(context);},
    respond(context){return responseFor(context);},
    speak(kind){return say(kind);}
  };
}
