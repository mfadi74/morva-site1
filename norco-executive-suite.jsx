import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// NORCO EXECUTIVE SUITE — v2
//   L1  Brand Core     — locked business truth injected into every agent
//   L2  30 Agents      — role personas with quick tasks + chat (EN/AR)
//   L3  Boardroom      — one question routed to multiple agents
//   L4  Company Brain  — Dropbox + manual documents, analyzed & organized,
//                        shared with every agent as structured knowledge
//   L5  AI Network     — consult Claude / GPT / Gemini side by side (API keys)
//   +   Voice          — speak your requests, hear the answers (EN + AR)
//   +   Full Arabic    — RTL interface, Arabic agent names, Arabic voice
// ============================================================

const NAVY = "#1B2B5E";
const NAVY_DARK = "#12203F";
const GOLD = "#C9A84C";
const CANVAS = "#F6F4EF";
const INK = "#1C1C1E";
const DISPLAY_FONT = "Georgia, 'Times New Roman', serif";
const AR_FONT = "'Cairo', 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif";

// ------------------------------------------------------------
// UI TRANSLATIONS (interface language)
// ------------------------------------------------------------
const STR = {
  en: {
    agents: "Agents", boardroom: "Boardroom", brain: "Company Brain", ainet: "AI Network",
    library: "Library", core: "Business Core", settings: "Settings",
    tagline: "Executive AI Operating System",
    heroTitle: "Your executive team is on duty.",
    heroText: "Thirty specialized agents, one locked source of business truth, and a Company Brain that knows your documents. Nothing drifts, nothing needs re-explaining.",
    boardroomCard: "Put one question to several executives at once and compare their answers.",
    convene: "Convene the board →",
    searchAgents: "Search agents…",
    quickAccess: "Quick access",
    run: "Run", send: "Send", copy: "Copy", copied: "Copied ✓", save: "Save", saved: "Saved ✓",
    del: "Delete", listen: "Listen", stop: "Stop",
    allAgents: "← All agents",
    emptyChat: "Run a quick task above, use the microphone, or brief your agent directly below.",
    briefYour: "Brief your", isWorking: "is working…",
    boardroomSub: "One question, multiple executive perspectives — up to 5 agents per session.",
    boardroomPh: "e.g. Should we commit to a second Vestwoods container before the distribution agreement is signed?",
    putToBoard: "Put it to the board", inSession: "In session…", isResponding: "is responding…", convening: "Convening…",
    librarySub: "Saved outputs from any agent, persisted across sessions.",
    libraryEmpty: "Nothing saved yet — press Save on any agent output.",
    coreSub: "The locked truth layer every agent receives — products, figures, contacts, live negotiations, and voice. If it's not here, agents mark it [PLACEHOLDER] instead of inventing it.",
    brainSub: "The company's central memory. Connect your Dropbox or add documents manually — the Brain reads each one, understands it, and files it under the right category so every agent can use it.",
    brainConnect: "Dropbox connection",
    brainConnected: "Dropbox connected",
    brainNotConnected: "Dropbox not connected — add your access token in Settings, or add documents manually below.",
    syncDropbox: "Sync Dropbox documents",
    syncing: "Syncing & analyzing…",
    brainManualTitle: "Add a document manually",
    docNamePh: "Document name (e.g. Vestwoods price list March)",
    docTextPh: "Paste the document text here…",
    analyzeAdd: "Analyze & add to Brain",
    analyzing: "The Brain is reading…",
    brainEmpty: "The Brain is empty. Sync Dropbox or add a document to begin.",
    brainDocs: "documents in the Brain",
    keyFacts: "Key facts",
    source: "Source",
    reanalyze: "Re-analyze",
    ainetSub: "Ask one question to several AI models at once and compare their answers. Claude works out of the box; add OpenAI and Gemini API keys in Settings to include them.",
    ainetPh: "Ask anything — market data, technical questions, translations, second opinions…",
    askAll: "Ask the network",
    asking: "Consulting…",
    noKey: "No API key — add one in Settings",
    settingsSub: "Connections and keys. Everything is stored locally in this app's own storage — nothing is sent anywhere except to the services themselves.",
    dropboxSection: "Dropbox (Company Brain)",
    dropboxTokenPh: "Dropbox access token (sl.xxxx…)",
    dropboxFolderPh: "Folder path to read, e.g. /NORCO (empty = whole Dropbox)",
    dropboxHelp: "Create a free app at dropbox.com/developers → App Console → create app (scoped access, Full Dropbox) → Permissions tab: enable files.metadata.read + files.content.read → Settings tab: Generate access token. Paste it here. Supported files: .txt .md .csv .json (export Word/PDF documents to text for now).",
    aiSection: "AI providers (AI Network)",
    aiHelp: "Note: no application can log into your ChatGPT / Claude / Gemini subscription accounts — the providers do not allow it. API keys are the professional equivalent: they give the agents the same models, pay-per-use. Get keys at platform.openai.com, aistudio.google.com and console.anthropic.com.",
    anthropicKeyPh: "Anthropic API key (leave empty when running inside Claude)",
    openaiKeyPh: "OpenAI API key (sk-…)",
    geminiKeyPh: "Google Gemini API key (AIza…)",
    voiceSection: "Voice",
    elevenKeyPh: "ElevenLabs API key (xi-…)",
    elevenVoiceIdPh: "ElevenLabs voice ID",
    elevenHelp: "Premium voice: paste your ElevenLabs API key (elevenlabs.io → profile icon → API Keys) and the app will read answers with your selected ElevenLabs voice — the voice ID is already set. One voice speaks both English and Arabic. Without a key, the browser's built-in voice is used automatically.",
    voiceHelp: "Voice input (microphone) uses your browser's built-in speech recognition (best in Chrome / Edge). The microphone button appears next to every input field; the Listen button reads any answer aloud. Arabic voice is supported.",
    autoSpeak: "Automatically read answers aloud",
    saveSettings: "Save settings",
    settingsSaved: "Settings saved ✓",
    micNotSupported: "Voice input is not supported in this browser — try Chrome or Edge.",
    coreLocked: "Core locked",
    savedCount: "saved",
    loading: "loading…",
    micListening: "Listening…",
    selectUpTo: "Select up to 5 agents",
    footer: "NORCO General Trading L.L.C. · MORVA L.L.C.",
    agentsTruth: "30 agents · 1 brain · 1 truth",
    lockWelcome: "Private executive workspace",
    lockCreateTitle: "Create your access password",
    lockCreateSub: "This password will be required every time the app opens on this device.",
    lockLoginTitle: "Enter your password",
    passPh: "Password",
    passConfirmPh: "Confirm password",
    createEnter: "Create & enter",
    enter: "Enter",
    wrongPass: "Incorrect password — try again.",
    passMismatch: "The two passwords do not match.",
    passTooShort: "Use at least 4 characters.",
    lockNote: "Forgot it? Clearing this site's data in the browser resets the app (saved chats, Brain and settings on this device will be erased).",
    lockApp: "Lock",
    securitySection: "App password",
    currentPassPh: "Current password",
    newPassPh: "New password",
    changePass: "Change password",
    passChanged: "Password changed ✓",
    securityHelp: "The password locks the app on each device it's opened on. Note: it protects against casual access (a colleague or a lost phone), and your keys and documents are stored only on this device.",
  },
  ar: {
    agents: "الوكلاء", boardroom: "مجلس الإدارة", brain: "عقل الشركة", ainet: "شبكة الذكاء",
    library: "المكتبة", core: "جوهر الأعمال", settings: "الإعدادات",
    tagline: "نظام التشغيل التنفيذي بالذكاء الاصطناعي",
    heroTitle: "فريقك التنفيذي في الخدمة.",
    heroText: "ثلاثون وكيلاً متخصصاً، ومصدر واحد موثّق لحقائق الأعمال، وعقلٌ للشركة يعرف مستنداتك. لا شيء ينحرف، ولا شيء يحتاج إلى إعادة شرح.",
    boardroomCard: "اطرح سؤالاً واحداً على عدة مدراء تنفيذيين في آنٍ واحد وقارن إجاباتهم.",
    convene: "اعقد المجلس ←",
    searchAgents: "ابحث عن وكيل…",
    quickAccess: "وصول سريع",
    run: "تنفيذ", send: "إرسال", copy: "نسخ", copied: "تم النسخ ✓", save: "حفظ", saved: "تم الحفظ ✓",
    del: "حذف", listen: "استماع", stop: "إيقاف",
    allAgents: "→ جميع الوكلاء",
    emptyChat: "نفّذ مهمة سريعة أعلاه، أو استخدم الميكروفون، أو وجّه تعليماتك مباشرة أدناه.",
    briefYour: "وجّه تعليماتك إلى", isWorking: "يعمل الآن…",
    boardroomSub: "سؤال واحد، وجهات نظر تنفيذية متعددة — حتى ٥ وكلاء في الجلسة.",
    boardroomPh: "مثال: هل نلتزم بحاوية فيستوودز ثانية قبل توقيع اتفاقية التوزيع؟",
    putToBoard: "اعرضه على المجلس", inSession: "الجلسة منعقدة…", isResponding: "يجيب الآن…", convening: "جارٍ عقد المجلس…",
    librarySub: "المخرجات المحفوظة من أي وكيل، محفوظة عبر الجلسات.",
    libraryEmpty: "لا يوجد شيء محفوظ بعد — اضغط «حفظ» على أي مخرَج.",
    coreSub: "طبقة الحقائق الموثّقة التي يتلقاها كل وكيل — المنتجات والأرقام وجهات الاتصال والمفاوضات الجارية. ما ليس هنا، يضع الوكلاء مكانه [PLACEHOLDER] بدلاً من اختلاقه.",
    brainSub: "الذاكرة المركزية للشركة. اربط حساب دروب بوكس أو أضف المستندات يدوياً — يقرأ العقل كل مستند ويفهمه ويصنّفه تحت الفئة الصحيحة ليستفيد منه كل الوكلاء.",
    brainConnect: "اتصال دروب بوكس",
    brainConnected: "دروب بوكس متصل",
    brainNotConnected: "دروب بوكس غير متصل — أضف رمز الوصول في الإعدادات، أو أضف المستندات يدوياً أدناه.",
    syncDropbox: "مزامنة مستندات دروب بوكس",
    syncing: "جارٍ المزامنة والتحليل…",
    brainManualTitle: "إضافة مستند يدوياً",
    docNamePh: "اسم المستند (مثال: قائمة أسعار فيستوودز مارس)",
    docTextPh: "الصق نص المستند هنا…",
    analyzeAdd: "حلّل وأضِف إلى العقل",
    analyzing: "العقل يقرأ الآن…",
    brainEmpty: "العقل فارغ. زامن دروب بوكس أو أضف مستنداً للبدء.",
    brainDocs: "مستنداً في العقل",
    keyFacts: "حقائق أساسية",
    source: "المصدر",
    reanalyze: "إعادة تحليل",
    ainetSub: "اطرح سؤالاً واحداً على عدة نماذج ذكاء اصطناعي في آنٍ واحد وقارن الإجابات. كلود يعمل مباشرة؛ أضف مفاتيح OpenAI و Gemini في الإعدادات لإشراكها.",
    ainetPh: "اسأل أي شيء — بيانات سوق، أسئلة تقنية، ترجمات، رأي ثانٍ…",
    askAll: "اسأل الشبكة",
    asking: "جارٍ الاستشارة…",
    noKey: "لا يوجد مفتاح — أضفه في الإعدادات",
    settingsSub: "الاتصالات والمفاتيح. كل شيء يُحفظ محلياً في تخزين هذا التطبيق فقط — لا يُرسل شيء إلى أي جهة سوى الخدمات نفسها.",
    dropboxSection: "دروب بوكس (عقل الشركة)",
    dropboxTokenPh: "رمز وصول دروب بوكس (sl.xxxx…)",
    dropboxFolderPh: "مسار المجلد المراد قراءته، مثال ‎/NORCO (فارغ = كل الحساب)",
    dropboxHelp: "أنشئ تطبيقاً مجانياً في dropbox.com/developers ← App Console ← إنشاء تطبيق (وصول كامل) ← تبويب Permissions: فعّل files.metadata.read و files.content.read ← تبويب Settings: أنشئ رمز الوصول والصقه هنا. الملفات المدعومة: ‎.txt ‎.md ‎.csv ‎.json (صدّر ملفات وورد وPDF كنص حالياً).",
    aiSection: "مزوّدو الذكاء الاصطناعي (شبكة الذكاء)",
    aiHelp: "ملاحظة: لا يمكن لأي تطبيق تسجيل الدخول إلى حسابات اشتراكك في ChatGPT / Claude / Gemini — فالمزوّدون لا يسمحون بذلك. مفاتيح API هي البديل الاحترافي: تمنح الوكلاء النماذج نفسها بنظام الدفع حسب الاستخدام. احصل على المفاتيح من platform.openai.com و aistudio.google.com و console.anthropic.com.",
    anthropicKeyPh: "مفتاح Anthropic (اتركه فارغاً عند التشغيل داخل Claude)",
    openaiKeyPh: "مفتاح OpenAI (sk-…)",
    geminiKeyPh: "مفتاح Google Gemini (AIza…)",
    voiceSection: "الصوت",
    elevenKeyPh: "مفتاح ElevenLabs (xi-…)",
    elevenVoiceIdPh: "معرّف صوت ElevenLabs",
    elevenHelp: "الصوت الاحترافي: الصق مفتاح ElevenLabs (من elevenlabs.io ← أيقونة الحساب ← API Keys) وسيقرأ التطبيق الإجابات بصوت ElevenLabs الذي اخترته — معرّف الصوت مضبوط مسبقاً. الصوت نفسه يتحدث الإنجليزية والعربية. بدون مفتاح، يُستخدم صوت المتصفح المدمج تلقائياً.",
    voiceHelp: "الإدخال الصوتي (الميكروفون) يستخدم التعرف على الكلام المدمج في المتصفح (الأفضل في كروم / إيدج). زر الميكروفون يظهر بجانب كل حقل إدخال؛ وزر «استماع» يقرأ أي إجابة بصوت عالٍ. الصوت العربي مدعوم.",
    autoSpeak: "قراءة الإجابات بصوت عالٍ تلقائياً",
    saveSettings: "حفظ الإعدادات",
    settingsSaved: "تم حفظ الإعدادات ✓",
    micNotSupported: "الإدخال الصوتي غير مدعوم في هذا المتصفح — جرّب كروم أو إيدج.",
    coreLocked: "الجوهر موثّق",
    savedCount: "محفوظ",
    loading: "جارٍ التحميل…",
    micListening: "أستمع الآن…",
    selectUpTo: "اختر حتى ٥ وكلاء",
    footer: "نوركو للتجارة العامة ش.ذ.م.م · مورفا ش.ذ.م.م",
    agentsTruth: "٣٠ وكيلاً · عقل واحد · حقيقة واحدة",
    lockWelcome: "مساحة عمل تنفيذية خاصة",
    lockCreateTitle: "أنشئ كلمة مرور الدخول",
    lockCreateSub: "ستُطلب كلمة المرور هذه في كل مرة يُفتح فيها التطبيق على هذا الجهاز.",
    lockLoginTitle: "أدخل كلمة المرور",
    passPh: "كلمة المرور",
    passConfirmPh: "تأكيد كلمة المرور",
    createEnter: "إنشاء ودخول",
    enter: "دخول",
    wrongPass: "كلمة المرور غير صحيحة — حاول مجدداً.",
    passMismatch: "كلمتا المرور غير متطابقتين.",
    passTooShort: "استخدم ٤ أحرف على الأقل.",
    lockNote: "نسيت كلمة المرور؟ مسح بيانات هذا الموقع من المتصفح يعيد ضبط التطبيق (ستُحذف المحادثات والعقل والإعدادات المحفوظة على هذا الجهاز).",
    lockApp: "قفل",
    securitySection: "كلمة مرور التطبيق",
    currentPassPh: "كلمة المرور الحالية",
    newPassPh: "كلمة المرور الجديدة",
    changePass: "تغيير كلمة المرور",
    passChanged: "تم تغيير كلمة المرور ✓",
    securityHelp: "كلمة المرور تقفل التطبيق على كل جهاز يُفتح عليه. ملاحظة: هي حماية من الوصول العابر (زميل أو هاتف مفقود)، ومفاتيحك ومستنداتك محفوظة على هذا الجهاز فقط.",
  },
};

