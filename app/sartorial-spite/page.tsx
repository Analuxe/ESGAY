import Link from 'next/link';

export default function SartorialSpite() {
  return (
    <main style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--anarchist-crimson)', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Return to Embassy
      </Link>
      <h1 className="glitch-layer" data-text="Sartorial Spite" style={{ borderBottom: '1px solid var(--tarnished-gold)', paddingBottom: '1rem' }}>
        Sartorial Spite
      </h1>
      <p style={{ color: 'var(--peeling-turquoise)', marginTop: '2rem', fontStyle: 'italic', fontSize: '1.2rem' }}>
        "High-end fashion designed to intimidate."
      </p>
      <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--faded-ochre)', textAlign: 'center' }}>
        <p>Tailored venom. Wear it like armor.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--tarnished-gold)', marginTop: '2rem' }}>[ The seamstresses are striking... ]</p>
      </div>
    </main>
  );
}
