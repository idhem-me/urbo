# Urbo

Jeu de gestion de ville pour mobile. React, Vite, Tailwind CSS, composants shadcn/ui et icônes Lucide intégrées au bundle.

## Ouvrir dans Cursor

Installer Node.js LTS 24 (ou au moins 22.12), puis ouvrir le dossier du projet.

```sh
npm install
npm run dev
```

Ouvrir **http://localhost:3000**.

Après une mise à jour du dépôt :

```sh
 git pull
 npm install
 npm run dev
```

## Tester sur iPhone

1. Connecter ordinateur et iPhone au même Wi-Fi.
2. Garder `npm run dev` ouvert sur l’ordinateur.
3. Dans Safari, ouvrir l’adresse **Network** affichée par Vite, par exemple `http://192.168.1.20:3000`.

Vite écoute sur le réseau local, port 3000. Si le réseau d’entreprise isole les appareils ou si le pare-feu bloque la connexion, utiliser le site Vercel. Sur le téléphone, `localhost` désigne le téléphone, pas l’ordinateur.

## Interface mobile (v0.6)

La carte remplit l’écran. Budget, habitants et solde/min apparaissent dans trois badges avec icônes, en haut à gauche. Quatre jauges indiquent la demande en logements, industrie, bureaux et services. Elles vont de 0 à 100 et suivent les besoins actuels ; ce ne sont pas des prévisions garanties.

Les boutons du bas ouvrent Construire, Ville et Stocks. Chaque panneau s’ouvre depuis le bas, avec une croix pour fermer et une zone de contenu défilante verticalement. Les neuf catégories de construction sont en grille, sans défilement horizontal. Choisir un bâtiment ferme le panneau pour le placer sur la carte. Le bouton X à côté du nom annule le placement.

Touchez un bâtiment pour l’améliorer ou le détruire. La destruction demande une confirmation, ne rembourse rien et garde le terrain acquis. Elle est bloquée pendant une amélioration. Déplacer le doigt fait glisser la carte ; pincer permet de zoomer.

## Monnaie et stocks

La base monétaire est l’euro, pas une pièce fictive. Les compteurs utilisent **k€** (milliers d’euros) et **M€** (millions d’euros) ; les prix d’achat et les transactions affichent les montants exacts en **€**. Exemple : maison de base à 80 000 €, première extension à 50 000 €. Le budget initial est de 1 200 000 €.

Les matières, le pétrole et l’alimentation sont en **tonnes (t)**. Les productions et consommations sont en **t/min**. Le marché échange par lots de **100 t** ; le bois coûte 300 €/t à l’achat et 180 €/t à la vente. La différence entre achat et vente empêche un aller-retour rentable.

Les sauvegardes précédentes sont converties une seule fois : un ancien point de monnaie vaut 1 000 €, une ancienne unité de stock vaut 10 t. Leurs bâtiments, projets et terrains sont conservés. Le jeu est accéléré ; les quantités et les prix servent l’équilibrage et ne reproduisent pas un marché réel.

## Jouer

Choisir un bâtiment dans **Construire**, puis toucher une case libre. Toucher un bâtiment pour l’améliorer, ou une case + pour l’acheter. Les menus **Ville** et **Stocks** affichent les services, le budget et le marché. La carte est utilisable au clavier : flèches pour choisir une case, Entrée pour agir.

L’interface utilise une palette zinc (blanc, noir, gris). La carte et les indicateurs sémantiques utilisent de la couleur : vert (OK), orange (À surveiller), rouge (Critique). Aucun emoji : les services, ressources, boutons et bâtiments utilisent les mêmes icônes SVG Lucide. Elles sont servies depuis l’application, sans CDN. Les couleurs destructrices restent disponibles dans les variantes shadcn/ui et servent aux erreurs et aux déficits. Il n’y a pas encore d’action de suppression de bâtiment.

## Contenu du prototype

27 bâtiments améliorables jusqu’au niveau 3, 9 catégories, 16 cases acquises au départ sur 81 constructibles. Logements, mairie, pompiers, police, ambulances, hôpital, charbon, solaire, ressources, ateliers, usines, écoles, bureaux, sports et commerces avec logements ou parking.

Le moteur gère emploi, formation, énergie, attractivité, impôts, entretien, ressources et chantiers simultanés. Les bâtiments avancés se débloquent selon la population. Les améliorations exigent de bonnes conditions et coûtent davantage. Les achats de terrain doivent être voisins du territoire et leur prix augmente de 12 % par acquisition. Les capacités et coûts sont expliqués dans `docs/PROGRESSION.md` et `docs/SYSTEMES.md`.

## Vercel

Importer le dépôt GitHub dans Vercel. Configuration fournie dans `vercel.json` :

- Framework : **Vite**.
- Build : `npm run build`.
- Sortie : **dist**.

Si le projet Vercel utilisait auparavant `public` comme dossier de sortie, retirer ce réglage ou le remplacer par `dist` dans les paramètres du projet. Aucun secret requis pour cette version.

