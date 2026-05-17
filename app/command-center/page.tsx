export const dynamic = 'force-dynamic'
  import { createClient } from '@/lib/supabase/server'
import { createArtifact, confiscateArtifact } from '@/app/actions/artifacts'
import Link from 'next/link'

export default async function CommandCenter() {
  const supabase = createClient()
  
  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*, vendors(moniker)')
    .order('created_at', { ascending: false })

  return (
    <main className="room-wrapper fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ borderBottom: '2px solid var(--anarchist-crimson)', paddingBottom: '1rem', marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-punk)', fontSize: '2.5rem', color: 'var(--anarchist-crimson)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          // COMMAND CENTER //
        </h1>
        <p style={{ color: 'var(--tarnished-gold)', fontFamily: 'var(--font-punk)', marginTop: '0.5rem' }}>
          RESTRICTED ACCESS. ESTABLISHMENT OVERRIDE TERMINAL.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        
        {/* ADD ARTIFACT FORM */}
        <section className="cracked-border" style={{ padding: '2rem', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <h2 style={{ fontFamily: 'var(--font-luxe)', color: 'var(--peeling-turquoise)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Inject New Artifact
          </h2>
          <form action={createArtifact} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-punk)' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--faded-ochre)', fontSize: '0.9rem' }}>Artifact Title</label>
              <input type="text" name="title" required style={{ background: 'transparent', border: '1px solid var(--tarnished-gold)', color: '#fff', padding: '0.75rem', fontFamily: 'var(--font-punk)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--faded-ochre)', fontSize: '0.9rem' }}>Subversive Description</label>
              <textarea name="description" required rows={4} style={{ background: 'transparent', border: '1px solid var(--tarnished-gold)', color: '#fff', padding: '0.75rem', fontFamily: 'var(--font-punk)', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--faded-ochre)', fontSize: '0.9rem' }}>Price ($)</label>
                <input type="number" name="price" step="0.01" required style={{ background: 'transparent', border: '1px solid var(--tarnished-gold)', color: '#fff', padding: '0.75rem', fontFamily: 'var(--font-punk)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--faded-ochre)', fontSize: '0.9rem' }}>Stock Count</label>
                <input type="number" name="stock_count" required defaultValue="1" style={{ background: 'transparent', border: '1px solid var(--tarnished-gold)', color: '#fff', padding: '0.75rem', fontFamily: 'var(--font-punk)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--faded-ochre)', fontSize: '0.9rem' }}>Embassy Courtyard</label>
              <select name="wing" required style={{ background: 'rgba(26,26,26,1)', border: '1px solid var(--tarnished-gold)', color: 'var(--tarnished-gold)', padding: '0.75rem', fontFamily: 'var(--font-punk)' }}>
                <option value="the-galleries">The Galleries</option>
                <option value="the-yardsmiths">Craftwork</option>
                <option value="sartorial-spite">Wardrobe</option>
                <option value="propaganda-parody">Satire & Camp</option>
                <option value="the-apothecary">The Apothecary</option>
              </select>
            </div>

            <button type="submit" className="subversive-btn" style={{ padding: '1rem', marginTop: '1rem', fontFamily: 'var(--font-punk)', letterSpacing: '0.1em', cursor: 'pointer' }}>
              [ DEPLOY ARTIFACT ]
            </button>
          </form>
        </section>

        {/* CURRENT INVENTORY */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-luxe)', color: 'var(--peeling-turquoise)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Active Inventory Log
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {artifacts?.map((artifact) => (
              <div key={artifact.id} style={{ 
                border: '1px solid var(--obsidian-matte)', 
                padding: '1.5rem', 
                backgroundColor: artifact.is_confiscated ? 'rgba(139,0,0,0.1)' : 'rgba(0,0,0,0.4)',
                borderLeft: artifact.is_confiscated ? '4px solid var(--anarchist-crimson)' : '4px solid var(--peeling-turquoise)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-punk)', margin: '0 0 0.5rem 0', color: artifact.is_confiscated ? '#777' : '#fff', textDecoration: artifact.is_confiscated ? 'line-through' : 'none' }}>
                    {artifact.title}
                  </h3>
                  <p style={{ color: 'var(--tarnished-gold)', fontFamily: 'monospace', fontSize: '0.9rem', margin: 0 }}>
                    {artifact.wing} | ${artifact.price} | Stock: {artifact.stock_count}
                  </p>
                </div>
                
                <form action={async () => {
                  'use server'
                  await confiscateArtifact(artifact.id, artifact.is_confiscated, artifact.wing)
                }}>
                  <button type="submit" style={{ 
                    backgroundColor: 'transparent', 
                    border: `1px solid ${artifact.is_confiscated ? 'var(--peeling-turquoise)' : 'var(--anarchist-crimson)'}`, 
                    color: artifact.is_confiscated ? 'var(--peeling-turquoise)' : 'var(--anarchist-crimson)',
                    padding: '0.5rem 1rem',
                    fontFamily: 'var(--font-punk)',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                  }}>
                    {artifact.is_confiscated ? 'Release' : 'Confiscate'}
                  </button>
                </form>
              </div>
            ))}
            {artifacts?.length === 0 && (
              <p style={{ color: 'var(--faded-ochre)', fontStyle: 'italic' }}>No artifacts exist in the database.</p>
            )}
          </div>
        </section>

      </div>

      <div style={{ marginTop: '4rem' }}>
        <Link href="/" style={{ color: 'var(--faded-ochre)', fontFamily: 'var(--font-punk)', textDecoration: 'underline' }}>
          &lt; Return to Embassy
        </Link>
      </div>
    </main>
  )
}
