// ============================================================================
// BIS Platform — Internationalization (English + Hindi)
// ============================================================================

export const translations = {
  en: {
    // Branding
    appName: "BIS Intelligence",
    appTagline: "Evidence-backed BIS Standards Platform",

    // Navigation
    nav: {
      overview: "Overview",
      standards: "Standards Explorer",
      assistant: "BIS Assistant",
      laboratories: "Laboratories",
      validator: "Validator",
      documents: "Documents",
      saved: "Saved Items",
      help: "Help",
      about: "About",
      settings: "Settings",
    },

    // Persona
    persona: {
      chooserTitle: "How can we help you?",
      industry: {
        label: "Industry / MSME",
        description: "Find applicable standards, testing requirements and certification information.",
        cta: "Enter Industry Workspace",
      },
      consumer: {
        label: "Consumer",
        description: "Understand BIS marks, certification information and product standards.",
        cta: "Enter Consumer Desk",
      },
      switch: "Switch Persona",
    },

    // Hero
    hero: {
      title: "Understand Indian Standards. Make Better Compliance Decisions.",
      subtitle: "An evidence-backed BIS intelligence platform for MSMEs, industry professionals and consumers.",
      exploreStandards: "Explore Standards",
      askAssistant: "Ask BIS Assistant",
      verifyCertification: "Verify Certification",
    },

    // Industry Dashboard
    industry: {
      title: "Industry / MSME Workspace",
      subtitle: "Discover applicable Indian Standards, testing requirements and BIS certification information.",
      metrics: {
        standards: "Standards Available",
        documents: "Documents Indexed",
        categories: "Product Categories",
        saved: "Saved Standards",
      },
      actions: {
        findStandard: "Find a Standard",
        findStandardDesc: "Search by product or raw material",
        askAssistant: "Ask BIS Assistant",
        askAssistantDesc: "Ask evidence-backed questions",
        testingReqs: "Testing Requirements",
        testingReqsDesc: "Understand relevant testing requirements",
        certGuide: "Certification Guide",
        certGuideDesc: "Explore available BIS certification information",
        findLab: "Find Laboratory",
        findLabDesc: "Locate relevant testing laboratories",
      },
    },

    // Consumer
    consumer: {
      title: "Consumer Protection Desk",
      subtitle: "Understand BIS marks, standards and product certification information.",
      verifyBIS: "Verify BIS / ISI",
      huidAssistance: "HUID Assistance",
      understandStandard: "Understand a Standard",
      askAssistant: "Ask BIS Assistant",
      productSafety: "Product Safety Information",
    },

    // Standards
    standards: {
      title: "Standards Explorer",
      subtitle: "Search and explore BIS standards indexed in the knowledge base.",
      searchPlaceholder: "Search by IS code, product, keyword or standard title...",
      filters: "Filters",
      category: "Category",
      allCategories: "All Categories",
      sortBy: "Sort By",
      relevance: "Relevance",
      alphabetical: "Alphabetical",
      view: "View",
      askAI: "Ask AI",
      save: "Save",
      noResults: "No matching BIS standards were found in the indexed knowledge base.",
      tryAdjusting: "Try adjusting your search terms or browse all standards.",
    },

    // Assistant
    assistant: {
      title: "BIS Standards Assistant",
      subtitle: "Ask questions grounded in the BIS documents available in this platform.",
      inputPlaceholder: "Ask a question about BIS standards...",
      send: "Send",
      thinking: "Thinking...",
      searching: "Searching BIS knowledge base...",
      finding: "Finding relevant clauses...",
      reviewing: "Reviewing source documents...",
      preparing: "Preparing citations...",
      generating: "Generating response...",
      evidenceBacked: "Evidence-backed BIS Assistant",
      evidenceTooltip: "Responses are generated using the BIS documents currently indexed in this platform. Always verify regulatory decisions against current official BIS sources.",
      noEvidence: "I couldn't find sufficient evidence in the currently indexed BIS documents to answer this reliably.",
      suggestBrowse: "Browse Standards",
      suggestRetry: "Try another query",
      suggestDocs: "View available documents",
      newChat: "New Conversation",
      history: "Conversation History",
    },

    // Citations
    citations: {
      evidence: "Evidence",
      sources: "Sources",
      source: "Source",
      page: "Page",
      clause: "Clause",
      section: "Section",
      viewSource: "View Source",
      openDocument: "Open Document",
      copyCitation: "Copy Citation",
      askFollowUp: "Ask Follow-up",
    },

    // Documents
    documents: {
      title: "BIS Document Library",
      subtitle: "Browse the BIS standard documents currently indexed in the knowledge base.",
      searchPlaceholder: "Search documents...",
      indexed: "Indexed",
      processing: "Processing",
      error: "Error",
      pages: "pages",
      open: "Open",
      search: "Search",
      askAI: "Ask AI",
      viewSource: "View Source",
    },

    // Validator
    validator: {
      title: "BIS License / CM-L Validator",
      subtitle: "Check the format of a BIS license or CM/L number.",
      inputPlaceholder: "Enter CM/L or BIS license number",
      checkFormat: "Check Format",
      formatValid: "Format appears valid",
      formatInvalid: "Format does not match expected pattern",
      disclaimer: "This tool checks the identifier format only. It does not confirm current BIS-issued status. For official verification, visit the BIS website.",
      huidTitle: "Hallmark / HUID Assistant",
      huidSubtitle: "Check the format of a Hallmark Unique Identification (HUID) number.",
      huidPlaceholder: "Enter HUID number",
      huidCheck: "Check HUID Format",
    },

    // Laboratories
    laboratories: {
      title: "BIS Testing Laboratory Locator",
      subtitle: "Find BIS-recognized testing laboratories.",
      searchPlaceholder: "Search by laboratory name, location or product domain...",
      noData: "Laboratory data integration is being prepared.",
      noDataDesc: "Laboratory information from verified sources will be available here once integrated.",
      viewDetails: "View Details",
      directions: "Directions",
      contact: "Contact",
    },

    // Saved
    saved: {
      title: "Saved Standards",
      subtitle: "Your saved BIS standards for quick reference.",
      empty: "No saved standards yet.",
      emptyDesc: "Save standards from the Standards Explorer or search results.",
      remove: "Remove",
      savedOn: "Saved on",
    },

    // Shared
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Try Again",
      back: "Back",
      close: "Close",
      search: "Search",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      viewAll: "View All",
      showMore: "Show More",
      showLess: "Show Less",
      noResults: "No results found",
      comingSoon: "Coming Soon",
    },

    // Admin
    admin: {
      title: "Knowledge Base Health",
      subtitle: "Monitor the BIS knowledge engine status and test retrieval quality.",
      documentsIndexed: "Documents Indexed",
      totalChunks: "Total Chunks",
      lastIngestion: "Last Ingestion",
      testQuery: "Test Query",
      testQueryPlaceholder: "Enter a test query to check retrieval...",
      runTest: "Run Test",
      retrievedChunks: "Retrieved Chunks",
      similarity: "Similarity",
    },

    // Suggested prompts
    suggestedPrompts: [
      "What are the mandatory testing parameters for IS 10500?",
      "Which BIS standard applies to motorcycle helmets?",
      "Explain the relevant requirements in simple language.",
      "What testing requirements are mentioned in this standard?",
      "Which clauses discuss sampling?",
      "Show me the source for this answer.",
    ],

    // Product search examples
    productExamples: [
      "Packaged drinking water",
      "Motorcycle helmet",
      "Electrical cable",
      "Cement",
      "Gold jewellery",
    ],
  },

  hi: {
    appName: "BIS इंटेलिजेंस",
    appTagline: "साक्ष्य-आधारित BIS मानक प्लेटफॉर्म",

    nav: {
      overview: "अवलोकन",
      standards: "मानक एक्सप्लोरर",
      assistant: "BIS सहायक",
      laboratories: "प्रयोगशालाएं",
      validator: "सत्यापनकर्ता",
      documents: "दस्तावेज़",
      saved: "सहेजे गए आइटम",
      help: "सहायता",
      about: "हमारे बारे में",
      settings: "सेटिंग्स",
    },

    persona: {
      chooserTitle: "हम आपकी कैसे मदद कर सकते हैं?",
      industry: {
        label: "उद्योग / MSME",
        description: "लागू मानक, परीक्षण आवश्यकताएं और प्रमाणन जानकारी खोजें।",
        cta: "उद्योग कार्यक्षेत्र में प्रवेश करें",
      },
      consumer: {
        label: "उपभोक्ता",
        description: "BIS चिह्न, प्रमाणन जानकारी और उत्पाद मानकों को समझें।",
        cta: "उपभोक्ता डेस्क में प्रवेश करें",
      },
      switch: "पर्सोना बदलें",
    },

    hero: {
      title: "भारतीय मानकों को समझें। बेहतर अनुपालन निर्णय लें।",
      subtitle: "MSMEs, उद्योग पेशेवरों और उपभोक्ताओं के लिए साक्ष्य-आधारित BIS इंटेलिजेंस प्लेटफॉर्म।",
      exploreStandards: "मानक एक्सप्लोर करें",
      askAssistant: "BIS सहायक से पूछें",
      verifyCertification: "प्रमाणन सत्यापित करें",
    },

    industry: {
      title: "उद्योग / MSME कार्यक्षेत्र",
      subtitle: "लागू भारतीय मानक, परीक्षण आवश्यकताएं और BIS प्रमाणन जानकारी खोजें।",
      metrics: {
        standards: "उपलब्ध मानक",
        documents: "अनुक्रमित दस्तावेज़",
        categories: "उत्पाद श्रेणियां",
        saved: "सहेजे गए मानक",
      },
      actions: {
        findStandard: "मानक खोजें",
        findStandardDesc: "उत्पाद या कच्चे माल द्वारा खोजें",
        askAssistant: "BIS सहायक से पूछें",
        askAssistantDesc: "साक्ष्य-आधारित प्रश्न पूछें",
        testingReqs: "परीक्षण आवश्यकताएं",
        testingReqsDesc: "प्रासंगिक परीक्षण आवश्यकताओं को समझें",
        certGuide: "प्रमाणन गाइड",
        certGuideDesc: "उपलब्ध BIS प्रमाणन जानकारी एक्सप्लोर करें",
        findLab: "प्रयोगशाला खोजें",
        findLabDesc: "प्रासंगिक परीक्षण प्रयोगशालाएं खोजें",
      },
    },

    consumer: {
      title: "उपभोक्ता सुरक्षा डेस्क",
      subtitle: "BIS चिह्न, मानक और उत्पाद प्रमाणन जानकारी को समझें।",
      verifyBIS: "BIS / ISI सत्यापित करें",
      huidAssistance: "HUID सहायता",
      understandStandard: "मानक समझें",
      askAssistant: "BIS सहायक से पूछें",
      productSafety: "उत्पाद सुरक्षा जानकारी",
    },

    standards: {
      title: "मानक एक्सप्लोरर",
      subtitle: "ज्ञान आधार में अनुक्रमित BIS मानकों को खोजें और एक्सप्लोर करें।",
      searchPlaceholder: "IS कोड, उत्पाद, कीवर्ड या मानक शीर्षक द्वारा खोजें...",
      filters: "फ़िल्टर",
      category: "श्रेणी",
      allCategories: "सभी श्रेणियां",
      sortBy: "क्रमबद्ध करें",
      relevance: "प्रासंगिकता",
      alphabetical: "वर्णानुक्रम",
      view: "देखें",
      askAI: "AI से पूछें",
      save: "सहेजें",
      noResults: "अनुक्रमित ज्ञान आधार में कोई मिलान BIS मानक नहीं मिला।",
      tryAdjusting: "अपने खोज शब्दों को समायोजित करें या सभी मानकों को ब्राउज़ करें।",
    },

    assistant: {
      title: "BIS मानक सहायक",
      subtitle: "इस प्लेटफॉर्म में उपलब्ध BIS दस्तावेज़ों पर आधारित प्रश्न पूछें।",
      inputPlaceholder: "BIS मानकों के बारे में प्रश्न पूछें...",
      send: "भेजें",
      thinking: "सोच रहा है...",
      searching: "BIS ज्ञान आधार खोज रहा है...",
      finding: "प्रासंगिक धाराएं खोज रहा है...",
      reviewing: "स्रोत दस्तावेज़ों की समीक्षा कर रहा है...",
      preparing: "उद्धरण तैयार कर रहा है...",
      generating: "उत्तर तैयार कर रहा है...",
      evidenceBacked: "साक्ष्य-आधारित BIS सहायक",
      evidenceTooltip: "उत्तर इस प्लेटफॉर्म में अनुक्रमित BIS दस्तावेज़ों का उपयोग करके उत्पन्न होते हैं। नियामक निर्णयों को हमेशा वर्तमान आधिकारिक BIS स्रोतों से सत्यापित करें।",
      noEvidence: "वर्तमान में अनुक्रमित BIS दस्तावेज़ों में इसका विश्वसनीय उत्तर देने के लिए पर्याप्त साक्ष्य नहीं मिला।",
      suggestBrowse: "मानक ब्राउज़ करें",
      suggestRetry: "अन्य प्रश्न आज़माएं",
      suggestDocs: "उपलब्ध दस्तावेज़ देखें",
      newChat: "नई बातचीत",
      history: "बातचीत इतिहास",
    },

    citations: {
      evidence: "साक्ष्य",
      sources: "स्रोत",
      source: "स्रोत",
      page: "पृष्ठ",
      clause: "धारा",
      section: "अनुभाग",
      viewSource: "स्रोत देखें",
      openDocument: "दस्तावेज़ खोलें",
      copyCitation: "उद्धरण कॉपी करें",
      askFollowUp: "अनुवर्ती प्रश्न पूछें",
    },

    documents: {
      title: "BIS दस्तावेज़ पुस्तकालय",
      subtitle: "ज्ञान आधार में वर्तमान में अनुक्रमित BIS मानक दस्तावेज़ ब्राउज़ करें।",
      searchPlaceholder: "दस्तावेज़ खोजें...",
      indexed: "अनुक्रमित",
      processing: "प्रसंस्करण",
      error: "त्रुटि",
      pages: "पृष्ठ",
      open: "खोलें",
      search: "खोजें",
      askAI: "AI से पूछें",
      viewSource: "स्रोत देखें",
    },

    validator: {
      title: "BIS लाइसेंस / CM-L सत्यापनकर्ता",
      subtitle: "BIS लाइसेंस या CM/L संख्या के प्रारूप की जाँच करें।",
      inputPlaceholder: "CM/L या BIS लाइसेंस संख्या दर्ज करें",
      checkFormat: "प्रारूप जाँचें",
      formatValid: "प्रारूप वैध प्रतीत होता है",
      formatInvalid: "प्रारूप अपेक्षित पैटर्न से मेल नहीं खाता",
      disclaimer: "यह टूल केवल पहचानकर्ता प्रारूप की जाँच करता है। यह वर्तमान BIS-जारी स्थिति की पुष्टि नहीं करता। आधिकारिक सत्यापन के लिए BIS वेबसाइट पर जाएं।",
      huidTitle: "हॉलमार्क / HUID सहायक",
      huidSubtitle: "हॉलमार्क विशिष्ट पहचान (HUID) संख्या के प्रारूप की जाँच करें।",
      huidPlaceholder: "HUID संख्या दर्ज करें",
      huidCheck: "HUID प्रारूप जाँचें",
    },

    laboratories: {
      title: "BIS परीक्षण प्रयोगशाला खोजक",
      subtitle: "BIS-मान्यता प्राप्त परीक्षण प्रयोगशालाएं खोजें।",
      searchPlaceholder: "प्रयोगशाला नाम, स्थान या उत्पाद डोमेन द्वारा खोजें...",
      noData: "प्रयोगशाला डेटा एकीकरण तैयार किया जा रहा है।",
      noDataDesc: "सत्यापित स्रोतों से प्रयोगशाला जानकारी एकीकृत होने के बाद यहां उपलब्ध होगी।",
      viewDetails: "विवरण देखें",
      directions: "दिशानिर्देश",
      contact: "संपर्क",
    },

    saved: {
      title: "सहेजे गए मानक",
      subtitle: "त्वरित संदर्भ के लिए आपके सहेजे गए BIS मानक।",
      empty: "अभी तक कोई सहेजा गया मानक नहीं।",
      emptyDesc: "मानक एक्सप्लोरर या खोज परिणामों से मानक सहेजें।",
      remove: "हटाएं",
      savedOn: "सहेजा गया",
    },

    common: {
      loading: "लोड हो रहा है...",
      error: "कुछ गलत हो गया",
      retry: "पुनः प्रयास करें",
      back: "वापस",
      close: "बंद करें",
      search: "खोजें",
      cancel: "रद्द करें",
      save: "सहेजें",
      delete: "हटाएं",
      viewAll: "सभी देखें",
      showMore: "अधिक दिखाएं",
      showLess: "कम दिखाएं",
      noResults: "कोई परिणाम नहीं मिला",
      comingSoon: "जल्द आ रहा है",
    },

    admin: {
      title: "ज्ञान आधार स्वास्थ्य",
      subtitle: "BIS ज्ञान इंजन स्थिति की निगरानी करें और पुनर्प्राप्ति गुणवत्ता का परीक्षण करें।",
      documentsIndexed: "अनुक्रमित दस्तावेज़",
      totalChunks: "कुल चंक्स",
      lastIngestion: "अंतिम अंतर्ग्रहण",
      testQuery: "परीक्षण क्वेरी",
      testQueryPlaceholder: "पुनर्प्राप्ति जाँचने के लिए परीक्षण क्वेरी दर्ज करें...",
      runTest: "परीक्षण चलाएं",
      retrievedChunks: "पुनर्प्राप्त चंक्स",
      similarity: "समानता",
    },

    suggestedPrompts: [
      "IS 10500 के लिए अनिवार्य परीक्षण पैरामीटर क्या हैं?",
      "मोटरसाइकिल हेलमेट पर कौन सा BIS मानक लागू होता है?",
      "प्रासंगिक आवश्यकताओं को सरल भाषा में समझाएं।",
      "इस मानक में कौन सी परीक्षण आवश्यकताएं उल्लिखित हैं?",
      "कौन सी धाराएं नमूनाकरण की चर्चा करती हैं?",
      "इस उत्तर का स्रोत दिखाएं।",
    ],

    productExamples: [
      "पैकेज्ड पीने का पानी",
      "मोटरसाइकिल हेलमेट",
      "विद्युत केबल",
      "सीमेंट",
      "सोने के आभूषण",
    ],
  },
};

type RecursiveString<T> = {
  [K in keyof T]: T[K] extends readonly (infer _)[]
    ? readonly string[]
    : T[K] extends object
    ? RecursiveString<T[K]>
    : string;
};

export type TranslationKey = keyof typeof translations.en;
export type Translations = RecursiveString<typeof translations.en>;
