import {projectDuration} from './engine.js';
export function constructionProgress(project,now){
 const duration=Number.isFinite(project.duration)&&project.duration>0?project.duration:projectDuration(project.type,project.level);
 const startedAt=Number.isFinite(project.startedAt)?project.startedAt:project.finish-duration;
 const remaining=Math.max(0,project.finish-now),percent=Math.max(0,Math.min(100,Math.floor((now-startedAt)/duration*100)));
 return {percent,seconds:Math.ceil(remaining/1000),duration,startedAt};
}
export const constructionKey=p=>`${p.x},${p.y},${p.level},${p.finish}`;
