import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ArtifactCard from '@/components/ArtifactCard';

export default async function Wardrobe() {
  const supabase = createClient();
  
  const { data: artifacts, error } = await supabase
    .from('artifacts')
    .select(`
      *,
      vendors (
        moniker
      )
    `)
    .eq('wing', 'sartorial-spite')
    .order('created_at', { ascending: false });

  return (
    <main className="room-wrapper fade-in">
      <header className="wing-header">
        <div className="wing-dept">
          DEPT: WARDROBE_03
        </div>
        <h1 className="wing-h1">
          Wardrobe
        </h1>
        <p className="wing-desc">
          [ High-end tailoring designed to intimidate ]
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
            [ WARNING: Connection to the archives severed. ]
          </p>
        )}
        
        {artifacts?.length === 0 && !error && (
          <p className="wing-empty">
            The racks are bare. New armor is currently being tailored.
          </p>
        )}

        {artifacts?.map((artifact, index) => (
          <ArtifactCard key={artifact.id} artifact={artifact as any} index={index} />
        ))}
      </div>
    </main>
  );
}
