export function Footer() {
  return (
    <footer className="border-t border-sage/20 bg-white/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary font-serif font-bold">
            <span className="text-xl">🌱</span>
            <span>Garden Planner</span>
          </div>
          <p className="text-sm text-gray-500">
            AI-powered companion planting · Personalized for your zone
          </p>
          <p className="text-xs text-gray-400">
            Powered by Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
