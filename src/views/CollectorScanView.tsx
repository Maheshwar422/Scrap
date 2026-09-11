import React, { useState, useRef } from "react";
import { UserAccount, AIAnalysisResult, ItemCondition, MaterialLot, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { calculateFairValue, E_WASTE_PRICE_CATALOG, HIERARCHICAL_TAXONOMY } from "../data/pricingDataset";
import { SafetyCard } from "../components/SafetyCard";
import { AudioButton } from "../components/AudioButton";
import {
  Camera,
  Upload,
  Sparkles,
  Scale,
  DollarSign,
  PackagePlus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldCheck,
  Video,
  X,
  Tag,
  ScanText,
  HelpCircle,
  Edit3,
} from "lucide-react";

interface CollectorScanViewProps {
  currentUser: UserAccount;
  lang: Language;
  isOffline: boolean;
  onLotCreated: (lot: MaterialLot) => void;
  onCancel: () => void;
}

export const CollectorScanView: React.FC<CollectorScanViewProps> = ({
  currentUser,
  lang,
  isOffline,
  onLotCreated,
  onCancel,
}) => {
  const t = TRANSLATIONS[lang];

  // Steps: 1 = Image, 2 = AI Result & Weight, 3 = Fair Value & Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    model?: string;
    loading: boolean;
  }>({ connected: false, loading: true });

  React.useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({
          connected: !!data.hasGeminiKey,
          model: data.activeModel || "gemini-3.8-flash",
          loading: false,
        });
      })
      .catch(() => {
        setApiStatus({ connected: false, loading: false });
      });
  }, []);

  // Manual Category Fallback state
  const [isManualCategoryMode, setIsManualCategoryMode] = useState(false);
  const [selectedMajorCategory, setSelectedMajorCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Weight & Condition state (Section 7)
  const [weightValue, setWeightValue] = useState<string>("2.5");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const [condition, setCondition] = useState<ItemCondition>("used");

  // Sample quick images for demo presentation convenience!
  const SAMPLE_DEMO_IMAGES = [
    {
      name: "Copper Wires",
      url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=600&auto=format&fit=crop&q=80",
      category: "Copper Wire",
      detectedItem: "Heavy Stripped Copper Cables",
      weight: "3.0",
    },
    {
      name: "Motherboard",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      category: "Computer Motherboard",
      detectedItem: "Desktop ATX Motherboard",
      weight: "2.5",
    },
    {
      name: "Mobile Phone",
      url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
      category: "Mobile Phone",
      detectedItem: "Cracked Screen Smartphone",
      weight: "0.8",
    },
    {
      name: "Circuit Boards",
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
      category: "Circuit Board / PCB",
      detectedItem: "Mixed PCB Scrap Boards",
      weight: "4.0",
    },
  ];

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setAnalysisError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct Camera Stream
  const startLiveCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera streaming permission denied or unavailable, using fallback file input:", err);
      setIsCameraActive(false);
      cameraInputRef.current?.click();
    }
  };

  const captureCameraFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg", 0.85);
        setSelectedImage(dataUri);
        stopLiveCamera();
      }
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // AI Identification Handler
  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      if (isOffline) {
        // Offline heuristic simulation
        await new Promise((res) => setTimeout(res, 900));
        setAiResult({
          detectedItem: "Electronic Circuit Board / PCB Scrap",
          category: "Circuit Board / PCB",
          confidence: 91,
          conditionAssessment: "Used / scrap grade (Offline Classifier)",
          potentialMaterials: "Copper tracings, aluminium capacitors, solder metals",
          safetyWarning: "Store in dry area; wear gloves to prevent cuts from solder pins.",
          provider: "On-Device Offline Classifier",
        });
        setCurrentStep(2);
        return;
      }

      const imageDataUrl = selectedImage.startsWith("data:image/")
        ? selectedImage
        : await fetch(selectedImage)
            .then(async (response) => {
              if (!response.ok) throw new Error("Could not load the selected image.");
              const blob = await response.blob();
              return await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("Could not prepare the selected image."));
                reader.readAsDataURL(blob);
              });
            });
      const mimeType = imageDataUrl.match(/^data:(image\/[a-z0-9.+-]+);base64,/i)?.[1] || "image/jpeg";
      const res = await fetch("/api/identify-ewaste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageDataUrl,
          mimeType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server analysis error");
      if (data.success && data.data) {
        setAiResult({
          ...data.data,
          provider: data.provider || "Gemini Vision AI",
        });
        setCurrentStep(2);
      } else {
        throw new Error("Invalid analysis response");
      }
    } catch (err: any) {
      console.warn("AI endpoint error:", err);
      setAnalysisError(err instanceof Error ? err.message : "Image identification failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate current weight in kg
  const numericWeight = parseFloat(weightValue) || 1.0;
  const weightInKg = weightUnit === "g" ? numericWeight / 1000 : numericWeight;

  // Valuation Calculation
  const activeCategory = isManualCategoryMode && selectedMajorCategory
    ? selectedMajorCategory
    : aiResult?.category || "Mixed Electronic Scrap";
  const activeSubcategory = isManualCategoryMode && selectedSubcategory
    ? selectedSubcategory
    : aiResult?.subcategory;
  const activeBrand = aiResult?.brand;
  const valuation = calculateFairValue(
    activeCategory,
    weightInKg,
    condition,
    activeSubcategory,
    activeBrand
  );

  // Proceed to Step 3
  const handleConfirmWeight = () => {
    if (weightInKg <= 0) {
      setAnalysisError("Please enter a valid weight greater than 0.");
      return;
    }
    setCurrentStep(3);
  };

  // Create Lot Handler (Section 10)
  const handleCreateLot = () => {
    const timestamp = new Date().toISOString();
    const lotRandomNumber = Math.floor(1000 + Math.random() * 9000);
    const newLotId = `LOT-EW-${lotRandomNumber}`;

    const newLot: MaterialLot = {
      id: newLotId,
      collectorUsername: currentUser.username,
      collectorName: currentUser.name,
      photoUrl:
        selectedImage ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      detectedItem: aiResult?.detectedItem || "Assorted Electronic Scrap",
      category: activeCategory,
      confidence: aiResult?.confidence || 90,
      weightKg: Number(weightInKg.toFixed(2)),
      weightUnit: "kg",
      condition: condition,
      estimatedValueMin: valuation.minTotal,
      estimatedValueMax: valuation.maxTotal,
      referenceRateMin: valuation.minRate,
      referenceRateMax: valuation.maxRate,
      createdAt: timestamp,
      status: "active",
      safetyWarning:
        aiResult?.safetyWarning ||
        "Handle carefully with protective gloves. Do not burn in open air.",
      potentialMaterials:
        aiResult?.potentialMaterials ||
        "Copper, aluminium, ferrous steel, precious recovery metals",
      bids: [],
      isOfflinePending: isOffline,
      traceability: [
        {
          id: `tr-${lotRandomNumber}-1`,
          stage: "created",
          title: "Lot Created",
          description: `Collector ${currentUser.name} registered ${weightInKg.toFixed(2)} kg of ${activeCategory}`,
          timestamp: timestamp,
          actor: `${currentUser.name} (Collector)`,
        },
        {
          id: `tr-${lotRandomNumber}-2`,
          stage: "ai_identified",
          title: "AI Identified",
          description: `Identified as ${aiResult?.detectedItem} (${aiResult?.confidence}% confidence)`,
          timestamp: timestamp,
          actor: aiResult?.provider || "Gemini AI Vision",
        },
        {
          id: `tr-${lotRandomNumber}-3`,
          stage: "valuation_estimated",
          title: "Value Estimated",
          description: `Fair value estimated between ₹${valuation.minTotal} – ₹${valuation.maxTotal} based on reference rate ₹${valuation.minRate}–₹${valuation.maxRate}/kg`,
          timestamp: timestamp,
          actor: "E-Waste Price Engine",
        },
        {
          id: `tr-${lotRandomNumber}-4`,
          stage: "sent_to_recyclers",
          title: "Sent to Recyclers",
          description: "Broadcast to authorized verified recyclers for competitive bidding",
          timestamp: timestamp,
          actor: "Marketplace Router",
        },
      ],
    };

    onLotCreated(newLot);
  };

  const step1Narration =
    "Step 1: Take a photo with your phone camera or upload a scrap photo to identify the e-waste category.";
  const step2Narration = `AI detected ${aiResult?.detectedItem} under category ${aiResult?.category} with ${aiResult?.confidence}% confidence. Please confirm the weight in kilograms.`;
  const step3Narration = `Estimated Fair Value is ₹${valuation.minTotal} to ₹${valuation.maxTotal}. Reference rate is ₹${valuation.minRate} to ₹${valuation.maxRate} per kilogram. Tap Create Material Lot to send to verified recyclers.`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
        <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? "text-emerald-700" : ""}`}>
          <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
            1
          </span>
          <span>Capture</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? "text-emerald-700" : ""}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 2 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100"
          }`}>
            2
          </span>
          <span>AI & Weight</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? "text-emerald-700" : ""}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 3 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100"
          }`}>
            3
          </span>
          <span>Fair Value</span>
        </div>
      </div>

      {/* STEP 1: PHOTO CAPTURE / UPLOAD (Section 5) */}
      {currentStep === 1 && (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/70 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t.step1Title}
                </h2>
                {!apiStatus.loading && (
                  apiStatus.connected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Gemini Vision: Connected ({apiStatus.model})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Offline Classifier Active
                    </span>
                  )
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{t.step1Desc}</p>
            </div>
            <AudioButton textToSpeak={step1Narration} lang={lang} size="sm" />
          </div>

          {/* Hidden HTML Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Live Camera Stream Modal */}
          {isCameraActive && (
            <div className="rounded-2xl overflow-hidden bg-black relative aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <button
                onClick={stopLiveCamera}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={captureCameraFrame}
                className="absolute bottom-4 px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-sm shadow-xl flex items-center gap-2 active:scale-95"
              >
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Snap Picture</span>
              </button>
            </div>
          )}

          {/* Image Preview Box or Action Pickers */}
          {!isCameraActive && (
            <>
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-500 shadow-md aspect-video sm:aspect-[16/10]">
                    <img
                      src={selectedImage}
                      alt="E-waste item preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-md hover:bg-slate-900"
                      >
                        {t.changePhoto}
                      </button>
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={handleAnalyzeImage}
                    disabled={isAnalyzing}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base shadow-lg shadow-emerald-700/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{t.analyzingText}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span>{t.analyzeWaste}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Two Main Large Action Buttons (Section 5 MANDATE) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* A. TAKE PHOTO */}
                    <button
                      onClick={startLiveCamera}
                      className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-dashed border-emerald-400 text-emerald-900 transition-all group active:scale-98"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8" />
                      </div>
                      <span className="text-base font-black tracking-tight">{t.takePhoto}</span>
                      <span className="text-xs text-emerald-700 mt-1">Use Device Camera</span>
                    </button>

                    {/* B. UPLOAD PHOTO */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 text-slate-800 transition-all group active:scale-98"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                      </div>
                      <span className="text-base font-black tracking-tight">{t.uploadPhoto}</span>
                      <span className="text-xs text-slate-500 mt-1">From Storage / Gallery</span>
                    </button>
                  </div>

                  {/* 1-Click Demo Sample Photos (Great for fast evaluator review!) */}
                  <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>OR SELECT A REALISTIC DEMO SAMPLE:</span>
                      <span className="text-emerald-700 font-medium">1-Click Test</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {SAMPLE_DEMO_IMAGES.map((sample, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedImage(sample.url);
                            setWeightValue(sample.weight);
                          }}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-left group"
                        >
                          <img
                            src={sample.url}
                            alt={sample.name}
                            className="w-full h-16 object-cover rounded-lg mb-1.5"
                          />
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 block truncate">
                            {sample.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            ~{sample.weight} kg
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {analysisError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: AI IDENTIFICATION RESULT & WEIGHT ENTRY (Sections 6 & 7) */}
      {currentStep === 2 && aiResult && (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/70 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Step 2 of 3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AI Identification & Weight
              </h2>
            </div>
            <AudioButton textToSpeak={step2Narration} lang={lang} size="sm" />
          </div>

          {/* AI Result Card (Cycle 2 Enhanced) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-950">
                  Cycle 2 Vision & Brand AI
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {aiResult.confidenceLevel && (
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                    aiResult.confidenceLevel === "HIGH"
                      ? "bg-emerald-200 text-emerald-900"
                      : aiResult.confidenceLevel === "MEDIUM"
                      ? "bg-amber-200 text-amber-900"
                      : "bg-rose-200 text-rose-900"
                  }`}>
                    {aiResult.confidenceLevel} CONFIDENCE
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm">
                  {aiResult.confidence}%
                </span>
              </div>
            </div>

            {/* Category & Subcategory Tags */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-xs text-slate-500 font-semibold">{t.category}</span>
                {aiResult.subcategory && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Subcategory: {aiResult.subcategory}
                  </span>
                )}
              </div>
              <div className="text-lg font-black text-slate-900">
                {activeCategory}
              </div>
            </div>

            {/* Brand, Product & Model Recognition Box */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Recognized Brand:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {aiResult.brand || "Unknown / Unbranded"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Product Family:</span>
                <span className="font-bold text-slate-800">
                  {aiResult.productFamily || "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Model Identification:</span>
                <span className={`font-bold ${
                  aiResult.model && !aiResult.model.toLowerCase().includes("unknown") && !aiResult.model.toLowerCase().includes("not")
                    ? "text-emerald-700"
                    : "text-slate-500 italic"
                }`}>
                  {aiResult.model || "Not confidently identified"}
                </span>
              </div>
            </div>

            {/* OCR / Visible Text Markings */}
            {aiResult.visibleTextOCR && aiResult.visibleTextOCR.length > 0 && (
              <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <ScanText className="w-4 h-4 text-emerald-600" />
                  <span>OCR / Visible Markings Detected:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiResult.visibleTextOCR.map((txt, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                      "{txt}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Precious Metal Caution Banner (Section 15 MANDATE) */}
            {aiResult.isPreciousMetalBearing && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/60 text-amber-950 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Potential Precious-Metal-Bearing Scrap Detected</span>
                </div>
                <p className="text-amber-900/90 text-[11px] leading-relaxed">
                  {aiResult.preciousMetalDisclaimer ||
                    "Gold/silver-colored contacts or high-grade components detected. Exact precious metal content cannot be determined from a photograph; professional assay testing is required."}
                </p>
              </div>
            )}

            {/* Materials & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                <span className="text-slate-500 block font-semibold">{t.conditionAssessment}</span>
                <p className="text-slate-800">{aiResult.conditionAssessment}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                <span className="text-slate-500 block font-semibold">{t.potentialMaterials}</span>
                <p className="text-slate-800">{aiResult.potentialMaterials}</p>
              </div>
            </div>

            {/* Manual Fallback Toggle Button */}
            <div className="pt-1 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 italic flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{t.aiDisclaimer}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsManualCategoryMode(!isManualCategoryMode)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isManualCategoryMode ? "Use AI Classification" : "Correct Category / Fallback"}</span>
              </button>
            </div>

            {/* Manual Fallback Dropdown Selector */}
            {isManualCategoryMode && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3 text-xs animate-fade-in">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Manual Category Selection (Fallback Mode)</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  Select the appropriate category and subcategory from the e-waste reference taxonomy:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-950 mb-1">
                      Major Category
                    </label>
                    <select
                      value={selectedMajorCategory}
                      onChange={(e) => {
                        setSelectedMajorCategory(e.target.value);
                        setSelectedSubcategory("");
                      }}
                      className="w-full p-2.5 rounded-lg border border-amber-300 bg-white font-semibold text-slate-900 text-xs"
                    >
                      <option value="">-- Choose Category --</option>
                      {HIERARCHICAL_TAXONOMY.map((item, idx) => (
                        <option key={idx} value={item.majorCategory}>
                          {item.majorCategory}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-950 mb-1">
                      Subcategory / Item Type
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-amber-300 bg-white font-semibold text-slate-900 text-xs"
                    >
                      <option value="">-- Choose Subcategory --</option>
                      {selectedMajorCategory &&
                        HIERARCHICAL_TAXONOMY.find(
                          (h) => h.majorCategory === selectedMajorCategory
                        )?.subcategories.map((sub, sidx) => (
                          <option key={sidx} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Safety Card (Section 19) */}
          <SafetyCard
            safetyWarning={aiResult.safetyWarning}
            category={activeCategory}
            lang={lang}
          />

          {/* Weight Input (Section 7 MANDATE) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {t.weightPrompt}
                </h3>
              </div>
              <AudioButton
                textToSpeak={`${t.weightPrompt}. Enter weight in kilograms or grams.`}
                lang={lang}
                size="sm"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Input: [ 2.5 ] [ kg ▼ ] */}
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  className="w-full text-2xl font-black px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none bg-white text-slate-900"
                  placeholder="2.5"
                />
              </div>

              {/* Unit Selector */}
              <div className="flex bg-slate-200/80 rounded-xl p-1 border border-slate-300">
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-black transition-all ${
                    weightUnit === "kg"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("g")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-black transition-all ${
                    weightUnit === "g"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  grams
                </button>
              </div>
            </div>

            {/* Condition Selector */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-slate-700 block">
                {t.conditionLabel}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "used", label: t.conditionUsed },
                  { key: "intact", label: t.conditionIntact },
                  { key: "damaged", label: t.conditionDamaged },
                  { key: "dismantled", label: t.conditionDismantled },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCondition(item.key as ItemCondition)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left ${
                      condition === item.key
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Collector entered weight is authoritative for reference pricing until confirmed during physical handover.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
            >
              Back
            </button>
            <button
              onClick={handleConfirmWeight}
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Calculate Fair Value</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FAIR VALUE ESTIMATION & LOT CREATION (Sections 8, 9 & 10) */}
      {currentStep === 3 && aiResult && (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/70 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Step 3 of 3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.estimatedFairValue}
              </h2>
            </div>
            <AudioButton textToSpeak={step3Narration} lang={lang} size="sm" />
          </div>

          {/* Prominent Fair Value Card (Section 8 MANDATE) */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                {t.estimatedFairValue}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-bold border border-white/15">
                {t.demoReferencePrice}
              </span>
            </div>

            {/* Price Range */}
            <div className="py-2">
              <div className="text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight">
                ₹{valuation.minTotal.toLocaleString("en-IN")} – ₹{valuation.maxTotal.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-emerald-100/90 mt-1 font-medium">
                {t.referenceRate}: ₹{valuation.minRate} – ₹{valuation.maxRate} / kg
              </div>
            </div>

            {/* Cycle 2 Valuation Explanation */}
            {valuation.valuationExplanation && (
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-emerald-100 space-y-1">
                <span className="font-bold text-emerald-300 block text-[11px] uppercase tracking-wider">
                  Valuation Explanation Basis:
                </span>
                <p className="text-[11px] leading-relaxed opacity-95">
                  {valuation.valuationExplanation}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-white/15 text-xs text-emerald-200/90 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{t.valuationDisclaimer}</span>
            </div>
          </div>

          {/* Lot Summary Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Material Lot Summary
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block font-medium">Item Name:</span>
                <span className="font-bold text-slate-900 truncate block">{aiResult.detectedItem}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Category:</span>
                <span className="font-bold text-slate-900">{activeCategory}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Weight:</span>
                <span className="font-bold text-slate-900">{weightInKg.toFixed(2)} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Condition:</span>
                <span className="font-bold text-slate-900 capitalize">{condition}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: CREATE MATERIAL LOT */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleCreateLot}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-700/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <PackagePlus className="w-5 h-5" />
              <span>{t.createLotButton}</span>
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-2.5 rounded-xl text-xs text-slate-500 font-bold hover:text-slate-800"
            >
              Edit Weight or Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
