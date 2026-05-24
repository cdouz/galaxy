# Galaxy

Application web de prise de notes (style Notion + Obsidian) avec vue graphique des liens. **Multi-utilisateurs** : chaque utilisateur crée son compte, voit uniquement ses propres notes. Pas de partage de notes entre users, pas de collaboration live en v1.

## Stack

- **Front** : React + Vite + TypeScript strict, Tailwind, Zustand (UI), TanStack Query (serveur), CodeMirror 6, react-markdown, react-force-graph, React Router v6.
- **Back** : Java + Spring Boot + Maven, Hibernate/JPA, Spring Security (bcrypt), Spring Session + Redis, springdoc-openapi.
- **Données** : MySQL 8+ (métier), Redis (sessions + cache titres). Migrations Flyway.

## Structure

```
galaxy/
├── frontend/                 # Vite + TS
├── backend/                  # Spring Boot
│   └── src/main/resources/
│       ├── application.properties           # versionné
│       ├── application-dev.properties       # versionné
│       ├── application-prod.properties      # NON versionné
│       └── db/migration/                    # Flyway
├── docs/wikilinks-spec.json  # Cas de test grammaire wikilinks
├── docker-compose.yml        # MySQL + Redis + phpMyAdmin
└── CLAUDE.md
```

## Commandes

- **Front** (`frontend/`) : `npm run dev`, `npm run build`, `npm run lint`, `npm run generate:api`.
- **Back** (`backend/`) : `./mvnw spring-boot:run`, `./mvnw test`.
- **Infra** : `docker compose up`.

## Conventions front

- TypeScript strict, pas de `any` non justifié.
- Composants `.tsx`, hooks `.ts`, PascalCase / `useCamelCase`. Alias `@/` → `src/`.
- Tailwind only ; pas de CSS Modules, pas de styled-components.
- Zustand = state UI uniquement, un store par domaine. Tout ce qui vient du back passe par TanStack Query.
- Query keys en tableau (`['notes', id]`, `['notes', 'titles']`). Fetchers centralisés dans `src/api/`.
- Types DTO **générés** depuis OpenAPI, jamais réécrits à la main.

## Conventions back

- Couches `controller → service → repository → entity`. Controllers n'accèdent jamais aux repositories.
- Packages **par feature** (`note/`, `link/`, `user/`, `graph/`, `auth/`).
- DTOs obligatoires en entrée/sortie. Mapping manuel dans le service (pas de MapStruct).
- Validation via `jakarta.validation`.
- `@Transactional` sur toute opération qui touche plusieurs tables.
- Migrations Flyway uniquement. `hibernate.ddl-auto=validate` en prod.

## API REST

Préfixe `/api/v1/`, pluriel pour les collections, erreurs JSON via `@ControllerAdvice`. Doc OpenAPI sur `/swagger-ui`.

## Routes React Router v6

- `/login` — Connexion
- `/register` — Inscription (libre, pas de validation admin)
- `/notes` — Liste des notes + écran d'accueil
- `/notes/:id` — Éditeur split view
- `/graph` — Vue graphique
- `/settings` — Préférences du compte

## Modèle de données

- **User** : `id`, `username`, `email`, `passwordHash` (bcrypt strength 12), `createdAt`. Créé via inscription publique (`POST /api/v1/auth/register`).
- **Note** : `id`, `title` (unique par user), `content` (markdown GFM), `createdAt`, `updatedAt`, `userId`.
- **Link** : `id`, `sourceId`, `targetId`, `createdAt`. Source de vérité du graphe.

**Contraintes MySQL** :
- `UNIQUE (user_id, title)` sur Note.
- `UNIQUE (source_id, target_id)` sur Link.
- `ON DELETE CASCADE` sur les deux FK de Link → suppression d'une note supprime ses liens, jamais d'autres notes.

**Isolation des données** : toutes les requêtes filtrent systématiquement par `userId` extrait de la session. Un user ne peut jamais accéder aux données d'un autre, même en manipulant les IDs dans l'URL.

**Collation `utf8mb4_0900_as_ci`** sur `title` : case-insensitive, accent-sensitive. Normalisation NFC côté Java avant insertion. Conséquence : unicité, résolution wikilinks et recherche sont toutes case-insensitive de façon cohérente. **MySQL 8+ requis.**

## Wikilinks

Format : `[[Titre]]`. Pas d'alias, pas d'ancres, pas de saut de ligne dans le titre. Grammaire et cas limites dans `docs/wikilinks-spec.json` — source unique consommée par les tests back et front.

