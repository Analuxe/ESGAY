import Link from 'next/link';
import ArtifactCard from '@/components/ArtifactCard';

export default function Home() {
  const wings = [
    { 
      href: '/the-galleries', 
      title: 'The Galleries', 
      category: '(Art)',
      sub: 'DEPT_01', 
      desc: 'Fine art and digital subversion exhibitions.',
      img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200'
    },
    { 
      href: '/the-yardsmiths', 
      title: 'Craftwork', 
      category: '(Crafts)',
      sub: 'DEPT_02', 
      desc: 'Heavy crafts: forged glass, jewelry, furniture.',
      img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'
    },
    { 
      href: '/sartorial-spite', 
      title: 'Wardrobe', 
      category: '(Fashion)',
      sub: 'DEPT_03', 
      desc: 'High-end tailoring designed to intimidate.',
      img: 'https://images.unsplash.com/photo-1539109132381-31a1ecdcd7aa?auto=format&fit=crop&q=80&w=800'
    },
    { 
      href: '/propaganda-parody', 
      title: 'Satire & Camp', 
      category: '(Propaganda)',
      sub: 'DEPT_04', 
      desc: 'Biting satire and cultural contraband.',
      img: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800'
    },
    { 
      href: '/the-apothecary', 
      title: 'The Apothecary', 
      category: '(Beauty)',
      sub: 'DEPT_05', 
      desc: 'Luxe beauty and radical skincare preservation.',
      img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
    },
  ];

  const featuredArtifacts = [
    {
      id: 'featured-1',
      title: 'Obsidian Fragment Necklace',
      description: 'Hand-carved volcanic glass suspended in tarnished gold. A relic of the old embassy.',
      price: 4200.00,
      stock_count: 1,
      image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
      vendors: { moniker: 'The Sartorialists' }
    },
    {
      id: 'featured-2',
      title: 'Debord\'s "Spectacle" Avant-Garde Tee',
      description: 'Medium-weight cotton armor emblazoned with Guy Debord\'s radical critique. Features a vintage monochrome crowd of onlookers in 3D glasses, designed to disrupt the gaze of the establishment.',
      price: 280.00,
      stock_count: 1,
      image_url: '/debord-spectacle.png',
      vendors: { moniker: 'Sartorial Spite' }
    },
    {
      id: 'featured-3',
      title: 'Apothecary Elixir',
      description: 'Essential face elixir for the radicalized. Curated skincare in a matte black vessel.',
      price: 120.00,
      stock_count: 5,
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
      vendors: { moniker: 'The Apothecary' }
    }
  ];

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero / Foyer Header */}
      <section style={{ 
        padding: '10rem 2rem 8rem', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <div style={{ fontFamily: 'var(--font-punk)', fontSize: '0.6rem', color: 'var(--tarnished-gold)', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
          DIPLOMATIC RECEPTION // EST. 2026
        </div>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 12vw, 8rem)', 
          fontFamily: 'var(--font-luxe)', 
          letterSpacing: '-0.03em',
          lineHeight: 0.8,
          color: '#fff',
          margin: 0
        }}>
          ES<span style={{ color: 'var(--tarnished-gold)' }}>GAY</span>
        </h1>
        <p style={{ 
          maxWidth: '600px', 
          margin: '2rem auto 0', 
          color: 'var(--peeling-turquoise)', 
          fontFamily: 'var(--font-punk)', 
          fontSize: '0.75rem',
          lineHeight: 1.6,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          The End-Stage Gay Agenda Yardsale. <br />
          A sovereign marketplace for the radicalized and the unapologetic.
        </p>
      </section>

      {/* Featured Artifacts Section */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-luxe)', fontSize: '3rem', color: '#fff', margin: 0 }}>
                Recent <span style={{ color: 'var(--tarnished-gold)' }}>Discoveries</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-punk)', fontSize: '0.6rem', color: 'var(--peeling-turquoise)', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                // Confidential Inventory Log Update
              </p>
            </div>
            <Link href="/the-galleries" style={{ fontFamily: 'var(--font-punk)', fontSize: '0.7rem', color: 'var(--faded-ochre)', textDecoration: 'underline' }}>
              View All Artifacts
            </Link>
          </header>

          <div className="gallery-grid">
            {featuredArtifacts.map((artifact, index) => (
              <ArtifactCard key={artifact.id} artifact={artifact as any} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Courtyard Directory */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-luxe)', fontSize: '3.5rem', color: '#fff', margin: 0 }}>
            Embassy <span style={{ color: 'var(--tarnished-gold)' }}>Courtyards</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-punk)', fontSize: '0.7rem', color: 'var(--peeling-turquoise)', textTransform: 'uppercase', marginTop: '1rem' }}>
            Explore the sovereign sectors of the estate
          </p>
        </header>

        <div className="foyer-grid">
          {wings.map((wing) => (
            <div key={wing.href} className="directory-link-wrapper">
              <Link href={wing.href} className="directory-link">
                <div className="directory-front">
                  <div className="directory-tag">{wing.sub}</div>
                  <h3 className="directory-title">{wing.title}</h3>
                  <p className="directory-desc">{wing.desc}</p>
                </div>
                <div className="directory-back" style={{ backgroundImage: `url(${wing.img})` }}>
                  <div className="directory-back-content">
                    <div className="directory-category">{wing.category}</div>
                    <div className="access-reveal">[ ENTER_COURTYARD ]</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer style={{ 
        marginTop: 'auto', 
        padding: '6rem 2rem', 
        textAlign: 'center', 
        borderTop: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <p style={{ fontFamily: 'var(--font-punk)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Confidential Artifact Registry // Secure Handover Required
        </p>
      </footer>
    </main>
  );
}
