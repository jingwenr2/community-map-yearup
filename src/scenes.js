import {members} from './team.js';
export const initialState={scene:'person',memberId:members[0].id};
export const sharedInsights=[
 {title:'Communities we share',text:'Year Up United connects Ricardo, Christina and Ibrahim. New York connects five of us, and Mexico is important to both Christina and Yense.'},
 {title:'What makes us different',text:'We find community through comedy, baking, education, entrepreneurship, student clubs, sports and exploring new places.'},
 {title:'What helps us belong',text:'Jenny values listening and inviting participation. Ibrahim values openness. Yense feels welcome when people keep talking with her and include her.'},
 {title:'What we bring to work',text:'Persistence, speaking up, adaptability, inclusive leadership, openness and focus are strengths reflected in our answers.'}
];
export function step(state,action){
 if(typeof action==='object'&&action.type==='select')return members.some(m=>m.id===action.memberId)?{scene:'person',memberId:action.memberId}:state;
 if(action==='home'||action==='choose')return {...initialState};
 if(action==='connections')return {scene:'summary',memberId:null};
 const index=members.findIndex(m=>m.id===state.memberId);
 if(action==='next'){
  if(state.scene==='summary')return state;
  return index<members.length-1?{scene:'person',memberId:members[index+1].id}:{scene:'summary',memberId:null};
 }
 if(action==='back'){
  if(state.scene==='summary')return {scene:'person',memberId:members.at(-1).id};
  return index>0?{scene:'person',memberId:members[index-1].id}:state;
 }
 return state;
}
// Concise editorial summaries of the supplied answers; these are not direct quotes.
export const profileStories={
 ricardo:'Stand-up comedy is Ricardo’s strongest community. He observes, listens to feedback and rewrites until an idea works. He brings that same patience and persistence to IT troubleshooting and learning to navigate corporate environments.',
 christina:'Christina connects with Mexico through her parents, family roots and culture. Year Up United has helped her take on challenges and practice speaking up. Outside the program, she enjoys baking, horror movies and pistachio cake.',
 fariza:'Fariza studied in China and still has business connections there. Her work spans education, study-abroad counseling, entrepreneurship, hospitality and her family’s retail business. Adaptability, leadership and accountability guide how she works across cultures.',
 jenny:'At BMCC, Jenny was president of both the Math Club and Chinese Culture Club. Only five or six people came to the first meeting. She wanted to create fun, educational activities that would help members become friends. For Jenny, leadership means making space for others, inviting them to participate and listening to them.',
 ibrahim:'Ibrahim finds connection in his Nigerian cultural background and his Brooklyn community. Shared experiences and openness to different backgrounds help him feel a sense of belonging. He enjoys biking, swimming and basketball, and is learning to navigate corporate environments.',
 yense:'Yense feels most connected to Mexico, where people make her feel loved and welcome. She enjoys exploring New York and other places, movies and shows, and her own company. Being included and spoken to regularly helps her belong. She is often quiet because she likes to focus, rather than because she is shy.'
};