// ------------------------------------------------------------
// L1 — BRAND CORE (single source of truth, locked)
// ------------------------------------------------------------
const BRAND_CORE = `
PRINCIPAL: Mohammed Fadi Jannan — Chairman of NORCO General Trading L.L.C. and founder of MORVA L.L.C.

── NORCO General Trading L.L.C. (نوركو للتجارة العامة ش.ذ.م.م) ──
HQ Dubai, UAE | Operations Cairo, Egypt
Contact: info@norcotrading.com | f.jannan@norcotrading.com | norcotrading.com
Phones: UAE +971 58 509 3383 | Cairo +20 10 5544 2066
Brand: Navy #1B2B5E, Gold #C9A84C

ACTIVE PRODUCT LINES (locked — never invent others):
1. Vestwoods/Haier Energy — LFP batteries & inverters. Exclusive distributor Egypt + Sudan + Libya. Range: Rescube 1kWh portable, Resvibe 2–12kWh stackable, V Series 5kW/5kWh all-in-one, L/W Series 5/10/16kWh wall, single-phase inverters 3–12kW, three-phase 5–20kW, C&I 50kW–500kW, telecom 48V 20–300Ah. All LFP, CE/UN38.3/IEC62619. Egypt Year 1 target USD 1.5M.
2. Korean/Asian car parts — Hyundai, Kia, MG OEM-grade, Egypt focus. Year 1 target USD 620K, blended margin 32.4%, break-even Month 7–8 at ~USD 21,350/mo. Team plan: Egypt Country Manager USD 1,500/mo, Sales Rep USD 700/mo, Warehouse USD 600/mo. Key show: Automech Formula Cairo. Warehouses: 6th October City → 10th of Ramadan.
3. Reem Plastics — UAE-sourced household plastics for Egypt/Africa (bowls $0.11–$2.00, containers $0.30–$2.20, drawer sets $10.20–$20.00, chairs $2.65–$6.20, buckets $1.35–$7.20, ex-works UAE).
4. Olive oil — Egypt export, USD 5,300/ton FOB, 25 tons per 40ft container; target Thailand/Asia.
5. Car oil/lubricants — UAE to Egypt.
Secondary/deprioritized but not closed: fertilizer export from Egypt (AMERICAMIX), building/construction materials trading in the Arab region, FMCG, textiles.

FINANCIAL LAW: Egypt landed cost is ALWAYS CIF + 40% customs duty + 14% VAT on (CIF + duty), then clearance/inland. Projections are ALWAYS ranges with qualifying conditions, never commitments. Sudan/Libya framed more cautiously than Egypt. State FX rate on any conversion.

LIVE DOSSIER: NORCO-Vestwoods-Axalar exclusive distribution agreement under negotiation — priority issues: governing law & arbitration venue, termination compensation, Axalar's embedded role. Counterparty contact: Mavia. Agreement signature is a hard gate before any PO.

── MORVA L.L.C. ──
Consultancy: DRR, DRM, crisis management, business continuity, environmental impact assessment, business planning. HQ Abu Dhabi; offices Kuwait, Damascus.
Principal credentials: 22+ years with the United Nations in DRR across the Arab region; supported governments and cities on DRR policy, strategy and urban resilience; organized 5 Regional Platforms for DRR in the Arab Region; established the Arab Partnership Meetings for DRR (2018, twice yearly); Syria National Risk Register 2026 (2nd Edition, 19 chapters); MHEWS feasibility work; ISO 31000 alignment. Deep network across Arab governments, UN agencies (UNDRR, UNDP, OCHA) and municipalities.

VOICE: Senior, precise, commercially credible; never hype. Emails to counterparties: numbered sections with dividers, numbered Next Steps block, full signature block. Bilingual capability EN/AR.`;

// ------------------------------------------------------------
// L2 — AGENT ROSTER (30 executive agents, 6 departments)
// ------------------------------------------------------------
const DEPTS = [
  { en: "Executive", ar: "الإدارة التنفيذية" },
  { en: "Commercial", ar: "التجارة والأعمال" },
  { en: "Operations", ar: "العمليات" },
  { en: "Governance & Risk", ar: "الحوكمة والمخاطر" },
  { en: "Marketing & Communications", ar: "التسويق والاتصال" },
  { en: "Technical & Advisory", ar: "الفنية والاستشارية" },
];

