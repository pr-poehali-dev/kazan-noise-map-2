import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { streets, getNoiseColor, getNoiseWeight, getNoiseLabel, districts, type Street } from "@/data/noiseData";
import Icon from "@/components/ui/icon";
import "leaflet/dist/leaflet.css";

const KAZAN_CENTER: [number, number] = [55.796, 49.106];

export default function Index() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);
  const [selected, setSelected] = useState<Street | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"map" | "stats">("map");

  // Инициализация карты
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: KAZAN_CENTER,
      zoom: 12,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; CARTO",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Рисуем линии на карте
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Удаляем старые
    polylinesRef.current.forEach(p => p.remove());
    polylinesRef.current = [];

    const filtered = selectedDistrict
      ? streets.filter(s => s.district === selectedDistrict)
      : streets;

    filtered.forEach(street => {
      const color = getNoiseColor(street.noiseLevel);
      const weight = getNoiseWeight(street.noiseLevel);

      const line = L.polyline(street.coords, {
        color,
        weight,
        opacity: 0.85,
      }).addTo(map);

      line.bindTooltip(
        `<div style="font-family: IBM Plex Mono, monospace; font-size: 11px; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 10px; color: #fff; white-space: nowrap;">
          <div style="font-family: IBM Plex Sans, sans-serif; font-weight: 500; margin-bottom: 2px;">${street.name}</div>
          <div style="color: ${color}">${street.noiseLevel} дБ · ${getNoiseLabel(street.noiseLevel)}</div>
        </div>`,
        { sticky: true, className: "noise-tooltip-wrap" }
      );

      line.on("click", () => setSelected(street));
      line.on("mouseover", () => line.setStyle({ opacity: 1, weight: weight + 2 }));
      line.on("mouseout", () => line.setStyle({ opacity: 0.85, weight }));

      polylinesRef.current.push(line);
    });
  }, [selectedDistrict, mapRef.current]);

  const filtered = selectedDistrict
    ? streets.filter(s => s.district === selectedDistrict)
    : streets;

  const avg = Math.round(filtered.reduce((acc, s) => acc + s.noiseLevel, 0) / filtered.length);
  const max = Math.max(...filtered.map(s => s.noiseLevel));
  const min = Math.min(...filtered.map(s => s.noiseLevel));
  const critical = filtered.filter(s => s.noiseLevel >= 75).length;
  const warning = filtered.filter(s => s.noiseLevel >= 65 && s.noiseLevel < 75).length;
  const normal = filtered.filter(s => s.noiseLevel < 65).length;

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

        <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "map" ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"}`}
          >
            Карта
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "stats" ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"}`}
          >
            Статистика
          </button>
        </div>

        <div className="text-white/20 text-xs font-mono">{streets.length} улиц</div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Боковая панель */}
        <aside className="w-72 flex-shrink-0 border-r border-white/8 bg-[#111111] flex flex-col overflow-y-auto">

          {/* Фильтр районов */}
          <div className="p-4 border-b border-white/8">
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3">Район</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedDistrict(null)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all border ${!selectedDistrict ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"}`}
              >
                Все
              </button>
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d === selectedDistrict ? null : d)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all border ${selectedDistrict === d ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"}`}
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
            <div className="p-4">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3">Выбрана улица</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-white font-medium text-sm leading-tight">{selected.name}</h3>
                  <button onClick={() => setSelected(null)} className="text-white/20 hover:text-white/50 flex-shrink-0">
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getNoiseColor(selected.noiseLevel) }} />
                  <span className="font-mono text-2xl font-medium" style={{ color: getNoiseColor(selected.noiseLevel) }}>{selected.noiseLevel}</span>
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
                      {selected.type === "highway" ? "Магистраль" : selected.type === "arterial" ? "Артерия" : selected.type === "industrial" ? "Промышленная" : "Жилая"}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (selected.noiseLevel - 40) / 60 * 100)}%`, backgroundColor: getNoiseColor(selected.noiseLevel) }}
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
          {/* Карта — всегда в DOM, скрываем через CSS */}
          <div
            ref={mapContainerRef}
            style={{ display: activeTab === "map" ? "block" : "none" }}
            className="absolute inset-0 w-full h-full"
          />

          {/* Мини-легенда поверх карты */}
          {activeTab === "map" && (
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
          )}

          {/* Статистика */}
          {activeTab === "stats" && (
            <div className="absolute inset-0 overflow-y-auto p-6 bg-[#0f0f0f]">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h2 className="text-white font-medium text-lg mb-1">Статистика шумового загрязнения</h2>
                  <p className="text-white/30 text-sm">Сравнение районов и улиц по уровню шума</p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Макс. шум", value: `${max} дБ`, icon: "TrendingUp" as const, color: "#ef4444" },
                    { label: "Мин. шум", value: `${min} дБ`, icon: "TrendingDown" as const, color: "#22c55e" },
                    { label: "Средний", value: `${avg} дБ`, icon: "BarChart2" as const, color: "#eab308" },
                    { label: "Критичных", value: `${critical} улиц`, icon: "AlertTriangle" as const, color: "#ef4444" },
                  ].map(card => (
                    <div key={card.label} className="bg-white/3 border border-white/8 rounded-xl p-4">
                      <Icon name={card.icon} size={16} className="mb-3" style={{ color: card.color }} />
                      <div className="text-white font-mono text-xl font-medium">{card.value}</div>
                      <div className="text-white/30 text-xs mt-1">{card.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="text-white font-medium text-sm mb-4">Районы по уровню шума</h3>
                  <div className="space-y-3">
                    {districtStats.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-4">
                        <div className="w-5 text-white/20 text-xs font-mono text-right">{i + 1}</div>
                        <div className="w-36 text-white/60 text-sm truncate">{d.name}</div>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(d.avg - 40) / 60 * 100}%`, backgroundColor: getNoiseColor(d.avg) }} />
                        </div>
                        <div className="w-16 font-mono text-sm text-right" style={{ color: getNoiseColor(d.avg) }}>{d.avg} дБ</div>
                        <div className="w-16 text-white/20 text-xs font-mono">{d.count} ул.</div>
                      </div>
                    ))}
                  </div>
                </div>

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
                        <div className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ backgroundColor: `${getNoiseColor(s.noiseLevel)}18`, color: getNoiseColor(s.noiseLevel) }}>
                          {getNoiseLabel(s.noiseLevel)}
                        </div>
                        <div className="font-mono text-sm font-medium w-14 text-right" style={{ color: getNoiseColor(s.noiseLevel) }}>{s.noiseLevel} дБ</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="text-white font-medium text-sm mb-4">Распределение по статусу</h3>
                  <div className="flex gap-0.5 h-4 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${normal / streets.length * 100}%` }} />
                    <div className="h-full bg-yellow-500" style={{ width: `${warning / streets.length * 100}%` }} />
                    <div className="h-full bg-red-500" style={{ width: `${critical / streets.length * 100}%` }} />
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
