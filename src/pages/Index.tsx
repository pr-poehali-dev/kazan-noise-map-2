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
const districts = [...new Set(streets.map(s => s.district))];

export default function Index() {
  const [tab, setTab] = useState<"map" | "stats">("map");
  const [district, setDistrict] = useState<string | null>(null);
  const [selected, setSelected] = useState<Street | null>(null);

  const filtered = district ? streets.filter(s => s.district === district) : streets;
  const avg = Math.round(filtered.reduce((a, s) => a + s.noiseLevel, 0) / filtered.length);
  const critical = filtered.filter(s => s.noiseLevel >= 75).length;
  const warn = filtered.filter(s => s.noiseLevel >= 65 && s.noiseLevel < 75).length;
  const norm = filtered.filter(s => s.noiseLevel < 65).length;

  const distStats = districts.map(d => {
    const ds = streets.filter(s => s.district === d);
    return { name: d, avg: Math.round(ds.reduce((a, s) => a + s.noiseLevel, 0) / ds.length), count: ds.length };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0f0f0f", fontFamily: "'IBM Plex Sans', sans-serif", color: "#fff" }}>

      {/* Хедер */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22c55e, #eab308, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔊</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Шумовое загрязнение Казани</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}>30 улиц · 7 районов</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 3 }}>
          {(["map", "stats"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: tab === t ? "rgba(255,255,255,0.15)" : "transparent", color: tab === t ? "#fff" : "rgba(255,255,255,0.4)" }}>
              {t === "map" ? "Карта" : "Статистика"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* Боковая панель */}
        <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.08)", background: "#111", display: "flex", flexDirection: "column", overflowY: "auto" }}>

          {/* Фильтр */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Район</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[null, ...districts].map(d => (
                <button key={d ?? "all"} onClick={() => setDistrict(d)} style={{ padding: "3px 10px", borderRadius: 4, border: "1px solid", fontSize: 11, cursor: "pointer", fontWeight: 500, borderColor: district === d ? "#fff" : "rgba(255,255,255,0.12)", background: district === d ? "#fff" : "transparent", color: district === d ? "#000" : "rgba(255,255,255,0.4)" }}>
                  {d === null ? "Все" : d.split("-")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Счётчики */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Сводка</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[
                { c: norm, col: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Норма" },
                { c: warn, col: "#eab308", bg: "rgba(234,179,8,0.1)", label: "Превышение" },
                { c: critical, col: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Критично" }
              ].map(item => (
                <div key={item.label} style={{ background: item.bg, borderRadius: 8, padding: "8px 6px", textAlign: "center", border: `1px solid ${item.col}30` }}>
                  <div style={{ color: item.col, fontSize: 20, fontFamily: "monospace", fontWeight: 600 }}>{item.c}</div>
                  <div style={{ color: `${item.col}80`, fontSize: 10, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "6px 10px" }}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Средний уровень</span>
              <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 13 }}>{avg} дБ</span>
            </div>
          </div>

          {/* Легенда */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Шкала</div>
            {[
              { col: "#22c55e", label: "Норма", range: "< 65 дБ" },
              { col: "#eab308", label: "Превышение", range: "65–74 дБ" },
              { col: "#ef4444", label: "Критично", range: "≥ 75 дБ" }
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 28, height: 4, borderRadius: 2, background: item.col, flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{item.label}</span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "monospace", marginLeft: "auto" }}>{item.range}</span>
              </div>
            ))}
          </div>

          {/* Выбранная улица */}
          {selected && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Выбрана улица</div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{selected.name}</span>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: getColor(selected.noiseLevel), flexShrink: 0 }} />
                  <span style={{ color: getColor(selected.noiseLevel), fontFamily: "monospace", fontSize: 28, fontWeight: 600 }}>{selected.noiseLevel}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>дБ</span>
                </div>
                {([["Статус", getLabel(selected.noiseLevel), getColor(selected.noiseLevel)], ["Район", selected.district, "rgba(255,255,255,0.6)"], ["Тип", selected.type, "rgba(255,255,255,0.6)"]] as [string, string, string][]).map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{k}</span>
                    <span style={{ color: c, fontSize: 12 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 10, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (selected.noiseLevel - 40) / 60 * 100)}%`, background: getColor(selected.noiseLevel), borderRadius: 2 }} />
                </div>
              </div>
            </div>
          )}

          <div style={{ flex: 1 }} />
          <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)", fontSize: 10, lineHeight: 1.5 }}>
            Норматив ВОЗ: 55 дБ днём, 45 дБ ночью. Данные расчётные.
          </div>
        </div>

        {/* Контент */}
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          {tab === "map" ? (
            <>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=48.9500%2C55.7300%2C49.2800%2C55.8500&layer=mapnik"
                style={{ width: "100%", height: "100%", border: "none", filter: "invert(90%) hue-rotate(180deg)" }}
                title="Карта Казани"
              />

              {/* Список улиц поверх карты */}
              <div style={{ position: "absolute", top: 16, right: 16, width: 240, maxHeight: "calc(100% - 80px)", background: "rgba(10,10,10,0.92)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", zIndex: 10 }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 2 }}>
                  Улицы — нажмите для деталей
                </div>
                <div style={{ overflowY: "auto", maxHeight: 420 }}>
                  {filtered.sort((a, b) => b.noiseLevel - a.noiseLevel).map(s => (
                    <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", cursor: "pointer", background: selected?.id === s.id ? "rgba(255,255,255,0.06)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: getColor(s.noiseLevel), flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 12, color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: getColor(s.noiseLevel), fontWeight: 600, flexShrink: 0 }}>{s.noiseLevel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Легенда снизу */}
              <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(10,10,10,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", display: "flex", gap: 20, zIndex: 10 }}>
                {[{ col: "#22c55e", label: "Норма" }, { col: "#eab308", label: "Превышение" }, { col: "#ef4444", label: "Критично" }].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 20, height: 3, borderRadius: 2, background: item.col }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: "100%", overflowY: "auto", padding: 24, background: "#0f0f0f" }}>
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#fff" }}>Статистика шумового загрязнения</h2>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 4 }}>Сравнение районов и улиц по уровню шума</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Макс. шум", value: `${Math.max(...filtered.map(s => s.noiseLevel))} дБ`, col: "#ef4444" },
                    { label: "Мин. шум", value: `${Math.min(...filtered.map(s => s.noiseLevel))} дБ`, col: "#22c55e" },
                    { label: "Средний", value: `${avg} дБ`, col: "#eab308" },
                    { label: "Критичных", value: `${critical} ул.`, col: "#ef4444" },
                  ].map(c => (
                    <div key={c.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16 }}>
                      <div style={{ color: c.col, fontFamily: "monospace", fontSize: 22, fontWeight: 600 }}>{c.value}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>{c.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16, color: "#fff" }}>Районы по уровню шума</div>
                  {distStats.map((d, i) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 12, width: 20, textAlign: "right" }}>{i + 1}</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, width: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(d.avg - 40) / 60 * 100}%`, background: getColor(d.avg), borderRadius: 2 }} />
                      </div>
                      <span style={{ color: getColor(d.avg), fontFamily: "monospace", fontSize: 13, width: 52, textAlign: "right" }}>{d.avg} дБ</span>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 11, width: 40 }}>{d.count} ул.</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16, color: "#fff" }}>Топ-10 шумных улиц</div>
                  {[...streets].sort((a, b) => b.noiseLevel - a.noiseLevel).slice(0, 10).map((s, i) => (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < 9 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 12, width: 20, textAlign: "right" }}>{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{s.name}</div>
                        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{s.district}</div>
                      </div>
                      <span style={{ background: `${getColor(s.noiseLevel)}20`, color: getColor(s.noiseLevel), fontSize: 11, padding: "2px 8px", borderRadius: 4 }}>{getLabel(s.noiseLevel)}</span>
                      <span style={{ color: getColor(s.noiseLevel), fontFamily: "monospace", fontSize: 14, fontWeight: 600, width: 52, textAlign: "right" }}>{s.noiseLevel} дБ</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12, color: "#fff" }}>Распределение</div>
                  <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", gap: 2 }}>
                    <div style={{ flex: norm, background: "#22c55e" }} />
                    <div style={{ flex: warn, background: "#eab308" }} />
                    <div style={{ flex: critical, background: "#ef4444" }} />
                  </div>
                  <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                    {[{ label: "Норма", count: norm, col: "#22c55e" }, { label: "Превышение", count: warn, col: "#eab308" }, { label: "Критично", count: critical, col: "#ef4444" }].map(item => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.col }} />
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{item.label}</span>
                        <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: 12 }}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
