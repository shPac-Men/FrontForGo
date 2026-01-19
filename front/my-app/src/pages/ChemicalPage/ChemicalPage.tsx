import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ChemicalElement } from '../../types/chemistry';
import { getChemicals } from '../../modules/chemistryApi';
import './ChemicalPage.css';
import { ROUTES } from '../../Routes';
import reactSvg from '../../assets/react.svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/filterSlice';
import { addToDraft } from '../../store/draftSlice';
import { STATIC_BASE } from '../../config/config';
import { api } from '../../api';

const DEFAULT_IMAGE = reactSvg;

type CartIconEl = HTMLElement & {
  count?: number;
  staticBase?: string;
  icon?: string;
};

export const ChemicalPage: FC = () => {
  const [chemicals, setChemicals] = useState<ChemicalElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [cartIconLoaded, setCartIconLoaded] = useState(false);
  const [errorLoadingMicrofrontend, setErrorLoadingMicrofrontend] = useState(false);

  const cartContainerRef = useRef<HTMLDivElement>(null);
  const cartElRef = useRef<CartIconEl | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const searchQuery = useAppSelector((state) => state.filter.query);

  const MICROFRONTEND_URL = '/FrontendElements/cart-icon.iife.js';

  // 1) загрузка скрипта (один раз)
  useEffect(() => {
    if (customElements.get('cart-icon')) {
      setCartIconLoaded(true);
      return;
    }

    if (scriptRef.current) return;

    const script = document.createElement('script');
    scriptRef.current = script;
    script.src = MICROFRONTEND_URL;
    script.async = true;

    script.onload = () => {
      setCartIconLoaded(true);
      setErrorLoadingMicrofrontend(false);
    };

    script.onerror = () => {
      setErrorLoadingMicrofrontend(true);
      setCartIconLoaded(false);
      scriptRef.current = null;
    };

    document.head.appendChild(script);
  }, []);

  // 2) создать cart-icon (один раз) + подписаться на событие
  useEffect(() => {
    if (!cartIconLoaded) return;
    const host = cartContainerRef.current;
    if (!host) return;

    // если уже создан — ничего не делаем
    if (cartElRef.current) return;

    const el = document.createElement('cart-icon') as CartIconEl;
    cartElRef.current = el;

    // лучше properties, чем setAttribute (особенно для number)
    el.staticBase = '/staticimages';
    el.icon = 'breaker.svg';
    el.count = cartCount;

    const onCartClick = (e: Event) => {
      e.preventDefault?.();
      navigate(ROUTES.MIXING);
    };

    el.addEventListener('cartClick', onCartClick);
    host.appendChild(el);

    return () => {
      el.removeEventListener('cartClick', onCartClick);
      host.removeChild(el);
      cartElRef.current = null;
    };
  }, [cartIconLoaded, navigate]); // cartCount тут НЕ нужен

  // 3) обновлять count без пересоздания элемента
  useEffect(() => {
    if (!cartIconLoaded) return;
    const el = cartElRef.current;
    if (!el) return;

    el.count = cartCount;
  }, [cartIconLoaded, cartCount]);

  // ---- остальной ваш код как был ----

  const loadChemicals = async (query?: string) => {
    setLoading(true);
    try {
      const elements = await getChemicals(query);
      setChemicals(elements);
    } catch (error) {
      console.error('Error loading chemicals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const response = await api.mixing.cartIconList();
      const anyRes = response as any;
      let count = 0;

      if (anyRes.data) {
        count = anyRes.data.ItemsCount ?? anyRes.data.items_count ?? 0;
      } else if (anyRes.ItemsCount !== undefined || anyRes.items_count !== undefined) {
        count = anyRes.ItemsCount ?? anyRes.items_count ?? 0;
      }
      setCartCount(count);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (!searchQuery) loadChemicals(undefined);
  }, [searchQuery]);

  useEffect(() => {
    loadCartCount();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadChemicals(searchQuery);
  };

  const handleAddToMixing = async (id: number) => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      await dispatch(addToDraft({ element_id: id, volume: 100 })).unwrap();
      await loadCartCount();
    } catch (error) {
      alert('Ошибка при добавлении');
    }
  };

  return (
    <div className="chemistry-page">
      <section className="hero">
        <header className="hero-header">
          <h1>
            <Link to={ROUTES.HOME} className="hero-logo-link">
              <img src={`${STATIC_BASE}/image.svg`} alt="home" width="60" />
            </Link>
          </h1>
        </header>
      </section>

      <div className="search-section">
        <div ref={cartContainerRef}>
          {errorLoadingMicrofrontend && (
            <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
              Микрофронтенд не загрузился
            </div>
          )}
          {!cartIconLoaded && !errorLoadingMicrofrontend && (
            <div style={{ padding: '12px', background: '#f0f0f0', borderRadius: '6px' }}>
              Загрузка...
            </div>
          )}
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="query"
            placeholder="Введите запрос"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          <button type="submit">Найти</button>
        </form>
      </div>

      <main>
        <div className="cards-container">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : chemicals.length === 0 ? (
            <div className="no-results">Реактивы не найдены</div>
          ) : (
            chemicals.map((chemical) => (
              <div key={chemical.id} className="card">
                <img
                  src={chemical.image || DEFAULT_IMAGE}
                  alt={chemical.name}
                  className="card-img"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE;
                  }}
                />
                <h3>{chemical.name}</h3>
                <p><strong>Концентрация:</strong> {chemical.concentration}</p>
                <p><strong>pH:</strong> {chemical.ph}</p>

                <div className="card-actions">
                  <Link
                    to={ROUTES.ELEMENT_DETAIL.replace(':id', chemical.id.toString())}
                    className="btn"
                  >
                    Подробнее
                  </Link>

                  {user && (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleAddToMixing(chemical.id)}
                    >
                      В корзину
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
