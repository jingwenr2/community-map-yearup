import {members,places,connectionTypes} from './team.js';
import {routes,distanceToNewYork,newYorkReference} from './connections.js';
import {initialState,step,chapters,sharedInsights} from './scenes.js';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={...initialState},busy=false,lat=24,lon=-35,scale=.78,cx=.75,cy=.43,width=0,height=0,radius=0,last=0,interacted=false;
let camera=null,texture=null,world=[],drawn=false,distanceProgress=1,visualTime=0,paintTime=0,drag=null;
let surfaceLat=null,surfaceLon=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),canvas=$('globe'),ctx=canvas.getContext('2d'),rad=Math.PI/180;
const surface=document.createElement('canvas');surface.width=surface.height=440;const surfaceCtx=surface.getContext('2d');
const sphere=surfaceCtx.createImageData(440,440),stars=Array.from({length:24},(_,i)=>({x:((i*7919)%1009)/1009,y:((i*3571)%997)/997,r:i%7===0?1:.55}));
const instant=()=>reduced.matches||$('instant').checked;
const member=()=>members.find(m=>m.id===state.memberId);
const avatar=(m,extra='')=>`<span class="avatar ${extra}" style="--accent:${m.color};--photo-position:${m.photoPosition||'50% 50%'};--photo-scale:${m.photoScale||1};--photo-origin:${m.photoOrigin||'50% 50%'}"><img src="${esc(m.photo)}" alt="${esc(m.name)}" draggable="false"></span>`;

const identity=m=>`<div class="identity">${avatar(m,'profile-photo')}<div class="identity-copy"><h2 class="student-name">${m.name}</h2><p class="student-subtitle">${m.subtitle}</p></div></div>`;

