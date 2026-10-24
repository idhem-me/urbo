# États et design tokens

L’interface reste neutre. La couleur est réservée aux informations d’état et aux actions destructrices.

| État | Couleur | Libellé | Icône Lucide |
| --- | --- | --- | --- |
| success | Vert | OK | CircleCheck |
| warning | Orange | À surveiller | TriangleAlert |
| danger | Rouge | Critique | CircleX |
| neutral | Gris | Optionnel | Info |

Pour chaque état coloré : `--success` (couleur pleine), `--success-foreground` (texte sur couleur pleine), `--success-background` (fond léger), `--success-text`, `--success-border`, `--success-icon` et `--success-ring`. Les mêmes suffixes existent pour `warning` et `danger`.

Ces tokens sont également disponibles dans Tailwind : `bg-success`, `text-success-foreground`, `bg-warning-background`, `text-warning-text`, `border-danger-border`, `ring-danger-ring`, etc. `--destructive` et `--destructive-foreground` sont des alias des tokens `danger` pour conserver les variantes shadcn existantes.

## Composants

`src/components/ui/status-badge.jsx` expose `StatusBadge`, avec `status="success"`, `"warning"`, `"danger"` ou `"neutral"`. Le composant rend une icône et un libellé visibles. Les composants Badge et Button acceptent également les variantes success, warning et danger. Pour le moteur de rendu DOM, `statusBadge()` utilise les mêmes définitions. Les données affichées restent chiffrées ; la couleur n’est pas l’unique information.

## Seuils

Les fonctions sont centralisées dans `src/status.js` :

- Budget : critique à zéro ou en déficit avec moins de cinq minutes de réserve ; à surveiller si déficit avec davantage de réserve ou solde nul ; OK sinon.
- Solde/min : positif OK, nul à surveiller, négatif critique.
- Services : couverture de 80 % et plus OK ; de 40 à moins de 80 % à surveiller ; sous 40 % critique.
- Énergie : 100 % OK ; de 60 à moins de 100 % à surveiller ; sous 60 % critique.
- Attrait : 65 et plus OK ; de 40 à moins de 65 à surveiller ; sous 40 critique.
- Stocks : un stock sans besoin de construction ni consommation est neutre, même à zéro. Pour une matière nécessaire, un manque par rapport à la prochaine construction ou moins de deux minutes de consommation est critique. Moins du double du besoin de construction ou moins de dix minutes de consommation est à surveiller. Sinon OK. Les besoins bois/pierre sont ceux du bâtiment sélectionné (maison par défaut). Les consommations industrielles anticipent au minimum 10 % de leur rendement pour ne pas masquer un besoin lorsque le personnel manque.

La demande de logements, industrie et bureaux indique une opportunité : élevée verte, moyenne orange, faible grise. La demande de services indique des besoins non couverts : élevée rouge, moyenne orange, faible verte. Les barres gardent leur valeur de 0 à 100, leurs libellés et leur description accessible.

Les notifications de réussite sont vertes, les erreurs rouges, les conditions d’amélioration non remplies orange, les instructions neutres. Les contrôles de gameplay et leurs coûts ne changent pas.

## Validation

Les tests couvrent les bornes des seuils, le stock optionnel, les libellés, les icônes et le contraste texte/fond. Les variantes pleines et légères vérifiées atteignent au moins 4,5:1 pour le texte dans le thème clair. Le rendu final sur téléphone reste à tester sur appareil réel.
