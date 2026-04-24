import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const domain = parsedUrl.hostname;
    const origin = parsedUrl.origin;

    // ========================================
    // 1. FETCH PAGE HTML (with retry & rotation)
    // ========================================

    const startTime = Date.now();

    const userAgents = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    ];

    let html = "";
    let responseTime = 0;
    let fetchSuccess = false;

    for (const ua of userAgents) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": ua,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
          },
          signal: AbortSignal.timeout(15000),
          redirect: "follow",
        });

        responseTime = Date.now() - startTime;
        const body = await res.text();

        // Accept the response if it has meaningful HTML, even on non-200 status
        if (body.length > 500 && (body.includes("<html") || body.includes("<head") || body.includes("<body"))) {
          html = body;
          fetchSuccess = true;
          break;
        }

        // If status is OK but body is small, still accept it
        if (res.ok) {
          html = body;
          fetchSuccess = true;
          break;
        }
      } catch {
        // Try next UA
        continue;
      }
    }

    if (!fetchSuccess || !html) {
      // Last resort: try Google's web cache
      try {
        const cacheRes = await fetch(`https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`, {
          headers: { "User-Agent": userAgents[0] },
          signal: AbortSignal.timeout(10000),
          redirect: "follow",
        });
        if (cacheRes.ok) {
          const cacheBody = await cacheRes.text();
          if (cacheBody.length > 500) {
            html = cacheBody;
            responseTime = Date.now() - startTime;
            fetchSuccess = true;
          }
        }
      } catch {
        /* cache unavailable */
      }
    }

    if (!fetchSuccess || !html) {
      return NextResponse.json(
        { error: "Could not reach the website. The site may be blocking automated access. Please try a different URL." },
        { status: 400 }
      );
    }
    const $ = cheerio.load(html);

    // ========================================
    // 2. EXTRACT JSON-LD SCHEMAS
    // ========================================

    const schemaData: any[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const parsed = JSON.parse($(el).html() || "");
        if (Array.isArray(parsed)) {
          schemaData.push(...parsed);
        } else if (parsed["@graph"]) {
          schemaData.push(...parsed["@graph"]);
        } else {
          schemaData.push(parsed);
        }
      } catch {
        /* skip invalid */
      }
    });

    // Analyze schemas
    const schemaTypes = schemaData
      .map((s: any) => s["@type"])
      .filter(Boolean)
      .flat();
    const uniqueTypes = [...new Set(schemaTypes)] as string[];

    const hasProduct = uniqueTypes.some(
      (t) =>
        t === "Product" ||
        t === "ProductGroup" ||
        t === "IndividualProduct"
    );
    const hasFAQ = uniqueTypes.includes("FAQPage");
    const hasBreadcrumb = uniqueTypes.includes("BreadcrumbList");
    const hasOrganization =
      uniqueTypes.includes("Organization") ||
      uniqueTypes.includes("LocalBusiness");
    const hasReview =
      uniqueTypes.includes("Review") ||
      uniqueTypes.includes("AggregateRating");

    // Count rich fields in Product schemas
    const richProductFields = [
      "material",
      "warranty",
      "returnPolicy",
      "brand",
      "sku",
      "gtin",
      "mpn",
      "color",
      "size",
      "weight",
      "aggregateRating",
      "review",
      "offers",
      "image",
      "description",
      "category",
      "manufacturer",
      "model",
      "shippingDetails",
      "hasMerchantReturnPolicy",
    ];

    let richFieldCount = 0;
    schemaData.forEach((s: any) => {
      if (s["@type"] === "Product" || s["@type"] === "ProductGroup") {
        richProductFields.forEach((field) => {
          if (s[field]) richFieldCount++;
        });
      }
    });

    // ========================================
    // 3. EXTRACT SEO & CONTENT DATA
    // ========================================

    const title = $("title").text() || "";
    const metaDesc =
      $('meta[name="description"]').attr("content") || "";
    const h1Count = $("h1").length;
    const h1Text = $("h1").first().text().substring(0, 120) || "";
    const h2Count = $("h2").length;
    const h3Count = $("h3").length;
    const imgCount = $("img").length;
    const imgsWithoutAlt = $("img:not([alt]), img[alt='']").length;
    const linkCount = $("a").length;
    const canonicalLink =
      $('link[rel="canonical"]').attr("href") || "";
    const viewport =
      $('meta[name="viewport"]').attr("content") || "";
    const ogTitle =
      $('meta[property="og:title"]').attr("content") || "";
    const ogDesc =
      $('meta[property="og:description"]').attr("content") || "";
    const ogImage =
      $('meta[property="og:image"]').attr("content") || "";
    const lang = $("html").attr("lang") || "";
    const favicon =
      $('link[rel="icon"], link[rel="shortcut icon"]').attr("href") || "";

    // Visible text for AI (strip scripts/styles, get body text)
    $("script, style, noscript").remove();
    const pageText = $("body").text().replace(/\s+/g, " ").trim().substring(0, 2000);

    const pageData = {
      title,
      titleLength: title.length,
      metaDesc,
      metaDescLength: metaDesc.length,
      h1Count,
      h1Text,
      h2Count,
      h3Count,
      imgCount,
      imgsWithoutAlt,
      linkCount,
      canonicalLink,
      viewport,
      ogTitle,
      ogDesc,
      ogImage,
      lang,
      favicon,
      formCount: $("form").length,
      buttonCount: $("button, [role='button'], input[type='submit']").length,
      ariaLabelCount: $("[aria-label]").length,
      pageText,
    };

    // Estimate speed score from fetch response time
    const perfMetrics = {
      responseTime,
      // Estimate FCP from response time (no real browser, so approximate)
      fcp: responseTime + 200,
      loadComplete: responseTime + 500,
    };

    // ========================================
    // 4. CHECK ROBOTS.TXT & LLMS.TXT
    // ========================================

    let robotsText = "";
    try {
      const robotsRes = await fetch(`${origin}/robots.txt`, {
        signal: AbortSignal.timeout(5000),
      });
      if (robotsRes.ok) robotsText = await robotsRes.text();
    } catch {
      /* no robots.txt */
    }

    let hasLlmsTxt = false;
    try {
      const llmsRes = await fetch(`${origin}/llms.txt`, {
        signal: AbortSignal.timeout(5000),
      });
      hasLlmsTxt = llmsRes.ok;
    } catch {
      /* no llms.txt */
    }

    let hasSitemap = false;
    try {
      const sitemapRes = await fetch(`${origin}/sitemap.xml`, {
        signal: AbortSignal.timeout(5000),
      });
      hasSitemap = sitemapRes.ok;
    } catch {
      /* no sitemap */
    }

    const isBlockedBot = (botName: string) => {
      const regex = new RegExp(
        `user-agent:\\s*${botName}[\\s\\S]*?disallow:\\s*/`,
        "i"
      );
      return regex.test(robotsText);
    };

    const robotsAnalysis = {
      allowsGoogleBot: !isBlockedBot("Googlebot"),
      allowsGPTBot: !isBlockedBot("GPTBot"),
      allowsPerplexityBot: !isBlockedBot("PerplexityBot"),
      allowsClaudeBot: !isBlockedBot("ClaudeBot|anthropic-ai|Claude-Web"),
      hasLlmsTxt,
      hasSitemap,
    };

    // ========================================
    // 5. CALCULATE GEO SCORES
    // ========================================

    // Schema Quality (0-100)
    let schemaQuality = 0;
    if (schemaData.length > 0) schemaQuality += 20;
    if (hasProduct) schemaQuality += 20;
    if (hasFAQ) schemaQuality += 15;
    if (hasBreadcrumb) schemaQuality += 10;
    if (hasOrganization) schemaQuality += 10;
    if (hasReview) schemaQuality += 10;
    schemaQuality += Math.min(15, richFieldCount * 2);
    schemaQuality = Math.min(100, schemaQuality);

    // AI Bot Access (0-100)
    let aiBotAccess = 0;
    if (robotsAnalysis.allowsGoogleBot) aiBotAccess += 20;
    if (robotsAnalysis.allowsGPTBot) aiBotAccess += 20;
    if (robotsAnalysis.allowsPerplexityBot) aiBotAccess += 20;
    if (robotsAnalysis.allowsClaudeBot) aiBotAccess += 15;
    if (robotsAnalysis.hasLlmsTxt) aiBotAccess += 15;
    if (robotsAnalysis.hasSitemap) aiBotAccess += 10;
    aiBotAccess = Math.min(100, aiBotAccess);

    // Content Structure (0-100)
    let contentStructure = 30; // base
    if (pageData.h1Count === 1) contentStructure += 20;
    else if (pageData.h1Count > 1) contentStructure += 10;
    if (pageData.h2Count >= 2) contentStructure += 15;
    if (pageData.h3Count >= 1) contentStructure += 10;
    if (pageData.imgCount > 0 && pageData.imgsWithoutAlt === 0)
      contentStructure += 15;
    else if (pageData.imgsWithoutAlt > 0) contentStructure -= 10;
    if (pageData.lang) contentStructure += 10;
    contentStructure = Math.max(0, Math.min(100, contentStructure));

    // Conversational Readiness (0-100)
    let conversationalReady = 10;
    if (hasFAQ) conversationalReady += 35;
    if (pageData.h2Count >= 3) conversationalReady += 15;
    if (pageData.metaDescLength >= 50 && pageData.metaDescLength <= 160)
      conversationalReady += 15;
    if (hasProduct && richFieldCount >= 5) conversationalReady += 15;
    if (pageData.pageText.length > 500) conversationalReady += 10;
    conversationalReady = Math.min(100, conversationalReady);

    // Technical Speed (0-100)
    let technicalSpeed = 100;
    if (perfMetrics.fcp > 3000) technicalSpeed -= 30;
    else if (perfMetrics.fcp > 1800) technicalSpeed -= 15;
    if (perfMetrics.loadComplete > 6000) technicalSpeed -= 30;
    else if (perfMetrics.loadComplete > 3000) technicalSpeed -= 15;
    if (perfMetrics.responseTime > 2000) technicalSpeed -= 20;
    else if (perfMetrics.responseTime > 500) technicalSpeed -= 10;
    technicalSpeed = Math.max(0, technicalSpeed);

    // Meta & Social (0-100)
    let metaSocial = 0;
    if (pageData.titleLength >= 10 && pageData.titleLength <= 60)
      metaSocial += 20;
    else if (pageData.titleLength > 0) metaSocial += 10;
    if (pageData.metaDescLength >= 50 && pageData.metaDescLength <= 160)
      metaSocial += 20;
    else if (pageData.metaDescLength > 0) metaSocial += 10;
    if (pageData.ogTitle) metaSocial += 15;
    if (pageData.ogImage) metaSocial += 15;
    if (pageData.canonicalLink) metaSocial += 10;
    if (pageData.viewport) metaSocial += 10;
    if (pageData.favicon) metaSocial += 10;
    metaSocial = Math.min(100, metaSocial);

    // Overall GEO Score (weighted)
    const overall = Math.round(
      schemaQuality * 0.3 +
        aiBotAccess * 0.2 +
        contentStructure * 0.15 +
        conversationalReady * 0.15 +
        technicalSpeed * 0.1 +
        metaSocial * 0.1
    );

    // ========================================
    // 6. AI ANALYSIS (Groq)
    // ========================================

    const aiAnalysis = await runAIAnalysis(
      url,
      domain,
      pageData,
      {
        schemaQuality,
        aiBotAccess,
        contentStructure,
        conversationalReady,
        technicalSpeed,
        metaSocial,
        overall,
      },
      {
        typesFound: uniqueTypes,
        totalSchemas: schemaData.length,
        hasProduct,
        hasFAQ,
        hasBreadcrumb,
        hasOrganization,
        hasReview,
        richFieldCount,
      },
      robotsAnalysis
    );

    // ========================================
    // 7. GENERATE SCREENSHOT URL
    // ========================================

    // Use Microlink's embed redirect — returns a direct PNG, no branding/loading
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=2000`;

    // ========================================
    // 8. RETURN RESULTS
    // ========================================

    return NextResponse.json({
      url,
      domain,
      timestamp: new Date().toISOString(),
      screenshot: screenshotUrl,
      scores: {
        overall,
        schemaQuality,
        aiBotAccess,
        contentStructure,
        conversationalReady,
        technicalSpeed,
        metaSocial,
      },
      schemaDetails: {
        typesFound: uniqueTypes,
        totalSchemas: schemaData.length,
        hasProduct,
        hasFAQ,
        hasBreadcrumb,
        hasOrganization,
        hasReview,
        richFieldCount,
      },
      robotsAnalysis,
      aiAnalysis,
    });
  } catch (error: unknown) {
    console.error("Scan error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: `Scan failed: ${message}` },
      { status: 500 }
    );
  }
}

// ========================================
// AI ANALYSIS ENGINE
// ========================================

async function runAIAnalysis(
  url: string,
  domain: string,
  pageData: Record<string, any>,
  scores: Record<string, number>,
  schemaDetails: Record<string, any>,
  robotsAnalysis: Record<string, boolean>
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("No GROQ_API_KEY — using fallback");
    return getFallback(scores, schemaDetails, robotsAnalysis);
  }

  const prompt = `You are a helpful and simple ecommerce website assistant. Your job is to explain if a website is set up correctly so AI like ChatGPT can find it and recommend it to shoppers.

