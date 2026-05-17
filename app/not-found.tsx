import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="room-wrapper fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <h1 className="glitch-layer" data-text="404: Sector Collapsed" style={{ fontSize: '4rem', marginBottom: '1rem', borderBottom: 'none' }}>
        404: Sector Collapsed
      </h1>
      <p style={{ color: 'var(--anarchist-crimson)', fontSize: '1.2rem', marginBottom: '3rem', fontFamily: 'var(--font-punk)' }}>
        [ ERROR: The old maps are useless here. ]
      </p>
      
      <div className="cracked-border" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', position: 'relative', backgroundColor: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(4px)' }}>
        <p style={{ color: 'var(--peeling-turquoise)', fontStyle: 'italic', marginBottom: '2rem', fontSize: '1.1rem', letterSpacing: '0.02em', lineHeight: '1.6' }}>
          "The infrastructure here has decayed beyond recognition. <br/><span style={{ background: 'var(--obsidian-matte)', padding: '0 5px' }}>There is nothing left to salvage.</span>"
        </p>
        <Link href="/" className="subversive-btn" style={{ 
          display: 'inline-block', 
          padding: '1rem 2.5rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em',
          fontFamily: 'var(--font-punk)'
        }}>
          Return to the Embassy
        </Link>
      </div>
    </main>
  );
}
