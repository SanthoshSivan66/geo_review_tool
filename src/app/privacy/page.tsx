import React from 'react';

export const metadata = {
  title: 'Privacy Policy | GEO Review Tool',
  description: 'Privacy Policy and Data Handling for the GEO Review Shopify App.',
};

export default function PrivacyPolicy() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-meta">LAST UPDATED: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="legal-card">
        <section className="legal-section">
          <h2 className="legal-section-title">1. Information We Collect</h2>
          <p className="legal-text">
            When you install the GEO Review Tool, we automatically access certain types of information from your Shopify account:
            Read access to Products and Themes, and basic store configuration (Store URL, Plan Name). We DO NOT collect personal identifiable information (PII) of your customers.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">2. How We Use Your Information</h2>
          <p className="legal-text">
            The data collected is used strictly to provide the app's core functionality: analyzing product structured data (JSON-LD) and injecting missing SEO schema tags into your Shopify theme to improve Generative Engine Optimization.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">3. Data Retention and Deletion</h2>
          <p className="legal-text">
            We retain your store data only for as long as the app is installed. Upon uninstallation, your data is automatically queued for deletion within 48 hours in accordance with Shopify's data privacy requirements.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">4. GDPR & CCPA Compliance</h2>
          <p className="legal-text">
            We are fully compliant with Shopify's mandatory privacy webhooks (customers/data_request, customers/redact, shop/redact). If a data request is initiated through your Shopify Admin, our systems process it automatically.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">5. Contact Us</h2>
          <p className="legal-text">
            For questions regarding this privacy policy or your data, please contact us via our Support page.
          </p>
        </section>
      </div>
    </div>
  );
}
