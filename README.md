# Poke Finder

A small Angular app for paging through the Pokedex and leaving feedback.
Built for an assignment that asked for client-side routing, an HTTP
service talking to a public API, and a validated reactive form.

**Live demo:** (see
[Deploying](#deploying) below)._

## What it does

- **Home** - a landing page explaining what the app is for, with links into
  the other two pages.
- **Pokedex** - browses all 1300+ Pokemon from
  [PokeAPI](https://pokeapi.co/), with Previous/Next pagination
  (20 per page) driven by the API's own offset/limit params, plus a search
  box to look up one Pokemon by exact name.
- **Feedback** - a reactive form (trainer name, email, a rating dropdown,
  and an optional comment box) with inline validation. Nothing is
  submitted to a server; on a valid submit it logs the value to the
  console and shows a thank-you state, which is enough to prove the form
  and its validators actually work.

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

You'll need Node 22 (or the CLI's other supported majors).

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

To run the unit tests:

```bash
npm test
```

To produce a production build:

```bash
npm run build
```

Output goes to `dist/poke-finder/browser`

## Deploying

This is a static SPA, so it'll run on pretty much any static host. Three
options, in the order I'd actually try them:

### Manual / any other static host

```bash
npm run build
```

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
