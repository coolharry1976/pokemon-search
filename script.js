console.log("script.js loaded");

const BASE = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const typesEl = document.getElementById("types");
const imgEl = document.getElementById("sprite");
const themeBtn = document.getElementById("theme-toggle");

// Status helpers
const showSpinner = () => {
  statusEl.className = "loading";
  statusEl.innerHTML = '<div class="spinner" aria-label="Loading"></div>';
};
const clearStatus = () => {
  statusEl.className = "";
  statusEl.textContent = "";
};
const showError = (msg) => {
  statusEl.className = "error";
  statusEl.textContent = msg;
};

const setText = (id, value = "") => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const spriteFrom = (data) =>
  data.sprites?.other?.["official-artwork"]?.front_default ||
  data.sprites?.front_default ||
  "";

const cache = new Map();
const normalizeQuery = (q) => q.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

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
  typesEl.innerHTML = "";
  imgEl.src = "";

  setText("pokemon-name", (data.name || "").toUpperCase());
  setText("pokemon-id", `#${data.id ?? ""}`);
  setText("weight", `${data.weight ?? ""}`);
  setText("height", `${data.height ?? ""}`);

  const getStat = (name) =>
    data.stats?.find((s) => s.stat?.name === name)?.base_stat ?? "";

  setText("hp", `${getStat("hp")}`);
  setText("attack", `${getStat("attack")}`);
  setText("defense", `${getStat("defense")}`);
  setText("special-attack", `${getStat("special-attack")}`);
  setText("special-defense", `${getStat("special-defense")}`);
  setText("speed", `${getStat("speed")}`);

  (data.types || []).forEach((t) => {
    const div = document.createElement("div");
    div.className = "type-badge";
    div.textContent = (t.type?.name || "").toUpperCase();
    typesEl.appendChild(div);
  });

  const src = spriteFrom(data);
  if (src) {
    imgEl.src = src;
    imgEl.alt = `${(data.name || "Pokémon")} sprite`;
  }

  resultEl.hidden = false;
};

// Search
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = input.value;
  try {
    resultEl.hidden = true;
    showSpinner();
    const data = await fetchPokemon(q);
    render(data);
    clearStatus();
  } catch (err) {
    showError(err.message || "Something went wrong");
    resultEl.hidden = true;
  }
});

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
    input.select();
  } else if (e.key === "Escape") {
    input.value = "";
    clearStatus();
    resultEl.hidden = true;
  }
});

// Dark/light theme toggle
const applyTheme = (mode) => {
  document.documentElement.classList.toggle("dark", mode === "dark");
  themeBtn.setAttribute("aria-pressed", String(mode === "dark"));
  localStorage.setItem("theme", mode);
};
const saved = localStorage.getItem("theme");
applyTheme(saved || "light");

themeBtn.addEventListener("click", () => {
  const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
  applyTheme(next);
});
