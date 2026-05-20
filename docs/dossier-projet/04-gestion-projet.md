# 04 — Gestion de projet

## Contexte

Galaxy est un projet individuel réalisé dans le cadre du titre professionnel CDA (Concepteur Développeur d'Applications, niveau 6). Il n'y a pas d'équipe, pas de commanditaire externe. Les décisions techniques et fonctionnelles sont prises et assumées par le développeur seul.

---

## Planning — Diagramme de Gantt

---

## Suivi des tâches — Kanban

Le suivi quotidien est géré via **GitHub Projects** sur le dépôt Galaxy.

Lien : https://github.com/users/cdouz/projects/4

### Colonnes du board

| Colonne | Signification |
|---|---|
| **Backlog** | Idées et tâches identifiées, pas encore planifiées |
| **To Do** | Tâches planifiées pour le sprint ou la semaine en cours |
| **In Progress** | En cours de développement |
| **Review** | Terminé, à vérifier (tests, relecture) |
| **Done** | Livré et validé |

### Format des issues

Toutes les issues suivent le format :

```
[ZONE] Description courte et actionnable
```

Les zones utilisées :

| Zone | Domaine |
|---|---|
| `[NOTE]` | Fonctionnalités liées aux notes |
| `[WIKILINK]` | Parsing et résolution des wikilinks |
| `[GRAPH]` | Vue graphique |
| `[AUTH]` | Authentification et sessions |
| `[INFRA]` | Docker, configuration, CI/CD |
| `[TESTS]` | Tests unitaires et d'intégration |
| `[DOCS]` | Documentation projet |
| `[SECURITY]` | Correctifs ou audits de sécurité |

Exemples :
- `[NOTE] Implémenter la sauvegarde avec parsing des wikilinks`
- `[GRAPH] Afficher les nœuds avec react-force-graph`
- `[INFRA] Migrer MAMP vers Docker`
- `[TESTS] Tests unitaires du LinkSyncService`

### Convention de commits

Les commits référencent systématiquement l'issue concernée et utilisent les préfixes conventionnels :

```
feat(note): implémenter la sauvegarde - closes #12
fix(auth): corriger la redirection après login - closes #18
test(wikilink): ajouter les cas du wikilinks-spec.json - refs #21
docs(gestion): ajouter le planning Gantt
chore(infra): configurer docker-compose dev
```

Préfixes :

| Préfixe | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `test` | Ajout ou modification de tests |
| `docs` | Documentation uniquement |
| `refactor` | Refactorisation sans changement de comportement |
| `chore` | Config, dépendances, infra |
| `security` | Correctif de sécurité |

Le `closes #N` ferme automatiquement l'issue et déplace la carte dans la colonne **Done** du Kanban sans action manuelle.

---

## Environnement de développement

| Outil | Rôle |
|---|---|
| VSCode | IDE principal |
| InteliJ | IDE Java |
| Docker Desktop | MySQL + Redis + phpMyAdmin en local |
| Postman | Tests manuels de l'API REST |
| GitHub Projects | Kanban de suivi |
| GitHub Actions | CI/CD (build + tests automatiques) |
| phpMyAdmin | Visualisation de la base de données |