import React from 'react';
import { Mail, MessageCircle, FileText } from 'lucide-react';

export const metadata = {
  title: 'Support | GEO Review Tool',
  description: 'Get help and support for the GEO Review Shopify App.',
};

export default function SupportPage() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <h1 className="legal-title">App Support</h1>
        <p className="legal-text">
          Need help configuring the GEO AI Injector? We're here to help you optimize your store for Generative AI.
        </p>
      </div>
      
      <div className="support-grid">
        <div className="support-card">
          <div className="support-icon blue">
            <Mail size={24} />
          </div>
          <h3 className="legal-section-title">Email Support</h3>
          <p className="legal-text" style={{ fontSize: '0.9rem' }}>
            Reach out to our technical team for billing, bug reports, or feature requests.
          </p>
          <a href="mailto:support@georeviewtool.com" className="support-link blue">
            support@georeviewtool.com
          </a>
        </div>

        <div className="support-card">
          <div className="support-icon green">
            <FileText size={24} />
          </div>
          <h3 className="legal-section-title">Documentation</h3>
          <p className="legal-text" style={{ fontSize: '0.9rem' }}>
            Read our step-by-step guides on enabling the Theme App Extension.
          </p>
          <a href="/docs" className="support-link green">
            View Guide
          </a>
        </div>
      </div>
    </div>
  );
}
