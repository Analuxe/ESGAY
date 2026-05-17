import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ArtifactCard from '@/components/ArtifactCard';

export default async function Craftwork() {
  const supabase = createClient();
  
  const { data: artifacts, error } = await supabase
    .from('artifacts')
    .select(`
      *,
      vendors (
        moniker
      )
    `)
    .eq('wing', 'the-yardsmiths')
    .order('created_at', { ascending: false });

  return (
    <main className="room-wrapper fade-in">
      <header style={{ marginBottom: '6rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-2rem', left: '0', fontFamily: 'var(--font-punk)', fontSize: '0.6rem', color: 'var(--tarnished-gold)', opacity: 0.5 }}>
          DEPT: CRAFTWORK_02
        </div>
        <h1 style={{ fontSize: '4rem', letterSpacing: '-0.02em', color: '#fff' }}>
          Craftwork
        </h1>
        <p style={{ 
          color: 'var(--peeling-turquoise)', 
          fontFamily: 'var(--font-punk)', 
          fontSize: '0.75rem',
          marginTop: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          [ Heavy crafts: forged glass, jewelry, and defiant structure ]
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
            [ WARNING: The furnace has gone cold. Connection lost. ]
          </p>
        )}
        
        {artifacts?.length === 0 && !error && (
          <p style={{ color: 'var(--tarnished-gold)', fontStyle: 'italic', gridColumn: '1/-1' }}>
            The anvils are silent. Check back when the fires are lit.
          </p>
        )}

        {artifacts?.map((artifact, index) => (
          <ArtifactCard key={artifact.id} artifact={artifact as any} index={index} />
        ))}
      </div>
    </main>
  );
}
