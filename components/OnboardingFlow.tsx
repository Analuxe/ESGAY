'use client'

import { useState } from 'react'
import { login, signup, resetPassword } from '@/app/actions/auth'

type ViewMode = 'login' | 'signup' | 'forgot_password'

export default function OnboardingFlow() {
  const [view, setView] = useState<ViewMode>('login')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (view === 'login') {
        const result = await login(formData)
        if (result?.error) setError(result.error)
      } else if (view === 'signup') {
        const result = await signup(formData)
        if (result?.error) setError(result.error)
        else setSuccess('Registration successful. Please check your email.')
      } else if (view === 'forgot_password') {
        const result = await resetPassword(formData)
        if (result?.error) setError(result.error)
        else if (result?.success) setSuccess(result.success)
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="embassy-container onboarding-container">
      <div className="cracked-border onboarding-card">
        
        {/* Subtle decorative element */}
        <div className="onboarding-card-accent"></div>

        <h1 className="glitch-layer onboarding-title" data-text={view === 'login' ? 'AUTHENTICATE' : view === 'signup' ? 'ENROLL' : 'RECOVER'}>
          {view === 'login' ? 'AUTHENTICATE' : view === 'signup' ? 'ENROLL' : 'RECOVER'}
        </h1>
        
        <p className="onboarding-subtitle">
          {view === 'login' ? 'Access the Embassy' : view === 'signup' ? 'Join the underground' : 'Reclaim your access'}
        </p>

        {error && (
          <div className="onboarding-error">
            {error}
          </div>
        )}

        {success && (
          <div className="onboarding-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="onboarding-form">
          
          <div className="onboarding-form-group">
            <label htmlFor="email" className="onboarding-label">
              Identification (Email)
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="onboarding-input"
            />
          </div>

          {view !== 'forgot_password' && (
            <div className="onboarding-form-group">
              <div className="onboarding-label-wrapper">
                <label htmlFor="password" className="onboarding-label">
                  Cipher (Password)
                </label>
                {view === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setView('forgot_password')}
                    className="onboarding-forgot-btn"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                className="onboarding-input"
              />
            </div>
          )}

          {view === 'signup' && (
            <div className="onboarding-gdpr-wrapper">
              <input 
                type="checkbox" 
                id="gdpr_consent" 
                name="gdpr_consent" 
                required
                className="onboarding-checkbox"
              />
              <label htmlFor="gdpr_consent" className="onboarding-gdpr-label">
                I consent to the processing of my personal data in accordance with the <a href="/privacy">Privacy Manifesto (GDPR)</a>. I understand my data may be used for sovereign embassy communications and artifact logistics.
              </label>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="subversive-btn onboarding-submit-btn"
          >
            {loading ? 'PROCESSING...' : view === 'login' ? 'ENTER EMBASSY' : view === 'signup' ? 'SUBMIT MANIFEST' : 'SEND RECOVERY'}
          </button>
        </form>

        <div className="onboarding-footer">
          {view === 'login' ? (
            <p className="onboarding-footer-text">
              No dossier? <button onClick={() => {setView('signup'); setError(null); setSuccess(null);}} className="onboarding-footer-btn">Enlist here.</button>
            </p>
          ) : view === 'signup' ? (
            <p className="onboarding-footer-text">
              Already registered? <button onClick={() => {setView('login'); setError(null); setSuccess(null);}} className="onboarding-footer-btn">Authenticate.</button>
            </p>
          ) : (
            <p className="onboarding-footer-text">
              Remembered your cipher? <button onClick={() => {setView('login'); setError(null); setSuccess(null);}} className="onboarding-footer-btn">Return to login.</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
