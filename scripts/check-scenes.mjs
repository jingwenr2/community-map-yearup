import assert from 'node:assert/strict';
import {members,places} from '../src/team.js';
import {distanceToNewYork,newYorkReference} from '../src/connections.js';
import {initialState,step,profileStories,sharedInsights} from '../src/scenes.js';
assert.deepEqual(initialState,{scene:'summary',memberId:null});
assert.deepEqual(step(initialState,'back'),{scene:'person',memberId:members.at(-1).id});
let state=step(initialState,{type:'select',memberId:members[0].id});
for(const m of members){
 assert.equal(state.scene,'person');assert.equal(state.memberId,m.id);
 assert(profileStories[m.id]?.length>40);assert(/\bI\b/.test(profileStories[m.id]));assert.equal(profileStories[m.id].match(/[.!?](?:\s|$)/g)?.length,m.id==='ibrahim'?6:3);
 const next=step(state,'next');assert.deepEqual(step(next,'back'),state);
 assert.deepEqual(step(next,'home'),initialState);
 assert.deepEqual(step(initialState,{type:'select',memberId:m.id}),state);
 state=next;
}
assert.deepEqual(state,{scene:'summary',memberId:null});
assert.deepEqual(step(state,'next'),state);
assert.deepEqual(step(initialState,'connections'),state);
assert.equal(sharedInsights.length,6);
assert.deepEqual(sharedInsights.map(i=>i.title),['Respect and value others','Engage and embrace diversity','Build trust, be honest','Strive to learn','Be accountable','Work hard and have fun']);
assert(sharedInsights.every(i=>i.title&&i.text));
assert.deepEqual(step(initialState,{type:'select',memberId:'unknown'}),initialState);
for(const text of ['president of both the Math Club and Chinese Culture Club','five or six','fun, educational','become friends','making space for others','take part','listening'])assert(profileStories.jenny.includes(text));
assert.equal(distanceToNewYork(newYorkReference).km,0);
for(const m of members)for(const l of m.locations){const d=distanceToNewYork(places[l.place]);assert(Number.isFinite(d.km));assert(d.points.length>=2);}
console.log('Scene checks passed: six complete profiles in order, Next/Back, direct selection, one final summary, Jenny’s supplied leadership story, and geographic references.');
