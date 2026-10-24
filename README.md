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

## Jouer

Choisir un bâtiment dans **Construire**, puis toucher une case libre. Toucher un bâtiment pour l’améliorer, ou une case + pour l’acheter. Les menus **Ville** et **Stocks** affichent les services, le budget et le marché. La liste des cases permet aussi de jouer au clavier.

L’interface utilise une palette zinc (blanc, noir, gris). Seules la carte et les alertes rouges utilisent de la couleur. Aucun emoji : les services, ressources, boutons et bâtiments utilisent les mêmes icônes SVG Lucide. Elles sont servies depuis l’application, sans CDN. Les couleurs destructrices restent disponibles dans les variantes shadcn/ui et servent aux erreurs et aux déficits. Il n’y a pas encore d’action de suppression de bâtiment.

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

**La connexion Google et la sauvegarde Supabase ne sont pas encore intégrées.** La migration SQL de départ figure dans `supabase/001_saves.sql`. Le jeu reste une simulation cliente, sans autorité serveur.

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
