import { useState } from "react";

interface Street {
  id: number;
  name: string;
  district: string;
  noiseLevel: number;
  type: string;
}

const streets: Street[] = [
  { id: 1, name: "пр. Победы", district: "Вахитовский", noiseLevel: 82, type: "Магистраль" },
  { id: 2, name: "пр. Ямашева", district: "Ново-Савиновский", noiseLevel: 85, type: "Магистраль" },
  { id: 3, name: "ул. Дементьева", district: "Авиастроительный", noiseLevel: 88, type: "Промышленная" },
  { id: 4, name: "ул. Сибирский тракт", district: "Ново-Савиновский", noiseLevel: 87, type: "Магистраль" },
  { id: 5, name: "ул. Магистральная", district: "Кировский", noiseLevel: 86, type: "Магистраль" },
  { id: 6, name: "ул. Копылова", district: "Авиастроительный", noiseLevel: 84, type: "Промышленная" },
  { id: 7, name: "ул. Тэцевская", district: "Московский", noiseLevel: 83, type: "Промышленная" },
  { id: 8, name: "пр. Амирхана", district: "Ново-Савиновский", noiseLevel: 80, type: "Магистраль" },
  { id: 9, name: "ул. Складская", district: "Кировский", noiseLevel: 81, type: "Промышленная" },
  { id: 10, name: "ул. Кремлёвская", district: "Вахитовский", noiseLevel: 78, type: "Артерия" },
  { id: 11, name: "ул. Гагарина", district: "Советский", noiseLevel: 79, type: "Артерия" },
  { id: 12, name: "ул. Восстания", district: "Московский", noiseLevel: 77, type: "Артерия" },
  { id: 13, name: "ул. Адоратского", district: "Ново-Савиновский", noiseLevel: 76, type: "Артерия" },
  { id: 14, name: "ул. Баумана", district: "Вахитовский", noiseLevel: 72, type: "Артерия" },
  { id: 15, name: "ул. Чистопольская", district: "Ново-Савиновский", noiseLevel: 74, type: "Артерия" },
  { id: 16, name: "ул. Фатыха Амирхана", district: "Приволжский", noiseLevel: 73, type: "Артерия" },
  { id: 17, name: "ул. Побежимова", district: "Авиастроительный", noiseLevel: 71, type: "Артерия" },
  { id: 18, name: "ул. Закиева", district: "Московский", noiseLevel: 69, type: "Жилая" },
  { id: 19, name: "ул. Декабристов", district: "Советский", noiseLevel: 68, type: "Жилая" },
  { id: 20, name: "ул. Хади Такташа", district: "Ново-Савиновский", noiseLevel: 66, type: "Жилая" },
  { id: 21, name: "ул. Карла Маркса", district: "Вахитовский", noiseLevel: 70, type: "Артерия" },
  { id: 22, name: "ул. Пушкина", district: "Вахитовский", noiseLevel: 65, type: "Жилая" },
  { id: 23, name: "ул. Химиков", district: "Московский", noiseLevel: 64, type: "Жилая" },
  { id: 24, name: "ул. Правобулачная", district: "Вахитовский", noiseLevel: 63, type: "Жилая" },
  { id: 25, name: "ул. Маяковского", district: "Ново-Савиновский", noiseLevel: 59, type: "Жилая" },
  { id: 26, name: "ул. Родина", district: "Приволжский", noiseLevel: 58, type: "Жилая" },
  { id: 27, name: "ул. Миля", district: "Приволжский", noiseLevel: 61, type: "Жилая" },
  { id: 28, name: "ул. Чехова", district: "Советский", noiseLevel: 60, type: "Жилая" },
  { id: 29, name: "ул. Островского", district: "Вахитовский", noiseLevel: 62, type: "Жилая" },
  { id: 30, name: "ул. Лесгафта", district: "Кировский", noiseLevel: 55, type: "Жилая" },
];

const getColor = (lvl: number) => lvl >= 75 ? "#ef4444" : lvl >= 65 ? "#eab308" : "#22c55e";
const getLabel = (lvl: number) => lvl >= 75 ? "Критично" : lvl >= 65 ? "Превышение" : "Норма";
const allDistricts = [...new Set(streets.map(s => s.district))];

// Стиль плавающей панели
const panel: React.CSSProperties = {
  position: "absolute",
  background: "rgba(12,12,12,0.92)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  backdropFilter: "blur(12px)",
  color: "#fff",
  fontFamily: "'IBM Plex Sans', sans-serif",
  zIndex: 10,
};

