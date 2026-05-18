// Shared helpers, fake data, iPhone frame for all variants.

const ICONS = {
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path d="M6 4h12v6a6 6 0 0 1-12 0V4z" />
      <path d="M9 20h6" />
      <path d="M12 17v3" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14a8 8 0 0 0 16 0c0-4.16-2-7.88-6.5-13.33zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  ),
  spade: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
      <path d="M12 2 C 8 7 3 11 3 16 C 3 19 5 21 8 21 C 9.5 21 10.8 20.3 11.4 19.2 L 10 23 L 14 23 L 12.6 19.2 C 13.2 20.3 14.5 21 16 21 C 19 21 21 19 21 16 C 21 11 16 7 12 2 Z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

// Fake but realistic data
const PLAYERS = [
  { id: 1, name: "Bauer", rating: 1670, rd: 96, elo: 1305, w: 16, l: 8 },
  { id: 2, name: "Gasti", rating: 1592, rd: 118, elo: 1280, w: 5, l: 3 },
  { id: 3, name: "Roro", rating: 1574, rd: 102, elo: 1271, w: 8, l: 5 },
  { id: 4, name: "Caja", rating: 1561, rd: 132, elo: 1255, w: 6, l: 3 },
  { id: 5, name: "Gladiador", rating: 1548, rd: 110, elo: 1247, w: 5, l: 4 },
  { id: 6, name: "Fede", rating: 1532, rd: 88, elo: 1238, w: 14, l: 11 },
  { id: 7, name: "Oti", rating: 1489, rd: 95, elo: 1212, w: 7, l: 6 },
  { id: 8, name: "Goncho", rating: 1471, rd: 101, elo: 1198, w: 9, l: 10 },
  { id: 9, name: "Chiqui", rating: 1342, rd: 145, elo: 1140, w: 2, l: 4 },
  { id: 10, name: "Pepe", rating: 1287, rd: 160, elo: 1118, w: 1, l: 4 },
  { id: 11, name: "Bascibrisco", rating: 1264, rd: 130, elo: 1102, w: 3, l: 9 },
  { id: 12, name: "Comba", rating: 1240, rd: 138, elo: 1090, w: 3, l: 12 },
];

const HISTORY = [
  { date: "9 MAY 2026", matches: [
    { t1: ["Fede", "Gasti", "Bauer"], t2: ["Pepe", "Goncho", "Oti"], s1: 50, s2: 46, max: 50 },
    { t1: ["Goncho", "Oti", "Roro"], t2: ["Comba", "Bascibrisco", "Pepe"], s1: 50, s2: 28, max: 50 },
  ]},
  { date: "24 ABR 2026", matches: [
    { t1: ["Caja", "Chiqui", "Roro"], t2: ["Gasti", "Fede", "Bauer"], s1: 41, s2: 50, max: 50 },
    { t1: ["Oti", "Bauer", "Gladiador"], t2: ["Gasti", "Bascibrisco", "Goncho"], s1: 50, s2: 47, max: 50 },
  ]},
  { date: "18 ABR 2026", matches: [
    { t1: ["Bauer", "Fede"], t2: ["Gasti", "Roro"], s1: 40, s2: 32, max: 40 },
  ]},
];

// iPhone frame: simple, lightweight bezel. Use as wrapper around screens.
function PhoneFrame({ children, label, dark = true }) {
  return (
    <div style={{
      width: 390,
      height: 844,
      borderRadius: 54,
      padding: 11,
      background: "linear-gradient(160deg, #1d1d22 0%, #0c0c0e 100%)",
      boxShadow: "0 0 0 1.5px #2a2a30, 0 30px 60px -20px rgba(0,0,0,0.7), 0 8px 16px -8px rgba(0,0,0,0.5)",
      position: "relative",
      flexShrink: 0,
    }}>
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius: 44,
        overflow: "hidden",
        position: "relative",
        background: dark ? "#000" : "#fff",
      }}>
        {/* Notch */}
        <div style={{
          position: "absolute",
          top: 11,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 32,
          background: "#000",
          borderRadius: 20,
          zIndex: 50,
        }} />
        {/* Status bar */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px 0 32px",
          color: dark ? "#fff" : "#000",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          zIndex: 40,
          pointerEvents: "none",
        }}>
          <span>9:41</span>
          <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><path d="M1 7h1v3H1zM4 5h1v5H4zM7 3h1v7H7zM10 1h1v9h-1zM13 0h1v10h-1z"/></svg>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 2C5.3 2 2.8 3 1 4.7l-.7-.7C2.4 2.1 5.1 1 8 1s5.6 1.1 7.7 3l-.7.7C13.2 3 10.7 2 8 2zm0 3c-1.7 0-3.3.6-4.5 1.7l-.7-.7C4.2 4.7 6 4 8 4s3.8.7 5.2 2l-.7.7C11.3 5.6 9.7 5 8 5zm0 3c-.8 0-1.6.3-2.2.8L8 11l2.2-2.2C9.6 8.3 8.8 8 8 8z"/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" stroke="currentColor" strokeWidth="1"><rect x=".5" y=".5" width="21" height="11" rx="2.5"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/><rect x="22.5" y="4" width="1.5" height="4" rx=".5" fill="currentColor"/></svg>
          </span>
        </div>
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 134,
          height: 5,
          background: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          borderRadius: 3,
          zIndex: 50,
        }} />
      </div>
    </div>
  );
}

window.ICONS = ICONS;
window.PLAYERS = PLAYERS;
window.HISTORY = HISTORY;
window.PhoneFrame = PhoneFrame;
