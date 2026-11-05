import {members,places,connectionTypes} from './team.js';
import {routes} from './connections.js';
import {mapLabels} from './map-labels.js';
import {initialState,step,sharedInsights,profileStories,primaryCommunities} from './scenes.js';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={...initialState},busy=false,lat=64,lon=-10,scale=.94,cx=.69,cy=.45,width=0,height=0,radius=0;
let camera=null,texture=null,nightTexture=null,world=[],drawn=false,paintTime=0;
let surfaceLat=null,surfaceLon=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),canvas=$('globe'),ctx=canvas.getContext('2d'),rad=Math.PI/180;
const surface=document.createElement('canvas');surface.width=surface.height=640;const surfaceCtx=surface.getContext('2d');
const sphere=surfaceCtx.createImageData(640,640);
const instant=()=>reduced.matches||$('instant').checked;
const member=()=>members.find(m=>m.id===state.memberId);
const avatar=(m,extra='')=>`<span class="avatar ${extra}" style="--accent:${m.color};--photo-position:${m.photoPosition||'50% 50%'};--photo-scale:${m.photoScale||1};--photo-origin:${m.photoOrigin||'50% 50%'}"><img src="${esc(m.photo)}" alt="${esc(m.name)}" draggable="false"></span>`;
const identity=m=>`<div class="identity">${avatar(m,'profile-photo')}<div class="identity-copy"><h1 class="student-name">${m.name}</h1><p class="primary-community">${primaryCommunities[m.id]}</p></div></div>`;
function render(){
 const m=member(),summary=state.scene==='summary';$('exhibit').dataset.scene=state.scene;$('exhibit').dataset.member=m?.id||'';
 for(const id of ['navigation','presentation-controls','motion-control','member-selector','map-information'])$(id).hidden=false;
 $('map-information').removeAttribute('open');
 $('member-selector').innerHTML=members.map(m=>{
  const place=places[m.locations[0].place];
  return `<button data-member="${m.id}" aria-pressed="${state.memberId===m.id}" title="${esc(m.shortName+' · '+place.country+' · '+m.locations[0].types.map(t=>connectionTypes[t].label).join(' / '))}"><span class="member-flag" role="img" aria-label="${esc(place.country)}">${place.flag}</span><span>${m.shortName}</span></button>`;
 }).join('');
 let html='';
 if(m){
  html=`${identity(m)}<p class="personal-story">${profileStories[m.id]}</p>`;
 }else html=`<h1 class="scene-title">Different tracks. Shared values.</h1><p class="summary-intro">Across our tracks at Year Up United, these are the values we want to put into practice.</p><div class="shared-summary">${sharedInsights.map(i=>`<section><h2>${i.title}</h2><p>${i.text}</p></section>`).join('')}</div>`;
 $('content').innerHTML=html;$('content').scrollTop=0;
 $('progress').textContent=summary?'LCM is family':`${members.findIndex(n=>n.id===m.id)+1} of ${members.length}`;
 $('next').textContent=summary?'Explore stories →':members.at(-1).id===m.id?'Shared summary →':'Next →';
 $('next').disabled=false;$('back').disabled=!summary&&m.id===members[0].id;
 drawn=false;
}
function target(){
 const mobile=canvas.clientWidth<700,m=member(),p=m?places[m.locations[0].place]:{lat:64,lon:-10};
 return {lat:p.lat,lon:p.lon,scale:.94,cx:mobile?.5:canvas.clientWidth<1100?.73:.70,cy:mobile?.5:.45};
}
async function go(action,id){
 if(busy)return;
 const next=step(state,id?{type:'select',memberId:id}:action);
 if(JSON.stringify(next)===JSON.stringify(state))return;
 const moves=next.scene==='person'&&next.memberId!==state.memberId;
 busy=true;$('exhibit').setAttribute('aria-busy','true');$('content').classList.add('departing');
 state=next;const t=target();t.lon=lon+((t.lon-lon+540)%360-180);
 if(moves&&!instant())await new Promise(resolve=>{camera={start:performance.now(),duration:500,from:{lat,lon,scale,cx,cy},to:t,resolve};});
 else{lat=t.lat;lon=t.lon;scale=t.scale;cx=t.cx;cy=t.cy;}
 render();draw();drawn=true;$('content').classList.remove('departing');busy=false;$('exhibit').removeAttribute('aria-busy');
 (state.scene==='summary'?$ ('back'):$('next')).focus({preventScroll:true});$('content').scrollTop=0;if(canvas.clientWidth<700)window.scrollTo(0,0);
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.member)go(null,b.dataset.member);else if(b.dataset.action)go(b.dataset.action);});
document.addEventListener('keydown',e=>{if(e.target.matches('input')||e.altKey||e.metaKey||e.ctrlKey)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?'next':'back');}if(e.key==='Escape'&&$('map-information').open)$('map-information').removeAttribute('open');});
$('instant').checked=reduced.matches;
try{$('instant').checked||=localStorage.getItem('yearup-reduce-motion')==='true';}catch{}
function syncMotion(){if(camera&&instant())camera.duration=0;drawn=false;}
$('instant').onchange=()=>{try{localStorage.setItem('yearup-reduce-motion',String($('instant').checked));}catch{}syncMotion();};reduced.addEventListener('change',syncMotion);
function project(latitude,longitude,lift=1){const a=latitude*rad,b=(longitude-lon)*rad,c=lat*rad;return {x:width*cx+radius*Math.cos(a)*Math.sin(b)*lift,y:height*cy-radius*(Math.cos(c)*Math.sin(a)-Math.sin(c)*Math.cos(a)*Math.cos(b))*lift,z:Math.sin(c)*Math.sin(a)+Math.cos(c)*Math.cos(a)*Math.cos(b)};}
function line(points,color,arched=false){
 // A hidden endpoint must not leave a floating, unfinished connection above Earth.
 if(arched&&[points[0],points.at(-1)].some(([lo,la])=>project(la,lo).z<=.02))return;
 ctx.save();ctx.beginPath();let pen=false;
 for(let index=0;index<points.length;index++){
  const [lo,la]=points[index],lift=arched?1.008+.11*Math.sin(Math.PI*index/(points.length-1)):1.008;
  const p=project(la,lo,lift);
  if(p.z>.01){if(pen)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);pen=true;}else pen=false;
 }
 ctx.strokeStyle=color;ctx.lineWidth=arched?1.25:.65;
 if(arched){ctx.shadowColor=color;ctx.shadowBlur=4;}
 ctx.stroke();ctx.restore();
}

