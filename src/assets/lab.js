import {EXAMPLE_DISTRICT,assetRect} from './manifest.js';
const asset=EXAMPLE_DISTRICT,image=new Image();
image.onload=()=>{
 for(const id of ['day','night']){
  const canvas=document.getElementById(id),ctx=canvas.getContext('2d'),night=id==='night';
  ctx.fillStyle=night?'#192925':'#cbded7';ctx.fillRect(0,0,1024,640);
  const r=assetRect(asset,512,288,448);ctx.save();if(night)ctx.filter='brightness(.55) saturate(.7)';ctx.drawImage(image,r.x,r.y,r.width,r.height);ctx.restore();
  ctx.strokeStyle=night?'#ffffff':'#263c35';ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(512,64);ctx.lineTo(960,288);ctx.lineTo(512,512);ctx.lineTo(64,288);ctx.closePath();ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(502,288);ctx.lineTo(522,288);ctx.moveTo(512,278);ctx.lineTo(512,298);ctx.stroke();
 }
 document.getElementById('result').textContent=`SVG chargé : ${image.naturalWidth} × ${image.naturalHeight}. Ancrage et rendu jour/nuit disponibles.`;
};
image.onerror=()=>{document.getElementById('result').textContent='Le SVG n’a pas pu être chargé.';};image.src=asset.src;
