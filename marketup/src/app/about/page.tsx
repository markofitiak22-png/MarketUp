import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <Container>
      {/* Hero */}
      <Section size="lg">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mx-auto glass rounded-2xl px-4 py-2 inline-flex items-center gap-2 text-sm mb-4">
            <span className="text-gradient font-medium">About MarketUp</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            We blend <span className="text-gradient">AI</span> and design to make marketing effortless
          </h1>
          <p className="text-foreground-muted mt-4">
            MarketUp helps teams create premium, on-brand avatar videos in minutes — no editing skills required.
          </p>
        </div>
      </Section>

      {/* Stats */}
      <Section size="sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { k: "Countries", v: "24+" },
            { k: "Avg. render", v: "< 3m" },
            { k: "NPS", v: "68" },
            { k: "Uptime", v: "99.95%" },
          ].map((s, i) => (
            <Card key={i} className="p-5 text-center">
              <div className="text-2xl font-semibold">{s.v}</div>
              <div className="text-xs text-foreground-muted mt-1">{s.k}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Mission / Vision / Values */}
      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Mission</h3>
            <p className="text-sm text-foreground-muted">Empower teams to produce persuasive, beautiful videos with zero editing friction.</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Vision</h3>
            <p className="text-sm text-foreground-muted">A modern, elegant studio for every business — from cafés to global brands.</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Values</h3>
            <ul className="text-sm text-foreground-muted grid gap-2">
              <li>• Simplicity over complexity</li>
              <li>• Premium quality by default</li>
              <li>• Privacy, security, and fairness</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <Card variant="elevated" className="p-6">
          <h2 className="text-lg font-semibold mb-4">Our story</h2>
          <ol className="relative border-l border-[var(--border)] ml-3 grid gap-6">
            {[
              { t: "2025 Q3", d: "Private beta with early partners." },
              { t: "2025 Q4", d: "Public launch with Studio and referral program." },
              { t: "2026+", d: "Marketplace for brand templates and pro avatars." },
            ].map((e, i) => (
              <li key={i} className="ml-4">
                <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-[var(--accent)]" />
                <div className="text-sm text-foreground-muted">{e.t}</div>
                <div className="font-medium">{e.d}</div>
              </li>
            ))}
          </ol>
        </Card>
      </Section>

      {/* CTA */}
      <Section size="lg">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Build your first video today</h2>
          <p className="text-foreground-muted mt-2">Simple pricing for teams and creators. Start in minutes.</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <a href="/onboarding" className="btn-primary btn-lg">Get started</a>
            <a href="/pricing" className="btn-outline btn-lg">See pricing</a>
          </div>
        </div>
      </Section>
    </Container>
  );
}


