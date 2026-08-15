// src/App.jsx
import { useHashRoute } from './hooks/useHashRoute.js';
import GalleryView from './views/GalleryView.jsx';
import PackOpeningView from './views/PackOpeningView.jsx';

export default function App() {
  const { route, navigate } = useHashRoute();

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">Fred<span className="dot">TCG</span></div>
          <div className="tabs">
            <button
              className={`tab-btn ${route.view === 'pack' ? 'active' : ''}`}
              onClick={() => navigate('#/pack')}
            >
              Open Pack
            </button>
            <button
              className={`tab-btn ${route.view === 'gallery' ? 'active' : ''}`}
              onClick={() => navigate('#/gallery')}
            >
              Full Collection
            </button>
          </div>
        </div>
      </div>

      {route.view === 'pack' ? (
        <PackOpeningView pull={route.pull} navigate={navigate} />
      ) : (
        <GalleryView activeCardId={route.card} navigate={navigate} />
      )}
    </>
  );
}
