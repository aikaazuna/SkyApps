# 🍏 Sky Apps Store — Mini App Store Style Apple

Un mini **App Store moderne et ultra-élégant** inspiré du design d'Apple (iOS / macOS glassmorphism) développé en **React + Vite + Tailwind CSS**, pensé pour distribuer et héberger facilement vos applications **Android (APK)**, **Windows (.EXE)**, **Extensions de navigateurs** et **Outils Web**.

100% statique, ultra-rapide et optimisé pour être hébergé gratuitement sur **Vercel** ou **GitHub Pages**.

---

## ✨ Fonctionnalités

- 🎨 **Design Apple App Store :** Effets de verre dépoli (*frosted glass*), typographie soignée, badges colorés et mode Sombre / Clair automatique ou manuel.
- 📱 **Support multiplateforme :**
  - Applications Android (`.apk`)
  - Logiciels & Utilitaires Windows (`.exe` installateur ou portable `.zip`)
  - Extensions Web (Chrome, Edge, Brave, Firefox)
  - Applications Web & Outils
- 🌟 **Section "À la une" (Spotlight Hero) :** Carrousel immersif avec aperçus haute résolution et téléchargement direct en un clic.
- 🔥 **Section "Les Incontournables" :** Classement style Top Charts iOS avec notes, catégories et statut.
- 🔍 **Recherche et Filtres instantanés :** Filtrez par plateforme (APK, EXE, Extension, Web), par catégorie (Productivité, Utilitaires, Multimédia, Outils IA...) ou par mot-clé (raccourci clavier `/` ou `Ctrl + K`).
- 📄 **Fiches détaillées complètes (Modale Apple) :**
  - Galerie de captures d'écran avec mode plein écran (Lightbox)
  - Section "Quoi de neuf" (Changelog de versions)
  - Liste des fonctionnalités clés et configuration requise
  - Vérification de l'empreinte de sécurité SHA-256 avec copie en 1 clic
  - Choix de miroirs / versions alternatives (ex: ARM64 vs Universal APK, Setup vs Portable)
- 💡 **Guides d'installation pas-à-pas intégrés :** Explications claires pour installer une APK (autoriser sources inconnues), un .EXE (passer l'écran SmartScreen) ou une Extension (mode développeur).
- 🛠️ **Générateur visuel d'application intégré :** Bouton "+ Ajouter une appli" dans la barre de navigation avec un formulaire visuel générant automatiquement le code JSON prêt à être copié dans GitHub !
- 🎉 **Effet festif :** Confettis animés au lancement des téléchargements.

---

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancer en local (Développement)
```bash
npm run dev
```
Ouvrez `http://localhost:5173` dans votre navigateur.

### 3. Compiler pour la production
```bash
npm run build
```

---

## 🌐 Déploiement sur Vercel (Gratuit & Instantané)

Le projet est configuré avec un fichier `vercel.json` optimisé :

1. Poussez votre projet sur un dépôt **GitHub**.
2. Allez sur [vercel.com](https://vercel.com) et connectez-vous avec GitHub.
3. Cliquez sur **"Add New Project"** et sélectionnez votre dépôt.
4. Vercel détecte automatiquement la configuration **Vite** :
   - **Framework Preset :** Vite
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
5. Cliquez sur **"Deploy"** ! 🚀
6. **Magie :** À chaque fois que vous ajouterez une application dans `apps.json` et ferez un `git push`, Vercel mettra à jour votre site automatiquement en 15 secondes !

---

## 📦 Comment ajouter vos applications sur GitHub

Consultez le guide détaillé : [TUTORIAL_GITHUB.md](./TUTORIAL_GITHUB.md)

### En résumé :
1. Sur votre dépôt GitHub (ou le dépôt de l'application), créez une **Release** (ex: `v1.0.0`) et glissez votre fichier `.apk` ou `.exe`.
2. Ouvrez le site en local ou en ligne et cliquez sur **"+ Ajouter une appli"** dans la barre du haut.
3. Remplissez le formulaire, cliquez sur **"Copier le JSON"**.
4. Ouvrez le fichier `src/data/apps.json` et collez-y votre nouvel objet d'application.
5. `git commit -am "Ajout de MonApp" && git push` ➡️ Le site est instantanément à jour !

---

## ⚙️ Personnalisation du Store

Modifiez le fichier `src/data/config.json` pour personnaliser :
- Le nom du Store (`storeName`)
- Le slogan (`storeTagline`)
- Le nom de l'auteur (`authorName`)
- Vos liens GitHub (`githubUserUrl`)
- La bannière d'annonce en haut du site (`announcement`)
