# Banque et finances — v0.7

La monnaie est l’euro. Le budget peut passer sous zéro ; les constructions et améliorations sont alors bloquées par le moteur et par l’interface. Les terrains ne sont jamais remboursés automatiquement. Les ajustements d’impôts et de dépenses restent disponibles tant que la ville n’est pas en faillite.

## Règles par avancement

Le niveau bancaire utilise le record de population : perdre des habitants ne retire pas brutalement une autorisation de crédit.

| Record d’habitants | Plafond de dette | Découvert / plafond | Découvert maximum | Intérêt / minute de jeu |
| --- | --- | --- | --- | --- |
| 0 | 100 k€ | 50 % | 50 k€ | 1,5 % |
| 12 | 300 k€ | 60 % | 180 k€ | 1,2 % |
| 30 | 800 k€ | 70 % | 560 k€ | 1 % |
| 60 | 2 M€ | 80 % | 1,6 M€ | 0,8 % |
| 100 | 5 M€ | 100 % | 5 M€ | 0,6 % |

Ce sont des paramètres d’un jeu accéléré, pas des taux annuels ni des conditions de crédit réelles.

## Acceptation et remboursement

Chaque prêt se rembourse sur 30 minutes de jeu. Son taux est fixé à la signature et s’applique au capital restant. La banque vérifie le plafond et exige des recettes nettes avant banque au moins égales à 120 % des échéances cumulées (capital + intérêts), nouveau prêt compris. Une ville déficitaire peut emprunter si ses recettes courantes permettent de rembourser. Les offres indiquent la raison d’un refus.

L’argent accepté est immédiatement crédité au budget. Capital et intérêts sont prélevés automatiquement, y compris pendant la progression hors ligne. Le calcul s’arrête aux échéances pour ne pas facturer un prêt déjà remboursé. Le remboursement anticipé est possible dans la limite de l’argent disponible et du capital dû, sans intérêts futurs ni frais supplémentaires.

À zéro ou en déficit léger, la partie continue. Si le budget atteint le découvert négatif maximum, elle se termine : ressources, bâtiments et prêts sont figés ; aucune transaction n’est autorisée. Le panneau de faillite ne se ferme pas par Échap ou par clic extérieur. Recommencer réinitialise la ville et la sauvegarde de la partie, en conservant les préférences de thème et la session Google.

## Fiscalité et services

- Logements : impôt résidentiel bas (1 000 €/hab/min), moyen (2 000), haut (3 000). Un niveau bas ajoute de l’attrait ; un niveau haut le réduit. Les effets portent aussi sur la demande résidentielle.
- Commerces et bureaux : faible/moyen/haut multiplient leur contribution par 0,65 / 1 / 1,35 et leur demande/activité par 1,15 / 1 / 0,75. Une hausse peut donc rapporter davantage par activité, tout en réduisant la demande. Les recettes affichées incluent cet arbitrage.
- Services : budget réduit = coût ×0,6 et capacité ×0,65 ; normal = ×1 ; renforcé = coût ×1,4 et capacité ×1,35. La mairie, les secours, l’école et les loisirs sont concernés. Les bureaux privés et les centrales ne dépendent pas de ce budget.

Les cinq indicateurs sont logements, commerces, industrie, bureaux et services. Le titre visuel « Demande » est retiré ; les descriptions accessibles restent présentes.

## Sauvegardes

Les anciennes parties sont migrées avec zéro prêt et un budget de services normal. L’ancien choix d’impôts initialise les trois catégories. Les sauvegardes financières stockent prêts, intérêts contractuels, capital restant et éventuelle faillite. Le nom de ville est ajouté sans effacer la partie. Les crédits sont simulés dans le navigateur ; aucune banque réelle n’est appelée.
