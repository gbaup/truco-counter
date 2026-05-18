// VARIANT C — "Mesa": subtle truco/cards DNA, warm undertone, tactile palitos
const C = {
  bg: "#0d100e", surface: "#161b18", surfaceHi: "#1d2420", border: "#2a3128",
  paper: "#f4ecdb", paperInk: "#1a1410", paperLine: "#c2a878",
  text: "#f0ede4", textDim: "#8f8a7f", textMute: "#5d584f",
  us: "#8b5cf6", usDeep: "#6d28d9",
  them: "#34d399", themDeep: "#047857",
  danger: "#ef4444", warn: "#e0a83a",
};

// Marker-style palito drawn on paper — squared "casita" (truco tradicional)
// 4 sides forming a square, 5th = diagonal. Bezier wobble for hand-drawn feel.
function PalitoC({ count, color, size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <g stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0.92 }}>
        {/* 1 — left side, drawn top-to-bottom with slight wobble */}
        {count >= 1 && <path d="M 20 14 C 19 35, 22 60, 21 86" />}
        {/* 2 — top side */}
        {count >= 2 && <path d="M 18 18 C 38 17, 62 19, 84 17" />}
        {/* 3 — right side */}
        {count >= 3 && <path d="M 82 14 C 83 36, 80 60, 83 84" />}
        {/* 4 — bottom side */}
        {count >= 4 && <path d="M 18 84 C 40 83, 62 86, 84 82" />}
        {/* 5 — diagonal cross, from bottom-left to top-right */}
        {count >= 5 && <path d="M 14 88 C 38 70, 62 38, 88 14" />}
      </g>
    </svg>
  );
}

function LogoC({ size = 24, dark = true }) {
  return (
    <div style={{ fontFamily: "'Crimson Pro', 'Times New Roman', serif", fontSize: size, fontWeight: 700, letterSpacing: "0.01em", color: dark ? C.text : C.paperInk, lineHeight: 1, display: "inline-flex", alignItems: "baseline", fontStyle: "italic" }}>
      truco<span style={{ color: C.us, fontWeight: 800, fontStyle: "normal", letterSpacing: "-0.02em", fontFamily: "'Space Grotesk', system-ui" }}>PRO</span>
    </div>
  );
}

