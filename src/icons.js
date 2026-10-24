import {House,Building2,Landmark,Flame,Shield,Ambulance,Hospital,Sun,Pickaxe,Trees,Droplet,Wheat,Hammer,Factory,GraduationCap,BriefcaseBusiness,TreePine,Trophy,Goal,CircleDot,Dumbbell,Store,ShoppingCart,ShoppingBag,Coins,Users,TrendingUp,Construction,Package,Plus,Minus,Download,CircleHelp,ArrowUp,Zap,Layers,Check,X,Trash2,Euro,CircleCheck,TriangleAlert,CircleX,Info,Settings,Search} from 'lucide';
export const ICONS={house:House,tower:Building2,townhall:Landmark,fire:Flame,police:Shield,ambulance:Ambulance,hospital:Hospital,coal:Flame,solar:Sun,quarry:Pickaxe,sawmill:Trees,oil:Droplet,farm:Wheat,workshop:Hammer,factory:Factory,largeFactory:Factory,school:GraduationCap,office:BriefcaseBusiness,park:TreePine,stadium:Trophy,football:Goal,tennis:CircleDot,gym:Dumbbell,shop:Store,mixedShop:Store,supermarket:ShoppingCart,mall:ShoppingBag,money:Euro,people:Users,income:TrendingUp,build:Construction,stock:Package,plus:Plus,minus:Minus,download:Download,help:CircleHelp,upgrade:ArrowUp,energy:Zap,land:Layers,check:Check,close:X,destroy:Trash2,'status-success':CircleCheck,'status-warning':TriangleAlert,'status-danger':CircleX,info:Info,settings:Settings,search:Search};
export const CATEGORY_ICONS={'Logements':'house','Administration':'townhall','Secours':'police','Énergie':'energy','Ressources':'quarry','Industrie':'factory','Éducation':'school','Loisirs':'park','Commerce':'shop'};
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function iconMarkup(name){const nodes=ICONS[name]||ICONS.house;return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${nodes.map(([tag,attrs])=>`<${tag} ${Object.entries(attrs).map(([k,v])=>`${k}="${escape(v)}"`).join(' ')}/>`).join('')}</svg>`;}
export function drawIcon(ctx,name,x,y,size=14,color='#303030'){
 ctx.save();ctx.translate(x,y);ctx.scale(size/24,size/24);ctx.strokeStyle=color;ctx.lineWidth=1.75;ctx.lineCap='round';ctx.lineJoin='round';
 for(const [tag,a] of ICONS[name]||ICONS.house){
  ctx.beginPath();
  if(tag==='path'){ctx.stroke(new Path2D(a.d));continue;}
  if(tag==='line'){ctx.moveTo(+a.x1,+a.y1);ctx.lineTo(+a.x2,+a.y2);}
  else if(tag==='circle')ctx.arc(+a.cx,+a.cy,+a.r,0,Math.PI*2);
  else if(tag==='ellipse')ctx.ellipse(+a.cx,+a.cy,+a.rx,+a.ry,0,0,Math.PI*2);
  else if(tag==='rect'){if(ctx.roundRect)ctx.roundRect(+a.x,+a.y,+a.width,+a.height,+(a.rx||0));else ctx.rect(+a.x,+a.y,+a.width,+a.height);}
  else if(tag==='polyline'||tag==='polygon'){const p=a.points.trim().split(/[\s,]+/).map(Number);for(let i=0;i<p.length;i+=2)i?ctx.lineTo(p[i],p[i+1]):ctx.moveTo(p[i],p[i+1]);if(tag==='polygon')ctx.closePath();}
  ctx.stroke();
 }
 ctx.restore();
}