export default function Index() {
  const [district, setDistrict] = useState<string | null>(null);
  const [selected, setSelected] = useState<Street | null>(null);
  const [showStreets, setShowStreets] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const filtered = district ? streets.filter(s => s.district === district) : streets;
  const avg = Math.round(filtered.reduce((a, s) => a + s.noiseLevel, 0) / filtered.length);
  const critical = filtered.filter(s => s.noiseLevel >= 75).length;
  const warn = filtered.filter(s => s.noiseLevel >= 65 && s.noiseLevel < 75).length;
  const norm = filtered.filter(s => s.noiseLevel < 65).length;

  const distStats = allDistricts.map(d => {
    const ds = streets.filter(s => s.district === d);
    return { name: d, avg: Math.round(ds.reduce((a, s) => a + s.noiseLevel, 0) / ds.length), count: ds.length };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden", fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* Карта на весь экран */}
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=48.9500%2C55.7300%2C49.2800%2C55.8500&layer=mapnik"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", filter: "invert(90%) hue-rotate(180deg)" }}
        title="Карта Казани"
      />

      {/* ── Верхняя панель (заголовок + кнопки) ── */}
      <div style={{ ...panel, top: 16, left: "50%", transform: "translateX(-50%)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔊</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Шумовое загрязнение</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "monospace" }}>Казань · 30 улиц</div>
          </div>
        </div>
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setShowStreets(v => !v); }} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid", fontSize: 12, cursor: "pointer", fontWeight: 500, borderColor: showStreets ? "#fff" : "rgba(255,255,255,0.15)", background: showStreets ? "rgba(255,255,255,0.15)" : "transparent", color: showStreets ? "#fff" : "rgba(255,255,255,0.45)" }}>
            📋 Улицы
          </button>
          <button onClick={() => { setShowStats(v => !v); }} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid", fontSize: 12, cursor: "pointer", fontWeight: 500, borderColor: showStats ? "#fff" : "rgba(255,255,255,0.15)", background: showStats ? "rgba(255,255,255,0.15)" : "transparent", color: showStats ? "#fff" : "rgba(255,255,255,0.45)" }}>
            📊 Статистика
          </button>
        </div>
      </div>

      {/* ── Легенда (левый низ) ── */}
      <div style={{ ...panel, bottom: 24, left: 16, padding: "10px 14px" }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Шкала шума</div>
        {[
          { col: "#22c55e", label: "Норма", range: "< 65 дБ" },
          { col: "#eab308", label: "Превышение", range: "65–74 дБ" },
          { col: "#ef4444", label: "Критично", range: "≥ 75 дБ" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{ width: 24, height: 3, borderRadius: 2, background: item.col, flexShrink: 0 }} />
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>{item.label}</span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "monospace", marginLeft: "auto", paddingLeft: 8 }}>{item.range}</span>
          </div>
        ))}
      </div>

      {/* ── Карточка выбранной улицы (левый центр) ── */}
      {selected && (
        <div style={{ ...panel, bottom: 170, left: 16, padding: 14, width: 220 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{selected.name}</span>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: getColor(selected.noiseLevel) }} />
            <span style={{ color: getColor(selected.noiseLevel), fontFamily: "monospace", fontSize: 26, fontWeight: 700 }}>{selected.noiseLevel}</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>дБ</span>
          </div>
          {([["Статус", getLabel(selected.noiseLevel), getColor(selected.noiseLevel)], ["Район", selected.district, "rgba(255,255,255,0.55)"], ["Тип", selected.type, "rgba(255,255,255,0.55)"]] as [string, string, string][]).map(([k, v, c]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{k}</span>
              <span style={{ color: c, fontSize: 12 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (selected.noiseLevel - 40) / 60 * 100)}%`, background: getColor(selected.noiseLevel) }} />
          </div>
        </div>
      )}

      {/* ── Панель улиц (справа) ── */}
      {showStreets && (
        <div style={{ ...panel, top: 76, right: 16, width: 230 }}>
          {/* Фильтр районов */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Район</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {[null, ...allDistricts].map(d => (
                <button key={d ?? "all"} onClick={() => setDistrict(d)} style={{ padding: "2px 8px", borderRadius: 4, border: "1px solid", fontSize: 10, cursor: "pointer", fontWeight: 500, borderColor: district === d ? "#fff" : "rgba(255,255,255,0.12)", background: district === d ? "#fff" : "transparent", color: district === d ? "#000" : "rgba(255,255,255,0.4)" }}>
                  {d === null ? "Все" : d.split("-")[0]}
                </button>
              ))}
            </div>
          </div>
          {/* Список */}
          <div style={{ overflowY: "auto", maxHeight: 360 }}>
            {filtered.sort((a, b) => b.noiseLevel - a.noiseLevel).map(s => (
              <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", cursor: "pointer", background: selected?.id === s.id ? "rgba(255,255,255,0.07)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: getColor(s.noiseLevel), flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: getColor(s.noiseLevel), fontWeight: 600 }}>{s.noiseLevel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Панель статистики (справа, ниже улиц) ── */}
      {showStats && (
        <div style={{ ...panel, top: showStreets ? 76 : 76, right: showStreets ? 262 : 16, width: 280, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontWeight: 600, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Статистика
            <button onClick={() => setShowStats(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
          </div>

          {/* Сводка */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
              {[
                { c: norm, col: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Норма" },
                { c: warn, col: "#eab308", bg: "rgba(234,179,8,0.1)", label: "Превышение" },
                { c: critical, col: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Критично" },
              ].map(item => (
                <div key={item.label} style={{ background: item.bg, borderRadius: 8, padding: "7px 4px", textAlign: "center", border: `1px solid ${item.col}25` }}>
                  <div style={{ color: item.col, fontSize: 18, fontFamily: "monospace", fontWeight: 700 }}>{item.c}</div>
                  <div style={{ color: `${item.col}80`, fontSize: 9, marginTop: 1 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "5px 10px" }}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Средний уровень</span>
              <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 13 }}>{avg} дБ</span>
            </div>
          </div>

          {/* Районы */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Районы</div>
            {distStats.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 11, width: 16, textAlign: "right" }}>{i + 1}</span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, width: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.avg - 40) / 60 * 100}%`, background: getColor(d.avg) }} />
                </div>
                <span style={{ color: getColor(d.avg), fontFamily: "monospace", fontSize: 12, width: 44, textAlign: "right" }}>{d.avg} дБ</span>
              </div>
            ))}
          </div>

          {/* Топ-5 */}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Топ-5 шумных</div>
            {[...streets].sort((a, b) => b.noiseLevel - a.noiseLevel).slice(0, 5).map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 6, marginBottom: 6, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 11, width: 16, textAlign: "right" }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>{s.district}</div>
                </div>
                <span style={{ color: getColor(s.noiseLevel), fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>{s.noiseLevel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
