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
      <header className="wing-header">
        <div className="wing-dept">
          DEPT: CRAFTWORK_02
        </div>
        <h1 className="wing-h1">
          Craftwork
        </h1>
        <p className="wing-desc">
          [ Heavy crafts: forged glass, jewelry, and defiant structure ]
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
            [ WARNING: The furnace has gone cold. Connection lost. ]
          </p>
        )}
        
        {artifacts?.length === 0 && !error && (
          <p className="wing-empty">
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
