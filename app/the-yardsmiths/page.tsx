import Link from 'next/link';

export default function TheYardsmiths() {
  return (
    <main style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--anarchist-crimson)', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Return to Embassy
      </Link>
      <h1 className="glitch-layer" data-text="The Yardsmiths" style={{ borderBottom: '1px solid var(--tarnished-gold)', paddingBottom: '1rem' }}>
        The Yardsmiths
      </h1>
      <p style={{ color: 'var(--peeling-turquoise)', marginTop: '2rem', fontStyle: 'italic', fontSize: '1.2rem' }}>
        "Heavy, tangible craftsmanship pulled from the wreckage."
      </p>
      <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--faded-ochre)', textAlign: 'center' }}>
        <p>Forged glass, jewelry, and brutalist furniture.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--tarnished-gold)', marginTop: '2rem' }}>[ Awaiting shipments from the undercity... ]</p>
      </div>
    </main>
  );
}
