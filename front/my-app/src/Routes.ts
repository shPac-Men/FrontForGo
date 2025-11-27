export const ROUTES = {
  HOME: '/',
  CHEMICALS: '/chemicals',  // ← Главная страница реактивов
  ELEMENTS: '/elements',    // ← Если это нужно, оставь
  ELEMENT_DETAIL: '/elements/:id',
  MIXING: '/mixing',
  CHEMICAL_DETAIL: '/elements/:id',  // ← Деталь реактива (химический элемент)
} as const;

export const ROUTE_LABELS = {
  HOME: 'Главная',
  CHEMICALS: 'Реактивы',
  ELEMENTS: 'Элементы',
  ELEMENT_DETAIL: 'Детали элемента',
  MIXING: 'Смешивание',
  CHEMICAL_DETAIL: 'Детали реактива',
} as const;
