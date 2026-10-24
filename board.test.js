import assert from 'node:assert/strict';
import {GRID,START_MIN,START_CENTER,validPlot,startingLand} from './src/board.js';
import {initial,restore,owns,buyLand,build,adjacentLand,landPrice} from './src/engine.js';
assert.equal(GRID,24);assert.equal(GRID*GRID,576);
let count=0;for(let y=0;y<GRID;y++)for(let x=0;x<GRID;x++)if(validPlot(x,y))count++;assert.equal(count,576);
assert.ok(validPlot(3,7));assert.ok(validPlot(7,3));assert.ok(!validPlot(-1,0));assert.ok(!validPlot(24,0));assert.ok(!validPlot(0,24));
const fresh=initial(0);assert.equal(fresh.owned.length,16);assert.equal(fresh.version,10);
for(const b of fresh.buildings)assert.ok(owns(fresh,b.x,b.y));
const points=startingLand().map(s=>s.split(',').map(Number));for(const axis of [0,1])assert.equal(points.reduce((n,p)=>n+p[axis],0)/16,START_CENTER);
assert.equal(landPrice(fresh),50000);const before=fresh.money;
assert.ok(adjacentLand(fresh,START_MIN-1,START_MIN));assert.equal(buyLand(fresh,START_MIN-1,START_MIN,0),null);assert.equal(fresh.money,before-50000);assert.ok(landPrice(fresh)>50000);
// Former road coordinates are normal purchasable/buildable terrain.
const formerRoad=initial(0);formerRoad.owned=['2,7'];formerRoad.buildings=[];assert.equal(buyLand(formerRoad,3,7,0),null);assert.equal(build(formerRoad,'house',3,7,0),null);
// Migration translates everything by the same offset and preserves investments and times.
const old={...initial(1000),version:9,owned:['0,0','1,0','2,0','0,1'],buildings:[{type:'house',x:0,y:0,level:2},{type:'shop',x:1,y:0,level:1}],projects:[{type:'house',x:2,y:0,level:1,startedAt:1000,duration:3000,finish:4000}]};
const next=restore(JSON.stringify(old),1000);assert.equal(next.version,10);assert.equal(next.money,old.money);assert.deepEqual(next.resources,old.resources);assert.equal(next.owned.length,old.owned.length);assert.equal(next.projects.length,1);
const dx=next.buildings[0].x,dy=next.buildings[0].y;
assert.ok(dx>=10&&dy>=10);assert.equal(next.buildings[1].x-old.buildings[1].x,dx);assert.equal(next.projects[0].x-old.projects[0].x,dx);assert.equal(next.projects[0].y,dy);assert.equal(next.projects[0].finish,4000);
for(const b of [...next.buildings,...next.projects])assert.ok(owns(next,b.x,b.y));
assert.deepEqual(restore(JSON.stringify(next),1000),next);
console.log('Plateau : 576 cases sans routes bloquées, départ centré, extensions et migration stable validés.');

// Expanded map prices remain increasing without extrapolating the old steep curve over 560 purchases.
let last=0;for(let count=16;count<576;count++){const price=landPrice({owned:Array(count)});assert.ok(Number.isSafeInteger(price));assert.ok(price>last);last=price;}
assert.ok(last<150000000);assert.equal(landPrice({owned:Array(48)}),Math.ceil(50000*1.12**32));
