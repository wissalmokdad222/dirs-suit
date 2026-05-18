<div align="center">
  <h1>🛡️ DIRS Security Suite — Elite Edition</h1>
  <p><strong>La plateforme ultime pour l'analyse statique, le reverse-engineering et l'évaluation des risques des applications Android (APK).</strong></p>

  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](#)
  [![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](#)
  [![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](#)
  [![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](#)
  [![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](#)

  <br />
  <video src="./public/vid-web.mp4" controls="controls" muted="muted" width="100%"></video>
  <br />
  <a href="https://github.com/wissalmokdad222/dirs-suit/raw/main/public/vid-web.mp4">📥 Si la vidéo ne s'affiche pas, cliquez ici pour la télécharger/voir</a>
</div>

---

## 📖 Introduction

**DIRS (Device Integrity & Risk Scorer)** est une application web d'analyse de cybersécurité développée pour les professionnels de la sécurité, les chercheurs en malware, et les développeurs Android. 

Lorsqu'une application est téléchargée en dehors des canaux officiels (comme le Google Play Store), elle présente des risques de compromission (Spyware, Adware, Trojans). DIRS permet de scanner et de décortiquer n'importe quel fichier `.apk` instantanément dans votre navigateur, sans nécessiter l'envoi de fichiers vers le cloud, garantissant ainsi **100% de confidentialité**.

## 🎯 Objectifs du Projet

1. **Démocratiser l'analyse statique** : Rendre l'audit d'applications accessible sans passer par des terminaux complexes ou des outils lourds comme Jadx ou Apktool.
2. **Évaluation Rapide des Risques** : Fournir un indicateur de confiance visuel et un score compréhensible en un coup d'œil.
3. **Esthétique "Elite"** : Briser le stéréotype des outils de sécurité austères en offrant une interface utilisateur (UI) premium, réactive et luxueuse.

---

## ✨ Fonctionnalités Détaillées

### 1. Moteur d'Analyse Statique Local (Client-side)
Le fichier APK (qui est fondamentalement une archive ZIP modifiée) est uploadé via un Drag-and-Drop intuitif. DIRS utilise **JSZip** pour décompresser l'archive à la volée directement dans la mémoire de votre navigateur.

### 2. Extraction & Parsing du Manifeste
Le fichier `AndroidManifest.xml` (souvent encodé en format binaire Android) est localisé, décodé et analysé pour en extraire des métadonnées essentielles :
- Nom du paquet (Package Name).
- Version de l'application.
- Minimum et Target SDK.

### 3. Audit des Permissions
Le moteur croise les permissions demandées par l'application avec une base de données de sécurité. Il catégorise les permissions en :
- 🟢 **Bénignes** (Accès Internet basique, Vibrateur).
- 🟠 **Modérées** (Bluetooth, Accès aux comptes).
- 🔴 **Critiques / Dangereuses** (Lecture des SMS, Historique des appels, Accès à la Caméra/Micro, Localisation précise en arrière-plan).

### 4. Scoring de Sécurité Intelligent
L'application agrège les données découvertes pour générer un **Score DIRS** de 0 à 100 :
- **80 - 100** : L'application est propre, aucune permission abusive détectée.
- **50 - 79** : L'application demande des accès importants. À installer avec prudence.
- **0 - 49** : Comportement de type Malware suspecté. L'application réclame trop de permissions intrusives.

---

## 🚀 Guide d'Installation & Lancement

L'application est "Zero-Configuration" et ne nécessite qu'un environnement Node.js moderne.

### Prérequis
- [Node.js](https://nodejs.org/en/) (v16.0.0 ou supérieur)
- NPM, Yarn ou PNPM.

### Étape 1 : Récupérer le code source
Clonez le dépôt Git sur votre machine locale :
```bash
git clone https://github.com/wissalmokdad222/dirs-suit.git
cd dirs-suit
```

### Étape 2 : Installer les dépendances
Installez les packages nécessaires au fonctionnement de l'environnement de développement et de l'analyseur (comme Vite et JSZip).
```bash
npm install
```

### Étape 3 : Démarrer l'environnement
Lancez le serveur Vite :
```bash
npm run dev
```

### Étape 4 : Utilisation
Ouvrez votre navigateur web (Chrome, Firefox, Brave ou Edge) et rendez-vous sur :
👉 **http://localhost:3000/**

---

## 💻 Guide d'Utilisation de l'Interface

1. **Page d'Accueil** : L'interface vous accueille avec une zone de "Drop".
2. **Glisser-Déposer** : Prenez un fichier `.apk` (de préférence un petit ou un fichier douteux) et glissez-le sur la page.
3. **Analyse en Temps Réel** : Une barre de progression élégante s'affiche pendant que JSZip extrait l'archive.
4. **Rapport de Sécurité** : Une fois terminé, le tableau de bord affiche les métadonnées de l'application, les drapeaux rouges (Red Flags) et le Score Global DIRS.

---

## 📂 Architecture Technique du Projet

L'application suit une structure modulaire orientée Vanilla JS pour garantir des performances optimales sans le surpoids d'un framework frontend massif.

```text
dirs-suit-main/
│
├── 📁 css/
│   ├── style.css           # Feuille de style globale (animations, couleurs Elite)
│   └── components.css      # Styles dédiés aux cartes, boutons et barres de progression
│
├── 📁 js/
│   ├── app.js              # Point d'entrée, gestion des événements du DOM
│   ├── analyzer.js         # Logique d'analyse statique et intégration JSZip
│   ├── parser.js           # Décodeur pour l'AndroidManifest.xml (binaire -> texte)
│   └── scoring.js          # Algorithme d'évaluation des menaces
│
├── 📁 public/              # Ressources publiques (Logos, Polices)
│
├── 📄 index.html           # Structure de la page web
├── 📄 package.json         # Dépendances Node.js (Vite, JSZip)
├── 📄 vite.config.ts       # Configuration de l'environnement Vite
└── 📄 README.md            # Ce fichier
```

---

## 🛠️ Stack Technologique

- **Build Tool** : [Vite](https://vitejs.dev/) - Pour un rechargement à chaud (HMR) instantané et un bundling optimisé.
- **Archive Parser** : [JSZip](https://stuk.github.io/jszip/) - Pour lire le contenu de l'APK en pur JavaScript dans le navigateur.
- **Frontend** : Vanilla JavaScript, HTML5, CSS3 Custom Properties (Variables CSS pour le thème "Elite").

---

## 🗺️ Roadmap & Perspectives (À Venir)

- [ ] **Décompilation Smali** : Intégration partielle d'un parseur `.dex` pour détecter les strings malveillantes (URLs, IPs).
- [ ] **Vérification de la Signature V2/V3** : Validation de l'intégrité du certificat du développeur de l'APK.
- [ ] **Génération de rapport PDF** : Permettre aux analystes d'exporter le rapport d'analyse.

---

## 🤝 Contribuer au Projet

Les contributions sont grandement appréciées ! Si vous souhaitez améliorer le moteur d'analyse, perfectionner l'interface utilisateur, ou rajouter une fonctionnalité :

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/NouvelleAnalyse`).
3. Commitez vos changements (`git commit -m 'Ajout de la détection de la signature'`).
4. Poussez vers la branche (`git push origin feature/NouvelleAnalyse`).
5. Ouvrez une **Pull Request**.

---

## 👨‍💻 Auteur

**Wissal MOKDAD**
- **Profil GitHub** : [@wissalmokdad222](https://github.com/wissalmokdad222)
- **Domaines d'expertise** : Cybersécurité, Développement Web, Analyse de vulnérabilités Android.

---

<p align="center">
  <i>Développé avec ☕ et 🛡️ par Wissal MOKDAD. "Securing the Android Ecosystem, One APK at a Time."</i>
</p>