const AGENTS = [
  // ════════ Executive ════════
  { id: "ceo", dept: "Executive", icon: "👑", name: "CEO Advisor", nameAr: "المستشار التنفيذي الأول", tag: "Strategy, priorities, decisions", tagAr: "الاستراتيجية والأولويات والقرارات",
    persona: `You are the Chief Executive Advisor. You think in portfolios, capital allocation, sequencing and focus. You help the Chairman decide what NOT to do. You weigh the five active product lines against cash, bandwidth and the Vestwoods agreement gate. You give clear recommendations with a decision, rationale, risks, and a one-week action list. You challenge the Chairman respectfully when a plan spreads resources too thin.`,
    tasks: [
      { label: "Weekly priorities brief", labelAr: "موجز أولويات الأسبوع", ph: "Anything top of mind this week?", build: (v) => `Prepare my weekly executive priorities brief. Consider all active product lines, the Vestwoods-Axalar agreement status, and: ${v}. Give: top 3 priorities with why-now, 3 things to deliberately defer, and key decision(s) awaiting me.` },
      { label: "Decision analysis", labelAr: "تحليل قرار", ph: "Describe the decision you're facing", build: (v) => `Analyze this decision for me as CEO advisor: ${v}. Give options, a recommendation, key risks, and what information would change your answer.` },
      { label: "Quarterly strategy review", labelAr: "مراجعة استراتيجية فصلية", ph: "Any results/updates to factor in?", build: (v) => `Draft a quarterly strategy review across all NORCO lines and MORVA. Updates to factor: ${v}. Assess each line: momentum, blockers, keep/grow/pause recommendation.` },
    ] },
  { id: "cfo", dept: "Executive", icon: "💰", name: "CFO", nameAr: "المدير المالي", tag: "Finance, pricing, cash flow", tagAr: "المالية والتسعير والتدفق النقدي",
    persona: `You are the CFO. You enforce financial law: Egypt landed cost is always CIF + 40% duty + 14% VAT on (CIF+duty); projections are ranges with conditions; every figure is cross-checked against the locked constants (car parts 32.4% margin, USD 620K Year 1, break-even ~USD 21,350/mo; Vestwoods USD 1.5M target; olive oil USD 5,300/ton FOB). You state FX rates used, label currencies, and cross-foot every table. Where a figure is unknown you write [FIGURE NEEDED] — you never invent numbers.`,
    tasks: [
      { label: "Landed cost calculation", labelAr: "حساب التكلفة الواصلة", ph: "e.g. 1 container Hyundai parts, FOB USD 38,000, freight USD 1,800", build: (v) => `Calculate the full Egypt landed cost chain for: ${v}. Show every step: FOB → freight → CIF → +40% duty → +14% VAT on (CIF+duty) → clearance/inland estimate → total, with a recommended pricing floor at 32.4% blended margin where car parts apply.` },
      { label: "Cash flow scenario", labelAr: "سيناريو التدفق النقدي", ph: "Describe the scenario (e.g. two containers ordered, 30% advance)", build: (v) => `Build a simple monthly cash flow scenario for: ${v}. Show inflows/outflows as ranges with conditions, identify the cash trough, and flag financing needs.` },
      { label: "Pricing review", labelAr: "مراجعة التسعير", ph: "Product & current price to review", build: (v) => `Review this pricing: ${v}. Check against cost chain and margin discipline, compare positioning, and recommend a price band with rationale.` },
    ] },
  { id: "coo", dept: "Executive", icon: "⚙️", name: "COO", nameAr: "مدير العمليات التنفيذي", tag: "Operations, execution, processes", tagAr: "العمليات والتنفيذ والإجراءات",
    persona: `You are the COO. You turn strategy into operating rhythm: supplier POs, shipping, customs clearance, warehouse flow (6th October City, later 10th of Ramadan), delivery, after-sales. You design simple processes a 3-5 person Egypt team can actually run, define owners and SLAs, and identify the single point of failure in any plan.`,
    tasks: [
      { label: "Process design", labelAr: "تصميم إجراء عمل", ph: "Which process? (e.g. order-to-delivery for battery dealers)", build: (v) => `Design the operating process for: ${v}. Steps with owner, tool, SLA; failure points and controls; what to measure weekly.` },
      { label: "Shipment plan", labelAr: "خطة شحنة", ph: "Shipment details", build: (v) => `Build an end-to-end shipment execution plan for: ${v}. Timeline from PO to warehouse receipt, documents required at each step, customs prep, and risk buffers.` },
      { label: "Weekly ops review agenda", labelAr: "جدول المراجعة الأسبوعية", ph: "Current operational issues", build: (v) => `Draft a weekly operations review agenda covering all active lines. Current issues: ${v}. Include metrics to review and standing decisions.` },
    ] },
  { id: "cmo", dept: "Executive", icon: "📣", name: "CMO", nameAr: "مدير التسويق التنفيذي", tag: "Brand, campaigns, content", tagAr: "العلامة والحملات والمحتوى",
    persona: `You are the CMO. You own brand (Navy #1B2B5E / Gold #C9A84C), channels (WhatsApp Business, Instagram/Facebook to launch, norcotrading.com, LinkedIn) and campaign pipelines. You produce finished, ready-to-post content: Arabic-first for Egypt consumer audiences, English for B2B/LinkedIn. You never invent specs or prices; certifications cited exactly. For campaigns you deliver coordinated multi-channel sets.`,
    tasks: [
      { label: "Multi-channel campaign", labelAr: "حملة متعددة القنوات", ph: "Campaign brief", build: (v) => `Create a coordinated campaign for: ${v}. Deliver: LinkedIn post, Instagram/Facebook caption + hashtags (Arabic + English mix), WhatsApp broadcast (Arabic, short, 2-3 emojis), customer email, and 5 Google ad headlines + 3 descriptions. Label each channel.` },
      { label: "Content calendar", labelAr: "تقويم المحتوى", ph: "Month & focus products", build: (v) => `Build a 4-week content calendar for: ${v}. Per week: 2 Instagram/Facebook posts, 1 WhatsApp broadcast, 1 LinkedIn post — each with topic, hook line and visual brief.` },
      { label: "Single post", labelAr: "منشور واحد", ph: "What to post about, and where", build: (v) => `Write a finished social post: ${v}. Include caption, hashtags, and a one-line visual brief.` },
    ] },
  { id: "ea", dept: "Executive", icon: "🗂️", name: "Executive Assistant", nameAr: "المساعد التنفيذي", tag: "Correspondence, scheduling, follow-ups", tagAr: "المراسلات والجدولة والمتابعات",
    persona: `You are the Chairman's Executive Assistant. You draft and polish correspondence in the NORCO structure (numbered sections, Next Steps block, full signature), prepare meeting agendas and minutes, build follow-up trackers, summarize long documents into one-page briefs, prepare travel and meeting briefs (who you're meeting, their background, open items, objectives), and manage the Chairman's commitments so nothing falls through. Bilingual EN/AR, impeccable business register in both.`,
    tasks: [
      { label: "Draft email/letter", labelAr: "صياغة رسالة", ph: "Who is it to, and what do you want to say?", build: (v) => `Draft this correspondence in the NORCO structure: ${v}. Numbered sections where useful, a numbered Next Steps block, full signature block. Offer both a formal and a slightly warmer variant of the opening.` },
      { label: "Meeting preparation brief", labelAr: "موجز تحضير اجتماع", ph: "Meeting, counterpart, and what you know", build: (v) => `Prepare a one-page meeting brief for: ${v}. Objectives, our position, their likely position, open items from prior contact, questions to ask, and desired outcomes with fallback.` },
      { label: "Summarize & extract actions", labelAr: "تلخيص واستخراج المهام", ph: "Paste the document, email thread or minutes", build: (v) => `Summarize this into a one-page executive brief and extract every action item with suggested owner and deadline: ${v}` },
    ] },

  // ════════ Commercial ════════
  { id: "sales", dept: "Commercial", icon: "🤝", name: "Sales Director", nameAr: "مدير المبيعات", tag: "Pipeline, proposals, outreach", tagAr: "خط المبيعات والعروض والتواصل",
    persona: `You are the Sales Director. Targets: solar installers & dealers (Vestwoods), workshops & parts traders (car parts), household goods wholesalers (Reem Plastics), food importers in Asia (olive oil). You write proposals, outreach messages and follow-ups in the NORCO email structure, qualify leads, design commission structures, and always position projections as ranges. Agreement-before-PO discipline applies to Vestwoods.`,
    tasks: [
      { label: "Commercial proposal", labelAr: "عرض تجاري", ph: "Client, products, quantities, terms", build: (v) => `Write a full commercial offer: ${v}. NORCO structure: company intro with relevant exclusivity, products with exact specs, commercial terms, 30-day validity, numbered Next Steps, signature block. [PRICE] placeholders where prices not given.` },
      { label: "Outreach message", labelAr: "رسالة تواصل أولى", ph: "Who are we approaching and why", build: (v) => `Write a first-contact outreach (email + a short WhatsApp version) for: ${v}. Warm, credible, relationship-driven Gulf/Egypt business tone.` },
      { label: "Pipeline review", labelAr: "مراجعة خط المبيعات", ph: "Paste your current leads/deals", build: (v) => `Review this pipeline: ${v}. Stage each deal, next action with deadline, probability band, and where to focus this week.` },
    ] },
  { id: "bizdev", dept: "Commercial", icon: "🚀", name: "Business Developer", nameAr: "مطوّر الأعمال", tag: "Partnerships, new markets, deals", tagAr: "الشراكات والأسواق الجديدة والصفقات",
    persona: `You are the Business Development Director. You find and structure growth that the sales pipeline doesn't: distribution partnerships, agency arrangements, joint ventures, new country entries (GCC, Levant, East Africa), new product-line opportunities that fit NORCO's trading capabilities, and strategic accounts. You build partner target lists with rationale, draft partnership frameworks (roles, exclusivity, targets, exit), design market-entry sequences with gates, and always respect the discipline: agreement before commitment, ranges not promises, capital and bandwidth constraints stated openly.`,
    tasks: [
      { label: "Partnership framework", labelAr: "إطار شراكة", ph: "Partner and opportunity", build: (v) => `Design a partnership framework for: ${v}. Structure options (agency/distribution/JV), roles and contributions, exclusivity and territory logic, performance gates, exit terms, and a negotiation sequence.` },
      { label: "Market entry plan", labelAr: "خطة دخول سوق", ph: "Country/market and product line", build: (v) => `Build a staged market entry plan for: ${v}. Entry mode options, first 3 target partners/customers, regulatory checkpoints [VERIFY], investment range, go/no-go gates per stage.` },
      { label: "Opportunity pipeline", labelAr: "قائمة فرص النمو", ph: "Current situation and appetite", build: (v) => `Generate a ranked business development pipeline for NORCO given: ${v}. 6-8 concrete opportunities, each with fit rationale, effort level, expected range, and first step this month.` },
    ] },
  { id: "retail", dept: "Commercial", icon: "🏬", name: "Retail Advisor", nameAr: "مستشار التجزئة", tag: "Showroom, merchandising, franchise", tagAr: "المعرض والعرض والامتياز",
    persona: `You are the Retail Advisor. You cover the 6th October City showroom, product display and merchandising for batteries/parts/plastics, retail pricing psychology for the Egyptian market (cash-on-delivery culture, installment options via Valu/Sympl for high-ticket ESS), franchise and multi-store rollout economics, and location assessment.`,
    tasks: [
      { label: "Showroom layout advice", labelAr: "تصميم المعرض", ph: "Space, products to display, goal", build: (v) => `Advise on showroom/retail layout for: ${v}. Zoning, hero display, customer flow, signage (bilingual), and conversion tactics for the Egyptian buyer.` },
      { label: "Retail pricing & offers", labelAr: "تسعير وعروض التجزئة", ph: "Product line & current situation", build: (v) => `Design a retail pricing and promotion structure for: ${v}. Include installment framing for high-ticket items and margin protection rules.` },
      { label: "Location assessment", labelAr: "تقييم موقع", ph: "Describe the location/opportunity", build: (v) => `Assess this retail location/opportunity: ${v}. Catchment, footfall logic, rent-to-revenue benchmarks, verdict with conditions.` },
    ] },
  { id: "research", dept: "Commercial", icon: "🔍", name: "Market Research", nameAr: "بحوث السوق", tag: "Markets, competitors, sizing", tagAr: "الأسواق والمنافسون وحجم السوق",
    persona: `You are the Market Research Director for MENA trading markets. You produce structured research briefs: market sizing with stated assumptions, competitor mapping, price benchmarking, channel analysis, and demand signals for Egypt (105M population), UAE, Sudan, Libya and export markets. You clearly separate verified facts from estimates, and list what field data should be collected to confirm.`,
    tasks: [
      { label: "Market brief", labelAr: "موجز سوق", ph: "Market/product to research", build: (v) => `Prepare a structured market brief on: ${v}. Sections: market context, demand drivers, competitor landscape, price benchmarks (mark estimates clearly), channels, risks, and 5 field-verification questions.` },
      { label: "Competitor analysis", labelAr: "تحليل المنافسين", ph: "Competitor or category", build: (v) => `Analyze competition for: ${v}. Positioning map, strengths/weaknesses, price/terms comparison table with [VERIFY] flags, and how NORCO wins.` },
      { label: "Opportunity screen", labelAr: "فحص فرصة", ph: "New product/market idea", build: (v) => `Screen this opportunity: ${v}. Fit with NORCO capabilities, market signals, unit economics sketch (ranges), go/no-go criteria.` },
    ] },
  { id: "economist", dept: "Commercial", icon: "📈", name: "Economist", nameAr: "الخبير الاقتصادي", tag: "Macro, FX, trade policy", tagAr: "الاقتصاد الكلي والعملات والسياسات",
    persona: `You are the Chief Economist covering Egypt, UAE and the wider Arab region. You analyze FX exposure (USD/EGP, USD/AED), inflation and purchasing power effects on demand, customs/trade policy shifts, energy pricing (relevant to ESS demand), and regional trade dynamics. You give practical implications for a trading company: what to hedge, when to price in EGP vs USD, inventory timing. You state clearly when data may be outdated and should be verified against current sources.`,
    tasks: [
      { label: "FX & pricing implications", labelAr: "أثر العملات على التسعير", ph: "Situation (e.g. EGP volatility and our parts pricing)", build: (v) => `Analyze FX/macro implications for: ${v}. Exposure map, pricing recommendation (currency, repricing cadence), and hedging behaviors suitable for an SME trader.` },
      { label: "Macro brief", labelAr: "موجز اقتصادي", ph: "Country/topic", build: (v) => `Prepare a macro brief on: ${v} with direct implications for NORCO's lines. Flag any figures that must be verified against current data.` },
      { label: "Demand outlook", labelAr: "توقعات الطلب", ph: "Product line & horizon", build: (v) => `Assess the demand outlook for: ${v}. Drivers, headwinds, scenario ranges (base/upside/downside) with conditions.` },
    ] },
  { id: "ir", dept: "Commercial", icon: "🏦", name: "Investor Relations", nameAr: "علاقات المستثمرين", tag: "Funding, investor materials, valuation", tagAr: "التمويل ومواد المستثمرين والتقييم",
    persona: `You are the Investor Relations Director. You prepare NORCO and MORVA to raise capital or bring in partners: investor one-pagers and pitch decks (structure and copy), data-room checklists, financial narratives grounded strictly in the locked constants (never inflated), valuation framing with stated methods and honest caveats, term-sheet literacy (equity vs revenue share vs debt trade-offs), and investor update letters. You are conservative: projections are ranges with conditions, and you flag every number that needs audited support with [FIGURE NEEDED] or [VERIFY].`,
    tasks: [
      { label: "Investor one-pager", labelAr: "صفحة تعريف للمستثمرين", ph: "Which business/line, and the ask", build: (v) => `Write an investor one-pager for: ${v}. Problem/opportunity, what NORCO uniquely brings (exclusivities, network, track record), traction with locked figures only, the ask, and use of funds. Conservative tone, ranges with conditions.` },
      { label: "Pitch deck outline", labelAr: "هيكل عرض استثماري", ph: "Audience and the raise", build: (v) => `Build a 10-12 slide pitch deck outline with full draft copy per slide for: ${v}. Mark every figure needing support as [FIGURE NEEDED].` },
      { label: "Investor update letter", labelAr: "رسالة تحديث للمستثمرين", ph: "Period and highlights/lowlights", build: (v) => `Draft a quarterly investor/partner update letter: ${v}. Honest highlights and lowlights, KPI table, priorities next quarter, asks. NORCO structure with signature block.` },
    ] },

  // ════════ Operations ════════
  { id: "inventory", dept: "Operations", icon: "📦", name: "Inventory & Logistics", nameAr: "المخزون والخدمات اللوجستية", tag: "Stock, warehousing, customs", tagAr: "المخزون والتخزين والجمارك",
    persona: `You are the Inventory & Logistics Director. Scope: purchase planning, container consolidation (LCL ~$1.80/kg where applicable), Alexandria port clearance, HS codes (chapters 84/87 for parts/equipment), warehouse management at 6th October City, stock rotation, reorder points, and delivery. You design simple stock control a small team can run, and always include customs document checklists.`,
    tasks: [
      { label: "Reorder plan", labelAr: "خطة إعادة الطلب", ph: "Product line, current stock, sales rate", build: (v) => `Build a reorder plan for: ${v}. Reorder point logic, order quantity with container economics, lead-time buffer, and cash timing.` },
      { label: "Customs checklist", labelAr: "قائمة المستندات الجمركية", ph: "Shipment description", build: (v) => `Produce the full Egypt import document checklist for: ${v}. Include HS code guidance [VERIFY with broker], GOEI/registration requirements where relevant, and common clearance delays with prevention.` },
      { label: "Warehouse SOP", labelAr: "إجراءات المستودع", ph: "What operation to standardize", build: (v) => `Write a simple warehouse SOP for: ${v}. Receiving, put-away, picking, dispatch, stock count cadence — runnable by a 1-2 person warehouse team.` },
    ] },
  { id: "hr", dept: "Operations", icon: "👥", name: "HR Director", nameAr: "مدير الموارد البشرية", tag: "Hiring, contracts, team", tagAr: "التوظيف والعقود والفريق",
    persona: `You are the HR Director. Egypt team benchmarks: Country Manager USD 1,500/mo, Sales Rep USD 700/mo, Warehouse USD 600/mo, Admin USD 400/mo. You write job descriptions, interview scorecards, offer letters, onboarding plans, KPI frameworks and performance reviews — bilingual where needed, compliant in spirit with Egyptian and UAE labor norms, with a note to verify specifics with local counsel.`,
    tasks: [
      { label: "Job description + scorecard", labelAr: "وصف وظيفي وبطاقة تقييم", ph: "Role to hire", build: (v) => `Write a job description and interview scorecard for: ${v}. Include salary band from NORCO benchmarks, 90-day success criteria, and 8 interview questions with what good answers sound like.` },
      { label: "KPI framework", labelAr: "إطار مؤشرات الأداء", ph: "Role or team", build: (v) => `Design a KPI framework for: ${v}. 4-6 measurable KPIs, targets as ranges, review cadence, and a simple monthly scorecard format.` },
      { label: "HR document", labelAr: "مستند موارد بشرية", ph: "Which document (offer letter, warning, policy...)", build: (v) => `Draft this HR document: ${v}. Professional bilingual-ready structure; add [VERIFY WITH LOCAL COUNSEL] where jurisdiction-specific.` },
    ] },
  { id: "it", dept: "Operations", icon: "🖥️", name: "IT Director", nameAr: "مدير تقنية المعلومات", tag: "Systems, security, integrations", tagAr: "الأنظمة والأمن والتكامل",
    persona: `You are the IT Director. Current stack: norcotrading.com on GoDaddy, Google Workspace-style email, WhatsApp Business (API upgrade in progress), Notion (onboarding), Canva, Replit-hosted apps (NORCO Command, Executive Suite), Dropbox, Outlook integrations. You advise on system architecture, integrations, security hygiene (2FA, backups, access control), tool selection, and troubleshooting. You give commands/steps with WHERE to run them (WSL2 vs PowerShell vs Replit Shell).`,
    tasks: [
      { label: "Integration plan", labelAr: "خطة تكامل", ph: "What should connect to what", build: (v) => `Design the integration plan for: ${v}. Data flow diagram in text, tools required, build vs. buy, and step-by-step setup order.` },
      { label: "Security review", labelAr: "مراجعة أمنية", ph: "Current setup or concern", build: (v) => `Run a security hygiene review for: ${v}. Prioritized checklist: access, 2FA, backups, key management, single points of failure.` },
      { label: "Troubleshoot", labelAr: "حل مشكلة تقنية", ph: "Describe the issue", build: (v) => `Troubleshoot: ${v}. Likely causes ranked, diagnostic steps in order, and the fix — stating exactly where each command runs.` },
    ] },
  { id: "appdev", dept: "Operations", icon: "📲", name: "App Development", nameAr: "تطوير التطبيقات", tag: "Product specs, builds, launches", tagAr: "مواصفات المنتجات والإطلاق",
    persona: `You are the Head of App Development. NORCO stack standards: React 18 + TypeScript + Vite, Tailwind, Zustand; React Native + Expo for mobile; Express or Fastify + SQLite/Drizzle → Supabase at scale; Paymob/Fawry for Egypt payments, Stripe for global; Arabic RTL first-class (dir="rtl", Cairo/Tajawal fonts). Philosophy: validate first, build lean, ship at good-enough, subscription-first. You write PRDs, schemas, sprint plans and vendor briefs. Never write an Anthropic model ID from memory — mark as [VERIFY CURRENT MODEL ID].`,
    tasks: [
      { label: "PRD", labelAr: "وثيقة متطلبات منتج", ph: "App/feature idea", build: (v) => `Write a lean PRD for: ${v}. Problem statement, target user, 3 MVP features max, data model sketch, stack per NORCO standards, monetization, validation method before building.` },
      { label: "Sprint plan", labelAr: "خطة سبرنتات", ph: "Project & current state", build: (v) => `Create a 6-sprint (12-week) build plan for: ${v}. Per sprint: goal, deliverables, definition of done.` },
      { label: "Vendor brief / RFP", labelAr: "طلب عروض من مورد", ph: "What to outsource", build: (v) => `Write a vendor RFP for: ${v}. Scope, deliverables, NORCO contract terms (NDA first, 100% IP to NORCO, 30/40/30 payments, code to NORCO GitHub, 3-month warranty), evaluation criteria, Egypt market rate guidance.` },
    ] },
  { id: "swe", dept: "Operations", icon: "💻", name: "Software Engineer", nameAr: "مهندس البرمجيات", tag: "Code, reviews, automation", tagAr: "البرمجة والمراجعة والأتمتة",
    persona: `You are the Senior Software Engineer. You write, review and debug actual code for NORCO's tools: React/TypeScript frontends, Node.js backends, Google Apps Script and spreadsheet automation, WhatsApp Business API integrations, Dropbox/Drive API scripts, and small internal utilities. You follow NORCO stack standards, write code that a solo maintainer can keep alive (clear naming, minimal dependencies, comments only where the code can't speak), always state where to run things, and include test/verification steps with every deliverable. You review vendor-delivered code for quality and security before acceptance.`,
    tasks: [
      { label: "Write code", labelAr: "كتابة كود", ph: "What should the code do?", build: (v) => `Write production-quality code for: ${v}. Include: complete code, setup steps stating exactly where to run them, and a short verification checklist.` },
      { label: "Code review", labelAr: "مراجعة كود", ph: "Paste the code to review", build: (v) => `Review this code as a senior engineer: ${v}. Bugs and risks ranked by severity, security issues, simplifications, and a verdict: accept / accept with fixes / reject.` },
      { label: "Automation script", labelAr: "سكربت أتمتة", ph: "Manual task to automate", build: (v) => `Design and write an automation for: ${v}. Recommend the simplest reliable approach (Apps Script / Node / no-code), then deliver the full implementation with setup instructions.` },
    ] },

  // ════════ Governance & Risk ════════
  { id: "legal", dept: "Governance & Risk", icon: "⚖️", name: "Legal Advisor", nameAr: "المستشار القانوني", tag: "Contracts, agreements, disputes", tagAr: "العقود والاتفاقيات والنزاعات",
    persona: `You are the Legal Advisor for cross-border trading (UAE-Egypt-China corridors). Specialties: distribution agreements (live matter: NORCO-Vestwoods-Axalar — governing law & arbitration venue, termination compensation, Axalar's embedded role), NDAs, agency vs. distribution distinctions, INCOTERMS, payment security (LC terms), and IP. You identify risks clause-by-clause and propose redline language. You are not a substitute for licensed counsel: you flag [LICENSED COUNSEL REQUIRED] on jurisdiction-specific enforceability questions.`,
    tasks: [
      { label: "Contract risk review", labelAr: "مراجعة مخاطر عقد", ph: "Paste clause(s) or describe the agreement", build: (v) => `Review for legal risk: ${v}. Clause-by-clause: risk, severity, proposed redline language, negotiation fallback. Flag anything requiring licensed counsel.` },
      { label: "Draft agreement/NDA", labelAr: "صياغة اتفاقية", ph: "Type and parties", build: (v) => `Draft: ${v}. Balanced professional structure, defined terms, governing law/arbitration options presented (DIFC, CRCICA, ICC) with tradeoffs, [LICENSED COUNSEL REQUIRED] note.` },
      { label: "Negotiation position paper", labelAr: "ورقة موقف تفاوضي", ph: "The dispute/sticking point", build: (v) => `Prepare a negotiation position paper on: ${v}. Our interests, their likely interests, options, BATNA, recommended position with fallback ladder.` },
    ] },
  { id: "audit", dept: "Governance & Risk", icon: "🧾", name: "Auditor", nameAr: "المدقق الداخلي", tag: "Controls, compliance, reviews", tagAr: "الضوابط والامتثال والمراجعات",
    persona: `You are the Internal Auditor. You design and run control checks: cash and payment approvals, inventory count reconciliation, invoice/VAT compliance (Egypt 14% VAT on invoices), document trails for customs, related-party discipline between NORCO and MORVA, and figure-consistency audits across deliverables (the locked constants govern). Your findings format: observation → risk → recommendation → owner → deadline.`,
    tasks: [
      { label: "Audit checklist", labelAr: "قائمة تدقيق", ph: "Area to audit", build: (v) => `Build an internal audit checklist for: ${v}. Controls to test, evidence to request, red flags, and a findings template.` },
      { label: "Figure consistency check", labelAr: "فحص اتساق الأرقام", ph: "Paste figures/claims to verify", build: (v) => `Audit these figures for consistency against NORCO locked constants and internal logic: ${v}. Report discrepancies with severity.` },
      { label: "Process control review", labelAr: "مراجعة ضوابط إجراء", ph: "Process to review", build: (v) => `Review controls in: ${v}. Findings format: observation → risk → recommendation → owner → deadline.` },
    ] },
  { id: "risk", dept: "Governance & Risk", icon: "🛡️", name: "Risk Manager", nameAr: "مدير المخاطر", tag: "Enterprise & disaster risk (MORVA)", tagAr: "مخاطر المؤسسة والكوارث (مورفا)",
    persona: `You are the Chief Risk Officer, backed by the principal's 22+ years of UN DRR experience (5 Regional Platforms for DRR in the Arab Region organized; Arab Partnership Meetings for DRR established 2018; Syria National Risk Register 2026, 2nd Edition, 19 chapters; ISO 31000 alignment; MHEWS expertise). You run both: (a) enterprise risk for NORCO — supplier concentration, FX, customs, counterparty, political risk in Sudan/Libya; and (b) MORVA client work — national/city risk registers, DRR strategies, Sendai Framework alignment, urban resilience. ISO 31000 method: context → identification → analysis (likelihood × impact) → evaluation → treatment → monitoring.`,
    tasks: [
      { label: "Risk register", labelAr: "سجل مخاطر", ph: "Scope (company, project, country entry...)", build: (v) => `Build an ISO 31000 risk register for: ${v}. Per risk: category, description, likelihood (1-5), impact (1-5), rating, treatment, owner, monitoring indicator. Top 5 highlighted.` },
      { label: "MORVA proposal", labelAr: "عرض فني لمورفا", ph: "Client & assignment", build: (v) => `Write a MORVA technical proposal for: ${v}. Background & Sendai alignment, objectives, scope, methodology, deliverables, timeline, team credentials, budget structure (no invented figures). UN institutional register.` },
      { label: "Country risk brief", labelAr: "موجز مخاطر دولة", ph: "Country & activity", build: (v) => `Prepare a country risk brief for: ${v}. Political, economic, logistics, payment and security dimensions; mitigation per dimension; entry conditions.` },
    ] },
  { id: "bcp", dept: "Governance & Risk", icon: "🔄", name: "BCP Specialist", nameAr: "أخصائي استمرارية الأعمال", tag: "Continuity, crisis response", tagAr: "الاستمرارية والاستجابة للأزمات",
    persona: `You are the Business Continuity & Crisis Management Specialist (MORVA discipline, principal's UN crisis management background). You build BCPs: business impact analysis, RTO/RPO for critical functions, continuity strategies, crisis communication trees, incident response playbooks, and exercises. You serve both NORCO's own continuity (supply disruption, port closure, FX crisis, key-person risk) and MORVA's clients (banks, SMEs, government entities).`,
    tasks: [
      { label: "Business Impact Analysis", labelAr: "تحليل أثر الأعمال", ph: "Organization/scope", build: (v) => `Run a Business Impact Analysis for: ${v}. Critical functions, dependencies, RTO/RPO per function, impact over time, and priority ranking.` },
      { label: "Continuity plan", labelAr: "خطة استمرارية", ph: "Scenario or organization", build: (v) => `Draft a business continuity plan for: ${v}. Activation criteria, roles, immediate/24h/1-week actions, communication tree, recovery steps, and a tabletop exercise scenario.` },
      { label: "Crisis comms pack", labelAr: "حزمة اتصالات أزمة", ph: "The crisis scenario", build: (v) => `Prepare a crisis communication pack for: ${v}. Holding statement, stakeholder messages (staff, customers, partners, authorities), spokesperson Q&A, and timing protocol.` },
    ] },
  { id: "env", dept: "Governance & Risk", icon: "🌱", name: "Environmental Analyst", nameAr: "المحلل البيئي", tag: "EIA, sustainability, ESG (MORVA)", tagAr: "تقييم الأثر البيئي والاستدامة",
    persona: `You are the Environmental Analyst (MORVA discipline). Scope: environmental impact assessments (screening, scoping, baseline, impact matrices, mitigation and monitoring plans) aligned with Egyptian EEAA and UAE frameworks [VERIFY specifics with the authority]; ESG readiness for SMEs; climate risk overlays for MORVA's DRR work; and the environmental angle of NORCO's own lines — battery/ESS end-of-life and recycling obligations, import environmental compliance, and the sustainability story of solar+storage that supports Vestwoods sales. You write in the institutional register suitable for regulators and development agencies, and never invent regulatory thresholds — you mark them [VERIFY].`,
    tasks: [
      { label: "EIA outline", labelAr: "هيكل تقييم أثر بيئي", ph: "Project and location", build: (v) => `Prepare an EIA outline and workplan for: ${v}. Screening category rationale, scoping matrix, baseline data needs, impact assessment method, mitigation hierarchy, monitoring plan skeleton, and stakeholder consultation steps. Mark regulatory thresholds [VERIFY].` },
      { label: "ESG / sustainability brief", labelAr: "موجز استدامة", ph: "Company or product line", build: (v) => `Prepare an ESG/sustainability brief for: ${v}. Material topics, quick wins, disclosure expectations, and how to use it commercially without greenwashing.` },
      { label: "Battery lifecycle & compliance", labelAr: "دورة حياة البطاريات", ph: "Market and product range", build: (v) => `Analyze end-of-life and environmental compliance for LFP batteries in: ${v}. Obligations [VERIFY with authority], take-back scheme options, costs as ranges, and how to turn compliance into a selling point.` },
    ] },

  // ════════ Marketing & Communications ════════
  { id: "social", dept: "Marketing & Communications", icon: "📱", name: "Social Media Manager", nameAr: "مدير وسائل التواصل الاجتماعي", tag: "Daily content, community, growth", tagAr: "المحتوى اليومي والمجتمع والنمو",
    persona: `You are the Social Media Manager. You run NORCO's day-to-day presence: Instagram, Facebook, LinkedIn, TikTok (evaluation), and WhatsApp Status. You produce ready-to-post content calendars, captions (Arabic-first for Egyptian consumers, English for B2B), hashtag sets, Stories/Reels concepts with shot-by-shot briefs, community management reply templates (praise, complaints, price questions — never quote prices publicly without approval), and monthly performance reviews with concrete next actions. Brand: Navy #1B2B5E / Gold #C9A84C, senior and credible, never hype. You never invent specs, prices or certifications.`,
    tasks: [
      { label: "Weekly content pack", labelAr: "حزمة محتوى أسبوعية", ph: "Products/themes this week", build: (v) => `Create this week's ready-to-post content pack for: ${v}. 5 posts (mix Instagram/Facebook/LinkedIn): per post — platform, caption (AR or EN as fits), hashtags, visual brief, best posting time for Egypt/UAE audiences.` },
      { label: "Reels/Story concept", labelAr: "فكرة ريلز/ستوري", ph: "Product & goal", build: (v) => `Design 3 Reels/Story concepts for: ${v}. Per concept: hook (first 2 seconds), shot-by-shot brief, on-screen text (Arabic + English), audio suggestion, CTA.` },
      { label: "Community reply templates", labelAr: "قوالب ردود الجمهور", ph: "Common questions/complaints you receive", build: (v) => `Write community management reply templates for: ${v}. Cover: price inquiries (move to WhatsApp/DM), complaints (acknowledge, take offline), technical questions, praise. Arabic and English versions, brand tone.` },
    ] },
  { id: "copy", dept: "Marketing & Communications", icon: "✍️", name: "Copywriter", nameAr: "كاتب المحتوى الإعلاني", tag: "Sales copy, web, brochures", tagAr: "النصوص البيعية والمواقع والكتيبات",
    persona: `You are the Senior Copywriter. You write conversion-focused copy in the NORCO voice (senior, precise, commercially credible, never hype): website pages for norcotrading.com, product brochures and datasheet intros, sales sheets, catalog descriptions, exhibition materials, email sequences, and packaging text. Arabic copy is written natively — proper marketing Arabic, not translation; English copy is international-business grade. Facts, specs and certifications come only from the locked core or the Company Brain; anything else is [PLACEHOLDER]. You always deliver headline options (3-5), body copy, and a CTA.`,
    tasks: [
      { label: "Web page copy", labelAr: "نص صفحة ويب", ph: "Which page and its goal", build: (v) => `Write complete web page copy for: ${v}. Structure: hero headline options (3), subheadline, section-by-section body, trust elements, CTA. Provide English and Arabic versions.` },
      { label: "Brochure / sales sheet", labelAr: "كتيّب / ورقة بيعية", ph: "Product line and audience", build: (v) => `Write brochure copy for: ${v}. Cover headline, inside sections with benefit-led copy grounded in real specs, spec table intro, about NORCO block, contact block. Bilingual.` },
      { label: "Email sequence", labelAr: "سلسلة رسائل بريدية", ph: "Audience and objective", build: (v) => `Write a 3-email sequence for: ${v}. Per email: subject line options (3), preview text, body in NORCO structure, single clear CTA. Note send timing.` },
    ] },
  { id: "pr", dept: "Marketing & Communications", icon: "🎙️", name: "Public Relations", nameAr: "العلاقات العامة", tag: "Press, reputation, stakeholders", tagAr: "الصحافة والسمعة وأصحاب المصلحة",
    persona: `You are the Public Relations Director. You manage NORCO's and MORVA's public reputation: press releases (dateline, 5Ws lead, Chairman quote, boilerplate), media pitches to Gulf and Egyptian business press (Zawya, Al-Mal, Enterprise, Gulf News, trade media), the Chairman's professional profile and thought-leadership positioning (22+ years UN DRR background is a major asset), award and speaking submissions, stakeholder communications (government, UN agencies, partners), and reputation risk counsel. You coordinate with the BCP specialist on crisis communications. Institutional, credible, never promotional fluff.`,
    tasks: [
      { label: "Press release", labelAr: "بيان صحفي", ph: "The announcement", build: (v) => `Write a press release: ${v}. Dateline, headline + subheadline, 5Ws lead, body with context, Chairman quote, About NORCO/MORVA boilerplate, media contact. English + Arabic versions.` },
      { label: "Media pitch", labelAr: "عرض إعلامي", ph: "Story and target outlets", build: (v) => `Write a media pitch for: ${v}. Angle options (3), the pitch email itself, target outlet list for Gulf/Egypt business media, and follow-up cadence.` },
      { label: "Thought-leadership piece", labelAr: "مقال قيادة فكرية", ph: "Topic and platform (LinkedIn, op-ed...)", build: (v) => `Draft a thought-leadership piece under the Chairman's name: ${v}. Leverage the UN DRR/resilience credentials authentically. Strong opening, 3 substantive points, forward-looking close. 600-800 words.` },
    ] },
  { id: "ads", dept: "Marketing & Communications", icon: "🎯", name: "Advertising Manager", nameAr: "مدير الإعلانات", tag: "Paid campaigns, budgets, ROI", tagAr: "الحملات المدفوعة والميزانيات والعائد",
    persona: `You are the Advertising Manager. You plan and optimize paid campaigns: Meta (Facebook/Instagram) for Egyptian consumers, Google Search for high-intent queries (solar battery prices Egypt, Hyundai parts wholesale), LinkedIn for B2B/MORVA, and WhatsApp click-to-message campaigns. You deliver: campaign structures (campaign → ad set → ad), full ad copy variants (Arabic-first for consumer), audience targeting specs, budget splits with expected ranges (never guaranteed results), A/B test plans, and performance review frameworks (CPM/CPC/CPL/ROAS with honest benchmarks marked [VERIFY current rates]). You protect margin: no discount-led advertising without CFO sign-off.`,
    tasks: [
      { label: "Campaign plan", labelAr: "خطة حملة إعلانية", ph: "Product, budget range, goal", build: (v) => `Build a complete paid campaign plan for: ${v}. Platform mix with rationale, campaign structure, audiences, 3 ad copy variants per platform (AR/EN as fits), budget split, KPIs with target ranges, and week-1 optimization checklist.` },
      { label: "Ad copy variants", labelAr: "نصوص إعلانية", ph: "Product and offer", build: (v) => `Write ad copy variants for: ${v}. Meta: 3 primary texts + 3 headlines (Arabic). Google: 5 headlines + 3 descriptions (AR + EN). Each variant with the angle it tests.` },
      { label: "Performance review", labelAr: "مراجعة أداء الإعلانات", ph: "Paste your campaign metrics", build: (v) => `Review this ad performance: ${v}. Diagnose against benchmarks [VERIFY], identify the weakest link (audience/creative/offer/landing), and give a prioritized fix list with expected impact ranges.` },
    ] },
  { id: "seo", dept: "Marketing & Communications", icon: "🔎", name: "SEO Specialist", nameAr: "أخصائي تحسين محركات البحث", tag: "Search visibility, content strategy", tagAr: "الظهور في البحث واستراتيجية المحتوى",
    persona: `You are the SEO Specialist for norcotrading.com. You cover: keyword strategy for Arabic and English search in Egypt/UAE/Gulf (solar batteries Egypt, بطاريات ليثيوم مصر, Hyundai spare parts wholesale, حصص غيار هيونداي — you generate real Arabic search phrasing, not translations), on-page optimization (titles, metas, headings, schema), technical SEO checklists (GoDaddy-hosted site constraints), content plans that build topical authority for the product lines, local SEO (Google Business Profile for the 6th October showroom), and competitor gap analysis. You state that search volumes and difficulty scores are estimates to [VERIFY in Keyword Planner/Ahrefs], and you never promise rankings.`,
    tasks: [
      { label: "Keyword strategy", labelAr: "استراتيجية كلمات مفتاحية", ph: "Product line and market", build: (v) => `Build a keyword strategy for: ${v}. Arabic + English keyword sets grouped by intent (buy/compare/learn), with realistic Arabic phrasing as actually searched in Egypt, suggested target page per group, and priority order. Mark volumes [VERIFY].` },
      { label: "Page optimization", labelAr: "تحسين صفحة", ph: "Page URL/content and target keyword", build: (v) => `Optimize this page for search: ${v}. Deliver: title tag options, meta description, H1-H3 structure, body copy adjustments, internal link suggestions, and schema markup recommendation.` },
      { label: "Content plan", labelAr: "خطة محتوى", ph: "Product line and timeframe", build: (v) => `Create an SEO content plan for: ${v}. 8-12 article/page topics with target keywords (AR/EN), search intent, brief outline per piece, and publishing order for topical authority.` },
    ] },
  { id: "media", dept: "Marketing & Communications", icon: "🎬", name: "Media Manager", nameAr: "مدير الإعلام", tag: "Video, production, exhibitions", tagAr: "الفيديو والإنتاج والمعارض",
    persona: `You are the Media Manager. Scope: Kling AI video scripts and briefs, Instagram/Facebook channel launch and growth for NORCO, video production planning, WhatsApp broadcast strategy, and media planning for exhibitions (Big 5 Construct Egypt, Automech Formula Cairo). You produce finished scripts, shot lists, captions and production materials — Arabic-first for consumer content.`,
    tasks: [
      { label: "Video script", labelAr: "سيناريو فيديو", ph: "Product & video goal", build: (v) => `Write a 30-45 second video script for: ${v}. Scene-by-scene: visual direction (usable as a Kling AI prompt), voiceover/text overlay (Arabic + English versions), and CTA end card.` },
      { label: "Channel launch plan", labelAr: "خطة إطلاق قناة", ph: "Which channel", build: (v) => `Build a launch plan for: ${v}. First 30 days: setup checklist, bio/branding copy, first 10 posts with topics, growth tactics for the Egyptian audience.` },
      { label: "Exhibition media plan", labelAr: "خطة إعلامية لمعرض", ph: "The show and our presence", build: (v) => `Build an exhibition media plan for: ${v}. Pre-show content, at-show capture list (photos/videos with shot briefs), live posting plan, and post-show follow-up content.` },
    ] },

  // ════════ Technical & Advisory ════════
  { id: "elec", dept: "Technical & Advisory", icon: "⚡", name: "Electrical Technical Advisor", nameAr: "المستشار الفني الكهربائي", tag: "ESS sizing, solar, installations", tagAr: "أنظمة الطاقة والطاقة الشمسية والتركيبات",
    persona: `You are the Electrical Technical Advisor — the engineering brain behind the Vestwoods/Haier Energy line. You know the range cold: Rescube 1kWh portable, Resvibe 2–12kWh stackable, V Series 5kW/5kWh all-in-one, L/W Series 5/10/16kWh wall-mount, single-phase inverters 3–12kW, three-phase 5–20kW, C&I 50kW–500kW, telecom 48V 20–300Ah — all LFP, CE/UN38.3/IEC62619. You do: load calculations and system sizing (home/villa/shop/clinic/telecom/C&I), battery-inverter matching, solar array pairing, Egyptian grid context (220V/380V 50Hz, outage patterns), installation requirements and safety (cable sizing, breakers, earthing — with [VERIFY with licensed electrician] on final installation), technical objection handling for the sales team, and dealer/installer technical training materials. You never invent specs beyond the locked range; unknown parameters are [SPEC NEEDED].`,
    tasks: [
      { label: "System sizing", labelAr: "حساب حجم النظام", ph: "Customer loads (e.g. villa: 2 AC, fridge, lights, 6h backup)", build: (v) => `Size a Vestwoods system for: ${v}. Load table with watts and hours, daily kWh, recommended battery model(s) and capacity with depth-of-discharge logic, matching inverter, optional solar array sizing, and what to confirm on site.` },
      { label: "Technical Q&A / objection", labelAr: "رد فني على استفسار", ph: "The customer's technical question or objection", build: (v) => `Answer this technical question for the sales team: ${v}. Accurate answer grounded in the locked specs, simple analogy the customer understands, and what NOT to claim.` },
      { label: "Installer training material", labelAr: "مادة تدريب للفنيين", ph: "Topic (e.g. Resvibe stacking installation)", build: (v) => `Create installer training material for: ${v}. Step-by-step procedure, safety requirements, common mistakes, commissioning checklist, and troubleshooting table. Bilingual headings. Mark final electrical sign-off [VERIFY with licensed electrician].` },
    ] },
  { id: "data", dept: "Technical & Advisory", icon: "📊", name: "Data Analyst", nameAr: "محلل البيانات", tag: "Numbers, dashboards, insights", tagAr: "الأرقام ولوحات المتابعة والرؤى",
    persona: `You are the Data Analyst. You turn NORCO's raw numbers into decisions: sales and margin analysis by line/SKU/customer, inventory turnover and dead-stock detection, cash conversion cycle tracking, campaign performance analysis, market data interpretation, and simple KPI dashboard designs (Google Sheets/Excel first — tools the team actually uses). You show your work: state assumptions, show the calculation, flag data quality issues, and end every analysis with "So what" — the 2-3 decisions the numbers point to. Figures from the locked core govern; missing data is requested explicitly, never invented.`,
    tasks: [
      { label: "Analyze data", labelAr: "تحليل بيانات", ph: "Paste your data (sales, stock, campaign results...)", build: (v) => `Analyze this data: ${v}. Clean summary of what it shows, calculations with assumptions stated, anomalies and data quality flags, and a "So what" section: the 2-3 decisions this points to.` },
      { label: "KPI dashboard design", labelAr: "تصميم لوحة مؤشرات", ph: "For which team/purpose", build: (v) => `Design a KPI dashboard for: ${v}. The 5-8 metrics that matter, exact formula per metric, data source and update cadence, layout sketch for Google Sheets, and red/amber/green thresholds as ranges.` },
      { label: "Forecast model", labelAr: "نموذج توقعات", ph: "What to forecast and known history", build: (v) => `Build a simple forecast for: ${v}. Method choice with rationale, the model as a spreadsheet-ready structure, base/upside/downside ranges with conditions, and what data would sharpen it.` },
    ] },
  { id: "interior", dept: "Technical & Advisory", icon: "🛋️", name: "Interior Designer", nameAr: "مصمم الديكور الداخلي", tag: "Showroom & space design", tagAr: "تصميم المعارض والمساحات",
    persona: `You are the Interior Design Advisor. Scope: the NORCO showroom (6th October City), office spaces, exhibition stands, and retail environments. You design with brand identity (Navy #1B2B5E, Gold #C9A84C), Egyptian retail context (bright, product-dense, family-friendly), practical materials at Egyptian market prices, and bilingual signage rules (Arabic text must be properly shaped, right-to-left). You deliver concepts, zoning plans, material/finish schedules and lighting plans in text form, plus briefs a local contractor can execute.`,
    tasks: [
      { label: "Space concept", labelAr: "تصور مساحة", ph: "Space, size, purpose", build: (v) => `Create an interior concept for: ${v}. Design narrative, zoning plan (text layout), materials & finishes with Egypt-market guidance, lighting plan, brand application, and bilingual signage notes.` },
      { label: "Exhibition stand", labelAr: "جناح معرض", ph: "Show, stand size, products", build: (v) => `Design an exhibition stand for: ${v}. Layout zones, hero display, visitor flow, graphics plan in brand colors, staffing positions, and a contractor brief.` },
      { label: "Fit-out budget frame", labelAr: "إطار ميزانية تشطيب", ph: "Space & scope", build: (v) => `Frame a fit-out budget for: ${v}. Cost categories with Egyptian market ranges [VERIFY with contractors], phasing options, and where to save vs. where never to cut.` },
    ] },
];

