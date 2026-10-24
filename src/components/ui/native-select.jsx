import {cn} from '../../lib/utils';
function NativeSelect({className,...props}){return <select data-slot="native-select" className={cn('border-input bg-background h-11 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',className)} {...props}/>;}
function NativeSelectOption(props){return <option data-slot="native-select-option" {...props}/>;}
export {NativeSelect,NativeSelectOption};
