'use client';

import { useManifest } from '@/lib/store/ManifestContext';
import Link from 'next/link';

export default function CustomsForm() {
  const { items, total, removeItem } = useManifest();

  return (
    <main className="room-wrapper fade-in" style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '4rem 2rem',
      color: 'var(--obsidian-matte)' // overriding the global white text for this specific form
    }}>
      <div style={{
        backgroundColor: '#e6dfd1', // Weathered paper color
        padding: '3rem',
        border: '2px solid #8b0000',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 50px rgba(139,0,0,0.1)',
        position: 'relative'
      }}>
        {/* Background "Stamps" */}
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', border: '4px solid #8b0000', padding: '0.5rem 1rem', transform: 'rotate(-15deg)', opacity: 0.7 }}>
          <h2 style={{ color: '#8b0000', fontFamily: 'var(--font-punk)', margin: 0, fontSize: '1.5rem', letterSpacing: '0.2em' }}>SEIZED</h2>
        </div>

        <header style={{ borderBottom: '2px dashed #333', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-punk)', fontSize: '2rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            MANIFEST OF ACQUISITION
          </h1>
          <p style={{ fontFamily: 'var(--font-punk)', fontSize: '0.9rem', color: '#555', marginTop: '0.5rem' }}>
            FORM ESG-894 // BORDER CONTROL // DECLARATION OF CONTRABAND
          </p>
        </header>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontFamily: 'var(--font-punk)', fontSize: '1.2rem', color: '#8b0000' }}>
              [ ERR: NO CONTRABAND DECLARED. MANIFEST EMPTY. ]
            </p>
            <Link href="/" style={{ display: 'inline-block', marginTop: '2rem', color: '#1a1a1a', textDecoration: 'underline', fontFamily: 'var(--font-punk)' }}>
              Return to Embassy
            </Link>
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-punk)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', borderBottom: '2px solid #1a1a1a', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              <span>ITEM_DESCRIPTION</span>
              <span>ORIGIN</span>
              <span style={{ textAlign: 'right' }}>DECLARED_VALUE</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
              {items.map((item, index) => (
                <li key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', padding: '1rem 0', borderBottom: '1px dashed #999', position: 'relative' }}>
                  <span style={{ fontWeight: 'bold' }}>{String(index + 1).padStart(2, '0')}. {item.title}</span>
                  <span style={{ color: '#555' }}>[{item.vendor}]</span>
                  <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ position: 'absolute', right: '-2rem', top: '1rem', color: '#8b0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    title="Remove item"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #1a1a1a', paddingTop: '1rem', marginBottom: '3rem' }}>
              <div style={{ width: '50%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>TARIFFS:</span>
                  <span>[PENDING]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', borderTop: '1px solid #1a1a1a', paddingTop: '0.5rem' }}>
                  <span>TOTAL VALUE:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(139,0,0,0.1)', padding: '1.5rem', borderLeft: '4px solid #8b0000', marginBottom: '2rem' }}>
              <p style={{ color: '#8b0000', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                WARNING: By signing this manifest, you acknowledge that all items are acquired "as-is" from the ruins. 
                The establishment takes no responsibility for curses, hexes, or ideological corruption.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ flexGrow: 1, marginRight: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.5rem' }}>AUTHORIZATION SIGNATURE</p>
                <div style={{ borderBottom: '2px dotted #1a1a1a', height: '2rem' }}></div>
              </div>
              <button style={{ 
                backgroundColor: '#1a1a1a', 
                color: '#e6dfd1', 
                padding: '1rem 2rem', 
                border: 'none',
                fontFamily: 'var(--font-punk)',
                fontSize: '1rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}>
                Submit Manifest
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/" style={{ color: 'var(--faded-ochre)', fontFamily: 'var(--font-punk)', textDecoration: 'underline' }}>
          &lt; Return to Embassy
        </Link>
      </div>
    </main>
  );
}