Regex : `\[\[([^\[\]\n]+)\]\]` (Java) / `/\[\[([^\[\]\n]+)\]\]/g` (JS).

**Parsing côté back uniquement**, au save (`LinkSyncService`). Le front peut parser pour le rendu, jamais pour la persistance. Comportements :

- **Save d'une note A** : diff entre wikilinks actuels et `Link` existants de A. Insère les nouveaux, supprime les obsolètes. Une seule requête `WHERE title IN (...)` pour résoudre (pas de N+1).
- **Liens cassés ignorés** : un `[[Truc]]` vers une note inexistante n'est pas stocké.
- **Self-links filtrés** : un `[[A]]` dans A n'est pas un Link.
- **Réconciliation au create/rename d'une note B** : scan des notes qui contiennent `[[B]]` pour matérialiser les liens qui étaient cassés.

**Cache Redis** : `HASH user:{userId}:titles` = map `title → noteId`. Mis à jour à chaque create/rename/delete. Utilisé pour la résolution rapide et alimente `GET /notes/titles`.

## Endpoint `/notes/titles`

Liste `{id, title}` du user connecté, lue depuis Redis. Cache front via TanStack Query (`['notes', 'titles']`), invalidé sur create/rename/delete. Sert à l'autocomplétion CodeMirror et à distinguer visuellement les wikilinks cassés.

## Recherche

`GET /api/v1/notes/search?q=...&limit=20` → `LIKE '%query%'` sur title + content, filtré par `userId`, tri par `updated_at` desc. Échapper `\`, `%`, `_` côté Java. OK jusqu'à ~5000 notes ; au-delà, basculer sur un index FULLTEXT.

## Auth

- **Inscription** : `POST /api/v1/auth/register` — email + username + password. Validation des champs, hash bcrypt, création du User, session ouverte immédiatement.
- **Connexion** : `POST /api/v1/auth/login` — email + password. Session Redis créée.
- **Déconnexion** : `POST /api/v1/auth/logout` — session invalidée.
- **Session** : `server.servlet.session.timeout=7d`, sliding. Un `401` côté front → redirection `/login`.
- **Rate limiting** sur `/login` et `/register` : **obligatoire avant mise en prod** (Bucket4j). Seule surface d'attaque significative.

## Tests

- **Back** : JUnit 5 + Mockito + `@SpringBootTest`. Obligatoire sur services, controllers, parser wikilinks (doit passer 100% de `wikilinks-spec.json`). Testcontainers pour l'intégration MySQL/Redis.
- **Front** : remis à plus tard (Vitest + React Testing Library prévus).

## Variables d'env

- **Back** : profils Spring `dev` (versionné) et `prod` (non versionné). Activer via `SPRING_PROFILES_ACTIVE`. Secrets sensibles via variables d'env système.
- **Front** : `frontend/.env` non versionné, `.env.example` versionné. Préfixe `VITE_` obligatoire.

## CORS et cookies

CORS configuré dans `CorsConfig` (origine via `app.cors.allowed-origin`), `allowCredentials=true`. Front envoie `credentials: 'include'` sur chaque requête (configuré dans le fetcher commun).

**En prod, si front et back sur domaines différents** : cookie en `SameSite=None; Secure` → **HTTPS obligatoire**.

## Non-objectifs (v1)

- Pas de partage de notes entre utilisateurs.
- Pas de collaboration live, pas de WebSocket.
- Pas de SSR. Pas de GraphQL. Pas de JWT.
- Pas de soft delete (`DELETE` est définitif, confirmation côté UI).
- Pas de rate limiting en dev (obligatoire avant prod publique).

## Sauvegarde

`mysqldump` cron, stocké hors machine. À mettre en place dès le déploiement. Redis n'a pas besoin de backup (reconstructible).

## Règles de contribution

- Vérifier `package.json` / `pom.xml` avant de suggérer une lib.
- Ouvrir la discussion avant d'ajouter une dépendance lourde.
- Toute nouvelle entité JPA = entity + repo + service + controller + DTO(s) + tests + migration Flyway.
- Toute modif de DTO → `npm run generate:api`.
- Toute modif du schéma DB → migration Flyway, jamais `ddl-auto`.
- Toute évolution de la grammaire wikilinks → mettre à jour `wikilinks-spec.json` en premier.
- Toute modif d'un titre (create/rename) → invalider Redis + lancer la réconciliation.
- Toutes les requêtes filtrées par `userId` — ne jamais exposer les données d'un user à un autre.