function render(){
 const m=member(),opening=state.scene==='opening';$('exhibit').dataset.scene=state.scene;
 $('navigation').hidden=opening;$('presentation-controls').hidden=opening;$('motion-control').hidden=false;$('member-selector').hidden=false;
 $('member-selector').innerHTML=members.map(m=>`<button data-member="${m.id}" aria-pressed="${state.memberId===m.id}">${avatar(m)}<span>${m.shortName}</span></button>`).join('');
 let html='',progress='',next='Next →';
 $('map-information').hidden=opening; $('map-information').removeAttribute('open');
 if(opening)html=`<p class="eyebrow opening-label"><span aria-hidden="true"></span>Year Up · Our community map</p><h1><span>Different roots.</span><span>One shared future.</span></h1><p class="opening-copy">From stand-up comedy to student clubs, our communities shape how we listen, learn and make space for each other.</p><div class="opening-actions"><button class="primary" data-action="next">Explore our stories <span aria-hidden="true">↗</span></button><button class="secondary" data-action="connections">See our connections <span aria-hidden="true">→</span></button></div><p class="opening-note">Five students, sharing the communities that shaped us.</p>`;
 if(state.scene==='choose'){html='<p class="eyebrow">Our people</p><h2>Get to know us.</h2><p>Choose a student to explore their places and story.</p>';progress='Choose a student';}
 if(state.scene==='places'){
  const l=m.locations[state.place],p=places[l.place];
  html=`${identity(m)}<p class="connection-type">${l.types.map(t=>connectionTypes[t].label).join(' · ')}</p><h3 class="scene-title">${p.name}</h3><p class="place-story">${l.detail.replace(' No city was specified.','')}</p>`;
  progress=`Place ${state.place+1} of ${m.locations.length}`;next=state.place<m.locations.length-1?'Next place →':`Meet ${m.shortName} →`;
 }
 if(state.scene==='story'){
  const all=chapters(m),c=all[state.chapter];
  const details=state.chapter===0?[m.interests.length?`Interests: ${m.interests.join(' · ')}`:'',m.languages?`Languages: ${m.languages.join(' · ')}`:'',m.colors?`Favorite colors: ${m.colors.join(' · ')}`:''].filter(Boolean).join('<br>'):'';
  html=`${identity(m)}<h3 class="scene-title">${c.title}</h3><p class="chapter-copy">${c.text}</p>${details?`<details class="personal-details"><summary>A little more about ${m.shortName}</summary><p>${details}</p></details>`:''}`;
  progress=`Chapter ${state.chapter+1} of ${all.length}`;next=state.chapter<all.length-1?'Next chapter →':'Choose another →';
 }
 if(state.scene==='connections'){
  const i=sharedInsights[state.insight];html=`<p class="eyebrow">Our shared connections · ${state.insight+1} / 4</p><h2 class="scene-title">${i.title}</h2><p>${i.text}</p>`;progress=`Connection ${state.insight+1} of 4`;next=state.insight<3?'Next insight →':'Meet our people →';
 }
 $('content').innerHTML=html;$('content').scrollTop=0;$('progress').textContent=progress;$('next').textContent=next;$('next').disabled=state.scene==='choose';$('back').disabled=state.scene==='connections'&&state.insight===0;drawn=false;
}
function target(){
 const mobile=canvas.clientWidth<700,personal=['places','story'].includes(state.scene);
 let p=personal?places[member().locations[state.place].place]:{lat:24,lon:-35};
 if(state.scene==='places'){const midpoint=distanceToNewYork(p).points[50];p={lat:midpoint[1],lon:midpoint[0]};}
 return {lat:p.lat,lon:p.lon,scale:state.scene==='choose'?.85:state.scene==='connections'?.78:.85,cx:mobile?.5:state.scene==='choose'?.56:.76,cy:mobile?(personal?.22:state.scene==='opening'?.26:.39):.43};
}
async function go(action,id,placeIndex=0,fromMap=false){
 if(busy)return;const next=id?{...state,scene:fromMap?'story':'places',memberId:id,place:placeIndex,chapter:0}:step(state,action);
 if(JSON.stringify(next)===JSON.stringify(state))return;
 interacted=true;busy=true;$('exhibit').setAttribute('aria-busy','true');$('content').classList.add('departing');
 if(!instant())await new Promise(r=>setTimeout(r,220));
 state=next;distanceProgress=instant()?1:0;const t=target(),duration=instant()?0:1250;
 const oldLon=lon;t.lon=oldLon+((t.lon-oldLon+540)%360-180);
 await new Promise(resolve=>{camera={start:performance.now(),duration,from:{lat,lon,scale,cx,cy},to:t,resolve};});
 render();draw();updateDistance();drawn=true;$('content').classList.remove('departing');busy=false;$('exhibit').removeAttribute('aria-busy');
 const focus=state.scene==='choose'?$ ('member-selector').querySelector('button'):$('next');focus?.focus({preventScroll:true});$('content').scrollTop=0;requestAnimationFrame(()=>{$('content').scrollTop=0;});
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.member)go(null,b.dataset.member,Number(b.dataset.placeIndex||0),b.classList.contains('photo-marker'));else if(b.dataset.action)go(b.dataset.action);});
document.addEventListener('keydown',e=>{if(e.target.matches('input')||e.altKey||e.metaKey||e.ctrlKey)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?'next':'back');}if(e.key==='Escape'){if($('map-information').open)$('map-information').removeAttribute('open');else go('choose');}});
$('instant').checked=reduced.matches;
function syncMotion(){
 $('exhibit').classList.toggle('instant',instant());
 if(camera&&instant())camera.duration=0;
 drawn=false;
}
$('instant').onchange=syncMotion;
reduced.addEventListener('change',syncMotion);
syncMotion();
canvas.addEventListener('pointerdown',e=>{
 interacted=true;if(busy||!['opening','choose'].includes(state.scene))return;
 drag={x:e.clientX,y:e.clientY,lat,lon};canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{if(!drag)return;lon=drag.lon-(e.clientX-drag.x)*.25;lat=Math.max(-75,Math.min(75,drag.lat+(e.clientY-drag.y)*.2));drawn=false;});
canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
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
  const light=.24+.76*Math.max(0,-u*.4+v*.3+z*.85),edge=Math.pow(1-z,3)*35;
  data[i]=texture.data[j]*light+edge*.15;data[i+1]=texture.data[j+1]*light+edge*.48;data[i+2]=texture.data[j+2]*light+edge;data[i+3]=255;
 }
 surfaceCtx.putImageData(sphere,0,0);ctx.drawImage(surface,width*cx-radius,height*cy-radius,radius*2,radius*2);
}
function networkDetails(){
 // Every illuminated point and every connection comes from a supplied place.
 for(let la=-60;la<=60;la+=30)line(Array.from({length:181},(_,i)=>[-180+i*2,la]),'#65d9f20c');
 for(let lo=-180;lo<180;lo+=30)line(Array.from({length:91},(_,i)=>[lo,-90+i*2]),'#65d9f20c');

}
function openingNetwork(){
 const progress=instant()?1:Math.min(1,visualTime/2200);
 for(const route of routes)line(route.points.slice(0,Math.max(2,Math.ceil(progress*route.points.length))),route.member.color+'65');
}

