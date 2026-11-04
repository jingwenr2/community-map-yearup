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
// First-person adaptations of the supplied answers, without adding biographical claims.
export const primaryCommunities={
 ricardo:'Stand-up comedy',christina:'Year Up United',fariza:'Education',
 jenny:'Student clubs at BMCC',ibrahim:'My Brooklyn community',yense:'My community in Mexico'
};
export const profileStories={
 ricardo:'Stand-up comedy is the community I feel most connected to. Observing, getting feedback and rewriting are part of my practice, and I bring that persistence to IT troubleshooting. I live in Queens, and my family roots are in Colombia.',
 christina:'Year Up United has helped me take on challenges and practice speaking up. I connect with Mexico through my family and culture, and I grew up in Queens. Outside the program, I enjoy baking and watching horror movies.',
 fariza:'My hometown is Aktobe, Kazakhstan, and I studied in China. My work has included education, study-abroad counseling, hospitality and my family’s retail business. Adaptability, leadership and accountability matter to me when I work across cultures.',
 jenny:'I was president of both the Math Club and Chinese Culture Club at BMCC. Only five or six people came to our first meeting, and I wanted to create fun, educational activities where members could become friends. To me, leadership means making space for others, inviting them to take part, and listening.',
 ibrahim:'I connect with Nigeria through my cultural background and with Bedford-Stuyvesant through my Brooklyn community. Shared experiences and being open to different backgrounds help me feel that I belong. I enjoy biking, swimming and basketball.',
 yense:'I feel most connected to Mexico, where people make me feel loved and welcome. I was born in New York and raised in Queens, and I love exploring places, watching movies and spending time on my own. I’m often quiet because I like to focus, but being included and spoken to regularly makes me feel welcome.'
};
