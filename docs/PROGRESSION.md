# Progression alignée sur les 61 assets — v0.15

## Catalogue

Les 27 types de bâtiments existants sont tous couverts : aucun type à ajouter ou à retirer. Les 3 fichiers supplémentaires sont des décors (chantier, désert, forêt), pas des bâtiments achetables.

- 3 niveaux : maison, résidence, boutique avec logements, bureaux.
- 2 niveaux : les 23 autres types.
- Total : 58 niveaux graphiques jouables + 3 décors = 61 SVG. La forêt reste disponible dans le pack mais n’est pas dessinée sur les cases vides.

Les plafonds sont contrôlés dans le moteur, l’inspecteur et les tests de correspondance avec les assets. Pas d’amélioration facturée sans visuel distinct.

## Équilibrage des améliorations

| Règle | Types à 3 niveaux | Types à 2 niveaux |
| --- | --- | --- |
| Capacités / production / consommation | ×1, ×2, ×3 | ×1, ×3 |
| Entretien | ×1, ×2,7, ×5,4675 | ×1, ×2,7 |
| Prix de l’amélioration | Base ×1,8 puis ×3,24 | Base ×2,4 |
| Durée hors guide | Base ×4 puis ×9 | Base ×5 |

Les emplois, besoins électriques, pollution, couverture, formation, attrait et places de chantier suivent le multiplicateur de capacité. Ainsi, une amélioration industrielle demande aussi plus de personnel et de ressources ; la hausse de production n’est pas gratuite.

L’atelier donne 1 place de chantier au niveau 1 et 3 au niveau 2, en plus de la place initiale de la ville.

Les prix et matériaux sont arrondis au palier entier prévu par le moteur. Le prix affiché est celui débité. La première construction de chaque type garde son prix et son délai ; chaque exemplaire supplémentaire coûte ×1,14 par exemplaire existant ou en chantier. L’expansion commence à 50 k€. Les 32 premiers achats gardent une hausse de 12 % par achat ; les suivants progressent de 0,8 % pour rendre le plateau de 576 cases exploitable à long terme (dernières cases autour de 125 M€, au lieu d’extrapoler la courbe courte sur 560 achats).

## Conditions

Les déblocages de base sont inchangés, selon le record d’habitants : résidence / mixte / école à 12, bureaux / supermarché / petite usine / hôpital à 30, pétrole à 45, stade à 60, grande usine à 80, centre commercial à 100.

Toute amélioration exige au moins 12 habitants actuels, attrait 50, nourriture disponible et énergie 40 %.

Le niveau final des types à 2 niveaux exige au moins 30 habitants, attrait 55 et énergie 60 %.

Le niveau 3 des 4 types concernés exige au moins 45 habitants, attrait 65, énergie 80 %, administration 50 %, pompiers et police 40 %, hôpital 30 %, chômage au plus 35 %.

Les conditions s’appliquent au lancement : un chantier déjà accepté n’est pas annulé si la situation se dégrade.

Le guide reste rapide : premiers chantiers en 3 secondes, première amélioration de maison en 4 secondes et primes uniques. Les règles de prêt, impôts, découvert, faillite et stocks restent actives.

## Migration des sauvegardes (schémas 8/9 vers 10)

- Aucun bâtiment, terrain, prêt, nom de ville ou compte supprimé.
- Les anciens niveaux 3 des types limités à 2 deviennent des niveaux 2 ; leur capacité finale reste identique.
- Pour une amélioration 3 déjà terminée : remboursement de la différence entre les anciens prix cumulés des améliorations 2 et 3, et le nouveau prix de l’amélioration 2. Argent, bois et pierre sont recrédités avec les mêmes arrondis que lors des achats.
- Pour un chantier de niveau 3 supprimé encore enregistré : annulation et remboursement complet de son prix historique en argent et matériaux. Les autres chantiers restent en place.
- Les anciens niveaux 2 bénéficient de la nouvelle capacité sans frais rétroactifs et sans hausse de leur entretien.
- Le numéro de schéma empêche un double remboursement au rechargement ou à la synchronisation de la sauvegarde migrée.
- Une partie déjà terminée pour faillite reste terminée.

## Validation et limites

Tests : plafonds des 27 types, correspondance exacte des 58 niveaux aux SVG, refus sans débit, coûts et capacités, migration et remboursements idempotents, chantiers anciens, ville avec services et économie positive simulée sur 10 minutes, démarrage guidé, fiscalité, prêts et faillite. Les tests fournissent des garanties sur ces scénarios ; l’équilibrage de stratégies longues et variées reste à éprouver en jeu.

## Plateau centré

Le plateau contient désormais 24 × 24 = 576 cases, toutes constructibles après achat. Les 16 cases de départ forment un carré de 4 × 4 au centre. Les bandes routières non constructibles et le petit décor beige de la carte ont été retirés. Toutes les cases libres sont rendues avec le terrain vague, les cases non acquises sont atténuées et les cases achetables affichent un +.

À l’ouverture d’une ancienne ville, tout le territoire est translaté vers le centre, en conservant les positions relatives des bâtiments, terrains et chantiers, les horaires, l’argent et les stocks. La translation s’applique une seule fois. Le prix d’extension reste fondé sur le nombre de cases possédées, sans frais de migration.
