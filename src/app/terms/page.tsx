import React from 'react';

export const metadata = {
  title: 'Terms of Service | GEO Review Tool',
  description: 'Terms of Service for using the GEO Review Shopify App.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-zinc-600 leading-relaxed">
            By installing and using the GEO Review Tool on your Shopify store, you agree to be bound by these Terms of Service. If you do not agree, please uninstall the application immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Description of Service</h2>
          <p className="text-zinc-600 leading-relaxed">
            GEO Review Tool provides automated Generative Engine Optimization (GEO) scanning and structured data injection for Shopify merchants. We do not guarantee specific rankings or inclusion in AI chatbot responses (e.g., ChatGPT, Gemini).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Billing and Subscriptions</h2>
          <p className="text-zinc-600 leading-relaxed">
            Certain features require a paid subscription. All billing is handled securely through Shopify's native Billing API. You may cancel your subscription at any time by uninstalling the app or modifying your plan within the app dashboard.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
          <p className="text-zinc-600 leading-relaxed">
            The GEO Review Tool modifies your theme's structured data. While we use Shopify's safe Theme App Extensions, we are not liable for any disruptions to your storefront, loss of traffic, or third-party theme conflicts.
          </p>
        </section>
      </div>
    </div>
  );
}
