export interface Street {
  id: number;
  name: string;
  district: string;
  noiseLevel: number; // дБ
  coords: [number, number][];
  type: 'highway' | 'arterial' | 'residential' | 'industrial';
}

export const streets: Street[] = [
  // Центр
  { id: 1, name: "ул. Кремлёвская", district: "Вахитовский", noiseLevel: 78, type: "arterial", coords: [[55.7983, 49.1054], [55.7960, 49.1120], [55.7940, 49.1180]] },
  { id: 2, name: "ул. Баумана", district: "Вахитовский", noiseLevel: 72, type: "arterial", coords: [[55.7970, 49.1030], [55.7960, 49.1070], [55.7950, 49.1100]] },
  { id: 3, name: "ул. Пушкина", district: "Вахитовский", noiseLevel: 65, type: "residential", coords: [[55.7940, 49.1080], [55.7930, 49.1130], [55.7920, 49.1180]] },
  { id: 4, name: "ул. Карла Маркса", district: "Вахитовский", noiseLevel: 70, type: "arterial", coords: [[55.7960, 49.1000], [55.7950, 49.1060], [55.7935, 49.1110]] },
  { id: 5, name: "ул. Островского", district: "Вахитовский", noiseLevel: 62, type: "residential", coords: [[55.7910, 49.1050], [55.7900, 49.1100], [55.7890, 49.1150]] },

  // Проспекты — высокий шум
  { id: 6, name: "пр. Победы", district: "Вахитовский", noiseLevel: 82, type: "highway", coords: [[55.8020, 49.1150], [55.7980, 49.1200], [55.7940, 49.1250], [55.7900, 49.1300]] },
  { id: 7, name: "пр. Ямашева", district: "Ново-Савиновский", noiseLevel: 85, type: "highway", coords: [[55.8100, 49.1700], [55.8070, 49.1760], [55.8040, 49.1820], [55.8010, 49.1880]] },
  { id: 8, name: "пр. Амирхана", district: "Ново-Савиновский", noiseLevel: 80, type: "highway", coords: [[55.8060, 49.1600], [55.8030, 49.1650], [55.8000, 49.1700]] },

  // Кольцо / большие магистрали
  { id: 9, name: "ул. Адоратского", district: "Ново-Савиновский", noiseLevel: 76, type: "arterial", coords: [[55.8150, 49.1850], [55.8120, 49.1820], [55.8090, 49.1790]] },
  { id: 10, name: "ул. Чистопольская", district: "Ново-Савиновский", noiseLevel: 74, type: "arterial", coords: [[55.8200, 49.1900], [55.8180, 49.1850], [55.8160, 49.1800]] },

  // Советский район
  { id: 11, name: "ул. Гагарина", district: "Советский", noiseLevel: 79, type: "arterial", coords: [[55.7750, 49.1350], [55.7720, 49.1400], [55.7690, 49.1450]] },
  { id: 12, name: "ул. Декабристов", district: "Советский", noiseLevel: 68, type: "residential", coords: [[55.7780, 49.1280], [55.7760, 49.1330], [55.7740, 49.1380]] },
  { id: 13, name: "ул. Чехова", district: "Советский", noiseLevel: 60, type: "residential", coords: [[55.7820, 49.1220], [55.7800, 49.1270], [55.7780, 49.1320]] },

  // Авиастроительный — промышленность
  { id: 14, name: "ул. Дементьева", district: "Авиастроительный", noiseLevel: 88, type: "industrial", coords: [[55.8400, 49.0800], [55.8380, 49.0860], [55.8360, 49.0920]] },
  { id: 15, name: "ул. Копылова", district: "Авиастроительный", noiseLevel: 84, type: "industrial", coords: [[55.8350, 49.0750], [55.8330, 49.0810], [55.8310, 49.0870]] },
  { id: 16, name: "ул. Побежимова", district: "Авиастроительный", noiseLevel: 71, type: "arterial", coords: [[55.8300, 49.0900], [55.8280, 49.0960], [55.8260, 49.1020]] },

  // Московский район
  { id: 17, name: "ул. Восстания", district: "Московский", noiseLevel: 77, type: "arterial", coords: [[55.7650, 49.0800], [55.7630, 49.0860], [55.7610, 49.0920]] },
  { id: 18, name: "ул. Тэцевская", district: "Московский", noiseLevel: 83, type: "industrial", coords: [[55.7700, 49.0700], [55.7680, 49.0760], [55.7660, 49.0820]] },
  { id: 19, name: "ул. Химиков", district: "Московский", noiseLevel: 64, type: "residential", coords: [[55.7620, 49.0950], [55.7600, 49.1000], [55.7580, 49.1050]] },
  { id: 20, name: "ул. Закиева", district: "Московский", noiseLevel: 69, type: "residential", coords: [[55.7670, 49.0880], [55.7650, 49.0930], [55.7630, 49.0980]] },

  // Приволжский
  { id: 21, name: "ул. Фатыха Амирхана", district: "Приволжский", noiseLevel: 73, type: "arterial", coords: [[55.7500, 49.1400], [55.7480, 49.1460], [55.7460, 49.1520]] },
  { id: 22, name: "ул. Родина", district: "Приволжский", noiseLevel: 58, type: "residential", coords: [[55.7450, 49.1550], [55.7430, 49.1610], [55.7410, 49.1670]] },
  { id: 23, name: "ул. Миля", district: "Приволжский", noiseLevel: 61, type: "residential", coords: [[55.7520, 49.1500], [55.7500, 49.1560], [55.7480, 49.1620]] },

  // Кировский
  { id: 24, name: "ул. Магистральная", district: "Кировский", noiseLevel: 86, type: "highway", coords: [[55.7800, 49.0500], [55.7770, 49.0570], [55.7740, 49.0640]] },
  { id: 25, name: "ул. Складская", district: "Кировский", noiseLevel: 81, type: "industrial", coords: [[55.7850, 49.0450], [55.7820, 49.0520], [55.7790, 49.0590]] },
  { id: 26, name: "ул. Лесгафта", district: "Кировский", noiseLevel: 55, type: "residential", coords: [[55.7730, 49.0680], [55.7710, 49.0740], [55.7690, 49.0800]] },

  // Ново-Савиновский жилые
  { id: 27, name: "ул. Сибирский тракт", district: "Ново-Савиновский", noiseLevel: 87, type: "highway", coords: [[55.8250, 49.2000], [55.8220, 49.2080], [55.8190, 49.2160]] },
  { id: 28, name: "ул. Хади Такташа", district: "Ново-Савиновский", noiseLevel: 66, type: "residential", coords: [[55.8080, 49.1720], [55.8060, 49.1780], [55.8040, 49.1840]] },
  { id: 29, name: "ул. Маяковского", district: "Ново-Савиновский", noiseLevel: 59, type: "residential", coords: [[55.8120, 49.1660], [55.8100, 49.1720], [55.8080, 49.1780]] },

  // Казанка / набережная
  { id: 30, name: "ул. Правобулачная", district: "Вахитовский", noiseLevel: 63, type: "residential", coords: [[55.7900, 49.1100], [55.7880, 49.1140], [55.7860, 49.1180]] },
];

export const getNoiseColor = (level: number): string => {
  if (level < 65) return "#22c55e"; // зелёный — норма
  if (level < 75) return "#eab308"; // жёлтый — превышение
  return "#ef4444"; // красный — выше нормы
};

export const getNoiseWeight = (level: number): number => {
  if (level < 65) return 3;
  if (level < 75) return 4;
  return 5;
};

export const getNoiseLabel = (level: number): string => {
  if (level < 65) return "Норма";
  if (level < 75) return "Превышение";
  return "Критический";
};

export const districts = [...new Set(streets.map(s => s.district))];
