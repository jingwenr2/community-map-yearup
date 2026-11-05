import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {members,places,connectionTypes} from '../src/team.js';
import {routes,distanceKm,arcPoints} from '../src/connections.js';
for(const m of members){
 assert(m.photo?.startsWith('./public/photos/'));
 const photo=await readFile(m.photo);
 assert(photo.length>1000,`${m.name} photo is empty`);
 if(m.photo.endsWith('.png'))assert.equal(photo.subarray(1,4).toString(),'PNG');
 else assert(photo[0]===0xff&&photo[1]===0xd8,`${m.name} JPEG extension must match image content`);
}
assert.equal(members.length,6);assert.equal(new Set(members.map(m=>m.id)).size,6);
for(const m of members){assert(m.locations.length>=2);assert(m.story&&m.communities.length);for(const l of m.locations){assert(places[l.place]);assert(l.types.length);l.types.forEach(t=>assert(connectionTypes[t]));}}
for(const p of Object.values(places)){assert(p.country&&p.flag);assert(p.lat>=-90&&p.lat<=90);assert(p.lon>=-180&&p.lon<=180);}
const byId=Object.fromEntries(members.map(m=>[m.id,m]));
assert.deepEqual(byId.ricardo.locations.find(l=>l.place==='colombia').types,['roots']);
assert.deepEqual(byId.ibrahim.locations.find(l=>l.place==='nigeria').types,['culture']);
assert.deepEqual(byId.jenny.locations.find(l=>l.place==='chengdu').types,['roots']);
assert(!byId.jenny.languages);assert(!byId.fariza.locations.some(l=>l.types.includes('home')));
assert.equal(Object.values(places).filter(p=>p.countryLevel).length,4);
assert.equal(distanceKm(places.queens,places.queens),0);
assert(Math.abs(distanceKm({lat:0,lon:0},{lat:0,lon:90})-10007.5)<1);
assert.equal(routes.filter(r=>r.newYork).length,7);
assert.deepEqual(byId.christina.locations.map(l=>l.place),['mexico','queens']);
assert(routes.filter(r=>r.member.id==='fariza').every(r=>!r.newYork));
for(const route of routes){assert(Number.isFinite(route.distance)&&route.distance>0);const points=arcPoints(route.from,route.to);assert(Math.abs(points[0][0]-route.from.lon)<1e-6);assert(Math.abs(points.at(-1)[1]-route.to.lat)<1e-6);}
const geography=JSON.parse(await readFile('public/world.geo.json','utf8'));assert(geography.features.length>100);
for(const path of ['src/app.js','src/team.js','src/connections.js','scripts/build.mjs','scripts/serve.mjs'])execFileSync(process.execPath,['--check',path]);
console.log('Checks passed: member data, location semantics, country anchors, map assets, connection distances and arc endpoints, JavaScript syntax.');

assert.equal(byId.yense.name,'Yense Saavedra');
assert.deepEqual(byId.yense.locations.find(l=>l.place==='mexico').types,['culture']);
assert.deepEqual(byId.yense.locations.find(l=>l.place==='newyork').types,['birthplace']);
assert.deepEqual(byId.yense.locations.find(l=>l.place==='queens').types,['upbringing']);
assert.deepEqual(byId.yense.languages,['English','Spanish']);
assert(byId.yense.communityStory.includes('Mexico'));
