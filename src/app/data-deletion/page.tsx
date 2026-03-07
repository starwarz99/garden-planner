export const metadata = {
  title: "Data Deletion Instructions — Planters Blueprint",
  description: "How to request deletion of your Planters Blueprint data.",
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-mint/20 flex items-center justify-center px-4">
      <div className="card max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🗑️</div>
          <h1 className="text-2xl font-serif font-bold text-primary">Data Deletion Instructions</h1>
        </div>

        <div className="space-y-4 text-gray-700 text-sm">
          <p>
            If you signed in to Planters Blueprint using Facebook and would like your data deleted,
            follow these steps:
          </p>

          <ol className="list-decimal list-outside pl-5 space-y-3">
            <li>
              <strong>Sign in</strong> to your Planters Blueprint account at{" "}
              <span className="text-primary font-medium">plantersblueprint.com</span>.
            </li>
            <li>
              <strong>Go to your account settings</strong> by clicking &ldquo;My Account&rdquo; in the navigation bar.
            </li>
            <li>
              <strong>Request deletion</strong> by emailing us at{" "}
              <a
                href="mailto:privacy@plantersblueprint.com"
                className="text-primary hover:underline font-medium"
              >
                privacy@plantersblueprint.com
              </a>{" "}
              with the subject line <em>&ldquo;Delete my account&rdquo;</em> and the email address
              associated with your account.
            </li>
            <li>
              <strong>Confirmation</strong> — we will delete all your personal data (account, garden plans,
              and preferences) within <strong>30 days</strong> and send you a confirmation email.
            </li>
          </ol>

          <div className="mt-6 p-4 bg-mint/40 rounded-xl text-xs text-gray-600">
            <p>
              <strong>What gets deleted:</strong> Your name, email address, garden plans, gardening
              preferences, and any other personal data associated with your account.
            </p>
            <p className="mt-2">
              <strong>What we may retain:</strong> Anonymized, aggregated usage statistics that cannot
              be linked back to you, and records required by law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
