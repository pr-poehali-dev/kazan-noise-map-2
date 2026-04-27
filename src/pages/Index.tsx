import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Tooltip, useMap } from "react-leaflet";
import { streets, getNoiseColor, getNoiseWeight, getNoiseLabel, districts, type Street } from "@/data/noiseData";
import Icon from "@/components/ui/icon";
import "leaflet/dist/leaflet.css";

const KAZАНЬ_CENTER: [number, number] = [55.796, 49.106];

// Компонент для подстройки карты
function MapController({ selectedDistrict }: { selectedDistrict: string | null }) {
  const map = useMap();
  useEffect(() => {
    map.setView(KAZАНЬ_CENTER, selectedDistrict ? 13 : 12);
  }, [selectedDistrict, map]);
  return null;
}

export default function Index() {
  const [selected, setSelected] = useState<Street | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"map" | "stats">("map");

  const filtered = selectedDistrict
    ? streets.filter(s => s.district === selectedDistrict)
    : streets;

  const avg = Math.round(filtered.reduce((acc, s) => acc + s.noiseLevel, 0) / filtered.length);
  const max = Math.max(...filtered.map(s => s.noiseLevel));
  const min = Math.min(...filtered.map(s => s.noiseLevel));
  const critical = filtered.filter(s => s.noiseLevel >= 75).length;
  const warning = filtered.filter(s => s.noiseLevel >= 65 && s.noiseLevel < 75).length;
  const normal = filtered.filter(s => s.noiseLevel < 65).length;

  // Статистика по районам
  const districtStats = districts.map(d => {
    const dStreets = streets.filter(s => s.district === d);
    return {
      name: d,
      avg: Math.round(dStreets.reduce((acc, s) => acc + s.noiseLevel, 0) / dStreets.length),
      count: dStreets.length,
    };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f0f0f] font-ibm overflow-hidden">
      {/* Хедер */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/8 bg-[#0f0f0f]/95 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 flex items-center justify-center">
            <Icon name="Volume2" size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-medium text-sm tracking-wide leading-none">Шумовое загрязнение</h1>
            <p className="text-white/30 text-[11px] font-mono mt-0.5">Казань · 2024</p>
          </div>
        </div>

        {/* Табы */}
        <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "map"
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Карта
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "stats"
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Статистика
          </button>
        </div>

        <div className="text-white/20 text-xs font-mono">{streets.length} улиц</div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Боковая панель */}
        <aside className="w-72 flex-shrink-0 border-r border-white/8 bg-[#111111] flex flex-col overflow-hidden">
          
          {/* Фильтр по районам */}
          <div className="p-4 border-b border-white/8">
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3">Район</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedDistrict(null)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all border ${
                  !selectedDistrict
                    ? "bg-white text-black border-white"
                    : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                }`}
              >
                Все
              </button>
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d === selectedDistrict ? null : d)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all border ${
                    selectedDistrict === d
                      ? "bg-white text-black border-white"
                      : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                  }`}
                >
                  {d.split("-")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Сводка */}
          <div className="p-4 border-b border-white/8">
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3">Сводка</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 text-center">
                <div className="text-green-400 text-lg font-mono font-medium">{normal}</div>
                <div className="text-green-500/60 text-[10px] mt-0.5">Норма</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 text-center">
                <div className="text-yellow-400 text-lg font-mono font-medium">{warning}</div>
                <div className="text-yellow-500/60 text-[10px] mt-0.5">Превышение</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 text-center">
                <div className="text-red-400 text-lg font-mono font-medium">{critical}</div>
                <div className="text-red-500/60 text-[10px] mt-0.5">Критично</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between bg-white/3 rounded-lg px-3 py-2">
              <span className="text-white/30 text-xs">Средний уровень</span>
              <span className="text-white font-mono text-sm font-medium">{avg} дБ</span>
            </div>
          </div>

          {/* Легенда */}
          <div className="p-4 border-b border-white/8">
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3">Шкала шума</p>
            <div className="space-y-2">
              {[
                { color: "#22c55e", label: "Норма", range: "< 65 дБ", desc: "Тихие улицы" },
                { color: "#eab308", label: "Превышение", range: "65–74 дБ", desc: "Допустимый предел" },
                { color: "#ef4444", label: "Критично", range: "≥ 75 дБ", desc: "Выше нормы" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">{item.label}</span>
                      <span className="text-white/30 text-[10px] font-mono">{item.range}</span>
                    </div>
                    <div className="text-white/20 text-[10px]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Выбранная улица */}
          {selected && (
            <div className="p-4 animate-fade-in">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3">Выбрана улица</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-white font-medium text-sm leading-tight">{selected.name}</h3>
                  <button onClick={() => setSelected(null)} className="text-white/20 hover:text-white/50 flex-shrink-0">
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getNoiseColor(selected.noiseLevel) }}
                  />
                  <span className="font-mono text-2xl font-medium" style={{ color: getNoiseColor(selected.noiseLevel) }}>
                    {selected.noiseLevel}
                  </span>
                  <span className="text-white/30 text-sm">дБ</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/30">Статус</span>
                    <span style={{ color: getNoiseColor(selected.noiseLevel) }}>{getNoiseLabel(selected.noiseLevel)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Район</span>
                    <span className="text-white/60">{selected.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Тип</span>
                    <span className="text-white/60">
                      {selected.type === "highway" ? "Магистраль" :
                       selected.type === "arterial" ? "Артерия" :
                       selected.type === "industrial" ? "Промышленная" : "Жилая"}
                    </span>
                  </div>
                </div>
                {/* Шкала */}
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (selected.noiseLevel - 40) / 60 * 100)}%`,
                        backgroundColor: getNoiseColor(selected.noiseLevel)
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/20 mt-1 font-mono">
                    <span>40</span><span>70</span><span>100 дБ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* Норматив */}
          <div className="p-4 border-t border-white/8">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={12} className="text-white/20 flex-shrink-0 mt-0.5" />
              <p className="text-white/20 text-[10px] leading-relaxed">
                Норматив ВОЗ: 55 дБ днём, 45 дБ ночью. Данные — расчётные, на основе транспортной нагрузки.
              </p>
            </div>
          </div>
        </aside>

        {/* Основная область */}
        <main className="flex-1 relative min-w-0">
          {activeTab === "map" ? (
            <>
              <MapContainer
                center={KAZАНЬ_CENTER}
                zoom={12}
                style={{ width: "100%", height: "100%" }}
                zoomControl={false}
              >
                <MapController selectedDistrict={selectedDistrict} />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                {filtered.map(street => (
                  <Polyline
                    key={street.id}
                    positions={street.coords}
                    pathOptions={{
                      color: getNoiseColor(street.noiseLevel),
                      weight: getNoiseWeight(street.noiseLevel),
                      opacity: selected?.id === street.id ? 1 : 0.8,
                    }}
                    eventHandlers={{
                      click: () => setSelected(street),
                      mouseover: (e) => e.target.setStyle({ opacity: 1, weight: getNoiseWeight(street.noiseLevel) + 2 }),
                      mouseout: (e) => e.target.setStyle({ opacity: 0.8, weight: getNoiseWeight(street.noiseLevel) }),
                    }}
                  >
                    <Tooltip
                      sticky
                      className="noise-tooltip"
                      direction="top"
                    >
                      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "11px", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 10px", color: "#fff", whiteSpace: "nowrap" }}>
                        <div style={{ fontFamily: "IBM Plex Sans, sans-serif", fontWeight: 500, marginBottom: 2 }}>{street.name}</div>
                        <div style={{ color: getNoiseColor(street.noiseLevel) }}>{street.noiseLevel} дБ · {getNoiseLabel(street.noiseLevel)}</div>
                      </div>
                    </Tooltip>
                  </Polyline>
                ))}
              </MapContainer>

              {/* Мини-легенда поверх карты */}
              <div className="absolute bottom-6 right-6 z-[1000] bg-[#111]/90 backdrop-blur border border-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center gap-4">
                  {[
                    { color: "#22c55e", label: "Норма" },
                    { color: "#eab308", label: "Превышение" },
                    { color: "#ef4444", label: "Критично" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="w-6 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-white/50 text-[11px]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Панель статистики */
            <div className="h-full overflow-y-auto p-6 bg-[#0f0f0f]">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h2 className="text-white font-medium text-lg mb-1">Статистика шумового загрязнения</h2>
                  <p className="text-white/30 text-sm">Сравнение районов и улиц по уровню шума</p>
                </div>

                {/* Карточки */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Макс. шум", value: `${max} дБ`, icon: "TrendingUp", color: "#ef4444" },
                    { label: "Мин. шум", value: `${min} дБ`, icon: "TrendingDown", color: "#22c55e" },
                    { label: "Средний", value: `${avg} дБ`, icon: "BarChart2", color: "#eab308" },
                    { label: "Критичных", value: `${critical} улиц`, icon: "AlertTriangle", color: "#ef4444" },
                  ].map(card => (
                    <div key={card.label} className="bg-white/3 border border-white/8 rounded-xl p-4">
                      <Icon name={card.icon} size={16} className="mb-3" style={{ color: card.color }} />
                      <div className="text-white font-mono text-xl font-medium">{card.value}</div>
                      <div className="text-white/30 text-xs mt-1">{card.label}</div>
                    </div>
                  ))}
                </div>

                {/* Рейтинг районов */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="text-white font-medium text-sm mb-4">Районы по уровню шума</h3>
                  <div className="space-y-3">
                    {districtStats.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-4">
                        <div className="w-5 text-white/20 text-xs font-mono text-right">{i + 1}</div>
                        <div className="w-36 text-white/60 text-sm truncate">{d.name}</div>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(d.avg - 40) / 60 * 100}%`,
                              backgroundColor: getNoiseColor(d.avg)
                            }}
                          />
                        </div>
                        <div className="w-16 font-mono text-sm text-right" style={{ color: getNoiseColor(d.avg) }}>
                          {d.avg} дБ
                        </div>
                        <div className="w-16 text-white/20 text-xs font-mono">{d.count} ул.</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Топ самых шумных улиц */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="text-white font-medium text-sm mb-4">Топ-10 самых шумных улиц</h3>
                  <div className="space-y-2">
                    {[...streets].sort((a, b) => b.noiseLevel - a.noiseLevel).slice(0, 10).map((s, i) => (
                      <div key={s.id} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                        <div className="w-5 text-white/20 text-xs font-mono text-right">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white/80 text-sm truncate">{s.name}</div>
                          <div className="text-white/25 text-[11px]">{s.district}</div>
                        </div>
                        <div
                          className="px-2 py-0.5 rounded text-[11px] font-medium"
                          style={{ backgroundColor: `${getNoiseColor(s.noiseLevel)}18`, color: getNoiseColor(s.noiseLevel) }}
                        >
                          {getNoiseLabel(s.noiseLevel)}
                        </div>
                        <div className="font-mono text-sm font-medium w-14 text-right" style={{ color: getNoiseColor(s.noiseLevel) }}>
                          {s.noiseLevel} дБ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Распределение */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="text-white font-medium text-sm mb-4">Распределение по статусу</h3>
                  <div className="flex gap-3 items-center">
                    <div className="flex-1 h-4 flex rounded-full overflow-hidden gap-0.5">
                      <div className="h-full bg-green-500 transition-all" style={{ width: `${normal / streets.length * 100}%` }} />
                      <div className="h-full bg-yellow-500 transition-all" style={{ width: `${warning / streets.length * 100}%` }} />
                      <div className="h-full bg-red-500 transition-all" style={{ width: `${critical / streets.length * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-6 mt-3">
                    {[
                      { label: "Норма", count: normal, color: "#22c55e" },
                      { label: "Превышение", count: warning, color: "#eab308" },
                      { label: "Критично", count: critical, color: "#ef4444" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white/40 text-xs">{item.label}</span>
                        <span className="text-white/60 text-xs font-mono">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}