import {members,places,connectionTypes} from './team.js';
import {routes} from './connections.js';
import {initialState,step,sharedInsights,profileStories} from './scenes.js';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={...initialState},busy=false,lat=places[members[0].locations[0].place].lat,lon=places[members[0].locations[0].place].lon,scale=.85,cx=.76,cy=.43,width=0,height=0,radius=0;
let camera=null,texture=null,world=[],drawn=false,paintTime=0;
let surfaceLat=null,surfaceLon=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),canvas=$('globe'),ctx=canvas.getContext('2d'),rad=Math.PI/180;
const surface=document.createElement('canvas');surface.width=surface.height=440;const surfaceCtx=surface.getContext('2d');
const sphere=surfaceCtx.createImageData(440,440),stars=Array.from({length:24},(_,i)=>({x:((i*7919)%1009)/1009,y:((i*3571)%997)/997,r:i%7===0?1:.55}));
const instant=()=>reduced.matches||$('instant').checked;
const member=()=>members.find(m=>m.id===state.memberId);
const avatar=(m,extra='')=>`<span class="avatar ${extra}" style="--accent:${m.color};--photo-position:${m.photoPosition||'50% 50%'};--photo-scale:${m.photoScale||1};--photo-origin:${m.photoOrigin||'50% 50%'}"><img src="${esc(m.photo)}" alt="${esc(m.name)}" draggable="false"></span>`;
const flag=p=>`<span class="country-flag" role="img" aria-label="${p.country}">${p.flag}</span>`;
const identity=m=>`<div class="identity">${avatar(m,'profile-photo')}<div class="identity-copy"><h1 class="student-name">${m.name}</h1><p class="student-subtitle">${m.subtitle}</p></div></div>`;
function render(){
 const m=member(),summary=state.scene==='summary';$('exhibit').dataset.scene=state.scene;
 for(const id of ['navigation','presentation-controls','motion-control','member-selector','map-information'])$(id).hidden=false;
 $('map-information').removeAttribute('open');
 $('member-selector').innerHTML=members.map(m=>`<button data-member="${m.id}" aria-pressed="${state.memberId===m.id}">${avatar(m)}<span class="nav-country" title="${places[m.locations[0].place].country} · ${m.locations[0].types.map(t=>connectionTypes[t].label).join(' / ')}">${flag(places[m.locations[0].place])}</span><span>${m.shortName}</span></button>`).join('');
 let html='';
 if(m){
  const facts=[m.languages?.length?`<span><b>Languages:</b> ${esc(m.languages.join(' · '))}</span>`:'',m.interests.length?`<span><b>Interests:</b> ${esc(m.interests.join(' · '))}</span>`:'',m.colors?.length?`<span><b>Colors:</b> ${esc(m.colors.join(' · '))}</span>`:''].filter(Boolean).join('');
  html=`${identity(m)}<p class="personal-story">${profileStories[m.id]}</p><section class="profile-communities"><h2>My communities</h2><p>${m.communities.join(' · ')}</p></section><section class="profile-places"><h2>My places</h2><ul>${m.locations.map(l=>{const p=places[l.place];return `<li title="${esc(l.detail)}">${flag(p)} <span>${p.name}</span><small>${l.types.map(t=>connectionTypes[t].label).join(' · ')}</small></li>`;}).join('')}</ul></section><div class="personal-facts">${facts}</div>`;
 }else html=`<p class="eyebrow">Our shared connections</p><h1 class="scene-title">What we take forward</h1><div class="shared-summary">${sharedInsights.map((i,index)=>`<section><h2><span>${index+1}.</span> ${i.title}</h2><p>${i.text}</p></section>`).join('')}</div>`;
 $('content').innerHTML=html;$('content').scrollTop=0;
 $('progress').textContent=summary?'Shared summary':`${members.findIndex(n=>n.id===m.id)+1} of ${members.length} · ${m.shortName}`;
 $('next').textContent=summary?'Next →':members.at(-1).id===m.id?'Shared summary →':'Next →';
 $('next').disabled=summary;$('back').disabled=!summary&&m.id===members[0].id;
 drawn=false;
}
function target(){
 const mobile=canvas.clientWidth<700,m=member(),p=m?places[m.locations[0].place]:{lat:24,lon:-35};
 return {lat:p.lat,lon:p.lon,scale:m?.85:.78,cx:mobile?.5:.76,cy:mobile?.20:.43};
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
 (state.scene==='summary'?$ ('back'):$('next')).focus({preventScroll:true});$('content').scrollTop=0;
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
 ctx.strokeStyle='#8cd1ff40';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,y,radius,0,7);ctx.stroke();
 let visible=[];
 if(state.scene==='person'){
  const m=member();visible=m.locations.map(l=>({m,l}));
  for(const route of routes.filter(r=>r.member.id===m.id))line(route.points,m.color+'a0');
 }else{
  visible=members.map(m=>({m,l:m.locations.find(l=>places[l.place].region==='new-york')||m.locations[0]}));
  for(const route of routes)line(route.points,route.member.color+'70');
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
  if(!button){button=document.createElement('button');button.className='photo-marker';button.dataset.markerKey=key;button.dataset.member=e.m.id;button.dataset.placeIndex=e.m.locations.indexOf(e.l);button.innerHTML=avatar(e.m)+`<span class="map-name">${flag(places[e.l.place])} ${esc(e.m.shortName)}</span>`;$('markers').append(button);}
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
