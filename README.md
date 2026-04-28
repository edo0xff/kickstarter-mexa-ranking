# Kickstarter Mexa Ranking

Ranking de los proyectos y estudios mexicanos que más recaudan en Kickstarter

Un sitio web estático construido con **Astro** que automáticamente:
- Compila datos de proyectos y creadores exitosos en Kickstarter
- Calcula tendencias de ranking (▲ sube, ▼ baja, — igual, ✦ nuevo)
- Se actualiza diariamente via GitHub Actions
- Se despliega automáticamente en GitHub Pages

---

## Características

- **Integración automática** con [`kickstarter-mexa-statistics`](https://github.com/edo0xff/kickstarter-mexa-statistics)
- **CI/CD completo** con GitHub Actions: scraping → commit → deploy

---

## Estructura del Proyecto

```
kickstarter-mexa-ranking/
├── data/
│   ├── current/ks_stats.yaml      # Datos actuales (actualizado por GHA)
│   └── last/ks_stats.yaml         # Datos anteriores (para calcular tendencias)
├── src/
│   ├── pages/
│   │   └── index.astro            # Página única
│   ├── components/
│   │   ├── RankingTable.astro     # Tabla reutilizable
│   │   └── TrendBadge.astro       # Badges de tendencia
│   ├── lib/
│   │   ├── loadData.ts            # Parser de YAML en build-time
│   │   └── trend.ts               # Lógica de tendencias
│   └── styles/
│       └── global.css             # Estilos + tema
├── scripts/
│   └── rotate-data.mjs            # Rota datos: current → last
├── .github/workflows/
│   └── update.yml                 # GitHub Actions workflow
├── astro.config.mjs
└── package.json
```

---

## Instalación

```bash
# 1. Clonar repo
git clone <repo-url>
cd kickstarter-mexa-ranking

# 2. Instalar dependencias
npm install
```

---

## Testear en Local

### Opción A: Sin scraper (Frontend only)

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321)

Para probar las tendencias, edita `data/last/ks_stats.yaml` manualmente (cambia el orden de algunos items) y el dev server recalcula automáticamente.

### Opción B: Con scraper completo

```bash
# 1. Instala el scraper
pip install "git+https://github.com/edo0xff/kickstarter-mexa-statistics.git"

# 2. Rota y scrapea
node scripts/rotate-data.mjs
ks-stats run --output-format yaml --output-file data/current/ks_stats.yaml --top-n 20 --no-show-chart

# 3. Levanta dev server
npm run dev
```

---

## Comandos

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia dev server en `localhost:4321` |
| `npm run build:static` | Build sin scraper (requiere `data/current/ks_stats.yaml` existente) |
| `npm run build` | Build completo: rota datos → scrapea → Astro build |
| `npm run preview` | Previsualiza el build producción |

---

## CI/CD: GitHub Actions

El workflow automático (`.github/workflows/update.yml`):

1. **Cron diario** a las 06:00 UTC (modificable)
2. Instala el scraper desde GitHub
3. Rota `data/current/` → `data/last/`
4. Ejecuta el scraper: `ks-stats run --output-format yaml ...`
5. Commitea archivos `.yaml` actualizados con mensajes `[skip ci]`
6. Ejecuta `npm run build:static`
7. Deploya a GitHub Pages

### Configuración requerida

1. Ir a **Settings → Pages**
2. Source: **GitHub Actions**
3. Los workflows tienen permisos de lectura/escritura automáticos

---

## Tema Oscuro/Claro

El sitio detecta automáticamente la preferencia del sistema (`prefers-color-scheme`) pero permite toggle manual. La elección se guarda en `localStorage`.

**Variables CSS** disponibles en `src/styles/global.css`:
- `--bg`, `--text` — fondos y textos
- `--trend-up`, `--trend-down`, `--trend-same`, `--trend-new` — colores de badges
- `--link`, `--accent` — colores principales

---

## Dependencias

- **[Astro](https://astro.build)** — Static site generator (v6.1+)
- **[js-yaml](https://github.com/nodeca/js-yaml)** — Parser YAML en build-time
- **[kickstarter-mexa-statistics](https://github.com/edo0xff/kickstarter-mexa-statistics)** — Scraper de Kickstarter (via pip)

---

## Estructura de datos YAML

```yaml
metadata:
  generated_at: "2026-04-28T12:00:00+00:00"
  country_code: MX
  category: Video Games
  project_state: successful

summary:
  total_records: 500
  scoped_records: 25
  top_n: 20

fx:
  base: USD
  rates:
    MXN: 17.50
    # ...

rankings:
  top_projects:
    - name: "Mi Proyecto"
      creator: "Mi Estudio"
      country: MX
      location: "Ciudad de México"
      currency: USD
      pledged_original: 50000
      usd: 50000
      url: "https://..."
      project_image_url: "https://..."
  
  top_creators:
    - creator: "Mi Estudio"
      projects: 3
      usd_total: 150000
      mxn_total: 2625000
      creator_url: "https://..."
      creator_photo_url: "https://..."
```

---

## Cómo funciona la tendencia

En build-time (`src/pages/index.astro`):

1. Se cargan ambos YAML: `current` y `last`
2. Se indexan por clave (proyecto `name`, creador `creator`)
3. Se compara el rank nuevo vs antiguo:
   - **▲** verde: `new_rank < old_rank` (mejoró)
   - **▼** rojo: `new_rank > old_rank` (empeoró)
   - **—** gris: sin cambio
   - **✦** morado: nuevo item no en `last`

---

## Notas

- Los datos YAML se commitean en el repo
- El scraper respeta los delays para evitar bloqueos de Kickstarter

---

## Enlaces

- [Kickstarter](https://www.kickstarter.com)
- [kickstarter-mexa-statistics](https://github.com/edo0xff/kickstarter-mexa-statistics)
- [Astro docs](https://docs.astro.build)

---

## Contribuciones

[@edo0xff](https://github.com/edo0xff)
