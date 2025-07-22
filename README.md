# Jeu d’Échecs en JavaScript
## 📌 Contexte
Ce projet est une implémentation simple d’un jeu d’échecs en JavaScript, exécuté dans un navigateur web. L’objectif était de coder la logique complète du jeu, incluant le déplacement des pièces, la détection des échecs et mat, ainsi qu’une interface utilisateur basique pour jouer.

## ✅ Fonctionnalités
- Déplacement des pièces selon les règles classiques des échecs

- Tour par tour entre blancs et noirs avec gestion du clic sur les cases

- Détection automatique des échecs et mats

- Affichage dynamique des messages de victoire ou défaite

- Interface graphique simple avec cases colorées et pièces représentées par des icônes ou emojis

- Interdiction de déplacer une pièce lorsque ce n’est pas son tour

## 📥 Installation et utilisation
#### Prérequis
Un navigateur web moderne (Chrome, Firefox, Edge, Safari, etc.)

#### Clonage du projet
```bash
git clone https://github.com/TomyRulliat-3ICS/ErasmusTask6.git
```
#### Lancement
Ouvre le fichier index.html dans ton navigateur pour lancer le jeu.

## ⚠️ Problèmes rencontrés
- Gestion correcte du changement de tour (blancs/noirs) pour empêcher les déplacements hors tour

- Correction du message affiché lors de la victoire (inversion des joueurs dans l’affichage)

- Implémentation des règles de déplacement spécifiques à chaque pièce

- Gestion des cas particuliers comme l’échec, l’échec et mat, et le pat

- Amélioration de l’interface pour indiquer clairement la pièce sélectionnée et les coups possibles

## 🧪 Tester le jeu
Voici quelques tests manuels à effectuer pour valider les fonctionnalités :

- ✅ Lancer le jeu dans le navigateur

- ✅ Sélectionner une pièce blanche puis déplacer sur une case valide

- ✅ Passer le tour au joueur noir et déplacer une pièce noire

- ✅ Vérifier que le message de victoire s’affiche correctement quand un joueur gagne

- ✅ Tenter un coup illégal et vérifier qu’il est refusé

- ✅ Tester la détection d’échec et mat

## 🧠 Auteur
Projet réalisé par Tomy RULLIAT dans le cadre d’un projet lors d'un stage ERASMUS. 
Ce travail a permis de renforcer les compétences en JavaScript, gestion d’état dans les interfaces web, et logique de jeu.