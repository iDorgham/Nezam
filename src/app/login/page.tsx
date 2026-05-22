'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/admin/manager')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/manager`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}
    className="animate-fadeIn"
    >
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#1E1E1E',
        borderRadius: '12px',
        padding: '2.5rem',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Logo/Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#1DB954', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>NEZAM</h1>
          <p style={{ color: '#A7A7A7', fontSize: '0.9rem' }}>Nightclub Management System</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 75, 75, 0.1)',
            color: '#ff4b4b',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 75, 75, 0.2)'
          }}>
            {error}
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#A7A7A7', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', color: '#A7A7A7', fontWeight: '500' }}>Password</label>
              <span style={{ fontSize: '0.75rem', color: '#1DB954', cursor: 'pointer' }}>Forgot?</span>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: '#1DB954',
              color: '#000',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '500px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(1)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: '#A7A7A7', fontSize: '0.8rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* OAuth Buttons */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '0.75rem',
            borderRadius: '500px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  backgroundColor: '#2A2A2A',
  border: '1px solid transparent',
  color: '#fff',
  padding: '0.75rem',
  borderRadius: '6px',
  fontSize: '0.9rem',
  width: '100%',
  outline: 'none',
  transition: 'all 0.2s ease'
}