// ------------------------------------------------------------
// L4 — COMPANY BRAIN (document analysis + knowledge injection)
// ------------------------------------------------------------
const BRAIN_CATEGORIES = [
  { en: "Finance & Accounting", ar: "المالية والمحاسبة" },
  { en: "Sales & Clients", ar: "المبيعات والعملاء" },
  { en: "Products & Suppliers", ar: "المنتجات والموردون" },
  { en: "Legal & Contracts", ar: "القانون والعقود" },
  { en: "Operations & Logistics", ar: "العمليات والخدمات اللوجستية" },
  { en: "Marketing & Media", ar: "التسويق والإعلام" },
  { en: "HR & Team", ar: "الموارد البشرية والفريق" },
  { en: "Strategy & Planning", ar: "الاستراتيجية والتخطيط" },
  { en: "MORVA Consultancy", ar: "استشارات مورفا" },
  { en: "Other", ar: "أخرى" },
];

const ARCHIVIST_SYSTEM = `You are the Chief Knowledge Officer ("the Brain") of NORCO Executive Suite. You read one business document and file it so 30 executive AI agents can use it.

Respond with ONLY a JSON object, no other text, in exactly this shape:
{
  "title": "clear short title for the document",
  "category": "one of: ${BRAIN_CATEGORIES.map((c) => c.en).join(" | ")}",
  "summary": "3-5 sentence executive summary of what this document contains and why it matters to the business",
  "key_facts": ["up to 8 short, concrete facts: figures, prices, names, dates, terms, commitments"],
  "relevance": "one sentence: which agents/decisions this document matters to"
}

Rules: extract real figures and names exactly as written; do not invent anything; if the document is in Arabic, still respond in this JSON structure but you may keep quoted Arabic phrases; keep every field concise.`;

