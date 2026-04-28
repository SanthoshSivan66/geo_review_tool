import React from 'react';

export const metadata = {
  title: 'Terms of Service | GEO Review Tool',
  description: 'Terms of Service for using the GEO Review Shopify App.',
};

export default function TermsOfService() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-meta">LAST UPDATED: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="legal-card">
        <section className="legal-section">
          <h2 className="legal-section-title">1. Acceptance of Terms</h2>
          <p className="legal-text">
            By installing and using the GEO Review Tool on your Shopify store, you agree to be bound by these Terms of Service. If you do not agree, please uninstall the application immediately.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">2. Description of Service</h2>
          <p className="legal-text">
            GEO Review Tool provides automated Generative Engine Optimization (GEO) scanning and structured data injection for Shopify merchants. We do not guarantee specific rankings or inclusion in AI chatbot responses (e.g., ChatGPT, Gemini).
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">3. Billing and Subscriptions</h2>
          <p className="legal-text">
            Certain features require a paid subscription. All billing is handled securely through Shopify's native Billing API. You may cancel your subscription at any time by uninstalling the app or modifying your plan within the app dashboard.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">4. Limitation of Liability</h2>
          <p className="legal-text">
            The GEO Review Tool modifies your theme's structured data. While we use Shopify's safe Theme App Extensions, we are not liable for any disruptions to your storefront, loss of traffic, or third-party theme conflicts.
          </p>
        </section>
      </div>
    </div>
  );
}
