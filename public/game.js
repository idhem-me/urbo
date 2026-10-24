import {TYPES,initial,stats,accrue,build,restore,validPlot,effects,upgrade,upgradeCost,setTax,GRID,CATEGORIES,RESOURCES,PRICES,projectCost,trade,owns,adjacentLand,landPrice,buyLand,requirements,progression,projectDuration} from './engine.js';
const $=id=>document.getElementById(id),canvas=$('map'),ctx=canvas.getContext('2d');
let state;try{state=restore(localStorage.getItem('rivage-v1'));}catch{state=initial();}
let inspected=null,selectedLand=null,plotsKey='';
let category='Logements';
let selected='house',zoom=1,W=0,H=0,unit=30,origin={x:0,y:0},hover=null;
function buildingName(type){return ({fire:'Pompiers',police:'Police',ambulance:'Ambulances',coal:'Charbon',solar:'Solaire',oil:'Pétrole',farm:'Ferme',workshop:'Atelier',football:'Foot',tennis:'Tennis',gym:'Salle de sport',mixedShop:'Boutique + logements',supermarket:'Supermarché',mall:'Centre commercial'})[type]||TYPES[type].name;}
const fmt=n=>Math.floor(n).toLocaleString('fr-FR');
function message(text){
 const short={
 'Choisissez une parcelle verte, en dehors des routes.':'Choisissez une case libre.',
 'Achetez cette parcelle avant de construire.':'Achetez cette case.',
 'Cette parcelle est occupée.':'Case occupée.',
 'Tous les chantiers sont occupés. Un atelier artisanal ajoute un chantier.':'Chantiers pleins. Ajoutez un atelier.',
 'Fonds, bois ou pierre insuffisants. Produisez ou achetez les ressources au marché.':'Il manque de l’argent, du bois ou de la pierre.',
 'Trésorerie insuffisante pour cette extension.':'Pas assez d’argent.',
 'Choisissez une parcelle verrouillée voisine de votre territoire (routes traversables).':'Choisissez une case +.',
 'Fonds insuffisants.':'Pas assez d’argent.',
 'Stock insuffisant (10 unités nécessaires).':'Il faut 10 unités pour vendre.'
 };
 $('toast').textContent=short[text]||text;
}
function save(){try{localStorage.setItem('rivage-v1',JSON.stringify(state));$('save').textContent='Sauvegarde locale';}catch{$('save').textContent='Sauvegarde indisponible';}}
function update(){
 const st=stats(state),pg=progression(state);
 $('money').textContent=fmt(state.money);
 $('people').textContent=fmt(st.people);
 $('income').textContent=(st.income>=0?'+':'−')+fmt(Math.abs(st.income));
 $('jobs').textContent=`${st.employed} / ${st.jobs}`;
 $('employment').textContent=`${st.unemployment} % sans emploi`;
 $('appeal').textContent=st.attractiveness+' / 100';
 $('housing').textContent=`${st.people} / ${st.homes} places`;
 $('tax').value=state.tax;
 $('economy').textContent=`Par minute : impôts +${fmt(st.taxes)} · activités +${fmt(st.commerce)} · frais −${fmt(st.upkeep)}.`;
 $('advice').textContent=st.income<0?'Dépenses trop élevées.':st.unemployment>0?'Ajoutez des emplois.':st.jobs>st.workers?'Il manque des habitants.':'Emplois équilibrés.';
 renderAdmin(st);inspect();landInspect();
 $('level').textContent=pg.index+1;
 $('progression').textContent=pg.next?`Prochain niveau : ${pg.next.people} habitants.`:'Dernier niveau atteint.';
 $('territory').textContent=`${state.owned.length} / 81 cases. Case suivante : ${fmt(landPrice(state))} pièces.`;
 $('selected-name').textContent=buildingName(selected);
 $('selected-effects').textContent=describe(effects({type:selected,level:1}))+(['mall','supermarket'].includes(selected)?' · Parking inclus.':'');
 document.querySelectorAll('.card').forEach(b=>{
  const cost=projectCost(b.dataset.type,1,state),missing=requirements(state,b.dataset.type);
  b.querySelector('em').textContent=`${fmt(cost.money)} pièces · ${cost.timber} bois · ${cost.stone} pierre`;
  b.querySelector('.conditions').textContent=missing.length?`Dès ${(missing[0].match(/\d+/)?.[0]||'plus d’')} habitants`:'';
  b.setAttribute('aria-pressed',String(b.dataset.type===selected));
 });
 renderPlots();
}