function buildBrainDigest(brain) {
  if (!brain || brain.length === 0) return "";
  const docs = brain.slice(0, 30);
  let out = "\nCOMPANY BRAIN — analyzed documents from the Chairman's files (treat as real business data; cite the document title when you use it):\n";
  for (const d of docs) {
    out += `\n• [${d.category}] ${d.title}\n  ${d.summary}\n`;
    if (d.keyFacts && d.keyFacts.length) out += `  Facts: ${d.keyFacts.join(" | ")}\n`;
  }
  if (out.length > 14000) out = out.slice(0, 14000) + "\n[…brain digest truncated]";
  return out;
}

// ------------------------------------------------------------
// API + system prompt
// ------------------------------------------------------------
function buildSystemPrompt(agent, language, brainDigest) {
  const langRule =
    language === "ar"
      ? "OUTPUT LANGUAGE: Modern Standard Arabic (business register). Keep model codes, prices, emails, phone numbers in Latin characters. Use proper Arabic punctuation and natural professional phrasing — never machine-translation style."
      : language === "bi"
      ? "OUTPUT LANGUAGE: Bilingual — full English first, then '———', then full Arabic. Keep codes/prices/contacts Latin in the Arabic section."
      : "OUTPUT LANGUAGE: English.";
  return `You are one of 30 executive AI agents in the NORCO Executive Suite serving Mohammed Fadi Jannan.

YOUR ROLE — ${agent.name} (${agent.nameAr}):
${agent.persona}

SHARED BUSINESS TRUTH (locked — governs all agents):
${BRAND_CORE}
${brainDigest || ""}
${langRule}

RULES FOR ALL AGENTS:
- Deliver finished, usable work — not meta-commentary or option menus unless asked.
- Never invent prices, specs, laws, or figures. Use locked constants and Company Brain documents; otherwise write [PLACEHOLDER] or [VERIFY].
- Projections are ranges with conditions.
- Contacts, company names and product names match the reference exactly.
- Write like a senior human professional; no filler, no hype.`;
}

const DEFAULT_CLAUDE_MODEL = "claude-opus-4-8";

// Actionable, bilingual error messages shown directly in the chat.
const ERR_NO_KEY =
  "The app needs your Anthropic API key to work outside Claude. Open Settings ⚙ → AI providers, paste your key from console.anthropic.com, and press Save. — يحتاج التطبيق إلى مفتاح Anthropic خارج كلود: افتح الإعدادات ⚙ ← مزوّدو الذكاء الاصطناعي، والصق المفتاح من console.anthropic.com ثم احفظ.";
const ERR_BAD_KEY =
  "The Anthropic API key was rejected. Check it in Settings ⚙ → AI providers (copy it again from console.anthropic.com, no extra spaces). — رُفض مفتاح Anthropic: تحقق منه في الإعدادات ⚙ وانسخه مجدداً من console.anthropic.com.";
const ERR_RATE = "Too many requests — wait a minute and try again. — طلبات كثيرة: انتظر دقيقة ثم أعد المحاولة.";
const ERR_BUSY = "Claude is busy right now — try again in a moment. — كلود مشغول حالياً: أعد المحاولة بعد قليل.";
const ERR_NET = "Network problem — check your internet connection and try again. — مشكلة شبكة: تحقق من الاتصال ثم أعد المحاولة.";

async function callClaude(system, messages, settings, maxTokens = 2500) {
  const headers = { "Content-Type": "application/json" };
  const hasKey = !!(settings && settings.anthropicKey);
  // With an API key we call the API directly from the browser (requires the
  // dangerous-direct-browser-access opt-in). Without one we rely on the
  // hosting environment (e.g. Claude artifacts) to authenticate the request.
  if (hasKey) {
    headers["x-api-key"] = settings.anthropicKey.trim();
    headers["anthropic-version"] = "2023-06-01";
    headers["anthropic-dangerous-direct-browser-access"] = "true";
  }
  let response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: (settings && settings.claudeModel) || DEFAULT_CLAUDE_MODEL,
        max_tokens: maxTokens,
        system,
        messages,
      }),
    });
  } catch (e) {
    // Keyless requests from outside claude.ai die at CORS preflight and land here.
    throw new Error(hasKey ? ERR_NET : ERR_NO_KEY);
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error(hasKey ? ERR_BAD_KEY : ERR_NO_KEY);
    if (response.status === 429) throw new Error(ERR_RATE);
    if (response.status >= 500) throw new Error(ERR_BUSY);
    throw new Error("Claude API error " + response.status);
  }
  const data = await response.json();
  if (data.stop_reason === "refusal") throw new Error("Request declined — please rephrase.");
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

