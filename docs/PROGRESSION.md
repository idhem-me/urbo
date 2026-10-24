# Progression et agrandissement — v0.4

Objectif : décisions fréquentes au départ, puis progression plus lente qui demande une économie et des services cohérents. Les revenus ne croissent pas exponentiellement sans limite ; ce sont les dépenses répétées et foncières qui suivent une courbe géométrique. C’est un premier réglage à tester en jeu, pas un équilibrage définitif.

## Démarrage et paliers

1 200 pièces, 100 bois, 100 pierre et stocks initiaux. Les bâtiments essentiels sont accessibles immédiatement : maisons, alimentation, matières, énergies, ateliers, secours de base et mairie. Cela permet de remettre à niveau une ville en difficulté sans condition préalable de services.

Déblocages permanents selon le record d’habitants :

| Record | Nouveautés |
| --- | --- |
| 12 | Résidence, boutique avec logements, école |
| 30 | Bureaux, supermarché, petite usine, hôpital |
| 45 | Pétrole |
| 60 | Stade |
| 80 | Grande usine |
| 100 | Centre commercial |

Les noms des paliers sont fondations (0), village (12), bourg (30), ville (60) et métropole (100). Perdre de la population ne retire pas un type déjà débloqué, mais empêche une amélioration dont les conditions actuelles ne sont plus réunies.

## Conditions d’amélioration

Niveau 2 : au moins 12 habitants actuels, attractivité de 50, nourriture en stock et 40 % des besoins électriques couverts.

Niveau 3 : les conditions précédentes, au moins 45 habitants actuels, attractivité de 65, énergie à 80 %, administration à 50 %, pompiers et police à 40 %, hôpital à 30 %, chômage au plus à 35 %.

Les conditions sont contrôlées au lancement du chantier. Leur dégradation ultérieure ne détruit pas les investissements et n’annule pas le chantier. Elles sont vérifiées par le moteur, même si une action contourne les boutons de l’interface.

## Courbes de coût et de durée

Nouvelle construction : coût de base × 1,14 puissance le nombre d’exemplaires du même type déjà construits ou en chantier. Un chantier d’amélioration ne compte pas comme un exemplaire supplémentaire.

Amélioration au niveau N : coût de base × 1,8 puissance (N − 1). Bois et pierre suivent le même multiplicateur, avec arrondi supérieur. Les coûts affichés dans le catalogue et l’inspecteur sont ceux débités par le moteur.

Hors guide de démarrage (voir DEMARRAGE.md), durée : 15 secondes de base pour les premiers équipements, 45 secondes pour les types débloqués entre 30 et 79 habitants, 90 secondes pour ceux débloqués à 80 et plus. Multiplier par le carré du niveau cible : une amélioration de maison prend 60 puis 135 secondes, contre 360 puis 810 secondes pour un centre commercial.

Les capacités augmentent linéairement avec le niveau N. L’entretien devient entretien de base × N × 1,35 puissance (N − 1), arrondi supérieur. Une amélioration apporte plus de capacité par parcelle mais demande plus de services et de recettes pour rester rentable.

## Parcelles

16 parcelles initiales autour du premier village. La carte contient 81 parcelles constructibles et des routes fixes. Une acquisition doit toucher une parcelle déjà possédée dans une direction cardinale. Une route d’une case peut être franchie pour déterminer le voisinage. Les diagonales ne suffisent pas.

Prix : arrondi supérieur de 50 × 1,12 puissance le nombre de parcelles possédées au-delà des 16 initiales. Exemples de prix de la prochaine parcelle :

| Extensions déjà acquises | Prix suivant |
| --- | --- |
| 0 | 50 |
| 5 | 89 |
| 10 | 156 |
| 20 | 483 |
| 40 | 4 653 |
| 60 | 44 880 |

Le prix de référence reste le nombre de parcelles possédées ; il n’y a ni vente de terrain ni remboursement. La migration accorde les cases des bâtiments et projets anciens sans les déplacer, même s’ils sont éloignés du village initial. Une partie migrée peut donc avoir une forme discontinue.

## Vérification et limites

Les scénarios automatisés vérifient propriété, voisinage, coûts croissants, refus sans débit, conditions d’amélioration, déblocages permanents, sauvegarde et migration.

Une simulation dirigée sans argent ajouté a construit deux maisons et une centrale solaire dans la première minute, atteint environ 25 habitants vers deux minutes, 39 vers dix-huit minutes, puis 59 vers trente-trois minutes. Avec les achats de ressources et services de ce scénario, l’hôpital a été achevé vers quarante-neuf minutes. Ces durées sont une illustration du chemin testé, pas des objectifs garantis pour tous les joueurs. La simulation avance instantanément les délais ; elle ne remplace pas un essai d’ergonomie sur téléphone.

Il reste à tester des stratégies variées et la reprise après de longues absences. La population et la formation se rééquilibrent encore instantanément. La couverture des secours reste globale. La carte est limitée à 81 parcelles ; les extensions au-delà de cette carte ne sont pas encore prévues.
