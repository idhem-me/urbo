import {useEffect} from 'react';
import {Button} from './components/ui/button';
import {NativeSelect,NativeSelectOption} from './components/ui/native-select';
import {StatusBadge} from './components/ui/status-badge';
import {BottomSheet} from './components/ui/bottom-sheet';
import {iconMarkup} from './icons';
function Icon({name}){return <span className="icon" aria-hidden="true" dangerouslySetInnerHTML={{__html:iconMarkup(name)}}/>;}
export default function App(){
 useEffect(()=>{let disposed=false,cleanup;import('./game.js').then(({mountGame})=>{if(!disposed)cleanup=mountGame();}).catch(error=>{if(disposed)return;const status=document.getElementById('toast');status.textContent='Le jeu n’a pas démarré.';status.dataset.status='danger';status.setAttribute('role','alert');console.error(error);});return()=>{disposed=true;cleanup?.();};},[]);
 return <main className="game-screen" aria-label="Urbo">
  <div className="world"><canvas id="map" aria-label="Ville. Déplacez la carte avec le doigt. Touchez un bâtiment pour le gérer, ou une case + pour l’acheter."/></div>
  <section className="hud" aria-label="Indicateurs">
   <div className="counters">
    <div className="counter" role="group" title="Budget en euros" aria-label="Budget"><Icon name="money"/><span id="money"/></div>
    <div className="counter" role="group" title="Habitants" aria-label="Habitants"><Icon name="people"/><span id="people"/></div>
    <div className="counter" role="group" title="Solde en euros par minute" aria-label="Solde par minute"><Icon name="income"/><span id="income"/></div>
   </div>
   <div className="demand-panel" aria-label="Demande">
    <span className="demand-title">Demande</span>
    <div id="demand" className="demand-grid"/>
   </div>
  </section>
  <div className="map-tools"><Button id="soundless" variant="outline" size="icon" aria-label="Aide"><Icon name="help"/></Button><Button id="zoom" variant="outline" size="icon" aria-label="Zoom"><Icon name="plus"/></Button></div>
  <p id="toast" role="status">Choisissez Construire pour commencer.</p>
  <div id="placement" className="placement" hidden><span id="placement-label"/><Button id="cancel-placement" variant="ghost" size="icon" aria-label="Annuler la construction"><Icon name="close"/></Button></div>
  <nav className="bottom-nav" aria-label="Menu">
   <Button data-open-sheet="build-sheet"><Icon name="build"/>Construire</Button>
   <Button data-open-sheet="city-sheet"><Icon name="townhall"/>Ville</Button>
   <Button data-open-sheet="stock-sheet"><Icon name="stock"/>Stocks</Button>
  </nav>
  <BottomSheet id="build-sheet" title="Construire">
   <nav id="categories" aria-label="Catégories"/>
   <h3 id="category-title">Logements</h3><div id="catalog" className="catalog"/>
   <details className="building-details"><summary>Détails : <span id="selected-name">Maison</span></summary><p id="selected-effects"/></details>
   <details className="accessible"><summary>Liste des cases</summary><div id="plots"/></details>
  </BottomSheet>
  <BottomSheet id="city-sheet" title="Ville">
   <div className="city-heading"><span>Urbo · niveau <b id="level">1</b></span><span id="save" className="muted">Sauvegarde locale</span></div>
   <div className="indicators"><div><span className="label">Emplois</span><strong id="jobs"/><small id="employment"/></div><div><span className="label">Attrait</span><strong id="appeal"/><small id="housing"/></div><label><span className="label">Impôts</span><NativeSelect id="tax" defaultValue="normal"><NativeSelectOption value="low">Bas</NativeSelectOption><NativeSelectOption value="normal">Moyens</NativeSelectOption><NativeSelectOption value="high">Hauts</NativeSelectOption></NativeSelect></label></div>
   <h3>État de la ville</h3><div id="city-status"/><h3>Budget</h3><p id="economy"/><p id="advice" className="status-note"/>
   <h3>Services</h3><div id="services" className="metrics"/>
   <h3>Énergie et écoles</h3><p id="utilities"/><p id="education"/>
   <h3 id="projects-title">Chantiers</h3><div id="projects"/>
   <h3>Terrain</h3><p id="progression"/><p id="territory"/>
   <p className="muted">Budget : € · stocks : t · production : t/min.</p>
   <Button id="export"><Icon name="download"/>Exporter</Button>
  </BottomSheet>
  <BottomSheet id="stock-sheet" title="Stocks">
   <p className="muted">Stocks en tonnes (t). Achat et vente par 100 t.</p><div id="resources"/>
  </BottomSheet>
  <BottomSheet id="building-sheet" title="Bâtiment">
   <h3 id="building-title"/><p id="building-effects"/>
   <h3>Améliorer</h3><p id="upgrade-effects"/><p id="upgrade-reason" className="status-note"/>
   <div className="actions"><Button id="upgrade" variant="default"><Icon name="upgrade"/><span data-button-label>Améliorer</span></Button><Button id="demolish" variant="destructive"><Icon name="destroy"/>Détruire</Button></div>
   <section id="demolition-confirm" className="destructive-box" hidden><p>Détruire ce bâtiment ? Aucun remboursement.</p><div className="actions"><Button id="confirm-demolish" variant="destructive">Détruire</Button><Button id="cancel-demolish">Annuler</Button></div></section>
  </BottomSheet>
  <BottomSheet id="land-sheet" title="Acheter une case"><p id="land-details" className="status-note"/><Button id="buy-land" variant="default"><Icon name="land"/><span data-button-label>Acheter</span></Button></BottomSheet>
  <BottomSheet id="help" title="Aide"><ol><li>Construire : choisissez un bâtiment, puis une case libre.</li><li>Touchez un bâtiment pour l’améliorer ou le détruire.</li><li>Touchez une case + pour l’acheter.</li><li>Glissez pour déplacer la carte. Pincez pour zoomer.</li></ol><p>€ : euros · k€ : milliers d’euros · M€ : millions d’euros.<br/>t : tonnes · /min : par minute de jeu.</p><h3>États</h3><div className="status-legend"><StatusBadge status="success"/><StatusBadge status="warning"/><StatusBadge status="danger"/></div><p className="muted">Sauvegarde sur cet appareil. Jusqu’à 8 h de progression en votre absence.</p></BottomSheet>
 </main>;
}
