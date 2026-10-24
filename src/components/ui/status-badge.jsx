import {Badge} from './badge';
import {STATUS} from '../../status';
import {iconMarkup} from '../../icons';
export function StatusBadge({status='neutral',className,...props}){
 const state=Object.hasOwn(STATUS,status)?status:'neutral';
 return <Badge variant={state==='neutral'?'secondary':state} data-status={state} className={`status-badge ${className||''}`} {...props}>
  <span aria-hidden="true" dangerouslySetInnerHTML={{__html:iconMarkup(STATUS[state].icon)}}/>
  <span>{STATUS[state].label}</span>
 </Badge>;
}
