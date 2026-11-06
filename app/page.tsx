"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Compass,
  Sparkles,
  Send,
  Calendar,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  RotateCcw,
  KeyRound,
  MapPin,
  Camera,
  HeartHandshake,
  Lightbulb,
  Gamepad2,
  Trophy,
} from "lucide-react";

// Default YouTube Video ID (bisa diganti dengan ID lagu YouTube favorit Anda kapan saja)
// Contoh lagu romantis piano / lofi: "jfKfPfyJRdk" (Lofi Hip Hop) atau "2li_c24Q0Yk" (Romantic Piano)
const DEFAULT_YT_VIDEO_ID = "cNGjD0VG4R8";

export default function MysteryInvitationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [herName, setHerName] = useState("");

  // Mini-game state
  const [gameScore, setGameScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ top: 40, left: 45 });
  const [gameWon, setGameWon] = useState(false);

  // YouTube Background Audio Player states
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [ytPlayerReady, setYtPlayerReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);

  // Form states
  const [decision, setDecision] = useState<"accepted" | "">("");
  const [guessAnswer, setGuessAnswer] = useState("");
  const [herMessage, setHerMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Typing animation states for Step 3
  const [displayedText1, setDisplayedText1] = useState("");
  const [displayedText2, setDisplayedText2] = useState("");
  const [showDateBox, setShowDateBox] = useState(false);

  // Typing animation states for Clues (Step 4, 5, 6)
  const [displayedClue1, setDisplayedClue1] = useState("");
  const [displayedClue2, setDisplayedClue2] = useState("");
  const [displayedClue3, setDisplayedClue3] = useState("");

  // Playful reject button
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });

  // Floating ambient particles
  const [floatingParticles, setFloatingParticles] = useState<
    Array<{ id: number; left: number; duration: number; delay: number; size: number }>
  >([]);

  useEffect(() => {
    const particles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 95),
      duration: 14 + Math.random() * 12,
      delay: Math.random() * 7,
      size: 12 + Math.random() * 16,
    }));
    setFloatingParticles(particles);

    // Load YouTube IFrame API
    const loadYT = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).YT && (window as any).YT.Player) {
        initYTPlayer();
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).onYouTubeIframeAPIReady = () => {
        initYTPlayer();
      };
    };

    const initYTPlayer = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const YT = (window as any).YT;
      if (!YT || ytPlayerRef.current) return;

      ytPlayerRef.current = new YT.Player("youtube-music-player", {
        height: "0",
        width: "0",
        videoId: DEFAULT_YT_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: DEFAULT_YT_VIDEO_ID,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            setYtPlayerReady(true);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsPlayingMusic(true);
            } else if (event.data === 2) {
              setIsPlayingMusic(false);
            }
          },
        },
      });
    };

    loadYT();
  }, []);

  // Typing animation effect when reaching Step 3
  useEffect(() => {
    if (currentStep !== 3) {
      setDisplayedText1("");
      setDisplayedText2("");
      setShowDateBox(false);
      return;
    }

    const fullText1 =
      "Ketika kamu membuka undangan ini, ada sesuatu yang berbeda dari undangan yang sebelum-sebelumnya. Kali ini izinkan aku mengajakmu menunjukan sesuatu yang akan menjadi pertama kali dari bagian cerita hidupku.";
    const fullText2 =
      "Tapi kali ini aku tidak menunjukan dimana tempatnya ataupun rundown acaranya, melainkan aku ingin memberikan clue yang dimana jawabannya akan aku beri tahu saat hari H...";

    let idx1 = 0;
    let idx2 = 0;
    let timeoutId: NodeJS.Timeout;

    const typeFirstParagraph = () => {
      if (idx1 < fullText1.length) {
        setDisplayedText1(fullText1.slice(0, idx1 + 1));
        idx1++;
        timeoutId = setTimeout(typeFirstParagraph, 28);
      } else {
        timeoutId = setTimeout(typeSecondParagraph, 350);
      }
    };

    const typeSecondParagraph = () => {
      if (idx2 < fullText2.length) {
        setDisplayedText2(fullText2.slice(0, idx2 + 1));
        idx2++;
        timeoutId = setTimeout(typeSecondParagraph, 28);
      } else {
        timeoutId = setTimeout(() => {
          setShowDateBox(true);
        }, 400);
      }
    };

    timeoutId = setTimeout(typeFirstParagraph, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentStep]);

  // Typing animation effect for Clue #1 (Step 4)
  useEffect(() => {
    if (currentStep !== 4) {
      setDisplayedClue1("");
      return;
    }

    const fullClue1 =
      "Tidak semua momen berharga harus terjadi di dalam ruangan tertutup. Terkadang, semesta justru menjadi saksi terbaik bagi sebuah cerita, Dimanakah aku??";
    let idx = 0;
    let timeoutId: NodeJS.Timeout;

    const typeClue1 = () => {
      if (idx < fullClue1.length) {
        setDisplayedClue1(fullClue1.slice(0, idx + 1));
        idx++;
        timeoutId = setTimeout(typeClue1, 26);
      }
    };

    timeoutId = setTimeout(typeClue1, 250);
    return () => clearTimeout(timeoutId);
  }, [currentStep]);

  // Typing animation effect for Clue #2 (Step 5)
  useEffect(() => {
    if (currentStep !== 5) {
      setDisplayedClue2("");
      return;
    }

    const fullClue2 =
      "Aku menjadi bagian dari sesuatu yang di abadikan seseorang di media sosial. Bukan karena aku langka, tetapi karena ada seseorang yang begitu menyukai keindahanku. Apakah aku?";
    let idx = 0;
    let timeoutId: NodeJS.Timeout;

    const typeClue2 = () => {
      if (idx < fullClue2.length) {
        setDisplayedClue2(fullClue2.slice(0, idx + 1));
        idx++;
        timeoutId = setTimeout(typeClue2, 26);
      }
    };

    timeoutId = setTimeout(typeClue2, 250);
    return () => clearTimeout(timeoutId);
  }, [currentStep]);

  // Typing animation effect for Clue #3 (Step 6)
  useEffect(() => {
    if (currentStep !== 6) {
      setDisplayedClue3("");
      return;
    }

    const fullClue3 =
      "Ada pertarungan yang tidak terlihat oleh siapa pun. Bukan tentang menang atau kalah, bukan pula tentang siapa yang paling kuat. Namun, tentang keberanian untuk menunjukan satu kemungkinan yang belum tentu sesuai harapan.";
    let idx = 0;
    let timeoutId: NodeJS.Timeout;

    const typeClue3 = () => {
      if (idx < fullClue3.length) {
        setDisplayedClue3(fullClue3.slice(0, idx + 1));
        idx++;
        timeoutId = setTimeout(typeClue3, 26);
      }
    };

    timeoutId = setTimeout(typeClue3, 250);
    return () => clearTimeout(timeoutId);
  }, [currentStep]);

  const toggleMusic = () => {
    if (!ytPlayerRef.current) return;

    try {
      if (isPlayingMusic) {
        ytPlayerRef.current.pauseVideo();
        setIsPlayingMusic(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlayingMusic(true);
      }
    } catch {
      console.log("YouTube player interaction error");
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#e2e8f0"],
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!isPlayingMusic && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.playVideo();
          setIsPlayingMusic(true);
        } catch {
          // autoplay restrictions
        }
      }
      triggerConfetti();
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mini-Game: Catch 3 Stars
  const handleCatchHeart = () => {
    const newScore = gameScore + 1;
    setGameScore(newScore);
    triggerConfetti();

    if (newScore >= 3) {
      setGameWon(true);
    } else {
      const newTop = Math.floor(Math.random() * 55) + 20;
      const newLeft = Math.floor(Math.random() * 65) + 15;
      setTargetPos({ top: newTop, left: newLeft });
    }
  };

  const moveNoButton = () => {
    setNoCount((prev) => prev + 1);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxX = isMobile ? 80 : 160;
    const maxY = isMobile ? 60 : 100;
    const randomX = Math.floor(Math.random() * (maxX * 2)) - maxX;
    const randomY = Math.floor(Math.random() * (maxY * 2)) - maxY;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const handleAccept = () => {
    setDecision("accepted");
    triggerConfetti();
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
      });
    }, 200);
  };

  const getRejectButtonText = () => {
    const texts = [
      "Maaf, belum bisa ikut 🥺",
      "Yakin nggak penasaran? 🥺",
      "Jangan buru-buru nolak...",
      "Aku udah berharap banget lho 😭",
      "Pilih 'Terima Undangan' aja plisss...",
      "Tombol ini bakal kabur terus! 🏃‍♂️💨",
      "Ayo terima aja undangannya 😝",
    ];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) return;
    setCurrentStep(8);
    triggerConfetti();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateWhatsAppMessage = () => {
    return (
      `Halo! Aku udah baca seluruh surat undangan rahasia dari kamu... ✨\n\n` +
      `Keputusan: AKU MENERIMA UNDANGAN INI! 🎉\n` +
      `Tanggal Acara: Siap untuk 14 November 2026! 🗓️\n` +
      `${guessAnswer ? `Tebakan clue-ku: "${guessAnswer}"\n` : ""}` +
      `${herMessage ? `Pesan untukmu: "${herMessage}"` : ""}`
    );
  };

  const sendToWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const copyAnswer = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const displayName = herName.trim() ? herName.trim() : "Prinsesss";

  return (
    <main className="relative min-h-screen py-8 px-3 sm:py-12 sm:px-6 flex flex-col items-center justify-center">
      {/* Hidden YouTube Audio IFrame */}
      <div id="youtube-music-player" className="hidden pointer-events-none" />

      {/* Ambient Floating Sparkles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingParticles.map((p) => (
          <div
            key={p.id}
            className="absolute bottom-[-50px] animate-float-heart select-none text-rose-300/35"
            style={{
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              fontSize: `${p.size}px`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Floating Music Button Toggle */}
      <div className="fixed top-3 right-3 sm:top-5 sm:right-5 z-50">
        <button
          onClick={toggleMusic}
          aria-label="Toggle YouTube background music"
          className="p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-rose-200 text-stone-700 hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold text-rose-600 pr-1 hidden sm:inline">
                Musik Nyala
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />
              <span className="text-[11px] sm:text-xs font-medium text-stone-500 pr-1 hidden sm:inline">
                Putar Musik
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Step Progress Bar */}
        {currentStep > 1 && currentStep < 8 && (
          <div className="mb-4 sm:mb-6 flex items-center justify-between px-1">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
              Tahap {currentStep - 1} dari 6
            </span>
            <div className="flex gap-1">
              {[2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    s === currentStep
                      ? "w-6 sm:w-7 bg-rose-500"
                      : s < currentStep
                      ? "w-2 sm:w-2.5 bg-rose-300"
                      : "w-2 sm:w-2.5 bg-stone-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: COVER UNDANGAN (Stiker 1) */}
        {currentStep === 1 && (
          <div className="text-center glass-card rounded-3xl p-6 sm:p-12 shadow-2xl transition-all duration-500">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 hover:scale-105 transition-transform duration-300 drop-shadow-md">
                <img
                  src="/gif/stiker 1.gif"
                  alt="Envelope sticker"
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </div>
            </div>
x
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-800 tracking-tight mb-2.5 sm:mb-3">
              Ada Sesuatu Khusus Untukmu...
            </h1>
            <p className="text-stone-600 text-xs sm:text-base max-w-md mx-auto mb-6 sm:mb-7 leading-relaxed">
              Sebelum kamu membuka isi undangannya, ada mini game tantangan kecil untuk membuktikan kunci rahasianya!
            </p>

            <button
              onClick={nextStep}
              className="btn-romantic w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Mulai Mini Games</span>
            </button>
          </div>
        )}

        {/* STEP 2: MINI GAME "TANGKAP 3 KUNCI BINTANG" */}
        {currentStep === 2 && (
          <div className="glass-card rounded-3xl p-6 sm:p-11 shadow-2xl text-center space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-amber-100 text-amber-800 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-amber-600" /> Mini Game: Buka Surat Undangan
            </div>

            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Tangkap 3 Kunci Bintang! ✨
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Ketuk bintang bercahaya di area permainan sebanyak 3 kali untuk membuka amplop rahasia ini.
              </p>
            </div>

            {/* Score Tracker */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-300 ${
                    gameScore >= star
                      ? "bg-amber-400 text-white shadow-md scale-110"
                      : "bg-stone-100 text-stone-300 border border-stone-200"
                  }`}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* Game Canvas Area */}
            <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-rose-50/70 to-pink-50/80 rounded-2xl border-2 border-dashed border-rose-300 overflow-hidden shadow-inner flex items-center justify-center">
              {!gameWon ? (
                <button
                  type="button"
                  onClick={handleCatchHeart}
                  style={{
                    position: "absolute",
                    top: `${targetPos.top}%`,
                    left: `${targetPos.left}%`,
                    transform: "translate(-50%, -50%)",
                    transition: "all 0.2s ease-out",
                  }}
                  className="p-3 bg-white rounded-full shadow-lg border-2 border-amber-300 hover:scale-125 active:scale-90 cursor-pointer animate-pulse touch-manipulation"
                >
                  <span className="text-2xl sm:text-3xl select-none">⭐</span>
                </button>
              ) : (
                <div className="text-center p-4 sm:p-6 space-y-2 animate-fade-in">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-inner">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-800">
                    Kamu Berhasil Menang! 🎉
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 max-w-xs mx-auto">
                    Kunci rahasia sudah terbuka. Surat pengantar siap dibaca!
                  </p>
                </div>
              )}
            </div>

            {/* Responsive Bottom Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2.5 sm:gap-4 pt-2">
              <button
                onClick={prevStep}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-semibold hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                disabled={!gameWon}
                className={`w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  gameWon
                    ? "btn-romantic cursor-pointer active:scale-95"
                    : "bg-stone-300 text-stone-500 cursor-not-allowed"
                }`}
              >
                <span>{gameWon ? "Buka Surat Pembuka 💌" : "Selesaikan Game Dulu"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SURAT PEMBUKA PANJANG (Stiker 2) */}
        {currentStep === 3 && (
          <div className="glass-card rounded-3xl p-6 sm:p-11 shadow-2xl text-center space-y-5 sm:space-y-6">
            <div className="flex justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md hover:scale-105 transition-transform">
                <img
                  src="/gif/stiker 2.gif"
                  alt="Greeting sticker"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <p className="font-cursive text-3xl sm:text-5xl text-rose-500 mb-1">
                Hlloww {displayName}...
              </p>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-stone-400">
                Pesan Khusus Untukmu
              </span>
            </div>

            {/* Kata-kata panjang dari user dengan animasi typing */}
            <div className="p-5 sm:p-8 glass-card-inner rounded-3xl text-left text-stone-800 text-xs sm:text-base leading-relaxed sm:leading-loose border border-rose-200/80 shadow-sm space-y-3 sm:space-y-4 min-h-[220px]">
              <p>
                {displayedText1}
                {!displayedText2 && displayedText1.length < 200 && (
                  <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse align-middle" />
                )}
              </p>
              {displayedText1.length >= 200 && (
                <p>
                  {displayedText2}
                  {!showDateBox && (
                    <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse align-middle" />
                  )}
                </p>
              )}
              {showDateBox && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl border border-rose-200 text-center font-bold text-rose-700 text-sm sm:text-lg animate-fade-in shadow-sm">
                  Yaitu: 14 November 2026
                </div>
              )}
            </div>

            {/* Responsive Bottom Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2.5 sm:gap-4 pt-2">
              <button
                onClick={prevStep}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-semibold hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Lihat Clue Pertama 🔍</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CLUE 1 - DIMANAKAH AKU? */}
        {currentStep === 4 && (
          <div className="glass-card rounded-3xl p-6 sm:p-11 shadow-2xl text-center space-y-5 sm:space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> Clue #1 — Lokasi
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Dimanakah Aku??
              </h2>
            </div>

            {/* Quote Clue #1 dengan animasi typing */}
            <div className="p-5 sm:p-7 glass-card-inner rounded-2xl border-l-4 border-amber-500 text-left shadow-sm min-h-[140px]">
              <p className="text-xl sm:text-3xl text-rose-600 mb-2.5 leading-snug">
                &ldquo;{displayedClue1}&rdquo;
                {displayedClue1.length < 140 && (
                  <span className="inline-block w-1.5 h-4 bg-amber-500 ml-1 animate-pulse align-middle" />
                )}
              </p>
              {displayedClue1.length >= 140 && (
                <p className="text-stone-700 text-xs sm:text-base leading-relaxed not-italic font-medium animate-fade-in">
                  Tempat ini membiarkan angin berhembus bebas, langit terbentang tanpa batas, dan kita bisa menikmati waktu tanpa tergesa-gesa.
                </p>
              )}
            </div>

            <p className="text-stone-500 text-[11px] sm:text-sm italic">
              Kira-kira, tempat seperti apa yang sedang kupikirkan untuk kita berdua?
            </p>

            {/* Responsive Bottom Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2.5 sm:gap-4 pt-3">
              <button
                onClick={prevStep}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-semibold hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Buka Clue #2</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CLUE 2 - APAKAH AKU? (Stiker 3) */}
        {currentStep === 5 && (
          <div className="glass-card rounded-3xl p-6 sm:p-11 shadow-2xl text-center space-y-5 sm:space-y-6">
            <div className="flex justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md hover:scale-105 transition-transform">
                <img
                  src="/gif/stiker 3.gif"
                  alt="Curious cute sticker"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                <Camera className="w-3.5 h-3.5 text-sky-600" /> Clue #2 — Keindahan
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Apakah Aku?
              </h2>
            </div>

            {/* Quote Clue #2 dengan animasi typing */}
            <div className="p-5 sm:p-7 glass-card-inner rounded-2xl border-l-4 border-sky-500 text-left shadow-sm min-h-[140px]">
              <p className="text-xl sm:text-3xl text-sky-700 mb-2.5 leading-snug">
                &ldquo;{displayedClue2}&rdquo;
                {displayedClue2.length < 165 && (
                  <span className="inline-block w-1.5 h-4 bg-sky-500 ml-1 animate-pulse align-middle" />
                )}
              </p>
              {displayedClue2.length >= 165 && (
                <p className="text-stone-700 text-xs sm:text-base leading-relaxed not-italic font-medium animate-fade-in">
                  Sesuatu yang sederhana, tapi selalu berhasil mencuri perhatianmu dan membuat matamu berbinar setiap kali melihatnya.
                </p>
              )}
            </div>

            <p className="text-stone-500 text-[11px] sm:text-sm italic">
              Bisa jadi senja, secangkir kopi hangat, pemandangan favoritmu, atau hal yang pernah kamu posting...
            </p>

            {/* Responsive Bottom Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2.5 sm:gap-4 pt-3">
              <button
                onClick={prevStep}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-semibold hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Buka Clue #3 (Paling Penting)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CLUE 3 - PERTARUNGAN KEBERANIAN & HARAPAN (Stiker 4) */}
        {currentStep === 6 && (
          <div className="glass-card rounded-3xl p-6 sm:p-11 shadow-2xl text-center space-y-5 sm:space-y-6">
            <div className="flex justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md hover:scale-105 transition-transform">
                <img
                  src="/gif/stiker 4.gif"
                  alt="Hoping cute gif"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" /> Clue #3 — Keberanian & Harapan
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Pertarungan Yang Tak Terlihat
              </h2>
            </div>

            {/* Quote Clue #3 dengan animasi typing */}
            <div className="p-5 sm:p-7 glass-card-inner rounded-2xl border-l-4 border-rose-500 text-left shadow-sm min-h-[140px]">
              <p className="text-xl sm:text-3xl text-rose-600 mb-2.5 leading-snug">
                &ldquo;{displayedClue3}&rdquo;
                {displayedClue3.length < 210 && (
                  <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse align-middle" />
                )}
              </p>
              {displayedClue3.length >= 210 && (
                <p className="text-stone-700 text-xs sm:text-base leading-relaxed not-italic font-medium animate-fade-in">
                  Dan keberanian itu adalah mengulurkan tangan kepadamu melalui surat undangan ini...
                </p>
              )}
            </div>

            {/* Explicit Deep Hope Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border border-rose-200 text-stone-800 text-xs sm:text-sm text-left shadow-inner">
              <span className="text-rose-600 font-bold block mb-1 text-sm sm:text-base flex items-center gap-1.5">
                Aku benar-benar berharap banget...
              </span>
              <p className="leading-relaxed">
                Jujur, aku sangat berharap dan mendambakan kamu bersedia menerima undangan rahasia ini di tanggal <strong>14 November 2026</strong> nanti. Menghabiskan waktu bersamamu, membuktikan clue-clue ini secara langsung, dan menciptakan cerita yang menyenangkan berdua.
              </p>
            </div>

            {/* Responsive Bottom Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2.5 sm:gap-4 pt-3">
              <button
                onClick={prevStep}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-semibold hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Lihat Lembar Undangan ✉️</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: LEMBAR UNDANGAN & FORM KEPUTUSAN (Stiker 5, 6, 7) */}
        {currentStep === 7 && (
          <div className="glass-card rounded-3xl p-6 sm:p-11 shadow-2xl space-y-5 sm:space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-2.5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md">
                  <img
                    src="/gif/stiker 6.gif"
                    alt="Invitation sticker"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Surat Undangan: 14 November 2026
              </h2>
              <p className="text-stone-600 text-[11px] sm:text-sm max-w-md mx-auto mt-1.5">
                Tanpa rundown yang kaku, tanpa bocoran tempat lebih awal. Cukup kamu dan aku, menikmati waktu dan membuktikan apakah tebakanmu tepat.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-1">
              {/* Decision Section with runaway button */}
              <div>
                <label className="block text-center text-xs sm:text-sm font-bold text-stone-800 mb-3">
                  Maukah kamu menerima surat undangan ini? 🥺
                </label>

                {/* Mobile Responsive Decision Action Group */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative min-h-[100px] sm:min-h-[90px] w-full">
                  {/* Accept Button */}
                  <button
                    type="button"
                    onClick={handleAccept}
                    className={`w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer active:scale-95 ${
                      decision === "accepted"
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-200 scale-102 shadow-emerald-400/40"
                        : "btn-romantic text-white"
                    }`}
                  >
                    <span>Iya, Aku Terima Undangannya! 🥰</span>
                  </button>

                  {/* Playful Reject Button that escapes */}
                  <button
                    type="button"
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton}
                    onClick={moveNoButton}
                    style={{
                      transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                      transition: "transform 0.15s ease-out",
                    }}
                    className="w-full sm:w-auto px-5 py-3 sm:py-3.5 rounded-2xl border border-stone-300 bg-stone-100/90 text-stone-600 text-xs sm:text-sm font-semibold hover:bg-stone-200 transition-colors shadow-sm cursor-pointer touch-manipulation"
                  >
                    {getRejectButtonText()}
                  </button>
                </div>

                {decision === "accepted" && (
                  <div className="flex flex-col items-center justify-center mt-3 animate-fade-in">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-1">
                      <img
                        src="/gif/stiker 7.gif"
                        alt="Celebrating sticker"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-center text-emerald-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Terima kasih sudah menerima! Aku janji bakal bikin 14 November 2026 jadi hari yang berkesan! ✨
                    </p>
                  </div>
                )}
              </div>

              {/* Form detail inputs (Tebakan Clue & Pesan) */}
              <div className="p-4 sm:p-6 glass-card-inner rounded-2xl space-y-3.5">
                <p className="text-[11px] sm:text-xs uppercase font-extrabold text-rose-500 tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Tebakan Jawaban Clue Kamu
                </p>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-rose-500" /> Menurutmu, apa jawaban dari 3 clue di atas?
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pantai / Bukit bintang / Senja / dll..."
                    value={guessAnswer}
                    onChange={(e) => setGuessAnswer(e.target.value)}
                    className="romantic-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-rose-500" /> Ada pesan atau hal yang ingin kamu sampaikan ke aku?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tulis apa saja yang ingin kamu katakan..."
                    value={herMessage}
                    onChange={(e) => setHerMessage(e.target.value)}
                    className="romantic-input resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <button
                  type="submit"
                  disabled={!decision}
                  className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-xs sm:text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                    decision
                      ? "btn-romantic cursor-pointer"
                      : "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>
                    {decision ? "Kirimkan Jawaban Undangan" : "Pilih jawabanmu di atas dulu ya 🥺"}
                  </span>
                </button>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2 pt-1 text-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto px-3 py-2 text-stone-500 hover:text-stone-700 text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Baca ulang clue sebelumnya
                  </button>
                  <p className="text-[10px] sm:text-[11px] text-stone-400">
                    Aku sangat menantikan kehadiranmu
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 8: HASIL KEPUTUSAN & WHATSAPP (Stiker 7) */}
        {currentStep === 8 && (
          <div className="glass-card rounded-3xl p-6 sm:p-12 shadow-2xl text-center space-y-5 sm:space-y-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto drop-shadow-md">
              <img
                src="/gif/stiker 7.gif"
                alt="Happy celebrating sticker"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-1">
                Undangan Berhasil Diterima 🎉
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-800">
                Terima Kasih, {displayName}!
              </h2>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Jawabanmu sangat berharga dan membuat hariku jadi jauh lebih cerah. Sampai bertemu di tanggal <strong>14 November 2026</strong>! Kirimkan konfirmasi ini ke WhatsApp aku ya!
            </p>

            <div className="bg-white/95 p-4 sm:p-5 rounded-2xl text-left text-xs sm:text-sm text-stone-700 space-y-2 border border-rose-200 max-w-md mx-auto shadow-sm">
              <div>
                <span className="font-bold text-rose-600">Status: </span>
                Menerima Surat Undangan Misterius 🥰
              </div>
              <div>
                <span className="font-bold text-rose-600">Jadwal Acara: </span>
                14 November 2026 🗓️
              </div>
              {guessAnswer && (
                <div>
                  <span className="font-bold text-rose-600">Tebakan Clue: </span>
                  &ldquo;{guessAnswer}&rdquo;
                </div>
              )}
              {herMessage && (
                <div>
                  <span className="font-bold text-rose-600">Pesan Balasan: </span>
                  &ldquo;{herMessage}&rdquo;
                </div>
              )}
            </div>

            {/* Mobile Responsive WhatsApp & Copy Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={sendToWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-400/40 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Kirim Jawaban ke WhatsApp</span>
              </button>

              <button
                onClick={copyAnswer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-semibold shadow-sm active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>Salin Jawaban</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-rose-100">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setGameScore(0);
                  setGameWon(false);
                  setDecision("");
                  setNoCount(0);
                  setNoButtonPos({ x: 0, y: 0 });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-stone-400 hover:text-stone-600 text-[11px] sm:text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Buka Ulang Dari Awal</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
