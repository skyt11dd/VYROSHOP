export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', textAlign: 'center', gap: 16, padding: '0 24px'
    }}>
      <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-0.05em', background: 'linear-gradient(135deg, var(--text) 0%, var(--text-muted) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        404
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Сторінку не знайдено</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 400, lineHeight: 1.6 }}>
        Схоже, ця сторінка не існує або була переміщена.
      </p>
      <a href="/" className="btn btn-primary" style={{ marginTop: 8 }}>На головну</a>
    </div>
  );
}