Analyze this Shopify/ecommerce store: ${url} (${domain})

SCORES:
- Product Details Setup: ${scores.schemaQuality}/100
- AI Access Allowed: ${scores.aiBotAccess}/100
- Easy to Read Layout: ${scores.contentStructure}/100
- Answers Questions: ${scores.conversationalReady}/100
- Website Speed: ${scores.technicalSpeed}/100
- Looking Professional: ${scores.metaSocial}/100
- Overall AI Readiness: ${scores.overall}/100

TECHNICAL INFO:
- Hidden Data Found: ${schemaDetails.typesFound.join(", ") || "None"}
- Has Product Info: ${schemaDetails.hasProduct}
- Rich Product Details: ${schemaDetails.richFieldCount} (important for AI)
- AI Bots Allowed: GoogleBot (${robotsAnalysis.allowsGoogleBot}), GPTBot (${robotsAnalysis.allowsGPTBot}), Perplexity (${robotsAnalysis.allowsPerplexityBot}), Claude (${robotsAnalysis.allowsClaudeBot})

RESPONSE REQUIREMENTS:
Speak in mostly plain, simple English that any shop owner can understand. Do not use complicated tech terms like "Generative Engine Optimization", "LLMs", or "JSON-LD schema". Explain things like "Your site doesn't tell bots the price".

