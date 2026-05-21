import { useEffect } from 'react'
import { useSessionStore } from './store/session.store'

export function useAutosave() {
  const state = useSessionStore()

  useEffect(() => {
    const interval = setInterval(() => {
      const sessionData = {
        version: '1.0.0',
        saved_at: new Date().toISOString(),
        sitemap: state.sitemap,
        // Add other state slices here as they are implemented
      }

      // In a real app, we would send this to an API endpoint
      // fetch('/api/session', { method: 'POST', body: JSON.stringify(sessionData) })
      // For now, we'll just log it or save to localStorage if we can't write to file easily from client
      console.log('Autosaving session...', sessionData)
      
      // Let's try to use localStorage as a fallback for pure client-side autosave
      localStorage.setItem('nezam_design_session', JSON.stringify(sessionData))
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [state.sitemap])
}
