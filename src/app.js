import {members,places,connectionTypes} from './team.js';
import {routes} from './connections.js';
import {mapLabels} from './map-labels.js';
import {initialState,step,sharedInsights,profileStories,primaryCommunities} from './scenes.js';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={...initialState},busy=false,lat=places[members[0].locations[0].place].lat,lon=places[members[0].locations[0].place].lon,scale=.94,cx=.69,cy=.45,width=0,height=0,radius=0;
let camera=null,texture=null,world=[],drawn=false,paintTime=0;
let surfaceLat=null,surfaceLon=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),canvas=$('globe'),ctx=canvas.getContext('2d'),rad=Math.PI/180;
const surface=document.createElement('canvas');surface.width=surface.height=440;const surfaceCtx=surface.getContext('2d');
const sphere=surfaceCtx.createImageData(440,440);
const instant=()=>reduced.matches||$('instant').checked;
const member=()=>members.find(m=>m.id===state.memberId);
const avatar=(m,extra='')=>`<span class="avatar ${extra}" style="--accent:${m.color};--photo-position:${m.photoPosition||'50% 50%'};--photo-scale:${m.photoScale||1};--photo-origin:${m.photoOrigin||'50% 50%'}"><img src="${esc(m.photo)}" alt="${esc(m.name)}" draggable="false"></span>`;
const identity=m=>`<div class="identity">${avatar(m,'profile-photo')}<div class="identity-copy"><h1 class="student-name">${m.name}</h1><p class="primary-community">${primaryCommunities[m.id]}</p></div></div>`;
function render(){
 const m=member(),summary=state.scene==='summary';$('exhibit').dataset.scene=state.scene;
 for(const id of ['navigation','presentation-controls','motion-control','member-selector','map-information'])$(id).hidden=false;
 $('map-information').removeAttribute('open');
 $('member-selector').innerHTML=members.map(m=>`<button data-member="${m.id}" aria-pressed="${state.memberId===m.id}"><span>${m.shortName}</span></button>`).join('');
 let html='';
 if(m){
  html=`${identity(m)}<p class="personal-story">${profileStories[m.id]}</p>`;
 }else html=`<h1 class="scene-title">What we take forward</h1><div class="shared-summary">${sharedInsights.map(i=>`<section><h2>${i.title}</h2><p>${i.text}</p></section>`).join('')}</div>`;
 $('content').innerHTML=html;$('content').scrollTop=0;
 $('progress').textContent=summary?'Together':`${members.findIndex(n=>n.id===m.id)+1} of ${members.length}`;
 $('next').textContent=summary?'Next →':members.at(-1).id===m.id?'Shared summary →':'Next →';
 $('next').disabled=summary;$('back').disabled=!summary&&m.id===members[0].id;
 drawn=false;
}
function target(){
 const mobile=canvas.clientWidth<700,m=member(),p=m?places[m.locations[0].place]:{lat:24,lon:-35};
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
function syncMotion(){if(camera&&instant())camera.duration=0;drawn=false;}
$('instant').onchange=syncMotion;reduced.addEventListener('change',syncMotion);
function project(latitude,longitude,lift=1){const a=latitude*rad,b=(longitude-lon)*rad,c=lat*rad;return {x:width*cx+radius*Math.cos(a)*Math.sin(b)*lift,y:height*cy-radius*(Math.cos(c)*Math.sin(a)-Math.sin(c)*Math.cos(a)*Math.cos(b))*lift,z:Math.sin(c)*Math.sin(a)+Math.cos(c)*Math.cos(a)*Math.cos(b)};}
function line(points,color){ctx.beginPath();let pen=false;for(const [lo,la]of points){const p=project(la,lo,1.008);if(p.z>.01){if(pen)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);pen=true;}else pen=false;}ctx.strokeStyle=color;ctx.lineWidth=.9;ctx.stroke();}
function earth(){
 if(surfaceLat===lat&&surfaceLon===lon){ctx.drawImage(surface,width*cx-radius,height*cy-radius,radius*2,radius*2);return;}
 surfaceLat=lat;surfaceLon=lon;
 const size=440,r=219,sin=Math.sin(lat*rad),cos=Math.cos(lat*rad),data=sphere.data;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=(x-r)/r,v=(r-y)/r,z2=1-u*u-v*v,i=(y*size+x)*4;
  if(z2<0){data[i+3]=0;continue;}const z=Math.sqrt(z2),latitude=Math.asin(v*cos+z*sin),longitude=Math.atan2(u,z*cos-v*sin)+lon*rad;
  const tx=((Math.floor((longitude/(2*Math.PI)+.5)*texture.width)%texture.width)+texture.width)%texture.width,ty=Math.min(texture.height-1,Math.max(0,Math.floor((.5-latitude/Math.PI)*texture.height))),j=(ty*texture.width+tx)*4;
  const red=texture.data[j],green=texture.data[j+1],blue=texture.data[j+2],ocean=blue>red*1.12&&blue>green*1.02;
  const detail=(red+green+blue)/765,light=.91+.09*Math.max(0,-u*.25+v*.2+z*.9);
  const base=ocean?[139+detail*28,183+detail*25,194+detail*24]:[182+detail*30,194+detail*26,173+detail*34];
  data[i]=base[0]*light;data[i+1]=base[1]*light;data[i+2]=base[2]*light;data[i+3]=255;
 }
 surfaceCtx.putImageData(sphere,0,0);ctx.drawImage(surface,width*cx-radius,height*cy-radius,radius*2,radius*2);
}
function networkDetails(){
 // Every illuminated point and every connection comes from a supplied place.
 for(let la=-60;la<=60;la+=30)line(Array.from({length:181},(_,i)=>[-180+i*2,la]),'#476e7114');
 for(let lo=-180;lo<180;lo+=30)line(Array.from({length:91},(_,i)=>[lo,-90+i*2]),'#476e7114');

}
function draw(){
 ctx.clearRect(0,0,width,height);
 radius=Math.min(width*(width<700?.44:width<1100?.28:.31),height*(width<700?.46:.42))*scale;
 const x=width*cx,y=height*cy;
 if(texture)earth();else{
  ctx.fillStyle='#a2c7ce';ctx.beginPath();ctx.arc(x,y,radius,0,7);ctx.fill();
  for(const polygon of world)line(polygon[0],'#78a7ab60');
 }
 networkDetails();
 ctx.strokeStyle='#738f8530';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,y,radius,0,7);ctx.stroke();
 let visible=[];
 if(state.scene==='person'){
  const m=member();visible=m.locations.map(l=>({m,l}));
  for(const route of routes.filter(r=>r.member.id===m.id))line(route.points,'#527d7c99');
 }else{
  visible=members.map(m=>({m,l:m.locations.find(l=>places[l.place].region==='new-york')||m.locations[0]}));
  for(const route of routes)line(route.points,'#527d7c50');
 }
 renderPlaceMarkers(visible);
 drawMapLabels();

}
function drawMapLabels(){
 const small=width<700,occupied=[...$('markers').children].map(e=>({x:parseFloat(e.style.left),y:parseFloat(e.style.top),w:90,h:42})),placed=[];
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
  ctx.globalAlpha=Math.min(1,(q.z-.15)*2);ctx.strokeStyle='#b9d0cd80';ctx.lineWidth=3;ctx.lineJoin='round';ctx.strokeText(label.name,q.x,q.y);ctx.fillStyle=ocean?'#55777d':'#465e57';ctx.fillText(label.name,q.x,q.y);break;
  }
 }
 ctx.restore();
}
function renderPlaceMarkers(entries){
 const visible=entries.map(e=>({...e,q:project(places[e.l.place].lat,places[e.l.place].lon)})).filter(e=>e.q.z>.10);
 const shortName={queens:'Queens',eighth:'Eighth Avenue',bedstuy:'Bed-Stuy',fuzhou:'Fuzhou',chengdu:'Chengdu',newyork:'New York'};
 const groups=[];
 for(const e of visible){const group=groups.find(g=>Math.hypot(g[0].q.x-e.q.x,g[0].q.y-e.q.y)<45);if(group)group.push(e);else groups.push([e]);}
 const active=new Set();let leaders='';
 for(const group of groups)group.forEach((e,index)=>{
  const key=e.m.id+'-'+e.l.place;active.add(key);const p=places[e.l.place];
  const angle=(-135+index*270/Math.max(1,group.length-1))*rad;
  let dx=group.length>1?Math.cos(angle)*52:0,dy=group.length>1?Math.sin(angle)*40:-22;
  const labelHalf=Math.max(24,(shortName[e.l.place]||p.name).length*3);
  dx=Math.max(labelHalf+8-e.q.x,Math.min(width-labelHalf-8-e.q.x,dx));dy=Math.max(14-e.q.y,Math.min(height-14-e.q.y,dy));
  let button=$('markers').querySelector(`[data-marker-key="${key}"]`);
  if(!button){button=document.createElement('button');button.className='place-marker';button.dataset.markerKey=key;button.dataset.member=e.m.id;button.innerHTML=`<span class="place-name">${shortName[e.l.place]||p.name}</span>`;$('markers').append(button);}
  button.style.left=e.q.x+'px';button.style.top=e.q.y+'px';button.dataset.anchorX=e.q.x;button.dataset.anchorY=e.q.y;
  const label=button.querySelector('.place-name');label.style.left=dx+'px';label.style.top=dy+'px';
  button.title=`${e.m.shortName} · ${p.name} · ${e.l.types.map(t=>connectionTypes[t].label).join(' / ')}`;
  button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',String(state.memberId===e.m.id));
  leaders+=`<line x1="${e.q.x}" y1="${e.q.y}" x2="${e.q.x+dx}" y2="${e.q.y+dy}" stroke="#557c76"/>`;
 });
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
