// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom';

import App from './App.tsx';
import './index.css';
// 1. Импортируем новую страницу
import StartPage from './pages/StartPage.tsx'; 

// Корневой компонент-обертка
function Root() {
  return (
    <>
      {/* Навигация */}
      <ul>
        <li>
          <Link to="/">Главная (App)</Link>
        </li>
        <li>
          <Link to="/new">Страница "New"</Link>
        </li>
        {/* 2. Добавляем ссылку на новую страницу */}
        <li>
          <Link to="/start">Start Page</Link>
        </li>
      </ul>
      <hr />
      {/* Место для отображения дочерних страниц */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

// Настраиваем роутер
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'new',
        element: <h1>Это наша страница с чем-то новеньким</h1>,
      },
      // 3. Добавляем новый маршрут для StartPage
      {
        path: 'start',
        element: <StartPage />,
      },
    ],
  },
]);

// Рендерим приложение
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
