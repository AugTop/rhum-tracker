# ⛵ Route du Rhum 2026 · Tracker pour Windy

Suis toute la flotte de la Route du Rhum 2026 en direct, **par-dessus les cartes météo de Windy** : vent, vagues, pression… et les 115 bateaux de Saint-Malo à Pointe-à-Pitre.

## Ce que tu peux faire

- 🗺️ **Voir toute la flotte** sur la carte : chaque bateau a sa couleur officielle et une silhouette selon sa classe, orientée dans le sens de sa route
- 🧭 **Suivre les traces** de chaque bateau : complètes, sur les dernières 48 h ou 12 h
- ⏪ **Rejouer la course** depuis le départ en accéléré, avec le classement recalculé à chaque instant
- 🏆 **Consulter le classement** par classe, chercher un bateau ou un skipper
- ⭐ **Mettre tes favoris** en avant : ils restent mémorisés d'une visite à l'autre
- 📊 **Ouvrir la fiche d'un bateau** : rang, vitesse, cap, distance à l'arrivée, écart au leader, météo à bord, courbes de vitesse et de classement
- 🎯 **Suivre un bateau** : la carte le garde au centre, y compris pendant le replay

Les positions se mettent à jour automatiquement à chaque nouveau rapport officiel (environ toutes les heures).

## Reconnaître les bateaux sur la carte

| Classe | Silhouette | En vrai |
|---|---|---|
| **Ultim** | grand trimaran, longs flotteurs | les géants de 32 m, les plus rapides |
| **Ocean Fifty** | petit trimaran compact | trimarans de 15 m |
| **IMOCA** | monocoque large avec foils | les bateaux du Vendée Globe, 18 m |
| **Class40** | monocoque à étrave carrée | 12 m, la classe la plus nombreuse |
| **Vintage Multi** | catamaran | multicoques d'anciennes éditions |
| **Vintage Mono** | monocoque fin et pointu | voiliers classiques |

La taille des silhouettes respecte à peu près la taille réelle des bateaux.

## Installer le plugin

Il faut un **ordinateur** et un navigateur récent (Chrome, Firefox, Edge, Safari).

1. Va sur **https://www.windy.com/developer-mode**.
2. Colle cette adresse dans le champ prévu :
   ```
   https://cdn.jsdelivr.net/gh/AugTop/rhum-tracker@main/dist/plugin.js
   ```
3. Valide : le panneau **Route du Rhum 2026** s'ouvre à droite de la carte.

Pour le retrouver plus tard, refais la même manipulation.

## Bien démarrer

- **Cliquer sur un bateau** (sur la carte ou dans le classement) ouvre sa fiche. **Suivre** fait suivre le bateau par la carte.
- **Les onglets de classe** (Ultim, IMOCA, Class40…) filtrent le classement.
- **La barre du bas** permet de rejouer la course : ▶ pour lancer, le curseur pour se déplacer dans le temps, **Direct** pour revenir à la position actuelle.
- **⚙** règle l'affichage : longueur des traces, noms affichés, couleurs par bateau ou par classe.
- **⟳** force une mise à jour.
- Change de couche météo dans Windy (vent, vagues, rafales…) pour voir les conditions que rencontrent les bateaux.

## Questions fréquentes

**Les traces ne remontent pas jusqu'au départ.**
Le tracker officiel ne fournit que la position actuelle des bateaux. Les traces sont donc reconstituées en enregistrant chaque position au fil de la course, à partir du moment où l'enregistrement a commencé.

**Les positions ne bougent pas.**
Les positions officielles sont publiées environ une fois par heure. Entre deux rapports, les bateaux ne bougent pas sur la carte. L'heure du dernier rapport est indiquée en haut du panneau.

**Un bateau n'apparaît pas.**
Il a peut-être abandonné ou n'émet plus. Vérifie aussi que la recherche est vide et que l'onglet **Tous** est sélectionné.

## À propos

Projet personnel et gratuit, **non affilié** à l'organisation de la Route du Rhum ni à Windy. Les positions proviennent du tracker officiel de la course, via un relais tiers non officiel.

Une idée, un bug ? [Ouvre une issue](https://github.com/AugTop/rhum-tracker/issues).

---

<details>
<summary>Pour les développeurs</summary>

```bash
npm i
npm start        # sert https://localhost:9999/plugin.js (à charger dans windy.com/developer-mode)
npm run build    # compile dans dist/
```

- `src/lib/boats.ts` : liste des bateaux (nom, skipper, classe, couleur).
- `src/lib/mapLayer.ts` : rendu de la carte et silhouettes des bateaux.
- `collector/` + `.github/workflows/collect.yml` : toutes les 15 min, une GitHub Action ajoute les positions dans `data/history.json`. Le plugin lit ce fichier pour afficher les traces complètes.
- `.github/workflows/publish-plugin.yml` : publication sur Windy (secret `WINDY_API_KEY` requis).
- Pensez à recompiler et versionner `dist/` : c'est lui qui est servi par jsDelivr.

</details>
