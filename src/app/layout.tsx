import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Review Tool — AI Search Readiness Scanner for Shopify Stores",
  description:
    "Scan your Shopify store and get a GEO Readiness Score. Find out if AI search engines like ChatGPT, Perplexity, and Gemini can discover, understand, and recommend your products.",
  keywords:
    "GEO, generative engine optimization, AI SEO, Shopify SEO, AI search, schema markup, JSON-LD, ChatGPT SEO, Perplexity optimization",
  openGraph: {
    title: "GEO Review Tool — Is Your Store Ready for AI Search?",
    description:
      "Free scanner that checks your Shopify store's readiness for AI-powered search engines. Get your GEO Score in 60 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PostHog Analytics Placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])}},window.posthog||function(){var t=window.posthog=[];return t.push=function(){t.push.apply(t,arguments)},t}();
              posthog.init('phc_YOUR_PROJECT_API_KEY', {
                  api_host:'https://us.i.posthog.com',
                  person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
              })
            `,
          }}
        />
      </head>
      <body>
        <div className="grid-bg" />
        <div className="app-container">
          <header className="app-header">
            <div className="header-inner">
              <a href="/" className="logo">
                <div className="logo-icon">G</div>
                <div className="logo-text">
                  GEO <span>Review Tool</span>
                </div>
              </a>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="header-badge">v1.0 — Free Scanner</div>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
