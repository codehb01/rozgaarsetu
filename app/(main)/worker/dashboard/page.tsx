import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function WorkerDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280' }}>
          Please sign in to access your dashboard.
        </div>
      </main>
    );
  }

  const worker = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { workerProfile: true },
  });

  if (!worker || worker.role !== "WORKER") {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280' }}>Worker access required.</div>
      </main>
    );
  }

  // Fetch job statistics
  const [totalJobs, pendingJobs, completedJobs, recentJobs] = await Promise.all([
    prisma.job.count({ where: { workerId: worker.id } }),
    prisma.job.count({ where: { workerId: worker.id, status: "PENDING" } }),
    prisma.job.count({ where: { workerId: worker.id, status: "COMPLETED" } }),
    prisma.job.findMany({
      where: { workerId: worker.id },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Calculate total earnings from completed jobs
  const completedJobsWithEarnings = await prisma.job.findMany({
    where: { workerId: worker.id, status: "COMPLETED" },
    select: { charge: true },
  });
  const totalEarnings = completedJobsWithEarnings.reduce((sum, job) => sum + job.charge, 0);
  const acceptedJobs = await prisma.job.count({
    where: { workerId: worker.id, status: "ACCEPTED" },
  });

  const stats = [
    { title: "Total Jobs", value: totalJobs.toString(), emoji: "💼", color: "#2563eb" },
    { title: "Pending Requests", value: pendingJobs.toString(), emoji: "⏳", color: "#f59e0b" },
    { title: "Active Jobs", value: acceptedJobs.toString(), emoji: "📈", color: "#059669" },
    { title: "Completed Jobs", value: completedJobs.toString(), emoji: "✅", color: "#22c55e" },
  ];

  const quickActions = [
    { title: "Job Requests", description: "View and manage job requests", emoji: "📅", href: "/worker/job" },
    { title: "View Profile", description: "See your public profile", emoji: "👁️", href: `/workers/${worker.id}` },
    { title: "Settings", description: "Update your preferences", emoji: "⚙️", href: "/worker/settings" },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      {/* Hero Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#111827', marginBottom: '1rem' }}>
            Welcome Back, <span style={{ color: '#059669' }}>{worker.name}</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '32rem', margin: '0 auto' }}>
            Manage your jobs, track earnings, and grow your professional career.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '300', color: '#111827', marginBottom: '0.5rem' }}>
            Your Statistics
          </h2>
          <p style={{ color: '#6b7280' }}>
            Overview of your work performance
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {stats.map(({ title, value, emoji, color }) => (
            <div key={title} style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>{value}</p>
                </div>
                <div style={{ fontSize: '2rem' }}>{emoji}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Earnings Card */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Total Earnings
              </h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
                ₹{totalEarnings.toFixed(2)}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                From {completedJobs} completed jobs
              </p>
            </div>
            <div style={{ fontSize: '3rem' }}>💰</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '300', color: '#111827', marginBottom: '0.5rem' }}>
            Quick Actions
          </h2>
          <p style={{ color: '#6b7280' }}>
            Manage your work efficiently
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {quickActions.map(({ title, description, emoji, href }) => (
            <Link key={title} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              className="hover-lift"
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{emoji}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '300', color: '#111827', marginBottom: '0.5rem' }}>
              Recent Jobs
            </h2>
            <p style={{ color: '#6b7280' }}>
              Your latest job requests and completions
            </p>
          </div>
          <Link 
            href="/worker/job"
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            View All Jobs
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem' }}>No jobs yet</div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Job requests will appear here
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                      {job.description}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Customer: {job.customer?.name ?? "Unknown"}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      📅 {new Date(job.time).toLocaleDateString()} at {new Date(job.time).toLocaleTimeString()}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      📍 {job.location}
                    </p>
                    <p style={{ color: '#059669', fontWeight: '600' }}>
                      ₹{job.charge.toFixed(2)}
                    </p>
                    {job.details && (
                      <p style={{ color: '#374151', fontSize: '0.875rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        {job.details}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: 
                        job.status === "PENDING" ? '#fef3c7' :
                        job.status === "ACCEPTED" ? '#dbeafe' :
                        job.status === "COMPLETED" ? '#d1fae5' : '#f3f4f6',
                      color:
                        job.status === "PENDING" ? '#d97706' :
                        job.status === "ACCEPTED" ? '#2563eb' :
                        job.status === "COMPLETED" ? '#059669' : '#6b7280'
                    }}>
                      {job.status}
                    </span>
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
