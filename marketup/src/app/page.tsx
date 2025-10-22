import DemoVideo from "@/components/DemoVideo";
// import LanguageSelector from "@/components/LanguageSelector";
// import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <>
      
      {/* Hero Section */}
      <section className="h-[60vh] flex items-center relative overflow-hidden w-full">
        {/* Full-width background image */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent-2/6 to-accent/8" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        
        {/* Content overlaid on the background */}
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8 pr-96">
            
              
              {/* Main heading */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
                  Create premium <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">AI avatar videos</span><br />
                  in under 5 minutes.
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-2xl leading-relaxed font-light">
                  For cafes, restaurants, stores, and creators. <span className="text-accent font-medium">Elegant, futuristic, simple.</span>
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                {session ? (
                  <a href="/onboarding" className="group relative btn-primary btn-lg px-10 py-5 text-lg font-bold overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get started
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ) : (
                  <a href="/auth" className="group relative btn-primary btn-lg px-10 py-5 text-lg font-bold overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get started
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                )}
                <a href="/pricing" className="group btn-outline btn-lg px-10 py-5 text-lg font-semibold hover:bg-accent/5 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    See pricing
                  </span>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start gap-8 pt-8">
                <div className="flex items-center gap-2 text-sm text-foreground-muted">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground-muted">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>5-minute setup</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground-muted">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>HD quality videos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* How it works Section */}
        <section className="section relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10">
          <div className="text-center mb-24">

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              How it <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">works</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
              Create professional marketing videos in just <span className="text-accent font-medium">4 simple steps</span>
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Step 01 - Left */}
            <div className="flex justify-start">
              <div className="group">
                <div className="glass-elevated rounded-3xl p-10 w-96 h-96 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:border-accent/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        01
                      </div>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-accent to-transparent" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Write your script</h3>
                    <p className="text-foreground-muted leading-relaxed text-lg">
                      Write a short script or paste your product pitch. Our AI will optimize it for video.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 02 - Right */}
            <div className="flex justify-end -mt-40">
              <div className="group">
                <div className="glass-elevated rounded-3xl p-10 w-96 h-96 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent-2/20 group-hover:border-accent-2/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        02
                      </div>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-accent-2 to-transparent" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Choose avatar & backgrounds</h3>
                    <p className="text-foreground-muted leading-relaxed text-lg">
                      Pick an avatar and set 2-4 backgrounds that match your brand and message.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 03 - Left */}
            <div className="flex justify-start -mt-32">
              <div className="group">
                <div className="glass-elevated rounded-3xl p-10 w-96 h-96 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:border-accent/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        03
                      </div>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-accent to-transparent" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Add visual elements</h3>
                    <p className="text-foreground-muted leading-relaxed text-lg">
                      Add product, device, or food images for visual moments that engage your audience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 04 - Right */}
            <div className="flex justify-end -mt-40">
              <div className="group">
                <div className="glass-elevated rounded-3xl p-10 w-96 h-96 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent-2/20 group-hover:border-accent-2/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        04
                      </div>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-accent-2 to-transparent" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Export & share</h3>
                    <p className="text-foreground-muted leading-relaxed text-lg">
                      Export a video with subtle logo overlay and your contact info ready to share.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="section relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/3" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              See it in <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">action</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
              Watch how easy it is to create professional marketing videos
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="glass-elevated rounded-3xl p-6 animate-scale-in shadow-2xl shadow-accent/10">
              <DemoVideo />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0  from-accent/8 via-accent-2/5 to-purple-500/5 rounded-3xl" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-accent/5 to-transparent" />
        
        <div className="relative z-10 text-center">
         
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight">
            Simple <span className="text-gradient bg-gradient-to-r from-white via-accent-2 to-purple-300 bg-clip-text text-transparent">pricing</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
            Simple plans for creators and businesses. See full details on the pricing page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="/pricing" className="group relative bg-white text-black text-accent px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                See pricing
              </span>
            </a>
            {session ? (
              <a href="/studio" className="group bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start now
                </span>
              </a>
            ) : (
              <a href="/auth" className="group bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start now
                </span>
              </a>
            )}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
