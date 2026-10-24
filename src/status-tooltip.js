// One shared popover keeps status explanations usable with mouse, keyboard and touch.
export function mountStatusTooltips(signal){
 const tip=document.createElement('div');tip.id='status-explanation';tip.className='status-tooltip';tip.setAttribute('role','tooltip');tip.setAttribute('popover','manual');tip.hidden=true;document.body.append(tip);
 let active=null,pinned=false;
 function close(){if(active){active.setAttribute('aria-expanded','false');active.removeAttribute('aria-describedby');}if(tip.matches(':popover-open'))tip.hidePopover();tip.hidden=true;active=null;pinned=false;}
 function open(button,pin=false){
  if(!button)return;close();active=button;pinned=pin;tip.textContent=button.dataset.statusTip;tip.hidden=false;
  button.setAttribute('aria-expanded','true');button.setAttribute('aria-describedby',tip.id);
  if(typeof tip.showPopover==='function')tip.showPopover();
  else (button.closest('dialog')||document.body).append(tip);
  const r=button.getBoundingClientRect(),width=Math.min(280,window.innerWidth-24);tip.style.width=width+'px';tip.style.left=Math.max(12,Math.min(window.innerWidth-width-12,r.left))+'px';
  const height=tip.getBoundingClientRect().height;tip.style.top=Math.max(12,r.bottom+8+height>window.innerHeight-12?r.top-height-8:r.bottom+8)+'px';
 }
 document.addEventListener('pointerover',e=>{const button=e.target.closest('[data-status-tip]');if(button&&button!==active&&!pinned&&e.pointerType!=='touch')open(button);},{signal});
 document.addEventListener('pointerout',e=>{if(!pinned&&active&&e.target.closest('[data-status-tip]')===active&&!active.contains(e.relatedTarget))close();},{signal});
 document.addEventListener('focusin',e=>{const button=e.target.closest('[data-status-tip]');if(button)open(button);else if(!pinned)close();},{signal});
 document.addEventListener('click',e=>{const button=e.target.closest('[data-status-tip]');if(button){if(button===active&&pinned)close();else open(button,true);}else close();},{signal});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){e.preventDefault();e.stopPropagation();close();}},{capture:true,signal});
 document.addEventListener('scroll',close,{capture:true,passive:true,signal});window.addEventListener('resize',close,{signal});
 return ()=>{close();tip.remove();};
}
