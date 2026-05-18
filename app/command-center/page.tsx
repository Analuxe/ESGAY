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
      <main className={`room-wrapper fade-in ${styles.accessDeniedWrapper}`}>
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

  // Parallel fetch of artifacts, vendors, and admins
  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*, vendors(moniker)')
    .order('created_at', { ascending: false })

  const { data: vendors } = await supabase
    .from('vendors')
    .select('*')

  const admins = await getAdmins()

  // Business Analytics Calculations
  const totalValuation = artifacts?.reduce((sum, art) => sum + (Number(art.price) * art.stock_count), 0) || 0
  const activeCount = artifacts?.filter(art => !art.is_confiscated).length || 0
  const totalStock = artifacts?.reduce((sum, art) => sum + art.stock_count, 0) || 0
  const vendorsCount = vendors?.length || 0

  const wingsList = [
    { key: 'the-galleries', name: 'The Galleries' },
    { key: 'the-yardsmiths', name: 'Craftwork (Yardsmiths)' },
    { key: 'sartorial-spite', name: 'Wardrobe (Sartorial Spite)' },
    { key: 'propaganda-parody', name: 'Satire & Camp' },
    { key: 'the-apothecary', name: 'The Apothecary' }
  ]

  const totalActiveItems = artifacts?.filter(art => !art.is_confiscated).length || 1

  const wingData = wingsList.map(wing => {
    const wingActive = artifacts?.filter(art => art.wing === wing.key && !art.is_confiscated) || []
    const count = wingActive.length
    const percentage = Math.round((count / totalActiveItems) * 100)
    return {
      key: wing.key,
      name: wing.name,
      count,
      percentage
    }
  })

  const vendorBreakdown = vendors?.map(v => {
    const vendorActive = artifacts?.filter(art => art.vendor_id === v.id) || []
    const count = vendorActive.length
    const valuation = vendorActive.reduce((sum, art) => sum + (Number(art.price) * art.stock_count), 0)
    return {
      moniker: v.moniker,
      count,
      valuation
    }
  }).sort((a, b) => b.valuation - a.valuation) || []

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

      {/* BUSINESS ANALYTICS DASHBOARD */}
      <div className={styles.analyticsRibbon}>
        <div className={styles.statCard}>
          <div className={styles.statCardTitle}>Portfolio Valuation</div>
          <div className={`${styles.statCardValue} ${styles.statCardValueHighlight}`}>
            ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={styles.statCardAccent}>VAL</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTitle}>Active Listings</div>
          <div className={styles.statCardValue}>
            {activeCount} <span className={styles.statCardSub}>/ {artifacts?.length || 0}</span>
          </div>
          <div className={styles.statCardAccent}>LST</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTitle}>Physical Stock Count</div>
          <div className={styles.statCardValue}>
            {totalStock} <span className={styles.statCardSub}>units</span>
          </div>
          <div className={styles.statCardAccent}>STK</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTitle}>Artisan Guilds</div>
          <div className={`${styles.statCardValue} ${styles.statCardValueCrimson}`}>
            {vendorsCount}
          </div>
          <div className={styles.statCardAccent}>VND</div>
        </div>
      </div>

      <div className={styles.analyticsGrid}>
        {/* WING DISTRIBUTION PANEL */}
        <div className={`cracked-border ${styles.analyticsPanel}`}>
          <h2 className={styles.panelTitle}>Sartorial Distribution by Wing</h2>
          <div>
            {wingData.map(wing => (
              <div key={wing.name} className={styles.distributionRow}>
                <div className={styles.distributionLabel}>
                  <span>{wing.name}</span>
                  <span>{wing.count} items ({wing.percentage}%)</span>
                </div>
                <div className={styles.distributionBarContainer}>
                  <style>{`
                    .fill-${wing.key} {
                      width: ${wing.percentage}%;
                    }
                  `}</style>
                  <div className={`${styles.distributionBarFill} fill-${wing.key}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARTISAN PERFORMANCE PANEL */}
        <div className={`cracked-border ${styles.analyticsPanel}`}>
          <h2 className={styles.panelTitle}>Artisan Portfolios & Revenue</h2>
          <table className={styles.artisanTable}>
            <thead>
              <tr>
                <th>Artisan Moniker</th>
                <th>Items Cataloged</th>
                <th>Portfolio Value</th>
              </tr>
            </thead>
            <tbody>
              {vendorBreakdown.map(v => (
                <tr key={v.moniker}>
                  <td className={styles.artisanMonikerCell}>{v.moniker}</td>
                  <td>{v.count}</td>
                  <td className={styles.artisanValuationCell}>
                    ${v.valuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {vendorBreakdown.length === 0 && (
                <tr>
                  <td colSpan={3} className={styles.artisanEmptyCell}>
                    No registered artisans in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.gridContainer}>
        
        {/* LEFT COLUMN: FORMS */}
        <div className={styles.formsColumn}>
          {/* ADD ARTIFACT FORM */}
          <section className={`cracked-border ${styles.formSection}`}>
            <h2 className={styles.sectionTitle}>
              Inject New Artifact
            </h2>
            <form action={createArtifact} className={styles.form} encType="multipart/form-data">
              
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

              <div className={styles.fieldGroup}>
                <label htmlFor="artifact-photo" className={styles.label}>Artifact Photo / Artwork</label>
                <input 
                  id="artifact-photo" 
                  type="file" 
                  name="photo" 
                  accept="image/*" 
                  title="Artifact Photo / Artwork" 
                  className={styles.fileInput} 
                />
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
                <div className={styles.adminInputContainer}>
                  <input 
                    id="admin-email" 
                    type="email" 
                    name="email" 
                    placeholder="agent@icloud.com" 
                    title="Admin Email" 
                    required 
                    className={`${styles.input} ${styles.flexOne}`}
                  />
                  <button type="submit" className={`subversive-btn ${styles.grantButton}`}>
                    [ GRANT ]
                  </button>
                </div>
              </div>
            </form>

            <div className={styles.adminListSectionHeader}>
              <h3 className={`${styles.label} ${styles.adminsHeader}`}>
                Active Credentials
              </h3>
              <div className={styles.adminsContainer}>
                {/* Primary Admin (always displayed) */}
                <div className={styles.primaryAdminCard}>
                  <span className={styles.primaryAdminEmail}>khersak@icloud.com</span>
                  <span className={styles.primaryAdminLabel}>[ PRIMARY ]</span>
                </div>
                {/* Dynamically added admins */}
                {admins.map((adm: any) => (
                  <div key={adm.id} className={styles.dynamicAdminCard}>
                    <span className={styles.dynamicAdminEmail}>{adm.email}</span>
                    <form action={async () => {
                      'use server'
                      await removeAdmin(adm.id)
                    }}>
                      <button 
                        type="submit" 
                        className={`subversive-btn ${styles.revokeButton}`}
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
