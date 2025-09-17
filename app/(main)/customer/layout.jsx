export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">{children}</div>
    </div>
  );
}
