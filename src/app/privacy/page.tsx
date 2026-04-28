import React from 'react';

export const metadata = {
  title: 'Privacy Policy | GEO Review Tool',
  description: 'Privacy Policy and Data Handling for the GEO Review Shopify App.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p className="text-zinc-600 leading-relaxed">
            When you install the GEO Review Tool, we automatically access certain types of information from your Shopify account:
            Read access to Products and Themes, and basic store configuration (Store URL, Plan Name). We DO NOT collect personal identifiable information (PII) of your customers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-zinc-600 leading-relaxed">
            The data collected is used strictly to provide the app's core functionality: analyzing product structured data (JSON-LD) and injecting missing SEO schema tags into your Shopify theme to improve Generative Engine Optimization.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Data Retention and Deletion</h2>
          <p className="text-zinc-600 leading-relaxed">
            We retain your store data only for as long as the app is installed. Upon uninstallation, your data is automatically queued for deletion within 48 hours in accordance with Shopify's data privacy requirements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. GDPR & CCPA Compliance</h2>
          <p className="text-zinc-600 leading-relaxed">
            We are fully compliant with Shopify's mandatory privacy webhooks (customers/data_request, customers/redact, shop/redact). If a data request is initiated through your Shopify Admin, our systems process it automatically.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Contact Us</h2>
          <p className="text-zinc-600 leading-relaxed">
            For questions regarding this privacy policy or your data, please contact us via our Support page.
          </p>
        </section>
      </div>
    </div>
  );
}
