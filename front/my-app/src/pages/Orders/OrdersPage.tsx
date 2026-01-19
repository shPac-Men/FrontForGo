import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMixed } from '../../store/ordersSlice';
import { ROUTES } from '../../Routes';
import { STATIC_BASE } from '../../config/config';
import './OrdersPage.css';

export const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading } = useAppSelector((state) => state.orders);

  // === фильтр по датам ===
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [dateFrom, setDateFrom] = useState<string>('');       // левая дата
  const [dateTo, setDateTo] = useState<string>(todayISO);     // правая дата = сегодня

  useEffect(() => {
    dispatch(fetchMixed());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Готов';
      case 'draft':
        return 'Черновик';
      case 'pending':
        return 'В работе';
      default:
        return status;
    }
  };

  // отфильтрованный список по date_create
  const filteredList = useMemo(
    () =>
      list.filter((order: any) => {
        if (!order.date_create) return false;

        const orderDate = new Date(order.date_create);

        const fromOk = dateFrom
          ? orderDate >= new Date(dateFrom + 'T00:00:00')
          : true;

        const toOk = dateTo
          ? orderDate <= new Date(dateTo + 'T23:59:59')
          : true;

        return fromOk && toOk;
      }),
    [list, dateFrom, dateTo]
  );

  return (
    <div className="chemistry-page">
      <section className="hero">
        <header>
          <h1>
            <Link to={ROUTES.HOME}>
              <img src={`${STATIC_BASE}/image.svg`} alt="home" />
            </Link>
            <span className="page-title">История расчетов</span>
          </h1>
        </header>
      </section>

      <main className="orders-container">
        {loading ? (
          <div className="loading">Загрузка данных...</div>
        ) : filteredList.length === 0 ? (
          <div className="no-results">
            <div className="filters-row">
              <label>
                От:
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>
              <label>
                До:
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </label>
            </div>

            <p>За выбранный период нет сохраненных расчетов.</p>
            <Link to={ROUTES.MIXING} className="btn-primary">
              Создать новый раствор
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            {/* фильтр над таблицей */}
            <div className="filters-row">
              <label>
                От:
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>
              <label>
                До:
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </label>
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Дата расчета</th>
                  <th>Статус</th>
                  <th>Элементов</th>
                  <th>Объем (мл)</th>
                  <th>pH</th>
                  <th>Конц. (%)</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((order: any) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="order-row"
                  >
                    <td className="col-date">
                      <div className="date-primary">
                        {formatDate(order.date_create)}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="col-center">{order.items_count ?? 0}</td>
                    <td className="col-center">{order.total_volume ?? 0}</td>
                    <td className="col-center font-bold">
                      {(order.ph ?? 0).toFixed(2)}
                    </td>
                    <td className="col-center font-bold">
                      {(order.concentration ?? 0).toFixed(2)}%
                    </td>
                    <td>
                      <Link
                        to={`/orders/${order.id}`}
                        className="btn-small"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
