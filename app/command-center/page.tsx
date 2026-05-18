export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { getAdmins, checkIsAdmin } from '@/app/actions/artifacts'
import Link from 'next/link'
import styles from './command-center.module.css'
import CommandCenterForms from './CommandCenterForms'

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

      {/* RENDER THE HIGH-FIDELITY INTERACTIVE COMPONENT */}
      <CommandCenterForms 
        initialArtifacts={artifacts || []}
        initialAdmins={admins || []}
        vendors={vendors || []}
      />

      <div className={styles.footerNav}>
        <Link href="/" className={styles.returnLink}>
          &lt; Return to Embassy
        </Link>
      </div>
    </main>
  )
}
