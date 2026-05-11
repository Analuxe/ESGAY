import Link from 'next/link';

export default function PropagandaParody() {
  return (
    <main style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--anarchist-crimson)', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Return to Embassy
      </Link>
      <h1 className="glitch-layer" data-text="Propaganda & Parody" style={{ borderBottom: '1px solid var(--tarnished-gold)', paddingBottom: '1rem' }}>
        Propaganda & Parody
      </h1>
      <p style={{ color: 'var(--peeling-turquoise)', marginTop: '2rem', fontStyle: 'italic', fontSize: '1.2rem' }}>
        "Biting satire, dark camp, and cultural contraband."
      </p>
      <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--faded-ochre)', textAlign: 'center' }}>
        <p>The establishment is a joke. We are the punchline.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--tarnished-gold)', marginTop: '2rem' }}>[ Printing presses jammed. Await transmission. ]</p>
      </div>
    </main>
  );
}
