// Config: FCC proxy (works for the FCC project)
const BASE = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";

// Elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const typesEl = document.getElementById("types");
const imgEl = document.getElementById("sprite");

// Helpers
const setStatus = (msg, cls = "") => {
  statusEl.className = cls;
  statusEl.textContent = msg || "";
};

const setText = (id, value = "") => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

// Prefer official artwork; fall back to default sprite
const spriteFrom = (data) =>
  data.sprites?.other?.["official-artwork"]?.front_default ||
  data.sprites?.front_default ||
  "";

// Simple in-memory cache
const cache = new Map();

const normalizeQuery = (q) =>
  q.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

const fetchPokemon = async (q) => {
  const key = normalizeQuery(q);
  if (!key) throw new Error("Please enter a name or ID.");
  if (cache.has(key)) return cache.get(key);

  const url = `${BASE}/${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Pokémon not found.");
    throw new Error("Failed to fetch Pokémon.");
  }
  const json = await res.json();
  cache.set(key, json);
  return json;
};

const render = (data) => {
  // Clear
  typesEl.innerHTML = "";
  imgEl.src = "";

  // Basic fields
  setText("pokemon-name", (data.name || "").toUpperCase());
  setText("pokemon-id", `#${data.id ?? ""}`);
  setText("weight", `${data.weight ?? ""}`);
  setText("height", `${data.height ?? ""}`);

  // Stats
  const getStat = (name) =>
    data.stats?.find((s) => s.stat?.name === name)?.base_stat ?? "";

  setText("hp", `${getStat("hp")}`);
  setText("attack", `${getStat("attack")}`);
  setText("defense", `${getStat("defense")}`);
  setText("special-attack", `${getStat("special-attack")}`);
  setText("special-defense", `${getStat("special-defense")}`);
  setText("speed", `${getStat("speed")}`);

  // Types as badges
  (data.types || []).forEach((t) => {
    const div = document.createElement("div");
    div.className = "type-badge";
    div.textContent = (t.type?.name || "").toUpperCase();
    typesEl.appendChild(div);
  });

  // Sprite
  const src = spriteFrom(data);
  if (src) {
    imgEl.src = src;
    imgEl.alt = `${(data.name || "Pokémon")} sprite`;
  }

  resultEl.hidden = false;
};

// Submit/search flow
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = input.value;

  try {
    resultEl.hidden = true;
    setStatus("Loading…", "loading");
    const data = await fetchPokemon(q);
    render(data);
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Something went wrong", "error");
    resultEl.hidden = true;
  }
});

// Keep “click” on button working too (form handles submit)
document.getElementById("search-button").addEventListener("click", (e) => {
  // No-op: form submit handles it
});

// Quick UX: press "/" to focus search
window.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
    input.select();
  }
});
