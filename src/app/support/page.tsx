import React from 'react';
import { Mail, MessageCircle, FileText } from 'lucide-react';

export const metadata = {
  title: 'Support | GEO Review Tool',
  description: 'Get help and support for the GEO Review Shopify App.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">App Support</h1>
          <p className="text-lg text-zinc-600 max-w-xl mx-auto">
            Need help configuring the GEO AI Injector? We're here to help you optimize your store for Generative AI.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Email Support</h3>
            <p className="text-zinc-500 text-sm">
              Reach out to our technical team for billing, bug reports, or feature requests.
            </p>
            <a href="mailto:support@georeviewtool.com" className="inline-block mt-4 font-medium text-blue-600 hover:text-blue-700">
              support@georeviewtool.com
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Documentation</h3>
            <p className="text-zinc-500 text-sm">
              Read our step-by-step guides on enabling the Theme App Extension.
            </p>
            <a href="/docs" className="inline-block mt-4 font-medium text-emerald-600 hover:text-emerald-700">
              View Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
