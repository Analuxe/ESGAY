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
      <header className="wing-header">
        <div className="wing-dept">
          DEPT: GALLERIES_09
        </div>
        <h1 className="wing-h1">
          The <span className="text-gold">Galleries</span>
        </h1>
        <p className="wing-desc">
          [ Fine art and digital subversion exhibitions ]
        </p>
      </header>

      <nav className="wing-nav">
        <Link href="/" className="wing-back-link">
          <span className="wing-back-icon">←</span> Return to Embassy Base
        </Link>
      </nav>

      <div className="gallery-grid">
        {error && (
          <p className="wing-error">
            [ WARNING: Connection to the live archives severed. Displaying cached relics. ]
          </p>
        )}
        
        {displayArtifacts.map((artifact, index) => (
          <ArtifactCard key={artifact.id} artifact={artifact as any} index={index} />
        ))}
      </div>

      <footer className="wing-footer">
        <p className="wing-footer-text">
          End-Stage Gay Agenda Yardsale // © 2026 // All Rights Reserved
        </p>
      </footer>
    </main>
  );
}
