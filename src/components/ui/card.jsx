import {cn} from '../../lib/utils';
function Card({className,...props}){return <section data-slot="card" className={cn('bg-card text-card-foreground rounded-xl border',className)} {...props}/>;}
function CardHeader({className,...props}){return <div data-slot="card-header" className={cn('grid gap-1.5 px-6',className)} {...props}/>;}
function CardTitle({className,...props}){return <h2 data-slot="card-title" className={cn('font-semibold leading-none',className)} {...props}/>;}
function CardContent({className,...props}){return <div data-slot="card-content" className={cn('px-6',className)} {...props}/>;}
export {Card,CardHeader,CardTitle,CardContent};
