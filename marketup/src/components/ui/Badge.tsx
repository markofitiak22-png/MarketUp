export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className="glass rounded-full px-3 py-1 text-xs text-white/85">{children}</span>;
}


