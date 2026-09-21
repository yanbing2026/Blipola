export const DAILY_MISSIONS=[
  {id:"learn",title:"Learn",description:"Practice one new skill."},
  {id:"think",title:"Think",description:"Solve one challenge."},
  {id:"remember",title:"Remember",description:"Review something you learned."}
];
export function getMissionSummary(progress){
  const today=new Date().toISOString().slice(0,10), done=progress.missions?.[today]||{};
  const missions=DAILY_MISSIONS.map(m=>({...m,done:!!done[m.id]}));
  const completed=missions.filter(m=>m.done).length;
  return {total:missions.length,completed,allDone:completed===missions.length,missions};
}
export function completeMission(progress,id){
  const today=new Date().toISOString().slice(0,10); progress.missions ||= {}; progress.missions[today] ||= {};
  if(progress.missions[today][id]) return false; progress.missions[today][id]=true; return true;
}
