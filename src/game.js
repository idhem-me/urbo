import {TYPES,maxLevel,initial,stats,accrue,build,restore,validPlot,effects,upgrade,upgradeCost,setTax,GRID,CATEGORIES,RESOURCES,PRICES,projectCost,trade,owns,adjacentLand,landPrice,buyLand,requirements,progression,projectDuration,demands,demolish,TRADE_AMOUNT,setSectorTax,setServiceBudget,bankPolicy,loanQuote,borrow,repayDebt,renameCity,tutorialStep,TUTORIAL_STEPS,skipTutorial} from './engine.js';
import {iconMarkup,drawIcon,CATEGORY_ICONS} from './icons';
import {STATUS,statusBadge,coverageStatus,energyStatus,incomeStatus,budgetStatus,stockStatus} from './status';
import {buildingCategories,buildingFamilies,catalogFamily,CATEGORY_FAMILIES,FAMILY_LABELS,PRIMARY_CATEGORIES,PRIMARY_ICONS,searchCatalog} from './catalog';
import {CityStore,GUEST} from './city-store';
import {CitySync} from './city-sync';
import {mountSettings} from './settings';
import {constructionProgress,constructionKey} from './construction';
import {sceneColor} from './scene';
import {createAssetRenderer} from './assets/renderer';
import {GAME_ASSETS} from './assets/manifest';
import {START_MIN,START_CENTER} from './board';
import {money,tonnes} from './units';
import {mountStatusTooltips} from './status-tooltip';
import {buttonVariants} from './components/ui/button';
export function mountGame(){
const lifetime=new AbortController();
const cleanupStatusTooltips=mountStatusTooltips(lifetime.signal);
const $=id=>document.getElementById(id),canvas=$('map'),ctx=canvas.getContext('2d');
let storage;try{storage=localStorage;}catch{}
let cityStore=new CityStore({storage}),citySync=null,changingAccount=false,accountGeneration=0,disposed=false,cityListKey='',cloudStatus='Sauvegarde sur cet appareil.',cloudKind='neutral';
try{cityStore.ensureGuest();}catch{}
let state=cityStore.active?cityStore.activeState():initial();
let inspected=null,selectedLand=null,toastTimer;
let category='Résidence',searchQuery='',searchAcross=false,offerKey='',guideTarget=null,lastTutorialStep=state.tutorial.step,isNight=document.documentElement.classList.contains('dark');
let previousProjects=new Map(state.projects.map(p=>[constructionKey(p),p]));
const paint=color=>sceneColor(color,isNight);
let selected=null,zoom=1.3,pan={x:0,y:0},W=0,H=0,unit=30,origin={x:0,y:0},hover=null,mapSelection=null;
function buildingName(type){return ({fire:'Pompiers',police:'Police',ambulance:'Ambulances',coal:'Charbon',solar:'Solaire',oil:'Pétrole',farm:'Ferme',workshop:'Atelier',football:'Foot',tennis:'Tennis',gym:'Salle de sport',mixedShop:'Boutique + logements',supermarket:'Supermarché',mall:'Centre commercial'})[type]||TYPES[type].name;}
const fmt=n=>Math.floor(n).toLocaleString('fr-FR');
function buttonLabel(id,text){const button=$(id),label=button.querySelector('[data-button-label]');if(label)label.textContent=text;else button.textContent=text;}
function openSheet(id){if(changingAccount&&id!=='cities-sheet')return;if(state.gameOver&&!['game-over','cities-sheet','settings-sheet'].includes(id))return;closeTooltips();for(const d of document.querySelectorAll('dialog[open]'))if(d.id!==id)d.close();if(!$(id).open)$(id).showModal();for(const b of document.querySelectorAll('[data-open-sheet]'))b.setAttribute('aria-expanded',String(b.dataset.openSheet===id));}
function closeSheet(id){closeTooltips();if($(id).open)$(id).close();}
function selectedType(){return selected||'house';}
function statusNote(id,text,status='neutral'){
 const el=$(id);el.dataset.status=status;el.replaceChildren();
 if(!text)return;
 const icon=document.createElement('span');icon.innerHTML=iconMarkup((STATUS[status]||STATUS.neutral).icon);icon.setAttribute('aria-hidden','true');
 const content=document.createElement('span');content.textContent=text;el.append(icon,content);
}
function message(text,status='neutral'){
 const short={
 'Choisissez une parcelle verte, en dehors des routes.':'Choisissez une case libre.',
 'Achetez cette parcelle avant de construire.':'Achetez cette case.',
 'Cette parcelle est occupée.':'Case occupée.',
 'Tous les chantiers sont occupés. Un atelier artisanal ajoute un chantier.':'Chantiers pleins. Ajoutez un atelier.',
 'Fonds, bois ou pierre insuffisants. Produisez ou achetez les ressources au marché.':'Il manque de l’argent, du bois ou de la pierre.',
 'Trésorerie insuffisante pour cette extension.':'Pas assez d’argent.',
 'Choisissez une parcelle verrouillée voisine de votre territoire (routes traversables).':'Choisissez une case +.',
 'Fonds insuffisants.':'Pas assez d’argent.',
 'Stock insuffisant (100 t nécessaires).':'Il faut 100 t pour vendre.'
 };
 status=status===true?'danger':status===false?'neutral':status;$('toast').setAttribute('role',status==='danger'?'alert':'status');statusNote('toast',short[text]||text,status);$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('toast').hidden=true;},5000);
}
function save(){if(changingAccount)return false;try{cityStore.save(state);citySync?.schedule();$('save').textContent=cityStore.owner===GUEST?'Sauvegarde locale':'Copie locale du compte';$('save').dataset.status='success';$('save').classList.add('status-badge');return true;}catch{$('save').textContent='Sauvegarde indisponible';$('save').dataset.status='danger';$('save').classList.add('status-badge');return false;}}
function update(){
 if(changingAccount)return;renderCities();renderTutorial();renderConstruction();
 const st=stats(state),pg=progression(state);
 $('money').textContent=money(state.money,true);const budget=budgetStatus(state.money,st.income);$('money').parentElement.dataset.status=budget;$('money').parentElement.setAttribute('aria-label',`Budget : ${money(state.money)} · ${STATUS[budget].label}`);$('money').parentElement.title=`Budget : ${money(state.money)} · ${STATUS[budget].label}`;
 $('people').textContent=fmt(st.people);$('city-name-display').textContent=state.cityName;document.title=state.cityName+' · Urbo';
 $('income').textContent=(st.income>=0?'+':'−')+money(Math.abs(st.income),true)+'/min';const flow=incomeStatus(st.income);$('income').parentElement.dataset.status=flow;$('income').parentElement.setAttribute('aria-label',`Solde : ${money(st.income)} par minute · ${STATUS[flow].label}`);$('income').parentElement.title=`Solde : ${money(st.income)}/min · ${STATUS[flow].label}`;
 $('jobs').textContent=`${st.employed} / ${st.jobs}`;
 $('employment').textContent=`${st.unemployment} % sans emploi`;
 $('appeal').textContent=st.attractiveness+' / 100';
 $('housing').textContent=`${st.people} / ${st.homes} places`;
for(const sector of ['residential','commerce','office'])$('tax-'+sector).value=state.taxes[sector];$('service-budget').value=state.serviceBudget;
 $('economy').innerHTML=[['Impôts',st.taxes],['Activités',st.commerce],['Entretien',-st.upkeep],['Remboursements',-st.debtService],['Solde',st.income]].map(([label,value])=>`<div><span>${label}</span><b>${value>0?'+':''}${money(value)}</b></div>`).join('');
 statusNote('advice',st.income<0?'Dépenses trop élevées.':st.unemployment>0?'Ajoutez des emplois.':st.jobs>st.workers?'Il manque des habitants.':'Emplois équilibrés.',st.income<0?'danger':st.unemployment>0||st.jobs>st.workers?'warning':'success');
 renderAdmin(st);inspect();landInspect();
 $('level').textContent=pg.index+1;
 $('progression').textContent=pg.next?`Prochain niveau : ${pg.next.people} habitants.`:'Dernier niveau atteint.';
 $('territory').textContent=`${state.owned.length} / ${GRID*GRID} cases.${state.owned.length<GRID*GRID?` Case suivante : ${money(landPrice(state))}.`:' Plateau complet.'}`;
 document.querySelectorAll('.catalog-tile').forEach(tile=>{
  const type=tile.dataset.type,cost=projectCost(type,1,state),missing=requirements(state,type);
  tile.querySelector('em').textContent=money(cost.money,true);tile.querySelector('.construction-time').textContent=projectDuration(type,1,state)/1000+' s';
  tile.querySelector('.material-cost').textContent=`${tonnes(cost.timber)} bois · ${tonnes(cost.stone)} pierre`;
  tile.querySelector('.conditions').textContent=missing.length?`Dès ${(missing[0].match(/\d+/)?.[0]||'plus d’')} habitants`:'';
  tile.querySelector('.card-select').setAttribute('aria-pressed',String(type===selected));tile.querySelector('.card-select').disabled=state.money<0||Boolean(state.gameOver);
  tile.querySelector('.tooltip-cost').textContent=`Prix : ${money(cost.money)}. Bois : ${tonnes(cost.timber)}. Pierre : ${tonnes(cost.stone)}.`;
  tile.querySelector('.tooltip-condition').textContent=missing.join(' · ');
 });
$('build-blocked').hidden=state.money>=0&&!state.gameOver;if(!$('build-blocked').hidden)statusNote('build-blocked','Budget négatif : empruntez ou ajustez les impôts.','danger');renderBank(st);if(state.gameOver){$('game-over-reason').textContent=`Budget : ${money(state.money)}. Limite : −${money(state.gameOver.limit)}.`;if(!['cities-sheet','settings-sheet'].some(id=>$(id).open))openSheet('game-over');}
 const demand=demands(state);for(const [key,value] of Object.entries(demand)){const bar=$('demand-'+key),status=key==='services'?(value>=60?'danger':value>=20?'warning':'success'):(value>=60?'success':value>=25?'warning':'neutral');bar.parentElement.parentElement.dataset.status=status;bar.parentElement.parentElement.title=`${value} / 100 · ${key==='services'?'Besoins non couverts':value>=60?'Forte demande':value>=25?'Demande moyenne':'Faible demande'}`;bar.style.width=value+'%';bar.parentElement.setAttribute('aria-valuenow',String(value));bar.parentElement.setAttribute('aria-valuetext',`${value} sur 100`);}
}

