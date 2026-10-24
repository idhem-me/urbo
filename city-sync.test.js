import assert from 'node:assert/strict';
import {CityStore,sameState} from './src/city-store.js';
import {CitySync} from './src/city-sync.js';
import {initial} from './src/engine.js';
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
let sequence=200;const idFactory=()=>`00000000-0000-4000-8000-${String(sequence++).padStart(12,'0')}`;
const db=new Map();let beforeExecute=null;
function client(user){return {from(table){assert.equal(table,'cities');return new Query(user);}};}
class Query{
 constructor(user){this.user=user;this.filters=[];this.action='select';this.singleRow=false;}
 select(){return this;}eq(k,v){this.filters.push([k,v]);return this;}order(){return this;}range(a,b){this.rangeValue=[a,b];return this;}insert(row){this.action='insert';this.payload=row;return this;}update(row){this.action='update';this.payload=row;return this;}
 single(){this.singleRow=true;return this.execute();}maybeSingle(){this.singleRow=true;return this.execute();}then(resolve,reject){return this.execute().then(resolve,reject);}
 async execute(){if(beforeExecute)await beforeExecute(this);let rows=[...db.values()].filter(row=>row.user_id===this.user&&this.filters.every(([k,v])=>row[k]===v));
  if(this.action==='insert'){if(this.payload.user_id!==this.user)return {data:null,error:{code:'42501'}};if(db.has(this.payload.id)||this.payload.imported_from&&[...db.values()].some(r=>r.user_id===this.user&&r.imported_from===this.payload.imported_from))return {data:null,error:{code:'23505'}};const row={...structuredClone(this.payload),created_at:'2026-01-01',updated_at:'2026-01-01'};db.set(row.id,row);return {data:structuredClone(row),error:null};}
  if(this.action==='update'){if(!rows.length)return {data:null,error:null};const row=rows[0];assert.equal(this.payload.revision,row.revision+1);Object.assign(row,structuredClone(this.payload));return {data:structuredClone(row),error:null};}
  if(this.rangeValue)rows=rows.slice(this.rangeValue[0],this.rangeValue[1]+1);return {data:this.singleRow?structuredClone(rows[0]||null):structuredClone(rows),error:null};
 }
}
const store=new CityStore({storage:storage(),owner:'user:A',now:()=>0,idFactory});store.create(initial(0));const statuses=[],sync=new CitySync(client('A'),'A',store,{onStatus:(...s)=>statuses.push(s)});
try{
 await sync.flush();assert.equal(db.size,1);assert.equal(store.active.dirty,false);assert.equal(store.active.serverRevision,1);
 store.save({...store.active.state,money:1400000});let release,started;const ready=new Promise(r=>started=r),barrier=new Promise(r=>release=r);beforeExecute=async q=>{if(q.action==='update'){started();await barrier;}};const pending=sync.flush();await ready;store.save({...store.active.state,money:1500000});release();await pending;beforeExecute=null;assert.equal(store.active.dirty,true);assert.equal(db.get(store.active.id).state.money,1400000);await sync.flush();assert.equal(store.active.dirty,false);assert.equal(db.get(store.active.id).state.money,1500000);
 const original=store.active.id;store.save({...store.active.state,money:1700000});db.get(original).revision++;db.get(original).state.cityName='Autre appareil';await sync.flush();assert.equal(store.cities.length,2);assert.notEqual(store.active.id,original);assert.equal(store.active.state.money,1700000);await sync.flush();assert.equal(db.size,2);
 const otherStore=new CityStore({storage:storage(),owner:'user:B',now:()=>0,idFactory}),other=new CitySync(client('B'),'B',otherStore);await other.pull();assert.equal(otherStore.cities.length,0);other.dispose();
 store.save({...store.active.state,money:1800000});beforeExecute=async()=>{throw Error('offline');};await sync.flush();assert.equal(store.active.dirty,true);assert.equal(statuses.at(-1)[1],'warning');beforeExecute=null;
 assert.ok(sameState({a:1,b:{x:2,y:3}},{b:{y:3,x:2},a:1}));
 console.log('Cloud simulé : insertion, révision CAS, modifications pendant envoi, copies de conflit, isolation compte et panne réseau OK.');
}finally{beforeExecute=null;sync.dispose();}