function draw(){
 ctx.clearRect(0,0,width,height);for(const s of stars){ctx.fillStyle='#b8d3f0';ctx.globalAlpha=s.r===1?.18:.1;ctx.beginPath();ctx.arc(s.x*width,s.y*height,s.r,0,7);ctx.fill();}ctx.globalAlpha=1;
 radius=Math.min(width*(width<700?.48:.35),height*.36)*scale;
 const x=width*cx,y=height*cy;

 const halo=ctx.createRadialGradient(x,y,radius*.98,x,y,radius*1.09);halo.addColorStop(0,'#4aa8f020');halo.addColorStop(.25,'#4aa8f008');halo.addColorStop(1,'#4aa8f000');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,radius*1.09,0,7);ctx.fill();
 if(texture)earth();else{
  ctx.fillStyle='#0c2841';ctx.beginPath();ctx.arc(x,y,radius,0,7);ctx.fill();
  for(const polygon of world)line(polygon[0],'#78a7ab60');
 }
 networkDetails();
 if(state.scene==='opening')openingNetwork();
 ctx.strokeStyle='#8cd1ff40';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,y,radius,0,7);ctx.stroke();
 let visible=[];
 if(state.scene==='choose'||state.scene==='opening')visible=members.map(m=>({m,l:m.locations[0]}));
 if(state.scene==='places'||state.scene==='story'){
  const m=member(),revealed=m.locations.slice(0,state.place+1);visible=[{m,l:m.locations[state.place]}];
  if(state.scene==='story')for(const route of routes.filter(r=>r.member.id===m.id&&revealed.some(l=>l.place===r.fromId)&&revealed.some(l=>l.place===r.toId)))line(route.points,m.color+'aa');
  if(state.scene==='places'){
   const selected=m.locations[state.place],d=distanceToNewYork(places[selected.place]);
   visible=[{m,l:selected}];
   line(d.points.slice(0,Math.max(2,Math.ceil(distanceProgress*d.points.length))),m.color);
   const ny=project(newYorkReference.lat,newYorkReference.lon);
   if(ny.z>.03){ctx.fillStyle='#ff934a';ctx.beginPath();ctx.arc(ny.x,ny.y,4,0,Math.PI*2);ctx.fill();ctx.font='11px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('New York City',ny.x,ny.y-14);}
  }
 }
 if(state.scene==='connections'){
  visible=members.map(m=>({m,l:m.locations.find(l=>places[l.place].region==='new-york')||m.locations[0]}));
  for(const route of routes.filter(r=>r.newYork))line(route.points,route.member.color+'80');
 }
 renderPhotoMarkers(visible);

}
function renderPhotoMarkers(entries){
 const size=width<700?56:64,gap=size+18;
 const projected=entries.map(e=>({...e,q:project(places[e.l.place].lat,places[e.l.place].lon)})).filter(e=>e.q.z>.07);
 const groups=[];
 for(const e of projected){
  const nearby=groups.filter(g=>g.some(p=>Math.hypot(p.q.x-e.q.x,p.q.y-e.q.y)<gap));
  if(!nearby.length)groups.push([e]);
  else{const first=nearby[0];first.push(e);for(const other of nearby.slice(1)){first.push(...other);groups.splice(groups.indexOf(other),1);}}
 }
 const arranged=[];
 for(const group of groups){
  const center={x:group.reduce((v,e)=>v+e.q.x,0)/group.length,y:group.reduce((v,e)=>v+e.q.y,0)/group.length};
  group.forEach((e,i)=>{
   const angle=-Math.PI/2+i*2*Math.PI/group.length,spread=group.length===1?0:Math.max(80,gap*group.length/(2*Math.PI));
   arranged.push({...e,x:center.x+Math.cos(angle)*spread,y:center.y+Math.sin(angle)*spread});
  });
 }
 // Separate neighboring groups too; leave every geographic endpoint untouched.
 for(let pass=0;pass<12;pass++)for(let i=0;i<arranged.length;i++)for(let j=i+1;j<arranged.length;j++){
  const a=arranged[i],b=arranged[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
  if(d<gap){const ux=d?dx/d:1,uy=d?dy/d:0,move=(gap-d)/2+.1;a.x-=ux*move;a.y-=uy*move;b.x+=ux*move;b.y+=uy*move;}
 }
 const active=new Set();let leaders='';
 for(const e of arranged){
  e.x=Math.max(size/2+8,Math.min(width-size/2-8,e.x));e.y=Math.max(size/2+12,Math.min(height-180,e.y));
  const key=e.m.id+'-'+e.l.place;active.add(key);
  let button=$('markers').querySelector(`[data-marker-key="${key}"]`);
  if(!button){button=document.createElement('button');button.className='photo-marker';button.dataset.markerKey=key;button.dataset.member=e.m.id;button.dataset.placeIndex=e.m.locations.indexOf(e.l);button.innerHTML=avatar(e.m)+`<span class="map-name">${esc(e.m.shortName)}</span>`;$('markers').append(button);}
  button.style.left=e.x+'px';button.style.top=e.y+'px';button.style.setProperty('--accent',e.m.color);
  button.dataset.anchorX=e.q.x;button.dataset.anchorY=e.q.y;
  button.title=`${e.m.name} · ${places[e.l.place].name}`;
  button.setAttribute('aria-label',`Meet ${e.m.name} · ${places[e.l.place].name}`);
  button.setAttribute('aria-pressed',String(state.memberId===e.m.id));
  const dx=e.q.x-e.x,dy=e.q.y-e.y,d=Math.hypot(dx,dy)||1,sx=e.x+dx/d*size/2,sy=e.y+dy/d*size/2;
  leaders+=`<line data-marker-key="${key}" x1="${sx}" y1="${sy}" x2="${e.q.x}" y2="${e.q.y}" stroke="${e.m.color}" /><circle cx="${e.q.x}" cy="${e.q.y}" r="2.5" fill="${e.m.color}" stroke="${e.m.color}"/>`;
 }
 for(const button of [...$('markers').children])if(!active.has(button.dataset.markerKey))button.remove();
 $('marker-leaders').innerHTML=leaders;
}
function updateDistance(){
 const caption=$('distance-caption');caption.hidden=state.scene!=='places';
 if(caption.hidden)return;
 const m=member(),p=places[m.locations[state.place].place],d=distanceToNewYork(p);
 
 caption.innerHTML=`<span>${esc(p.name)} ↔ New York City</span><strong>≈ ${Math.round(d.km*distanceProgress).toLocaleString('en-US')} <small>km</small></strong>`;
}
function tick(now){
 if(now-paintTime<32){requestAnimationFrame(tick);return;}paintTime=now;visualTime=now;
 let dirty=!drawn;
 if(state.scene==='opening'&&!instant()&&!interacted)dirty=true;
 if(camera){const t=camera.duration?Math.min(1,(now-camera.start)/camera.duration):1,e=t*t*(3-2*t);distanceProgress=e;for(const k of ['lat','lon','scale','cx','cy']){const value=camera.from[k]+(camera.to[k]-camera.from[k])*e;if(k==='lat')lat=value;if(k==='lon')lon=value;if(k==='scale')scale=value;if(k==='cx')cx=value;if(k==='cy')cy=value;}dirty=true;if(t===1){const resolve=camera.resolve;camera=null;resolve();}}
 if(state.scene==='opening'&&!interacted&&!instant()){lon+=Math.min(now-last,50)*.0015;dirty=true;}last=now;
 if(dirty){draw();updateDistance();drawn=true;}requestAnimationFrame(tick);
}
new ResizeObserver(()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(!camera){const t=target();cx=t.cx;cy=t.cy;scale=t.scale;}drawn=false;}).observe(canvas);
const image=new Image();image.onload=()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const cctx=c.getContext('2d',{willReadFrequently:true});cctx.drawImage(image,0,0,1024,512);texture=cctx.getImageData(0,0,1024,512);surfaceLat=null;drawn=false;};image.onerror=()=>{$('asset-status').textContent='Earth texture unavailable. Showing the geographic fallback.';};image.src='./public/earth.jpg';
fetch('./public/world.geo.json').then(r=>r.json()).then(data=>{world=data.features.flatMap(f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates);drawn=false;}).catch(()=>{});
document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement)$('asset-status').textContent=`Photo unavailable: ${e.target.alt}. Please reload.`;},true);
render();requestAnimationFrame(tick);
