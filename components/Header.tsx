'use client'

import { useState, useEffect, useRef, useTransition, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { playRelayClick, playStaticFlicker } from '@/lib/sound-utils'
import { useManifest } from '@/lib/store/ManifestContext'
import { signout } from '@/app/actions/auth'

interface HeaderProps {
  user: {
    id: string;
    email?: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const { items } = useManifest()

  // Toggle dropdown with physical sound click
  const toggleMenu = () => {
    const nextState = !isOpen
    setIsOpen(nextState)
    playRelayClick(nextState)
  }

  // Close menu and play click
  const closeMenu = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
      playRelayClick(false)
    }
  }, [isOpen])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeMenu])

  // Play static flicker sound when hovering over logo or entering sectors
  const handleHoverLogo = () => {
    playStaticFlicker()
  }

  // Close dropdown on path change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="global-header">
      <div className="global-header-content">
        {/* LOGO */}
        <Link 
          href="/" 
          className="header-logo"
          onMouseEnter={handleHoverLogo}
          onClick={closeMenu}
        >
          ES<span className="logo-gold">GAY</span>
        </Link>

        {/* MENU DRIVEN DROPDOWN */}
        <div className="header-menu-container" ref={dropdownRef}>
          <button 
            onClick={toggleMenu} 
            className={`header-menu-btn ${isOpen ? 'active' : ''}`}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-label="Toggle system terminal received logs"
          >
            <span className="menu-indicator"></span>
            {user ? (
              <span>[ SYSTEM // SECURE ]</span>
            ) : (
              <span>[ SYSTEM // GUEST ]</span>
            )}
          </button>

          {/* DROPDOWN MENU */}
          <div className={`header-dropdown-menu ${isOpen ? 'open' : ''}`}>
            <div className="dropdown-scanlines"></div>
            <div className="dropdown-border-accent"></div>
            
            <div className="dropdown-content">
              {/* SYSTEM HEADER */}
              <div className="dropdown-header-block">
                <h3 className="dropdown-system-title">
                  EMBASSY_OS // v2.6.5
                </h3>
                <p className="dropdown-system-status">
                  STATUS: {user ? 'SECURE_DIPLOMATIC_CONNECTION' : 'UNAUTHORIZED_ANONYMOUS_LINK'}
                </p>
              </div>

              {/* IDENTIFICATION BLOCK */}
              <div className="dropdown-auth-card">
                {user ? (
                  <>
                    <div className="dropdown-auth-status">
                      <span className="status-indicator-dot online"></span>
                      <span>Dossier Active</span>
                    </div>
                    <div className="dropdown-auth-email">
                      {user.email}
                    </div>
                    <Link 
                      href="/command-center" 
                      className="dropdown-auth-btn"
                      onClick={closeMenu}
                      onMouseEnter={handleHoverLogo}
                    >
                      [ COMMAND CENTER ]
                    </Link>
                    <form 
                      action={async () => {
                        startTransition(async () => {
                          playStaticFlicker()
                          await signout()
                        })
                      }} 
                      className="dropdown-signout-form"
                    >
                      <button 
                        type="submit" 
                        className="dropdown-btn-signout"
                        disabled={isPending}
                      >
                        {isPending ? 'TERMINATING...' : '[ TERMINATE SESSION ]'}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="dropdown-auth-status">
                      <span className="status-indicator-dot offline"></span>
                      <span>Access Restricted</span>
                    </div>
                    <Link 
                      href="/login" 
                      className="dropdown-auth-btn"
                      onClick={closeMenu}
                      onMouseEnter={handleHoverLogo}
                    >
                      [ AUTHENTICATE / ENTRY ]
                    </Link>
                  </>
                )}
              </div>

              {/* SECTIONS / WINGS OF THE EMBASSY */}
              <div className="dropdown-section">
                <h4 className="dropdown-section-title">Embassy Courtyards</h4>
                <div className="dropdown-link-list">
                  <Link href="/the-galleries" className="dropdown-item-link" onClick={closeMenu}>
                    <span>01. The Galleries</span>
                    <span className="link-arrow">→</span>
                  </Link>
                  <Link href="/the-yardsmiths" className="dropdown-item-link" onClick={closeMenu}>
                    <span>02. Craftwork</span>
                    <span className="link-arrow">→</span>
                  </Link>
                  <Link href="/sartorial-spite" className="dropdown-item-link" onClick={closeMenu}>
                    <span>03. Wardrobe</span>
                    <span className="link-arrow">→</span>
                  </Link>
                  <Link href="/propaganda-parody" className="dropdown-item-link" onClick={closeMenu}>
                    <span>04. Satire & Camp</span>
                    <span className="link-arrow">→</span>
                  </Link>
                  <Link href="/the-apothecary" className="dropdown-item-link" onClick={closeMenu}>
                    <span>05. The Apothecary</span>
                    <span className="link-arrow">→</span>
                  </Link>
                  <Link href="/customs" className="dropdown-item-link" onClick={closeMenu}>
                    <span>06. Customs Manifest</span>
                    <span className="link-arrow">→</span>
                  </Link>
                </div>
              </div>

              {/* FOOTER */}
              <div className="dropdown-footer">
                <Link 
                  href="/customs" 
                  className="dropdown-manifest-status"
                  onClick={closeMenu}
                >
                  Manifest: {items.length} {items.length === 1 ? 'Relic' : 'Relics'}
                </Link>
                <span className="dropdown-system-secure">SSL_SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
