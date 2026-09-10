import { Language } from "../types";

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: "E-Waste Connect",
    tagline: "Formal E-Waste Collection & Recycling Platform",
    verifiedRecycler: "VERIFIED RECYCLER",
    verifiedRecyclerNotice: "Only verified recyclers can bid on collector lots.",
    demoAccountNotice: "Demo verified accounts for YHACK'26 Challenge 19.",
    
    // Navigation
    dashboard: "Dashboard",
    scanWaste: "Scan E-Waste",
    myLots: "My Lots",
    myOffers: "My Offers",
    myEarnings: "My Earnings",
    marketplace: "Marketplace",
    availableLots: "Available Lots",
    myBids: "My Bids",
    transactions: "Transactions",
    switchAccount: "Switch Demo User",
    logout: "Logout",
    
    // Collector Dashboard
    welcomeCollector: "Welcome, Collector",
    quickActions: "Quick Actions",
    activeLotsCount: "Active Lots",
    pendingOffersCount: "Pending Recycler Offers",
    totalEarningsAmount: "Total Recorded Earnings",
    completedTransactionsCount: "Completed Deals",
    scanPrompt: "Take or upload a photo of electronic scrap to get instant AI category & fair valuation.",
    startScanButton: "SCAN E-WASTE NOW",
    recentActivity: "Recent Activity",
    
    // Scan & Identification
    step1Title: "Capture / Upload E-Waste",
    step1Desc: "Take a photo directly or upload an image from your files.",
    takePhoto: "TAKE PHOTO",
    uploadPhoto: "UPLOAD PHOTO",
    changePhoto: "Change Photo",
    analyzeWaste: "ANALYZE E-WASTE",
    analyzingText: "AI is analyzing e-waste image...",
    
    // AI Identification Result
    detectedItem: "Detected Item",
    category: "Category",
    confidence: "Confidence",
    conditionAssessment: "Condition Assessment",
    potentialMaterials: "Potential Recyclable Materials",
    safetyWarning: "Safety Warning",
    aiDisclaimer: "AI identifies category. It does NOT invent weight or guarantee exact final price.",
    
    // Weight Step
    weightPrompt: "How much does this scrap weigh?",
    weightInputLabel: "Enter Weight",
    unitKg: "kg",
    unitGrams: "grams",
    conditionLabel: "Condition",
    conditionIntact: "Intact / Working Appearance",
    conditionUsed: "Used / Scrap Grade",
    conditionDamaged: "Damaged / Broken",
    conditionDismantled: "Dismantled Parts",
    
    // Valuation Step
    estimatedFairValue: "ESTIMATED FAIR VALUE",
    referenceRate: "Reference rate",
    valuationDisclaimer: "Final value may vary after physical inspection and confirmed weight.",
    demoReferencePrice: "Demo Reference Price",
    createLotButton: "CREATE MATERIAL LOT",
    creatingLotText: "Creating Digital Lot...",
    
    // Marketplace & Bidding
    lotDetails: "Lot Details",
    weight: "Weight",
    currentStatus: "Status",
    bidsReceived: "Bids Received",
    noBidsYet: "No recycler bids yet. Your lot is active in the marketplace.",
    placeBid: "PLACE BID",
    enterOfferPrice: "Enter Offer Price (₹)",
    minimumAcceptableBid: "Minimum acceptable demo bid",
    bidBelowRangeError: "Bid below the estimated fair-value range.",
    bidAcceptedSuccess: "Bid accepted. Within estimated fair-value range.",
    bidAboveEstimate: "Above reference estimate",
    submitBid: "SUBMIT VALIDATED BID",
    acceptBidButton: "ACCEPT BID",
    
    // Handover & Transaction Flow
    bidAcceptedStatus: "Bid Accepted",
    handoverPending: "Handover Pending",
    confirmHandover: "CONFIRM HANDOVER",
    handoverCompleted: "Handover Completed",
    recordPayment: "RECORD PAYMENT",
    paymentRecorded: "Payment Recorded",
    transactionCompleted: "Transaction Completed",
    viewReceipt: "View Digital Receipt",
    downloadReceipt: "Download Receipt",
    
    // Offline
    offlineBanner: "You are currently working Offline. Pending lots will be saved locally.",
    onlineBanner: "Online — Connected to Central Recycling Network",
    syncPendingLots: "Sync Pending Lots",
    pendingSyncCount: "Lots waiting for connection",
    
    // Audio Prompts
    listenAudio: "Listen",
    audioGreeting: "Welcome to E-Waste Connect. Turn your scrap into fair value safely.",
  },
  
  ta: {
    appName: "இ-வேஸ்ட் கனெக்ட்",
    tagline: "மின்னணுக் கழிவு சேகரிப்பு மற்றும் மறுசுழற்சி தளம்",
    verifiedRecycler: "சரிபார்க்கப்பட்ட மறுசுழற்சியாளர்",
    verifiedRecyclerNotice: "சரிபார்க்கப்பட்ட மறுசுழற்சியாளர்கள் மட்டுமே ஏலம் கேட்க முடியும்.",
    demoAccountNotice: "YHACK'26 சவால் 19 க்கான மாதிரி கணக்குகள்.",
    
    // Navigation
    dashboard: "முகப்பு",
    scanWaste: "ஸ்கேன் செய்க",
    myLots: "எனது லாட்டுகள்",
    myOffers: "சலுகைகள்",
    myEarnings: "எனது வருமானம்",
    marketplace: "சந்தை",
    availableLots: "கிடைக்கும் கழிவுகள்",
    myBids: "எனது ஏலங்கள்",
    transactions: "பரிவர்த்தனைகள்",
    switchAccount: "கணக்கை மாற்று",
    logout: "வெளியேறு",
    
    // Collector Dashboard
    welcomeCollector: "வணக்கம், கழிவு சேகரிப்பாளர்",
    quickActions: "விரைவுச் செயல்கள்",
    activeLotsCount: "செயலில் உள்ளவை",
    pendingOffersCount: "நிலுவையில் உள்ள ஏலங்கள்",
    totalEarningsAmount: "மொத்த வருமானம்",
    completedTransactionsCount: "முடிந்த பரிவர்த்தனை",
    scanPrompt: "மின்னணுக் கழிவின் புகைப்படத்தை எடுத்து நியாயமான விலை மதிப்பைப் பெறுங்கள்.",
    startScanButton: "புகைப்படம் எடு / ஸ்கேன் செய்",
    recentActivity: "சமீபத்திய நிகழ்வுகள்",
    
    // Scan & Identification
    step1Title: "புகைப்படம் எடுத்தல் / பதிவேற்றம்",
    step1Desc: "கேமரா மூலம் படம் எடுக்கவும் அல்லது கோப்பிலிருந்து பதிவேற்றவும்.",
    takePhoto: "கேமரா படம் எடு",
    uploadPhoto: "படம் பதிவேற்று",
    changePhoto: "படத்தை மாற்று",
    analyzeWaste: "கழிவை ஆய்வு செய்",
    analyzingText: "AI கழிவை அடையாளம் காண்கிறது...",
    
    // AI Identification Result
    detectedItem: "கண்டறியப்பட்ட பொருள்",
    category: "வகைப்பாடு",
    confidence: "நம்பகத்தன்மை",
    conditionAssessment: "பொருளின் நிலை",
    potentialMaterials: "பயனுள்ள உலோகங்கள்",
    safetyWarning: "பாதுகாப்பு எச்சரிக்கை",
    aiDisclaimer: "AI வகையை மட்டுமே அறியும். எடையையோ அல்லது இறுதி விலையையோ சுயமாக தீர்மானிக்காது.",
    
    // Weight Step
    weightPrompt: "இந்தக் கழிவின் எடை எவ்வளவு?",
    weightInputLabel: "எடையை உள்ளிடுக",
    unitKg: "கிலோ",
    unitGrams: "கிராம்",
    conditionLabel: "தற்போதைய நிலை",
    conditionIntact: "முழுமையான நிலை",
    conditionUsed: "பயன்படுத்திய உடைந்த நிலை",
    conditionDamaged: "சேதமடைந்த நிலை",
    conditionDismantled: "பிரிக்கப்பட்ட பாகங்கள்",
    
    // Valuation Step
    estimatedFairValue: "மதிப்பிடப்பட்ட நியாயமான விலை",
    referenceRate: "குறிப்பு விலை",
    valuationDisclaimer: "நேரடி எடை சரிபார்ப்புக்குப் பின் இறுதி விலை மாறுபடலாம்.",
    demoReferencePrice: "மாதிரி குறிப்பு விலை",
    createLotButton: "டிஜிட்டல் லாட் உருவாக்கு",
    creatingLotText: "லாட் உருவாக்கப்படுகிறது...",
    
    // Marketplace & Bidding
    lotDetails: "லாட் விவரம்",
    weight: "எடை",
    currentStatus: "நிலை",
    bidsReceived: "வந்த ஏலங்கள்",
    noBidsYet: "இன்னும் ஏலங்கள் வரவில்லை. உங்கள் லாட் சந்தையில் உள்ளது.",
    placeBid: "ஏலம் கேள்",
    enterOfferPrice: "விலையை உள்ளிடுக (₹)",
    minimumAcceptableBid: "குறைந்தபட்ச ஏற்கத்தக்க ஏலம்",
    bidBelowRangeError: "ஏலத் தொகை குறைந்தபட்ச நியாய விலையை விடக் குறைவு.",
    bidAcceptedSuccess: "ஏலம் ஏற்கப்பட்டது. நியாயமான வரம்பிற்குள் உள்ளது.",
    bidAboveEstimate: "மதிப்பீட்டை விட கூடுதல் சலுகை",
    submitBid: "ஏலத்தை சமர்ப்பி",
    acceptBidButton: "ஏலத்தை ஏற்றுக்கொள்",
    
    // Handover & Transaction Flow
    bidAcceptedStatus: "ஏலம் ஏற்கப்பட்டது",
    handoverPending: "ஒப்படைப்பு நிலுவையில்",
    confirmHandover: "ஒப்படைப்பை உறுதிசெய்",
    handoverCompleted: "ஒப்படைப்பு முடிந்தது",
    recordPayment: "பணம் செலுத்துதலைப் பதிவு செய்",
    paymentRecorded: "பணம் செலுத்தப்பட்டது",
    transactionCompleted: "பரிவர்த்தனை நிறைவடைந்தது",
    viewReceipt: "டிஜிட்டல் ரசீது காண்க",
    downloadReceipt: "ரசீது பதிவிறக்கு",
    
    // Offline
    offlineBanner: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். விவரங்கள் சாதனத்தில் சேமிக்கப்படும்.",
    onlineBanner: "இணைப்பு உள்ளது — நேரலை நெட்வொர்க்",
    syncPendingLots: "நிலுவை லாட்களை ஒத்திசைக்க",
    pendingSyncCount: "இணையத்திற்காக காத்திருக்கும் லாட்டுகள்",
    
    // Audio Prompts
    listenAudio: "கேளுங்கள்",
    audioGreeting: "இ-வேஸ்ட் கனெக்ட் தளத்திற்கு வரவேற்கிறோம். உங்கள் பழைய மின்னணுக் கழிவுகளுக்கு நியாயமான விலை பெறுங்கள்.",
  },
  
  hi: {
    appName: "ई-वेस्ट कनेक्ट",
    tagline: "औपचारिक ई-कचरा संग्रहण एवं पुनर्चक्रण मंच",
    verifiedRecycler: "सत्यापित पुनर्चक्रक",
    verifiedRecyclerNotice: "केवल सत्यापित पुनर्चक्रक ही बोली लगा सकते हैं।",
    demoAccountNotice: "YHACK'26 चैलेंज 19 के लिए डेमो खाते।",
    
    // Navigation
    dashboard: "डैशबोर्ड",
    scanWaste: "कचरा स्कैन करें",
    myLots: "मेरे लॉट",
    myOffers: "प्राप्त बोलियां",
    myEarnings: "मेरी कमाई",
    marketplace: "बाज़ार",
    availableLots: "उपलब्ध लॉट",
    myBids: "मेरी बोलियां",
    transactions: "लेन-देन",
    switchAccount: "खाता बदलें",
    logout: "लॉगआउट",
    
    // Collector Dashboard
    welcomeCollector: "नमस्ते, स्क्रैप संग्राहक",
    quickActions: "त्वरित क्रियाएं",
    activeLotsCount: "सक्रिय लॉट",
    pendingOffersCount: "प्रतीक्षारत बोलियां",
    totalEarningsAmount: "कुल अर्जित राशि",
    completedTransactionsCount: "सफल सौदे",
    scanPrompt: "उचित मूल्य जानने के लिए इलेक्ट्रॉनिक स्क्रैप की फोटो लें।",
    startScanButton: "ई-कचरा फोटो लें / स्कैन करें",
    recentActivity: "हाल की गतिविधि",
    
    // Scan & Identification
    step1Title: "फोटो खींचें / अपलोड करें",
    step1Desc: "कैमरे से सीधे फोटो लें या गैलरी से चुनें।",
    takePhoto: "कैमरा से फोटो लें",
    uploadPhoto: "फोटो अपलोड करें",
    changePhoto: "फोटो बदलें",
    analyzeWaste: "स्क्रैप की पहचान करें",
    analyzingText: "AI ई-कचरे की पहचान कर रहा है...",
    
    // AI Identification Result
    detectedItem: "पहचाना गया सामान",
    category: "श्रेणी",
    confidence: "सटीकता",
    conditionAssessment: "कंडीशन",
    potentialMaterials: "प्राप्त होने वाली धातुएं",
    safetyWarning: "सुरक्षा चेतावनी",
    aiDisclaimer: "AI केवल श्रेणी पहचानता है। यह वजन या निश्चित कीमत तय नहीं करता।",
    
    // Weight Step
    weightPrompt: "इस स्क्रैप का वजन कितना है?",
    weightInputLabel: "वजन दर्ज करें",
    unitKg: "किलोग्राम (kg)",
    unitGrams: "ग्राम",
    conditionLabel: "सामान की स्थिति",
    conditionIntact: "साबुत / सामान्य स्क्रैप",
    conditionUsed: "उपयोग किया हुआ स्क्रैप",
    conditionDamaged: "टूटा-फूटा स्क्रैप",
    conditionDismantled: "खुले हुए पुर्जे",
    
    // Valuation Step
    estimatedFairValue: "अनुमानित उचित मूल्य",
    referenceRate: "संदर्भ दर",
    valuationDisclaimer: "भौतिक जांच एवं वजन पुष्टि के बाद अंतिम मूल्य भिन्न हो सकता है।",
    demoReferencePrice: "डेमो संदर्भ दर",
    createLotButton: "डिजिटल लॉट बनाएं",
    creatingLotText: "लॉट तैयार हो रहा है...",
    
    // Marketplace & Bidding
    lotDetails: "लॉट विवरण",
    weight: "वजन",
    currentStatus: "स्थिति",
    bidsReceived: "प्राप्त बोलियां",
    noBidsYet: "अभी तक कोई बोली नहीं आई है। आपका लॉट बाज़ार में लाइव है।",
    placeBid: "बोली लगाएं",
    enterOfferPrice: "प्रस्तावित मूल्य दर्ज करें (₹)",
    minimumAcceptableBid: "न्यूनतम स्वीकार्य बोली",
    bidBelowRangeError: "बोली अनुमानित न्यूनतम मूल्य से कम है।",
    bidAcceptedSuccess: "बोली स्वीकार की गई। उचित मूल्य सीमा के भीतर है।",
    bidAboveEstimate: "संदर्भ अनुमान से बेहतर प्रस्ताव",
    submitBid: "बोली जमा करें",
    acceptBidButton: "बोली स्वीकार करें",
    
    // Handover & Transaction Flow
    bidAcceptedStatus: "बोली स्वीकृत",
    handoverPending: "हैंडओवर लंबित",
    confirmHandover: "हैंडओवर की पुष्टि करें",
    handoverCompleted: "हैंडओवर संपन्न",
    recordPayment: "भुगतान दर्ज करें",
    paymentRecorded: "भुगतान प्राप्त हुआ",
    transactionCompleted: "लेन-देन पूर्ण",
    viewReceipt: "डिजिटल रसीद देखें",
    downloadReceipt: "रसीद डाउनलोड करें",
    
    // Offline
    offlineBanner: "आप अभी ऑफलाइन हैं। डेटा डिवाइस पर सुरक्षित रहेगा।",
    onlineBanner: "ऑनलाइन — केंद्रीय नेटवर्क से कनेक्टेड",
    syncPendingLots: "लंबित लॉट सिंक करें",
    pendingSyncCount: "इंटरनेट का इंतज़ार कर रहे लॉट",
    
    // Audio Prompts
    listenAudio: "सुनें",
    audioGreeting: "ई-वेस्ट कनेक्ट में आपका स्वागत है। अपने इलेक्ट्रॉनिक कचरे का उचित मूल्य पाएं।",
  },
};
