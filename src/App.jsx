import { useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { NativeSelect, NativeSelectOption } from './components/ui/native-select';
import { iconMarkup } from './icons';
function Icon({name}) { return <span className="icon" aria-hidden="true" dangerouslySetInnerHTML={{__html:iconMarkup(name)}} />; }
export default function App(){
 useEffect(()=>{let disposed=false,cleanup;import('./game.js').then(({mountGame})=>{if(!disposed)cleanup=mountGame();}).catch(error=>{if(disposed)return;const status=document.getElementById('toast');status.textContent='Le jeu n’a pas démarré. Rechargez la page.';status.dataset.variant='destructive';status.setAttribute('role','alert');console.error(error);});return()=>{disposed=true;cleanup?.();};},[]);
 return (
<> <main>
  <header>
    <h1>Urbo</h1>
    <span id="save" className="muted">Sauvegarde locale</span>
    <Button id="soundless" variant="ghost" className="help" aria-label="Aide"><Icon name="help" />Aide</Button>
  </header>
  <Card className="game" aria-label="Votre ville">
    <div className="toolbar">
      <div><span className="label"><Icon name="money" />Argent</span><strong id="money"></strong></div>
      <div><span className="label"><Icon name="people" />Habitants</span><strong id="people"></strong></div>
      <div><span className="label"><Icon name="income" />Solde / min</span><strong id="income"></strong></div>
    </div>
    <div className="world">
      <canvas id="map" aria-label="Carte. Choisissez un bâtiment puis une case libre. Les cases + sont à acheter. La liste des cases permet aussi de jouer au clavier."></canvas>
      <Badge className="map-title" variant="secondary">Niveau <span id="level">1</span></Badge>
      <Button id="zoom" className="zoom" aria-label="Changer le zoom"><span data-button-icon><Icon name="plus" /></span></Button>
    </div>
    <p id="toast" role="status">Choisissez un bâtiment, puis une case libre.</p>
    <section id="land-inspector" className="selection" hidden aria-label="Achat de terrain">
      <h2>Acheter une case</h2>
      <p id="land-details"></p>
      <div className="actions"><Button id="buy-land" variant="default"><Icon name="land" /><span data-button-label>Acheter</span></Button><Button id="close-land">Fermer</Button></div>
    </section>
    <section id="inspector" className="selection" hidden aria-label="Bâtiment sélectionné">
      <h2 id="building-title"></h2>
      <details><summary>Détails</summary><p id="building-effects"></p></details>
      <p id="upgrade-effects"></p>
      <p id="upgrade-reason" className="muted"></p>
      <div className="actions"><Button id="upgrade" variant="default"><Icon name="upgrade" /><span data-button-label>Améliorer</span></Button><Button id="deselect">Fermer</Button></div>
    </section>
    <details className="projects-section"><summary id="projects-title">Chantiers</summary><div id="projects"></div></details>
    <nav className="tabs" aria-label="Menu">
      <Button data-panel="build-panel" aria-pressed="true"><Icon name="build" />Construire</Button>
      <Button data-panel="city-panel" aria-pressed="false"><Icon name="townhall" />Ville</Button>
      <Button data-panel="stock-panel" aria-pressed="false"><Icon name="stock" />Stocks</Button>
    </nav>
    <section id="build-panel" className="panel">
      <nav id="categories" aria-label="Bâtiments"></nav>
      <div id="catalog" className="catalog"></div>
      <details className="building-details"><summary>Choix : <span id="selected-name">Maison</span></summary><p id="selected-effects"></p></details>
      <details className="accessible"><summary>Liste des cases</summary><div id="plots"></div></details>
    </section>
    <section id="city-panel" className="panel" hidden>
      <h2>Ville</h2>
      <div className="indicators">
        <div><span className="label">Emplois occupés / total</span><strong id="jobs"></strong><small id="employment"></small></div>
        <div><span className="label">Attrait</span><strong id="appeal"></strong><small id="housing"></small></div>
        <label><span className="label">Impôts</span><NativeSelect id="tax" defaultValue="normal"><NativeSelectOption value="low">Bas</NativeSelectOption><NativeSelectOption value="normal">Moyens</NativeSelectOption><NativeSelectOption value="high">Hauts</NativeSelectOption></NativeSelect></label>
      </div>
      <p id="economy"></p>
      <p id="advice" className="hint"></p>
      <h3>Services</h3>
      <div id="services" className="metrics"></div>
      <p className="muted">Part des habitants couverts.</p>
      <h3>Énergie et écoles</h3>
      <p id="utilities"></p><p id="education"></p>
      <h3>Terrain</h3>
      <p id="progression"></p><p id="territory"></p>
    </section>
    <section id="stock-panel" className="panel" hidden>
      <h2>Stocks</h2><p className="muted">Achat et vente par 10.</p>
      <div id="resources"></div>
    </section>
    <div className="footnote"><span>Sur cet appareil · absence max. 8 h</span><Button id="export"><Icon name="download" />Exporter</Button></div>
  </Card>
</main>
<dialog id="help" aria-labelledby="help-title">
  <h2 id="help-title">Comment jouer</h2>
  <ol><li>Choisissez un bâtiment.</li><li>Touchez une case libre pour construire.</li><li>Touchez un bâtiment pour l’améliorer.</li><li>Touchez une case + pour l’acheter.</li></ol>
  <p>Ville : budget et services.<br />Stocks : ressources et marché.</p>
  <p className="muted">Sauvegarde sur cet appareil.</p>
  <Button id="close" variant="default">Fermer</Button>
</dialog> </>
);
}
