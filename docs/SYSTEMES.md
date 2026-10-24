# Mise à jour v0.4

Les règles de progression, de territoire, de prix et de délais ont été remplacées par celles de `PROGRESSION.md`. Les descriptions suivantes expliquent les systèmes économiques introduits en v0.3.

# Systèmes du prototype 0.3

## Boucle économique

Les maisons et les boutiques avec logements fournissent une capacité résidentielle. L’attractivité dépend des parcs et équipements sportifs, de la fiscalité, de la densité, de la pollution et de la disponibilité alimentaire. L’occupation est immédiate, entre 46 et 100 % selon le score. La moitié des habitants est active.

Les écoles créent une capacité de formation, réduite lorsque le personnel est insuffisant. Les actifs formés occupent d’abord les postes qualifiés (bureaux et hôpital), puis les actifs restants les emplois ordinaires. Le taux de personnel ordinaire est réparti uniformément entre services et activités ; pas d’affectation manuelle dans cette version.

Les recettes sont les impôts et les activités commerciales/de bureaux, moins l’entretien de tous les bâtiments. Une mairie améliore le taux de collecte de 70 à 100 % selon sa couverture. La fiscalité douce attire davantage mais rapporte moins par habitant. Le budget peut devenir négatif ; la banque et la faillite sont décrites dans BANQUE.md.

## Énergie et ressources

Une centrale solaire fournit une production selon son personnel. Une centrale à charbon consomme deux unités de charbon par minute et par niveau à plein personnel. Sans charbon, sa production électrique tombe à zéro. Une carrière produit pierre et charbon ; ce regroupement évite d’exiger une mine supplémentaire dans cette version.

Les bâtiments sans électricité gardent un rendement autonome de 25 % pour éviter un blocage initial. Le rendement croît jusqu’à 100 % avec la couverture énergétique et est réduit par le manque de personnel. Le charbon peut être acheté au marché.

La scierie produit du bois ; l’agriculture de l’alimentation, consommée par la population. Sans alimentation, l’attractivité perd dix points. Le puits produit du pétrole. L’atelier consomme du bois pour faire des marchandises, la petite usine du bois et de la pierre, la grande usine du pétrole et de la pierre. Les matières sont consommées proportionnellement au rendement réalisable ; pas de stock négatif. Les marchandises se vendent au marché, sans vente automatique.

## Services publics et administration

Pompiers, police, ambulances et hôpital affichent chacun une couverture : capacité × taux de personnel ordinaire / population, plafonnée à 100 %. Ce sont des indicateurs pour dimensionner les services : aucun incident n’est encore simulé. L’hôpital propose en plus des postes qualifiés. La capacité affichée des soins reste une approximation fondée sur le personnel ordinaire. À affiner avant de simuler maladies et interventions.

La mairie agit sur la collecte fiscale. Le tableau administratif présente couverture des services, énergie, pollution, formation, alimentation, stocks et chantiers. Les équipements sportifs et parcs augmentent l’attractivité et coûtent de l’entretien.

## Amélioration et chantiers

Tous les types vont du niveau 1 à 3. Les capacités, productions et consommations augmentent proportionnellement au niveau ; les entretiens augmentent désormais plus vite. Les coûts et effets du niveau suivant sont montrés avant validation. Chaque projet réserve sa parcelle et consomme immédiatement pièces, bois et pierre.

Les délais dépendent désormais du type et du niveau, voir `PROGRESSION.md`. Un atelier achevé ajoute une place de chantier par niveau, même si sa production est ralentie : cela représente la capacité artisanale installée. Aucun remboursement ou abandon pour l’instant. Les projets sont sauvegardés et terminent aussi pendant l’absence. Le moteur intègre les ressources par pas de dix secondes maximum ; des écarts d’arrondi de simulation sont possibles selon la fréquence de reprise.

## Suite de production

Tester dix minutes sur téléphone et ajuster coûts, rythmes de production et dépenses publiques. Ajouter ensuite les incidents, la priorité de personnel des services, la formation progressive, les rayons de couverture, la démolition et des emprises plus larges pour grands équipements. L’authentification Google/Supabase, la synchronisation multiappareil et la PWA restent des lots distincts.
