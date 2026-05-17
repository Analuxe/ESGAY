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
    <main className="embassy-container">
      {/* Hero / Foyer Header */}
      <section className="hero-section">
        <div className="hero-subtitle">
          DIPLOMATIC RECEPTION // EST. 2026
        </div>
        <h1 className="hero-title">
          ES<span className="text-gold">GAY</span>
        </h1>
        <p className="hero-desc">
          The End-Stage Gay Agenda Yardsale. <br />
          A sovereign marketplace for the radicalized and the unapologetic.
        </p>
      </section>

      {/* Featured Artifacts Section */}
      <section className="featured-section">
        <div className="container-luxe">
          <header className="section-header-flex">
            <div>
              <h2 className="section-title">
                Recent <span className="text-gold">Discoveries</span>
              </h2>
              <p className="section-subtitle">
                {"// Confidential Inventory Log Update"}
              </p>
            </div>
            <Link href="/the-galleries" className="section-link">
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
      <section className="directory-section">
        <header className="section-header-center">
          <h2 className="directory-section-title">
            Embassy <span className="text-gold">Courtyards</span>
          </h2>
          <p className="directory-subtitle">
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
                <div className="directory-back">
                  <img src={wing.img} alt={wing.title} className="directory-back-image" />
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
      <footer className="embassy-footer">
        <p className="footer-text">
          Confidential Artifact Registry // Secure Handover Required
        </p>
      </footer>
    </main>
  );
}