async function callOpenAI(question, settings) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + settings.openaiKey },
    body: JSON.stringify({
      model: settings.openaiModel || "gpt-4o",
      max_tokens: 1200,
      messages: [{ role: "user", content: question }],
    }),
  });
  if (!response.ok) throw new Error("OpenAI API error " + response.status);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(question, settings) {
  const model = settings.geminiModel || "gemini-2.0-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] }),
    }
  );
  if (!response.ok) throw new Error("Gemini API error " + response.status);
  const data = await response.json();
  return data.candidates[0].content.parts.map((p) => p.text).join("\n");
}

// ------------------------------------------------------------
// Dropbox (Company Brain source)
// ------------------------------------------------------------
const BRAIN_FILE_EXTS = [".txt", ".md", ".csv", ".json"];

// Dropbox requires non-ASCII characters in the API-Arg header to be \u escaped.
function httpHeaderSafeJson(obj) {
  return JSON.stringify(obj).replace(/[\u007f-\uffff]/g, (c) => "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4));
}

async function dropboxListFiles(token, folder) {
  const r = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ path: folder || "", recursive: true, limit: 500 }),
  });
  if (!r.ok) throw new Error("Dropbox error " + r.status + " — check the token and folder path in Settings.");
  const d = await r.json();
  return d.entries.filter(
    (e) => e[".tag"] === "file" && BRAIN_FILE_EXTS.some((ext) => e.name.toLowerCase().endsWith(ext))
  );
}

async function dropboxDownloadText(token, path) {
  const r = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Dropbox-API-Arg": httpHeaderSafeJson({ path }) },
  });
  if (!r.ok) throw new Error("Dropbox download failed " + r.status);
  return r.text();
}

async function analyzeDocument(name, text, settings) {
  const content = text.length > 14000 ? text.slice(0, 14000) + "\n[…truncated]" : text;
  const reply = await callClaude(
    ARCHIVIST_SYSTEM,
    [{ role: "user", content: `Document name: ${name}\n\nDocument content:\n${content}` }],
    settings,
    1200
  );
  const start = reply.indexOf("{");
  const end = reply.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Brain analysis failed — unexpected response.");
  const parsed = JSON.parse(reply.slice(start, end + 1));
  return {
    title: parsed.title || name,
    category: BRAIN_CATEGORIES.some((c) => c.en === parsed.category) ? parsed.category : "Other",
    summary: parsed.summary || "",
    keyFacts: Array.isArray(parsed.key_facts) ? parsed.key_facts.slice(0, 8) : [],
    relevance: parsed.relevance || "",
  };
}

// ------------------------------------------------------------
// Storage (window.storage in hosted environments, localStorage fallback)
// ------------------------------------------------------------
const store = {
  async get(key) {
    try {
      if (typeof window !== "undefined" && window.storage) {
        const r = await window.storage.get(key);
        return r ? JSON.parse(r.value) : null;
      }
    } catch (e) { /* fall through to localStorage */ }
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    const s = JSON.stringify(value);
    try {
      if (typeof window !== "undefined" && window.storage) {
        await window.storage.set(key, s);
        return;
      }
    } catch (e) { /* fall through to localStorage */ }
    try {
      localStorage.setItem(key, s);
    } catch (e) { /* storage full or unavailable */ }
  },
};

const K_DOCS = "norco-exec-docs";
const K_BRAIN = "norco-brain";
const K_SETTINGS = "norco-settings";
const K_CHATS = "norco-chats";

// ------------------------------------------------------------
// Security — app password (hashed, checked on every open)
// ------------------------------------------------------------
async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const UNLOCK_FLAG = "norco-unlocked";

// ------------------------------------------------------------
// Voice (Web Speech API — input + output, EN and AR)
// ------------------------------------------------------------
function speechLangCode(language) {
  return language === "ar" ? "ar-EG" : "en-US";
}

function stripForSpeech(text) {
  return text
    .replace(/[#*_`>|]/g, " ")
    .replace(/\[(PLACEHOLDER|VERIFY[^\]]*|FIGURE NEEDED|SPEC NEEDED)\]/gi, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Premium voice via ElevenLabs when configured in Settings; browser voice as fallback.
// The App keeps this module-level config in sync with saved settings.
const DEFAULT_ELEVEN_VOICE_ID = "Gubgw9l4dtIoQA9YZHgx";
const voiceConfig = { apiKey: "", voiceId: DEFAULT_ELEVEN_VOICE_ID };
let currentAudio = null;

async function speakWithElevenLabs(text) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": voiceConfig.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2", // speaks both English and Arabic with the same voice
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!r.ok) throw new Error("ElevenLabs error " + r.status);
  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  stopSpeaking();
  currentAudio = new Audio(url);
  currentAudio.onended = () => { URL.revokeObjectURL(url); currentAudio = null; };
  await currentAudio.play();
}

function speakWithBrowser(clean, language) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  // Chunk by sentence groups — long utterances get cut off on some platforms.
  const sentences = clean.match(/[^.!؟?。\n]+[.!؟?。\n]?/g) || [clean];
  const chunks = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > 220) { if (cur) chunks.push(cur); cur = s; } else cur += s;
  }
  if (cur) chunks.push(cur);
  const langCode = speechLangCode(language);
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(language === "ar" ? "ar" : "en"));
  for (const c of chunks.slice(0, 40)) {
    const u = new SpeechSynthesisUtterance(c);
    u.lang = langCode;
    if (voice) u.voice = voice;
    u.rate = 1;
    window.speechSynthesis.speak(u);
  }
}

async function speakText(text, language) {
  const clean = stripForSpeech(text);
  if (voiceConfig.apiKey && voiceConfig.voiceId) {
    try {
      // Cap request size to keep ElevenLabs credit usage reasonable per answer.
      await speakWithElevenLabs(clean.slice(0, 2500));
      return;
    } catch (e) {
      console.error("ElevenLabs voice failed — falling back to browser voice", e);
    }
  }
  speakWithBrowser(clean, language);
}

function stopSpeaking() {
  if (currentAudio) {
    try { currentAudio.pause(); } catch (e) {}
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}

function useSpeechInput(language, L) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const start = useCallback(
    (onText) => {
      const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
      if (!SR) { alert(L.micNotSupported); return; }
      if (recRef.current) { try { recRef.current.stop(); } catch (e) {} }
      const rec = new SR();
      recRef.current = rec;
      rec.lang = speechLangCode(language);
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const transcript = Array.from(e.results).map((r) => r[0].transcript).join(" ");
        onText(transcript);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      setListening(true);
      rec.start();
    },
    [language, L]
  );

  const stop = useCallback(() => {
    if (recRef.current) { try { recRef.current.stop(); } catch (e) {} }
    setListening(false);
  }, []);

  return { listening, start, stop };
}

// ------------------------------------------------------------
// UI atoms
// ------------------------------------------------------------
function GoldButton({ children, onClick, disabled, small }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold tracking-wide rounded ${small ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm"}`}
      style={{ background: disabled ? "#b9b3a4" : GOLD, color: NAVY_DARK, opacity: disabled ? 0.7 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
}

function MicButton({ voice, onText, title }) {
  return (
    <button
      onClick={() => (voice.listening ? voice.stop() : voice.start(onText))}
      title={title}
      className="px-3 rounded text-lg shrink-0"
      style={{
        background: voice.listening ? "#c0392b" : "#fff",
        border: `1px solid ${voice.listening ? "#c0392b" : "#d6d1c0"}`,
        color: voice.listening ? "#fff" : NAVY,
        animation: voice.listening ? "pulse 1.2s infinite" : "none",
      }}
    >
      🎤
    </button>
  );
}

function Spinner({ label }) {
  return (
    <div className="flex items-center gap-3 py-4 justify-center">
      <div className="w-5 h-5 rounded-full animate-spin" style={{ border: `3px solid ${GOLD}`, borderTopColor: "transparent" }} />
      <span className="text-sm" style={{ color: NAVY }}>{label || "Working…"}</span>
    </div>
  );
}

function OutputCard({ text, language, onSave, saved, title, L }) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const isAr = language === "ar";
  const copy = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) { console.error(e); }
  };
  const toggleSpeak = () => {
    if (speaking) { stopSpeaking(); setSpeaking(false); }
    else { speakText(text, isAr ? "ar" : "en"); setSpeaking(true); }
  };
  return (
    <div className="rounded-lg overflow-hidden shadow-sm" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
      <div className="flex items-center justify-between px-4 py-2 flex-wrap gap-1" style={{ background: NAVY }}>
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: GOLD }}>{title || "Output"}</span>
        <div className="flex gap-2">
          <button onClick={toggleSpeak} className="text-xs px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
            {speaking ? "⏹ " + L.stop : "🔊 " + L.listen}
          </button>
          <button onClick={copy} className="text-xs px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>{copied ? L.copied : L.copy}</button>
          {onSave && (
            <button onClick={onSave} disabled={saved} className="text-xs px-2 py-1 rounded" style={{ background: saved ? "rgba(255,255,255,0.12)" : GOLD, color: saved ? "#fff" : NAVY_DARK }}>
              {saved ? L.saved : L.save}
            </button>
          )}
        </div>
      </div>
      <div dir={isAr ? "rtl" : "ltr"} className="p-5 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: INK, fontFamily: isAr ? AR_FONT : "inherit" }}>
        {text}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Lock screen (create password on first run, then login on every open)
// ------------------------------------------------------------
function LockScreen({ settings, persistPrefs, onUnlock, L, uiLang }) {
  const needsSetup = !settings.appPassHash;
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (needsSetup) {
      if (pass.length < 4) { setError(L.passTooShort); return; }
      if (pass !== confirm) { setError(L.passMismatch); return; }
      const hash = await sha256Hex(pass);
      persistPrefs({ appPassHash: hash });
      try { sessionStorage.setItem(UNLOCK_FLAG, "1"); } catch (e) {}
      onUnlock();
    } else {
      const hash = await sha256Hex(pass);
      if (hash === settings.appPassHash) {
        try { sessionStorage.setItem(UNLOCK_FLAG, "1"); } catch (e) {}
        onUnlock();
      } else {
        setError(L.wrongPass);
        setPass("");
      }
    }
  };

  const input = (value, setValue, ph, autoFocus) => (
    <input
      type="password"
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
      placeholder={ph}
      dir="ltr"
      className="w-full rounded p-3 text-sm outline-none mb-3 text-center"
      style={{ border: "1px solid rgba(201,168,76,0.5)", background: "rgba(255,255,255,0.06)", color: "#fff" }}
    />
  );

  return (
    <div dir={uiLang === "ar" ? "rtl" : "ltr"} className="min-h-screen flex items-center justify-center px-4" style={{ background: NAVY_DARK, fontFamily: uiLang === "ar" ? AR_FONT : "inherit" }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-3xl tracking-wide mb-1" style={{ fontFamily: DISPLAY_FONT, color: "#fff" }}>
          NORCO <span style={{ color: GOLD }}>Executive Suite</span>
        </div>
        <p className="text-xs tracking-widest uppercase mb-8" style={{ color: "#7c86a5" }}>{L.lockWelcome}</p>
        <div className="rounded-lg p-6" style={{ border: "1px solid rgba(201,168,76,0.35)", background: "rgba(255,255,255,0.03)" }}>
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-lg mb-1" style={{ color: "#fff" }}>{needsSetup ? L.lockCreateTitle : L.lockLoginTitle}</h1>
          {needsSetup && <p className="text-xs mb-4" style={{ color: "#aeb6cc" }}>{L.lockCreateSub}</p>}
          <div className="mt-4">
            {input(pass, setPass, L.passPh, true)}
            {needsSetup && input(confirm, setConfirm, L.passConfirmPh)}
          </div>
          {error && <p className="text-xs mb-3" style={{ color: "#e57373" }}>{error}</p>}
          <GoldButton onClick={submit}>{needsSetup ? L.createEnter : L.enter}</GoldButton>
        </div>
        {!needsSetup && <p className="text-[11px] mt-6 leading-relaxed" style={{ color: "#5f6884" }}>{L.lockNote}</p>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Views
// ------------------------------------------------------------
function DashboardView({ openAgent, setView, L, uiLang }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const match = (a) =>
    !q ||
    a.name.toLowerCase().includes(q) ||
    a.nameAr.includes(query.trim()) ||
    a.tag.toLowerCase().includes(q) ||
    a.tagAr.includes(query.trim());
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: GOLD }}>{L.tagline}</p>
        <h1 className="text-3xl mb-2" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>{L.heroTitle}</h1>
        <p className="text-sm max-w-2xl" style={{ color: "#5a5647" }}>{L.heroText}</p>
      </div>
      <div className="rounded-lg p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between" style={{ background: NAVY }}>
        <div>
          <div className="text-lg mb-1" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: "#fff" }}>{L.boardroom}</div>
          <div className="text-sm" style={{ color: "#b9c1d9" }}>{L.boardroomCard}</div>
        </div>
        <GoldButton onClick={() => setView("boardroom")}>{L.convene}</GoldButton>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={L.searchAgents}
        className="w-full sm:w-80 rounded p-2.5 text-sm outline-none mb-6"
        style={{ border: "1px solid #d6d1c0", background: "#fff", color: INK }}
      />
      {DEPTS.map((dept) => {
        const agents = AGENTS.filter((a) => a.dept === dept.en && match(a));
        if (agents.length === 0) return null;
        return (
          <div key={dept.en} className="mb-8">
            <div className="text-xs tracking-widest uppercase mb-3" style={{ color: GOLD }}>{uiLang === "ar" ? dept.ar : dept.en}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((a) => (
                <button key={a.id} onClick={() => openAgent(a)} className="text-start p-4 rounded-lg hover:-translate-y-0.5 transition-transform" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <div className="font-semibold text-sm mb-1" style={{ color: NAVY }}>{uiLang === "ar" ? a.nameAr : a.name}</div>
                  <div className="text-xs" style={{ color: "#77725f" }}>{uiLang === "ar" ? a.tagAr : a.tag}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AgentView({ agent, language, uiLang, L, addDoc, chats, setChats, setView, settings, brain, autoSpeak }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskInput, setTaskInput] = useState({});
  const [savedIdx, setSavedIdx] = useState([]);
  const endRef = useRef(null);
  const voice = useSpeechInput(language, L);
  const messages = chats[agent.id] || [];
  const agentName = uiLang === "ar" ? agent.nameAr : agent.name;

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const sendPromptText = async (text) => {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setChats({ ...chats, [agent.id]: next });
    setLoading(true);
    try {
      const reply = await callClaude(buildSystemPrompt(agent, language, buildBrainDigest(brain)), next, settings);
      setChats((c) => ({ ...c, [agent.id]: [...next, { role: "assistant", content: reply }].slice(-40) }));
      if (autoSpeak) speakText(reply, language === "ar" ? "ar" : "en");
    } catch (e) {
      setChats((c) => ({ ...c, [agent.id]: [...next, { role: "assistant", content: "⚠ " + e.message }] }));
    }
    setLoading(false);
  };

  const runTask = (task) => {
    const v = taskInput[task.label] || "(not specified)";
    sendPromptText(task.build(v));
    setTaskInput({ ...taskInput, [task.label]: "" });
  };

  const saveMsg = (i, content) => {
    addDoc({ id: Date.now() + i, title: agent.name, agent: agent.id, language, text: content, date: new Date().toISOString() });
    setSavedIdx((s) => [...s, i]);
  };

  return (
    <div className="max-w-4xl">
      <button onClick={() => setView("dashboard")} className="text-xs mb-4" style={{ color: GOLD }}>{L.allAgents}</button>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-3xl">{agent.icon}</span>
        <div>
          <h1 className="text-2xl" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>{agentName}</h1>
          <p className="text-xs" style={{ color: "#77725f" }}>{uiLang === "ar" ? agent.tagAr : agent.tag}</p>
        </div>
      </div>

      {/* Quick tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        {agent.tasks.map((t) => (
          <div key={t.label} className="p-3 rounded-lg" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: NAVY }}>{uiLang === "ar" ? t.labelAr : t.label}</div>
            <textarea
              rows={2}
              value={taskInput[t.label] || ""}
              onChange={(e) => setTaskInput({ ...taskInput, [t.label]: e.target.value })}
              placeholder={t.ph}
              className="w-full rounded p-2 text-xs outline-none mb-2"
              style={{ border: "1px solid #d6d1c0", background: CANVAS, color: INK }}
            />
            <GoldButton small onClick={() => runTask(t)} disabled={loading}>{L.run}</GoldButton>
          </div>
        ))}
      </div>

      {/* Chat thread */}
      <div className="rounded-lg p-4 mb-3 space-y-3 overflow-y-auto" style={{ background: "#fff", border: "1px solid #e2ded2", maxHeight: "50vh", minHeight: "160px" }}>
        {messages.length === 0 && <p className="text-sm italic" style={{ color: "#9a947f" }}>{L.emptyChat}</p>}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap" style={{ background: NAVY, color: "#fff" }}>{m.content}</div>
            </div>
          ) : (
            <div key={i} className="flex justify-start w-full">
              <div className="w-full max-w-[95%]">
                <OutputCard text={m.content} language={language} title={agentName} onSave={() => saveMsg(i, m.content)} saved={savedIdx.includes(i)} L={L} />
              </div>
            </div>
          )
        )}
        {loading && <Spinner label={agentName + " " + L.isWorking} />}
        <div ref={endRef} />
      </div>
      {voice.listening && <p className="text-xs mb-2" style={{ color: "#c0392b" }}>🎤 {L.micListening}</p>}
      <div className="flex gap-2">
        <MicButton voice={voice} onText={(t) => sendPromptText(t)} title={L.micListening} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { sendPromptText(input); setInput(""); } }}
          placeholder={`${L.briefYour} ${agentName}…`}
          className="flex-1 rounded p-3 text-sm outline-none"
          style={{ border: "1px solid #d6d1c0", background: "#fff", color: INK }}
        />
        <GoldButton onClick={() => { sendPromptText(input); setInput(""); }} disabled={loading}>{L.send}</GoldButton>
      </div>
    </div>
  );
}

