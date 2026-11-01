# ⛵ Route du Rhum 2026 · Tracker pour Windy

Plugin Windy pour suivre toute la flotte de la Route du Rhum 2026 par-dessus les cartes météo.

- **Flotte complète** : 6 classes, bateaux orientés selon leur cap (silhouette mono ou multicoque), couleurs officielles
- **Historique des traces** : complètes, 48 h, 12 h ou aucune ; trace du bateau sélectionné mise en avant (halo, le reste de la flotte estompé)
- **Replay** : curseur temporel depuis le départ, lecture à ×1/×3/×6/×12 h/s, positions interpolées et classement recalculé à chaque instant
- **Classement** par classe, recherche, favoris ★ (mémorisés)
- **Fiche bateau** : rang, vitesse, cap, distance à l'arrivée, écart au leader, distance sur 24 h, vent/vagues/température à bord, courbes de vitesse et de classement
- **Suivi** : la carte suit le bateau sélectionné, y compris pendant le replay

## Architecture

```
tracker Geovoile ──► relais live.json (Cloudflare Worker) ──┬──► plugin (positions live, toutes les 10 min)
                                                            └──► GitHub Action /15 min ──► data/history.json ──► plugin (historique)
```

Le flux live ne fournit que la **dernière position** de chaque bateau. L'historique est donc reconstitué de deux façons :

1. **GitHub Action** (`collector/`) : elle accumule toutes les positions dans `data/history.json`, servi par raw.githubusercontent.com. Tous les utilisateurs voient alors la même trace complète.
2. **Navigateur** : en complément, le plugin accumule localement (localStorage) chaque rapport reçu.

## Mise en place

1. Crée un dépôt **public** sur GitHub et pousse ce dossier.
2. Dans `src/lib/data.ts`, remplace `<user>/<repo>` dans `HISTORY_URL` (et dans `src/pluginConfig.ts`).
3. Onglet **Actions** du dépôt : active les workflows, puis lance « Collecte des positions » une fois à la main (`Run workflow`).
4. Build : `npm i && npm run build` → `dist/plugin.min.js`.

### Tester dans Windy

```bash
npm start            # sert https://localhost:9999/plugin.js
```

Ouvre https://localhost:9999/plugin.js une fois pour accepter le certificat, puis va sur https://www.windy.com/developer-mode et charge cette URL.

### Publier

Suis https://docs.windy-plugins.com/ (clé API Windy + upload de `dist/`). `private: true` dans `pluginConfig.ts` : passe-le à `false` si tu veux le proposer publiquement.

## Compléter la liste des bateaux

`src/lib/boats.ts` contient les noms, skippers et couleurs officielles. Si un bateau n'y figure pas, le plugin déduit quand même sa classe (les rapports Geovoile sont groupés par classe) et l'affiche comme « Bateau n°id ». Il suffit d'ajouter une ligne `b('id', 'Nom', 'Classe', '#couleur', 'Skipper')`.

## Données

Positions issues du tracker officiel Geovoile, via un relais tiers non officiel. Projet personnel, non affilié à l'organisation de la course.
