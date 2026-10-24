# Départ guidé et nuit — v0.8

## Objectifs

Le village conserve son point de départ : une maison, une épicerie et un parc. Le guide fait placer deux maisons supplémentaires, puis un équipement solaire, une ferme et une seconde épicerie. Il explique les habitants, les impôts, l’énergie, l’alimentation, les emplois et les recettes avant de demander une amélioration.

| Étape | Action attendue | Prime |
| --- | --- | --- |
| 1 | Atteindre 2 maisons | 25 k€ |
| 2 | Atteindre 3 maisons | 35 k€ |
| 3 | Construire le solaire | 50 k€ |
| 4 | Construire une ferme | 40 k€ |
| 5 | Atteindre 2 épiceries | 60 k€ |
| 6 | Gagner 5 k€ de revenus nets positifs après l’étape 5 | 50 k€ |
| 7 | Améliorer une maison au niveau 2 | 75 k€ |

Les primes ne servent pas à valider l’étape des premiers revenus. Les objectifs de construction sont validés à la livraison, pas au clic. Les récompenses et la progression sont enregistrées dans la partie ; rouvrir la page ne les verse pas une seconde fois.

## Rythme et libertés

Pendant le guide, les huit premiers projets au maximum prennent trois secondes (construction) ou quatre secondes (amélioration). Le compteur est débité au lancement du chantier ; les travaux déjà commencés gardent leur durée si le guide est passé. Le neuvième projet revient aux durées normales même si le guide n’est pas fini. Terminer ou passer le guide désactive immédiatement l’accélération pour les projets suivants.

Le joueur peut construire ailleurs que sur la case proposée et choisir d’autres bâtiments. Les coûts, ressources, niveaux requis et capacité de chantier continuent de s’appliquer. Les deux premières maisons fournissent du personnel, le solaire augmente le rendement, l’agriculture évite la pénurie et le commerce crée les emplois. Aucune recette permanente artificielle n’est ajoutée : les bonus sont des aides de démarrage ponctuelles.

Le scénario testé atteint la fin en 39 secondes de simulation (sans compter la lecture et les gestes), avec environ 643 k€ en réserve et 56 k€/min de revenus nets sous les réglages initiaux. Les durées réelles varieront selon les actions et les impôts du joueur.

Les sauvegardes précédentes conservent leur ville, leur nom et leurs finances. Le guide est désactivé lors de leur migration afin de ne pas verser des primes rétroactives. Une remise à zéro commence volontairement une nouvelle partie avec le guide.

## Nuit et remise à zéro

Le thème sombre pilote une palette Canvas dédiée. L’eau est bleu nuit ; le sol, les routes, les arbres et les façades sont assombris. Les fenêtres gardent une lumière chaude. Un observateur du thème redessine la scène sans modifier la partie.

Réglages → Recommencer à zéro ouvre une confirmation. Confirmer remet à zéro bâtiments, terrains, budget, prêts, nom et objectifs. Annuler conserve la partie. La préférence de thème et la session Google ne sont pas effacées. Le bouton après faillite utilise le même mécanisme.
