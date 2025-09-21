export default function Home() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Hero Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '3.75rem', 
            fontWeight: '300', 
            color: '#111827', 
            lineHeight: '1.1',
            marginBottom: '1rem'
          }}>
            Connect. Work. <span style={{ color: '#2563eb' }}>Grow.</span>
          </h1>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#374151', 
            maxWidth: '48rem', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            The modern platform connecting blue-collar workers with opportunities.
            <br />
            <span style={{ color: '#2563eb', fontWeight: '500' }}>
              Simple, secure, and location-smart.
            </span>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', paddingTop: '2rem' }}>
          <a 
            href="/onboarding"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-block',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Get Started
          </a>
          <button
            style={{
              backgroundColor: 'transparent',
              color: '#374151',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '500',
              border: '2px solid #d1d5db',
              cursor: 'pointer'
            }}
          >
            Learn More
          </button>
        </div>

        {/* Stats Section */}
        <div style={{ paddingTop: '4rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                10K+
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Active Workers
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#059669' }}>
                5K+
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Jobs Completed
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#7c3aed' }}>
                95%
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '300', color: '#111827', marginBottom: '1rem' }}>
            Why Choose RozgaarSetu?
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '32rem', margin: '0 auto' }}>
            Empowering connections between skilled workers and opportunities
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '4rem', 
              height: '4rem', 
              backgroundColor: '#2563eb', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>💼</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Find Work
            </h3>
            <p style={{ color: '#6b7280' }}>
              Discover opportunities that match your skills and location preferences
            </p>
          </div>

          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '4rem', 
              height: '4rem', 
              backgroundColor: '#059669', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Get Paid
            </h3>
            <p style={{ color: '#6b7280' }}>
              Secure payments delivered instantly with multiple payment options
            </p>
          </div>

          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '4rem', 
              height: '4rem', 
              backgroundColor: '#7c3aed', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Nearby
            </h3>
            <p style={{ color: '#6b7280' }}>
              Connect with workers in your area for quick and efficient hiring
            </p>
          </div>

          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '4rem', 
              height: '4rem', 
              backgroundColor: '#ea580c', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Smart Search
            </h3>
            <p style={{ color: '#6b7280' }}>
              Advanced location-based matching with AI-powered recommendations
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '300', color: '#111827', marginBottom: '1rem' }}>
            How It Works
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            Three simple steps to get started
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '20rem' }}>
            <div style={{ 
              width: '5rem', 
              height: '5rem', 
              backgroundColor: '#2563eb', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>1</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Create Profile
            </h3>
            <p style={{ color: '#6b7280' }}>
              Sign up and create your professional profile with skills and experience
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '20rem' }}>
            <div style={{ 
              width: '5rem', 
              height: '5rem', 
              backgroundColor: '#7c3aed', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>2</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Find Jobs</h3>
            <p style={{ color: '#6b7280' }}>
              Browse and apply to jobs that match your skills and location
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '20rem' }}>
            <div style={{ 
              width: '5rem', 
              height: '5rem', 
              backgroundColor: '#059669', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>3</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Get Paid</h3>
            <p style={{ color: '#6b7280' }}>
              Complete work and receive secure payments instantly
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '300', color: '#111827', marginBottom: '1rem' }}>
            What Workers Say
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            Real stories from our community
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>⭐⭐⭐⭐⭐</span>
            </div>
            <p style={{ color: '#374151', fontStyle: 'italic', marginBottom: '1rem' }}>
              "RozgaarSetu changed my life. I found steady work and the payments are always on time."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                backgroundColor: '#2563eb', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: '600' }}>R</span>
              </div>
              <div>
                <p style={{ color: '#111827', fontWeight: '500' }}>Rajesh Kumar</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Electrician</p>
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>⭐⭐⭐⭐⭐</span>
            </div>
            <p style={{ color: '#374151', fontStyle: 'italic', marginBottom: '1rem' }}>
              "The platform is so easy to use. I can find work near my home and get paid instantly."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                backgroundColor: '#059669', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: '600' }}>P</span>
              </div>
              <div>
                <p style={{ color: '#111827', fontWeight: '500' }}>Priya Sharma</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Cleaner</p>
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>⭐⭐⭐⭐⭐</span>
            </div>
            <p style={{ color: '#374151', fontStyle: 'italic', marginBottom: '1rem' }}>
              "Great platform for contractors like me. Professional, reliable, and secure payments."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                backgroundColor: '#7c3aed', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: '600' }}>A</span>
              </div>
              <div>
                <p style={{ color: '#111827', fontWeight: '500' }}>Amit Singh</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Plumber</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ maxWidth: '64rem', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '300', color: '#111827', marginBottom: '1rem' }}>
            Ready to transform your career?
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#374151', maxWidth: '32rem', margin: '0 auto' }}>
            Join thousands of workers already using RozgaarSetu to find better opportunities and secure their future.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', paddingTop: '1rem' }}>
          <a 
            href="/onboarding"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem 3rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-block',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Start Today
          </a>
          <button
            style={{
              backgroundColor: 'transparent',
              color: '#374151',
              padding: '1rem 3rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '500',
              border: '2px solid #d1d5db',
              cursor: 'pointer'
            }}
          >
            Contact Sales
          </button>
        </div>
      </section>
    </main>
  );
}