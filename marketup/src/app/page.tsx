import DemoVideo from "@/components/DemoVideo";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="section-lg text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 pointer-events-none" />
        
        <div className="relative z-10 grid gap-8 animate-fade-in">
          <div className="mx-auto glass-glow rounded-2xl px-6 py-4 inline-flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-gradient font-medium">AI-powered marketing studio</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Create premium <span className="text-gradient">AI avatar videos</span><br />
            in under 5 minutes.
          </h1>
          
          <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            For cafes, restaurants, stores, and creators. Elegant, futuristic, simple.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" id="get-started">
            {session ? (
              <a href="/onboarding" className="btn-primary btn-lg px-8 py-4 text-lg font-semibold">
                Get started
              </a>
            ) : (
              <a href="/auth" className="btn-primary btn-lg px-8 py-4 text-lg font-semibold">
                Get started
              </a>
            )}
            <a href="/pricing" className="btn-outline btn-lg px-8 py-4 text-lg">
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="section">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Create professional marketing videos in just a few simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Write your script",
              description: "Write a short script or paste your product pitch. Our AI will optimize it for video."
            },
            {
              step: "02", 
              title: "Choose avatar & backgrounds",
              description: "Pick an avatar and set 2–4 backgrounds that match your brand and message."
            },
            {
              step: "03",
              title: "Add visual elements", 
              description: "Add product, device, or food images for visual moments that engage your audience."
            },
            {
              step: "04",
              title: "Export & share",
              description: "Export a video with subtle logo overlay and your contact info ready to share."
            }
          ].map((item, index) => (
            <div key={index} className="glass-elevated rounded-2xl p-8 text-center animate-scale-in" 
                 style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-xl">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-foreground-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className="section">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See it in <span className="text-gradient">action</span>
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Watch how easy it is to create professional marketing videos
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-elevated rounded-3xl p-4 animate-scale-in">
            <DemoVideo />
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="section bg-gradient-to-br from-accent/5 to-accent-2/5 rounded-3xl">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-12">
            Simple plans for creators and businesses. See full details on the pricing page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/pricing" className="btn-primary btn-lg px-8 py-4 text-lg font-semibold">
              See pricing
            </a>
            {session ? (
              <a href="/studio" className="btn-outline btn-lg px-8 py-4 text-lg">
                Start now
              </a>
            ) : (
              <a href="/auth" className="btn-outline btn-lg px-8 py-4 text-lg">
                Start now
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
