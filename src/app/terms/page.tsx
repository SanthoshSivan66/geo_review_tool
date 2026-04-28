import React from 'react';

export const metadata = {
  title: 'Terms of Service | GEO Review Tool',
  description: 'Terms of Service for using the GEO Review Shopify App.',
};

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-sm tracking-wide">LAST UPDATED: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-8 rounded-2xl p-8 md:p-12" style={{ background: 'var(--bg-1)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            By installing and using the GEO Review Tool on your Shopify store, you agree to be bound by these Terms of Service. If you do not agree, please uninstall the application immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>2. Description of Service</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            GEO Review Tool provides automated Generative Engine Optimization (GEO) scanning and structured data injection for Shopify merchants. We do not guarantee specific rankings or inclusion in AI chatbot responses (e.g., ChatGPT, Gemini).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>3. Billing and Subscriptions</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Certain features require a paid subscription. All billing is handled securely through Shopify's native Billing API. You may cancel your subscription at any time by uninstalling the app or modifying your plan within the app dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>4. Limitation of Liability</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            The GEO Review Tool modifies your theme's structured data. While we use Shopify's safe Theme App Extensions, we are not liable for any disruptions to your storefront, loss of traffic, or third-party theme conflicts.
          </p>
        </section>
      </div>
    </div>
  );
}
