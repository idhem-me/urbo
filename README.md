# Rivage — prototype 0.4

Jeu mobile de construction de ville, portable vers Vercel. Ouvrir ce dossier dans Cursor avec Node.js 20+, puis :

```sh
npm run dev
```

Ouvrir http://localhost:3000. Aucune dépendance à installer. Choisir une catégorie puis un bâtiment, toucher une parcelle libre pour démarrer le chantier. Toucher un bâtiment existant pour voir ses effets et lancer une amélioration. La liste des parcelles propose aussi ces actions au clavier.

## Contenu

27 bâtiments, 9 catégories, 16 parcelles acquises au départ sur 81 achetables. Les extensions doivent être voisines du territoire, avec un prix qui augmente de 12 % par acquisition. Chaque bâtiment est améliorable sur trois niveaux, avec coût en pièces, bois et pierre. Construction de base : 15 secondes ; améliorations de base : 60 puis 135 secondes. Les grands équipements prennent de 45 à 90 secondes au niveau 1 et davantage aux niveaux suivants. Un chantier simultané initialement, plus un par niveau d’atelier artisanal terminé. Pendant l’amélioration, le bâtiment reste actif à son ancien niveau.

- Logements : maison, résidence.
- Administration : mairie, collecte fiscale et tableau des besoins.
- Secours : pompiers, police, poste ambulancier, hôpital.
- Énergie : centrale à charbon (combustible nécessaire), solaire.
- Ressources : carrière (pierre et charbon), scierie, pétrole, agriculture.
- Industrie : atelier artisanal, petite usine, grande usine.
- Éducation : école, bureaux avec emplois qualifiés ; l’hôpital demande aussi du personnel qualifié.
- Loisirs : parc, stade, football, tennis, salle de sport.
- Commerce : épicerie, boutique avec logements, supermarché avec parking, centre commercial avec parking.

Bois, pierre, charbon, pétrole, alimentation et marchandises sont stockés. Le marché permet d’acheter ou vendre par lots de 10. Les usines consomment des matières et produisent des marchandises vendables. Une pénurie interrompt la production concernée. Tous les bâtiments ont un entretien. Les logements et activités génèrent impôts et recettes selon les règles décrites dans `docs/SYSTEMES.md`.

## Sauvegarde et vérification

Sauvegarde locale automatique, export JSON, reprise limitée à huit heures. Les sauvegardes v1/v2/v3 sont migrées sans supprimer la ville, avec un stock de départ pour les nouvelles mécaniques. Effacer les données du navigateur efface la partie. L’import JSON n’est pas encore disponible.

```sh
npm test
npm run build
```

Les tests couvrent catalogue, chantiers, trois niveaux pour chaque type, ressources, énergie, emplois qualifiés, couverture des services, budget et migration. Le rendu et l’ergonomie restent à tester sur iPhone/Android.

## Vercel et comptes

Importer le dossier dans GitHub puis dans Vercel. Framework « Other », build `npm run build`, sortie `public` ; `vercel.json` fournit ces réglages. Aucun secret requis dans cette version. Aucun déploiement n’a été effectué.

La connexion Google et la sauvegarde cloud restent à brancher. Un premier schéma Supabase figure dans `supabase/001_saves.sql`. Le jeu utilise actuellement une interface statique et Canvas sans dépendances ; les règles sont séparées dans `public/engine.js` pour permettre une évolution vers Next.js.

## Limites du prototype

Les services ont une couverture globale, sans véhicules, trajets, incidents ni rayon géographique. Population, formation et emploi se rééquilibrent immédiatement. Énergie et pollution sont calculées à l’échelle de la ville. Pas de conduite électrique, réseau routier modifiable, salaire individuel, dette, démolition ou remboursement. Les bâtiments occupent tous une parcelle ; les parkings sont intégrés au visuel des commerces. Les visuels sont des formes vectorielles provisoires. L’économie locale est modifiable par le joueur, sans autorité serveur.

## Progression et territoire (v0.4)

Début rapide grâce à 1 200 pièces et un stock de ressources. Paliers à 12, 30, 60 et 100 habitants (record conservé). Les grands bâtiments se débloquent progressivement ; les niveaux 2 et 3 exigent des conditions actuelles de ville, affichées dans le panneau d’amélioration. Répéter le même bâtiment coûte de plus en plus cher, tandis que les niveaux supérieurs augmentent les charges plus vite que les capacités.

Touchez une case grise marquée + pour afficher son prix, puis confirmez avec « Acheter cette parcelle ». L’achat ne lance aucune construction. Les routes fixes sont traversables pour déterminer le voisinage. Le prix initial est de 50 pièces, multiplié par 1,12 à chaque extension, arrondi à l’entier supérieur. Aucune expansion automatique.

Les sauvegardes précédentes gardent tous leurs bâtiments et leurs chantiers : leurs parcelles sont acquises gratuitement pendant la migration. Aucun revenu hors ligne n’est recalculé rétroactivement sous les nouvelles règles. Voir `docs/PROGRESSION.md` pour les formules et les limites de l’équilibrage.
