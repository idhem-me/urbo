import assert from 'node:assert/strict';
import {initial,stats,build,upgrade,accrue,restore,tutorialStep,TUTORIAL_STEPS,projectDuration,skipTutorial,validPlot,owns} from './src/engine.js';
import {sceneColor} from './src/scene.js';
const s=initial(0),baseIncome=stats(s).income;let now=0;
const empty=()=>{for(let y=0;y<24;y++)for(let x=0;x<24;x++)if(validPlot(x,y)&&owns(s,x,y)&&!s.buildings.some(b=>b.x===x&&b.y===y))return {x,y};};
for(const type of ['house','house','solar','farm','shop']){
 const before=s.money,step=tutorialStep(s),cell=empty();assert.equal(step.type,type);assert.equal(projectDuration(type,1,s),3000);assert.equal(build(s,type,cell.x,cell.y,now),null);const finish=s.projects.at(-1).finish;assert.equal(finish-now,3000);accrue(s,finish);now=finish;assert.ok(s.money>before-400000);assert.equal(s.tutorial.step,TUTORIAL_STEPS.indexOf(step)+1);
}
assert.equal(s.tutorial.step,5);assert.ok(stats(s).income>baseIncome*5);assert.equal(s.tutorial.income,0);
accrue(s,now+20000);now+=20000;assert.equal(s.tutorial.step,6);assert.ok(s.tutorial.income>=5000);
const house=s.buildings.find(b=>b.type==='house');assert.equal(upgrade(s,house.x,house.y,now),null);assert.equal(s.projects.at(-1).finish-now,4000);accrue(s,now+4000);now+=4000;assert.equal(s.tutorial.enabled,false);assert.equal(s.tutorial.step,7);assert.ok(s.money>500000);assert.ok(stats(s).income>30000);assert.equal(s.gameOver,null);
const finalMoney=s.money;accrue(s,now);assert.equal(s.money,finalMoney);assert.deepEqual(restore(JSON.stringify(s),now),s);
const reloaded=restore(JSON.stringify(s),now);assert.equal(reloaded.tutorial.enabled,false);assert.equal(reloaded.money,finalMoney);
const old={...initial(0),version:7};delete old.tutorial;const migrated=restore(JSON.stringify(old),0);assert.equal(migrated.tutorial.enabled,false);assert.equal(migrated.money,1200000);assert.equal(migrated.buildings.length,3);
const fresh=initial(0);skipTutorial(fresh);assert.equal(fresh.tutorial.enabled,false);assert.equal(projectDuration('house',1,fresh),15000);
const capped=initial(0);capped.tutorial.fastBuilds=0;assert.equal(projectDuration('house',1,capped),15000);
assert.equal(sceneColor('#cbded7',false),'#cbded7');assert.equal(sceneColor('#cbded7',true),'#0b1422');assert.equal(sceneColor('#73938a',true),'#f6d88c');assert.notEqual(sceneColor('#edcba0',true),'#edcba0');
console.log(`Guide terminé en ${now/1000} s simulées : ${Math.round(s.money)} €, ${Math.round(stats(s).income)} €/min. Primes uniques, sauvegarde, migration et nuit OK.`);
