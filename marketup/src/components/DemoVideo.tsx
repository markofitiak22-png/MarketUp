export default function DemoVideo() {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-border-strong">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-2/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      </div>

      {/* Play button and content */}
      <div className="absolute inset-0 grid place-items-center text-white z-10">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Enhanced play button */}
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-2 grid place-items-center shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
              <div className="ml-1 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[20px] border-l-white" />
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Enhanced text */}
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Demo Preview</p>
            <p className="text-sm opacity-80 max-w-xs">
              See how easy it is to create professional AI avatar videos
            </p>
          </div>
        </div>
      </div>

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}


