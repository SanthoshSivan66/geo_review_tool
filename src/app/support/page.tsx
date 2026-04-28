import React from 'react';
import { Mail, MessageCircle, FileText } from 'lucide-react';

export const metadata = {
  title: 'Support | GEO Review Tool',
  description: 'Get help and support for the GEO Review Shopify App.',
};

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>App Support</h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Need help configuring the GEO AI Injector? We're here to help you optimize your store for Generative AI.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl text-center space-y-4 transition-all" style={{ background: 'var(--bg-1)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-glow-sm)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: 'var(--bg-pulse)', color: 'var(--accent-cyan)' }}>
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Email Support</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Reach out to our technical team for billing, bug reports, or feature requests.
          </p>
          <a href="mailto:support@georeviewtool.com" className="inline-block mt-4 font-medium transition-colors" style={{ color: 'var(--accent-cyan)' }}>
            support@georeviewtool.com
          </a>
        </div>

        <div className="p-8 rounded-2xl text-center space-y-4 transition-all" style={{ background: 'var(--bg-1)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-glow-sm)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: 'var(--bg-pulse)', color: 'var(--accent-green)' }}>
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Documentation</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Read our step-by-step guides on enabling the Theme App Extension.
          </p>
          <a href="/docs" className="inline-block mt-4 font-medium transition-colors" style={{ color: 'var(--accent-green)' }}>
            View Guide
          </a>
        </div>
      </div>
    </div>
  );
}
