'use client'

import React, { useState, useRef } from 'react'
import { createArtifact, confiscateArtifact, addAdmin, removeAdmin } from '@/app/actions/artifacts'
import styles from './command-center.module.css'

interface CommandCenterFormsProps {
  initialArtifacts: any[]
  initialAdmins: any[]
  vendors: any[]
}

export default function CommandCenterForms({
  initialArtifacts,
  initialAdmins,
  vendors
}: CommandCenterFormsProps) {
  // Local list states for real-time fluid interactivity
  const [artifacts, setArtifacts] = useState<any[]>(initialArtifacts)
  const [admins, setAdmins] = useState<any[]>(initialAdmins)
  
  // Search state for inventory log
  const [searchTerm, setSearchTerm] = useState('')

  // Form submit loading states
  const [artifactLoading, setArtifactLoading] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [confiscatingId, setConfiscatingId] = useState<string | null>(null)

  // Status alerts states
  const [artifactAlert, setArtifactAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null)
  const [adminAlert, setAdminAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null)

  // Photo preview states
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const artifactFormRef = useRef<HTMLFormElement>(null)
  const adminFormRef = useRef<HTMLFormElement>(null)

  // Handle Photo selection preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPhotoPreview(null)
    }
  }

  // Handle Artifact deployment client-side
  const handleArtifactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setArtifactLoading(true)
    setArtifactAlert(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createArtifact(formData)
      
      if (result && 'error' in result) {
        setArtifactAlert({ type: 'error', message: result.error })
      } else {
        setArtifactAlert({ type: 'success', message: 'Artifact cataloged and deployed successfully.' })
        
        // Optimistically reload list or fetch list updates
        // Since we are client-side, let's create a temporary object or refresh local state if needed.
        // For simplicity and seamless UX, we append the item to the top of our local state
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const stock_count = parseInt(formData.get('stock_count') as string || '1', 10)
        const wing = formData.get('wing') as string
        const selectedVendorId = vendors[0]?.id // Placeholder vendor link

        const newLocalItem = {
          id: `temp-${Date.now()}`,
          title,
          description,
          price,
          stock_count,
          wing,
          is_confiscated: false,
          image_url: photoPreview || undefined,
          vendors: { moniker: vendors[0]?.moniker || 'Divine Scavenger' }
        }
        
        setArtifacts(prev => [newLocalItem, ...prev])

        // Clear form fields
        artifactFormRef.current?.reset()
        setPhotoPreview(null)
      }
    } catch (err: any) {
      setArtifactAlert({ type: 'error', message: err.message || 'An unexpected transport error occurred.' })
    } finally {
      setArtifactLoading(false)
    }
  }

  // Handle Admin Authorization
  const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAdminLoading(true)
    setAdminAlert(null)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string)?.trim().toLowerCase()

    try {
      const result = await addAdmin(formData)
      
      if (result && 'error' in result) {
        setAdminAlert({ type: 'error', message: result.error })
      } else {
        setAdminAlert({ type: 'success', message: `Clearance successfully granted to [${email}].` })
        
        // Append to local admins list
        const newLocalAdmin = {
          id: `temp-admin-${Date.now()}`,
          email,
          created_at: new Date().toISOString()
        }
        setAdmins(prev => [...prev, newLocalAdmin])
        
        adminFormRef.current?.reset()
      }
    } catch (err: any) {
      setAdminAlert({ type: 'error', message: err.message || 'Failed to grant admin credentials.' })
    } finally {
      setAdminLoading(false)
    }
  }

  // Handle Admin Revocation
  const handleRevoke = async (id: string, email: string) => {
    if (!confirm(`Are you absolutely sure you want to revoke clearance for [${email}]?`)) return
    
    setRevokingId(id)
    setAdminAlert(null)

    try {
      const result = await removeAdmin(id)
      if (result && 'error' in result) {
        setAdminAlert({ type: 'error', message: result.error })
      } else {
        setAdminAlert({ type: 'success', message: `Credentials successfully revoked for [${email}].` })
        setAdmins(prev => prev.filter(adm => adm.id !== id))
      }
    } catch (err: any) {
      setAdminAlert({ type: 'error', message: err.message || 'Failed to revoke credentials.' })
    } finally {
      setRevokingId(null)
    }
  }

  // Handle Confiscate / Release
  const handleConfiscateToggle = async (id: string, currentStatus: boolean, title: string, wing: string) => {
    setConfiscatingId(id)
    
    try {
      const result = await confiscateArtifact(id, currentStatus, wing)
      if (result && 'error' in result) {
        alert(result.error)
      } else {
        // Toggle the state in local array
        setArtifacts(prev => prev.map(art => {
          if (art.id === id) {
            return { ...art, is_confiscated: !currentStatus }
          }
          return art
        }))
      }
    } catch (err: any) {
      alert(`Network error toggling confiscation: ${err.message}`)
    } finally {
      setConfiscatingId(null)
    }
  }

  // Filter artifacts list based on search query
  const filteredArtifacts = artifacts.filter(art => {
    const query = searchTerm.toLowerCase()
    return (
      art.title?.toLowerCase().includes(query) ||
      art.description?.toLowerCase().includes(query) ||
      art.wing?.toLowerCase().includes(query)
    )
  })

  return (
    <div className={styles.gridContainer}>
      
      {/* LEFT COLUMN: FORMS */}
      <div className={styles.formsColumn}>
        
        {/* ADD ARTIFACT FORM */}
        <section className={`cracked-border ${styles.formSection}`}>
          <h2 className={styles.sectionTitle}>
            Inject New Artifact
          </h2>

          {artifactAlert && (
            <div className={`${styles.alertContainer} ${artifactAlert.type === 'error' ? styles.errorAlert : styles.successAlert}`}>
              <div className={styles.alertScanlines}></div>
              <span>{artifactAlert.type === 'error' ? '✖ ERROR // ' : '✓ SUCCESS // '}</span>
              {artifactAlert.message}
            </div>
          )}

          <form 
            ref={artifactFormRef}
            onSubmit={handleArtifactSubmit} 
            className={styles.form} 
            encType="multipart/form-data"
          >
            <div className={styles.fieldGroup}>
              <label htmlFor="artifact-title" className={styles.label}>Artifact Title</label>
              <input 
                id="artifact-title" 
                type="text" 
                name="title" 
                placeholder="e.g. Broken Mirror of the Bourgeoisie" 
                title="Artifact Title" 
                required 
                className={styles.input} 
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="artifact-description" className={styles.label}>Subversive Description</label>
              <textarea 
                id="artifact-description" 
                name="description" 
                placeholder="Describe the aesthetic and contextual decay..." 
                title="Subversive Description" 
                required 
                rows={4} 
                className={styles.textarea} 
              />
            </div>

            <div className={styles.twoColGrid}>
              <div className={styles.fieldGroup}>
                <label htmlFor="artifact-price" className={styles.label}>Price ($)</label>
                <input 
                  id="artifact-price" 
                  type="number" 
                  name="price" 
                  step="0.01" 
                  placeholder="0.00" 
                  title="Price ($)" 
                  required 
                  className={styles.input} 
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="artifact-stock" className={styles.label}>Stock Count</label>
                <input 
                  id="artifact-stock" 
                  type="number" 
                  name="stock_count" 
                  placeholder="1" 
                  title="Stock Count" 
                  required 
                  defaultValue="1" 
                  className={styles.input} 
                />
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
                ref={fileInputRef}
                id="artifact-photo" 
                type="file" 
                name="photo" 
                accept="image/*" 
                title="Artifact Photo / Artwork" 
                className={styles.fileInput} 
                onChange={handlePhotoChange}
              />
              
              {photoPreview && (
                <div className={styles.photoPreviewContainer}>
                  <span className={styles.photoPreviewTitle}>[ SELECTED ASSET PREVIEW ]</span>
                  <img src={photoPreview} alt="Preview" className={styles.photoPreviewImg} />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={artifactLoading}
              className={`subversive-btn ${styles.submitBtn} ${artifactLoading ? styles.btnLoading : ''}`}
            >
              {artifactLoading ? '[ CATALOGING... ]' : '[ DEPLOY ARTIFACT ]'}
            </button>
          </form>
        </section>

        {/* DOSSIER CLEARANCES (DYNAMIC ADMINS) */}
        <section className={`cracked-border ${styles.formSection}`}>
          <h2 className={styles.sectionTitle}>
            Dossier Clearances
          </h2>

          {adminAlert && (
            <div className={`${styles.alertContainer} ${adminAlert.type === 'error' ? styles.errorAlert : styles.successAlert}`}>
              <div className={styles.alertScanlines}></div>
              <span>{adminAlert.type === 'error' ? '✖ ERROR // ' : '✓ SUCCESS // '}</span>
              {adminAlert.message}
            </div>
          )}

          <form 
            ref={adminFormRef}
            onSubmit={handleAdminSubmit} 
            className={styles.form}
          >
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
                <button 
                  type="submit" 
                  disabled={adminLoading}
                  className={`subversive-btn ${styles.grantButton} ${adminLoading ? styles.btnLoading : ''}`}
                >
                  {adminLoading ? '[...]' : '[ GRANT ]'}
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
                  <button 
                    onClick={() => handleRevoke(adm.id, adm.email)}
                    disabled={revokingId === adm.id}
                    className={`subversive-btn ${styles.revokeButton} ${revokingId === adm.id ? styles.btnLoading : ''}`}
                  >
                    {revokingId === adm.id ? '[REVOKING...]' : '[ REVOKE ]'}
                  </button>
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

        {/* SEARCH AND FILTERS BOX */}
        <div className={styles.searchBoxContainer}>
          <input 
            type="text" 
            placeholder="🔍 Scan logs (filter by keyword, courtyard...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.inventoryList}>
          {filteredArtifacts.map((artifact) => {
            const isConfiscating = confiscatingId === artifact.id
            return (
              <div 
                key={artifact.id} 
                className={`${styles.inventoryItem} ${artifact.is_confiscated ? styles.inventoryItemConfiscated : styles.inventoryItemActive}`}
              >
                <div>
                  <h3 className={`${styles.itemTitle} ${artifact.is_confiscated ? styles.itemTitleConfiscated : styles.itemTitleActive}`}>
                    {artifact.title}
                  </h3>
                  <p className={styles.itemMeta}>
                    {artifact.wing} | ${artifact.price} | Stock: {artifact.stock_count}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleConfiscateToggle(artifact.id, artifact.is_confiscated, artifact.title, artifact.wing)}
                  disabled={isConfiscating}
                  className={`${styles.actionBtn} ${artifact.is_confiscated ? styles.actionBtnRelease : styles.actionBtnConfiscate} ${isConfiscating ? styles.btnLoading : ''}`}
                >
                  {isConfiscating ? 'PROCESSING...' : artifact.is_confiscated ? 'Release' : 'Confiscate'}
                </button>
              </div>
            )
          })}

          {filteredArtifacts.length === 0 && (
            <p className={styles.emptyMsg}>
              {searchTerm ? 'No matching records found in embassy inventory logs.' : 'No artifacts exist in the database.'}
            </p>
          )}
        </div>
      </section>

    </div>
  )
}