## Sauvegarde et comptes

Sauvegarde locale automatique et export JSON ; reprise limitée à huit heures. Les anciennes parties sont migrées. Effacer les données du navigateur supprime la partie. L’import JSON reste à réaliser.

**La connexion Google est disponible après configuration Supabase. La sauvegarde cloud n’est pas encore intégrée.** La migration SQL de départ figure dans `supabase/001_saves.sql`. Le jeu reste une simulation cliente, sans autorité serveur.

## Organisation

- `src/App.jsx` : interface React.
- `src/components/ui/` : composants shadcn/ui adaptés, source locale.
- `src/style.css` : thème neutre et styles.
- `src/icons.js` : icônes Lucide, SVG et rendu Canvas.
- `src/game.js` : interactions et rendu de la ville.
- `src/engine.js` : règles économiques et sauvegarde.

## Vérifier

```sh
npm test
npm run build
```

Le rendu sur iPhone et Android reste à vérifier sur appareil réel. Les services ont une couverture globale, sans trajet ni intervention animée. La population se rééquilibre immédiatement. Il n’y a pas encore de démolition, remboursement, réseau routier modifiable ou synchronisation entre appareils.

## Tokens d’état

Les tokens `success`, `warning` et `danger` sont partagés par le CSS, Tailwind et les composants shadcn/ui. Les seuils sont centralisés dans `src/status.js`. Les boutons destructifs restent rouges via un alias de `danger`. Voir `docs/DESIGN_TOKENS.md`.

## Version 0.7 : catalogue, finances et réglages

Tous les panneaux du bas occupent 85 % de la hauteur, sans fond assombri. Le panneau Réglages s’ouvre sur le côté à droite. Les catégories sont en grille, les informations des bâtiments sont dans leur bouton (i), utilisable au toucher. Les prix du catalogue sont en k€, M€ et Md€. Les pastels distinguent logements (vert), commerce (bleu), bureaux (violet), industrie (jaune) et services (rose). La boutique avec logements apparaît dans Logements et Commerce sans créer deux bâtiments différents.

Le budget peut devenir négatif. Aucune construction ou amélioration n’est possible sous zéro. Dans Ville, la Banque propose des prêts avec remboursement automatique et remboursement anticipé ; elle peut refuser si les recettes ne couvrent pas les échéances avec une marge de 20 %. Dépasser le découvert autorisé termine la partie. Le bouton Recommencer crée une nouvelle ville. Les impôts sont séparés pour les logements, commerces et bureaux ; le budget des services modifie leurs dépenses et leur capacité. Voir `docs/BANQUE.md`.

Le nom de ville se change dans Ville et reste dans la sauvegarde. Dans Réglages : thème Système/Clair/Sombre, export JSON et compte Google. L’aide est à côté du solde/min. Le thème est conservé sur cet appareil et s’applique avant le premier affichage.

### Activer Google

1. Copier `.env.example` vers `.env.local`.
2. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` avec l’URL du projet et sa clé publique.
3. Dans Supabase Auth, activer Google avec les identifiants OAuth Google, et autoriser l’adresse de retour de l’application (localhost ou Vercel).
4. Redémarrer `npm run dev`. Sur Vercel, ajouter les mêmes variables dans les paramètres du projet puis redéployer.

Sans ces variables, le bouton Google est désactivé avec un message de configuration ; aucune fausse connexion n’est simulée. Une fois connecté, le compte et le bouton Déconnexion remplacent le bouton Google. Ne jamais mettre le secret Google ou une clé service_role dans les variables VITE_ : elles sont publiques. L’export et la partie restent locaux ; connecter Google ne synchronise pas encore la ville entre appareils.

## Version 0.8 : nuit et départ guidé

Le thème sombre transforme aussi la carte : eau sombre, terrain et bâtiments nocturnes, fenêtres éclairées. La carte se met à jour immédiatement lors du changement de thème, sans rechargement ni changement économique.

Dans Réglages, **Recommencer à zéro** ouvre une confirmation avant de remplacer la ville par une nouvelle partie. Le compte Google et le thème restent conservés. L’annulation laisse la partie intacte.

Les nouvelles villes commencent avec sept objectifs : deux maisons, solaire, ferme, épicerie, premiers bénéfices et amélioration d’une maison. Un bouton choisit l’action suivante ; une case en pointillés montre où construire. Les prix sont visibles avant placement. Les chantiers guidés prennent 3 secondes, les améliorations guidées 4 secondes, dans la limite des huit premiers projets. Chaque objectif terminé verse une prime unique ; les revenus réels restent calculés par l’économie.

Le guide peut être passé. Après sa fin, les durées et conditions habituelles reviennent. Les villes existantes ne sont ni effacées ni placées de force dans le scénario ; pour tester le nouveau départ, utiliser Réglages → Recommencer à zéro. Voir `docs/DEMARRAGE.md`.
