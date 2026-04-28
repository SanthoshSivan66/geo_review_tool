import React from 'react';

export const metadata = {
  title: 'Privacy Policy | GEO Review Tool',
  description: 'Privacy Policy and Data Handling for the GEO Review Shopify App.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-sm tracking-wide">LAST UPDATED: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-8 rounded-2xl p-8 md:p-12" style={{ background: 'var(--bg-1)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>1. Information We Collect</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            When you install the GEO Review Tool, we automatically access certain types of information from your Shopify account:
            Read access to Products and Themes, and basic store configuration (Store URL, Plan Name). We DO NOT collect personal identifiable information (PII) of your customers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>2. How We Use Your Information</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            The data collected is used strictly to provide the app's core functionality: analyzing product structured data (JSON-LD) and injecting missing SEO schema tags into your Shopify theme to improve Generative Engine Optimization.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>3. Data Retention and Deletion</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We retain your store data only for as long as the app is installed. Upon uninstallation, your data is automatically queued for deletion within 48 hours in accordance with Shopify's data privacy requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>4. GDPR & CCPA Compliance</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We are fully compliant with Shopify's mandatory privacy webhooks (customers/data_request, customers/redact, shop/redact). If a data request is initiated through your Shopify Admin, our systems process it automatically.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>5. Contact Us</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            For questions regarding this privacy policy or your data, please contact us via our Support page.
          </p>
        </section>
      </div>
    </div>
  );
}
