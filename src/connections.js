import {members,places} from './team.js';
const rad=Math.PI/180;
export function distanceKm(a,b){
 const h=Math.sin((b.lat-a.lat)*rad/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin((b.lon-a.lon)*rad/2)**2;
 return 6371*2*Math.asin(Math.sqrt(Math.min(1,Math.max(0,h))));
}
export function arcPoints(a,b){
 const vector=p=>[Math.cos(p.lat*rad)*Math.cos(p.lon*rad),Math.cos(p.lat*rad)*Math.sin(p.lon*rad),Math.sin(p.lat*rad)];
 const v=vector(a),w=vector(b),angle=Math.acos(Math.max(-1,Math.min(1,v.reduce((sum,n,i)=>sum+n*w[i],0))));
 if(angle<1e-8)return [[a.lon,a.lat],[b.lon,b.lat]];
 return Array.from({length:101},(_,i)=>{const t=i/100,s=Math.sin(angle);const q=v.map((n,j)=>(Math.sin((1-t)*angle)*n+Math.sin(t*angle)*w[j])/s);return [Math.atan2(q[1],q[0])/rad,Math.atan2(q[2],Math.hypot(q[0],q[1]))/rad];});
}
// Connect each supplied New York place to that member's other places.
// Fariza's documented connection remains Aktobe–China; no New York place is inferred.
export const routes=members.flatMap(member=>{
 const anchor=member.locations.find(l=>places[l.place].region==='new-york')||member.locations[0];
 return member.locations.filter(l=>l!==anchor).map(location=>{
  const from=places[location.place],to=places[anchor.place];
  return {id:`${member.id}-${location.place}`,member,from,to,fromId:location.place,toId:anchor.place,newYork:to.region==='new-york',distance:distanceKm(from,to),points:arcPoints(from,to)};
 });
});

// A consistent city reference for distance comparisons, not an inferred home.
export const newYorkReference={name:'New York City',lat:40.7128,lon:-74.0060};
export function distanceToNewYork(place){
 return {from:place,to:newYorkReference,km:distanceKm(place,newYorkReference),points:arcPoints(place,newYorkReference)};
}
