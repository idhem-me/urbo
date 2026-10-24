import {iconMarkup} from './icons.js';
export const STATUS={
 success:{label:'OK',icon:'status-success'},
 warning:{label:'À surveiller',icon:'status-warning'},
 danger:{label:'Critique',icon:'status-danger'},
 neutral:{label:'Optionnel',icon:'info'},
};
export const coverageStatus=value=>value>=80?'success':value>=40?'warning':'danger';
export const energyStatus=ratio=>ratio>=1?'success':ratio>=.6?'warning':'danger';
export const incomeStatus=income=>income>0?'success':income===0?'warning':'danger';
export function budgetStatus(balance,income){if(balance<=0)return 'danger';if(income<0)return balance/-income<5?'danger':'warning';return income===0?'warning':'success';}
export function stockStatus(amount,{needed=0,rate=0}={}){
 if(needed<=0&&rate<=0)return 'neutral';
 if(amount<=0||amount<needed||(rate>0&&amount/rate<2))return 'danger';
 if(amount<needed*2||(rate>0&&amount/rate<10))return 'warning';
 return 'success';
}
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function statusBadge(status,description){
 status=Object.hasOwn(STATUS,status)?status:'neutral';const config=STATUS[status],label=escape(description||config.label);
 return `<button type="button" class="status-badge status-icon" data-status="${status}" data-status-tip="${label}" aria-label="${label}" aria-expanded="false">${iconMarkup(config.icon)}</button>`;
}
