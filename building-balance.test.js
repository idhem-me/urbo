import assert from 'node:assert/strict';
import {initial,TYPES,maxLevel,effects,upgrade,upgradeCost,requirements,projectCost,projectDuration,restore,stats,validPlot,accrue} from './src/engine.js';
import {BUILDING_ASSETS,resolveAsset} from './src/assets/manifest.js';
const resourceKeys=['timber','stone'];
assert.equal(Object.keys(TYPES).length,27);
assert.equal(Object.keys(TYPES).filter(t=>maxLevel(t)===3).length,4);
for(const type of Object.keys(TYPES)){
 const limit=maxLevel(type);assert.equal(Object.keys(BUILDING_ASSETS[type]).length,limit);
 for(let level=1;level<=limit;level++)assert.equal(resolveAsset(type,level).level,level);
 const s=initial(0);s.money=1e9;s.buildings=[{type,x:2,y:2,level:limit}];s.projects=[];
 assert.equal(upgradeCost(s.buildings[0],s),null);
 const before=s.money;assert.equal(upgrade(s,2,2,0),'Niveau maximal atteint.');assert.equal(s.money,before);assert.equal(s.projects.length,0);
 assert.ok(requirements(s,type,limit+1).includes('Niveau maximal atteint.'));
 const a=effects({type,level:1}),b=effects({type,level:limit});
 for(const field of ['homes','jobs','educatedJobs','green','power','education','fire','police','ambulance','health','admin','builders'])assert.equal(b[field],a[field]*3,`${type}: late-game ${field}`);
 for(const [key,amount] of Object.entries(a.produce))assert.equal(b.produce[key],amount*3);
 if(limit===2){assert.equal(projectCost(type,2).money,Math.ceil(TYPES[type].cost/1000*2.4)*1000);assert.ok(projectDuration(type,2)>projectDuration(type,1));}
}
// Complete and pending removed upgrades are migrated without losing the city or double refunding.
const legacy=initial(0);legacy.version=8;legacy.tutorial.enabled=false;legacy.money=1000000;
legacy.buildings=[{type:'fire',x:0,y:0,level:3},{type:'school',x:1,y:0,level:2},{type:'house',x:2,y:0,level:3}];
legacy.owned=['0,0','1,0','2,0'];
legacy.projects=[{type:'school',x:1,y:0,level:3,finish:60000,startedAt:0,duration:60000}];
const oldCost=(type,factor)=>{const base=TYPES[type].cost/1000;return {money:Math.ceil(base*factor)*1000,timber:Math.ceil(base/20*factor)*10,stone:Math.ceil(base/25*factor)*10};};
const refund=oldCost('school',1.8**2),first=oldCost('fire',1.8),last=oldCost('fire',1.8**2),replacement=projectCost('fire',2);
for(const key of ['money',...resourceKeys])refund[key]+=first[key]+last[key]-replacement[key];
const migrated=restore(JSON.stringify(legacy),0);
assert.equal(migrated.version,10);assert.equal(migrated.buildings.length,3);assert.equal(migrated.buildings[0].level,2);assert.equal(migrated.buildings[2].level,3);assert.equal(migrated.projects.length,0);
assert.equal(migrated.money,legacy.money+refund.money);
for(const key of resourceKeys)assert.equal(migrated.resources[key],legacy.resources[key]+refund[key]);
assert.deepEqual(restore(JSON.stringify(migrated),0),migrated);
const invalid=structuredClone(migrated);invalid.buildings[0].level=3;assert.deepEqual(restore(JSON.stringify(invalid),0),initial(0));
// Existing level-2 districts gain capacity without a sudden increase of recurring expenses.
const legacy2={...initial(0),version:8,owned:['0,0'],buildings:[{type:'fire',x:0,y:0,level:2}]};
const migrated2=restore(JSON.stringify(legacy2),0);assert.equal(effects(migrated2.buildings[0]).upkeep,Math.ceil(TYPES.fire.upkeep*2*1.35));assert.equal(migrated2.money,legacy2.money);
// A serviced late-game city can sustain the population needed for level 3.
const city=initial(0);city.tutorial.enabled=false;city.money=1e8;city.resources.food=1e6;city.resources.coal=1e6;city.owned=[];
for(let y=0;y<11;y++)for(let x=0;x<11;x++)if(validPlot(x,y))city.owned.push(`${x},${y}`);
const types=['tower','tower','tower','park','park','park','solar','solar','townhall','fire','police','hospital','school','shop','farm'];
city.buildings=types.map((type,i)=>{const [x,y]=city.owned[i].split(',').map(Number);return {type,x,y,level:maxLevel(type)};});city.peakPeople=200;
assert.deepEqual(requirements(city,'tower',3),[]);assert.ok(stats(city).income>0);accrue(city,600000);assert.equal(city.gameOver,null);assert.ok(city.money>1e8);assert.ok(stats(city).energyRatio>=.8);
console.log('27 types / 58 niveaux : plafonds réels, capacités finales, remboursements uniques, anciennes villes et économie soutenable validés.');
