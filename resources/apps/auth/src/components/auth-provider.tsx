import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react'
import { authClient } from '@/auth'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      social={{
        providers: ['google', 'github'], // Enable Google and GitHub sign-in
      }}
      localization={{
        SIGN_IN: 'Welcome Back',
        SIGN_UP: 'Create Account',
        FORGOT_PASSWORD: 'Forgot Password?',
      }}
      additionalFields={{
        company: {
          label: 'Company',
          placeholder: 'Your company name',
          type: 'string',
          required: false,
        },
      }}
      signUp={{
        fields: ['name', 'company'],
      }}
      credentials={{
        forgotPassword: true,
      }}
    >
      {children}
    </NeonAuthUIProvider>
  )
}