function poly(points,fill,stroke){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=paint(fill);ctx.fill();if(stroke){ctx.strokeStyle=paint(stroke);ctx.lineWidth=1;ctx.stroke();}}
function pos(x,y){return {x:origin.x+(x-y)*unit,y:origin.y+(x+y)*unit*.5};}
function diamond(x,y,color){poly([[x,y-unit*.5],[x+unit,y],[x,y+unit*.5],[x-unit,y]],color,'#ffffff18');}
function box(x,y,w,d,h,color,side='#baa384',front='#dac7a4'){poly([[x,y],[x+w,y-w*.5],[x+w,y-w*.5-h],[x,y-h]],side);poly([[x,y],[x-d,y-d*.5],[x-d,y-d*.5-h],[x,y-h]],front);poly([[x,y-h],[x+w,y-w*.5-h],[x+w-d,y-(w+d)*.5-h],[x-d,y-d*.5-h]],color);}
function tree(x,y,size=1){ctx.fillStyle=paint('#7c8660');ctx.fillRect(x-1.5,y-12*size,3,14*size);for(let i=0;i<3;i++){ctx.fillStyle=paint(['#47775c','#5d8b60','#76a16a'][i]);ctx.beginPath();ctx.ellipse(x+(i-1)*3*size,y-(15+i*5)*size,(9-i)*size,(10-i)*size,0,0,Math.PI*2);ctx.fill();}}
const assetRenderer=createAssetRenderer({registry:GAME_ASSETS,onReady:()=>draw()});
function building(x,y,type,scale=1,level=1){if(assetRenderer.draw(ctx,{type,level,x,y,unit:28*scale,night:isNight})){
 if(level>1){const bx=x+unit*.55,by=y+unit*.16;ctx.save();ctx.fillStyle=isNight?'#e2e8f0':'#263c35';ctx.beginPath();ctx.arc(bx,by,7,0,Math.PI*2);ctx.fill();ctx.fillStyle=isNight?'#182923':'#ffffff';ctx.font='600 9px sans-serif';ctx.textAlign='center';ctx.fillText(level,bx,by+3);ctx.restore();}return;
 }if(!['house','tower','shop','park'].includes(type)){specialBuilding(x,y,type,scale,level);return;}ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle=paint('#395b3520');ctx.beginPath();ctx.ellipse(5,2,20,8,0,0,Math.PI*2);ctx.fill();if(type==='park'){diamond(0,-3,'#89ad68');tree(-9,-2,.85);tree(7,2,1.1);box(10,6,7,3,3,'#e0c29b');}else{const tower=type==='tower',shop=type==='shop',h=(tower?51:shop?22:25)+(level-1)*10;box(0,8,17,17,h,tower?'#eee4cb':'#ebcfab',tower?'#c5bda0':'#d1ad87',tower?'#e8d6b4':'#edcba0');if(!tower){poly([[-17,-h-.5],[0,-h-15],[17,-h-.5],[0,8-h]],shop?'#ac644e':'#67877e');poly([[0,8-h],[17,-h-.5],[17,-h+4],[0,13-h]],shop?'#8f5143':'#4d6d66');}for(let floor=0;floor<(tower?4+level-1:level);floor++){for(let i=0;i<2;i++){const yy=1-floor*11;poly([[-13,yy-8],[-9,yy-6],[-9,yy-1],[-13,yy-3]],'#73938a');poly([[5+i*6,yy-2-i*3],[9+i*6,yy-4-i*3],[9+i*6,yy-9-i*3],[5+i*6,yy-7-i*3]],'#6f8d83');}}if(shop){for(let i=0;i<5;i++)poly([[-16+i*3.2,-11+i*1.6],[-12.8+i*3.2,-9.4+i*1.6],[-12.8+i*3.2,-3.4+i*1.6],[-16+i*3.2,-5+i*1.6]],i%2?'#f5e7cc':'#c96950');}else{poly([[-5,5],[-1,7],[-1,-3],[-5,-5]],'#9c8063');}}if(level>1){ctx.fillStyle=paint('#214f3d');ctx.beginPath();ctx.arc(16,9,7,0,Math.PI*2);ctx.fill();ctx.fillStyle=paint('#fff8de');ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(level,16,12);}ctx.restore();}
