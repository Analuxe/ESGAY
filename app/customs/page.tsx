'use client';

import { useManifest } from '@/lib/store/ManifestContext';
import Link from 'next/link';
import styles from './customs.module.css';

export default function CustomsForm() {
  const { items, total, removeItem } = useManifest();

  return (
    <main className={`room-wrapper fade-in ${styles.mainContainer}`}>
      <div className={styles.paperForm}>
        {/* Background "Stamps" */}
        <div className={styles.stamp}>
          <h2 className={styles.stampText}>SEIZED</h2>
        </div>

        <header className={styles.header}>
          <h1 className={styles.title}>
            MANIFEST OF ACQUISITION
          </h1>
          <p className={styles.subtitle}>
            FORM ESG-894 // BORDER CONTROL // DECLARATION OF CONTRABAND
          </p>
        </header>

        {items.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyMsg}>
              [ ERR: NO CONTRABAND DECLARED. MANIFEST EMPTY. ]
            </p>
            <Link href="/" className={styles.emptyReturnLink}>
              Return to Embassy
            </Link>
          </div>
        ) : (
          <div className={styles.manifestBody}>
            <div className={styles.tableHeader}>
              <span>ITEM_DESCRIPTION</span>
              <span>ORIGIN</span>
              <span className={styles.alignRight}>DECLARED_VALUE</span>
            </div>

            <ul className={styles.itemList}>
              {items.map((item, index) => (
                <li key={item.id} className={styles.itemRow}>
                  <span className={styles.itemTitle}>{String(index + 1).padStart(2, '0')}. {item.title}</span>
                  <span className={styles.itemVendor}>[{item.vendor}]</span>
                  <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className={styles.removeBtn}
                    title="Remove item"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.summarySection}>
              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span>TARIFFS:</span>
                  <span>[PENDING]</span>
                </div>
                <div className={styles.totalRow}>
                  <span>TOTAL VALUE:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className={styles.warningBox}>
              <p className={styles.warningText}>
                WARNING: By signing this manifest, you acknowledge that all items are acquired &quot;as-is&quot; from the ruins. 
                The establishment takes no responsibility for curses, hexes, or ideological corruption.
              </p>
            </div>

            <div className={styles.footerSection}>
              <div className={styles.signatureBox}>
                <p className={styles.signatureLabel}>AUTHORIZATION SIGNATURE</p>
                <div className={styles.signatureLine}></div>
              </div>
              <button className={styles.submitBtn}>
                Submit Manifest
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.footerNav}>
        <Link href="/" className={styles.returnLink}>
          &lt; Return to Embassy
        </Link>
      </div>
    </main>
  );
}
