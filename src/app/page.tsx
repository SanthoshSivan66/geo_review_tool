"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, ScanLine, FileJson, Bot, MessageSquare, Zap, Globe, 
  Activity, ArrowLeft, Download, CheckCircle2, XCircle, FileType, 
  Hash, Image as ImageIcon, Link2, MonitorSmartphone, Target,
  AlertTriangle, ShieldAlert, AlertCircle, FileWarning, Key, ShieldCheck
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ====== TYPES ======

interface GEOResult {
  url: string;
  domain: string;
  timestamp: string;
  screenshot: string;
  scores: {
    overall: number;
    schemaQuality: number;
    aiBotAccess: number;
    contentStructure: number;
    conversationalReady: number;
    technicalSpeed: number;
    metaSocial: number;
  };
  schemaDetails: {
    typesFound: string[];
    totalSchemas: number;
    hasProduct: boolean;
    hasFAQ: boolean;
    hasBreadcrumb: boolean;
    hasOrganization: boolean;
    hasReview: boolean;
    richFieldCount: number;
  };
  robotsAnalysis: {
    allowsGoogleBot: boolean;
    allowsGPTBot: boolean;
    allowsPerplexityBot: boolean;
    allowsClaudeBot: boolean;
    hasLlmsTxt: boolean;
    hasSitemap: boolean;
  };
  aiAnalysis: {
    summary: string;
    designFeedback: string;
    uxScore: number;
    uxIssues: Array<{
      title: string;
      description: string;
      severity: string;
      category: string;
    }>;
    conversionIssues: Array<{
      title: string;
      description: string;
      severity: string;
      category: string;
    }>;
    recommendations: string[];
  };
}

// ====== HELPERS ======

function getScoreClass(score: number): string {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  if (score >= 30) return "poor";
  return "critical";
}

function getVerdict(score: number): { text: string; desc: string } {
  if (score >= 90) return { text: "Excellent!", desc: "Your store looks perfect to AI like ChatGPT. They will easily recommend you." };
  if (score >= 70) return { text: "Looking Good", desc: "Your store is doing well, but a few small tweaks could help AI find you even better." };
  if (score >= 50) return { text: "Needs Work", desc: "AI is having some trouble reading your store and might miss your products." };
  if (score >= 30) return { text: "Hard to Find", desc: "Right now, ChatGPT and other AI assistants cannot easily see your store." };
  return { text: "Needs Urgent Fix", desc: "Major issues are blocking AI assistants from seeing your store at all!" };
}

// ====== SCANNING STEPS ======

const SCAN_STEPS = [
  "Connecting to store...",
  "Capturing page snapshot...",
  "Extracting JSON-LD schema...",
  "Analyzing structured data richness...",
  "Checking robots.txt for AI bots...",
  "Evaluating content structure...",
  "Scanning meta & Open Graph tags...",
  "Running AI analysis engine...",
  "Generating GEO readiness report...",
];

