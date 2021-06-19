# Captcha
Création d'un captcha avec Nodejs

On vous charge de réaliser le prototype d’un générateur de captcha dynamique qui sera
amené à être mis en ligne.
Le cahier des charges est le suivant :
1. Cap’Chat affichera une série d’images originales composées par un artiste
2. Parmi les huit images affichées, on distinguera des images ‘neutres’ et une image
‘singulière’
3. C’est l’image singulière que l’utilisateur devra distinguer parmi les autres pour
valider le Cap’Chat
4. A chaque image singulière est associé une question ou un indice unique
(Indices.txt) permettant de l’identifier
5. Cap’Chat devra pouvoir s’enrichir dynamiquement et simplement des nouvelles
créations d’artistes
6. Lors de l’apparition d’un Cap’Chat, un thermomètre dynamique décomptera
trente secondes (par défaut) pour y répondre. L’écoulement du délai provoquera
le rechargement de Cap’Chat. A chaque échec ou délai dépassé, le délai imparti
sera réduit de cinq secondes.
7. Cap’Chat sera programmé intégralement en Javascript, partie serveur comme
partie cliente.
Ressources fournies
1. Un Lot d’images neutres
2. Un lot d’images singulières
3. Un fichier d’indices
Travail à faire
Programmer un service node.js qui retournera une page Cap’Chat opérationnelle via une 
invocation http (ex :http://www.capchat.xx)

Projet Cap’Chat
Etape 2
Consignes générales :
1. L’appel à un ‘CaptChat’ doit pouvoir se faire dans l’importe quelle page html via 
l’intégration d’une balise (lien http) dans une page. L’installation d’un ‘CaptChat’
dans une page doit être simple et rapide (cette partie sera démontrable lors de la 
soutenance)
2. La validation (bonne réponse) du ‘CaptChat’ devra permettre de faire apparaître un 
bouton de validation sur la page où est inséré le ‘CaptChat’ ou le chargement 
automatique d’un lien http si celui-ci a été défini dans le paramétrage de la balise à 
l’étape précédente.
De façon complémentaire, vous allez réaliser la partie ‘BackOffice’ de notre projet. Tout 
d’abord, l’enrichissement de la base des ‘CaptChat’ disponibles.
Les artistes déposant un jeu de ‘CaptChat’ devront compléter un formulaire permettant :
• De s’identifier sur notre site si ce n’est pas déjà fait 
• De nommer leur ‘CaptChat’
• De qualifier ce ‘CaptChat’ par un thème (Animaux, BD, Graphisme….) proposé dans 
un menu déroulant lié à une table dans une base de données de notre site
• De télécharger les images neutres dans une archive (.zip obligatoire)
• De télécharger les images singulières dans une archive (.zip obligatoire)
Une fois les images chargées, vous proposerez à l’auteur de renseigner un indice pour 
chaque image singulière.
Le nouveau ‘CaptChat’ sera alors prêt à être utilisé pour qui désire l’intégrer sur son site via 
une URL d’intégration.
Dans la réalité, il faudra prévoir une phase de modération entre le dépôt d’un ‘CaptChat’ et 
la possibilité de l’intégrer dans une page. Cette étape n’est pas à considérer pour le moment.
API REST
Cap’Chat sera doté d’une API REST permettant notamment de
- S’inscrire (Identifiant, MDP)
- S’identifier (Identifiant, MDP). En retour l’utilisateur recevra un Token. Le Token
sera ensuite passé en entête de toutes les requêtes de l’api pour vérification. Pour
chaque requête, on vérifiera juste que le token est valide (pas de contrôle de
cohérence Utilisateur/Token).
- Créer, Modifier(Nom), Supprimer un Artiste-Créateur de Captchat
- Lister (ID, Nom) les Artistes-Créateurs de Captchat
- Lister (ID, Nom) les thèmes disponibles
- Créer, Modifier (Nom, idtheme), Supprimer un Jeu d’images
- Lister (ID, Nom, idtheme, idartiste, urlusage) les Jeux d’images
- Lister (ID, Nom, idtheme, idartiste, urlusage) les Jeux d’images d’un artiste
- Lister (ID, Nom, idtheme, idartiste, urlusage) les Jeux d’images d’un thème
- Modifier (QuestionAssociée) une image
