import {members} from './team.js';
export const initialState={scene:'summary',memberId:null};
// Official Year Up United core-value names, with original collective commitments.
// Source: https://www.yearup.org/about/our-mission
// These are aspirations for our group, not claims about individual track curricula.
export const sharedInsights=[
 {title:'Respect and value others',text:'We listen and make room for quieter voices.'},
 {title:'Engage and embrace diversity',text:'Our different backgrounds give us more to learn.'},
 {title:'Build trust, be honest',text:'We ask for help and speak honestly.'},
 {title:'Strive to learn',text:'We ask questions, use feedback and try again.'},
 {title:'Be accountable',text:'We aim to own our mistakes and follow through.'},
 {title:'Work hard and have fun',text:'We make room for friendship as we work toward our futures.'}
];

export const communityConnections=[
 {id:'yearup',title:'Year Up',members:members.map(m=>m.id),text:'We’re in different tracks at Year Up United. Our shared core values connect us as we learn and grow.'},
 {id:'newyork',title:'New York',members:['ricardo','christina','jenny','ibrahim','yense'],text:'Queens and Brooklyn connect five of our stories through home, upbringing or community.'},
 {id:'mexico',title:'Mexico',members:['christina','yense'],text:'Christina connects through family and culture. Yense describes feeling loved and welcomed by her community in Mexico.'},
 {id:'learning',title:'School & learning',members:['ricardo','fariza','jenny','ibrahim'],text:'Hunter College, studying in China, BMCC and Baruch are different learning communities that have shaped our stories.'},
 {id:'movies',title:'Movies & shows',members:['christina','yense'],text:'Christina enjoys horror movies. Yense enjoys movies and shows. Shared interests connect us beyond geography.'}
];
const connectionState=()=>({scene:'connections',memberId:null,connectionKey:'yearup'});
export function step(state,action){
 if(typeof action==='object'){
  if(action.type==='select')return members.some(m=>m.id===action.memberId)?{scene:'person',memberId:action.memberId}:state;
  if(action.type==='connection')return communityConnections.some(c=>c.id===action.key)?{scene:'connections',memberId:null,connectionKey:action.key}:state;
 }
 if(action==='home'||action==='choose')return {...initialState};
 if(action==='connections')return connectionState();
 const index=members.findIndex(m=>m.id===state.memberId);
 if(action==='next'){
  if(state.scene==='summary')return {scene:'person',memberId:members[0].id};
  if(state.scene==='connections')return {scene:'question',memberId:null};
  if(state.scene==='question')return {...initialState};
  return index<members.length-1?{scene:'person',memberId:members[index+1].id}:connectionState();
 }
 if(action==='back'){
  if(state.scene==='question')return connectionState();
  if(state.scene==='summary'||state.scene==='connections')return {scene:'person',memberId:members.at(-1).id};
  return index>0?{scene:'person',memberId:members[index-1].id}:state;
 }
 return state;
}
// First-person adaptations of the supplied answers, without adding biographical claims.
export const primaryCommunities={
 ricardo:'Stand-up comedy',christina:'Year Up United',fariza:'Education',
 jenny:'Student clubs at BMCC',ibrahim:'Finance at Baruch College · NABA · ASA',yense:'My community in Mexico'
};
export const profileStories={
 ricardo:'Stand-up comedy is the community I feel most connected to. Observing, getting feedback and rewriting are part of my practice, and I bring that persistence to IT troubleshooting. I live in Queens, and my family roots are in Colombia.',
 christina:'Year Up United has helped me take on challenges and practice speaking up. I connect with Mexico through my family and culture, and I grew up in Queens. Outside the program, I enjoy baking and watching horror movies.',
 fariza:'My hometown is Aktobe, Kazakhstan, and I studied in China. My work has included education, study-abroad counseling, hospitality and my family’s retail business. Adaptability, leadership and accountability matter to me when I work across cultures.',
 jenny:'I was president of both the Math Club and Chinese Culture Club at BMCC. Only five or six people came to our first meeting, and I wanted to create fun, educational activities where members could become friends. To me, leadership means making space for others, inviting them to take part, and listening.',
 ibrahim:'My cultural roots connect me to Nigeria, and my Brooklyn community connects me to Bed-Stuy. I study Finance at Baruch College and want to understand how money shapes businesses and communities. Through NABA and ASA, I’m building friendships, communication skills and professional connections. I enjoy learning from different perspectives—and playing basketball.',
 yense:'I feel most connected to Mexico, where people make me feel loved and welcome. I was born in New York and raised in Queens, and I love exploring places, watching movies and spending time on my own. I’m often quiet because I like to focus, but being included and spoken to regularly makes me feel welcome.'
};
