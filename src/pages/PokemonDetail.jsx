import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  apiDeletePokemon,
  apiGetPokemonById,
  apiUpdatePokemon,
  apiUploadImage,
} from "../api";

const ALLOWED_TYPES = [
  "Normal","Fire","Water","Grass","Electric","Ice","Fighting","Poison",
  "Ground","Flying","Psychic","Bug","Rock","Ghost","Dark","Dragon","Steel","Fairy",
];

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poke, setPoke] = useState(null);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const [confirm, setConfirm] = useState(false);

  const [form, setForm] = useState({
    english: "",
    french: "",
    japanese: "",
    chinese: "",
    types: [], // <-- important
    image: "",
    HP: 1,
    Attack: 1,
    Defense: 1,
    SpecialAttack: 1,
    SpecialDefense: 1,
    Speed: 1,
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(null);

      try {
        const p = await apiGetPokemonById(id);
        setPoke(p);

        setForm({
          english: p.name?.english ?? "",
          french: p.name?.french ?? "",
          japanese: p.name?.japanese ?? "",
          chinese: p.name?.chinese ?? "",
          types: Array.isArray(p.type) ? p.type : [],
          image: p.image ?? "",
          HP: p.base?.HP ?? 1,
          Attack: p.base?.Attack ?? 1,
          Defense: p.base?.Defense ?? 1,
          SpecialAttack: p.base?.SpecialAttack ?? 1,
          SpecialDefense: p.base?.SpecialDefense ?? 1,
          Speed: p.base?.Speed ?? 1,
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onToggleType = (t) => {
    setForm((f) => {
      const has = f.types.includes(t);
      const next = has ? f.types.filter((x) => x !== t) : [...f.types, t];
      // option: limiter à 2 types comme les vrais pokemons
      if (next.length > 2) return f;
      return { ...f, types: next };
    });
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr(null);
    setUploading(true);
    try {
      const { url } = await apiUploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!poke) return;

    setErr(null);
    setSaving(true);

    try {
      const payload = {
        ...poke,
        name: {
          english: form.english.trim(),
          french: form.french.trim(),
          japanese: form.japanese.trim(),
          chinese: form.chinese.trim(),
        },
        type: form.types, // <-- validé par sélection
        base: {
          HP: Number(form.HP),
          Attack: Number(form.Attack),
          Defense: Number(form.Defense),
          SpecialAttack: Number(form.SpecialAttack),
          SpecialDefense: Number(form.SpecialDefense),
          Speed: Number(form.Speed),
        },
        image: form.image.trim(),
      };

      const updated = await apiUpdatePokemon(poke.id, payload);
      setPoke(updated);
      setForm((f) => ({ ...f, types: updated.type ?? f.types }));
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!poke) return;

    setErr(null);
    try {
      await apiDeletePokemon(poke.id);
      navigate("/");
    } catch (e) {
      setErr(e.message);
      setConfirm(false);
    }
  };

  if (loading) return <p style={{ color: "white" }}>Chargement…</p>;
  if (err) return <p style={{ color: "#ffb4b4", fontWeight: 900 }}>Erreur : {err}</p>;
  if (!poke) return <p style={{ color: "white" }}>Introuvable</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <Link to="/" className="pokeBtn">← Retour</Link>
      </div>

      <h2 style={{ textAlign: "center", color: "white", marginBottom: 14 }}>
        {poke.name?.english} (#{poke.id})
      </h2>

      <div className="pokeCardPanel">
        <div className="pokeGrid2" style={{ alignItems: "start" }}>
          {/* Image */}
          <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
            <img
              src={form.image || poke.image}
              alt={poke.name?.english}
              className="pokePreview"
              style={{ width: 260, height: 260 }}
            />

            <div className="pokeField" style={{ width: "100%" }}>
              <div className="pokeLabel">Changer l’image (upload)</div>
              <input className="pokeFile" type="file" accept="image/*" onChange={onUpload} />
              <div className="pokeHelp">{uploading ? "Upload en cours…" : "Upload → URL auto"}</div>
            </div>

            <div className="pokeField" style={{ width: "100%" }}>
              <div className="pokeLabel">Image URL</div>
              <input
                className="pokeInput"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="http://localhost:3000/assets/uploads/xxx.png"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSave} className="pokeForm" style={{ margin: 0 }}>
            {/* Langues */}
            <section className="pokeCardPanel" style={{ padding: 14 }}>
              <div className="pokeLabel" style={{ marginBottom: 10, textAlign: "center" }}>
                Noms (toutes les langues)
              </div>

              <div className="pokeGrid2">
                <div className="pokeField">
                  <div className="pokeLabel">English</div>
                  <input className="pokeInput" value={form.english} onChange={set("english")} />
                </div>

                <div className="pokeField">
                  <div className="pokeLabel">Français</div>
                  <input className="pokeInput" value={form.french} onChange={set("french")} />
                </div>

                <div className="pokeField">
                  <div className="pokeLabel">Japanese</div>
                  <input className="pokeInput" value={form.japanese} onChange={set("japanese")} />
                </div>

                <div className="pokeField">
                  <div className="pokeLabel">Chinese</div>
                  <input className="pokeInput" value={form.chinese} onChange={set("chinese")} />
                </div>
              </div>
            </section>

            {/* Types = validation par sélection */}
            <section className="pokeCardPanel" style={{ padding: 14 }}>
              <div className="pokeLabel" style={{ textAlign: "center", marginBottom: 10 }}>
                Types (clique pour sélectionner — max 2)
              </div>

              <div className="typePicker">
                {ALLOWED_TYPES.map((t) => {
                  const on = form.types.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`typeChip ${on ? "isOn" : ""}`}
                      onClick={() => onToggleType(t)}
                      aria-pressed={on}
                    >
                      <span className="typeChipDot" />
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="pokeHelp" style={{ textAlign: "center", marginTop: 10 }}>
                Sélection actuelle : <b style={{ color: "white" }}>{form.types.join(", ") || "Aucun"}</b>
              </div>
            </section>

            {/* Stats */}
            <section className="pokeCardPanel" style={{ padding: 14 }}>
              <div className="pokeLabel" style={{ marginBottom: 10, textAlign: "center" }}>
                Stats
              </div>

              <div className="pokeGrid3">
                {[
                  ["HP", "PV"],
                  ["Attack", "Attaque"],
                  ["Defense", "Défense"],
                  ["SpecialAttack", "Atk Spé"],
                  ["SpecialDefense", "Def Spé"],
                  ["Speed", "Vitesse"],
                ].map(([k, label]) => (
                  <div key={k} className="pokeField">
                    <div className="pokeLabel">{label}</div>
                    <input
                      className="pokeInput"
                      type="number"
                      min={1}
                      max={255}
                      value={form[k]}
                      onChange={set(k)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4 }}>
              <button className="pokePrimaryBtn" type="submit" disabled={saving || uploading}>
                {saving ? "Sauvegarde…" : "Modifier"}
              </button>

              <button
                type="button"
                className="pokePrimaryBtn"
                onClick={() => setConfirm(true)}
                style={{
                  background: "rgba(185, 28, 28, 0.18)",
                  border: "1px solid rgba(185, 28, 28, 0.55)",
                  color: "#ffcb05",
                }}
              >
                Supprimer
              </button>
            </div>

            {/* Modale delete */}
            {confirm && (
              <div
                onClick={() => setConfirm(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  display: "grid",
                  placeItems: "center",
                  padding: 20,
                  zIndex: 50,
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "min(520px, 100%)",
                    borderRadius: 18,
                    padding: 16,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88))",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>Supprimer {poke.name?.english} ?</h3>
                  <p>Cette action est irréversible.</p>

                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={() => setConfirm(false)}>Annuler</button>
                    <button
                      onClick={onDelete}
                      style={{
                        background: "#b91c1c",
                        color: "white",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
