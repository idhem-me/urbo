export const GRID=24;
export const START_SIZE=4;
export const START_MIN=(GRID-START_SIZE)/2;
export const START_CENTER=(GRID-1)/2;
export const validPlot=(x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<GRID&&y<GRID;
export function startingLand(){const tiles=[];for(let y=START_MIN;y<START_MIN+START_SIZE;y++)for(let x=START_MIN;x<START_MIN+START_SIZE;x++)tiles.push(`${x},${y}`);return tiles;}
export function centerLegacyBoard(state){
 const points=state.owned.map(key=>key.split(',').map(Number));if(!points.length)return;
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const dx=Math.floor((GRID-(Math.max(...xs)-Math.min(...xs)+1))/2)-Math.min(...xs);
 const dy=Math.floor((GRID-(Math.max(...ys)-Math.min(...ys)+1))/2)-Math.min(...ys);
 state.owned=points.map(([x,y])=>`${x+dx},${y+dy}`);
 for(const item of [...state.buildings,...state.projects]){item.x+=dx;item.y+=dy;}
}
