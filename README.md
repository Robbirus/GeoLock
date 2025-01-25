Le projet GeoCache :

Le concept du jeu est de chercher des coffres cachés avec comme seul indice, notre distance à celui ci.
Une fois le coffre trouvé, il faudra l'ouvrir avec le téléphone via une "clé".

Fonctionnellement, 

L'appli recherchera le coffre le plus proche et le sélectionnera,
la position du coffre sera ensuite connu et l'écart sera calculé entre l'utilisateur et le coffre.
A plus de 1000 m, le site enverra une notification pour avertir l'utilisateur qu'il est trop loin.
A moins de 500 m le site enverra une notification pour attirer l'attention de l'utilisateur.
A moins de 100 m le site fera vibré le téléphone avec un certain intervalle, comme un détecteur de métal.

Une notification sera envoyé à l'utilisateur qu'un coffre est proche.
Cependant Netlify ne permet pas les notifications push up.
Ou alors je n'ai pas réussis à le mettre en place.

Des axes d'améliorations possibles : 
    Une vibration avec un réel intervalle
    Une connaissance native des coffres autour
    Ajout de visuel plus agréable et repondant (L'app n'est pas très intuitif)


input : 
Dans script.js, testez différentes position de coffre en modifiant 
les variables latChest et lonChest.

lien github: https://github.com/Robbirus/GeoLock
lien git : https://github.com/Robbirus/GeoLock.git

lien de l'appli web : https://geolocker.netlify.app/