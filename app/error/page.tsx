import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center', padding: '1.5rem', maxWidth: '32rem', margin: '0 auto' }}>
        {/* 404 Number */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '6rem', 
            fontWeight: '300', 
            color: '#111827', 
            lineHeight: '1',
            marginBottom: '1rem'
          }}>
            4<span style={{ color: '#2563eb' }}>0</span>4
          </h1>
        </div>

        {/* Main message */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '300', color: '#111827', marginBottom: '1rem' }}>
            Page Not Found
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.6' }}>
            The page you're looking for doesn't exist or has been moved.
            <br />
            <span style={{ color: '#2563eb', fontWeight: '500' }}>
              Let's get you back on track.
            </span>
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem' }}>
          <Link 
            href="/"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            🏠 Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: 'transparent',
              color: '#374151',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '500',
              border: '2px solid #d1d5db',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            ← Go Back
          </button>
        </div>

        {/* Subtle help text */}
        <div style={{ marginTop: '3rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            If you believe this is an error, please{" "}
            <Link
              href="/contact"
              style={{ color: '#2563eb', textDecoration: 'underline' }}
            >
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