function highlightTile(tile,active){
 const p=pos(tile.x,tile.y);ctx.save();ctx.beginPath();ctx.moveTo(p.x,p.y-unit*.5);ctx.lineTo(p.x+unit,p.y);ctx.lineTo(p.x,p.y+unit*.5);ctx.lineTo(p.x-unit,p.y);ctx.closePath();
 ctx.fillStyle=isNight?(active?'rgba(255,255,255,.20)':'rgba(255,255,255,.10)'):(active?'rgba(255,255,255,.16)':'rgba(255,255,255,.08)');ctx.fill();
 ctx.strokeStyle=isNight?'#f8fafc':'#263c35';ctx.lineWidth=active?3:1.5;ctx.lineJoin='round';ctx.stroke();ctx.restore();
}
function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle=paint('#cbded7');ctx.fillRect(0,0,W,H);const a=pos(-.7,-.7),b=pos(GRID,-.7),c=pos(GRID,GRID),d=pos(-.7,GRID);poly([[a.x,a.y],[b.x,b.y],[c.x,c.y+8],[d.x,d.y]],'#d3c9a0');poly([[a.x,a.y-5],[b.x,b.y-5],[c.x,c.y-5],[d.x,d.y-5]],'#d6deae');for(let y=0;y<GRID;y++)for(let x=0;x<GRID;x++){const p=pos(x,y);diamond(p.x,p.y,owns(state,x,y)?'#cfdabb':adjacentLand(state,x,y)?'#b8c5a7':'#a8b79d');}for(let s=0;s<=(GRID-1)*2;s++)for(let x=0;x<GRID;x++){const y=s-x;if(y<0||y>=GRID)continue;const p=pos(x,y);if(p.x < -unit*2||p.x > W+unit*2||p.y < -unit*2||p.y > H+unit*2)continue;const b=state.buildings.find(b=>b.x===x&&b.y===y);if(b)building(p.x,p.y,b.type,unit/28,b.level);else if(state.projects.some(b=>b.x===x&&b.y===y)){if(!assetRenderer.draw(ctx,{type:'construction',level:1,x:p.x,y:p.y,unit,night:isNight})){diamond(p.x,p.y,'#d4af72');box(p.x,p.y,12,12,8,'#d0ae71');ctx.fillStyle=paint('#5b563b');ctx.font='12px sans-serif';drawIcon(ctx,'build',p.x-7,p.y-20,14,'#44403c');}}else {ctx.save();ctx.globalAlpha=owns(state,x,y)?1:.5;assetRenderer.draw(ctx,{type:'desert',level:1,x:p.x,y:p.y,unit,night:isNight});ctx.restore();}}
 for(let y=0;y<GRID;y++)for(let x=0;x<GRID;x++)if(validPlot(x,y)&&!owns(state,x,y)&&adjacentLand(state,x,y)){const q=pos(x,y);ctx.save();ctx.fillStyle=isNight?'#20312b':'#f8faf7';ctx.beginPath();ctx.arc(q.x,q.y,6,0,Math.PI*2);ctx.fill();drawIcon(ctx,'plus',q.x-4,q.y-4,8,isNight?'#f8fafc':'#263c35');ctx.restore();}
 for(const [tile,active] of [[hover,false],[mapSelection,true]])if(tile&&validPlot(tile.x,tile.y))highlightTile(tile,active);if(guideTarget){const p=pos(guideTarget.x,guideTarget.y);ctx.save();ctx.strokeStyle=isNight?'#fde68a':'#735d25';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(p.x,p.y-unit*.5);ctx.lineTo(p.x+unit,p.y);ctx.lineTo(p.x,p.y+unit*.5);ctx.lineTo(p.x-unit,p.y);ctx.closePath();ctx.stroke();ctx.restore();}}
