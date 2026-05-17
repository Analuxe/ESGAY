'use client';

import { useState, useEffect, useRef } from 'react';
import CookieSettingsModal from './CookieSettingsModal';
import { playStaticFlicker, playRelayClick } from '@/lib/sound-utils';

export default function CookieGate() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check consent state on mount (Client-side only to prevent hydration mismatches)
  useEffect(() => {
    const consent = localStorage.getItem('esgay_privacy_consent');
    if (!consent) {
      setIsVisible(true);
      // Electrostatic startup sound to fit the boot-up experience
      setTimeout(() => {
        playStaticFlicker();
      }, 500);
    }
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    playRelayClick(true);
    // Write consent cookie and local storage
    localStorage.setItem('esgay_privacy_consent', 'all');
    document.cookie = 'esgay_privacy_consent=all; path=/; max-age=31536000; SameSite=Lax; Secure';
    
    // Enable trackers
    document.cookie = 'esgay_cart=true; path=/; max-age=31536000; SameSite=Lax; Secure';
    document.cookie = 'esgay_analytics=true; path=/; max-age=31536000; SameSite=Lax; Secure';
    
    triggerExitSequence();
  };

  const handleRejectAll = () => {
    playRelayClick(false);
    // Write minimal privacy protocol
    localStorage.setItem('esgay_privacy_consent', 'minimal');
    document.cookie = 'esgay_privacy_consent=minimal; path=/; max-age=31536000; SameSite=Lax; Secure';
    
    // Explicitly delete optional cookies by setting them to empty and expired
    document.cookie = 'esgay_cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    document.cookie = 'esgay_analytics=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    
    triggerExitSequence();
  };

  const handleSaveSettings = (consents: { cart: boolean; analytics: boolean }) => {
    const consentString = JSON.stringify(consents);
    localStorage.setItem('esgay_privacy_consent', consentString);
    document.cookie = `esgay_privacy_consent=${encodeURIComponent(consentString)}; path=/; max-age=31536000; SameSite=Lax; Secure`;

    // Apply cart cookie
    if (consents.cart) {
      document.cookie = 'esgay_cart=true; path=/; max-age=31536000; SameSite=Lax; Secure';
    } else {
      document.cookie = 'esgay_cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    }

    // Apply analytics cookie
    if (consents.analytics) {
      document.cookie = 'esgay_analytics=true; path=/; max-age=31536000; SameSite=Lax; Secure';
    } else {
      document.cookie = 'esgay_analytics=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    }

    setShowSettings(false);
    triggerExitSequence();
  };

  const triggerExitSequence = () => {
    setIsFadingOut(true);
    // Wait for the CRT static power down animation to complete before rendering page
    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
    }, 900);
  };

  const handleVideoError = () => {
    console.warn("Video asset failed to load. Initiating Matte Charcoal Canvas fallback.");
    setVideoError(true);
  };

  return (
    <div 
      className={`cookie-gate-overlay ${isFadingOut ? 'fade-and-flicker-out' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      {/* Screen CRT Overlay effects for high aesthetics */}
      <div className="gate-scanlines"></div>
      <div className="gate-screen-glitch"></div>

      {/* Dynamic Scale Wrapper ensures video and buttons perfectly sync across all devices */}
      <div className="video-scale-wrapper fade-in">
        {!videoError ? (
          <video
            ref={videoRef}
            src="/cookies.mp4"
            autoPlay
            muted
            playsInline
            onError={handleVideoError}
            className="gate-video-bg"
          />
        ) : (
          <div className="gate-canvas-fallback">
            <div className="noise-grain-layer"></div>
            <div className="matte-charcoal-base"></div>
          </div>
        )}

        {/* Invisible buttons simulating glowing projection spots from the video */}
        <div className="hud-button-matrix">
          <button 
            className="hud-projection-btn btn-accept"
            onClick={handleAcceptAll}
            tabIndex={1}
            aria-label="Accept all"
          ></button>

          <button 
            className="hud-projection-btn btn-reject"
            onClick={handleRejectAll}
            tabIndex={2}
            aria-label="Reject all"
          ></button>

          <button 
            className="hud-projection-btn btn-manage"
            onClick={() => { playStaticFlicker(); setShowSettings(true); }}
            tabIndex={3}
            aria-label="Manage protocols"
          ></button>
        </div>
      </div>

      {/* Primary Configuration Panel Layer */}
      <CookieSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
