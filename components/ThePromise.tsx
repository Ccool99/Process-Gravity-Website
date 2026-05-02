export default function ThePromise() {
  return (
    <section
      id="promise-section"
      style={{ background: '#0c1120', padding: '80px 40px', textAlign: 'center' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display uppercase tracking-[0.08em] leading-[1.05]"
          style={{
            fontSize: 'clamp(52px, 8vw, 88px)',
            background: 'linear-gradient(90deg, #2979ff, #00aaff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          DONE FOR YOU.
          <br />
          NOT DONE TO YOU.
        </h2>

        <p
          className="font-ui uppercase text-muted"
          style={{ fontSize: '16px', letterSpacing: '0.25em', marginTop: '32px' }}
        >
          INPUT ONCE. RUN FOREVER. DASHBOARD DAILY.
        </p>
      </div>
    </section>
  )
}
