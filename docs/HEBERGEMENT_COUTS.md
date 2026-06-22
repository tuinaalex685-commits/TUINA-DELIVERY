# Hébergement et Coûts de Tuina Delivery

Lien de l'application (PWA) : https://tuina-delivery.vercel.app

## Quand devrez-vous commencer à payer pour l'hébergement ?

L'architecture actuelle (Next.js sur Vercel + Base de données Supabase) est extrêmement optimisée. Vous pouvez aller très loin gratuitement !

Voici une estimation de vos limites gratuites :

### 1. La Base de données (Supabase - Gratuit)
- **Limite** : 500 Mo de stockage.
- **En réalité** : Une commande ou un utilisateur ne pèse que quelques octets. Vous pouvez stocker environ **100 000 à 200 000 commandes** avant de remplir cette limite !

### 2. Le Serveur Web (Vercel Hobby - Gratuit)
- **Limite** : 100 Go de bande passante par mois.
- **En réalité** : Avec le cache PWA que nous avons configuré, l'application est très légère. Vous pouvez facilement encaisser **5 000 à 10 000 visiteurs uniques par mois** sans rien payer.

### 3. Le point de bascule : La Cartographie (GPS)
Actuellement, nous utilisons les serveurs publics gratuits de OpenStreetMap (Nominatim) et OSRM pour géocoder les adresses et tracer les lignes d'itinéraire.
- **Limite** : Ces serveurs gratuits n'autorisent qu'environ 1 requête par seconde.

---

## 🟢 Le verdict
Vous pouvez lancer votre activité et tourner à **100% gratuitement** jusqu'à environ :
- **30 à 50 livreurs connectés en simultané** sur les routes.
- **200 à 300 commandes par jour**.

## 🟠 Quand vous passerez ce cap
Ce qui va "bloquer" en premier, c'est l'affichage de la carte et du calcul d'itinéraire si trop de livreurs bougent en même temps. À ce moment-là, vos premiers frais seront :
- **Vercel Pro** : ~20$ / mois (pour avoir un serveur plus rapide).
- **Mapbox ou Google Maps API** : ~5$ à 20$ / mois (pour remplacer OpenStreetMap par un service privé capable d'encaisser des milliers de requêtes).

Vous avez donc largement de quoi valider votre concept et générer du chiffre d'affaires avant de dépenser !
