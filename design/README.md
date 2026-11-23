# Design

| Folder | What it is |
|---|---|
| `prototype/` | Clickable React prototype, organised by release version (`prototype/versions/v1-mvp`, `v2-…`). See `prototype/README.md`. |
| `prototype-staging/` | Staging copy of `prototype/` for trying changes first. Runs on port 5174 (`npm run dev --prefix design/prototype-staging`). Once a change is approved, copy it to `prototype/`, which is the version shared with the client on port 5173. |
