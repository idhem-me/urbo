import {useEffect} from 'react';
import {Button} from './components/ui/button';
import {NativeSelect,NativeSelectOption} from './components/ui/native-select';
import {StatusBadge} from './components/ui/status-badge';
import {BottomSheet} from './components/ui/bottom-sheet';
import {iconMarkup} from './icons';
function Icon({name}){return <span className="icon" aria-hidden="true" dangerouslySetInnerHTML={{__html:iconMarkup(name)}}/>;}
function TaxControl({sector,label}){return <label><span className="label">{label}</span><NativeSelect id={'tax-'+sector} data-tax-sector={sector} defaultValue="normal"><NativeSelectOption value="low">Bas</NativeSelectOption><NativeSelectOption value="normal">Moyens</NativeSelectOption><NativeSelectOption value="high">Hauts</NativeSelectOption></NativeSelect></label>;}
export default function App(){
 useEffect(()=>{let disposed=false,cleanup;import('./game.js').then(({mountGame})=>{if(!disposed)cleanup=mountGame();}).catch(error=>{if(disposed)return;const status=document.getElementById('toast');status.textContent='Le jeu n’a pas démarré.';status.dataset.status='danger';status.setAttribute('role','alert');console.error(error);});return()=>{disposed=true;cleanup?.();};},[]);
 return <main className="game-screen" aria-label="Urbo">
  <div className="world"><canvas id="map" tabIndex={0} aria-label="Ville. Glissez pour déplacer la carte. Au clavier : flèches pour choisir une case, Entrée pour agir. Touchez un bâtiment pour le gérer."/></div>
  <section className="hud" aria-label="Indicateurs">
   <div className="counters">
    <div className="counter" role="group" title="Budget en euros" aria-label="Budget"><Icon name="money"/><span id="money"/></div>
    <div className="counter" role="group" title="Habitants" aria-label="Habitants"><Icon name="people"/><span id="people"/></div>
    <div className="counter" role="group" title="Solde en euros par minute" aria-label="Solde par minute"><Icon name="income"/><span id="income"/></div><Button id="soundless" className="hud-help" variant="outline" size="icon" aria-label="Aide"><Icon name="help"/></Button>
   </div>
   <div className="demand-panel" aria-label="Demande">

    <div id="demand" className="demand-grid"/>
   </div>
  </section>
  <div className="map-tools"><Button id="settings" variant="outline" size="icon" aria-label="Réglages"><Icon name="settings"/></Button><Button id="zoom" variant="outline" size="icon" aria-label="Zoom"><Icon name="plus"/></Button></div>
  <p id="toast" role="status">Choisissez Construire pour commencer.</p>
  <div id="placement" className="placement" hidden><span id="placement-label"/><Button id="cancel-placement" variant="ghost" size="icon" aria-label="Annuler la construction"><Icon name="close"/></Button></div>
  <nav className="bottom-nav" aria-label="Menu">
   <Button data-open-sheet="build-sheet"><Icon name="build"/>Construire</Button>
   <Button data-open-sheet="city-sheet"><Icon name="townhall"/>Ville</Button>
   <Button data-open-sheet="stock-sheet"><Icon name="stock"/>Stocks</Button>
  </nav>
  <BottomSheet id="build-sheet" title="Construire">
   <p id="build-blocked" className="status-note" hidden/><nav id="categories" aria-label="Catégories"/>
   <h3 id="category-title">Logements</h3><div id="catalog" className="catalog"/>


  </BottomSheet>
  <BottomSheet id="city-sheet" title="Ville">
   <div className="city-heading"><span><b id="city-name-display">Ma ville</b> · niveau <b id="level">1</b></span><span id="save" className="muted">Sauvegarde locale</span></div>
   <form id="city-name-form" className="city-name-form"><label htmlFor="city-name" className="label">Nom de la ville</label><div><input id="city-name" name="cityName" type="text" maxLength={80} placeholder="Ma ville" autoComplete="off"/><Button type="submit">Enregistrer</Button></div></form><div className="indicators"><div><span className="label">Emplois</span><strong id="jobs"/><small id="employment"/></div><div><span className="label">Attrait</span><strong id="appeal"/><small id="housing"/></div></div>
   <h3>Impôts</h3><div className="tax-controls"><TaxControl sector="residential" label="Logements"/><TaxControl sector="commerce" label="Commerces"/><TaxControl sector="office" label="Bureaux"/></div><p className="muted">Impôts bas : plus de demande. Impôts hauts : plus de recettes par activité.</p><h3>Budget des services</h3><NativeSelect id="service-budget" defaultValue="normal"><NativeSelectOption value="low">Réduit · 60 % du coût · 65 % de capacité</NativeSelectOption><NativeSelectOption value="normal">Normal · 100 % du coût et de la capacité</NativeSelectOption><NativeSelectOption value="high">Renforcé · 140 % du coût · 135 % de capacité</NativeSelectOption></NativeSelect><h3>État de la ville</h3><div id="city-status"/><h3>Budget</h3><p id="economy"/><p id="advice" className="status-note"/>
   <h3>Banque</h3><p id="bank-summary"/><Button id="open-bank"><Icon name="townhall"/>Banque</Button><h3>Services</h3><div id="services" className="metrics"/>
   <h3>Énergie et écoles</h3><p id="utilities"/><p id="education"/>
   <h3 id="projects-title">Chantiers</h3><div id="projects"/>
   <h3>Terrain</h3><p id="progression"/><p id="territory"/>
   <p className="muted">Budget : € · stocks : t · production : t/min.</p>

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
  <BottomSheet id="bank-sheet" title="Banque"><p id="bank-policy"/><p id="bank-debt"/><p className="muted">Prêts sur 30 minutes de jeu. La banque exige 20 % de marge après remboursement. Les intérêts sont calculés sur le capital restant.</p><div id="loan-offers"/><p id="repay-info"/><Button id="repay-debt">Rembourser</Button></BottomSheet>
  <BottomSheet id="game-over" title="Faillite" dismissible={false}><p id="game-over-reason"/><p>La ville a dépassé son découvert autorisé. La partie est terminée.</p><Button id="restart" variant="default">Recommencer</Button></BottomSheet>
  <BottomSheet id="settings-sheet" title="Réglages"><h3>Compte</h3><p id="account-status" className="muted">Non connecté</p><Button id="google-login" variant="default">Se connecter avec Google</Button><Button id="google-logout" hidden>Se déconnecter</Button><p id="auth-message" className="status-note" hidden/><p className="muted">La partie reste sauvegardée sur cet appareil.</p><h3>Apparence</h3><label htmlFor="theme-select" className="label">Thème</label><NativeSelect id="theme-select" defaultValue="system"><NativeSelectOption value="system">Système</NativeSelectOption><NativeSelectOption value="light">Clair</NativeSelectOption><NativeSelectOption value="dark">Sombre</NativeSelectOption></NativeSelect><h3>Sauvegarde</h3><Button id="export"><Icon name="download"/>Exporter la partie</Button></BottomSheet>
  <BottomSheet id="help" title="Aide"><ol><li>Construire : choisissez un bâtiment, puis une case libre.</li><li>Touchez un bâtiment pour l’améliorer ou le détruire.</li><li>Touchez une case + pour l’acheter.</li><li>Glissez pour déplacer la carte. Pincez pour zoomer.</li></ol><p>€ : euros · k€ : milliers d’euros · M€ : millions d’euros · Md€ : milliards d’euros.<br/>t : tonnes · /min : par minute de jeu.</p><h3>États</h3><div className="status-legend"><StatusBadge status="success"/><StatusBadge status="warning"/><StatusBadge status="danger"/></div><p className="muted">Sauvegarde sur cet appareil. Jusqu’à 8 h de progression en votre absence.</p></BottomSheet>
 </main>;
}
