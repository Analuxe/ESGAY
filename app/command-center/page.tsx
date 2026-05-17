export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createArtifact, confiscateArtifact } from '@/app/actions/artifacts'
import Link from 'next/link'
import styles from './command-center.module.css'

export default async function CommandCenter() {
  const supabase = createClient()
  
  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*, vendors(moniker)')
    .order('created_at', { ascending: false })

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

        {/* CURRENT INVENTORY */}
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
