# Galaxy

App de prise de notes (style Obsidian) avec vue graphique des liens. **Un compte par instance**, pas de partage, pas de collaboration.

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
├── docker-compose.yml        # MySQL + Redis
└── CLAUDE.md
```

## Commandes

- **Front** (`frontend/`) : `npm run dev`, `npm run build`, `npm run lint`, `npm run generate:api` (régénère les types depuis `/v3/api-docs`).
- **Back** (`backend/`) : `./mvnw spring-boot:run`, `./mvnw test`.
- **Infra** : `docker compose up -d`.

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

## Modèle de données

- **User** : un seul enregistrement par instance, créé au démarrage par un `CommandLineRunner` qui lit `app.admin.username` + `app.admin.password-hash` (bcrypt strength 12).
- **Note** : `id`, `title` (unique par user), `content` (markdown GFM), timestamps, `userId`.
- **Link** : `sourceId`, `targetId`, `createdAt`. Source de vérité du graphe.

**Contraintes MySQL** :
- `UNIQUE (user_id, title)` sur Note.
- `UNIQUE (source_id, target_id)` sur Link.
- `ON DELETE CASCADE` sur les deux FK de Link → suppression d'une note supprime ses liens, jamais d'autres notes.

**Collation `utf8mb4_0900_as_ci`** sur `title` : case-insensitive, accent-sensitive. Normalisation NFC côté Java avant insertion (évite que "Café" NFC ≠ "Café" NFD). Conséquence : unicité, résolution wikilinks et recherche sont toutes case-insensitive et accent-sensitive de façon cohérente. **MySQL 8+ requis.**

## Wikilinks

Format : `[[Titre]]`. Pas d'alias, pas d'ancres, pas de saut de ligne dans le titre. Grammaire et cas limites dans `docs/wikilinks-spec.json` — **source unique** consommée par les tests back et (à venir) front.

Regex : `\[\[([^\[\]\n]+)\]\]` (Java) / `/\[\[([^\[\]\n]+)\]\]/g` (JS).

**Parsing côté back uniquement**, au save (`LinkSyncService`). Le front peut parser pour le rendu, jamais pour la persistance. Comportements :

- **Save d'une note A** : on calcule le diff entre les wikilinks actuels et les `Link` existants de A. On insère les nouveaux, on supprime les obsolètes. Une seule requête `WHERE title IN (...)` pour résoudre (pas de N+1).
- **Liens cassés ignorés** : un `[[Truc]]` vers une note inexistante n'est pas stocké.
- **Self-links filtrés** : un `[[A]]` dans A n'est pas un Link.
- **Réconciliation au create/rename d'une note B** : on scan les notes qui contiennent `[[B]]` pour matérialiser les liens qui étaient cassés. Sans ça, écrire `[[Calvin]]` avant de créer Calvin ne créerait jamais le lien.

**Cache Redis** : `HASH user:{userId}:titles` = map `title → noteId`. Mis à jour à chaque create/rename/delete (best effort hors transaction MySQL — reconstructible). Utilisé pour la résolution rapide et alimente `GET /notes/titles`.

## Endpoint `/notes/titles`

Liste de tous les titres `{id, title}` du user, lue depuis Redis. Cache front via TanStack Query (`['notes', 'titles']`), à invalider sur create/rename/delete. Sert à l'autocomplétion CodeMirror et à distinguer visuellement les wikilinks cassés.

## Recherche

`GET /api/v1/notes/search?q=...&limit=20` → `LIKE '%query%'` sur title + content, tri par `updated_at` desc. Échapper `\`, `%`, `_` du query côté Java. OK jusqu'à ~5000 notes ; au-delà, basculer sur un index FULLTEXT (sans changer l'API).

## Tests

- **Back** : JUnit 5 + Mockito + `@SpringBootTest`. Obligatoire sur services, controllers, parser wikilinks (doit passer 100% de `wikilinks-spec.json`). Testcontainers pour l'intégration MySQL/Redis.
- **Front** : remis à plus tard (Vitest + React Testing Library prévus).

## Variables d'env

- **Back** : profils Spring `dev` (versionné) et `prod` (non versionné, contient le hash bcrypt admin). Activer via `SPRING_PROFILES_ACTIVE`. Les secrets très sensibles peuvent passer par variables d'env système.
- **Front** : `frontend/.env` non versionné, `.env.example` versionné. Préfixe `VITE_` obligatoire pour exposer au navigateur.

## CORS et cookies

CORS configuré dans `CorsConfig` (origine via `app.cors.allowed-origin`), `allowCredentials=true`. Front envoie `credentials: 'include'` sur chaque requête (configuré dans le fetcher commun).

**En prod, si front et back sur domaines différents** : cookie en `SameSite=None; Secure` (config dans `application-prod.properties`) → **HTTPS obligatoire**, sinon le cookie ne part pas.

## Session

`server.servlet.session.timeout=7d`, sliding. Un `401` côté front déclenche redirection vers `/login` via intercepteur. Logout via `POST /api/v1/auth/logout`.

## Non-objectifs

- Pas de multi-user, pas de partage, pas de collaboration live, pas de WebSocket.
- Pas de SSR. Pas de GraphQL. Pas de JWT. Pas de soft delete (`DELETE` est définitif, confirmation côté UI).
- **Pas de rate limiting sur `/login` en v1** — à ajouter impérativement avant toute exposition publique (seule surface d'attaque non protégée).

## Sauvegarde

`mysqldump` cron, stocké hors machine. À mettre en place dès le déploiement et tester la restauration une fois. Redis n'a pas besoin de backup (reconstructible).

## Règles de contribution

- Vérifier `package.json` / `pom.xml` avant de suggérer une lib.
- Ouvrir la discussion avant d'ajouter une dépendance lourde.
- Toute nouvelle entité JPA = entity + repo + service + controller + DTO(s) + tests + migration Flyway.
- Toute modif de DTO → `npm run generate:api`.
- Toute modif du schéma DB → migration Flyway, jamais `ddl-auto`.
- Toute évolution de la grammaire wikilinks → mettre à jour `wikilinks-spec.json` en premier.
- Toute modif d'un titre (create/rename) → invalider Redis + lancer la réconciliation.