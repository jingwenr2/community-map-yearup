import assert from 'node:assert/strict';
import {members,places} from '../src/team.js';
import {distanceToNewYork,newYorkReference} from '../src/connections.js';
import {initialState,step,chapters,sharedInsights} from '../src/scenes.js';
assert.equal(initialState.memberId,null);
assert.equal(initialState.scene,'connections');assert.equal(initialState.insight,0);assert.equal(step(initialState,'next').insight,1);assert.deepEqual(step(initialState,'back'),initialState);
const choose=step(initialState,'choose');assert.equal(choose.scene,'choose');assert.equal(choose.memberId,null);
assert.deepEqual(step(choose,'next'),choose);
for(const m of members){
 let s={...choose,scene:'places',memberId:m.id,place:0};
 assert.equal(step(s,'back').scene,'choose');
 for(let i=0;i<m.locations.length;i++){
  assert.equal(s.place,i);assert.equal(s.scene,'places');
  assert.equal(step(s,'meet').scene,'story');
  const next=step(s,'next');
  if(i<m.locations.length-1)assert.deepEqual(step(next,'back'),s);
  s=next;
 }
 assert.equal(s.scene,'story');assert.equal(step(s,'back').scene,'places');
 assert(chapters(m).every(c=>c.text));
 for(let i=0;i<chapters(m).length;i++){
  assert.equal(s.chapter,i);assert.equal(s.scene,'story');
  assert.equal(step(s,'globe').scene,'places');
  s=step(s,'next');
 }
 assert.equal(s.scene,'choose');assert.equal(s.memberId,null);
 assert.deepEqual(step(s,'home'),initialState);
}
let s=step(choose,'connections');
for(let i=0;i<sharedInsights.length;i++){assert.equal(s.insight,i);const n=step(s,'next');if(i<3)assert.deepEqual(step(n,'back'),s);s=n;}
assert.equal(s.scene,'choose');
assert.equal(chapters({communities:['A'],story:'',belonging:''}).length,1);
console.log('Scene checks passed: connections homepage, no automatic selection, every member/place/chapter, shared insights, omitted answers, forward and return navigation.');

assert.equal(members.find(m=>m.id==='christina').locations[0].place,'mexico');
assert.equal(distanceToNewYork(newYorkReference).km,0);
for(const m of members){
 assert.notEqual(places[m.locations[0].place].region,'new-york');
 for(const l of m.locations){
  const d=distanceToNewYork(places[l.place]);
  assert(Number.isFinite(d.km)&&d.km>=0&&d.km<=20016);
  assert.equal(d.points.at(-1)[0].toFixed(4),newYorkReference.lon.toFixed(4));
  assert.equal(d.points.at(-1)[1].toFixed(4),newYorkReference.lat.toFixed(4));
 }
}
const mexico=distanceToNewYork(places.mexico).km;
assert(mexico>3000&&mexico<4000);
console.log('Distance checks passed: all member places to a consistent New York City reference, Mexico introduction, zero distance, and arc endpoints.');

assert.equal(step(initialState,'connections').scene,'connections');
assert.equal(step(initialState,'connections').insight,0);
assert.deepEqual(step(step(initialState,'connections'),'home'),initialState);