function earth(){
 if(surfaceLat===lat&&surfaceLon===lon){ctx.drawImage(surface,width*cx-radius,height*cy-radius,radius*2,radius*2);return;}
 surfaceLat=lat;surfaceLon=lon;
 const size=640,r=319,sin=Math.sin(lat*rad),cos=Math.cos(lat*rad),data=sphere.data;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=(x-r)/r,v=(r-y)/r,z2=1-u*u-v*v,i=(y*size+x)*4;
  if(z2<0){data[i+3]=0;continue;}const z=Math.sqrt(z2),latitude=Math.asin(v*cos+z*sin),longitude=Math.atan2(u,z*cos-v*sin)+lon*rad;
  const tx=((Math.floor((longitude/(2*Math.PI)+.5)*texture.width)%texture.width)+texture.width)%texture.width,ty=Math.min(texture.height-1,Math.max(0,Math.floor((.5-latitude/Math.PI)*texture.height))),j=(ty*texture.width+tx)*4;
  const red=texture.data[j],green=texture.data[j+1],blue=texture.data[j+2],ocean=blue>red*1.12&&blue>green*1.02;
  const light=Math.max(0,-u*.62+v*.28+z*.72),shade=.17+.83*light,edge=.72+.28*Math.pow(z,.35);
  const base=ocean?[7+red*.26,25+green*.48,44+blue*.58]:[red*.76+8,green*.83+9,blue*.74+12];
  let glow=0;
  if(nightTexture){
   const nx=((Math.floor((longitude/(2*Math.PI)+.5)*nightTexture.width)%nightTexture.width)+nightTexture.width)%nightTexture.width;
   const ny=Math.min(nightTexture.height-1,Math.max(0,Math.floor((.5-latitude/Math.PI)*nightTexture.height))),ni=(ny*nightTexture.width+nx)*4;
   glow=Math.max(nightTexture.data[ni],nightTexture.data[ni+1],nightTexture.data[ni+2])/255;
   glow=Math.pow(glow,1.35)*(.3+.7*(1-light));
  }
  data[i]=Math.min(255,base[0]*shade*edge+glow*255);
  data[i+1]=Math.min(255,base[1]*shade*edge+glow*191);
  data[i+2]=Math.min(255,base[2]*shade*edge+glow*94);
  data[i+3]=255;
 }
 surfaceCtx.putImageData(sphere,0,0);ctx.drawImage(surface,width*cx-radius,height*cy-radius,radius*2,radius*2);
}
function networkDetails(){
 // Every illuminated point and every connection comes from a supplied place.
 for(let la=-60;la<=60;la+=30)line(Array.from({length:181},(_,i)=>[-180+i*2,la]),'#8db1c715');
 for(let lo=-180;lo<180;lo+=30)line(Array.from({length:91},(_,i)=>[lo,-90+i*2]),'#8db1c715');

}
function draw(){
 ctx.clearRect(0,0,width,height);
 radius=Math.min(width*(width<700?.44:width<1100?.28:.31),height*(width<700?.46:.42))*scale;
 const x=width*cx,y=height*cy;
 const atmosphere=ctx.createRadialGradient(x,y,radius*.96,x,y,radius*1.055);
 atmosphere.addColorStop(0,'#5caee000');atmosphere.addColorStop(.45,'#5caee035');atmosphere.addColorStop(1,'#5caee000');
 ctx.fillStyle=atmosphere;ctx.beginPath();ctx.arc(x,y,radius*1.055,0,Math.PI*2);ctx.fill();
 if(texture)earth();else{
  ctx.fillStyle='#a2c7ce';ctx.beginPath();ctx.arc(x,y,radius,0,7);ctx.fill();
  for(const polygon of world)line(polygon[0],'#78a7ab60');
 }
 networkDetails();
 ctx.strokeStyle='#78bce870';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,y,radius,0,7);ctx.stroke();
 let visible=[];
 if(state.scene==='person'){
  const m=member();visible=m.locations.map((l,index)=>({m,l,portrait:index===0}));
  for(const route of routes.filter(r=>r.member.id===m.id))line(route.points,route.member.color,true);
 }else{
  visible=members.flatMap(m=>{const local=m.locations.find(l=>places[l.place].region==='new-york');return [{m,l:m.locations[0],portrait:true},...(local&&local!==m.locations[0]?[{m,l:local}]:[])];});
  for(const route of routes)line(route.points,route.member.color,true);
 }
 renderPlaceMarkers(visible);
 drawMapLabels();

}
function drawMapLabels(){
 const small=width<700,occupied=[...$('markers').querySelectorAll('.place-name')].map(e=>{const r=e.getBoundingClientRect(),c=canvas.getBoundingClientRect();return{x:r.left-c.left+r.width/2,y:r.top-c.top+r.height/2,w:r.width+8,h:r.height+8};}),placed=[];
 ctx.save();ctx.beginPath();ctx.arc(width*cx,height*cy,radius*.98,0,Math.PI*2);ctx.clip();ctx.textAlign='center';ctx.textBaseline='middle';
 for(const label of mapLabels){
  for(const q of label.anchors.map(([a,b])=>project(a,b)).sort((a,b)=>b.z-a.z)){
  if(q.z<.22)continue;
  const ocean=label.kind==='ocean',fontSize=small?(ocean?9:10):(ocean?11:12);
  ctx.font=`${ocean?'italic 400':'500'} ${fontSize}px Inter, sans-serif`;
  const w=ctx.measureText(label.name).width+10,h=fontSize+8;
  if([-1,1].some(dx=>[-1,1].some(dy=>Math.hypot(q.x+dx*w/2-width*cx,q.y+dy*h/2-height*cy)>radius*.98)))continue;
  if(occupied.some(r=>Math.abs(q.x-r.x)<(w+r.w)/2&&Math.abs(q.y-r.y)<(h+r.h)/2)||placed.some(r=>Math.abs(q.x-r.x)<(w+r.w)/2&&Math.abs(q.y-r.y)<(h+r.h)/2))continue;
  placed.push({x:q.x,y:q.y,w,h});
  ctx.globalAlpha=Math.min(1,(q.z-.15)*2);ctx.strokeStyle='#0b253be0';ctx.lineWidth=3;ctx.lineJoin='round';ctx.strokeText(label.name,q.x,q.y);ctx.fillStyle=ocean?'#a4bccb':'#d3dddf';ctx.fillText(label.name,q.x,q.y);break;
  }
 }
 ctx.restore();
}
function renderPlaceMarkers(entries){
 const unique=new Map();
 for(const e of entries){
  const key=e.portrait?e.m.id+'-'+e.l.place:e.l.place;
  if(!unique.has(key))unique.set(key,{...e,people:[]});
  unique.get(key).people.push(e.m.shortName);
 }
 const visible=[...unique.values()].map(e=>({...e,q:project(places[e.l.place].lat,places[e.l.place].lon)})).filter(e=>e.q.z>.10);
 const shortName={queens:'Queens',eighth:'Eighth Avenue',bedstuy:'Bed-Stuy',fuzhou:'Fuzhou',chengdu:'Chengdu',newyork:'New York'};
 const placed=[],active=new Set();let leaders='';
 for(const e of visible){
  const key=e.m.id+'-'+e.l.place,p=places[e.l.place];active.add(key);
  let button=$('markers').querySelector(`[data-marker-key="${key}"]`);
  if(!button){button=document.createElement('button');button.className='place-marker';button.dataset.markerKey=key;button.innerHTML='<span class="place-name"></span>';$('markers').append(button);}
  button.dataset.member=e.m.id;
  button.style.setProperty('--member-color',e.m.color);button.style.left=e.q.x+'px';button.style.top=e.q.y+'px';button.dataset.anchorX=e.q.x;button.dataset.anchorY=e.q.y;
  const label=button.querySelector('.place-name');
  if(e.portrait){
   label.classList.add('portrait-pin');
   if(!label.querySelector('img'))label.innerHTML=avatar(e.m,'map-portrait')+`<span class="pin-name">${esc(e.m.shortName)}</span>`;
  }else{label.classList.remove('portrait-pin');label.textContent=shortName[e.l.place]||p.name;}
  const w=label.offsetWidth,h=label.offsetHeight,candidates=[];
  for(const distance of (e.portrait?[56,84,112,140,168]:[28,56,84,112,140]))for(const angle of [-90,-30,30,90,150,210]){
   const x=Math.max(w/2+8,Math.min(width-w/2-8,e.q.x+Math.cos(angle*rad)*distance));
   const topInset=width>=700&&e.portrait?90:8;
   const y=Math.max(h/2+topInset,Math.min(height-h/2-8,e.q.y+Math.sin(angle*rad)*distance));
   const overlap=placed.reduce((n,r)=>n+Math.max(0,(w+r.w)/2+10-Math.abs(x-r.x))*Math.max(0,(h+r.h)/2+8-Math.abs(y-r.y)),0);
   const coversPoint=visible.some(v=>Math.abs(x-v.q.x)<w/2+8&&Math.abs(y-v.q.y)<h/2+8);
   candidates.push({x,y,w,h,score:overlap*100+(coversPoint?10000:0)+distance});
  }
  const best=candidates.sort((a,b)=>a.score-b.score)[0];placed.push(best);
  const dx=best.x-e.q.x,dy=best.y-e.q.y;
  label.style.left=(22+dx)+'px';label.style.top=(22+dy)+'px';
  button.title=`${e.people.join(', ')} · ${p.name} · ${e.l.types.map(t=>connectionTypes[t].label).join(' / ')}`;
  button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',String(state.memberId===e.m.id));
  // Continue the same member-colored connection into the portrait itself.
  const portrait=label.querySelector('.map-portrait');
  const portraitY=portrait?best.y-h/2+portrait.offsetHeight/2:best.y;
  leaders+=`<line x1="${e.q.x}" y1="${e.q.y}" x2="${best.x}" y2="${portraitY}" stroke="${e.m.color}"/>`;
 }
 for(const button of [...$('markers').children])if(!active.has(button.dataset.markerKey))button.remove();
 $('marker-leaders').innerHTML=leaders;
}

