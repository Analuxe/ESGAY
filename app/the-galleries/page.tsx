import Link from 'next/link';

export default function TheGalleries() {
  return (
    <main style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--anarchist-crimson)', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Return to Embassy
      </Link>
      <h1 className="glitch-layer" data-text="The Galleries" style={{ borderBottom: '1px solid var(--tarnished-gold)', paddingBottom: '1rem' }}>
        The Galleries
      </h1>
      <p style={{ color: 'var(--peeling-turquoise)', marginTop: '2rem', fontStyle: 'italic', fontSize: '1.2rem' }}>
        "Exhibitions of the Radicalized"
      </p>
      <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--faded-ochre)', textAlign: 'center' }}>
        <p>Curated fine art and digital subversion.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--tarnished-gold)', marginTop: '2rem' }}>[ Inventory corrupted. Decoding in progress... ]</p>
      </div>
    </main>
  );
}
