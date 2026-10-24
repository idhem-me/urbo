# État actuel

Le prototype est maintenant en v0.4 : voir aussi `PROGRESSION.md` pour les paliers, conditions et parcelles ; voir `SYSTEMES.md` et le README pour le périmètre actuel (27 bâtiments, ressources et chantiers). Le cadrage ci-dessous conserve les étapes précédentes ; les chiffres initiaux et les fonctionnalités marquées « à ajouter » peuvent être dépassés.

# Plan de production

## Concept proposé

Rivage : transformer une baie en petite ville vivante. Session de 2 à 5 minutes. Boucle : construire, accueillir, percevoir, réinvestir. Aucun achat réel ni système compétitif dans la première version. Le thème côtier et les noms sont des propositions à valider.

## Livré au prototype

Carte de 7 × 7 cases avec deux routes fixes. 36 parcelles constructibles. Quatre constructions. Trésorerie initiale : 400 pièces. Ville initiale : une maison, une épicerie et un parc. Depuis la v0.2, les revenus initiaux dépendent de l’emploi et de la fiscalité ; le budget détaille les recettes et les charges. Construction instantanée pour évaluer la boucle sans temps d'attente artificiel.

## Prochaine étape : confort et progression

- Tester le prototype sur Safari iPhone et Chrome Android, particulièrement la sélection des cases et les petites tailles d'écran.
- Livré en v0.2 : sélection, panneau de détails et amélioration jusqu’au niveau 3. Reste à définir : démolition et remboursement.
- Ajouter trois objectifs guidés et des déblocages au fil de la population.
- Remplacer le simple zoom par un déplacement de caméra et un pincement si les essais le justifient.
- Importer un export JSON avec validation, confirmation de remplacement et gestion des erreurs.
- Installer une PWA : manifeste, icônes et cache versionné.

## Comptes Google et cloud

1. Créer le projet Supabase et appliquer la migration SQL fournie.
2. Créer un client OAuth Google, configurer son écran de consentement et autoriser l'URL de callback fournie par Supabase.
3. Activer Google dans Supabase Auth. Déclarer les URL locale et Vercel autorisées au retour de connexion.
4. Ajouter le SDK Supabase et exposer uniquement l'URL du projet et sa clé publique publishable ; conserver toute clé service_role côté serveur.
5. Au premier login, proposer l'association de la ville locale ; si une sauvegarde cloud existe déjà, présenter les deux avant de remplacer quoi que ce soit.
6. Utiliser une révision pour détecter les écritures concurrentes entre appareils. Afficher les états synchronisation/en attente/échec et conserver une copie locale.
7. Tester l'isolation entre deux comptes, la reconnexion, une coupure réseau et les conflits de deux appareils.

## Visuels

Base actuelle : formes vectorielles réutilisables (toit sauge, façades crème, commerce terre cuite). À produire après validation du style : maison niveaux 1–3, commerce niveaux 1–3, parc, mairie, arbres, routes, littoral et icônes de ressources. Pour chaque asset : même projection isométrique, lumière haut gauche, silhouette lisible sur téléphone, fond transparent, point d'ancrage au centre de la parcelle. Garder les fichiers sources et un inventaire des assets. Les animations de chantier et de collecte viendront après validation de la lisibilité.

## Architecture suivante

Conserver les règles pures de `engine.js` et leurs tests. Si les écrans se multiplient, migrer l'interface vers Next.js/TypeScript, garder Canvas pour la ville et utiliser Supabase pour l'identité et les sauvegardes. Vercel héberge l'application. Phaser reste optionnel, à décider selon les besoins d'animation et de caméra.

## Critères pour une première version partageable

Jouer dix minutes sans blocage, comprendre comment construire sans aide orale, retrouver sa ville après fermeture, retrouver la bonne sauvegarde sur deux appareils et ne jamais pouvoir lire la sauvegarde d'un autre compte. Prévoir les mentions de confidentialité et la suppression du compte avant une ouverture publique avec collecte de données.

## Ajouts réalisés en v0.2

Marché de l’emploi (actifs, emplois pourvus, postes offerts, chômage), attractivité (parcs, densité, fiscalité), occupation des logements, commerce dépendant du personnel et des clients, entretien et déficit, trois politiques fiscales. Amélioration des quatre types de bâtiments jusqu’au niveau 3, panneau avant achat, niveaux visibles, migration des sauvegardes v1.

À équilibrer ensuite par des parties sur téléphone : délais d’arrivée des habitants, besoins de services, éventuelles entreprises supplémentaires et coût d’amélioration. Éviter de présenter le score d’attractivité comme une simulation urbaine réaliste.
