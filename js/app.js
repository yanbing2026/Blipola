import {loadProgress,awardReward,recordAttempt} from "./progress.js";
import {createBlipola} from "./blipola.js";
import {getMissionSummary,completeMission} from "./missions.js";
const progress=loadProgress(), blipola=createBlipola({progress});
const speech=document.querySelector("#speech"), status=document.querySelector("#status"), buddy=document.querySelector("#buddy");
function animateBuddy(){buddy.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:500,easing:"ease-out"});}
function show(kind,message=null){speech.textContent=message||blipola.speak(kind);animateBuddy();}
document.querySelector("#learnBtn").onclick=()=>{
  const r=blipola.recommend("letters","A"); show(null,r.message);
  recordAttempt(progress,"letters","A",true,true); awardReward(progress,{xp:10});
  status.textContent=`Blipola • ${r.action} • ${r.difficulty} • ${r.reason} • +10 XP`;
};
document.querySelector("#hintBtn").onclick=()=>{
  speech.textContent=blipola.hint({wrongAttempts:1}); status.textContent="Hint 1 • Think first, then try."; animateBuddy();
};
document.querySelector("#questBtn").onclick=()=>{
  const s=getMissionSummary(progress);
  const next=s.missions.find(m=>!m.done);
  if(next&&completeMission(progress,next.id)){awardReward(progress,{xp:10});}
  const updated=getMissionSummary(progress);
  speech.textContent=updated.allDone?blipola.speak("celebrate"):blipola.speak("quest");
  status.textContent=`Daily Quest • ${updated.completed}/${updated.total} complete • ${progress.rewards.xp} XP`; animateBuddy();
};
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
