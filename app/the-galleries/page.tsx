import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ArtifactCard from '@/components/ArtifactCard';

export default async function TheGalleries() {
  const supabase = createClient();
  
  const { data: artifacts, error } = await supabase
    .from('artifacts')
    .select(`
      *,
      vendors (
        moniker
      )
    `)
    .eq('wing', 'the-galleries')
    .order('created_at', { ascending: false });

  // Mock data for visual demonstration if DB is empty
  const displayArtifacts = artifacts && artifacts.length > 0 ? artifacts : [
    {
      id: 'mock-1',
      title: 'Moving Image No. 4',
      description: 'A structural film study exploring the semiotics of diplomatic immunity.',
      price: 1800.00,
      stock_count: 3,
      image_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
      vendors: { moniker: 'The Archivist' }
    },
    {
      id: 'mock-2',
      title: 'Debord\'s "Spectacle" Avant-Garde Tee',
      description: 'Medium-weight cotton armor emblazoned with Guy Debord\'s radical critique. Features a vintage monochrome crowd of onlookers in 3D glasses, designed to disrupt the gaze of the establishment.',
      price: 280.00,
      stock_count: 1,
      image_url: '/debord-spectacle.png',
      vendors: { moniker: 'Sartorial Spite' }
    },
    {
      id: 'mock-3',
      title: 'Apothecary Elixir',
      description: 'Essential face elixir for the radicalized. Curated skincare in a matte black vessel.',
      price: 120.00,
      stock_count: 5,
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
      vendors: { moniker: 'The Apothecary' }
    }
  ];

  return (
    <main className="room-wrapper fade-in">
      <header style={{ marginBottom: '6rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-2rem', left: '0', fontFamily: 'var(--font-punk)', fontSize: '0.6rem', color: 'var(--tarnished-gold)', opacity: 0.5 }}>
          DEPT: GALLERIES_09
        </div>
        <h1 style={{ fontSize: '4rem', letterSpacing: '-0.02em', color: '#fff' }}>
          The <span style={{ color: 'var(--tarnished-gold)' }}>Galleries</span>
        </h1>
        <p style={{ 
          color: 'var(--peeling-turquoise)', 
          fontFamily: 'var(--font-punk)', 
          fontSize: '0.75rem',
          marginTop: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          [ Fine art and digital subversion exhibitions ]
        </p>
      </header>

      <nav style={{ marginBottom: '4rem' }}>
        <Link href="/" style={{ 
          fontFamily: 'var(--font-punk)', 
          fontSize: '0.65rem', 
          color: 'var(--faded-ochre)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1rem' }}>←</span> Return to Embassy Base
        </Link>
      </nav>

      <div className="gallery-grid">
        {error && (
          <p style={{ color: 'var(--anarchist-crimson)', gridColumn: '1/-1', fontFamily: 'var(--font-punk)', fontSize: '0.8rem' }}>
            [ WARNING: Connection to the live archives severed. Displaying cached relics. ]
          </p>
        )}
        
        {displayArtifacts.map((artifact, index) => (
          <ArtifactCard key={artifact.id} artifact={artifact as any} index={index} />
        ))}
      </div>

      <footer style={{ marginTop: '8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-punk)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
          End-Stage Gay Agenda Yardsale // © 2026 // All Rights Reserved
        </p>
      </footer>
    </main>
  );
}
