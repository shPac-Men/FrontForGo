import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { AlbumPage } from "./pages/AlbumPage/AlbumPage";
import { AlbumsPage } from "./pages/AlbumsPage/AlbumsPage";
import ITunesPage from "./pages/ITunesPage/ITunesPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { ROUTES } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      {/* Навигация */}
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none' }}>
          Главная
        </Link>
        <Link to="/itunes" style={{ marginRight: '1rem', textDecoration: 'none' }}>
          iTunes Search
        </Link>
        <Link to={ROUTES.ALBUMS} style={{ textDecoration: 'none' }}>
          Albums
        </Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Главная - HomePage */}
        <Route path="/itunes" element={<ITunesPage />} /> {/* iTunes Search */}
        <Route path={ROUTES.ALBUMS} element={<AlbumsPage />} />
        <Route path={`${ROUTES.ALBUMS}/:id`} element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;