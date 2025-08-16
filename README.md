# Pokémon Search (FreeCodeCamp Project)

A minimal client-side app to search Pokémon by name or ID using the public FreeCodeCamp PokéAPI proxy.

## Features
- Search by name or Pokédex number
- Official artwork, types, height/weight, base stats
- Keyboard shortcut: `/` to focus the search
- In-memory cache for faster repeated lookups

## Tech
- HTML + CSS + JavaScript (no frameworks)
- API: https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/<name-or-id>

## Run locally
```bash
# from the project folder
python -m http.server 5173
# open http://localhost:5173/
```

## Deploy to GitHub Pages
1. Create a GitHub repo and push this folder.
2. In the repo: **Settings → Pages**
3. **Source**: `Deploy from a branch`
4. **Branch**: `main` and **Folder**: `/ (root)`
5. Save — the URL appears on the same page.

## License
MIT
