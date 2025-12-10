import type { ChemicalElement } from '../types/chemistry';
// ApiResponse больше не нужен, так как бэкенд возвращает чистые данные

const API_BASE = '/api/v1';

// Mock данные для fallback
export const CHEMICALS_MOCK: ChemicalElement[] = [
  {
    id: 1,
    name: "NaCl",
    description: "Sodium chloride",
    ph: 7.0,
    concentration: 0.15,
    image: "/staticimages/nacl.jpg"
  },
  {
    id: 2,
    name: "HCl", 
    description: "Hydrochloric acid",
    ph: 1.0,
    concentration: 0.5,
    image: ""
  },
  {
    id: 3,
    name: "H2SO4",
    description: "Sulfuric acid", 
    ph: 0.0,
    concentration: 2.0,
    image: "/staticimages/64352489.jpg"
  },
  {
    id: 5,
    name: "NH3",
    description: "Ammonia",
    ph: 11.0,
    concentration: 1.0,
    image: "/staticimages/nh3.jpg"
  },
  {
    id: 6,
    name: "NaOH",
    description: "Sodium hydroxide",
    ph: 14.0,
    concentration: 1.0,
    image: "/staticimages/NaOH.jpg"
  }
];

// Получить список элементов
// Изменено: теперь API возвращает массив элементов напрямую, а не { data: { items: [] } }
export const getChemicals = async (query?: string): Promise<ChemicalElement[]> => {
  try {
    const url = query ? `${API_BASE}/elements?query=${encodeURIComponent(query)}` : `${API_BASE}/elements`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Бэкенд возвращает массив напрямую: [ElementResponse, ...]
    const data: ChemicalElement[] = await response.json();
    
    return data || [];
  } catch (error) {
    console.warn('API request failed, using mock data:', error);
    
    if (query) {
      return CHEMICALS_MOCK.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return CHEMICALS_MOCK;
  }
};

// Получить один элемент по ID
// Изменено: API возвращает объект элемента напрямую
export const getChemicalById = async (id: number): Promise<ChemicalElement | null> => {
  try {
    const response = await fetch(`${API_BASE}/elements/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Бэкенд возвращает объект элемента напрямую
    const data: ChemicalElement = await response.json();
    return data;
  } catch (error) {
    console.warn('Failed to fetch element, using mock:', error);
    return CHEMICALS_MOCK.find((el) => el.id === id) || null;
  }
};

// Добавить в корзину
export const addToMixing = async (element_id: number, volume: number = 100): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/mixing/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ element_id, volume }),
    });
    
    // Статус 200 или 201 означает успех. 
    // Нам не нужно читать тело ответа для возврата boolean.
    return response.ok;
  } catch (error) {
    console.error('Failed to add to mixing:', error);
    return false;
  }
};

// Получить содержимое корзины
// Изменено: структура ответа теперь проще { items: [], ... } без обертки Data
export const getMixingCart = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE}/mixing`, {
      credentials: 'include',
    });
    
    if (!response.ok) return [];
    
    // Бэкенд возвращает MixingResponse напрямую: { items: [], total_items: 0, ... }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.warn('Failed to fetch mixing cart:', error);
    return [];
  }
};

// Удалить из корзины
export const removeFromMixing = async (element_id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/mixing/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ element_id }),
    });
    
    // Важно: Бэкенд теперь возвращает 204 No Content.
    // НЕ вызываем response.json(), так как тело пустое.
    return response.ok; 
  } catch (error) {
    console.error('Failed to remove from mixing:', error);
    return false;
  }
};

// Получить количество товаров в корзине
// Изменено: убрана вложенность data
export const getCartCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE}/mixing/cart-icon`, {
      credentials: 'include',
    });
    
    if (!response.ok) return 0;
    
    // Бэкенд возвращает { items_count: N, draft_order_id: N } напрямую
    const data = await response.json();
    
    // Проверяем поля в соответствии с JSON тегами в Go (обычно snake_case или camelCase)
    // В Go коде было: type CartIconResponse struct { ItemsCount int ... }
    // Gin по умолчанию сериализует как есть, если нет тегов, или по тегам `json:"items_count"`.
    return data.items_count || data.ItemsCount || 0;
  } catch (error) {
    console.warn('Failed to fetch cart count');
    return 0;
  }
};
