# Pokémon Search 🔎✨

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://coolharry1976.github.io/pokemon-search/)
[![Made with Vanilla JS](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)](#)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)

A minimal Pokémon search app that fetches data by name or Pokédex ID via the FreeCodeCamp PokéAPI proxy.

<img alt="App screenshot" src="screenshot.png" width="720" />

## Features
- Search by name **or** number
- Official artwork, types, height/weight, base stats
- Keyboard shortcut: **/** to focus search
- Inline status messages + simple in-memory cache

## Tech
- HTML, CSS, JavaScript (no frameworks)
- API: `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/<name-or-id>`

## Run locally
```bash
# from the project folder
py -m http.server 5500
# open http://localhost:5500/
