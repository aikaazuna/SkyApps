# 📚 Guide Complet : Hébergement des Applications & Images

Ce guide vous explique les deux méthodes simples pour ajouter vos images et distribuer vos applications (`.apk`, `.exe`, `.zip`) sur votre **Sky Apps Store**.

---

## 🚀 Méthode 1 (Recommandée) : Directement sur votre site / repo

Vous pouvez déposer vos fichiers d'applications et vos images directement dans le dossier `public/` de ce projet.

### 🖼️ Pour les images (Icônes & Captures) :
Placez vos images dans le dossier `public/apps/<nom-app>/` :
```
public/
  apps/
    skyclip/
      icon.png
      banner.jpg
      screenshot-1.png
      screenshot-2.png
```
Dans `src/data/apps.json`, indiquez simplement le chemin relatif :
```json
"icon": "/apps/skyclip/icon.png",
"banner": "/apps/skyclip/banner.jpg",
"screenshots": [
  "/apps/skyclip/screenshot-1.png",
  "/apps/skyclip/screenshot-2.png"
]
```
✅ **Avantages :** 
- Les images chargent instantanément en local et sur Vercel.
- Vous les poussez simplement sur votre GitHub (`git add public/apps/ && git push`).

---

### 📦 Pour les fichiers d'applications (.APK, .EXE) :
Placez vos fichiers dans le dossier `public/downloads/` :
```
public/
  downloads/
    SkyClip-Setup.exe
    SkyStream-v1.8.apk
```
Dans `src/data/apps.json` :
```json
"downloads": [
  {
    "id": "skyclip-exe",
    "label": "Télécharger l'Installateur Windows",
    "platform": "exe",
    "url": "/downloads/SkyClip-Setup.exe",
    "size": "48 Mo",
    "primary": true
  }
]
```
✅ **Résultat :** Quand l'utilisateur clique sur **« OBTENIR »**, le fichier se télécharge directement depuis votre propre site (ex: `https://votre-site.vercel.app/downloads/SkyClip-Setup.exe`) sans aucune redirection externe !

---

## 🌐 Méthode 2 : Via GitHub Releases (Pour les gros fichiers > 100 Mo)

Si vous avez des fichiers très volumineux (jusqu'à 2 Go), vous pouvez les déposer sur **GitHub Releases** :

1. Sur votre dépôt GitHub, allez dans **Releases > Create a new release**.
2. Renseignez un tag (ex: `v1.0.0`) et glissez votre fichier `.apk` ou `.exe`.
3. Cliquez sur **Publish release**.
4. Récupérez le lien direct du fichier :
   ```
   https://github.com/votre-compte/votre-repo/releases/download/v1.0.0/mon-app.apk
   ```
5. Collez ce lien dans `url` dans votre `src/data/apps.json`.
6. Le bouton **« OBTENIR »** de votre site déclenchera automatiquement le téléchargement direct du fichier en arrière-plan sans ouvrir la page GitHub.

---

## 🖼️ Prendre des images depuis un dépôt GitHub distant (GitHub Raw)

Si vos images sont hébergées sur un dépôt GitHub, vous pouvez utiliser l'URL directe `raw.githubusercontent.com` :
```
https://raw.githubusercontent.com/<pseudo>/<repo>/main/images/icon.png
```
*(Remplacez `<pseudo>`, `<repo>` et le chemin vers votre image).*

---

## ⚡ Résumé pour ajouter une appli en 30 secondes :

1. Déposez l'icône dans `public/apps/mon-app/icon.png` et l'APK dans `public/downloads/mon-app.apk`.
2. Ouvrez le générateur sur le site (**`Ctrl + Maj + A`**).
3. Remplissez les champs et cliquez sur **« Copier le JSON »**.
4. Collez dans `src/data/apps.json`.
5. Poussez sur GitHub :
   ```bash
   git add .
   git commit -m "Ajout de Mon App"
   git push
   ```
Vercel met à jour le site automatiquement en 15 secondes ! 🚀
