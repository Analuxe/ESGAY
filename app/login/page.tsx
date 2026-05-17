import OnboardingFlow from '@/components/OnboardingFlow'

export const metadata = {
  title: 'Authenticate | ESGAY Embassy',
  description: 'Secure entry to the ESGAY Embassy. Authenticate to access exclusive artifacts.',
}

export default function LoginPage() {
  return (
    <main className="login-page-main">
      {/* Decorative background styling specific to the login page to add to the "beautiful decay" vibe */}
      <div className="login-page-bg"></div>
      
      <OnboardingFlow />
    </main>
  )
}
