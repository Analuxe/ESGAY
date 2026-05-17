'use client';

import { useState, useEffect } from 'react';
import { playRelayClick, playStaticFlicker } from '@/lib/sound-utils';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (consents: { cart: boolean; analytics: boolean }) => void;
}

export default function CookieSettingsModal({ isOpen, onClose, onSave }: CookieSettingsModalProps) {
  // Read existing consents or default to true
  const [cartConsent, setCartConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      playStaticFlicker(); // Trigger static burst when opening console

      // Read current consents from localStorage
      const consent = localStorage.getItem('esgay_privacy_consent');
      if (consent === 'all') {
        setCartConsent(true);
        setAnalyticsConsent(true);
      } else if (consent === 'minimal') {
        setCartConsent(false);
        setAnalyticsConsent(false);
      } else if (consent) {
        try {
          const parsed = JSON.parse(consent);
          setCartConsent(!!parsed.cart);
          setAnalyticsConsent(!!parsed.analytics);
        } catch (e) {
          // Keep defaults
        }
      }
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleCart = () => {
    const nextState = !cartConsent;
    setCartConsent(nextState);
    playRelayClick(nextState); // Play mechanical solenoid sound
  };

  const handleToggleAnalytics = () => {
    const nextState = !analyticsConsent;
    setAnalyticsConsent(nextState);
    playRelayClick(nextState); // Play mechanical solenoid sound
  };

  const handleSave = () => {
    playStaticFlicker();
    onSave({
      cart: cartConsent,
      analytics: analyticsConsent,
    });
  };

  return (
    <div className={`cookie-modal-overlay ${visible ? 'snap-open' : ''}`}>
      {/* Glitch Grid Canvas */}
      <div className="cookie-modal-container cracked-border">
        {/* Terminal Header */}
        <header className="cookie-modal-header">
          <div className="terminal-dot-group">
            <span className="dot red"></span>
            <span className="dot gold"></span>
            <span className="dot turquoise"></span>
          </div>
          <h2 className="cookie-modal-title">
            PRIVACY_ENGINE // SECURITY SYSTEM v1.0.4
          </h2>
          <button 
            className="cookie-modal-close-btn"
            onClick={() => { playStaticFlicker(); onClose(); }}
            aria-label="Close settings"
          >
            [X]
          </button>
        </header>

        {/* Console Readout */}
        <div className="cookie-modal-content">
          <p className="console-prompt">
            &gt; ACCESS GRANTED. LOCALHOST DATA HARVEST VECTOR CONFIGURATION REQUIRED BEFORE DEPARTURE. SELECT OPT-IN VECTORS FOR CO-EXISTENCE:
          </p>

          <div className="cookie-vector-list">
            
            {/* VECTOR 1: SESSION (ESSENTIAL) */}
            <div className="cookie-vector-item locked">
              <div className="cookie-vector-info">
                <span className="cookie-vector-name">esgay_session</span>
                <span className="cookie-vector-tag">[ MANDATORY // SYSTEM ]</span>
                <p className="cookie-vector-desc">
                  Essential Gateway Authorization vector. Maintains encrypted handshake credentials with the multi-vendor backend registry. Deconflicts authentication bounds.
                </p>
              </div>
              <div className="cookie-vector-control">
                <div className="mechanical-switch essential-locked" aria-disabled="true">
                  <span className="switch-state-tag">[ ON ]</span>
                  <div className="switch-handle locked-active"></div>
                </div>
              </div>
            </div>

            {/* VECTOR 2: CART (OPTIONAL) */}
            <div className="cookie-vector-item">
              <div className="cookie-vector-info">
                <span className="cookie-vector-name">esgay_cart</span>
                <span className="cookie-vector-tag">[ COMMERCE // TRACKING ]</span>
                <p className="cookie-vector-desc">
                  Sartorial Spite & Yardsmith Commerce tracking registry. Persists your active shopping manifesto through the unboxing and customs rituals.
                </p>
              </div>
              <div className="cookie-vector-control">
                {cartConsent ? (
                  <button 
                    onClick={handleToggleCart}
                    className="mechanical-switch active"
                    role="switch"
                    aria-checked="true"
                    aria-label="Toggle esgay_cart cookie"
                  >
                    <span className="switch-state-tag">[ ON ]</span>
                    <div className="switch-handle"></div>
                  </button>
                ) : (
                  <button 
                    onClick={handleToggleCart}
                    className="mechanical-switch"
                    role="switch"
                    aria-checked="false"
                    aria-label="Toggle esgay_cart cookie"
                  >
                    <span className="switch-state-tag">[ OFF ]</span>
                    <div className="switch-handle"></div>
                  </button>
                )}
              </div>
            </div>

            {/* VECTOR 3: ANALYTICS (OPTIONAL) */}
            <div className="cookie-vector-item">
              <div className="cookie-vector-info">
                <span className="cookie-vector-name">esgay_analytics</span>
                <span className="cookie-vector-tag">[ DECONSTRUCTIVE // VECTOR ]</span>
                <p className="cookie-vector-desc">
                  Dismantled System Vector Tracking. Audits localized clicks, viewport decays, and performance indices to optimize structural response parameters.
                </p>
              </div>
              <div className="cookie-vector-control">
                {analyticsConsent ? (
                  <button 
                    onClick={handleToggleAnalytics}
                    className="mechanical-switch active"
                    role="switch"
                    aria-checked="true"
                    aria-label="Toggle esgay_analytics cookie"
                  >
                    <span className="switch-state-tag">[ ON ]</span>
                    <div className="switch-handle"></div>
                  </button>
                ) : (
                  <button 
                    onClick={handleToggleAnalytics}
                    className="mechanical-switch"
                    role="switch"
                    aria-checked="false"
                    aria-label="Toggle esgay_analytics cookie"
                  >
                    <span className="switch-state-tag">[ OFF ]</span>
                    <div className="switch-handle"></div>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Terminal Actions */}
        <footer className="cookie-modal-footer">
          <div className="terminal-status-readout">
            STATUS: PRIVACY VECTOR CONVERGENCE SETTINGS MODIFIED
          </div>
          <button 
            className="subversive-btn modal-save-btn"
            onClick={handleSave}
          >
            [ EXECUTE_CONCURRENT_POLICIES ]
          </button>
        </footer>
      </div>
    </div>
  );
}