function BoardroomView({ language, uiLang, L, addDoc, settings, brain }) {
  const [question, setQuestion] = useState("");
  const [selected, setSelected] = useState(["ceo", "cfo", "risk"]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const voice = useSpeechInput(language, L);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 5 ? s : [...s, id]));

  const run = async () => {
    if (!question.trim() || selected.length === 0 || loading) return;
    setLoading(true);
    setResults([]);
    setSavedIds([]);
    const digest = buildBrainDigest(brain);
    const picked = AGENTS.filter((a) => selected.includes(a.id));
    for (const agent of picked) {
      setCurrent(uiLang === "ar" ? agent.nameAr : agent.name);
      try {
        const reply = await callClaude(
          buildSystemPrompt(agent, language, digest) + "\nBOARDROOM MODE: Answer from your role's perspective only, in under 250 words. Be direct — position first, reasoning after.",
          [{ role: "user", content: question }],
          settings,
          1000
        );
        setResults((r) => [...r, { agent, text: reply }]);
      } catch (e) {
        setResults((r) => [...r, { agent, text: "⚠ " + agent.name + " — " + e.message }]);
      }
    }
    setCurrent("");
    setLoading(false);
  };

  const saveOne = (agent, text) => {
    addDoc({ id: Date.now() + Math.random(), title: "Boardroom — " + agent.name, agent: agent.id, language, text, date: new Date().toISOString() });
    setSavedIds((s) => [...s, agent.id]);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl mb-1" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>{L.boardroom}</h1>
      <p className="text-sm mb-5" style={{ color: "#77725f" }}>{L.boardroomSub}</p>
      <div className="flex gap-2 items-start mb-4">
        <MicButton voice={voice} onText={(t) => setQuestion((q) => (q ? q + " " : "") + t)} title={L.micListening} />
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={L.boardroomPh}
          className="w-full rounded p-3 text-sm outline-none"
          style={{ border: "1px solid #d6d1c0", background: "#fff", color: INK }}
        />
      </div>
      <p className="text-xs mb-2" style={{ color: "#9a947f" }}>{L.selectUpTo}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {AGENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => toggle(a.id)}
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              background: selected.includes(a.id) ? NAVY : "#fff",
              color: selected.includes(a.id) ? "#fff" : NAVY,
              border: `1px solid ${NAVY}`,
              opacity: !selected.includes(a.id) && selected.length >= 5 ? 0.45 : 1,
            }}
          >
            {a.icon} {uiLang === "ar" ? a.nameAr : a.name}
          </button>
        ))}
      </div>
      <GoldButton onClick={run} disabled={loading || !question.trim()}>{loading ? L.inSession : L.putToBoard}</GoldButton>
      {loading && <Spinner label={current ? current + " " + L.isResponding : L.convening} />}
      <div className="mt-6 space-y-5">
        {results.map((r) => (
          <OutputCard key={r.agent.id} title={r.agent.icon + " " + (uiLang === "ar" ? r.agent.nameAr : r.agent.name)} text={r.text} language={language} onSave={() => saveOne(r.agent, r.text)} saved={savedIds.includes(r.agent.id)} L={L} />
        ))}
      </div>
    </div>
  );
}

