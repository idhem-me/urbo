# Euros, tonnes et sauvegardes

Depuis la sauvegarde v5, `money` est un montant en euros et `resources` contient des tonnes. Les revenus, impôts et entretiens sont en €/minute de jeu. Les taux de production et de consommation sont en t/min. L’énergie reste un indice de capacité, pas un stock de tonnes.

Les anciens montants sont multipliés par 1 000 ; les anciens stocks et taux de matières sont multipliés par 10. Les prix €/t sont adaptés au même rapport. Les coûts matériels des bâtiments utilisent leur prix de base avant conversion : multiplier l’argent ne multiplie donc pas les tonnes par erreur. Les anciennes sauvegardes sans ressources reçoivent directement le stock initial dans la nouvelle unité.

La migration se produit une seule fois pour les sauvegardes de version 1 à 4. Elle garde les bâtiments, terrains et chantiers. Le timestamp est repositionné à la migration pour ne pas calculer rétroactivement des revenus avec des unités différentes. Les sauvegardes v5 ne sont pas reconverties. La clé locale historique reste conservée pour retrouver les parties existantes.

Le format compact n’est utilisé que pour les compteurs : k€ au-delà de 1 000 €, M€ au-delà de 1 000 000 €. Les prix d’achat restent exacts en €. Le marché prend ou rend 100 t par transaction. La revente rapporte 60 % du prix d’achat.

La destruction est gratuite, définitive et sans remboursement. Elle enlève immédiatement capacités, revenus et charges ; elle conserve la propriété de la case. Les travaux d’amélioration doivent se terminer avant destruction. Détruire un atelier peut réduire la capacité de chantier en dessous des projets actifs : ceux-ci finissent, mais aucun nouveau projet ne démarre avant qu’une place se libère.

La demande est un score indicatif, borné entre 0 et 100 : logements selon les postes vacants et l’attrait, industrie selon le chômage et les besoins matériels, bureaux selon les actifs formés disponibles, services selon la couverture manquante. Elle ne déclenche aucune construction automatique.
