const API = "http://localhost:3000";

export async function apiGetPokemons(page = 1, limit = 20) {
  const r = await fetch(`${API}/pokemons?page=${page}&limit=${limit}`);
  if (!r.ok) throw new Error("Erreur chargement");
  return r.json();
}

export async function apiGetPokemonById(id) {
  const r = await fetch(`${API}/pokemons/${id}`);
  if (!r.ok) throw new Error("Introuvable");
  return r.json();
}

/* 🔍 SEARCH multi-langues */
export async function apiSearchPokemonByName(name) {
  const r = await fetch(
    `${API}/pokemons/search?name=${encodeURIComponent(name)}`
  );
  if (!r.ok) throw new Error("Introuvable");
  return r.json(); // { pokemon, matchedField, matchedValue }
}

/* ✨ AUTOCOMPLETE */
export async function apiSuggestPokemons(query, limit = 8) {
  if (!query) return { items: [] };
  const r = await fetch(
    `${API}/pokemons/suggest?query=${encodeURIComponent(query)}&limit=${limit}`
  );
  if (!r.ok) throw new Error("Erreur suggestions");
  return r.json(); // { items }
}

export async function apiCreatePokemon(payload) {
  const r = await fetch(`${API}/pokemons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function apiUpdatePokemon(id, payload) {
  const r = await fetch(`${API}/pokemons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function apiDeletePokemon(id) {
  const r = await fetch(`${API}/pokemons/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function apiUploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const r = await fetch(`${API}/upload`, {
    method: "POST",
    body: fd,
  });

  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
