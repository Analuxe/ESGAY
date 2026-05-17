import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ArtifactCard from '@/components/ArtifactCard';

export default async function SatireAndCamp() {
  const supabase = createClient();
  
  const { data: artifacts, error } = await supabase
    .from('artifacts')
    .select(`
      *,
      vendors (
        moniker
      )
    `)
    .eq('wing', 'propaganda-parody')
    .order('created_at', { ascending: false });

  return (
    <main className="room-wrapper fade-in">
      <header style={{ marginBottom: '6rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-2rem', left: '0', fontFamily: 'var(--font-punk)', fontSize: '0.6rem', color: 'var(--tarnished-gold)', opacity: 0.5 }}>
          DEPT: SATIRE_04
        </div>
        <h1 style={{ fontSize: '4rem', letterSpacing: '-0.02em', color: '#fff' }}>
          Satire & Camp
        </h1>
        <p style={{ 
          color: 'var(--peeling-turquoise)', 
          fontFamily: 'var(--font-punk)', 
          fontSize: '0.75rem',
          marginTop: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          [ Biting satire and cultural contraband ]
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
            [ WARNING: Connection to the printing press severed. ]
          </p>
        )}
        
        {artifacts?.length === 0 && !error && (
          <p style={{ color: 'var(--tarnished-gold)', fontStyle: 'italic', gridColumn: '1/-1' }}>
            The presses are silent. Wait for the next drop.
          </p>
        )}

        {artifacts?.map((artifact, index) => (
          <ArtifactCard key={artifact.id} artifact={artifact as any} index={index} />
        ))}
      </div>
    </main>
  );
}
