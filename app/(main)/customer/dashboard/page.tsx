import Link from "next/link";
import prisma from "@/lib/prisma";

const categories = [
  { key: "plumber", label: "Plumber", emoji: "🔧" },
  { key: "electrician", label: "Electrician", emoji: "⚡" },
  { key: "mechanic", label: "Mechanic", emoji: "🔧" },
  { key: "carpenter", label: "Carpenter", emoji: "🔨" },
  { key: "painter", label: "Painter", emoji: "🎨" },
  { key: "cleaner", label: "Cleaner", emoji: "✨" },
  { key: "gardener", label: "Gardener", emoji: "🌱" },
  { key: "driver", label: "Driver", emoji: "🚗" },
  { key: "ac-technician", label: "AC Technician", emoji: "❄️" },
];

export default async function CustomerDashboardPage() {
  const workers = await prisma.user.findMany({
    where: { role: "WORKER" },
    select: {
      id: true,
      name: true,
      workerProfile: {
        select: {
          skilledIn: true,
          city: true,
          availableAreas: true,
          yearsExperience: true,
          qualification: true,
          profilePic: true,
          bio: true,
        },
      },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      {/* Hero Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '300', 
            color: '#111827', 
            marginBottom: '1rem'
          }}>
            Find Your Perfect Worker
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6b7280', 
            maxWidth: '32rem', 
            margin: '0 auto'
          }}>
            Connect with skilled professionals in your area. Browse by category or search for specific expertise.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '300', color: '#111827', marginBottom: '0.5rem' }}>
            Browse Categories
          </h2>
          <p style={{ color: '#6b7280' }}>
            Select a category to find skilled professionals
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1.5rem'
        }}>
          {categories.map(({ key, label, emoji }) => (
            <Link
              key={key}
              href={`/customer/search?category=${encodeURIComponent(key)}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              >
                <div style={{ 
                  fontSize: '2rem', 
                  marginBottom: '1rem'
                }}>
                  {emoji}
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '500', 
                  color: '#111827', 
                  marginBottom: '0.5rem'
                }}>
                  {label}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Professional {label.toLowerCase()}s ready to help
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Workers Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '300', color: '#111827', marginBottom: '0.5rem' }}>
              Featured Professionals
            </h2>
            <p style={{ color: '#6b7280' }}>
              Recently joined skilled workers
            </p>
          </div>
          <Link 
            href="/customer/search"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Browse All Workers
          </Link>
        </div>

        {workers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              No workers available at the moment
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Check back later for new professionals
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem'
          }}>
            {workers.map((w) => (
              <div
                key={w.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                className="hover-lift"
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    {(w.name ?? "U").charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: '#111827', 
                      fontWeight: '600', 
                      fontSize: '1.125rem', 
                      marginBottom: '0.25rem'
                    }}>
                      {w.name ?? "Professional Worker"}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {w.workerProfile?.qualification || "Skilled Professional"}
                      </span>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {w.workerProfile?.yearsExperience ?? 0}+ years
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.875rem' }}>📍</span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {w.workerProfile?.city || "Location"}
                      </span>
                      {w.workerProfile?.availableAreas && w.workerProfile.availableAreas.length > 0 && (
                        <>
                          <span style={{ color: '#d1d5db' }}>•</span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            +{w.workerProfile.availableAreas.length} areas
                          </span>
                        </>
                      )}
                    </div>

                    {w.workerProfile?.skilledIn && w.workerProfile.skilledIn.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {w.workerProfile.skilledIn.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {w.workerProfile.skilledIn.length > 3 && (
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            +{w.workerProfile.skilledIn.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        href={`/workers/${w.id}`}
                        style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        View Profile
                      </Link>
                      <Link 
                        href={`/customer/booking?worker=${w.id}`}
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
