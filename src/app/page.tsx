export default function Home() {
  return (
    <main 
      className="animate-fadeIn"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        gap: '2rem'
      }}
    >
      <h1 style={{ color: 'var(--primary)', fontSize: '3rem' }}>
        Nezam
      </h1>
      <p style={{ color: 'var(--text-medium)', fontSize: '1.2rem' }}>
        Nightclub Reservation & Guest List System
      </p>
      <button 
        className="pulse-primary"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--background)',
          border: 'none',
          padding: '0.8rem 1.5rem',
          borderRadius: '500px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Get Started
      </button>
    </main>
  )
}
