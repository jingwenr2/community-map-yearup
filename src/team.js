// All profile content, photo assignments and place coordinates live here.
// Photo paths are relative to the site root. Set photo only after ownership is confirmed.
// Country-level coordinates are approximate visual anchors, never hometown claims.
export const connectionTypes = {
  birthplace: {label:'Birthplace', icon:'✦'}, upbringing:{label:'Upbringing',icon:'◇'},
  home:{label:'Current home',icon:'●'}, roots:{label:'Family roots',icon:'⌁'},
  education:{label:'Education',icon:'▣'}, culture:{label:'Cultural connection',icon:'◎'}
};
export const places = {
  newyork:{country:'United States',flag:'🇺🇸',region:'new-york',name:'New York',lat:40.7128,lon:-74.0060},
  queens:{country:'United States',flag:'🇺🇸',region:'new-york',name:'Queens, New York',lat:40.7282,lon:-73.7949},
  colombia:{country:'Colombia',flag:'🇨🇴',name:'Colombia',lat:4.57,lon:-74.30,countryLevel:true},
  bronx:{country:'United States',flag:'🇺🇸',region:'new-york',name:'Bronx, New York',lat:40.8448,lon:-73.8648},
  mexico:{country:'Mexico',flag:'🇲🇽',name:'Mexico',lat:23.63,lon:-102.55,countryLevel:true},
  aktobe:{country:'Kazakhstan',flag:'🇰🇿',name:'Aktobe, Kazakhstan',lat:50.2839,lon:57.167},
  china:{country:'China',flag:'🇨🇳',name:'China',lat:35.86,lon:104.20,countryLevel:true},
  fuzhou:{country:'China',flag:'🇨🇳',name:'Fuzhou, Fujian, China',lat:26.0745,lon:119.2965},
  eighth:{country:'United States',flag:'🇺🇸',region:'new-york',name:'Eighth Avenue, Brooklyn, New York',lat:40.6395,lon:-74.0034},
  chengdu:{country:'China',flag:'🇨🇳',name:'Chengdu, Sichuan, China',lat:30.5728,lon:104.0668},
  nigeria:{country:'Nigeria',flag:'🇳🇬',name:'Nigeria',lat:9.082,lon:8.6753,countryLevel:true},
  bedstuy:{country:'United States',flag:'🇺🇸',region:'new-york',name:'Bedford-Stuyvesant, Brooklyn, New York',lat:40.6872,lon:-73.9418}
};
export const members = [
  {id:'ricardo',name:'Ricardo Aristizabal',shortName:'Ricardo',initials:'RA',color:'#f0b16a',symbol:'✒',photo:'./public/photos/ricardo.jpeg',photoPosition:'50% 30%',photoScale:1,photoOrigin:'50% 50%',
   headline:'Finding connection in the everyday.',subtitle:'Comedy · observation · persistence',
   story:'Stand-up comedy is Ricardo’s strongest community. Observation, feedback, rewriting, and persistence shape his practice. These same habits connect to IT troubleshooting: paying attention, working through feedback, and continuing to refine an approach. He also describes learning to navigate corporate environments.',
   communities:['Stand-up comedy','Hunter College','Year Up United'],interests:['Writing pen','Fog chasing','Long walks'],
   belonging:'His comedy practice centers on observing, receiving feedback, rewriting, and persisting.',
   locations:[{place:'colombia',types:['roots'],detail:'Family roots in Colombia.'},{place:'queens',types:['home','culture'],detail:'Current home and New Yorker identity.'}]},
  {id:'christina',name:'Christina',shortName:'Christina',initials:'C',color:'#a8dccc',secondaryColor:'#879fae',symbol:'✦',photo:'./public/photos/christina.jpg',photoPosition:'50% 20%',photoScale:1.8,photoOrigin:'48% 14%',
   headline:'Growing by speaking up.',subtitle:'Year Up · baking · movies',
   story:'Christina is from Mexico, with family roots and cultural connections through both of her parents. Her supplied New York connections include the Bronx and Queens. Year Up United helped her embrace challenges and practice speaking up.',
   communities:['Year Up United'],interests:['Horror movies','Baking','Pistachio cake','Art the Clown'],languages:['English','Spanish'],colors:['Blue-gray','Mint green'],
   belonging:'Embracing challenges and practicing speaking up are part of her growth through Year Up United.',
   locations:[{place:'mexico',types:['roots','culture'],detail:'Christina is from Mexico, with family roots and cultural connections through both parents.'},{place:'bronx',types:['birthplace'],detail:'Birthplace.'},{place:'queens',types:['upbringing'],detail:'Where she grew up.'}]},
  {id:'fariza',name:'Fariza',shortName:'Fariza',initials:'F',color:'#87bd78',symbol:'◆',photo:'./public/photos/fariza.jpeg',photoPosition:'50% 0%',photoScale:1.15,photoOrigin:'50% 0%',
   headline:'Connection across cultures.',subtitle:'Education · enterprise · adaptability',
   story:'Fariza’s hometown is Aktobe, Kazakhstan. She studied in China and maintains business connections there. Her experience spans education, study-abroad counseling, entrepreneurship, hospitality, and a family retail business. Adaptability, leadership, accountability, and working across cultures are central to her story.',
   communities:['Education','Study-abroad counseling','Entrepreneurship','Hospitality','Family retail business'],interests:[],languages:['Kazakh','Russian','English','Chinese','Turkish'],colors:['Green'],
   belonging:'Adaptability, leadership, and accountability help her work across cultures.',
   locations:[{place:'aktobe',types:['upbringing'],detail:'Hometown.'},{place:'china',types:['education'],detail:'Studied in China and maintains business connections there. No city was specified.'}]},
  {id:'jenny',name:'Jenny',shortName:'Jenny',initials:'J',color:'#bba3ed',symbol:'❋',photo:'./public/photos/jenny.png',photoPosition:'50% 45%',photoScale:1,photoOrigin:'50% 50%',
   headline:'Making space for people to belong.',subtitle:'Student leadership · friendship · inclusion',
   story:'Jenny was born in Fuzhou, where she attended kindergarten and elementary school. She grew up around Eighth Avenue in Brooklyn during middle school and high school. At BMCC, she served as president of both the Chinese Culture Club and Math Club. While organizing a club fair and a first meeting, she hoped to recruit more people, but only about five or six attended. She wanted activities to be fun and educational so members could become friends.',
   communities:['BMCC Chinese Culture Club · President','BMCC Math Club · President'],interests:[],colors:['Purple'],
   belonging:'Make space for others, invite them to participate, and listen to them.',
   locations:[{place:'fuzhou',types:['birthplace','education'],detail:'Birthplace; attended kindergarten and elementary school here.'},{place:'eighth',types:['upbringing'],detail:'Grew up here during middle school and high school.'},{place:'chengdu',types:['roots'],detail:'Her grandmother’s hometown: a family connection associated with pandas and Sichuan cuisine.'}]},
  {id:'ibrahim',name:'Ibrahim',shortName:'Ibrahim',initials:'I',color:'#77b9f4',secondaryColor:'#87bd78',symbol:'●',photo:'./public/photos/ibrahim.jpeg',photoPosition:'50% 30%',photoScale:1.8,photoOrigin:'48% 40%',
   headline:'Shared experiences. Open perspectives.',subtitle:'Brooklyn · sports · opportunity',
   story:'Ibrahim connects with Nigeria through his cultural background and with Bedford-Stuyvesant, Brooklyn through community and identity. He values shared experiences and openness to different backgrounds. His story also includes learning to navigate corporate environments.',
   communities:['African community','Brooklyn','Baruch College','Year Up United'],interests:['Biking','Swimming','Basketball'],languages:['Hausa · speaks it and wants to become more fluent'],colors:['Blue','Green accents'],
   belonging:'Shared experiences and openness to different backgrounds help build connection.',
   locations:[{place:'nigeria',types:['culture'],detail:'Cultural background.'},{place:'bedstuy',types:['culture'],detail:'Community connection and identity.'}]},
  {id:'yense',name:'Yense Saavedra',shortName:'Yense',initials:'YS',color:'#a5c9ef',symbol:'●',photo:'./public/photos/yense.jpeg',photoPosition:'50% 35%',photoScale:1.15,photoOrigin:'50% 20%',
   headline:'Feeling welcomed and included.',subtitle:'Exploring · movies · time to herself',
   communityStory:'Yense feels most connected to Mexico, where being around people who love her makes her feel welcomed.',
   story:'Yense was born in New York and raised in Queens. She loves exploring New York and other places, enjoys watching movies and shows, and values her own company.',
   communities:['Mexico'],interests:['Exploring New York and other places','Movies and shows','Time to herself'],languages:['English','Spanish'],colors:['Pastel colors','Blue'],
   belonging:'Being spoken to regularly and included helps Yense feel welcome. She does not talk a lot because she likes to stay focused and avoid distractions, rather than because she is shy.',
   locations:[{place:'mexico',types:['culture'],detail:'Her strongest community connection: being around people who love her and make her feel welcomed.'},{place:'newyork',types:['birthplace'],detail:'Born in New York.'},{place:'queens',types:['upbringing'],detail:'Raised in Queens.'}]}

];
export const insights = [
 {number:'01',title:'New York, a shared thread',text:'New York connections appear across Ricardo, Christina, Jenny, Ibrahim, and Yense, with distinct stories in Queens, the Bronx, and Brooklyn.'},
 {number:'02',title:'Opportunity through Year Up',text:'Ricardo, Christina, and Ibrahim explicitly mention Year Up United. Ricardo and Ibrahim also describe learning to navigate corporate environments.'},
 {number:'03',title:'Many ways to find your people',text:'Comedy, movies, baking, entrepreneurship, student leadership, and sports offer different ways to connect beyond geography or nationality.'},
 {number:'04',title:'Belonging is something we practice',text:'The responses emphasize listening, respect, openness, making space for personality, inviting participation, and including quieter people.'}
];
