import {members, insights} from './team.js';
export const initialState={scene:'connections',memberId:null,place:0,chapter:0,insight:0};
export function chapters(member){
 const list=[{title:'My communities',text:member.communities.join(' · ')}];
 if(member.story)list.push({title:'What shaped me',text:member.story.replace('Her supplied New York connections','Her New York connections')});
 // The supplied belonging field is retained as an editorial summary, not a quote.
 if(member.belonging)list.push({title:'What belonging means to me',text:member.belonging});
 return list;
}
export const sharedInsights=[
 {title:'Communities we share',text:'Ricardo, Christina and Ibrahim share Year Up United. New York also connects Ricardo, Christina, Jenny and Ibrahim through Queens, the Bronx and Brooklyn.'},
 {title:'Experiences that make us different',text:insights[2].text},
 {title:'What helps us belong',text:insights[3].text},
 {title:'What we can bring into the workplace',text:'Ricardo brings observation, feedback, and persistence. Christina practices speaking up. Fariza emphasizes adaptability, leadership, and accountability. Jenny invites participation and listens. Ibrahim values openness to different backgrounds.'}
];
export function step(state,action){
 const s={...state},m=members.find(m=>m.id===s.memberId);
 if(action==='home')return {...initialState};
 if(action==='choose')return {...initialState,scene:'choose'};
 if(action==='connections')return {...s,scene:'connections',insight:0};
 if(action==='meet'&&m)return {...s,scene:'story',chapter:0};
 if(action==='globe'&&m)return {...s,scene:'places'};
 if(action==='next'){
  if(s.scene==='opening')return {...s,scene:'choose'};
  if(s.scene==='places')return s.place<m.locations.length-1?{...s,place:s.place+1}:{...s,scene:'story',chapter:0};
  if(s.scene==='story')return s.chapter<chapters(m).length-1?{...s,chapter:s.chapter+1}:{...s,scene:'choose',memberId:null};
  if(s.scene==='connections')return s.insight<sharedInsights.length-1?{...s,insight:s.insight+1}:{...s,scene:'choose',memberId:null};
 }
 if(action==='back'){
  if(s.scene==='choose')return {...initialState};
  if(s.scene==='places')return s.place?{...s,place:s.place-1}:{...s,scene:'choose',memberId:null};
  if(s.scene==='story')return s.chapter?{...s,chapter:s.chapter-1}:{...s,scene:'places'};
  if(s.scene==='connections')return s.insight?{...s,insight:s.insight-1}:{...initialState};
 }
 return s;
}
