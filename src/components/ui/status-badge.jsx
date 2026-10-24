import {STATUS,statusBadge} from '../../status';
export function StatusBadge({status='neutral'}){
 return <span dangerouslySetInnerHTML={{__html:statusBadge(status,STATUS[status]?.label)}}/>;
}
