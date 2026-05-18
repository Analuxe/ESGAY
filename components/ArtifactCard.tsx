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
  image_urls?: string[];
  vendors?: {
    moniker: string;
  } | null;
}

export default function ArtifactCard({ artifact, index }: { artifact: Artifact, index: number }) {
  const { addItem } = useManifest();
  const [added, setAdded] = useState(false);

  const artifactNumber = `ARTIFACT ${String(index + 1).padStart(3, '0')}`;
  const imageUrl = artifact.image_url || (artifact.image_urls && artifact.image_urls.length > 0 ? artifact.image_urls[0] : undefined);

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
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={artifact.title}
            className="artifact-img hover-scale"
          />
        ) : (
          <div className="artifact-placeholder">
            <span className="artifact-placeholder-text">ESGAY</span>
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
