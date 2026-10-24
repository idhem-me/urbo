# Quartiers SVG — pack de 61 assets

## Décision de fonctionnement

Une case représente un quartier, conformément au choix utilisateur. Les bâtiments et leurs niveaux gardent leurs règles de gestion actuelles : les nombres de maisons dessinées dans le SVG ne recalculent pas les emplois ou les habitants. Les sauvegardes existantes restent compatibles.

## Pack intégré

- 58 variantes réparties sur les 27 types de bâtiments.
- 3 décors : chantier, désert et forêt.
- 61 SVG originaux, sans modification des dessins, accompagnés de leurs JSON.
- Poids total des SVG : 3 354 182 octets (environ 3,35 Mo), chargés à la demande.
- Pas de variantes nuit : assombrissement provisoire par le moteur.
- 4 types disposent de 3 niveaux : maison, résidence, boutique avec logements, bureaux.
- Les 23 autres ont 2 niveaux : au niveau de gestion 3, on conserve le visuel 2 et on affiche le badge 3. Aucun niveau graphique supplémentaire n’a été inventé.

Les mentions de validation dans les fichiers fournis sont des métadonnées du pack, pas des instructions au moteur.

## Organisation

```
public/assets/districts/<type>/level-<niveau>.svg
public/assets/districts/<type>/level-<niveau>.json
src/assets/districts.js       # inventaire généré
src/assets/manifest.js        # résolution type / niveau / décor
src/assets/renderer.js        # chargement et dessin
scripts/import-districts.py  # import reproductible du ZIP fourni
```

Pour réimporter ce pack : `python scripts/import-districts.py /chemin/assets-ville-61.zip`.
L’import contrôle l’archive et tous les SVG avant d’écrire : noms, doublons, tailles, SVG autonome, absence de scripts ou ressources externes. Le SVG est utilisé comme image, jamais injecté comme HTML.

## Ancrage

Tous les sols ont le même losange : centre (512, 288), largeur 896, hauteur 448. Les viewBox diffèrent : certains commencent à Y = −80, −100, −120 ou −300. Le renderer tient compte de cet offset pour conserver les hauts bâtiments et leur ancrage. Il ne recadre pas les SVG.

Les routes actuelles de la carte sont conservées ; les routes internes aux quartiers appartiennent aux illustrations. Elles ne créent pas encore un réseau routier simulé. Le zoom permet de voir les détails des quartiers.

## Catalogue de contrôle

`http://localhost:3002/asset-lab.html` après lancement du projet sur le port 3002.
La page affiche les 61 fichiers, avec recherche et mode nuit. Elle est aussi incluse dans le build de production.

## Vérification

`npm test` : sécurité des SVG, fichiers présents, couverture de tous les types et niveaux, cache, erreurs de chargement, ancrages et marges hautes. `npm run build` : application et catalogue compilés. Une simulation DOM vérifie les parcours principaux du jeu avec les assets chargés. Les planches de rendu permettent le contrôle visuel. Les performances et le rendu Safari sur iPhone restent à vérifier sur appareil.