Provide your analysis strictly as a JSON object (no extra text):
{
  "summary": "3-4 sentences. A friendly summary of how easily ChatGPT and other AIs can see their products.",
  "designFeedback": "3-4 sentences. What they should change so AI chatbots understand their store better.",
  "uxScore": <number 0-100>,
  "uxIssues": [
    {"title": "Simple Issue Name", "description": "Why this hurts them (e.g., 'ChatGPT cannot find your prices') in plain English.", "severity": "critical|high|medium|low", "category": "Product Info|AI Access|Layout|Speed"}
  ],
  "conversionIssues": [
    {"title": "Why They Lose Sales", "description": "How this stops AI bots from referring customers.", "severity": "critical|high|medium|low", "category": "Answers|Trust|Discovery"}
  ],
  "recommendations": [
    "Simple step to fix issue 1",
    "Simple step to fix issue 2",
    "Simple step to fix issue 3",
    "Simple step to fix issue 4",
    "Simple step to fix issue 5"
  ]
}

Generate 3-5 simple issues and 3-5 sales blockers based on their actual data above.`;

  try {
    const Groq = (await import("groq-sdk")).default;
    const groq = new Groq({ apiKey });

    const models = [
      "llama-3.3-70b-versatile",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "qwen/qwen3-32b",
    ];

    for (const model of models) {
      try {
        console.log(`🟢 Trying Groq: ${model}`);
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are a GEO (Generative Engine Optimization) expert. Respond with valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        });

        const text = completion.choices[0]?.message?.content || "";
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.summary) {
            console.log(`✅ Groq succeeded: ${model}`);
            return {
              summary: parsed.summary || "",
              designFeedback: parsed.designFeedback || "",
              uxScore: parsed.uxScore || 50,
              uxIssues: Array.isArray(parsed.uxIssues)
                ? parsed.uxIssues
                : [],
              conversionIssues: Array.isArray(parsed.conversionIssues)
                ? parsed.conversionIssues
                : [],
              recommendations: Array.isArray(parsed.recommendations)
                ? parsed.recommendations
                : [],
            };
          }
        }
      } catch (e) {
        console.error(
          `❌ Groq ${model}:`,
          e instanceof Error ? e.message.substring(0, 150) : "Error"
        );
      }
    }
  } catch (e) {
    console.error("Groq SDK error:", e);
  }

  return getFallback(scores, schemaDetails, robotsAnalysis);
}

function getFallback(
  scores: Record<string, number>,
  schema: Record<string, any>,
  robots: Record<string, boolean>
) {
  const issues = [];
  const conversionIssues = [];
  const recs = [];

  if (scores.schemaQuality < 50) {
    issues.push({
      title: "Missing Product Code",
      description: `We only found ${schema.totalSchemas} hidden code details. AI assistants like ChatGPT need hidden details to know your prices and products. Without them, they might recommend another store.`,
      severity: "critical",
      category: "Product Info",
    });
    recs.push(
      "Add hidden 'Product' details (called schema) to your website so AI systems can read your prices and stock."
    );
  }

  if (!schema.hasFAQ) {
    issues.push({
      title: "No Hidden Answers",
      description:
        "Your website doesn't have answers set up in a way AI can easily read. When people ask ChatGPT questions about your products, it won't know the answer.",
      severity: "high",
      category: "Answers",
    });
    recs.push(
      "Add a Frequently Asked Questions (FAQ) section that uses special code so AI bots can read the answers directly."
    );
  }

  if (!robots.allowsGPTBot) {
    conversionIssues.push({
      title: "Blocking ChatGPT",
      description:
        "Your website's settings are currently blocking ChatGPT's bots. Millions of users won't be able to find your products because ChatGPT is locked out.",
      severity: "critical",
      category: "AI Access",
    });
    recs.push(
      "Change your website's 'robots.txt' settings to allow ChatGPT and other bots to visit your store."
    );
  }

  if (!robots.hasLlmsTxt) {
    conversionIssues.push({
      title: "Missing AI Instructions",
      description:
        "You do not have a file that tells AI assistants what your store is about. This means the AI has to guess.",
      severity: "medium",
      category: "AI Access",
    });
    recs.push(
      "Add a special file (llms.txt) that gives a simple list of your products to AI bots."
    );
  }

  if (!schema.hasReview) {
    conversionIssues.push({
      title: "Hidden Reviews",
      description:
        "AI bots can't see your customer reviews. They usually don't recommend products if they can't confirm people like them.",
      severity: "high",
      category: "Trust",
    });
  }

  recs.push(
    "Make sure your website updates automatically so AI bots don't show old prices to customers.",
    "Add your return policy to the hidden code so AI bots can assure buyers it's safe to purchase."
  );

  return {
    summary: `Your store scored ${scores.overall} out of 100 for AI search. Right now, ${scores.schemaQuality < 50 ? "AI bots are having a very hard time reading your website, so they might not recommend your products." : "your store is doing okay, but could be much better with a few tweaks."} ${!robots.allowsGPTBot ? "Most importantly, you are accidentally blocking ChatGPT from seeing your store!" : ""}`,
    designFeedback:
      "To see exact details written by our AI Assistant, you need to add your API Key in the settings. This is a basic report using established rules.",
    uxScore: 50,
    uxIssues: issues,
    conversionIssues,
    recommendations: recs.slice(0, 5),
  };
}
