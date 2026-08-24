# 📚 Guide Complet : Héberger ses APK, .EXE et Extensions sur GitHub

Ce guide vous explique pas-à-pas comment stocker gratuitement vos fichiers d'applications (`.apk`, `.exe`, `.zip`) sur GitHub Releases et les distribuer sur votre **Sky Apps Store**.

---

## 🌟 Pourquoi utiliser GitHub Releases ?

- ✅ **100% Gratuit et sans limite globale d'espace.**
- ✅ **Fichiers volumineux acceptés :** jusqu'à **2 Go par fichier**.
- ✅ **CDN mondial ultra-rapide :** téléchargements rapides et stables pour tous vos utilisateurs.
- ✅ **Gestion des versions claire :** vos utilisateurs savent toujours quelle version ils téléchargent.

---

## Étape 1 : Créer une Release sur GitHub

1. Rendez-vous sur le dépôt GitHub de votre application (ex: `https://github.com/votre-compte/mon-application`).
2. Dans la colonne de droite, cliquez sur **Releases** (ou allez sur `https://github.com/votre-compte/mon-application/releases`).
3. Cliquez sur le bouton vert **"Draft a new release"** (ou "Create a new release").
4. **Remplissez les champs :**
   - **Choose a tag :** tapez votre numéro de version, par exemple `v1.0.0` (puis cliquez sur *Create new tag*).
   - **Release title :** exemple `Version 1.0.0 — Lancement officiel`.
   - **Describe this release :** décrivez les nouveautés ou laissez vide.
5. **Attachez vos fichiers :**
   - Dans la zone **"Attach binaries by dropping them here or selecting them"**, glissez-déposez vos fichiers :
     - Votre fichier Android : `MonApp-v1.0.0.apk`
     - Votre installateur Windows : `MonApp-Setup-1.0.0.exe`
     - Votre version portable : `MonApp-Portable-1.0.0.zip`
6. Cliquez sur **"Publish release"**.

---

## Étape 2 : Récupérer le lien direct de téléchargement

Une fois la Release publiée :
1. Faites un **clic droit** sur le fichier dans la Release (ex: `MonApp-v1.0.0.apk`) et sélectionnez **"Copier l'adresse du lien"**.
2. Le lien aura cette structure :
   ```
   https://github.com/votre-compte/mon-application/releases/download/v1.0.0/MonApp-v1.0.0.apk
   ```
   *(Ce lien déclenche directement le téléchargement du fichier dès que l'utilisateur clique dessus).*

---

## Étape 3 : Ajouter l'application sur le Store

### Méthode Visuelle (Recommandée) :
1. Lancez votre site ou allez sur sa version en ligne Vercel.
2. Cliquez sur le bouton **"+ Ajouter une appli"** dans la barre de navigation.
3. Saisissez le nom, le slogan, la catégorie et collez votre lien GitHub Release dans la partie **Téléchargements**.
4. Cliquez sur **"Générer le code JSON"** puis **"Copier le JSON"**.
5. Ouvrez le fichier `src/data/apps.json` de ce projet et collez le bloc au début ou à la fin de la liste.

### Exemple de structure dans `src/data/apps.json` :
```json
[
  {
    "id": "mon-application",
    "name": "Mon Application",
    "tagline": "Une description courte et accrocheuse",
    "description": "Description détaillée de toutes les fonctionnalités...",
    "icon": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&h=256&fit=crop&q=80",
    "category": "Productivité",
    "platforms": ["apk", "exe"],
    "featured": true,
    "badge": "Nouveau",
    "rating": 4.9,
    "author": {
      "name": "Votre Nom",
      "url": "https://github.com/votre-compte"
    },
    "version": "1.0.0",
    "size": "24.5 Mo",
    "releaseDate": "2024-08-24",
    "lastUpdated": "2024-08-24",
    "screenshots": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&h=600&fit=crop&q=80"
    ],
    "features": [
      "Interface moderne et intuitive",
      "Fonctionne sans connexion Internet",
      "Sans publicité"
    ],
    "downloads": [
      {
        "id": "mon-app-apk",
        "label": "Télécharger APK (Android)",
        "platform": "apk",
        "url": "https://github.com/votre-compte/mon-app/releases/download/v1.0.0/MonApp.apk",
        "size": "24.5 Mo",
        "version": "1.0.0",
        "primary": true
      },
      {
        "id": "mon-app-exe",
        "label": "Installateur Windows (.exe)",
        "platform": "exe",
        "url": "https://github.com/votre-compte/mon-app/releases/download/v1.0.0/MonApp-Setup.exe",
        "size": "38.2 Mo",
        "version": "1.0.0"
      }
    ],
    "githubRepo": "https://github.com/votre-compte/mon-app"
  }
]
```

---

## Étape 4 : Mettre en ligne en 1 commande

Dans votre terminal :
```bash
git add .
git commit -m "Ajout de la nouvelle application MonApp"
git push
```

Vercel recompile et déploie le site automatiquement en moins de 20 secondes ! 🚀