function resize(){const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;W=r.width;H=r.height;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);unit=Math.min(W/24,Math.max(160,H-240)/13)*zoom;origin={x:W*.5+pan.x,y:H*.5-unit*START_CENTER+pan.y};draw();}
function cell(event){const r=canvas.getBoundingClientRect(),dx=(event.clientX-r.left-origin.x)/unit,dy=(event.clientY-r.top-origin.y)/(unit*.5);return {x:Math.round((dx+dy)/2),y:Math.round((dy-dx)/2)};}
function place(x,y){if(changingAccount)return;
 mapSelection=validPlot(x,y)?{x,y}:null;draw();
 if(validPlot(x,y)&&!owns(state,x,y)){inspected=null;selectedLand={x,y};landInspect();openSheet('land-sheet');return;}
 selectedLand=null;
 const existing=state.buildings.find(b=>b.x===x&&b.y===y);
 if(existing){inspected=existing;$('demolition-confirm').hidden=true;inspect();openSheet('building-sheet');return;}
 inspected=null;if(!selected){message('Choisissez un bâtiment dans Construire.');return;}
 const err=build(state,selected,x,y);if(err)message(err,'danger');else $('toast').hidden=true;save();update();draw();
}
let keyboardCell={x:START_MIN+1,y:START_MIN+1};
canvas.addEventListener('keydown',e=>{const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[e.key]){e.preventDefault();keyboardCell={x:Math.max(0,Math.min(GRID-1,keyboardCell.x+moves[e.key][0])),y:Math.max(0,Math.min(GRID-1,keyboardCell.y+moves[e.key][1]))};hover=keyboardCell;canvas.setAttribute('aria-label',`Case ${keyboardCell.x+1}, ${keyboardCell.y+1}. Entrée pour agir.`);draw();}else if(e.key==='Enter'||e.key===' '){e.preventDefault();place(keyboardCell.x,keyboardCell.y);}},{signal:lifetime.signal});
const pointers=new Map();let gesture=null,dragged=false;
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragged=false;gesture={x:e.clientX,y:e.clientY};if(pointers.size>1)dragged=true;},{signal:lifetime.signal});
canvas.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId)){hover=e.pointerType==='touch'?null:cell(e);canvas.style.cursor=hover&&validPlot(hover.x,hover.y)?'pointer':'grab';draw();return;}
 const old=pointers.get(e.pointerId);const previous=[...pointers.values()];pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===2){const current=[...pointers.values()],before=Math.hypot(previous[0].x-previous[1].x,previous[0].y-previous[1].y),after=Math.hypot(current[0].x-current[1].x,current[0].y-current[1].y);if(before>0)zoom=Math.max(.4,Math.min(6,zoom*after/before));dragged=true;}
 else {const dx=e.clientX-old.x,dy=e.clientY-old.y;if(gesture&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>6)dragged=true;if(dragged){hover=null;canvas.style.cursor='grabbing';pan.x=Math.max(-Math.max(W,GRID*unit),Math.min(Math.max(W,GRID*unit),pan.x+dx));pan.y=Math.max(-Math.max(H*.6,GRID*unit*.5),Math.min(Math.max(H*.6,GRID*unit*.5),pan.y+dy));}}
 resize();
},{signal:lifetime.signal});
canvas.addEventListener('pointerup',e=>{const tap=!dragged&&pointers.size===1;pointers.delete(e.pointerId);if(tap){const p=cell(e);place(p.x,p.y);}if(pointers.size)dragged=true;else canvas.style.cursor='grab';},{signal:lifetime.signal});
canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);dragged=true;},{signal:lifetime.signal});
canvas.addEventListener('pointerleave',()=>{hover=null;draw();},{signal:lifetime.signal});
let tooltipTimer;
function closeTooltips(){clearTimeout(tooltipTimer);for(const tip of document.querySelectorAll('.catalog-tooltip')){if(typeof tip.hidePopover==='function'&&tip.matches(':popover-open'))tip.hidePopover();tip.hidden=true;const trigger=$(tip.id+'-trigger');trigger?.setAttribute('aria-expanded','false');}}
function showTooltip(trigger,tip){
 closeTooltips();tip.hidden=false;trigger.setAttribute('aria-expanded','true');
 if(typeof tip.showPopover==='function'){
  tip.showPopover();const r=trigger.getBoundingClientRect(),bounds=tip.getBoundingClientRect(),width=Math.min(300,window.innerWidth-32);
  tip.style.width=width+'px';tip.style.left=Math.max(16,Math.min(window.innerWidth-width-16,r.right-width))+'px';
  tip.style.top=Math.max(12,r.bottom+8+bounds.height<window.innerHeight-12?r.bottom+8:r.top-bounds.height-8)+'px';
 }else tip.classList.add('tooltip-fallback');
}
function renderCatalog(){
 closeTooltips();$('catalog').replaceChildren();
 const results=searchCatalog(category,searchQuery,{global:Boolean(searchQuery)&&searchAcross});$('catalog-empty').hidden=results.length>0;$('catalog-count').textContent=results.length+' bâtiment'+(results.length>1?'s':'');$('category-title').textContent=searchQuery&&searchAcross?'Résultats':category;
 for(const type of results){
  const tile=document.createElement('article'),b=document.createElement('button'),info=document.createElement('button'),tip=document.createElement('div');
  const cost=projectCost(type,1,state),tipId='info-'+type,families=buildingFamilies(type);
  tile.className='catalog-tile';tile.dataset.type=type;tile.dataset.family=catalogFamily(type,category);
  b.type='button';b.className='card-select';b.setAttribute('aria-pressed',String(type===selected));
  b.innerHTML=`<span class="card-heading">${iconMarkup(type)}<b>${buildingName(type)}</b></span><span class="family-tags">${families.map(f=>`<span class="family-tag" data-family="${f}">${FAMILY_LABELS[f]}</span>`).join('')}</span><small>${brief(effects({type,level:1}))}</small><em>${money(cost.money,true)}</em><small class="material-cost">${tonnes(cost.timber)} bois · ${tonnes(cost.stone)} pierre</small><small class="construction-time">${projectDuration(type,1,state)/1000} s</small><small class="conditions"></small>`;
  b.onclick=()=>{selected=type;renderCatalog();$('placement').hidden=false;$('placement-label').textContent=buildingName(type);closeSheet('build-sheet');message('Touchez une case libre.');update();};
  info.type='button';info.id=tipId+'-trigger';info.className='tile-info';info.innerHTML=iconMarkup('info');info.setAttribute('aria-label',`Détails : ${buildingName(type)}`);info.setAttribute('aria-describedby',tipId);info.setAttribute('aria-expanded','false');
  tip.id=tipId;tip.className='catalog-tooltip';tip.hidden=true;tip.setAttribute('role','tooltip');tip.setAttribute('popover','auto');
  tip.innerHTML=`<b>${buildingName(type)}</b><p>${describe(effects({type,level:1}))}${['mall','supermarket'].includes(type)?' · Parking inclus.':''}</p><p>${maxLevel(type)} niveaux disponibles.</p><p class="tooltip-cost"></p><p class="tooltip-condition"></p>`;
  info.onclick=e=>{e.stopPropagation();info.getAttribute('aria-expanded')==='true'?closeTooltips():showTooltip(info,tip);};
  info.onpointerenter=e=>{if(e.pointerType==='mouse')showTooltip(info,tip);};
  info.onfocus=()=>{if(info.matches(':focus-visible'))showTooltip(info,tip);};
  info.onpointerleave=e=>{if(e.pointerType==='mouse')tooltipTimer=setTimeout(closeTooltips,180);};tip.onpointerenter=()=>clearTimeout(tooltipTimer);tip.onpointerleave=e=>{if(e.pointerType==='mouse')closeTooltips();};
  tip.addEventListener('toggle',()=>{if(typeof tip.showPopover==='function'&&!tip.matches(':popover-open')){tip.hidden=true;info.setAttribute('aria-expanded','false');}},{signal:lifetime.signal});
  tile.append(b,info,tip);$('catalog').append(tile);
 }
}
function brief(e){
 const parts=[];
 for(const [key,label] of Object.entries({homes:'places',jobs:'emplois',educatedJobs:'emplois qualifiés',power:'énergie',builders:'chantier',education:'places à l’école',green:'attrait',admin:'habitants couverts',fire:'habitants couverts',police:'habitants couverts',ambulance:'habitants couverts',health:'habitants couverts'}))if(e[key])parts.push(`${e[key]} ${label}`);
 for(const [key,value] of Object.entries(e.produce))parts.push(`+${tonnes(value)}/min ${RESOURCES[key].toLowerCase()}`);
 return parts.slice(0,2).join(' · ');
}
$('demand').replaceChildren();$('categories').replaceChildren();
for(const name of PRIMARY_CATEGORIES){const b=document.createElement('button');b.className=buttonVariants({variant:'outline',size:'sm'});b.dataset.category=name;b.dataset.family=CATEGORY_FAMILIES[name];b.innerHTML=iconMarkup(PRIMARY_ICONS[name])+`<span>${name}</span>`;b.setAttribute('aria-pressed',String(category===name&&!searchAcross));b.onclick=()=>{category=name;searchAcross=false;$('category-title').textContent=name;document.querySelectorAll('#categories button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));renderCatalog();update();};$('categories').append(b);}
$('catalog-search').oninput=e=>{searchQuery=e.target.value;searchAcross=Boolean(searchQuery.trim());$('clear-search').hidden=!searchQuery;for(const b of document.querySelectorAll('[data-category]'))b.setAttribute('aria-pressed',String(!searchAcross&&b.dataset.category===category));renderCatalog();update();};
$('clear-search').onclick=()=>{$('catalog-search').value='';searchQuery='';searchAcross=false;$('clear-search').hidden=true;for(const b of document.querySelectorAll('[data-category]'))b.setAttribute('aria-pressed',String(b.dataset.category===category));renderCatalog();update();$('catalog-search').focus();};
renderCatalog();
$('zoom').onclick=()=>{zoom=zoom<1.8?2.6:zoom<3?4.5:1.3;$('zoom').innerHTML=iconMarkup(zoom<3?'plus':'minus');$('zoom').setAttribute('aria-label',zoom<3?'Zoomer':'Vue d’ensemble');resize();};$('soundless').onclick=()=>openSheet('help');$('export').onclick=()=>{accrue(state);const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=state.cityName.replace(/[^a-zA-Z0-9-]/g,'-')+'-sauvegarde.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function describe(e){
 const parts=[];
 for(const [k,label] of Object.entries({homes:'places',jobs:'emplois',educatedJobs:'emplois qualifiés',education:'actifs formés',green:'attrait',power:'énergie produite',energy:'énergie utilisée',pollution:'pollution',fire:'couverture pompiers',police:'couverture police',ambulance:'couverture ambulances',health:'couverture hôpital',admin:'couverture mairie',builders:'chantiers en plus',revenue:'recettes max./min',upkeep:'frais/min'}))if(e[k])parts.push(`${['revenue','upkeep'].includes(k)?money(e[k]):e[k]} ${label}`);
 for(const [k,v] of Object.entries(e.produce))parts.push(`+${tonnes(v)}/min ${RESOURCES[k].toLowerCase()}`);
 for(const [k,v] of Object.entries(e.consume))parts.push(`−${tonnes(v)}/min ${RESOURCES[k].toLowerCase()}`);
 return parts.join(' · ');
}
function inspect(){
 const b=inspected;
 if(!b)return;
 $('building-title').textContent=`${buildingName(b.type)} · niveau ${b.level}`;
 $('building-effects').textContent=describe(effects(b));
 const cost=upgradeCost(b,state),pending=state.projects.some(p=>p.x===b.x&&p.y===b.y);
 const materials=cost===null?null:projectCost(b.type,b.level+1,state),missing=cost===null?[]:requirements(state,b.type,b.level+1);
 $('upgrade-effects').textContent=cost===null?`Niveau maximum · ${maxLevel(b.type)} / ${maxLevel(b.type)}.`:`Niveau ${b.level+1} : ${brief(effects({...b,level:b.level+1}))}. Frais : ${money(effects({...b,level:b.level+1}).upkeep)}/min.`;
 buttonLabel('upgrade',cost===null?'Niveau maximum':pending?'En travaux':`Améliorer · ${money(cost)}`);
 const reasons=[];
 if(materials){
  $('upgrade-effects').textContent+=` Coût : ${tonnes(materials.timber)} bois, ${tonnes(materials.stone)} pierre. Durée : ${projectDuration(b.type,b.level+1,state)/1000} s.`;
  if(state.money<cost)reasons.push('Pas assez d’argent.');
  if(state.resources.timber<materials.timber||state.resources.stone<materials.stone)reasons.push('Il manque du bois ou de la pierre.');
  if(state.projects.length>=stats(state).capacity)reasons.push('Chantiers pleins.');
 }
 statusNote('upgrade-reason',pending?'Amélioration en cours.':missing.length?missing.join(' · '):reasons.join(' '),pending?'neutral':missing.length||reasons.length?'warning':'neutral');
 $('upgrade').disabled=Boolean(state.gameOver)||state.money<0||cost===null||pending||missing.length>0||reasons.length>0;$('demolish').disabled=pending;
}
$('upgrade').onclick=()=>{if(!inspected)return;const err=upgrade(state,inspected.x,inspected.y);if(err)message(err,'danger');else $('toast').hidden=true;save();update();draw();};
$('demolish').onclick=()=>{$('demolition-confirm').hidden=false;};
$('cancel-demolish').onclick=()=>{$('demolition-confirm').hidden=true;};
$('confirm-demolish').onclick=()=>{if(!inspected)return;const err=demolish(state,inspected.x,inspected.y);if(!err){inspected=null;mapSelection=null;closeSheet('building-sheet');}message(err||'Bâtiment détruit.',err?'danger':'success');save();update();draw();};
$('cancel-placement').onclick=()=>{selected=null;$('placement').hidden=true;message('Construction annulée.');renderCatalog();update();};
for(const input of document.querySelectorAll('[data-tax-sector]'))input.onchange=e=>{setSectorTax(state,input.dataset.taxSector,e.target.value);save();update();message('Impôts modifiés.','success');};$('service-budget').onchange=e=>{setServiceBudget(state,e.target.value);save();update();draw();message('Budget des services modifié.','success');};
$('resources').replaceChildren();
for(const [key,label] of Object.entries(RESOURCES)){const row=document.createElement('div');const text=document.createElement('span');text.innerHTML=`${iconMarkup(({timber:'sawmill',stone:'quarry',coal:'coal',oil:'oil',food:'farm',goods:'stock'})[key])}${label} : <b id="stock-${key}">0</b>`;row.append(text);const indicator=document.createElement('span');indicator.id='stock-status-'+key;indicator.className='stock-indicator';text.append(indicator);for(const direction of ['buy','sell']){const button=document.createElement('button');button.className=buttonVariants({variant:'outline',size:'sm'});button.textContent=direction==='buy'?`Acheter · ${money(PRICES[key]*TRADE_AMOUNT)}`:`Vendre · ${money(PRICES[key]*TRADE_AMOUNT*.6)}`;button.title=`${TRADE_AMOUNT} t · ${money(PRICES[key]*(direction==='buy'?1:.6))}/t`;button.onclick=()=>{const err=trade(state,key,direction);message(err||'Échange fait.',err?'danger':'success');save();update();};row.append(button);}$('resources').append(row);}
const themeObserver=new MutationObserver(()=>{const next=document.documentElement.classList.contains('dark');if(next!==isNight){isNight=next;draw();}});themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
const observer=new ResizeObserver(resize);observer.observe(canvas);const ticker=setInterval(()=>{if(changingAccount)return;accrue(state);save();update();draw();},1000);document.addEventListener('visibilitychange',()=>{if(changingAccount)return;accrue(state);save();update();draw();},{signal:lifetime.signal});window.addEventListener('pagehide',save,{signal:lifetime.signal});resize();save();

function specialBuilding(x,y,type,scale,level){const t=TYPES[type];ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);const colors={'Administration':'#c5cbd6','Secours':'#e8cdc3','Énergie':'#839fa0','Ressources':'#b5b488','Industrie':'#a8a5a0','Éducation':'#a9bdcc','Loisirs':'#8eaf78','Commerce':'#e6c69a'};if(['football','tennis','stadium','farm','solar'].includes(type)){diamond(0,0,type==='solar'?'#547f9e':'#7ea46a');ctx.strokeStyle='#f3ecd3';ctx.strokeRect(-12,-6,24,12);if(type==='solar'){for(let i=-10;i<12;i+=7){ctx.beginPath();ctx.moveTo(i,-6);ctx.lineTo(i,6);ctx.stroke();}}else if(type==='farm'){for(let i=-8;i<10;i+=4){ctx.strokeStyle='#c9b76c';ctx.beginPath();ctx.moveTo(-12,i);ctx.lineTo(10,i-10);ctx.stroke();}}}else{const h=(type==='office'?45:type==='largeFactory'?25:20)+(level-1)*9;box(0,8,19,18,h,colors[t.category]||'#c3cba3');if(['coal','factory','largeFactory'].includes(type))box(8,-12,4,4,25,'#898779');if(['supermarket','mall'].includes(type)){poly([[0,8],[22,-3],[30,2],[8,13]],'#8f9891');ctx.strokeStyle='#eee9d5';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(5+i*6,7-i*3);ctx.lineTo(11+i*6,10-i*3);ctx.stroke();}}ctx.fillStyle=type==='hospital'?'#b35d51':'#38574b';ctx.font='bold 12px sans-serif';ctx.textAlign='center';drawIcon(ctx,type,-8,-h-5,14,isNight?'#d7dee9':'#3f3f46');if(isNight){ctx.fillStyle='#f6d88c';ctx.fillRect(-11,-h+10,4,5);ctx.fillRect(-5,-h+13,3,5);}}ctx.fillStyle=paint('#264e3b');ctx.beginPath();ctx.arc(17,9,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText(level,17,12);ctx.restore();}
function renderConstruction(announce=true){
 const projects=[...state.projects].sort((a,b)=>a.finish-b.finish);
 if(announce){const current=new Set(projects.map(constructionKey)),finished=[...previousProjects].filter(([key])=>!current.has(key));if(finished.length&&!state.gameOver)message(finished.length===1?'Chantier terminé · '+buildingName(finished[0][1].type):`${finished.length} chantiers terminés.`,'success');previousProjects=new Map(projects.map(p=>[constructionKey(p),p]));}
 const bar=$('construction-status');bar.hidden=!projects.length||Boolean(state.gameOver);if(bar.hidden)return;
 const first=projects[0],progress=constructionProgress(first,Date.now());
 $('construction-name').textContent=buildingName(first.type)+(first.level>1?' · amélioration':'');$('construction-time').textContent=progress.seconds?progress.seconds+' s':'Livraison…';$('construction-percent').textContent=progress.percent+' %';$('construction-count').textContent=projects.length>1?`+${projects.length-1} chantier${projects.length>2?'s':''} · Voir tout`:'Voir le chantier';
 $('construction-fill').style.transform=`scaleX(${progress.percent/100})`;$('construction-track').setAttribute('aria-valuenow',String(progress.percent));$('construction-track').setAttribute('aria-valuetext',`${progress.percent} %, ${progress.seconds} secondes restantes`);$('construction-open').setAttribute('aria-label',`${buildingName(first.type)} : ${progress.percent} %. Voir les ${projects.length} chantier(s)`);
}
const renderedStatusHTML=new Map();
function replaceStatusHTML(id,html){if(renderedStatusHTML.get(id)!==html){$(id).innerHTML=html;renderedStatusHTML.set(id,html);}}
function renderAdmin(st){
 replaceStatusHTML('services',Object.entries({admin:'Mairie',fire:'Pompiers',police:'Police',ambulance:'Ambulances',health:'Hôpital'}).map(([key,label])=>`<div><span class="service-label">${iconMarkup(key==='admin'?'townhall':key==='health'?'hospital':key)}${label}</span><span class="service-result"><b>${st.coverage[key]} %</b>${statusBadge(coverageStatus(st.coverage[key]),`${label} : ${st.coverage[key]} % des besoins couverts.`)}</span></div>`).join(''));
 replaceStatusHTML('utilities',`Énergie : ${Math.round(st.energyRatio*100)} % ${statusBadge(energyStatus(st.energyRatio),`Énergie : ${Math.round(st.energyRatio*100)} % des besoins couverts.`)} · Pollution : ${st.pollution}.`);
 $('education').textContent=`${st.educated} actifs formés. ${st.officeEmployed} / ${st.educatedJobs} emplois qualifiés occupés. Nourriture : ${st.foodCovered?'disponible':'épuisée'}.`;
 $('projects-title').textContent=`Chantiers · ${state.projects.length} / ${st.capacity}`;
 $('projects').replaceChildren();
 if(!state.projects.length){const p=document.createElement('p');p.textContent='Aucun chantier.';$('projects').append(p);}
 for(const p of state.projects){const line=document.createElement('p');const progress=constructionProgress(p,state.last);const label=document.createElement('span');label.textContent=`${buildingName(p.type)} · niveau ${p.level} · ${progress.seconds} s`;const track=document.createElement('span');track.className='project-track';track.setAttribute('role','progressbar');track.setAttribute('aria-label',buildingName(p.type));track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(progress.percent));const fill=document.createElement('i');fill.style.width=progress.percent+'%';track.append(fill);line.append(label,track);$('projects').append(line);}
 const buildNeeds=projectCost(selectedType(),1,state);
 for(const key of Object.keys(RESOURCES)){
  $('stock-'+key).textContent=tonnes(state.resources[key]);
  const rate=key==='food'?st.foodNeed:state.buildings.reduce((total,b)=>total+(effects(b).consume[key]||0)*Math.max(st.productivity,.1),0);
  const needed=['timber','stone'].includes(key)?buildNeeds[key]:0;
  const status=stockStatus(state.resources[key],{needed,rate});
  const description=status==='danger'?`${RESOURCES[key]} : stock insuffisant.${needed?` Il faut ${tonnes(needed)} pour le bâtiment choisi.`:''}${rate>0?` Consommation : ${tonnes(rate)}/min.`:''}`:status==='warning'?`${RESOURCES[key]} : réserve faible.${rate>0?` Environ ${Math.floor(state.resources[key]/rate)} min de consommation.`:' Prévoyez du stock pour les prochains chantiers.'}`:`${RESOURCES[key]} : aucun besoin actuel.`;
  const indicator=$('stock-status-'+key),markup=status==='success'?'':statusBadge(status,description);replaceStatusHTML(indicator.id,markup);
 }
 replaceStatusHTML('city-status',[['Budget',budgetStatus(state.money,st.income)],['Solde / min',incomeStatus(st.income)],['Énergie',energyStatus(st.energyRatio)],['Attrait',st.attractiveness>=65?'success':st.attractiveness>=40?'warning':'danger']].map(([label,status])=>`<div class="status-row"><span>${label}</span>${statusBadge(status,label+' : '+STATUS[status].label)}</div>`).join(''));
}
function landInspect(){
 const p=selectedLand;
 if(!p)return;
 const connected=adjacentLand(state,p.x,p.y),price=landPrice(state);
 statusNote('land-details',`Case ${p.x+1}, ${p.y+1} · ${money(price)}.${!connected?' Achetez d’abord une case voisine.':state.money<price?' Pas assez d’argent.':''}`,!connected?'neutral':state.money<price?'warning':'neutral');
 buttonLabel('buy-land',`Acheter · ${money(price)}`);
 $('buy-land').disabled=!connected||state.money<price;
}
$('buy-land').onclick=()=>{if(!selectedLand)return;const err=buyLand(state,selectedLand.x,selectedLand.y);message(err||'Case achetée.',err?'danger':'success');if(!err){selectedLand=null;closeSheet('land-sheet');}save();update();draw();};


for(const [key,label,icon] of [['residential','Résidence','house'],['commerce','Commerce','shop'],['industrial','Industrie','factory'],['office','Bureaux','office'],['services','Services','police']]){
 const item=document.createElement('div');item.innerHTML=`<span>${iconMarkup(icon)}${label}</span><div class="demand-track" role="progressbar" aria-label="Demande ${label}" aria-valuemin="0" aria-valuemax="100"><i id="demand-${key}"></i></div>`;$('demand').append(item);
}
for(const b of document.querySelectorAll('[data-open-sheet]')){b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',b.dataset.openSheet);b.onclick=()=>openSheet(b.dataset.openSheet);}
for(const b of document.querySelectorAll('[data-close-sheet]'))b.onclick=()=>closeSheet(b.dataset.closeSheet);
for(const d of document.querySelectorAll('dialog')){
 d.addEventListener('cancel',e=>{if(d.dataset.dismissible==='false')e.preventDefault();},{signal:lifetime.signal});
 d.addEventListener('click',e=>{if(d.dataset.dismissible==='false')return;const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close();},{signal:lifetime.signal});
 d.addEventListener('close',()=>{closeTooltips();for(const b of document.querySelectorAll('[data-open-sheet]'))b.setAttribute('aria-expanded',String($(b.dataset.openSheet).open));},{signal:lifetime.signal});
}
function renderBank(st){
 const policy=bankPolicy(state);
 $('bank-summary').textContent=`Dette : ${money(st.debt,true)} · Découvert autorisé : ${money(policy.overdraft,true)}.`;
 $('bank-policy').textContent=`Plafond de crédit : ${money(policy.credit)}. Découvert maximum : ${money(policy.overdraft)} (${Math.round(policy.overdraftRate*100)} % du plafond). Taux : ${(policy.rate*100).toLocaleString('fr-FR')} % par minute.`;
 $('bank-debt').textContent=`Capital restant : ${money(st.debt)}. Remboursement actuel : ${money(st.debtService)}/min, dont ${money(st.interest)} d’intérêts.`;
 const amounts=[...new Set([.25,.5,1].map(r=>Math.max(25000,Math.floor(policy.credit*r/25000)*25000)))];
 if(offerKey!==amounts.join(',')){offerKey=amounts.join(',');$('loan-offers').replaceChildren();for(const amount of amounts){const item=document.createElement('article');item.className='loan-offer';item.dataset.loanAmount=amount;item.innerHTML=`<h3>${money(amount,true)}</h3><p class="loan-payment"></p><p class="loan-reason"></p>`;const button=document.createElement('button');button.className=buttonVariants({variant:'default'});button.textContent='Emprunter';button.onclick=()=>{const err=borrow(state,amount);message(err||'Prêt accepté.',err?'danger':'success');save();update();};item.append(button);$('loan-offers').append(item);}}
 for(const item of document.querySelectorAll('[data-loan-amount]')){const quote=loanQuote(state,Number(item.dataset.loanAmount));item.querySelector('.loan-payment').textContent=`${money(quote.payment)}/min au départ · ${quote.duration} min`;item.querySelector('.loan-reason').textContent=quote.reason||'Prêt disponible';item.querySelector('button').disabled=!quote.approved;}
 const repay=Math.max(0,Math.min(state.money,st.debt));$('repay-info').textContent=`Remboursement anticipé possible : ${money(repay)}.`;$('repay-debt').disabled=Boolean(state.gameOver)||repay<=0;
}
$('construction-open').onclick=()=>{openSheet('city-sheet');$('projects-title').scrollIntoView({block:'start'});};
$('settings').onclick=()=>openSheet('settings-sheet');
$('city-name').value=state.cityName;
$('city-name-form').onsubmit=e=>{e.preventDefault();const err=renameCity(state,$('city-name').value);if(!err)$('city-name').value=state.cityName;message(err||'Ville renommée.',err?'danger':'success');save();update();};
$('open-bank').onclick=()=>openSheet('bank-sheet');
$('repay-debt').onclick=()=>{const err=repayDebt(state,Math.max(0,Math.min(state.money,stats(state).debt)));message(err||'Dette remboursée.',err?'danger':'success');save();update();};
function applyCityState(next){for(const d of document.querySelectorAll('dialog[open]'))d.close();state=next;keyboardCell={x:START_MIN+1,y:START_MIN+1};guideTarget=null;hover=null;mapSelection=null;lastTutorialStep=state.tutorial.step;$('city-name').value=state.cityName;selected=null;inspected=null;selectedLand=null;pan={x:0,y:0};offerKey='';category='Résidence';searchQuery='';searchAcross=false;$('catalog-search').value='';$('clear-search').hidden=true;previousProjects=new Map(state.projects.map(p=>[constructionKey(p),p]));$('category-title').textContent=category;for(const button of document.querySelectorAll('[data-category]'))button.setAttribute('aria-pressed',String(button.dataset.category===category));$('placement').hidden=true;renderCatalog();}
function restartGame(){applyCityState(initial());save();update();resize();message('Ville recommencée. Les autres villes sont conservées.','success');}
function setSyncStatus(text,status='neutral'){cloudStatus=text;cloudKind=status;if($('cities-sync'))statusNote('cities-sync',text,status);}
function renderCities(){
 $('cities-mode').textContent=cityStore.owner===GUEST?'Villes de cet appareil · mode invité':'Villes de votre compte';
 statusNote('cities-sync',cloudStatus,cloudKind);$('cities-current').textContent=`Ville active : ${state.cityName}`;
 $('create-city').disabled=changingAccount;$('import-cities').hidden=cityStore.owner===GUEST;$('import-cities').disabled=changingAccount;$('sync-cities').hidden=!citySync;$('sync-cities').disabled=changingAccount;
 const key=cityStore.owner+':'+cityStore.cities.map(c=>c.id).join(',');
 if(key!==cityListKey){cityListKey=key;$('cities-list').replaceChildren();for(const entry of cityStore.cities){const row=document.createElement('article');row.className='city-row';row.dataset.cityId=entry.id;const name=document.createElement('b'),summary=document.createElement('small'),button=document.createElement('button');name.className='city-row-name';summary.className='city-row-summary';button.className=buttonVariants({variant:'outline',size:'sm'});button.onclick=()=>switchCity(entry.id);const info=document.createElement('div');info.append(name,summary);row.append(info,button);$('cities-list').append(row);}}
 for(const row of document.querySelectorAll('[data-city-id]')){const entry=cityStore.cities.find(c=>c.id===row.dataset.cityId);row.querySelector('.city-row-name').textContent=entry.state.cityName||'Ma ville';row.querySelector('.city-row-summary').textContent=`${money(entry.state.money,true)}${entry.state.gameOver?' · Faillite':''}${entry.dirty&&cityStore.owner!==GUEST?' · En attente':''}`;const active=entry.id===cityStore.active?.id;row.querySelector('button').textContent=active?'Active':'Ouvrir';row.querySelector('button').disabled=active||changingAccount;}
}
function switchCity(id){if(changingAccount||!save())return;try{const next=cityStore.select(id);applyCityState(next);save();update();resize();message('Ville ouverte.','success');}catch{message('Ville indisponible. La partie actuelle est conservée.','danger');}}
function makeSync(client,userId){return new CitySync(client,userId,cityStore,{onStatus:setSyncStatus,onChange:({copies})=>{if(changingAccount||disposed)return;if(copies)message('Une copie locale a été conservée après un conflit.','warning');const entry=cityStore.active;if(entry){const wasOpen=$('cities-sheet').open;applyCityState(cityStore.activeState());save();update();resize();if(wasOpen)openSheet('cities-sheet');}}});}
async function changeAccount({client,user}){
 const owner=user?'user:'+user.id:GUEST;if(owner===cityStore.owner)return;
 save();citySync?.dispose();citySync=null;const generation=++accountGeneration;changingAccount=true;openSheet('cities-sheet');setSyncStatus('Chargement des villes…');
 cityStore=new CityStore({storage,owner});cityListKey='';renderCities();
 try{
  if(user){citySync=makeSync(client,user.id);await citySync.pull();if(disposed||generation!==accountGeneration)return;}
  else cityStore.ensureGuest();
 }catch{if(disposed||generation!==accountGeneration)return;setSyncStatus('Cloud indisponible. Vos villes locales restent disponibles.','warning');}
 if(disposed||generation!==accountGeneration)return;
 try{if(!cityStore.cities.length)cityStore.create(initial());applyCityState(cityStore.activeState());}
 catch{setSyncStatus('Stockage indisponible. Votre ancienne partie reste conservée.','danger');changingAccount=false;renderCities();return;}
 changingAccount=false;save();update();resize();if(user){if(cloudKind!=='warning')setSyncStatus('Synchronisation…');citySync.schedule();}else setSyncStatus('Sauvegarde sur cet appareil.');
}
$('open-cities').onclick=()=>{save();renderCities();openSheet('cities-sheet');};
$('game-over-cities').onclick=()=>{renderCities();openSheet('cities-sheet');};
$('new-city-form').onsubmit=e=>{e.preventDefault();if(changingAccount||!save())return;const fresh=initial(),err=renameCity(fresh,$('new-city-name').value);if(err){message(err,'danger');return;}try{cityStore.create(fresh);$('new-city-name').value='';applyCityState(fresh);save();update();resize();message('Nouvelle ville créée.','success');}catch{message('Création non enregistrée : stockage indisponible.','danger');}};
$('import-cities').onclick=()=>{if(changingAccount||cityStore.owner===GUEST||!save())return;try{const guest=new CityStore({storage}),count=cityStore.importGuest(guest);if(count){applyCityState(cityStore.activeState());save();update();resize();}message(count?`${count} ville(s) copiée(s) dans ce compte.`:'Ces villes sont déjà dans ce compte.',count?'success':'neutral');}catch{message('Copie impossible. Les villes d’origine sont conservées.','danger');}};
$('sync-cities').onclick=()=>{if(!changingAccount&&save())citySync?.refresh();};
window.addEventListener('online',()=>citySync?.refresh(),{signal:lifetime.signal});
$('restart').onclick=restartGame;
$('start-new').onclick=()=>openSheet('reset-sheet');
$('reset-confirm').onclick=restartGame;
$('cancel-reset').onclick=()=>closeSheet('reset-sheet');
function nextGuidePlot(){for(const key of state.owned){const [x,y]=key.split(',').map(Number);if(![...state.buildings,...state.projects].some(b=>b.x===x&&b.y===y))return {x,y};}return null;}
function renderTutorial(){
 const step=tutorialStep(state),active=Boolean(step)&&!state.gameOver;$('tutorial').hidden=!active;document.querySelector('.game-screen').dataset.guided=String(active);
 if(!active){guideTarget=null;if(lastTutorialStep<TUTORIAL_STEPS.length&&state.tutorial.step===TUTORIAL_STEPS.length)message('Ville lancée ! Réinvestissez vos bénéfices.','success');lastTutorialStep=state.tutorial.step;return;}
 if(lastTutorialStep===5&&state.tutorial.step===6&&$('city-sheet').open)closeSheet('city-sheet');lastTutorialStep=state.tutorial.step;
 const pending=step.type?state.projects.find(p=>p.type===step.type&&(step.upgrade?p.level>=2:p.level===1)):null;
 $('guide-step').textContent=`Départ guidé · ${state.tutorial.step+1} / ${TUTORIAL_STEPS.length}`;
 if($('guide-title').textContent!==step.title)$('guide-title').textContent=step.title;
 $('guide-text').textContent=step.text;$('guide-reward').textContent=`Prime : ${money(step.reward,true)}${!step.type?' · '+money(Math.min(5000,state.tutorial.income),true)+' / 5 k€':''}`;
 $('guide-action').disabled=Boolean(pending);$('guide-action').textContent=pending?`Travaux · ${Math.max(0,Math.ceil((pending.finish-state.last)/1000))} s`:step.upgrade?'Améliorer une maison':step.type?'Placer '+buildingName(step.type).toLowerCase()+' · '+money(projectCost(step.type,1,state).money,true):'Voir les revenus';
 guideTarget=step.type&&!step.upgrade&&selected===step.type&&!pending?nextGuidePlot():null;
}
$('guide-action').onclick=()=>{const step=tutorialStep(state);if(!step)return;if(!step.type){openSheet('city-sheet');return;}if(step.upgrade){const b=state.buildings.find(b=>b.type==='house'&&b.level===1);if(b){inspected=b;$('demolition-confirm').hidden=true;inspect();openSheet('building-sheet');}return;}selected=step.type;category=buildingCategories(step.type)[0];searchQuery='';searchAcross=false;$('catalog-search').value='';$('clear-search').hidden=true;$('category-title').textContent=category;for(const button of document.querySelectorAll('[data-category]'))button.setAttribute('aria-pressed',String(button.dataset.category===category));renderCatalog();$('placement').hidden=false;$('placement-label').textContent=buildingName(selected);for(const d of document.querySelectorAll('dialog[open]'))d.close();renderTutorial();if(guideTarget){const p=pos(guideTarget.x,guideTarget.y);pan.x+=W*.5-p.x;pan.y+=H*.45-p.y;}resize();message('Touchez la case en pointillés.');};
$('skip-tutorial').onclick=()=>{skipTutorial(state);guideTarget=null;save();update();draw();message('Jeu libre.');};

update();
for(const body of document.querySelectorAll('.sheet-body'))body.addEventListener('scroll',closeTooltips,{passive:true,signal:lifetime.signal});
document.addEventListener('focusin',e=>{if(!e.target.closest('.tile-info,.catalog-tooltip'))closeTooltips();},{signal:lifetime.signal});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.tile-info,.catalog-tooltip'))closeTooltips();},{signal:lifetime.signal});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.tile-info[aria-expanded=true]')){e.preventDefault();e.stopPropagation();closeTooltips();}},{capture:true,signal:lifetime.signal});
const progressTicker=setInterval(()=>{if(!changingAccount)renderConstruction(false);},250);
const cleanupSettings=mountSettings({onSession:changeAccount});
return ()=>{save();disposed=true;accountGeneration++;citySync?.dispose();cleanupSettings();assetRenderer.dispose();cleanupStatusTooltips();closeTooltips();lifetime.abort();clearInterval(ticker);clearInterval(progressTicker);clearTimeout(toastTimer);observer.disconnect();themeObserver.disconnect();for(const d of document.querySelectorAll('dialog[open]'))d.close();};
}
