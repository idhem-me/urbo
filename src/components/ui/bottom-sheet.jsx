import {Button} from './button';
import {iconMarkup} from '../../icons';
export function BottomSheet({id,title,children}){
 return <dialog id={id} className="bottom-sheet" aria-labelledby={`${id}-title`}>
  <div className="sheet-handle" aria-hidden="true" />
  <header className="sheet-header"><h2 id={`${id}-title`}>{title}</h2><Button data-close-sheet={id} variant="ghost" size="icon" aria-label="Fermer" dangerouslySetInnerHTML={{__html:iconMarkup('close')}} /></header>
  <div className="sheet-body">{children}</div>
 </dialog>;
}
