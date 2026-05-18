export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createArtifact, confiscateArtifact, addAdmin, removeAdmin, getAdmins, checkIsAdmin } from '@/app/actions/artifacts'
import Link from 'next/link'
import styles from './command-center.module.css'

export default async function CommandCenter() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user ? await checkIsAdmin(user.email) : false

  if (!isAdmin) {
    return (
      <main className="room-wrapper fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className={styles.deniedContainer}>
          <div className="dropdown-scanlines"></div>
          <span className={styles.deniedAlertIcon}>⚠️ [ SECURITY ALERT ]</span>
          <h1 className={styles.deniedTitle}>RESTRICTED TERMINAL ACCESS</h1>
          <div className={styles.deniedText}>
            {"// FILE SYSTEM EXCEPTION: ACCESS_DENIED\n"}
            {"// SOURCE: EMBASSY_FIREWALL_v2.6\n"}
            {"// IDENTITY: "}{user ? `PROVISIONAL_DOSSIER_ID [${user.email}]` : "ANONYMOUS_RESTRICTED_LINK"}{"\n"}
            {"// STATUS: SECURITY VULNERABILITY PREVENTED.\n\n"}
            {"Your current dossier credentials do not possess the required diplomatic draft clearance to override this embassy terminal. Administrative permissions are restricted to authorized high-ranking agents."}
          </div>
          <Link href="/" className={styles.deniedBtn}>
            &lt; Request Extraction / Return to Sectors &gt;
          </Link>
        </div>
      </main>
    )
  }

  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*, vendors(moniker)')
    .order('created_at', { ascending: false })

  const admins = await getAdmins()

  return (
    <main className={`room-wrapper fade-in ${styles.mainContainer}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {"// COMMAND CENTER //"}
        </h1>
        <p className={styles.subtitle}>
          RESTRICTED ACCESS. ESTABLISHMENT OVERRIDE TERMINAL.
        </p>
      </header>

      <div className={styles.gridContainer}>
        
        {/* LEFT COLUMN: FORMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* ADD ARTIFACT FORM */}
          <section className={`cracked-border ${styles.formSection}`}>
            <h2 className={styles.sectionTitle}>
              Inject New Artifact
            </h2>
            <form action={createArtifact} className={styles.form}>
              
              <div className={styles.fieldGroup}>
                <label htmlFor="artifact-title" className={styles.label}>Artifact Title</label>
                <input id="artifact-title" type="text" name="title" placeholder="Enter title" title="Artifact Title" required className={styles.input} />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="artifact-description" className={styles.label}>Subversive Description</label>
                <textarea id="artifact-description" name="description" placeholder="Enter description" title="Subversive Description" required rows={4} className={styles.textarea} />
              </div>

              <div className={styles.twoColGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="artifact-price" className={styles.label}>Price ($)</label>
                  <input id="artifact-price" type="number" name="price" step="0.01" placeholder="0.00" title="Price ($)" required className={styles.input} />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="artifact-stock" className={styles.label}>Stock Count</label>
                  <input id="artifact-stock" type="number" name="stock_count" placeholder="1" title="Stock Count" required defaultValue="1" className={styles.input} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="artifact-wing" className={styles.label}>Embassy Courtyard</label>
                <select id="artifact-wing" name="wing" title="Embassy Courtyard" required className={styles.select}>
                  <option value="the-galleries">The Galleries</option>
                  <option value="the-yardsmiths">Craftwork</option>
                  <option value="sartorial-spite">Wardrobe</option>
                  <option value="propaganda-parody">Satire & Camp</option>
                  <option value="the-apothecary">The Apothecary</option>
                </select>
              </div>

              <button type="submit" className={`subversive-btn ${styles.submitBtn}`}>
                [ DEPLOY ARTIFACT ]
              </button>
            </form>
          </section>

          {/* DOSSIER CLEARANCES (DYNAMIC ADMINS) */}
          <section className={`cracked-border ${styles.formSection}`}>
            <h2 className={styles.sectionTitle}>
              Dossier Clearances
            </h2>
            <form action={addAdmin} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label htmlFor="admin-email" className={styles.label}>Authorize New Admin Email</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    id="admin-email" 
                    type="email" 
                    name="email" 
                    placeholder="agent@icloud.com" 
                    title="Admin Email" 
                    required 
                    className={styles.input} 
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="subversive-btn" style={{ padding: '0 1rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                    [ GRANT ]
                  </button>
                </div>
              </div>
            </form>

            <div style={{ marginTop: '2rem' }}>
              <h3 className={styles.label} style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '0.5rem' }}>
                Active Credentials
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Primary Admin (always displayed) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(212, 175, 55, 0.05)', borderLeft: '3px solid var(--tarnished-gold)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--tarnished-gold)', fontFamily: 'monospace' }}>khersak@icloud.com</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--faded-ochre)', fontFamily: 'monospace' }}>[ PRIMARY ]</span>
                </div>
                {/* Dynamically added admins */}
                {admins.map((adm: any) => (
                  <div key={adm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', borderLeft: '3px solid var(--peeling-turquoise)' }}>
                    <span style={{ fontSize: '0.9rem', color: '#fff', fontFamily: 'monospace' }}>{adm.email}</span>
                    <form action={async () => {
                      'use server'
                      await removeAdmin(adm.id)
                    }}>
                      <button 
                        type="submit" 
                        className="subversive-btn" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--anarchist-crimson)', color: 'var(--anarchist-crimson)', cursor: 'pointer' }}
                      >
                        [ REVOKE ]
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: CURRENT INVENTORY */}
        <section>
          <h2 className={styles.sectionTitle}>
            Active Inventory Log
          </h2>
          <div className={styles.inventoryList}>
            {artifacts?.map((artifact) => (
              <div key={artifact.id} className={`${styles.inventoryItem} ${artifact.is_confiscated ? styles.inventoryItemConfiscated : styles.inventoryItemActive}`}>
                <div>
                  <h3 className={`${styles.itemTitle} ${artifact.is_confiscated ? styles.itemTitleConfiscated : styles.itemTitleActive}`}>
                    {artifact.title}
                  </h3>
                  <p className={styles.itemMeta}>
                    {artifact.wing} | ${artifact.price} | Stock: {artifact.stock_count}
                  </p>
                </div>
                
                <form action={async () => {
                  'use server'
                  await confiscateArtifact(artifact.id, artifact.is_confiscated, artifact.wing)
                }}>
                  <button type="submit" className={`${styles.actionBtn} ${artifact.is_confiscated ? styles.actionBtnRelease : styles.actionBtnConfiscate}`}>
                    {artifact.is_confiscated ? 'Release' : 'Confiscate'}
                  </button>
                </form>
              </div>
            ))}
            {artifacts?.length === 0 && (
              <p className={styles.emptyMsg}>No artifacts exist in the database.</p>
            )}
          </div>
        </section>

      </div>

      <div className={styles.footerNav}>
        <Link href="/" className={styles.returnLink}>
          &lt; Return to Embassy
        </Link>
      </div>
    </main>
  )
}
