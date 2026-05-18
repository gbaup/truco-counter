// VARIANT C — part 2: sidebar, profile, stats, history
function SidebarC() {
  const items = [
    { label: "Armar mesa", active: true },
    { label: "Mi perfil" }, { label: "Ranking" },
    { label: "Versus" }, { label: "Historial" },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, fontFamily: "'Inter', system-ui", color: C.text, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
        <HeaderC />
        <div style={{ padding: 20 }}>
          <div style={{ height: 160, background: C.surface, borderRadius: 18, marginBottom: 12 }} />
          <div style={{ height: 240, background: C.surface, borderRadius: 18 }} />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(13,16,14,0.7)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 290, background: "linear-gradient(180deg, #111613 0%, #0d100e 100%)", borderLeft: `1px solid ${C.border}`, padding: "60px 20px 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <LogoC size={18} />
          <button style={{ width: 32, height: 32, borderRadius: 16, background: C.surface, border: `1px solid ${C.border}`, color: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>{window.ICONS.close}</button>
        </div>
        {/* Player card-style */}
        <div style={{ background: C.paper, borderRadius: 14, padding: 14, marginBottom: 22, position: "relative", boxShadow: "0 8px 16px -8px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 50, background: C.paperInk, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: C.paper, fontFamily: "'Crimson Pro', serif", fontWeight: 800, fontSize: 18 }}>1</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.paperInk, fontFamily: "'Crimson Pro', serif" }}>Bauer</div>
              <div style={{ fontSize: 11, color: C.paperInk + "aa", fontStyle: "italic" }}>el de la mesa</div>
            </div>
            <Suit kind="espada" size={20} color={C.paperInk} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.textMute, fontStyle: "italic", fontFamily: "'Crimson Pro', serif", marginBottom: 10 }}>en la mesa</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {items.map(it => (
            <div key={it.label} style={{ padding: "12px 14px", borderRadius: 11, background: it.active ? C.us + "22" : "transparent", color: it.active ? C.us : C.text, fontWeight: it.active ? 700 : 500, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between", border: it.active ? `1px solid ${C.us}40` : "1px solid transparent" }}>
              {it.label}
              {it.active && <span style={{ color: C.us }}>{window.ICONS.arrow}</span>}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: "12px 14px", borderRadius: 11, color: C.danger, fontWeight: 500, fontSize: 13, textAlign: "center", border: `1px solid ${C.danger}30`, fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>levantarse de la mesa</div>
      </div>
    </div>
  );
}

function ProfileC() {
  const me = window.PLAYERS[0];
  const winRate = Math.round(me.w / (me.w + me.l) * 100);
  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, fontFamily: "'Inter', system-ui", color: C.text }}>
      <HeaderC title="mi perfil" />
      <div style={{ padding: "0 20px 18px", height: "calc(100% - 100px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Player card */}
        <div style={{ background: `linear-gradient(135deg, ${C.paper} 0%, #e8dfc7 100%)`, borderRadius: 22, padding: "18px 18px 14px", position: "relative", boxShadow: "0 12px 24px -10px rgba(0,0,0,0.5)" }}>
          {/* corner number */}
          <div style={{ position: "absolute", top: 12, left: 14, fontSize: 24, fontFamily: "'Crimson Pro', serif", fontWeight: 800, color: C.paperInk, lineHeight: 1 }}>1</div>
          <div style={{ position: "absolute", top: 38, left: 14 }}><Suit kind="espada" size={14} color={C.paperInk} /></div>
          <div style={{ position: "absolute", bottom: 12, right: 14, fontSize: 24, fontFamily: "'Crimson Pro', serif", fontWeight: 800, color: C.paperInk, lineHeight: 1, transform: "rotate(180deg)" }}>1</div>
          <div style={{ position: "absolute", bottom: 38, right: 14, transform: "rotate(180deg)" }}><Suit kind="espada" size={14} color={C.paperInk} /></div>
          <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
            <div style={{ fontSize: 11, color: C.paperInk + "99", letterSpacing: "0.18em", fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>el jugador</div>
            <div style={{ fontSize: 30, fontFamily: "'Crimson Pro', serif", fontWeight: 700, color: C.paperInk, lineHeight: 1.1, marginTop: 2 }}>{me.name}</div>
            <div style={{ width: 30, height: 1, background: C.paperInk, opacity: 0.4, margin: "8px auto" }} />
            <div style={{ fontSize: 11, color: C.paperInk + "99", letterSpacing: "0.18em", fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>glicko</div>
            <div style={{ fontSize: 40, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: C.paperInk, lineHeight: 1, letterSpacing: "-0.04em", marginTop: 2 }}>{me.rating}</div>
            <div style={{ fontSize: 11, color: C.themDeep, fontWeight: 700, marginTop: 2 }}>+28 esta semana</div>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { l: "ganadas", v: me.w, c: C.them },
            { l: "perdidas", v: me.l, c: C.danger },
            { l: "winrate", v: winRate + "%", c: C.text },
          ].map(s => (
            <div key={s.l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.textMute, fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>{s.l}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.c, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em", lineHeight: 1.1 }}>{s.v}</div>
            </div>
          ))}
        </div>
        {/* Elo + RD strip */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMute, fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>elo</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>{me.elo}</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: C.border }} />
          <div>
            <div style={{ fontSize: 11, color: C.textMute, fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>desviación</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.textDim, fontFamily: "'Space Grotesk', sans-serif" }}>{me.rd}</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: C.border }} />
          <div>
            <div style={{ fontSize: 11, color: C.textMute, fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>racha</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.warn, fontFamily: "'Space Grotesk', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
              {window.ICONS.flame} 4
            </div>
          </div>
        </div>
        {/* Recent results */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 14px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>últimas partidas</div>
            <div style={{ fontSize: 11, color: C.us, fontWeight: 600 }}>ver todas →</div>
          </div>
          {window.HISTORY[0].matches.concat(window.HISTORY[1].matches).slice(0, 3).map((m, i) => {
            const won = m.s1 > m.s2;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "9px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: won ? C.them + "22" : C.danger + "22", color: won ? C.them : C.danger, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Crimson Pro', serif", fontWeight: 800, fontSize: 14, marginRight: 10 }}>
                  {won ? "G" : "P"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: C.text, fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{m.t1.join(" · ")}</div>
                  <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic" }}>vs {m.t2.join(" · ")}</div>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 17, color: won ? C.them : C.danger }}>
                  {m.s1}–{m.s2}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatsC() {
  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, fontFamily: "'Inter', system-ui", color: C.text }}>
      <HeaderC title="ranking" />
      <div style={{ padding: "0 20px 18px", height: "calc(100% - 100px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 4, padding: 4, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
          {["Glicko", "Elo"].map((t, i) => (
            <div key={t} style={{ flex: 1, padding: "9px 0", borderRadius: 9, background: i === 0 ? C.us : "transparent", color: i === 0 ? "#fff" : C.textDim, textAlign: "center", fontSize: 13, fontWeight: 700, fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>{t}</div>
          ))}
        </div>
        {/* Top 1 spotlight */}
        <div style={{ background: `linear-gradient(135deg, ${C.paper}, #e8dfc7)`, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 16px -8px rgba(0,0,0,0.4)", position: "relative" }}>
          <div style={{ width: 50, height: 64, background: C.paperInk, borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: 4 }}>
            <div style={{ fontSize: 14, color: C.paper, fontFamily: "'Crimson Pro', serif", fontWeight: 800, alignSelf: "flex-start", marginLeft: 4 }}>1</div>
            <Suit kind="espada" size={22} color={C.paper} />
            <div style={{ fontSize: 14, color: C.paper, fontFamily: "'Crimson Pro', serif", fontWeight: 800, alignSelf: "flex-end", marginRight: 4, transform: "rotate(180deg)" }}>1</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.paperInk + "99", letterSpacing: "0.12em", fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>el de arriba</div>
            <div style={{ fontSize: 22, fontFamily: "'Crimson Pro', serif", fontWeight: 700, color: C.paperInk, lineHeight: 1.1 }}>{window.PLAYERS[0].name}</div>
            <div style={{ fontSize: 12, color: C.paperInk + "99", marginTop: 2 }}>{window.PLAYERS[0].w}W · {window.PLAYERS[0].l}L</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: C.paperInk, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>{window.PLAYERS[0].rating}</div>
            <div style={{ fontSize: 10, color: C.paperInk + "99", letterSpacing: "0.12em", marginTop: 2 }}>GLICKO</div>
          </div>
        </div>
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 32px 32px 60px", padding: "10px 14px", fontSize: 10, color: C.textMute, fontStyle: "italic", fontFamily: "'Crimson Pro', serif", borderBottom: `1px solid ${C.border}` }}>
            <div>#</div><div>jugador</div><div style={{ textAlign: "center" }}>w</div><div style={{ textAlign: "center" }}>l</div><div style={{ textAlign: "right" }}>rating</div>
          </div>
          {window.PLAYERS.slice(1, 10).map((p, i) => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 32px 32px 60px", padding: "11px 14px", alignItems: "center", borderBottom: i < 8 ? `1px solid ${C.border}` : "none", fontSize: 13 }}>
              <div style={{ color: C.textMute, fontWeight: 700, fontFamily: "'Crimson Pro', serif" }}>{i + 2}</div>
              <div style={{ color: C.text, fontWeight: 600, textTransform: "capitalize" }}>{p.name}</div>
              <div style={{ textAlign: "center", color: C.them, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{p.w}</div>
              <div style={{ textAlign: "center", color: C.danger, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{p.l}</div>
              <div style={{ textAlign: "right", color: C.text, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>{p.rating}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryC() {
  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, fontFamily: "'Inter', system-ui", color: C.text }}>
      <HeaderC title="historial" />
      <div style={{ padding: "0 20px 18px", height: "calc(100% - 100px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {window.HISTORY.map(day => (
          <div key={day.date}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic", fontFamily: "'Crimson Pro', serif", letterSpacing: "0.08em" }}>{day.date.toLowerCase()}</div>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {day.matches.map((m, i) => {
                const won = m.s1 > m.s2;
                return (
                  <div key={i} style={{ background: C.surface, borderRadius: 14, padding: "12px 14px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 42, background: C.paperInk, borderRadius: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, color: won ? C.them : C.danger }}>
                      <div style={{ fontFamily: "'Crimson Pro', serif", fontWeight: 800, fontSize: 14, lineHeight: 1 }}>{won ? "G" : "P"}</div>
                      <Suit kind={won ? "spade" : "club"} size={10} color={won ? C.them : C.danger} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: C.text, fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{m.t1.join(" · ")}</div>
                      <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>vs {m.t2.join(" · ")}</div>
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 16, lineHeight: 1 }}>
                      <span style={{ color: won ? C.them : C.textDim }}>{m.s1}</span>
                      <span style={{ color: C.textMute, margin: "0 4px" }}>—</span>
                      <span style={{ color: !won ? C.danger : C.textDim }}>{m.s2}</span>
                      <div style={{ fontSize: 9, color: C.textMute, letterSpacing: "0.1em", marginTop: 3, fontFamily: "'Crimson Pro', serif", fontStyle: "italic", fontWeight: 500 }}>a {m.max}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.C2 = { SidebarC, ProfileC, StatsC, HistoryC };
