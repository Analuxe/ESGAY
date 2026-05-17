'use client';

import { useManifest } from '@/lib/store/ManifestContext';
import { useState } from 'react';

interface Artifact {
  id: string;
  title: string;
  description: string;
  price: number;
  stock_count: number;
  image_url?: string;
  vendors?: {
    moniker: string;
  } | null;
}

export default function ArtifactCard({ artifact, index }: { artifact: Artifact, index: number }) {
  const { addItem } = useManifest();
  const [added, setAdded] = useState(false);

  const artifactNumber = `ARTIFACT ${String(index + 1).padStart(3, '0')}`;

  const handleAcquire = () => {
    if (artifact.stock_count > 0 && !added) {
      addItem({
        id: artifact.id,
        title: artifact.title,
        price: artifact.price,
        vendor: artifact.vendors?.moniker || 'Unknown Entity'
      });
      setAdded(true);
    }
  };

  return (
    <article className="artifact-card">
      <div className="artifact-number">{artifactNumber}</div>
      
      <div className="artifact-image-container">
        {artifact.image_url ? (
          <img 
            src={artifact.image_url} 
            alt={artifact.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s' }}
            className="hover-scale"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-luxe)', color: 'rgba(181, 155, 84, 0.1)', fontSize: '2.5rem' }}>ESGAY</span>
          </div>
        )}
      </div>

      <div className="artifact-content">
        <header>
          <p className="artifact-origin">Source: {artifact.vendors?.moniker || 'Anonymous Entity'}</p>
          <h3 className="artifact-title">{artifact.title}</h3>
        </header>
        
        <p className="artifact-description">{artifact.description}</p>

        <footer className="artifact-footer">
          <span className="artifact-price">${artifact.price.toFixed(2)}</span>
          <button 
            onClick={handleAcquire}
            disabled={artifact.stock_count === 0 || added}
            className={`artifact-btn ${added ? 'acquired' : ''}`}
          >
            {added ? '[ ACQUIRED ]' : artifact.stock_count > 0 ? 'Acquire' : 'Confiscated'}
          </button>
        </footer>
      </div>
    </article>
  );
}
