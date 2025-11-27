import type { FC } from "react";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";

export const AlbumsPage: FC = () => {
  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ALBUMS },
        ]}
      />
      <div className="container">
        <h1>Страница альбомов</h1>
        <p>Здесь будет список альбомов</p>
        {/* Пример ссылки на конкретный альбом */}
        <Link to={`${ROUTES.ALBUMS}/123`}>Перейти к альбому 123</Link>
      </div>
    </div>
  );
};