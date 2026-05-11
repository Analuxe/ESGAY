import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', border: '1px solid var(--tarnished-gold)' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 className="glitch-layer" data-text="ESGAY: The Abandoned Embassy" style={{ fontSize: '3rem', margin: 0 }}>
          ESGAY: The Abandoned Embassy
        </h1>
        <p style={{ color: 'var(--peeling-turquoise)', marginTop: '1rem', fontStyle: 'italic' }}>
          An "Edgy Luxe" sanctuary for the radicalized, the subversive, and the unapologetic.
        </p>
      </header>

      <nav>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <li>
            <Link href="/the-galleries">
              <h2 style={{ margin: 0, borderBottom: '1px solid var(--anarchist-crimson)', paddingBottom: '0.5rem' }}>/the-galleries</h2>
            </Link>
            <p style={{ color: 'var(--faded-ochre)', marginTop: '0.5rem' }}>Fine art and digital subversion exhibitions.</p>
          </li>
          <li>
            <Link href="/the-yardsmiths">
              <h2 style={{ margin: 0, borderBottom: '1px solid var(--anarchist-crimson)', paddingBottom: '0.5rem' }}>/the-yardsmiths</h2>
            </Link>
            <p style={{ color: 'var(--faded-ochre)', marginTop: '0.5rem' }}>Heavy, tangible crafts: forged glass, jewelry, furniture.</p>
          </li>
          <li>
            <Link href="/sartorial-spite">
              <h2 style={{ margin: 0, borderBottom: '1px solid var(--anarchist-crimson)', paddingBottom: '0.5rem' }}>/sartorial-spite</h2>
            </Link>
            <p style={{ color: 'var(--faded-ochre)', marginTop: '0.5rem' }}>High-end, tailored fashion designed to intimidate.</p>
          </li>
          <li>
            <Link href="/propaganda-parody">
              <h2 style={{ margin: 0, borderBottom: '1px solid var(--anarchist-crimson)', paddingBottom: '0.5rem' }}>/propaganda-parody</h2>
            </Link>
            <p style={{ color: 'var(--faded-ochre)', marginTop: '0.5rem' }}>Biting satire, dark camp, and cultural contraband.</p>
          </li>
          <li>
            <Link href="/war-paint-preservation">
              <h2 style={{ margin: 0, borderBottom: '1px solid var(--anarchist-crimson)', paddingBottom: '0.5rem' }}>/war-paint-preservation</h2>
            </Link>
            <p style={{ color: 'var(--faded-ochre)', marginTop: '0.5rem' }}>Luxe beauty, bold pigments, and radical skincare.</p>
          </li>
        </ul>
      </nav>
    </main>
  );
}
