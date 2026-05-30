/**
 * Reserved route page — /review
 * Implementation deferred to a later phase. Renders a minimal placeholder
 * with token-styled chrome so the design system remains intact.
 */
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--ds-body-font, system-ui)' }}>
      <h1 style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--ds-text-primary)' }}>
        Reserved route
      </h1>
      <p style={{ color: 'var(--ds-text-muted)', marginTop: '0.5rem' }}>
        <code>/review</code> — implementation deferred to a later phase.
      </p>
    </main>
  )
}