function HeaderC({ title }) {
  return (
    <div style={{ paddingTop: 56, padding: "56px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <LogoC size={18} />
      {title && <div style={{ fontSize: 14, color: C.text, fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>{title}</div>}
      <button style={{ width: 36, height: 36, borderRadius: 18, background: C.surface, border: `1px solid ${C.border}`, color: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.menu}</button>
    </div>
  );
}

// Spanish-suit pips (baraja española de truco) — espada, basto, oro, copa.
// Drawn as simplified iconographic glyphs that read at 10-50px.
function Suit({ kind = "espada", size = 14, color }) {
  if (kind === "basto") {
    // Cudgel: thin at the base, flares to a rounded knob at top, with
    // a small grip at the bottom. Tapered like a wooden club.
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M9.5 2.5 Q 8 3.5 8.5 5.5 L 10 12 Q 9 17 10 20.5 L 11 21.5 L 13 21.5 L 14 20.5 Q 15 17 14 12 L 15.5 5.5 Q 16 3.5 14.5 2.5 Q 12 3 9.5 2.5 Z" />
        {/* grip rings */}
        <rect x="9.5" y="19" width="5" height="0.8" fill={color} opacity="0.5" />
      </svg>
    );
  }
  if (kind === "oro") {
    // Gold coin: donut with a sunburst hint (small triangles around rim).
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path
          d="M12 1.5 A 10.5 10.5 0 1 0 12 22.5 A 10.5 10.5 0 1 0 12 1.5 Z M 12 8 A 4 4 0 1 1 12 16 A 4 4 0 1 1 12 8 Z"
          fillRule="evenodd"
        />
        {/* four tiny rays */}
        <circle cx="12" cy="3.5" r="0.7" />
        <circle cx="20.5" cy="12" r="0.7" />
        <circle cx="12" cy="20.5" r="0.7" />
        <circle cx="3.5" cy="12" r="0.7" />
      </svg>
    );
  }
  if (kind === "copa") {
    // Chalice: wide bowl + stem + base. The classic copa.
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        {/* bowl */}
        <path d="M5 4 L19 4 L17.5 13 Q 12 16 6.5 13 Z" />
        {/* lid line */}
        <rect x="5" y="3" width="14" height="1.2" rx="0.4" />
        {/* stem */}
        <rect x="11" y="15.5" width="2" height="3.5" />
        {/* base */}
        <path d="M7 19 L 17 19 Q 18 19 18 20 L 18 21 L 6 21 L 6 20 Q 6 19 7 19 Z" />
      </svg>
    );
  }
  // espada (default) — straight sword: blade + ornate crossguard + hilt + pommel
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {/* blade */}
      <path d="M11 2 L 13 2 L 13 14 L 11 14 Z" />
      {/* blade tip */}
      <path d="M11 2 L 13 2 L 12 1 Z" />
      {/* crossguard (curved) */}
      <path d="M5 13.5 L 19 13.5 Q 19.5 13.5 19 14.5 L 17 16 L 7 16 L 5 14.5 Q 4.5 13.5 5 13.5 Z" />
      {/* hilt grip */}
      <rect x="10.5" y="16" width="3" height="4" />
      <rect x="10.5" y="17.5" width="3" height="0.7" fill={color} opacity="0.5" />
      {/* pommel */}
      <circle cx="12" cy="21" r="1.4" />
    </svg>
  );
}

// ── Login
function LoginC() {
  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, position: "relative", overflow: "hidden", fontFamily: "'Inter', system-ui", color: C.text }}>
      {/* subtle felt texture */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 0%, ${C.them}18 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${C.us}18 0%, transparent 50%)` }} />
      {/* card decoration */}
      <div style={{ position: "absolute", top: 90, right: -40, width: 140, height: 200, background: C.paper, borderRadius: 12, transform: "rotate(18deg)", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 30, color: C.paperInk, fontFamily: "'Crimson Pro', serif", fontWeight: 800, alignSelf: "flex-start" }}>1</div>
        <Suit kind="espada" size={50} color={C.paperInk} />
        <div style={{ fontSize: 30, color: C.paperInk, fontFamily: "'Crimson Pro', serif", fontWeight: 800, alignSelf: "flex-end", transform: "rotate(180deg)" }}>1</div>
      </div>
      <div style={{ position: "absolute", top: 130, left: -50, width: 140, height: 200, background: C.paper, borderRadius: 12, transform: "rotate(-15deg)", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", opacity: 0.7 }}>
        <div style={{ fontSize: 30, color: C.paperInk, fontFamily: "'Crimson Pro', serif", fontWeight: 800, alignSelf: "flex-start" }}>7</div>
        <Suit kind="copa" size={50} color={C.paperInk} />
        <div style={{ fontSize: 30, color: C.paperInk, fontFamily: "'Crimson Pro', serif", fontWeight: 800, alignSelf: "flex-end", transform: "rotate(180deg)" }}>7</div>
      </div>
      <div style={{ position: "relative", padding: "340px 24px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <LogoC size={42} />
        <div style={{ fontSize: 12, color: C.textDim, marginTop: 8, fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>tu mesa, tu marca, tu ranking.</div>
        <div style={{ marginTop: 40, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ l: "Usuario", v: "bauer" }, { l: "Contraseña", v: "••••••••", f: true }].map((f, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 12, padding: "12px 16px", border: `1px solid ${f.f ? C.us + "80" : C.border}` }}>
              <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>{f.l}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginTop: 1, letterSpacing: f.f ? 3 : 0 }}>{f.v}</div>
            </div>
          ))}
          <button style={{ background: C.us, color: "#fff", border: "none", borderRadius: 14, padding: 15, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
            Entrar a la mesa {window.ICONS.arrow}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Setup
function SetupC() {
  const us = ["Bauer", "Fede", "Gasti"], them = ["Oti", "Goncho"];
  const all = ["Comba", "Roro", "Caja", "Gladiador", "Chiqui", "Pepe"];
  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, fontFamily: "'Inter', system-ui", color: C.text, display: "flex", flexDirection: "column" }}>
      <HeaderC title="armar mesa" />
      <div style={{ padding: "4px 20px 18px", display: "flex", flexDirection: "column", gap: 12, flex: 1, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ label: "Nosotros", c: C.us, list: us, suit: "espada" }, { label: "Ellos", c: C.them, list: them, suit: "basto" }].map(t => (
            <div key={t.label} style={{ background: C.surface, borderRadius: 16, padding: "12px 12px 10px", border: `1px solid ${t.c}40` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Suit kind={t.suit} size={12} color={t.c} />
                <div style={{ fontWeight: 700, color: t.c, fontFamily: "'Crimson Pro', serif", fontStyle: "italic", fontSize: 17 }}>{t.label}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {t.list.map(n => (
                  <div key={n} style={{ background: t.c + "20", color: t.c, padding: "6px 10px", borderRadius: 9, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {n}<span style={{ opacity: 0.6 }}>×</span>
                  </div>
                ))}
                <div style={{ border: `1px dashed ${t.c}60`, color: t.c, padding: "6px 10px", borderRadius: 9, fontSize: 11, textAlign: "center", fontStyle: "italic" }}>+ sumar</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textMute, fontStyle: "italic", fontFamily: "'Crimson Pro', serif", marginBottom: 8 }}>en el banco</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {all.map(n => <div key={n} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, padding: "6px 11px", borderRadius: 9, fontSize: 12 }}>{n}</div>)}
          </div>
        </div>
        <div style={{ background: C.surface, borderRadius: 16, padding: 14, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, color: C.textDim, fontFamily: "'Crimson Pro', serif", fontStyle: "italic", marginBottom: 10 }}>se juega a...</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[20, 30, 40, 50].map(p => (
              <div key={p} style={{ flex: 1, padding: "12px 0", borderRadius: 10, textAlign: "center", background: p === 40 ? C.us : "transparent", border: p === 40 ? "none" : `1px solid ${C.border}`, color: p === 40 ? "#fff" : C.text, fontWeight: 800, fontSize: 16, fontFamily: "'Crimson Pro', serif" }}>{p}</div>
            ))}
          </div>
        </div>
        <button style={{ marginTop: "auto", background: C.us, color: "#fff", border: "none", borderRadius: 14, padding: 16, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 20px -10px ${C.us}` }}>
          Cortar y empezar {window.ICONS.arrow}
        </button>
      </div>
    </div>
  );
}