// ====== MAIN PAGE ======

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GEOResult | null>(null);
  const [scanStep, setScanStep] = useState(0);

  // Animate scanning steps
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setScanStep((prev) => (prev + 1 < SCAN_STEPS.length ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  // Score Ring Animation inside component to avoid re-renders of the whole page
  const ScoreRing = ({ score }: { score: number }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const size = 220;
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;
    
    useEffect(() => {
      let frame: number;
      const duration = 1500;
      const start = performance.now();
      const animate = (time: number) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(score * eased));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, [score]);

    let strokeColor = "var(--accent-red)";
    if (score >= 90) strokeColor = "var(--accent-green)";
    else if (score >= 70) strokeColor = "var(--accent-cyan)";
    else if (score >= 50) strokeColor = "var(--accent-yellow)";
    else if (score >= 30) strokeColor = "var(--accent-orange)";

    return (
      <div className="score-ring-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="score-ring-bg"
            cx={size / 2} cy={size / 2} r={radius}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <circle
            className="score-ring-fill"
            cx={size / 2} cy={size / 2} r={radius}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="score-number">
          <span className="value" style={{ color: strokeColor }}>{animatedScore}</span>
          <span className="label">GEO Score</span>
        </div>
      </div>
    );
  };

  const handleScan = useCallback(async () => {
    if (!url.trim()) return;

    let scanUrl = url.trim();
    if (!scanUrl.startsWith("http://") && !scanUrl.startsWith("https://")) {
      scanUrl = "https://" + scanUrl;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setScanStep(0);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan failed. Please try again.");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // ====== LANDING VIEW ======
  if (!result && !loading) {
    return (
      <>
        <section className="hero">
          <div className="hero-badge">
            Check Your Store's AI Search Rank
          </div>
          <h1>
            Will ChatGPT recommend
            <br />
            <span className="gradient-text">your store?</span>
          </h1>
          <p className="hero-subtitle">
            Millions of people now ask ChatGPT and other AI assistants to find products for them. If your website isn't set up right, these smart assistants won't even know your store exists.
          </p>

          <div className="scan-input-container">
            <div className="scan-input-wrapper">
              <div className="scan-input-icon">
                <Search size={18} />
              </div>
              <input
                id="url-input"
                className="scan-input"
                type="url"
                placeholder="Enter your store URL (e.g., mystore.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
              />
              <button
                id="scan-button"
                className="scan-btn"
                onClick={handleScan}
                disabled={!url.trim()}
              >
                <ScanLine size={16} /> <span>Scan Now</span>
              </button>
            </div>
            <p className="scan-note">
              <ShieldCheck size={14} /> Free • No signup required • Results in ~30 seconds
            </p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FileJson size={20} />
              </div>
              <div className="feature-title">Store Details</div>
              <div className="feature-desc">
                We check if your website tells AI bots clearly about your prices, stock, and products.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Bot size={20} />
              </div>
              <div className="feature-title">AI Access</div>
              <div className="feature-desc">
                We check if your website is accidentally locking its doors and keeping AI bots out.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <MessageSquare size={20} />
              </div>
              <div className="feature-title">Clear Answers</div>
              <div className="feature-desc">
                We make sure your site has simple answers ready for any questions buyers ask the AI.
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ====== LOADING VIEW ======
  if (loading) {
    const progress = Math.min(((scanStep + 1) / SCAN_STEPS.length) * 100, 98);
    return (
      <div className="scanning-overlay">
        <div className="scanner-visual">
          <div className="scanner-ring" />
          <div className="scanner-ring" />
          <div className="scanner-core">
            <Activity size={32} />
          </div>
        </div>
        <div className="scanning-text">
          <div className="scanning-title">Scanning Store</div>
          <div className="scanning-step" key={scanStep}>
            {SCAN_STEPS[scanStep]}
          </div>
        </div>
        <div className="scanning-progress">
          <div
            className="scanning-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // ====== REPORT VIEW ======
  if (!result) return null;

  const verdict = getVerdict(result.scores.overall);
  const categories = [
    { key: "schemaQuality", name: "Product Details Setup", desc: "How clear your info is", icon: <FileJson size={18} />, score: result.scores.schemaQuality },
    { key: "aiBotAccess", name: "AI Access Allowed", desc: "Doors are open for bots", icon: <Bot size={18} />, score: result.scores.aiBotAccess },
    { key: "contentStructure", name: "Easy to Read Layout", desc: "How well bots read the page", icon: <FileType size={18} />, score: result.scores.contentStructure },
    { key: "conversationalReady", name: "Answers Questions", desc: "Ready for chat search", icon: <MessageSquare size={18} />, score: result.scores.conversationalReady },
    { key: "technicalSpeed", name: "Website Speed", desc: "How fast bots can load it", icon: <Zap size={18} />, score: result.scores.technicalSpeed },
    { key: "metaSocial", name: "Looking Professional", desc: "Titles and descriptions", icon: <Target size={18} />, score: result.scores.metaSocial },
  ];

  const allIssues = [
    ...(result.aiAnalysis.uxIssues || []),
    ...(result.aiAnalysis.conversionIssues || []),
  ];

  return (
    <>
      {/* Report Header */}
      <div className="report-header">
        <div className="report-domain-info">
          <div className="report-domain-icon">
            <Globe size={24} />
          </div>
          <div className="report-domain-text">
            <h2>{result.domain}</h2>
            <p>Scanned on {new Date(result.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
        <div className="report-actions">
          <button className="btn-outline" onClick={() => { setResult(null); setUrl(""); }}>
            <span className="btn-icon"><ArrowLeft size={16} /> New Scan</span>
          </button>
          <button className="btn-outline" onClick={() => window.print()}>
            <span className="btn-icon"><Download size={16} /> Export PDF</span>
          </button>
        </div>
      </div>

      {/* BENTO BOX GRID */}
      <div className="dashboard-bento">
        
        {/* Left Column: Big Score */}
        <div className="bento-card hero-score-card">
          <div className="score-hero-container">
            <ScoreRing score={result.scores.overall} />
            <div className={`score-verdict score-${getScoreClass(result.scores.overall)}`}>
              {verdict.text}
            </div>
            <p className="score-verdict-desc">{verdict.desc}</p>
          </div>
        </div>

        {/* Right Column: Category Mini Cards */}
        <div className="bento-card categories-container">
          {categories.map((cat) => {
            const cls = getScoreClass(cat.score);
            return (
              <div key={cat.key} className="category-mini-card">
                <div className="cat-header">
                  <div className="cat-icon-wrap">{cat.icon}</div>
                  <div className={`cat-score-val score-${cls}`}>{cat.score}</div>
                </div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-desc">{cat.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Strategy Brief */}
      <div className="dashboard-bento">
        <div className="bento-card ai-brief-card">
          <div className="ai-brief-header">
            <div className="ai-icon-large">
              <Bot size={24} />
            </div>
            <div>
              <div className="ai-brief-title">Summary of Your Store</div>
              <div className="ai-brief-sub">Written by our AI Assistant</div>
            </div>
          </div>
          <p className="ai-brief-text">{result.aiAnalysis.summary}</p>
          
          {result.aiAnalysis.designFeedback && (
            <div className="ai-brief-feedback">
              <div className="feedback-label">What We Noticed</div>
              <p className="feedback-text">{result.aiAnalysis.designFeedback}</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Modules Grid */}
      <div className="dashboard-bento">
        
        {/* Schema Status */}
        <div className="bento-card" style={{ gridColumn: "1 / -1" }}>
          <div className="bento-section-header">
            <div className="bento-title-group">
              <FileJson className="bento-icon" size={20} />
              <h3 className="bento-title">Hidden Code Settings</h3>
            </div>
            <span className="bento-count">{result.schemaDetails.totalSchemas} Pieces Found</span>
          </div>
          
          <div className="status-grid">
            {[
              { label: "Product", found: result.schemaDetails.hasProduct },
              { label: "FAQ", found: result.schemaDetails.hasFAQ },
              { label: "Breadcrumb", found: result.schemaDetails.hasBreadcrumb },
              { label: "Organization", found: result.schemaDetails.hasOrganization },
              { label: "Review", found: result.schemaDetails.hasReview },
            ].map((item) => (
              <div key={item.label} className="status-item">
                <div className="status-item-header">
                  <span className="status-label">{item.label}</span>
                  <div className={`status-icon ${item.found ? 'success' : 'error'}`}>
                    {item.found ? <CheckCircle2 size={16} color="var(--accent-green)"/> : <XCircle size={16} color="var(--text-muted)"/>}
                  </div>
                </div>
                <span className={`status-value ${item.found ? 'success' : 'error'}`}>
                  {item.found ? 'Structured' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
          
          {result.schemaDetails.typesFound.length > 0 && (
            <div className="issue-tag-container">
              {result.schemaDetails.typesFound.map((t: string) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* AI Bot Access */}
        <div className="bento-card" style={{ gridColumn: "1 / -1" }}>
          <div className="bento-section-header">
            <div className="bento-title-group">
              <Key className="bento-icon" size={20} />
              <h3 className="bento-title">Are AI Bots Allowed Inside?</h3>
            </div>
          </div>
          
          <div className="status-grid">
            {[
              { label: "GoogleBot", allowed: result.robotsAnalysis.allowsGoogleBot },
              { label: "GPTBot (OpenAI)", allowed: result.robotsAnalysis.allowsGPTBot },
              { label: "PerplexityBot", allowed: result.robotsAnalysis.allowsPerplexityBot },
              { label: "ClaudeBot", allowed: result.robotsAnalysis.allowsClaudeBot },
              { label: "llms.txt", allowed: result.robotsAnalysis.hasLlmsTxt },
              { label: "Sitemap", allowed: result.robotsAnalysis.hasSitemap },
            ].map((bot) => (
              <div key={bot.label} className="status-item">
                <div className="status-item-header">
                  <span className="status-label">{bot.label}</span>
                  <div className={`status-icon ${bot.allowed ? 'success' : 'error'}`}>
                    {bot.allowed ? <CheckCircle2 size={16} color="var(--accent-green)"/> : <XCircle size={16} color="var(--accent-red)"/>}
                  </div>
                </div>
                <span className={`status-value ${bot.allowed ? 'success' : 'error'}`}>
                  {bot.allowed ? 'Allowed' : 'Blocked / Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Issues & Recs */}
      <div className="dashboard-bento">
        {/* Issues List (Left/Top) */}
        {allIssues.length > 0 && (
          <div className="bento-card" style={{ gridColumn: "span 1" }}>
            <div className="bento-section-header">
              <div className="bento-title-group">
                <ShieldAlert className="bento-icon" size={20} />
                <h3 className="bento-title">Things to Fix</h3>
              </div>
              <span className="bento-count">{allIssues.length}</span>
            </div>
            
            <div className="issues-list">
              {allIssues.map((issue: any, i: number) => (
                <div key={i} className="issue-row">
                  <div className={`issue-indicator severity-${issue.severity}`} />
                  <div className="issue-content">
                    <div className="issue-header">
                      <span className="issue-title">{issue.title}</span>
                    </div>
                    <p className="issue-desc">{issue.description}</p>
                    <div className="issue-tag-container" style={{ marginTop: '0.5rem' }}>
                      <span className="tag">{issue.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations (Right/Bottom) */}
        {result.aiAnalysis.recommendations?.length > 0 && (
          <div className="bento-card" style={{ gridColumn: allIssues.length > 0 ? "span 1" : "1 / -1" }}>
            <div className="bento-section-header">
              <div className="bento-title-group">
                <Target className="bento-icon" size={20} />
                <h3 className="bento-title">How to Improve</h3>
              </div>
            </div>
            
            <div className="rec-list">
              {result.aiAnalysis.recommendations.map((rec: string, i: number) => (
                <div key={i} className="rec-row">
                  <div className="rec-number">{i + 1}</div>
                  <p className="rec-text">{rec}</p>
                </div>
              ))}
            </div>
            
            {result.screenshot && (
              <div className="screenshot-container">
                <div className="bento-section-header" style={{ padding: '1rem', marginBottom: 0, borderBottom: 'none' }}>
                  <div className="bento-title-group">
                    <MonitorSmartphone className="bento-icon" size={16} />
                    <span className="status-label">Captured View</span>
                  </div>
                </div>
                <img src={result.screenshot} alt={`Screenshot of ${result.domain}`} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