function tick(now){
 if(now-paintTime<20){requestAnimationFrame(tick);return;}paintTime=now;
 let dirty=!drawn;
 if(camera){
  const t=camera.duration?Math.min(1,(now-camera.start)/camera.duration):1,e=t*t*(3-2*t);
  lat=camera.from.lat+(camera.to.lat-camera.from.lat)*e;lon=camera.from.lon+(camera.to.lon-camera.from.lon)*e;scale=camera.from.scale+(camera.to.scale-camera.from.scale)*e;cx=camera.from.cx+(camera.to.cx-camera.from.cx)*e;cy=camera.from.cy+(camera.to.cy-camera.from.cy)*e;
  dirty=true;if(t===1){const resolve=camera.resolve;camera=null;resolve();}
 }
 if(dirty){draw();drawn=true;}requestAnimationFrame(tick);
}
new ResizeObserver(()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(!camera){const t=target();cx=t.cx;cy=t.cy;scale=t.scale;}drawn=false;}).observe(canvas);
const image=new Image();image.onload=()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const cctx=c.getContext('2d',{willReadFrequently:true});cctx.drawImage(image,0,0,1024,512);texture=cctx.getImageData(0,0,1024,512);surfaceLat=null;drawn=false;};image.onerror=()=>{$('asset-status').textContent='Earth texture unavailable. Showing the geographic fallback.';};image.src='./public/earth.jpg';
fetch('./public/world.geo.json').then(r=>r.json()).then(data=>{world=data.features.flatMap(f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates);drawn=false;}).catch(()=>{});
document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement)$('asset-status').textContent=`Photo unavailable: ${e.target.alt}. Please reload.`;},true);
render();requestAnimationFrame(tick);

const nightImage=new Image();nightImage.onload=()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const context=c.getContext('2d',{willReadFrequently:true});context.drawImage(nightImage,0,0,1024,512);nightTexture=context.getImageData(0,0,1024,512);surfaceLat=null;drawn=false;};nightImage.src='./public/earth-night.png';
