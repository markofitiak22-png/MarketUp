export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-[240px_1fr] gap-6 px-6 py-8">
      <aside className="border-r md:pr-6">
        <nav className="grid gap-3 text-sm">
          <a href="/studio" className="hover:underline">Workspace</a>
          <a href="/studio/templates" className="hover:underline">Designs / Templates</a>
          <a href="/studio/support" className="hover:underline">Customer Support</a>
          <a href="/studio/trash" className="hover:underline">Trash</a>
          <a href="/settings" className="hover:underline">User Account</a>
          <a href="/pricing" className="hover:underline">Subscription Plans</a>
        </nav>
      </aside>
      <section>
        {children}
      </section>
    </div>
  );
}


