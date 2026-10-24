import {sameState} from './city-store.js';
export class CitySync {
 constructor(client,userId,store,{onChange=()=>{},onStatus=()=>{}}={}){this.client=client;this.userId=userId;this.store=store;this.onChange=onChange;this.onStatus=onStatus;this.cancelled=false;this.busy=false;this.pulling=false;this.timer=null;}
 dispose(){this.cancelled=true;clearTimeout(this.timer);}
 schedule(){if(this.cancelled||this.timer)return;this.timer=setTimeout(()=>{this.timer=null;this.flush();},5000);}
 async pull(){
  if(this.cancelled||this.pulling)return;this.pulling=true;try{const rows=[];for(let page=0;;page++){const {data,error}=await this.client.from('cities').select('id,state,revision,imported_from,created_at,updated_at').eq('user_id',this.userId).order('id').range(page*100,page*100+99);if(this.cancelled)return;if(error)throw error;rows.push(...data);if(data.length<100)break;}
  if(this.cancelled)return;const copies=this.store.merge(rows);this.onChange({copies});return rows;}finally{this.pulling=false;}
 }
 async conflict(id,originId=null){
  let {data,error}=await this.client.from('cities').select('id,state,revision,imported_from,created_at,updated_at').eq('user_id',this.userId).eq('id',id).maybeSingle();
  if(this.cancelled)return;if(error)throw error;
  if(!data&&originId){const result=await this.client.from('cities').select('id,state,revision,imported_from,created_at,updated_at').eq('user_id',this.userId).eq('imported_from',originId).maybeSingle();if(this.cancelled)return;if(result.error)throw result.error;data=result.data;}
  if(!data)throw Error('Ville distante supprimée. Copie locale conservée.');
  let extraCopy=0;
  if(data.id!==id){const local=this.store.cities.find(c=>c.id===id);if(local){if(sameState(local.state,data.state)){this.store.data.cities=this.store.cities.filter(c=>c.id!==id);if(this.store.data.activeId===id)this.store.data.activeId=data.id;}else{local.originId=null;local.state.cityName=[...(local.state.cityName||'Ma ville')].slice(0,20).join('')+' (copie locale)';local.localRevision++;extraCopy=1;}}}
  const copies=this.store.merge([data]);this.onChange({copies:copies+extraCopy});
 }
 async flush(){
  if(this.cancelled||this.busy)return;if(this.pulling){this.schedule();return;}this.busy=true;this.onStatus('Synchronisation…','neutral');
  try{for(const entry of [...this.store.cities].filter(c=>c.dirty)){
    if(this.cancelled)return;const snapshot=structuredClone(entry),revision=snapshot.serverRevision;
    let result;
    if(revision===0)result=await this.client.from('cities').insert({id:snapshot.id,user_id:this.userId,state:snapshot.state,revision:1,imported_from:snapshot.originId||null}).select('revision').single();
    else result=await this.client.from('cities').update({state:snapshot.state,revision:revision+1}).eq('id',snapshot.id).eq('user_id',this.userId).eq('revision',revision).select('revision').maybeSingle();
    if(this.cancelled)return;
    if(result.error){if(result.error.code==='23505'){await this.conflict(snapshot.id,snapshot.originId);continue;}throw result.error;}
    if(!result.data){await this.conflict(snapshot.id,snapshot.originId);continue;}
    this.store.ack(snapshot.id,result.data.revision,snapshot.localRevision);
   }
   if(!this.cancelled){const dirty=this.store.cities.some(c=>c.dirty);this.onStatus(dirty?'Modifications en attente':'Villes synchronisées',dirty?'warning':'success');if(dirty)this.schedule();}
  }catch(error){if(!this.cancelled)this.onStatus(['42P01','PGRST205'].includes(error.code)?'Base à configurer : exécutez la migration 002.':'Cloud indisponible. Copie locale conservée.','warning');}
  finally{this.busy=false;}
 }
 async refresh(){if(this.busy||this.pulling){this.schedule();return;}try{await this.pull();await this.flush();}catch(error){if(!this.cancelled)this.onStatus(['42P01','PGRST205'].includes(error.code)?'Base à configurer : exécutez la migration 002.':'Cloud indisponible. Copie locale conservée.','warning');}}
}