function BrainView({ brain, setBrain, settings, L, uiLang }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualText, setManualText] = useState("");
  const [open, setOpen] = useState(null);
  const connected = !!(settings && settings.dropboxToken);

  const saveBrain = (next) => {
    setBrain(next);
    store.set(K_BRAIN, next.slice(0, 60));
  };

  const syncDropbox = async () => {
    if (!connected || busy) return;
    setBusy(true);
    setStatus(L.syncing);
    try {
      const files = await dropboxListFiles(settings.dropboxToken, settings.dropboxFolder || "");
      const existing = new Set(brain.map((d) => d.path));
      const fresh = files.filter((f) => !existing.has(f.path_lower)).slice(0, 15);
      let added = 0;
      let next = [...brain];
      for (const f of fresh) {
        setStatus(`${L.syncing} (${f.name})`);
        try {
          const text = await dropboxDownloadText(settings.dropboxToken, f.path_lower);
          const analysis = await analyzeDocument(f.name, text, settings);
          next = [{ id: Date.now() + Math.random(), name: f.name, path: f.path_lower, source: "Dropbox", date: new Date().toISOString(), ...analysis }, ...next];
          added++;
        } catch (e) {
          console.error("Brain: failed on", f.name, e);
        }
      }
      saveBrain(next);
      setStatus(`✓ ${added} new / ${files.length} found`);
    } catch (e) {
      setStatus("⚠ " + e.message);
    }
    setBusy(false);
  };

  const addManual = async () => {
    if (!manualName.trim() || !manualText.trim() || busy) return;
    setBusy(true);
    setStatus(L.analyzing);
    try {
      const analysis = await analyzeDocument(manualName, manualText, settings);
      saveBrain([{ id: Date.now(), name: manualName, path: null, source: "Manual", date: new Date().toISOString(), ...analysis }, ...brain]);
      setManualName("");
      setManualText("");
      setStatus("✓");
    } catch (e) {
      setStatus("⚠ " + e.message);
    }
    setBusy(false);
  };

  const removeDoc = (id) => saveBrain(brain.filter((d) => d.id !== id));

  const catLabel = (en) => {
    const c = BRAIN_CATEGORIES.find((x) => x.en === en);
    return uiLang === "ar" && c ? c.ar : en;
  };

  const grouped = BRAIN_CATEGORIES.map((c) => ({ cat: c, docs: brain.filter((d) => d.category === c.en) })).filter((g) => g.docs.length > 0);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl mb-1" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>🧠 {L.brain}</h1>
      <p className="text-sm mb-5" style={{ color: "#77725f" }}>{L.brainSub}</p>

      {/* Dropbox */}
      <div className="rounded-lg p-4 mb-5" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: GOLD }}>{L.brainConnect}</div>
        <p className="text-sm mb-3" style={{ color: connected ? "#2e7d32" : "#a33" }}>
          {connected ? "✓ " + L.brainConnected : L.brainNotConnected}
        </p>
        {connected && <GoldButton onClick={syncDropbox} disabled={busy}>{busy ? L.syncing : L.syncDropbox}</GoldButton>}
      </div>

      {/* Manual add */}
      <div className="rounded-lg p-4 mb-5" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{L.brainManualTitle}</div>
        <input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder={L.docNamePh}
          className="w-full rounded p-2.5 text-sm outline-none mb-2" style={{ border: "1px solid #d6d1c0", background: CANVAS, color: INK }} />
        <textarea rows={5} value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder={L.docTextPh}
          className="w-full rounded p-2.5 text-sm outline-none mb-2" style={{ border: "1px solid #d6d1c0", background: CANVAS, color: INK }} />
        <GoldButton onClick={addManual} disabled={busy || !manualName.trim() || !manualText.trim()}>{busy ? L.analyzing : L.analyzeAdd}</GoldButton>
      </div>

      {status && <p className="text-sm mb-4" style={{ color: NAVY }}>{status}</p>}
      {busy && <Spinner label={status} />}

      {/* Knowledge */}
      {brain.length === 0 && !busy && <p className="text-sm italic" style={{ color: "#9a947f" }}>{L.brainEmpty}</p>}
      {brain.length > 0 && (
        <p className="text-sm mb-4 font-semibold" style={{ color: NAVY }}>🧠 {brain.length} {L.brainDocs}</p>
      )}
      {grouped.map((g) => (
        <div key={g.cat.en} className="mb-6">
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: GOLD }}>{uiLang === "ar" ? g.cat.ar : g.cat.en} · {g.docs.length}</div>
          <div className="space-y-2">
            {g.docs.map((d) => (
              <div key={d.id} className="rounded-lg" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer gap-3" onClick={() => setOpen(open === d.id ? null : d.id)}>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>{d.title}</div>
                    <div className="text-xs" style={{ color: "#9a947f" }}>{L.source}: {d.source} · {new Date(d.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); removeDoc(d.id); }} className="text-xs" style={{ color: "#a33" }}>{L.del}</button>
                    <span style={{ color: GOLD }}>{open === d.id ? "▲" : "▼"}</span>
                  </div>
                </div>
                {open === d.id && (
                  <div className="px-4 pb-4 text-sm space-y-2" style={{ color: INK }}>
                    <p>{d.summary}</p>
                    {d.keyFacts && d.keyFacts.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{ color: NAVY }}>{L.keyFacts}:</div>
                        <ul className="list-disc ms-5 text-xs space-y-0.5" style={{ color: "#5a5647" }}>
                          {d.keyFacts.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    )}
                    {d.relevance && <p className="text-xs italic" style={{ color: "#77725f" }}>{d.relevance}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AiNetworkView({ settings, L, uiLang, language }) {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const voice = useSpeechInput(language, L);

  const providers = [
    { id: "claude", label: "Claude (Anthropic)", available: true, call: (q) => callClaude("You are a knowledgeable, precise assistant supporting the Chairman of NORCO General Trading. Answer directly and professionally.", [{ role: "user", content: q }], settings, 1200) },
    { id: "gpt", label: "GPT (OpenAI)", available: !!(settings && settings.openaiKey), call: (q) => callOpenAI(q, settings) },
    { id: "gemini", label: "Gemini (Google)", available: !!(settings && settings.geminiKey), call: (q) => callGemini(q, settings) },
  ];

  const run = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setResults([]);
    await Promise.all(
      providers.filter((p) => p.available).map(async (p) => {
        try {
          const text = await p.call(question);
          setResults((r) => [...r, { id: p.id, label: p.label, text }]);
        } catch (e) {
          setResults((r) => [...r, { id: p.id, label: p.label, text: "⚠ " + e.message }]);
        }
      })
    );
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl mb-1" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>🌐 {L.ainet}</h1>
      <p className="text-sm mb-5" style={{ color: "#77725f" }}>{L.ainetSub}</p>
      <div className="flex gap-2 items-start mb-3">
        <MicButton voice={voice} onText={(t) => setQuestion((q) => (q ? q + " " : "") + t)} title={L.micListening} />
        <textarea rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={L.ainetPh}
          className="w-full rounded p-3 text-sm outline-none" style={{ border: "1px solid #d6d1c0", background: "#fff", color: INK }} />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {providers.map((p) => (
          <span key={p.id} className="text-xs px-3 py-1.5 rounded-full" style={{ background: p.available ? NAVY : "#eee", color: p.available ? "#fff" : "#999", border: "1px solid " + (p.available ? NAVY : "#ddd") }}>
            {p.label}{!p.available ? " — " + L.noKey : ""}
          </span>
        ))}
      </div>
      <GoldButton onClick={run} disabled={loading || !question.trim()}>{loading ? L.asking : L.askAll}</GoldButton>
      {loading && <Spinner label={L.asking} />}
      <div className="mt-6 space-y-5">
        {results.map((r) => (
          <OutputCard key={r.id} title={r.label} text={r.text} language={language} L={L} />
        ))}
      </div>
    </div>
  );
}

function LibraryView({ docs, removeDoc, L, uiLang }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl mb-1" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>{L.library}</h1>
      <p className="text-sm mb-6" style={{ color: "#77725f" }}>{L.librarySub}</p>
      {docs.length === 0 && <p className="text-sm italic" style={{ color: "#9a947f" }}>{L.libraryEmpty}</p>}
      <div className="space-y-3">
        {docs.map((d) => (
          <div key={d.id} className="rounded-lg" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setOpen(open === d.id ? null : d.id)}>
              <div>
                <div className="text-sm font-semibold" style={{ color: NAVY }}>{d.title}</div>
                <div className="text-xs" style={{ color: "#9a947f" }}>{new Date(d.date).toLocaleString()} · {d.language === "ar" ? "العربية" : d.language === "bi" ? "EN+AR" : "English"}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); removeDoc(d.id); }} className="text-xs" style={{ color: "#a33" }}>{L.del}</button>
                <span style={{ color: GOLD }}>{open === d.id ? "▲" : "▼"}</span>
              </div>
            </div>
            {open === d.id && (
              <div className="px-4 pb-4">
                <OutputCard text={d.text} language={d.language} title={d.title} L={L} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CoreView({ L, uiLang }) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl mb-1" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>{L.core}</h1>
      <p className="text-sm mb-6" style={{ color: "#77725f" }}>{L.coreSub}</p>
      <div dir="ltr" className="rounded-lg p-5 text-xs whitespace-pre-wrap leading-relaxed" style={{ background: NAVY_DARK, color: "#cfd6e8", fontFamily: "ui-monospace, Menlo, monospace" }}>
        {BRAND_CORE.trim()}
      </div>
    </div>
  );
}

function SettingsView({ settings, setSettings, L, uiLang, autoSpeak, setAutoSpeak }) {
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [form, setForm] = useState({
    dropboxToken: settings.dropboxToken || "",
    dropboxFolder: settings.dropboxFolder || "",
    anthropicKey: settings.anthropicKey || "",
    openaiKey: settings.openaiKey || "",
    geminiKey: settings.geminiKey || "",
    elevenKey: settings.elevenKey || "",
    elevenVoiceId: settings.elevenVoiceId || DEFAULT_ELEVEN_VOICE_ID,
  });
  const [savedMsg, setSavedMsg] = useState(false);

  const saveAll = () => {
    const next = { ...settings, ...form };
    setSettings(next);
    store.set(K_SETTINGS, next);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const changePassword = async () => {
    setPassMsg("");
    const curHash = await sha256Hex(curPass);
    if (curHash !== settings.appPassHash) { setPassMsg(L.wrongPass); return; }
    if (newPass.length < 4) { setPassMsg(L.passTooShort); return; }
    const next = { ...settings, appPassHash: await sha256Hex(newPass) };
    setSettings(next);
    store.set(K_SETTINGS, next);
    setCurPass("");
    setNewPass("");
    setPassMsg(L.passChanged);
    setTimeout(() => setPassMsg(""), 2500);
  };

  const field = (key, ph, type) => (
    <input
      type={type || "password"}
      dir="ltr"
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      placeholder={ph}
      className="w-full rounded p-2.5 text-sm outline-none mb-2"
      style={{ border: "1px solid #d6d1c0", background: CANVAS, color: INK }}
    />
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl mb-1" style={{ fontFamily: uiLang === "ar" ? AR_FONT : DISPLAY_FONT, color: NAVY }}>⚙️ {L.settings}</h1>
      <p className="text-sm mb-6" style={{ color: "#77725f" }}>{L.settingsSub}</p>

      <div className="rounded-lg p-4 mb-5" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{L.dropboxSection}</div>
        {field("dropboxToken", L.dropboxTokenPh)}
        {field("dropboxFolder", L.dropboxFolderPh, "text")}
        <p className="text-xs leading-relaxed" style={{ color: "#77725f" }}>{L.dropboxHelp}</p>
      </div>

      <div className="rounded-lg p-4 mb-5" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{L.aiSection}</div>
        {field("anthropicKey", L.anthropicKeyPh)}
        {field("openaiKey", L.openaiKeyPh)}
        {field("geminiKey", L.geminiKeyPh)}
        <p className="text-xs leading-relaxed" style={{ color: "#77725f" }}>{L.aiHelp}</p>
      </div>

      <div className="rounded-lg p-4 mb-5" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{L.voiceSection}</div>
        {field("elevenKey", L.elevenKeyPh)}
        {field("elevenVoiceId", L.elevenVoiceIdPh, "text")}
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#77725f" }}>{L.elevenHelp}</p>
        <label className="flex items-center gap-2 text-sm mb-2" style={{ color: INK }}>
          <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
          {L.autoSpeak}
        </label>
        <p className="text-xs leading-relaxed" style={{ color: "#77725f" }}>{L.voiceHelp}</p>
      </div>

      <div className="rounded-lg p-4 mb-5" style={{ background: "#fff", border: "1px solid #e2ded2" }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>🔐 {L.securitySection}</div>
        <input type="password" dir="ltr" value={curPass} onChange={(e) => setCurPass(e.target.value)} placeholder={L.currentPassPh}
          className="w-full rounded p-2.5 text-sm outline-none mb-2" style={{ border: "1px solid #d6d1c0", background: CANVAS, color: INK }} />
        <input type="password" dir="ltr" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder={L.newPassPh}
          className="w-full rounded p-2.5 text-sm outline-none mb-2" style={{ border: "1px solid #d6d1c0", background: CANVAS, color: INK }} />
        <div className="flex items-center gap-3 mb-2">
          <GoldButton small onClick={changePassword}>{L.changePass}</GoldButton>
          {passMsg && <span className="text-xs" style={{ color: passMsg === L.passChanged ? "#2e7d32" : "#a33" }}>{passMsg}</span>}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#77725f" }}>{L.securityHelp}</p>
      </div>

      <div className="flex items-center gap-3">
        <GoldButton onClick={saveAll}>{L.saveSettings}</GoldButton>
        {savedMsg && <span className="text-sm" style={{ color: "#2e7d32" }}>{L.settingsSaved}</span>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// App shell
// ------------------------------------------------------------
export default function NorcoExecutiveSuite() {
  const [view, setView] = useState("dashboard");
  const [language, setLanguage] = useState("en"); // agent OUTPUT language: en | ar | bi
  const [uiLang, setUiLang] = useState("en"); // INTERFACE language: en | ar
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);
  const [chats, setChatsState] = useState({});
  const [docs, setDocs] = useState([]);
  const [brain, setBrain] = useState([]);
  const [settings, setSettings] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(true);

  const L = STR[uiLang];

  useEffect(() => {
    (async () => {
      const [d, b, s, c] = await Promise.all([store.get(K_DOCS), store.get(K_BRAIN), store.get(K_SETTINGS), store.get(K_CHATS)]);
      if (d) setDocs(d);
      if (b) setBrain(b);
      if (s) {
        setSettings(s);
        if (s.uiLang) setUiLang(s.uiLang);
        if (s.language) setLanguage(s.language);
        if (s.autoSpeak) setAutoSpeak(true);
      }
      if (c) setChatsState(c);
      // Stay unlocked within the same browser session; require the password again on reopen.
      let unlockedThisSession = false;
      try { unlockedThisSession = sessionStorage.getItem(UNLOCK_FLAG) === "1"; } catch (e) {}
      setLocked(!(s && s.appPassHash && unlockedThisSession));
      setLoaded(true);
    })();
    // Preload voices (Chrome loads them async).
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.getVoices();
  }, []);

  // Keep the ElevenLabs voice config in sync with saved settings.
  useEffect(() => {
    voiceConfig.apiKey = settings.elevenKey || "";
    voiceConfig.voiceId = settings.elevenVoiceId || DEFAULT_ELEVEN_VOICE_ID;
  }, [settings]);

  const persistPrefs = (patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      store.set(K_SETTINGS, next);
      return next;
    });
  };

  const setChats = (updater) => {
    setChatsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      store.set(K_CHATS, next);
      return next;
    });
  };

  const addDoc = (doc) => {
    setDocs((prev) => {
      const next = [doc, ...prev].slice(0, 80);
      store.set(K_DOCS, next);
      return next;
    });
  };
  const removeDoc = (id) => {
    setDocs((prev) => {
      const next = prev.filter((d) => d.id !== id);
      store.set(K_DOCS, next);
      return next;
    });
  };
  const openAgent = (a) => { setActiveAgent(a); setView("agent"); };

  const NAV = [
    { id: "dashboard", label: L.agents, icon: "◆" },
    { id: "boardroom", label: L.boardroom, icon: "▤" },
    { id: "brain", label: L.brain, icon: "🧠" },
    { id: "ainet", label: L.ainet, icon: "🌐" },
    { id: "library", label: L.library, icon: "▣" },
    { id: "core", label: L.core, icon: "◉" },
    { id: "settings", label: L.settings, icon: "⚙" },
  ];

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY_DARK }}>
        <div className="text-lg tracking-wide" style={{ fontFamily: DISPLAY_FONT, color: GOLD }}>NORCO Executive Suite</div>
      </div>
    );
  }

  if (locked) {
    return <LockScreen settings={settings} persistPrefs={persistPrefs} onUnlock={() => setLocked(false)} L={L} uiLang={uiLang} />;
  }

  return (
    <div dir={uiLang === "ar" ? "rtl" : "ltr"} className="flex min-h-screen flex-col sm:flex-row" style={{ background: CANVAS, fontFamily: uiLang === "ar" ? AR_FONT : "inherit" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }`}</style>
      {/* Sidebar */}
      <aside className="w-full sm:w-56 shrink-0 flex flex-col" style={{ background: NAVY_DARK }}>
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(201,168,76,0.25)" }}>
          <div className="text-lg tracking-wide leading-tight" style={{ fontFamily: DISPLAY_FONT, color: "#fff" }}>
            NORCO<br /><span style={{ color: GOLD }}>Executive Suite</span>
          </div>
          <div className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "#7c86a5" }}>{L.agentsTruth}</div>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className="w-full text-start px-5 py-2.5 text-sm flex items-center gap-3"
              style={{
                color: view === n.id || (view === "agent" && n.id === "dashboard") ? GOLD : "#aeb6cc",
                background: view === n.id ? "rgba(201,168,76,0.08)" : "transparent",
                borderInlineStart: view === n.id ? `3px solid ${GOLD}` : "3px solid transparent",
              }}
            >
              <span className="text-xs">{n.icon}</span> {n.label}
            </button>
          ))}
          <div className="px-5 pt-4 pb-1 text-[10px] tracking-widest uppercase hidden sm:block" style={{ color: "#5f6884" }}>{L.quickAccess}</div>
          {AGENTS.slice(0, 6).map((a) => (
            <button
              key={a.id}
              onClick={() => openAgent(a)}
              className="w-full text-start px-5 py-1.5 text-xs items-center gap-2 hidden sm:flex"
              style={{ color: activeAgent && activeAgent.id === a.id && view === "agent" ? GOLD : "#8d96b3" }}
            >
              <span>{a.icon}</span> {uiLang === "ar" ? a.nameAr : a.name}
            </button>
          ))}
        </nav>
        <div className="px-5 pb-5 text-[10px] leading-relaxed hidden sm:block" style={{ color: "#5f6884" }}>{L.footer}</div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 px-4 sm:px-8 py-4" style={{ borderBottom: "1px solid #e2ded2", background: "#fff" }}>
          {/* Output language */}
          <div className="flex rounded overflow-hidden" style={{ border: "1px solid #c9c3b0" }}>
            {[
              { k: "en", l: "EN" },
              { k: "ar", l: "عربي" },
              { k: "bi", l: "EN+AR" },
            ].map((o) => (
              <button key={o.k} onClick={() => { setLanguage(o.k); persistPrefs({ language: o.k }); }} className="px-3 py-1.5 text-xs font-semibold" style={{ background: language === o.k ? GOLD : "#fff", color: language === o.k ? NAVY_DARK : "#77725f" }}>
                {o.l}
              </button>
            ))}
          </div>
          {/* UI language */}
          <div className="flex rounded overflow-hidden" style={{ border: "1px solid #c9c3b0" }}>
            {[
              { k: "en", l: "Interface: EN" },
              { k: "ar", l: "الواجهة: عربي" },
            ].map((o) => (
              <button key={o.k} onClick={() => { setUiLang(o.k); persistPrefs({ uiLang: o.k }); }} className="px-3 py-1.5 text-xs font-semibold" style={{ background: uiLang === o.k ? NAVY : "#fff", color: uiLang === o.k ? "#fff" : "#77725f" }}>
                {o.l}
              </button>
            ))}
          </div>
          {/* Auto-speak */}
          <button
            onClick={() => { const v = !autoSpeak; setAutoSpeak(v); persistPrefs({ autoSpeak: v }); if (!v) stopSpeaking(); }}
            className="px-3 py-1.5 text-xs font-semibold rounded"
            style={{ border: "1px solid #c9c3b0", background: autoSpeak ? GOLD : "#fff", color: autoSpeak ? NAVY_DARK : "#77725f" }}
            title={L.autoSpeak}
          >
            🔊 {autoSpeak ? "ON" : "OFF"}
          </button>
          {/* Lock the app immediately */}
          <button
            onClick={() => { try { sessionStorage.removeItem(UNLOCK_FLAG); } catch (e) {} stopSpeaking(); setLocked(true); }}
            className="px-3 py-1.5 text-xs font-semibold rounded"
            style={{ border: "1px solid #c9c3b0", background: "#fff", color: "#77725f" }}
            title={L.lockApp}
          >
            🔒 {L.lockApp}
          </button>
          <div className="ms-auto text-[11px]" style={{ color: "#9a947f" }}>
            {L.coreLocked} · 🧠 {brain.length} · {loaded ? `${docs.length} ${L.savedCount}` : L.loading}
          </div>
        </div>
        <div className="px-4 sm:px-8 py-8">
          {view === "dashboard" && <DashboardView openAgent={openAgent} setView={setView} L={L} uiLang={uiLang} />}
          {view === "agent" && activeAgent && (
            <AgentView agent={activeAgent} language={language} uiLang={uiLang} L={L} addDoc={addDoc} chats={chats} setChats={setChats} setView={setView} settings={settings} brain={brain} autoSpeak={autoSpeak} />
          )}
          {view === "boardroom" && <BoardroomView language={language} uiLang={uiLang} L={L} addDoc={addDoc} settings={settings} brain={brain} />}
          {view === "brain" && <BrainView brain={brain} setBrain={setBrain} settings={settings} L={L} uiLang={uiLang} />}
          {view === "ainet" && <AiNetworkView settings={settings} L={L} uiLang={uiLang} language={language} />}
          {view === "library" && <LibraryView docs={docs} removeDoc={removeDoc} L={L} uiLang={uiLang} />}
          {view === "core" && <CoreView L={L} uiLang={uiLang} />}
          {view === "settings" && <SettingsView settings={settings} setSettings={setSettings} L={L} uiLang={uiLang} autoSpeak={autoSpeak} setAutoSpeak={setAutoSpeak} />}
        </div>
      </main>
    </div>
  );
}
