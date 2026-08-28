import {
  ArrowLeft,
  Beef,
  CookingPot,
  Flame,
  Fish,
  FishSymbol,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Soup,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";

const TEAL = "#1E6869";
const TEAL_DARK = "#14494A";
const INK = "#14302F";

const CATEGORIES: { name: string; icon: LucideIcon; active?: boolean }[] = [
  { name: "Popular", icon: Heart, active: true },
  { name: "Burger", icon: Beef },
  { name: "Sushi", icon: Fish },
  { name: "Sashimi", icon: FishSymbol },
  { name: "BBQ", icon: Flame },
  { name: "Noodle", icon: Soup },
  { name: "Tempura", icon: UtensilsCrossed },
  { name: "Nabe", icon: CookingPot },
  { name: "Sake", icon: Wine },
];

const ITEMS: { id: string; name: string; price: number; qty: number }[] = [
  { id: "classic-beef-burger", name: "Classic Beef Burger", price: 39000, qty: 1 },
  { id: "beef-burger-combo", name: "Beef Burger Combo", price: 65000, qty: 0 },
  { id: "tobiko-roll", name: "Tobiko Roll", price: 42000, qty: 0 },
  { id: "salmon-nigiri", name: "Salmon Nigiri", price: 45000, qty: 1 },
  { id: "maguro-nigiri", name: "Maguro Nigiri", price: 38000, qty: 0 },
  { id: "shime-saba-nigiri", name: "Shime Saba Nigiri", price: 47000, qty: 0 },
  { id: "tempura-roll", name: "Tempura Roll", price: 41000, qty: 0 },
  { id: "alaska-roll", name: "Alaska Roll", price: 39000, qty: 0 },
  { id: "unagi-roll", name: "Unagi Roll", price: 43000, qty: 0 },
];

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

const CARD_H = 296;
const r2 = (n: number) => Math.round(n * 100) / 100;

// Card outline: rounded rect whose bottom-right edge scoops around the add
// button / qty stepper, which hangs flush with the card's right/bottom edges.
function cardShape(W: number, selected: boolean) {
  const R = 22, x0 = 1, y0 = 1, x1 = r2(W - 1), y1 = CARD_H - 1;
  const cr = selected ? 24 : 23;
  const cx = r2(x1 - cr + 1), cy = r2(y1 - cr + 1);
  const ax = selected ? r2(cx - 58) : cx;
  const NR = cr + 8;
  const FR = 12;
  const K = NR + FR;
  const oy = cy - Math.sqrt(K * K - Math.pow(x1 - FR - cx, 2));
  const v = [x1 - FR - cx, oy - cy], vl = Math.hypot(v[0], v[1]);
  const t1 = [r2(cx + (NR * v[0]) / vl), r2(cy + (NR * v[1]) / vl)];
  const ox = ax - Math.sqrt(K * K - Math.pow(y1 - FR - cy, 2));
  const w = [ox - ax, y1 - FR - cy], wl = Math.hypot(w[0], w[1]);
  const t2 = [r2(ax + (NR * w[0]) / wl), r2(cy + (NR * w[1]) / wl)];
  const d = [
    "M " + (x0 + R) + " " + y0,
    "L " + r2(x1 - R) + " " + y0,
    "A " + R + " " + R + " 0 0 1 " + x1 + " " + (y0 + R),
    "L " + x1 + " " + r2(oy),
    "A " + FR + " " + FR + " 0 0 1 " + t1[0] + " " + t1[1],
  ];
  if (selected) {
    d.push("A " + NR + " " + NR + " 0 0 0 " + cx + " " + r2(cy - NR));
    d.push("L " + ax + " " + r2(cy - NR));
    d.push("A " + NR + " " + NR + " 0 0 0 " + t2[0] + " " + t2[1]);
  } else {
    let span = Math.atan2(t1[1] - cy, t1[0] - cx) - Math.atan2(t2[1] - cy, t2[0] - cx);
    while (span < 0) span += 2 * Math.PI;
    d.push("A " + NR + " " + NR + " 0 " + (span > Math.PI ? 1 : 0) + " 0 " + t2[0] + " " + t2[1]);
  }
  d.push("A " + FR + " " + FR + " 0 0 1 " + r2(ox) + " " + y1);
  d.push("L " + (x0 + R) + " " + y1);
  d.push("A " + R + " " + R + " 0 0 1 " + x0 + " " + r2(y1 - R));
  d.push("L " + x0 + " " + (y0 + R));
  d.push("A " + R + " " + R + " 0 0 1 " + (x0 + R) + " " + y0);
  d.push("Z");
  return d.join(" ");
}

const COLUMNS = 3;
const CARD_W = r2((536 - (COLUMNS - 1) * 18) / COLUMNS);

export default function KioskMenuPage() {
  const total = ITEMS.reduce((sum, it) => sum + it.qty * it.price, 0);
  const count = ITEMS.reduce((sum, it) => sum + it.qty, 0);

  return (
    // Fixed 720x1280 kiosk canvas, scaled (not stretched) to fill whatever
    // tablet screen it's mounted on — same fixed-resolution-kiosk approach
    // real self-order terminals use, so the design stays pixel-identical.
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#EDF1F1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 720,
          height: 1280,
          flex: "none",
          transform: "scale(min(calc(100vw / 720px), calc(100dvh / 1280px)))",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          overflow: "hidden",
          color: INK,
          position: "relative",
        }}
      >
        <header
          style={{
            height: 104,
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            borderBottom: "1px solid #EDF1F1",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hanami-logo.svg" alt="Hanami" style={{ height: 100, width: "auto", objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: TEAL, letterSpacing: -0.4, whiteSpace: "nowrap" }}>
              {rupiah(total)}
            </span>
            <span style={{ width: 1, height: 38, background: "#E2E9E9" }} />
            <div
              style={{
                position: "relative",
                width: 62,
                height: 62,
                borderRadius: 20,
                background: "#F3F7F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart color={INK} size={30} strokeWidth={2.1} />
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  minWidth: 28,
                  height: 28,
                  padding: "0 7px",
                  borderRadius: 999,
                  background: TEAL,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #fff",
                }}
              >
                {count}
              </span>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <nav style={{ width: 122, flex: "none", borderRight: "1px solid #EDF1F1", overflowY: "auto", padding: "14px 0 24px" }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 6px", cursor: "pointer" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 62,
                      height: 62,
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: cat.active ? "#E4F0EF" : "#F5F7F7",
                      border: `2px solid ${cat.active ? TEAL : "transparent"}`,
                    }}
                  >
                    <Icon color={cat.active ? TEAL : "#8CA0A0"} size={28} strokeWidth={cat.active ? 2.2 : 2} />
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: cat.active ? 800 : 600,
                      color: cat.active ? TEAL : "#8CA0A0",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </nav>

          <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "26px 28px 44px", display: "flex", flexDirection: "column", gap: 22, background: "#FFFFFF" }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`, columnGap: 18, rowGap: 34 }}>
              {ITEMS.map((item) => {
                const picked = item.qty > 0;
                return (
                  <div key={item.id} style={{ position: "relative", height: CARD_H }}>
                    <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
                      <path d={cardShape(CARD_W, picked)} fill="#F9FBFC" stroke={picked ? TEAL : "#E7EEEF"} strokeWidth={picked ? 2 : 1} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, padding: 12, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                      <div style={{ flex: 1, minHeight: 0, borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, #F3F7F6, #E4F0EF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 13, color: "#8CA0A0", textAlign: "center", padding: 8 }}>{item.name}</span>
                      </div>
                      <div style={{ marginTop: 10, flex: "none", fontSize: 17, fontWeight: 700, lineHeight: 1.26, letterSpacing: -0.3, minHeight: 43, color: "#123F3E" }}>
                        {item.name}
                      </div>
                      <div style={{ marginTop: 2, flex: "none", paddingBottom: 46, fontSize: 19, fontWeight: 800, color: TEAL, letterSpacing: -0.5, whiteSpace: "nowrap" }}>
                        {rupiah(item.price)}
                      </div>
                    </div>

                    {!picked && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          bottom: 0,
                          width: 46,
                          height: 46,
                          boxSizing: "border-box",
                          borderRadius: 999,
                          background: "#FFFFFF",
                          border: `2px solid ${TEAL}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Plus color={TEAL} size={26} strokeWidth={2.6} />
                      </div>
                    )}

                    {picked && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          bottom: 0,
                          width: 106,
                          height: 48,
                          boxSizing: "border-box",
                          padding: "0 4px 0 10px",
                          borderRadius: 999,
                          background: "#FFFFFF",
                          border: `2px solid ${TEAL}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ width: 26, height: 32, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Minus color={TEAL_DARK} size={20} strokeWidth={2.6} />
                        </span>
                        <span style={{ fontSize: 19, fontWeight: 800, color: "#123F3E", minWidth: 12, textAlign: "center" }}>{item.qty}</span>
                        <span style={{ width: 36, height: 36, flex: "none", borderRadius: 999, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Plus color="#FFFFFF" size={20} strokeWidth={2.6} />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </main>
        </div>

        <footer style={{ flex: "none", padding: "24px 32px 30px", display: "flex", alignItems: "center", gap: 20, borderTop: "1px solid #EDF1F1", background: "#fff" }}>
          <div
            style={{
              width: 78,
              height: 78,
              flex: "none",
              borderRadius: 999,
              border: `2px solid ${TEAL}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowLeft color={TEAL} size={32} strokeWidth={2.2} />
          </div>
          <div
            style={{
              flex: 1,
              height: 88,
              borderRadius: 999,
              background: TEAL,
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              padding: "0 34px",
              cursor: "pointer",
            }}
          >
            <div style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center" }}>
              <ShoppingCart color="#FFFFFF" size={32} strokeWidth={2.1} />
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  left: 20,
                  minWidth: 26,
                  height: 26,
                  padding: "0 6px",
                  borderRadius: 999,
                  background: "#F2E3C4",
                  color: TEAL_DARK,
                  fontSize: 14,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {count}
              </span>
            </div>
            <span style={{ fontSize: 27, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>View Cart</span>
            <span style={{ fontSize: 27, fontWeight: 800, color: "#fff", textAlign: "right", letterSpacing: -0.4 }}>{rupiah(total)}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
