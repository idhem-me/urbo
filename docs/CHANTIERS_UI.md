# Suivi des chantiers

Une barre persistante, au-dessus du menu de bas d’écran, présente la prochaine livraison. Elle affiche le bâtiment ou l’amélioration, le pourcentage et le temps restant. Elle ne se ferme pas tant qu’un chantier est actif. Un bouton couvrant la barre ouvre Ville et fait défiler le panneau jusqu’aux chantiers ; la jauge garde son propre rôle progressbar pour les lecteurs d’écran.

Les chantiers sont triés par date de fin. Le nombre de projets supplémentaires est indiqué dans le pied de barre, sans empiler plusieurs notifications sur la carte. Le détail de Ville affiche toutes les jauges. À la fin du dernier chantier, une confirmation courte remplace le suivi. Une construction en faillite n’affiche plus une progression artificielle.

Le moteur persiste `startedAt`, `duration` et `finish` pour les nouveaux projets. Les anciens projets sans ces champs utilisent une estimation basée sur leur type et niveau ; le temps restant conserve la date de fin réelle. Les progrès sont bornés entre 0 et 100 %. L’affichage visuel se rafraîchit quatre fois par seconde sans accélérer le moteur économique.

Le guide, les confirmations, la barre et l’outil de placement sont réunis dans un conteneur vertical afin de ne pas se chevaucher. Le changement de ville réinitialise le suivi des projets pour ne pas annoncer à tort la fin d’un chantier d’une autre ville.

Le HUD regroupe compteurs et demandes dans une seule surface. Les colonnes ne dépendent plus de la longueur des montants. Les chiffres sont tabulaires ; les valeurs trop longues sont abrégées ou tronquées visuellement avec leur valeur complète dans le libellé accessible.
