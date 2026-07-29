# Poke Finder

A small Angular app for paging through the Pokedex and leaving feedback.
Built for an assignment that asked for client-side routing, an HTTP
service talking to a public API, and a validated reactive form.

**Live demo:** _add your deployed URL here once you've published it (see
[Deploying](#deploying) below)._

## What it does

- **Home** - a landing page explaining what the app is for, with links into
  the other two pages.
- **Pokedex** - browses all 1300+ Pokemon from
  [PokeAPI](https://pokeapi.co/), with real Previous/Next pagination
  (20 per page) driven by the API's own offset/limit params, plus a search
  box to look up one Pokemon by exact name.
- **Feedback** - a reactive form (trainer name, email, a rating dropdown,
  and an optional comment box) with inline validation. Nothing is
  submitted to a server; on a valid submit it logs the value to the
  console and shows a thank-you state, which is enough to prove the form
  and its validators actually work end to end.

## Stack

Angular 22, standalone components (no NgModules), the newer `@Service()` /
`inject()` style instead of constructor injection, signals for local
component state, and the new `@if` / `@for` control-flow syntax in
templates instead of `*ngIf` / `*ngFor`. Styling is plain SCSS, no
component library.

## Project layout

```
src/app/
  app.ts / app.html / app.scss       root shell - just the nav + <router-outlet>
  app.routes.ts                       the three lazy-loaded routes
  app.config.ts                       providers: router + HttpClient

  pages/
    home/                             landing page
    pokedex/                          API data page (browse + search)
    feedback/                         reactive form page

  services/
    poke-catalog.ts                   wraps HttpClient, talks to PokeAPI

  models/
    pokemon.ts                        the API's raw response shape + the
                                       trimmed-down shape the UI actually uses

  shared/
    nav/                              the nav bar component
```

## Running it locally

You'll need Node 22 (or the CLI's other supported majors - check
`npx ng version` if you're not sure).

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

To run the unit tests:

```bash
npm test
```

There are 22 tests across the service, the three pages, and the nav bar -
including ones that mock a failed lookup, a not-found search, and the
form's validators (bad email, empty required fields, a comment over the
length limit, and so on). One thing worth calling out if you're reading
the specs: `HttpClient`'s `params` option builds the query string
separately from `request.url`, so a matcher checking for `offset=20` has
to look at `request.urlWithParams`, not `request.url` - that one cost me
a debugging session, and the tests are written the correct way now.

To produce a production build:

```bash
npm run build
```

Output goes to `dist/poke-finder/browser` - that's the folder you point
any static host at.

## Deploying

This is a static SPA, so it'll run on pretty much any static host. Three
options, in the order I'd actually try them:

### GitHub Pages (already wired up)

There's a workflow at `.github/workflows/deploy.yml` that builds the app,
runs the tests, and publishes to Pages automatically on every push to
`main`. All you need to do:

1. Push this repo to GitHub.
2. In the repo settings, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or re-run the workflow manually from the Actions tab).

The workflow works out the `--base-href` from the repo name automatically,
so it doesn't matter what you call the repo. It also copies `index.html` to
`404.html` after the build - GitHub Pages has no server-side rewrites, so
without that trick a direct link to `/pokedex` or a page refresh on
`/feedback` would 404 instead of loading the Angular router.

Your site will end up at `https://<your-username>.github.io/<repo-name>/`.

### Netlify or Vercel

Both platforms can build straight from the GitHub repo with zero extra
setup - `netlify.toml` and `vercel.json` are already in the repo with the
right build command, output directory, and SPA redirect rule. Just
"import project from Git" on either platform and it should build correctly
without touching any settings.

### Manual / any other static host

```bash
npm run build
```

then upload the contents of `dist/poke-finder/browser` wherever you like.
If you're not hosting at the domain root, pass `--base-href /your-path/` to
the build command, matching wherever the files will actually live.

## Notes on the API

PokeAPI's list endpoint (`GET /pokemon?offset=&limit=`) only returns a
name and a detail URL per entry, not a sprite image. Rather than firing a
second request per Pokemon just to get an image, the id is pulled straight
out of the detail URL (which looks like
`https://pokeapi.co/api/v2/pokemon/25/`) and used to build a sprite URL
directly against the public sprite CDN. Search works differently - PokeAPI
only supports an exact name lookup (`GET /pokemon/{name}`), not fuzzy or
partial matching, which is why the UI is upfront that "pika" won't find
Pikachu but "pikachu" will.
