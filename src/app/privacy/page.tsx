import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Planters Blueprint — how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://www.plantersblueprint.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-mint/20">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-primary text-sm font-medium hover:underline">
            ← Back to Planters Blueprint
          </Link>
        </div>

        <div className="card prose prose-sm max-w-none">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-8">Last updated: March 6, 2026</p>

          <p className="text-gray-700">
            Planters Blueprint (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, and share information
            about you when you use our garden planning service at plantersblueprint.com (the &ldquo;Service&rdquo;).
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">1. Information We Collect</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">Account Information</h3>
          <p className="text-gray-700">
            When you create an account, we collect your name, email address, and a hashed password
            (if you register with email). If you sign in via Google or Facebook, we receive your name,
            email address, and profile picture from those providers — we do not receive your social media
            password.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">Garden & Preference Data</h3>
          <p className="text-gray-700">
            We store the garden plans you create, including dimensions, plant selections, and layout designs.
            We also store optional gardening preferences you provide (USDA zone, soil type, experience level,
            etc.) to personalize your experience.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">Usage Data</h3>
          <p className="text-gray-700">
            We automatically collect standard log data when you use the Service, including your IP address,
            browser type, pages visited, and timestamps. This data is used to operate and improve the Service.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">Payment Information</h3>
          <p className="text-gray-700">
            If you subscribe to a paid plan, payment is processed by Stripe, Inc. We do not store your
            credit card number or payment details on our servers. Stripe&apos;s privacy policy is available
            at stripe.com/privacy.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700">
            <li>To provide, operate, and improve the Service</li>
            <li>To personalize your garden wizard experience with saved preferences</li>
            <li>To process subscription payments and manage your account</li>
            <li>To send transactional emails (account confirmation, password reset) — we do not send marketing emails without your explicit consent</li>
            <li>To comply with legal obligations</li>
          </ul>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">3. AI-Generated Content</h2>
          <p className="text-gray-700">
            Garden designs are generated using the Anthropic Claude API. Your garden specifications
            (dimensions, plant choices, zone, etc.) are sent to Anthropic to generate a layout.
            We do not send personally identifiable information (such as your name or email) to Anthropic.
            Anthropic&apos;s privacy policy is available at anthropic.com/privacy.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">4. How We Share Your Information</h2>
          <p className="text-gray-700">We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700 mt-3">
            <li><strong>Service providers</strong>: Neon (database hosting), Vercel (hosting), Stripe (payments), Anthropic (AI), Google and Facebook (OAuth sign-in)</li>
            <li><strong>Legal requirements</strong>: If required by law, court order, or to protect our legal rights</li>
            <li><strong>Business transfers</strong>: In connection with a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction</li>
          </ul>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">5. Cookies & Local Storage</h2>
          <p className="text-gray-700">
            We use session cookies for authentication (managed by NextAuth.js). We use your browser&apos;s
            sessionStorage to temporarily hold your garden design while navigating between pages — this
            data is cleared when you close the tab. We do not use third-party advertising cookies.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">6. Data Retention</h2>
          <p className="text-gray-700">
            We retain your account and garden data for as long as your account is active. If you delete
            your account, we will delete your personal data within 30 days, except where retention is
            required by law.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">7. Your Rights</h2>
          <p className="text-gray-700">Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700 mt-3">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li>Object to or restrict certain processing</li>
            <li>Data portability</li>
          </ul>
          <p className="text-gray-700 mt-3">
            To exercise any of these rights, contact us at the email below. We will respond within 30 days.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">8. Children&apos;s Privacy</h2>
          <p className="text-gray-700">
            The Service is not directed to children under 13. We do not knowingly collect personal
            information from children under 13. If you believe a child has provided us with personal
            information, please contact us and we will delete it promptly.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">9. Security</h2>
          <p className="text-gray-700">
            We use industry-standard security practices including bcrypt password hashing, HTTPS
            encryption, and JWT-based sessions. No method of transmission over the internet is 100%
            secure, and we cannot guarantee absolute security.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">10. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by posting the new policy on this page with an updated date. Your continued use
            of the Service after changes constitutes acceptance of the updated policy.
          </p>

          <hr className="border-sage/30 my-8" />

          <h2 className="text-xl font-serif font-semibold text-primary mt-8 mb-3">11. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy or your data, please contact us at:
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Planters Blueprint</strong><br />
            Email: <a href="mailto:privacy@plantersblueprint.com" className="text-primary hover:underline">privacy@plantersblueprint.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
