# Plusieurs villes par compte

## Identité et sauvegarde

Une ville possède un UUID indépendant de son nom. Renommer ne crée pas une nouvelle ville. Une nouvelle ville crée un état initial indépendant, avec son propre guide. Le bouton Ouvrir sauvegarde d’abord la ville courante, puis reprend la ville choisie avec son éventuelle progression hors ligne. Le redémarrage ne touche qu’à la ville active.

Les métadonnées de villes restent séparées de l’état du moteur économique. Les anciennes sauvegardes sous `rivage-v1` sont migrées vers le registre invité `urbo-cities-v1:guest` et leur original est conservé. Les caches connectés utilisent `urbo-cities-v1:user:<user-id>`. La préférence de thème et les jetons Supabase restent gérés séparément.

La connexion charge uniquement les villes du compte courant. La déconnexion retourne à la dernière ville invitée. Importer les villes invitées est une action explicite qui crée des copies sans supprimer les originales ; une origine stable empêche de les importer plusieurs fois dans le même compte.

## Supabase

Exécuter `supabase/002_multiple_cities.sql` dans le SQL Editor. La table `cities` contient id, user_id, state, revision, imported_from et horodatages serveur. La RLS impose `auth.uid() = user_id` pour les lectures et mutations. Les clients anonymes n’ont pas accès à la table. Les écritures cliente sont limitées à l’état et à sa révision ; le déclencheur empêche le changement d’identité/propriétaire et vérifie la progression de la révision.

L’ancienne table `city_saves`, si elle existe, est copiée sans être supprimée. Un index rend cette reprise idempotente. Les credentials de connexion Google ne changent pas et aucune clé privilégiée n’est nécessaire dans le navigateur.

## Synchronisation et conflits

Les modifications locales sont persistées immédiatement et envoyées par lots environ toutes les cinq secondes. Chaque envoi conserve la version locale transmise. Une réponse serveur ne marque pas comme enregistrées des modifications plus récentes apparues pendant la requête.

Les mises à jour comparent la révision serveur connue dans le filtre SQL ; un échec de comparaison déclenche une relecture. Si une autre version existe, la version locale est conservée avec un nouvel UUID et un suffixe « copie locale », tandis que l’original garde la version cloud. Les deux sont visibles dans Mes villes. Un conflit sur une ville inactive ne change pas la ville active. L’égalité des données ignore l’ordre des clés JSON, comme le fait JSONB.

Les requêtes et réponses d’un compte sont invalidées quand la session change. Les registres des autres comptes ne sont pas chargés dans l’interface. Les caches locaux servent à la reprise hors ligne ; la vraie frontière d’accès au cloud est la RLS Supabase.

Une panne conserve les données locales en attente. Un échec de stockage ne remplace pas le registre existant. Les sauvegardes cloud nécessitent la connexion et la migration ; sans elles, le jeu affiche un message et continue à conserver une copie locale lorsque le stockage est disponible.

## Vérification

`city-store.test.js` couvre migration, choix actif, créations, séparation des propriétaires, import unique, cache corrompu, quota de stockage et redémarrage isolé. `city-sync.test.js` couvre insertion, comparaison de révisions, mutations pendant un envoi, copie de conflit, autre compte et panne réseau avec un serveur simulé. Les parcours d’interface ont aussi été testés avec sessions simulées A/B.

À valider sur la base réelle après migration : connexion de deux comptes, impossibilité pour B de lire ou écrire une ville de A, retour sur un deuxième appareil et conflit sur une même ville. Les tests locaux ne remplacent pas cette validation de votre configuration Supabase.
