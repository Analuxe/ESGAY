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
      <header className="wing-header">
        <div className="wing-dept">
          DEPT: SATIRE_04
        </div>
        <h1 className="wing-h1">
          Satire & Camp
        </h1>
        <p className="wing-desc">
          [ Biting satire and cultural contraband ]
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
            [ WARNING: Connection to the printing press severed. ]
          </p>
        )}
        
        {artifacts?.length === 0 && !error && (
          <p className="wing-empty">
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
