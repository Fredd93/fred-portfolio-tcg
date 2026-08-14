import { useState } from 'react';
import GalleryView from './views/GalleryView.jsx';
import PackOpeningView from './views/PackOpeningView.jsx';

export default function App() {
  const [view, setView] = useState('pack'); // 'pack' | 'gallery'

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">Fred<span className="dot">TCG</span></div>
          <div className="tabs">
            <button className={`tab-btn ${view === 'pack' ? 'active' : ''}`} onClick={() => setView('pack')}>
              Open Pack
            </button>
            <button className={`tab-btn ${view === 'gallery' ? 'active' : ''}`} onClick={() => setView('gallery')}>
              Full Collection
            </button>
          </div>
        </div>
      </div>

      {view === 'pack' ? (
        <PackOpeningView onGoGallery={() => setView('gallery')} />
      ) : (
        <GalleryView />
      )}
    </>
  );
}
