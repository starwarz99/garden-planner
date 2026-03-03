import { auth } from "@/auth";
import { PricingCards } from "@/components/PricingCards";
import Link from "next/link";

export const metadata = { title: "Pricing — Garden Planner" };

export default async function PricingPage() {
  const session = await auth();
  const currentPlan = (session?.user as { plan?: string } | null)?.plan ?? "seedling";

  return (
    <div className="min-h-screen bg-mint/20">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-3">
            Choose your plan
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Start free and upgrade when you&apos;re ready to unlock more gardens, richer tools, and your full care calendar.
          </p>
        </div>

        <PricingCards currentPlan={currentPlan} />

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800 text-center">Common questions</h2>
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel from the billing portal at any time. You keep your plan until the end of the billing period, then drop back to Seedling.",
            },
            {
              q: "What happens to my saved gardens if I downgrade?",
              a: "Your existing gardens stay safe — you just can't create new ones beyond the Seedling limit until you upgrade again.",
            },
            {
              q: "Is there a free trial?",
              a: "The Seedling plan is free forever, so you can explore the core features with no time limit or credit card required.",
            },
            {
              q: "Can I switch between Grower and Harvest?",
              a: "Absolutely. Use the billing portal to upgrade or downgrade at any time. Proration is handled automatically by Stripe.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="card">
              <div className="font-semibold text-gray-800 mb-1">{q}</div>
              <p className="text-sm text-gray-600">{a}</p>
            </div>
          ))}
        </div>

        {!session?.user && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Ready to start? Create your free account in seconds.</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-lg transition-all"
            >
              🌱 Get started free
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
