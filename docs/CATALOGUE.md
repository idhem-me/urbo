# Catalogue et familles

Le panneau Construire a une hauteur fixe de 85 % du viewport, quelle que soit la catégorie. Le contenu commence en haut ; seule la zone de contenu défile verticalement. Les catégories restent en grille sans défilement horizontal.

Chaque tuile contient le nom, ses familles, deux effets principaux, le prix compact, le bois et la pierre nécessaires et la durée. Son bouton (i) ouvre une information détaillée indépendante de la sélection : toucher (i) ne lance pas le placement. Le tooltip se ferme par un second clic, un clic extérieur ou Échap. Il fonctionne aussi au survol et au focus clavier. Un affichage intégré est prévu si le navigateur ne prend pas en charge Popover.

Les cinq familles ont des tokens séparés des états success/warning/danger : `--family-residential-*`, `--family-commerce-*`, `--family-office-*`, `--family-industry-*`, `--family-services-*`, avec les suffixes background, border et text. Les variantes sombres sont également définies.

La boutique avec logements appartient à Logements et Commerce, mais garde un seul identifiant de type et une seule logique économique. Elle porte les deux étiquettes de famille. La liste de cases et le panneau global de détails sont retirés ; la carte conserve un accès clavier (flèches + Entrée).

Les prix du catalogue utilisent k€, M€ et Md€ ; les arrondis sont promus à l’unité suivante pour éviter d’afficher 1 000 k€ ou 1 000 M€. Le tooltip conserve le prix exact en euros. Les montants stockés restent des euros.

## Regroupement et recherche — v0.10

Les cinq groupes visibles sont Résidence, Commerce, Industrie, Bureaux et Services. Ils ne modifient pas les types ni les règles économiques historiques du moteur. Énergie, ressources et production sont regroupées dans Industrie ; les écoles et les loisirs sont dans Services. Les bureaux ont leur propre groupe. L’union des groupes couvre tous les bâtiments, avec la boutique mixte dans deux groupes.

La recherche démarre sur tout le catalogue, puis un clic de catégorie la restreint à ce groupe. Les mots peuvent être saisis dans un ordre différent et sans accents. Un résultat vide affiche une explication. La sélection de ville et les actions du guide remettent la recherche dans un état cohérent.

Le panneau conserve sa hauteur fixe de 85 %. Recherche et catégories sont regroupées dans une zone collante en haut du contenu. Le bouton d’information reste distinct du bouton de placement.