// ── Counter — palitos drawn on paper panels, hero treatment
function CounterC({ score1 = 11, score2 = 27, max = 40 }) {
  const split = (n) => { const g = []; let r = n; while (r > 0) { g.push(Math.min(5, r)); r -= 5; } return g; };
  const Team = ({ label, color, score, players, suit }) => {
    const half = max / 2;
    const malas = Math.min(score, half);
    const buenas = Math.max(0, score - half);
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Suit kind={suit} size={10} color={color} />
            <div style={{ color, fontWeight: 700, fontFamily: "'Crimson Pro', serif", fontStyle: "italic", fontSize: 15 }}>{label}</div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>{score}</div>
        </div>
        <div style={{ fontSize: 9, color: C.textMute, letterSpacing: "0.08em", padding: "0 4px" }}>
          {players.join(" · ").toUpperCase()}
        </div>
        {/* paper sheet for palitos */}
        <div style={{
          flex: 1,
          background: `linear-gradient(180deg, ${C.paper} 0%, #e8dfc7 100%)`,
          borderRadius: 14,
          padding: "12px 8px",
          boxShadow: `inset 0 2px 8px rgba(0,0,0,0.15), 0 6px 14px -8px rgba(0,0,0,0.4)`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* notebook lines */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(0deg, ${C.paperLine}22 1px, transparent 1px)`, backgroundSize: "100% 18px", pointerEvents: "none" }} />
          {/* malas */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "4px 0", position: "relative" }}>
            {split(malas).map((c, i) => <PalitoC key={"m"+i} count={c} color={color} size={48} />)}
          </div>
          {malas > 0 && (
            <div style={{ height: 1, background: C.paperLine, opacity: 0.5, margin: "2px 8px" }} />
          )}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "4px 0", position: "relative" }}>
            {split(buenas).map((c, i) => <PalitoC key={"b"+i} count={c} color={color} size={48} />)}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, fontFamily: "'Inter', system-ui", color: C.text, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* felt overlay */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${C.themDeep}25 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ padding: "56px 14px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Crimson Pro', serif", fontStyle: "italic", color: C.textDim, fontSize: 13 }}>
          se juega a <span style={{ color: C.text, fontWeight: 700, fontStyle: "normal", fontFamily: "'Space Grotesk', sans-serif" }}>{max}</span>
        </div>
        <LogoC size={14} />
        <button style={{ width: 30, height: 30, borderRadius: 15, background: "transparent", border: `1px solid ${C.border}`, color: C.textDim, display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.menu}</button>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 10, padding: "8px 14px 0", position: "relative" }}>
        <Team label="Nosotros" color={C.us} score={score1} players={["Bauer", "Fede", "Gasti"]} suit="espada" />
        <Team label="Ellos" color={C.them} score={score2} players={["Oti", "Goncho", "Roro"]} suit="basto" />
      </div>
      <div style={{ padding: "12px 12px 28px", display: "flex", gap: 6, alignItems: "center", position: "relative" }}>
        <div style={{ flex: 1, display: "flex", gap: 5, background: C.surface, borderRadius: 16, padding: 5, border: `1px solid ${C.border}` }}>
          <button style={{ width: 42, height: 42, borderRadius: 11, background: "transparent", border: `1px solid ${C.us}40`, color: C.us, display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.minus}</button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22, color: C.us, fontFamily: "'Space Grotesk', sans-serif" }}>{score1}</div>
          <button style={{ width: 42, height: 42, borderRadius: 11, background: C.us, border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.plus}</button>
        </div>
        <button style={{ width: 44, height: 44, borderRadius: 22, background: C.surface, border: `1px solid ${C.border}`, color: C.textDim, display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.close}</button>
        <div style={{ flex: 1, display: "flex", gap: 5, background: C.surface, borderRadius: 16, padding: 5, border: `1px solid ${C.border}` }}>
          <button style={{ width: 42, height: 42, borderRadius: 11, background: "transparent", border: `1px solid ${C.them}40`, color: C.them, display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.minus}</button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22, color: C.them, fontFamily: "'Space Grotesk', sans-serif" }}>{score2}</div>
          <button style={{ width: 42, height: 42, borderRadius: 11, background: C.them, border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.plus}</button>
        </div>
      </div>
    </div>
  );
}

window.C1 = { LoginC, SetupC, CounterC };
