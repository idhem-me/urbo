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
  <div className="hud-stack"><section className="hud" aria-label="Indicateurs">
   <div className="counters">
    <div className="counter" role="group" title="Budget en euros" aria-label="Budget"><Icon name="money"/><span id="money"/></div>
    <div className="counter" role="group" title="Habitants" aria-label="Habitants"><Icon name="people"/><span id="people"/></div>
    <div className="counter" role="group" title="Solde en euros par minute" aria-label="Solde par minute"><Icon name="income"/><span id="income"/></div><Button id="soundless" className="hud-help" variant="outline" size="icon" aria-label="Aide"><Icon name="help"/></Button>
   </div>
   <div className="demand-panel" aria-label="Demande">

    <div id="demand" className="demand-grid"/>
   </div>
  </section>
  <div className="hud-feedback">
  <p id="toast" role="status">Choisissez Construire pour commencer.</p>
  <section id="construction-status" className="construction-progress" hidden aria-label="Chantier en cours"><button id="construction-open" type="button" aria-label="Voir les chantiers"/><span className="construction-heading"><span className="construction-label"><Icon name="build"/><span id="construction-name"/></span><span id="construction-time"/></span><span className="construction-track" id="construction-track" role="progressbar" aria-label="Progression du chantier" aria-valuemin={0} aria-valuemax={100}><i id="construction-fill"/></span><span className="construction-footer"><span id="construction-percent"/><span id="construction-count"/></span></section>
  </div></div>
  <div className="map-tools"><Button id="settings" variant="outline" size="icon" aria-label="Réglages"><Icon name="settings"/></Button><Button id="zoom" variant="outline" size="icon" aria-label="Zoom"><Icon name="plus"/></Button></div>
  <div className="activity-dock"><section id="tutorial" className="tutorial-card" aria-label="Début guidé" hidden><div className="tutorial-heading"><span id="guide-step"/><Button id="skip-tutorial" variant="ghost" size="icon" aria-label="Passer le guide"><Icon name="close"/></Button></div><h3 id="guide-title" aria-live="polite"/><p id="guide-text"/><small id="guide-reward"/><Button id="guide-action" variant="default">Commencer</Button></section>
  <div id="placement" className="placement" hidden><span id="placement-label"/><Button id="cancel-placement" variant="ghost" size="icon" aria-label="Annuler la construction"><Icon name="close"/></Button></div></div>
  <nav className="bottom-nav" aria-label="Menu">
   <Button data-open-sheet="build-sheet"><Icon name="build"/>Construire</Button>
   <Button data-open-sheet="city-sheet"><Icon name="townhall"/>Ville</Button>
   <Button data-open-sheet="stock-sheet"><Icon name="stock"/>Stocks</Button>
  </nav>
  <BottomSheet id="build-sheet" title="Construire">
   <div className="catalog-controls"><div className="catalog-search"><Icon name="search"/><label htmlFor="catalog-search" className="sr-only">Rechercher un bâtiment</label><input id="catalog-search" type="search" placeholder="Rechercher un bâtiment" autoComplete="off"/><Button id="clear-search" variant="ghost" size="icon" aria-label="Effacer la recherche" hidden><Icon name="close"/></Button></div><p id="build-blocked" className="status-note" hidden/><nav id="categories" aria-label="Catégories"/>
   <div className="catalog-heading"><h3 id="category-title">Résidence</h3><span id="catalog-count" role="status"/></div></div><p id="catalog-empty" className="muted" hidden>Aucun bâtiment trouvé. Essayez un autre mot ou une autre catégorie.</p><div id="catalog" className="catalog"/>


  </BottomSheet>
  <BottomSheet id="city-sheet" title="Ville">
   <div className="city-heading"><div><b id="city-name-display">Ma ville</b><span className="label">Niveau <b id="level">1</b></span></div><Button data-open-sheet="cities-sheet" variant="outline" size="sm">Mes villes</Button></div>
   <p id="save" className="muted city-save">Sauvegarde locale</p>
   <section className="city-section city-overview" aria-label="Vue d’ensemble">
    <div className="indicators"><div><span className="label">Emplois occupés</span><strong id="jobs"/><small id="employment"/></div><div><span className="label">Attrait</span><strong id="appeal"/><small id="housing"/></div></div>
    <p id="advice" className="status-note"/><div id="city-status"/>
   </section>
   <section className="city-section"><h3>Finances</h3><p className="label">Par minute</p><div id="economy" className="finance-breakdown"/>
    <details className="city-details"><summary>Impôts et services</summary><div className="city-detail-body"><div className="tax-controls"><TaxControl sector="residential" label="Logements"/><TaxControl sector="commerce" label="Commerces"/><TaxControl sector="office" label="Bureaux"/></div><p className="muted">Moins d’impôts attire plus d’habitants et d’entreprises.</p><label htmlFor="service-budget" className="label">Budget des services</label><NativeSelect id="service-budget" defaultValue="normal"><NativeSelectOption value="low">Réduit · capacité 65 % · coût 60 %</NativeSelectOption><NativeSelectOption value="normal">Normal · capacité et coût 100 %</NativeSelectOption><NativeSelectOption value="high">Renforcé · capacité 135 % · coût 140 %</NativeSelectOption></NativeSelect></div></details>
    <div className="city-bank"><div><b>Banque</b><p id="bank-summary"/></div><Button id="open-bank" variant="outline">Voir</Button></div>
   </section>
   <section className="city-section"><h3 id="projects-title">Chantiers</h3><div id="projects"/></section>
   <details className="city-details city-section"><summary>Services et population</summary><div className="city-detail-body"><div id="services" className="metrics"/><p id="utilities"/><p id="education"/></div></details>
   <details className="city-details city-section"><summary>Terrain et niveau</summary><div className="city-detail-body"><p id="progression"/><p id="territory"/></div></details>
   <details className="city-details city-section"><summary>Nom de la ville</summary><form id="city-name-form" className="city-name-form city-detail-body"><label htmlFor="city-name" className="label">Nom</label><div><input id="city-name" name="cityName" type="text" maxLength={80} placeholder="Ma ville" autoComplete="off"/><Button type="submit">Enregistrer</Button></div></form></details>

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
  <BottomSheet id="game-over" title="Faillite" dismissible={false}><p id="game-over-reason"/><p>La ville a dépassé son découvert autorisé. La partie est terminée.</p><Button id="restart" variant="default">Recommencer</Button><Button id="game-over-cities">Mes villes</Button></BottomSheet>
  <BottomSheet id="settings-sheet" title="Réglages"><h3>Mes villes</h3><Button id="open-cities"><Icon name="townhall"/>Mes villes</Button><p id="cities-current" className="muted"/><h3>Compte</h3><p id="account-status" className="muted">Non connecté</p><Button id="google-login" variant="default">Se connecter avec Google</Button><Button id="google-logout" hidden>Se déconnecter</Button><p id="auth-message" className="status-note" hidden/><p className="muted">Vos villes sont sauvegardées ici et synchronisées si le cloud est configuré.</p><h3>Apparence</h3><label htmlFor="theme-select" className="label">Thème</label><NativeSelect id="theme-select" defaultValue="system"><NativeSelectOption value="system">Système</NativeSelectOption><NativeSelectOption value="light">Clair</NativeSelectOption><NativeSelectOption value="dark">Sombre</NativeSelectOption></NativeSelect><h3>Nouvelle partie</h3><p className="muted">Repartir de zéro avec le guide de démarrage.</p><Button id="start-new" variant="destructive">Recommencer à zéro</Button><h3>Sauvegarde</h3><Button id="export"><Icon name="download"/>Exporter cette ville</Button></BottomSheet>
  <BottomSheet id="reset-sheet" title="Recommencer ?"><p>La ville, les bâtiments, le budget et les prêts seront effacés. Le compte et le thème seront conservés.</p><div className="actions"><Button id="reset-confirm" variant="destructive">Recommencer</Button><Button id="cancel-reset">Annuler</Button></div></BottomSheet>
  <BottomSheet id="cities-sheet" title="Mes villes"><p id="cities-mode"/><p id="cities-sync" className="status-note"/><div id="cities-list"/><h3>Nouvelle ville</h3><form id="new-city-form" className="city-name-form"><label htmlFor="new-city-name" className="label">Nom</label><div><input id="new-city-name" type="text" placeholder="Nouvelle ville" maxLength={80} required/><Button id="create-city" type="submit">Créer</Button></div></form><div className="actions"><Button id="import-cities" hidden>Copier mes villes de cet appareil</Button><Button id="sync-cities" hidden>Synchroniser</Button></div><p className="muted">Chaque ville garde ses bâtiments, son budget et sa progression. Le mode invité et les comptes restent séparés.</p></BottomSheet>
  <BottomSheet id="help" title="Aide"><ol><li>Construire : choisissez un bâtiment, puis une case libre.</li><li>Touchez un bâtiment pour l’améliorer ou le détruire.</li><li>Touchez une case + pour l’acheter.</li><li>Glissez pour déplacer la carte. Pincez pour zoomer.</li></ol><p>€ : euros · k€ : milliers d’euros · M€ : millions d’euros · Md€ : milliards d’euros.<br/>t : tonnes · /min : par minute de jeu.</p><h3>États</h3><div className="status-legend"><StatusBadge status="success"/><StatusBadge status="warning"/><StatusBadge status="danger"/></div><p className="muted">Sauvegarde sur cet appareil. Jusqu’à 8 h de progression en votre absence.</p></BottomSheet>
 </main>;
}