function renderPlots(){
 const next=JSON.stringify([selected,state.owned,state.buildings,state.projects.map(p=>[p.x,p.y])]);
 if(next===plotsKey)return;
 plotsKey=next;
 $('plots').replaceChildren();for(let y=0;y<GRID;y++)for(let x=0;x<GRID;x++)if(validPlot(x,y)){const b=document.createElement('button');const existing=state.buildings.find(b=>b.x===x&&b.y===y);b.textContent=existing?`${buildingName(existing.type)} N${existing.level} (${x+1}, ${y+1})`:`${x+1}, ${y+1}`;b.setAttribute('aria-label',existing?`Inspecter ${buildingName(existing.type)}, niveau ${existing.level}, parcelle ${x+1}, ${y+1}`:`Construire ${buildingName(selected)} sur la parcelle ${x+1}, ${y+1}`);if(!existing&&!owns(state,x,y)){b.textContent=`${x+1}, ${y+1} · ${adjacentLand(state,x,y)?`acheter ${landPrice(state)} ◉`:'verrouillée'}`;b.setAttribute('aria-label',b.textContent);b.disabled=!adjacentLand(state,x,y);}b.onclick=()=>place(x,y);$('plots').append(b);}
}
function poly(points,fill,stroke){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function pos(x,y){return {x:origin.x+(x-y)*unit,y:origin.y+(x+y)*unit*.5};}
function diamond(x,y,color){poly([[x,y-unit*.5],[x+unit,y],[x,y+unit*.5],[x-unit,y]],color,'#ffffff18');}
function box(x,y,w,d,h,color,side='#baa384',front='#dac7a4'){poly([[x,y],[x+w,y-w*.5],[x+w,y-w*.5-h],[x,y-h]],side);poly([[x,y],[x-d,y-d*.5],[x-d,y-d*.5-h],[x,y-h]],front);poly([[x,y-h],[x+w,y-w*.5-h],[x+w-d,y-(w+d)*.5-h],[x-d,y-d*.5-h]],color);}
function tree(x,y,size=1){ctx.fillStyle='#7c8660';ctx.fillRect(x-1.5,y-12*size,3,14*size);for(let i=0;i<3;i++){ctx.fillStyle=['#47775c','#5d8b60','#76a16a'][i];ctx.beginPath();ctx.ellipse(x+(i-1)*3*size,y-(15+i*5)*size,(9-i)*size,(10-i)*size,0,0,Math.PI*2);ctx.fill();}}
function building(x,y,type,scale=1,level=1){if(!['house','tower','shop','park'].includes(type)){specialBuilding(x,y,type,scale,level);return;}ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle='#395b3520';ctx.beginPath();ctx.ellipse(5,2,20,8,0,0,Math.PI*2);ctx.fill();if(type==='park'){diamond(0,-3,'#89ad68');tree(-9,-2,.85);tree(7,2,1.1);box(10,6,7,3,3,'#e0c29b');}else{const tower=type==='tower',shop=type==='shop',h=(tower?51:shop?22:25)+(level-1)*10;box(0,8,17,17,h,tower?'#eee4cb':'#ebcfab',tower?'#c5bda0':'#d1ad87',tower?'#e8d6b4':'#edcba0');if(!tower){poly([[-17,-h-.5],[0,-h-15],[17,-h-.5],[0,8-h]],shop?'#ac644e':'#67877e');poly([[0,8-h],[17,-h-.5],[17,-h+4],[0,13-h]],shop?'#8f5143':'#4d6d66');}for(let floor=0;floor<(tower?4+level-1:level);floor++){for(let i=0;i<2;i++){const yy=1-floor*11;poly([[-13,yy-8],[-9,yy-6],[-9,yy-1],[-13,yy-3]],'#73938a');poly([[5+i*6,yy-2-i*3],[9+i*6,yy-4-i*3],[9+i*6,yy-9-i*3],[5+i*6,yy-7-i*3]],'#6f8d83');}}if(shop){for(let i=0;i<5;i++)poly([[-16+i*3.2,-11+i*1.6],[-12.8+i*3.2,-9.4+i*1.6],[-12.8+i*3.2,-3.4+i*1.6],[-16+i*3.2,-5+i*1.6]],i%2?'#f5e7cc':'#c96950');}else{poly([[-5,5],[-1,7],[-1,-3],[-5,-5]],'#9c8063');}}if(level>1){ctx.fillStyle='#214f3d';ctx.beginPath();ctx.arc(16,9,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff8de';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(level,16,12);}ctx.restore();}
function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#cbded7';ctx.fillRect(0,0,W,H);const a=pos(-.7,-.7),b=pos(GRID,-.7),c=pos(GRID,GRID),d=pos(-.7,GRID);poly([[a.x,a.y],[b.x,b.y],[c.x,c.y+8],[d.x,d.y]],'#d3c9a0');poly([[a.x,a.y-5],[b.x,b.y-5],[c.x,c.y-5],[d.x,d.y-5]],'#d6deae');for(let y=0;y<GRID;y++)for(let x=0;x<GRID;x++){const p=pos(x,y);diamond(p.x,p.y,x===3||y===3||x===7||y===7?'#d6d4bf':(x+y)%2?'#a8bf80':'#b3c98c');if(x===3||y===3||x===7||y===7){ctx.fillStyle='#eee9d5';ctx.fillRect(p.x-2,p.y-1,4,2);}else if(!owns(state,x,y)){diamond(p.x,p.y,adjacentLand(state,x,y)?'#a6b2a1':'#859b92');if(adjacentLand(state,x,y)){ctx.fillStyle='#f6edcb';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText('+',p.x,p.y+3);}}else if(hover?.x===x&&hover?.y===y)diamond(p.x,p.y,'#e7efb9');}for(let s=0;s<=(GRID-1)*2;s++)for(let x=0;x<GRID;x++){const y=s-x;if(y<0||y>=GRID)continue;const p=pos(x,y),b=state.buildings.find(b=>b.x===x&&b.y===y);if(b)building(p.x,p.y,b.type,unit/28,b.level);else if(state.projects.some(b=>b.x===x&&b.y===y)){diamond(p.x,p.y,'#d4af72');box(p.x,p.y,12,12,8,'#d0ae71');ctx.fillStyle='#5b563b';ctx.font='12px sans-serif';ctx.fillText('⚒',p.x-5,p.y-9);}else if((x*11+y*3)%9===0&&validPlot(x,y))tree(p.x,p.y,unit/35);}const p=pos(3,6);box(p.x,p.y+15,unit*.35,unit*.35,5,'#c0a77d');ctx.fillStyle='#fff7de';ctx.fillRect(p.x+8,p.y-4,4,9);}
function resize(){const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;W=r.width;H=r.height;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);unit=Math.min(W/24,H/13)*zoom;origin={x:W*.5,y:H*.5-unit*4.8};draw();}
function cell(event){const r=canvas.getBoundingClientRect(),dx=(event.clientX-r.left-origin.x)/unit,dy=(event.clientY-r.top-origin.y)/(unit*.5);return {x:Math.round((dx+dy)/2),y:Math.round((dy-dx)/2)};}
function place(x,y){if(validPlot(x,y)&&!owns(state,x,y)){inspected=null;inspect();selectedLand={x,y};landInspect();message('Achat de terrain.');$('land-inspector').scrollIntoView({block:'nearest'});return;}selectedLand=null;landInspect();const existing=state.buildings.find(b=>b.x===x&&b.y===y);if(existing){inspected=existing;inspect();message(buildingName(existing.type));$('inspector').scrollIntoView({block:'nearest'});return;}inspected=null;const err=build(state,selected,x,y);message(err||`Travaux : ${buildingName(selected)}.`);save();update();draw();}
canvas.addEventListener('click',e=>{const p=cell(e);place(p.x,p.y);});canvas.addEventListener('pointermove',e=>{hover=cell(e);draw();});canvas.addEventListener('pointerleave',()=>{hover=null;draw();});
function renderCatalog(){
 $('catalog').replaceChildren();
 for(const [type,t] of Object.entries(TYPES).filter(([,t])=>t.category===category)){
  const b=document.createElement('button');
  b.className='card'+(type===selected?' active':'');b.dataset.type=type;
  const cost=projectCost(type,1,state);
  b.innerHTML=`<b>${buildingName(type)}</b><small>${brief(effects({type,level:1}))}</small><em>${fmt(cost.money)} pièces · ${cost.timber} bois · ${cost.stone} pierre</em><small>${projectDuration(type)/1000} s</small><small class="conditions"></small>`;
  b.onclick=()=>{selected=type;renderCatalog();message(`${buildingName(type)} : touchez une case libre.`);update();};
  $('catalog').append(b);
 }
}
function brief(e){
 const parts=[];
 for(const [key,label] of Object.entries({homes:'places',jobs:'emplois',educatedJobs:'emplois qualifiés',power:'énergie',builders:'chantier',education:'places à l’école',green:'attrait',admin:'habitants couverts',fire:'habitants couverts',police:'habitants couverts',ambulance:'habitants couverts',health:'habitants couverts'}))if(e[key])parts.push(`${e[key]} ${label}`);
 for(const [key,value] of Object.entries(e.produce))parts.push(`+${value} ${RESOURCES[key].toLowerCase()}/min`);
 return parts.slice(0,2).join(' · ');
}
for(const name of CATEGORIES){const b=document.createElement('button');b.textContent=name;b.setAttribute('aria-pressed',String(category===name));b.onclick=()=>{category=name;document.querySelectorAll('#categories button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));renderCatalog();update();};$('categories').append(b);}
renderCatalog();
$('zoom').onclick=()=>{zoom=zoom===1?1.3:1;$('zoom').textContent=zoom===1?'＋':'−';resize();};$('soundless').onclick=()=>$('help').showModal();$('close').onclick=()=>$('help').close();$('export').onclick=()=>{accrue(state);const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='rivage-sauvegarde.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function describe(e){
 const parts=[];
 for(const [k,label] of Object.entries({homes:'places',jobs:'emplois',educatedJobs:'emplois qualifiés',education:'actifs formés',green:'attrait',power:'énergie produite',energy:'énergie utilisée',pollution:'pollution',fire:'couverture pompiers',police:'couverture police',ambulance:'couverture ambulances',health:'couverture hôpital',admin:'couverture mairie',builders:'chantiers en plus',revenue:'recettes max./min',upkeep:'frais/min'}))if(e[k])parts.push(`${e[k]} ${label}`);
 for(const [k,v] of Object.entries(e.produce))parts.push(`+${v} ${RESOURCES[k].toLowerCase()}/min`);
 for(const [k,v] of Object.entries(e.consume))parts.push(`−${v} ${RESOURCES[k].toLowerCase()}/min`);
 return parts.join(' · ');
}
function inspect(){
 const b=inspected;
 $('inspector').hidden=!b;if(!b)return;
 $('building-title').textContent=`${buildingName(b.type)} · niveau ${b.level}`;
 $('building-effects').textContent=describe(effects(b));
 const cost=upgradeCost(b,state),pending=state.projects.some(p=>p.x===b.x&&p.y===b.y);
 const materials=cost===null?null:projectCost(b.type,b.level+1,state),missing=cost===null?[]:requirements(state,b.type,b.level+1);
 $('upgrade-effects').textContent=cost===null?'Niveau maximum.':`Niveau ${b.level+1} : ${brief(effects({...b,level:b.level+1}))}. Frais : ${effects({...b,level:b.level+1}).upkeep}/min.`;
 $('upgrade').textContent=cost===null?'Niveau maximum':pending?'En travaux':`Améliorer · ${fmt(cost)} pièces`;
 const reasons=[];
 if(materials){
  $('upgrade-effects').textContent+=` Coût : ${materials.timber} bois, ${materials.stone} pierre. Durée : ${projectDuration(b.type,b.level+1)/1000} s.`;
  if(state.money<cost)reasons.push('Pas assez d’argent.');
  if(state.resources.timber<materials.timber||state.resources.stone<materials.stone)reasons.push('Il manque du bois ou de la pierre.');
  if(state.projects.length>=stats(state).capacity)reasons.push('Chantiers pleins.');
 }
 $('upgrade-reason').textContent=pending?'Amélioration en cours.':missing.length?missing.join(' · '):reasons.join(' ');
 $('upgrade').disabled=cost===null||pending||missing.length>0||reasons.length>0;
}
$('upgrade').onclick=()=>{if(!inspected)return;const err=upgrade(state,inspected.x,inspected.y);message(err||'Amélioration en cours.');save();update();draw();};
$('deselect').onclick=()=>{inspected=null;inspect();};
$('tax').onchange=e=>{setTax(state,e.target.value);save();update();message('Impôts modifiés.');};
for(const [key,label] of Object.entries(RESOURCES)){const row=document.createElement('div');const text=document.createElement('span');text.innerHTML=`${label} : <b id="stock-${key}">0</b>`;row.append(text);for(const direction of ['buy','sell']){const button=document.createElement('button');button.textContent=direction==='buy'?`Acheter · ${PRICES[key]*10} pièces`:`Vendre · ${PRICES[key]*6} pièces`;button.onclick=()=>{const err=trade(state,key,direction);message(err||'Échange fait.');save();update();};row.append(button);}$('resources').append(row);}
new ResizeObserver(resize).observe(canvas);setInterval(()=>{accrue(state);save();update();draw();},1000);document.addEventListener('visibilitychange',()=>{accrue(state);save();update();draw();});window.addEventListener('pagehide',save);update();resize();save();

function symbol(type){return ({townhall:'⚑',fire:'🚒',police:'🚓',ambulance:'🚑',hospital:'✚',coal:'♨',solar:'☀',quarry:'▨',sawmill:'♣',oil:'◉',farm:'♧',workshop:'⚒',factory:'⚙',largeFactory:'⚙',school:'▤',office:'▥',stadium:'◎',football:'⚽',tennis:'◉',gym:'◆',supermarket:'▰',mall:'▰',mixedShop:'⌂',house:'⌂',tower:'▥',park:'♣',shop:'▰'})[type]||'◆';}
function specialBuilding(x,y,type,scale,level){const t=TYPES[type];ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);const colors={'Administration':'#c5cbd6','Secours':'#e8cdc3','Énergie':'#839fa0','Ressources':'#b5b488','Industrie':'#a8a5a0','Éducation':'#a9bdcc','Loisirs':'#8eaf78','Commerce':'#e6c69a'};if(['football','tennis','stadium','farm','solar'].includes(type)){diamond(0,0,type==='solar'?'#547f9e':'#7ea46a');ctx.strokeStyle='#f3ecd3';ctx.strokeRect(-12,-6,24,12);if(type==='solar'){for(let i=-10;i<12;i+=7){ctx.beginPath();ctx.moveTo(i,-6);ctx.lineTo(i,6);ctx.stroke();}}else if(type==='farm'){for(let i=-8;i<10;i+=4){ctx.strokeStyle='#c9b76c';ctx.beginPath();ctx.moveTo(-12,i);ctx.lineTo(10,i-10);ctx.stroke();}}}else{const h=(type==='office'?45:type==='largeFactory'?25:20)+(level-1)*9;box(0,8,19,18,h,colors[t.category]||'#c3cba3');if(['coal','factory','largeFactory'].includes(type))box(8,-12,4,4,25,'#898779');if(['supermarket','mall'].includes(type)){poly([[0,8],[22,-3],[30,2],[8,13]],'#8f9891');ctx.strokeStyle='#eee9d5';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(5+i*6,7-i*3);ctx.lineTo(11+i*6,10-i*3);ctx.stroke();}}ctx.fillStyle=type==='hospital'?'#b35d51':'#38574b';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(symbol(type),-1,-h+6);}ctx.fillStyle='#264e3b';ctx.beginPath();ctx.arc(17,9,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText(level,17,12);ctx.restore();}
function renderAdmin(st){
 $('services').innerHTML=Object.entries({admin:'Mairie',fire:'Pompiers',police:'Police',ambulance:'Ambulances',health:'Hôpital'}).map(([key,label])=>`<div><span>${label}</span><b>${st.coverage[key]} %</b></div>`).join('');
 $('utilities').textContent=`Énergie : ${Math.round(st.energyRatio*100)} % des besoins. Pollution : ${st.pollution}.`;
 $('education').textContent=`${st.educated} actifs formés. ${st.officeEmployed} / ${st.educatedJobs} emplois qualifiés occupés. Nourriture : ${st.foodCovered?'disponible':'épuisée'}.`;
 $('projects-title').textContent=`Chantiers · ${state.projects.length} / ${st.capacity}`;
 $('projects').replaceChildren();
 if(!state.projects.length){const p=document.createElement('p');p.textContent='Aucun chantier.';$('projects').append(p);}
 for(const p of state.projects){const line=document.createElement('p');line.textContent=`${buildingName(p.type)} · niv. ${p.level} · ${Math.max(0,Math.ceil((p.finish-state.last)/1000))} s`;$('projects').append(line);}
 for(const key of Object.keys(RESOURCES))$('stock-'+key).textContent=state.resources[key].toFixed(1);
}
function landInspect(){
 const p=selectedLand;
 $('land-inspector').hidden=!p;if(!p)return;
 const connected=adjacentLand(state,p.x,p.y),price=landPrice(state);
 $('land-details').textContent=`Case ${p.x+1}, ${p.y+1} · ${fmt(price)} pièces.${!connected?' Achetez d’abord une case voisine.':state.money<price?' Pas assez d’argent.':''}`;
 $('buy-land').textContent=`Acheter · ${fmt(price)} pièces`;
 $('buy-land').disabled=!connected||state.money<price;
}
$('buy-land').onclick=()=>{if(!selectedLand)return;const err=buyLand(state,selectedLand.x,selectedLand.y);message(err||'Case achetée.');if(!err)selectedLand=null;save();update();draw();};
$('close-land').onclick=()=>{selectedLand=null;landInspect();};

for(const button of document.querySelectorAll('[data-panel]')){
 button.onclick=()=>{
  for(const tab of document.querySelectorAll('[data-panel]')){
   const active=tab===button;
   tab.setAttribute('aria-pressed',String(active));
   $(tab.dataset.panel).hidden=!active;
  }
 };
}
