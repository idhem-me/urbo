# Assets des bâtiments

## État de préparation

Le moteur accepte désormais des SVG référencés par type et niveau. Sans asset exact pour un niveau, il conserve le dessin actuel. Aucun changement de sauvegarde, de coût ou de capacité.

Le fichier fourni `quartier-a.svg` est un quartier complet de 16 × 16 cases, pas une maison. Il est conservé comme exemple indépendant : la carte actuelle fait 11 × 11 cases avec des routes fixes. L’intégrer comme quartier jouable demandera une décision sur les emprises et les routes, puis des règles de placement adaptées. On ne le réduit pas automatiquement à une case.

## Dossier à transmettre

Tu peux envoyer le dossier tel quel. Si possible : un fichier autonome par bâtiment et par niveau, transparent, même perspective isométrique 2:1. Pas besoin de renommer tout avant l’envoi : on fera la correspondance.

Convention proposée :

```
public/assets/buildings/
  house/level-1.svg
  house/level-2.svg
  house/level-3.svg
  house/level-1-night.svg  (facultatif)
```

Types existants : house, tower, shop, mixedShop, supermarket, mall, office, townhall, fire, police, ambulance, hospital, coal, solar, quarry, sawmill, oil, farm, workshop, factory, largeFactory, school, park, stadium, football, tennis, gym.

Un niveau manquant garde son ancien dessin. Ne pas agrandir artificiellement le même SVG pour simuler une amélioration.

## Contrat graphique

- SVG autonome : conserver viewBox, couleurs et formes vectorielles ; pas de script, image externe, police distante ou fond opaque.
- Garder les marges nécessaires aux toits et ombres. Ne pas recadrer automatiquement : l’ancrage doit rester stable.
- Indiquer le losange du sol : centre X/Y, largeur et hauteur dans les unités du SVG. C’est le sol, pas la boîte du dessin entier, qui détermine l’échelle.
- Perspective actuelle : hauteur du losange = moitié de sa largeur.
- Un bâtiment occupe actuellement une seule case. Un dessin de parking ou grand bâtiment doit rester dans cette emprise, ou nécessitera une évolution de placement multi-case.
- Optionnel : variante nuit avec éclairage des fenêtres. En attendant, le moteur assombrit le SVG ; ce filtre provisoire n’allume pas les fenêtres.

## Enregistrement

`src/assets/manifest.js` centralise les chemins et les ancrages. Exemple uniquement, valeurs à mesurer sur le vrai fichier :

```js
house: {
  1: {
    src: '/assets/buildings/house/level-1.svg',
    nightSrc: '/assets/buildings/house/level-1-night.svg',
    viewBox: {width: 256, height: 256},
    ground: {centerX: 128, centerY: 192, width: 224, height: 112},
  },
},
```

Le renderer garde l’ordre de profondeur existant. Chargement à la demande, une image par URL, dessin actuel pendant le chargement ou en cas d’erreur. Le SVG est chargé comme image, jamais injecté comme HTML. Les fichiers de production seront contrôlés avant ajout.

## Page de contrôle

Après `npm run dev -- --port 3002 --force`, ouvrir :

http://localhost:3002/asset-lab.html

La page montre le quartier fourni en jour/nuit avec son emprise et son centre. Cette page est un outil de développement, pas un nouveau mode de jeu.

## Suite quand le dossier arrive

1. Inventorier et associer les fichiers aux 27 types et niveaux.
2. Vérifier les SVG, leur poids, leurs marges et les éventuelles dépendances externes.
3. Mesurer les ancrages et comparer les échelles sur la page de contrôle.
4. Brancher quelques bâtiments représentatifs : maison, commerce, usine, grand service.
5. Contrôler les chevauchements et la sélection au toucher avant de généraliser.
6. Vérifier jour/nuit, zoom, chargement lent, fichier absent et performances sur iPhone.

## Vérifications automatisées

`npm test` couvre l’ancrage et le redimensionnement, les variantes nuit, les niveaux absents, le cache, les erreurs et le nettoyage du renderer. `npm run build` contrôle la compilation. Ces vérifications ne remplacent pas une validation visuelle dans Safari sur iPhone.
