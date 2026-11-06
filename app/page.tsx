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
  Gift,
  Trophy,
} from "lucide-react";

export default function MysteryInvitationPage() {
  // Steps:
  // 1: Cover / Greeting Input (Stiker 1)
  // 2: Mini-Game Interaktif (Tangkap Hati / Peti Rahasia untuk membuka surat)
  // 3: Surat Pembuka Panjang ("Hlloww prinsesss...") (Stiker 2)
  // 4: Clue #1 (Dimanakah aku??)
  // 5: Clue #2 (Apakah aku?) (Stiker 3)
  // 6: Clue #3 (Pertarungan Keberanian & Harapan Terbesar) (Stiker 4)
  // 7: Undangan & Form Keputusan (Stiker 5, 6, 7)
  // 8: Hasil & WhatsApp (Stiker 7)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [herName, setHerName] = useState("");

  // Mini-game state (Catch the heart 3 times or Open Mystery Box)
  const [gameScore, setGameScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ top: 40, left: 45 });
  const [gameWon, setGameWon] = useState(false);

  // Music state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalMusicRef = useRef<NodeJS.Timeout | null>(null);

  // Form states
  const [decision, setDecision] = useState<"accepted" | "">("");
  const [guessAnswer, setGuessAnswer] = useState("");
  const [dateChoice, setDateChoice] = useState("");
  const [herMessage, setHerMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Playful reject button
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });

  // Floating ambient particles
  const [floatingParticles, setFloatingParticles] = useState<
    Array<{ id: number; left: number; duration: number; delay: number; size: number }>
  >([]);

  useEffect(() => {
    const particles = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 95),
      duration: 14 + Math.random() * 12,
      delay: Math.random() * 7,
      size: 12 + Math.random() * 16,
    }));
    setFloatingParticles(particles);

    return () => {
      if (intervalMusicRef.current) clearInterval(intervalMusicRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Soft Ambient Music Synthesizer
  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (intervalMusicRef.current) clearInterval(intervalMusicRef.current);
      setIsPlayingMusic(false);
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const chords = [
        [220.0, 277.18, 329.63, 440.0],
        [196.0, 246.94, 293.66, 392.0],
        [174.61, 220.0, 261.63, 349.23],
        [164.81, 207.65, 246.94, 329.63],
      ];

      let chordIdx = 0;
      const playChord = () => {
        const now = ctx.currentTime;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.15);

          gain.gain.setValueAtTime(0.001, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.025, now + i * 0.15 + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 2.9);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 3.1);
        });
      };

      playChord();
      intervalMusicRef.current = setInterval(playChord, 2800);
      setIsPlayingMusic(true);
    } catch {
      console.log("Audio not supported or blocked");
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#e2e8f0"],
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!isPlayingMusic) toggleMusic();
      triggerConfetti();
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mini-Game: Catch 3 Hearts
  const handleCatchHeart = () => {
    const newScore = gameScore + 1;
    setGameScore(newScore);
    triggerConfetti();

    if (newScore >= 3) {
      setGameWon(true);
    } else {
      // Move target to random position
      const newTop = Math.floor(Math.random() * 60) + 15;
      const newLeft = Math.floor(Math.random() * 70) + 10;
      setTargetPos({ top: newTop, left: newLeft });
    }
  };

  const moveNoButton = () => {
    setNoCount((prev) => prev + 1);
    const randomX = Math.floor(Math.random() * 260) - 130;
    const randomY = Math.floor(Math.random() * 160) - 80;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const handleAccept = () => {
    setDecision("accepted");
    triggerConfetti();
    setTimeout(() => {
      confetti({
        particleCount: 110,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 110,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
      });
    }, 200);
  };

  const getRejectButtonText = () => {
    const texts = [
      "Maaf, belum bisa ikut 🥺",
      "Yakin nggak penasaran? Coba pikirin lagi 🥺",
      "Jangan buru-buru nolak dong...",
      "Aku udah berharap banget lho kita bisa jalan 😭",
      "Klik tombol 'Terima Undangan' aja plisss...",
      "Tombol ini bakal kabur terus! 🏃‍♂️💨",
      "Tuh kan gabisa diklik! Ayo terima undangannya 😝",
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
    <main className="relative min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center justify-center">
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
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={toggleMusic}
          aria-label="Toggle background music"
          className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-200 text-stone-700 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="text-xs font-semibold text-rose-600 pr-1 hidden sm:inline">
                Musik Nyala 🎵
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 text-stone-400" />
              <span className="text-xs font-medium text-stone-500 pr-1 hidden sm:inline">
                Putar Musik 🎵
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Step Progress Bar (Hidden on Cover) */}
        {currentStep > 1 && currentStep < 8 && (
          <div className="mb-6 flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-rose-500" /> Tahap {currentStep - 1} dari 6
            </span>
            <div className="flex gap-1">
              {[2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === currentStep
                      ? "w-7 bg-rose-500"
                      : s < currentStep
                      ? "w-2.5 bg-rose-300"
                      : "w-2.5 bg-stone-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: COVER UNDANGAN (Stiker 1) */}
        {currentStep === 1 && (
          <div className="text-center glass-card rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-500">
            <div className="flex justify-center mb-4">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 hover:scale-105 transition-transform duration-300 drop-shadow-md">
                <img
                  src="/gif/stiker 1.gif"
                  alt="Envelope sticker"
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight mb-3">
              Ada Sesuatu Khusus Untukmu...
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto mb-7 leading-relaxed">
              Sebelum kamu membuka isi undangannya, ada mini game tantangan kecil untuk membuktikan kunci rahasianya!
            </p>

            <button
              onClick={nextStep}
              className="btn-romantic inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base cursor-pointer shadow-lg w-full sm:w-auto"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Mulai Mini Games</span>
            </button>
          </div>
        )}

        {/* STEP 2: MINI GAME "TANGKAP 3 KUNCI BINTANG" */}
        {currentStep === 2 && (
          <div className="glass-card rounded-3xl p-7 sm:p-11 shadow-2xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-amber-600" /> Mini Game: Buka Surat Undangan
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Tangkap 3 Kunci Bintang! ✨
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1.5">
                Klik bintang bercahaya di area permainan sebanyak 3 kali untuk membuka amplop rahasia ini.
              </p>
            </div>

            {/* Score Tracker */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
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
            <div className="relative w-full h-64 bg-gradient-to-b from-rose-50/70 to-pink-50/80 rounded-2xl border-2 border-dashed border-rose-300 overflow-hidden shadow-inner flex items-center justify-center">
              {!gameWon ? (
                <button
                  type="button"
                  onClick={handleCatchHeart}
                  style={{
                    position: "absolute",
                    top: `${targetPos.top}%`,
                    left: `${targetPos.left}%`,
                    transform: "translate(-50%, -50%)",
                    transition: "all 0.25s ease-out",
                  }}
                  className="p-3 bg-white rounded-full shadow-lg border-2 border-amber-300 hover:scale-125 active:scale-95 cursor-pointer animate-pulse"
                >
                  <span className="text-3xl select-none">⭐</span>
                </button>
              ) : (
                <div className="text-center p-6 space-y-2 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800">
                    Kamu Berhasil Menang! 🎉
                  </h3>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto">
                    Kunci rahasia sudah terbuka. Surat pengantar siap dibaca!
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                disabled={!gameWon}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  gameWon
                    ? "btn-romantic cursor-pointer"
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
          <div className="glass-card rounded-3xl p-7 sm:p-11 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-32 h-32 drop-shadow-md hover:scale-105 transition-transform">
                <img
                  src="/gif/stiker 2.gif"
                  alt="Greeting sticker"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <p className="text-3xl sm:text-5xl text-rose-500 mb-2">
                Hlloww {displayName}...
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                Pesan Khusus Untukmu
              </span>
            </div>

            {/* Kata-kata panjang dari user */}
            <div className="p-6 sm:p-8 glass-card-inner rounded-3xl text-left text-stone-800 text-sm sm:text-base leading-relaxed sm:leading-loose border border-rose-200/80 shadow-sm space-y-4">
              <p>
                Ketika kamu membuka undangan ini, ada sesuatu yang berbeda dari undangan yang sebelum-sebelumnya. Kali ini izinkan aku mengajakmu menunjukan sesuatu yang akan menjadi pertama kali dari bagian cerita hidupku.
              </p>
              <p>
                Tapi kali ini aku tidak menunjukan dimana tempatnya ataupun rundown acaranya, melainkan aku ingin memberikan clue yang dimana jawabannya akan aku beri tahu saat hari H...
              </p>
              <div className="p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl border border-rose-200 text-center font-bold text-rose-700 text-base sm:text-lg">
                Yaitu: 14 November 2026
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Lihat Clue Pertama 🔍</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CLUE 1 - DIMANAKAH AKU? */}
        {currentStep === 4 && (
          <div className="glass-card rounded-3xl p-7 sm:p-11 shadow-2xl text-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> Clue #1 — Lokasi
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Dimanakah Aku??
              </h2>
            </div>

            {/* Quote Clue #1 */}
            <div className="p-6 sm:p-7 glass-card-inner rounded-2xl border-l-4 border-amber-500 text-left shadow-sm">
              <p className="text-2xl sm:text-3xl text-rose-600 mb-3 leading-snug">
                &ldquo;Tidak semua momen berharga harus terjadi di dalam ruangan tertutup. Terkadang, semesta justru menjadi saksi terbaik bagi sebuah cerita, Dimanakah aku??&rdquo;
              </p>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed not-italic font-medium">
                Tempat ini membiarkan angin berhembus bebas, langit terbentang tanpa batas, dan kita bisa menikmati waktu tanpa tergesa-gesa.
              </p>
            </div>

            <p className="text-stone-500 text-xs sm:text-sm italic">
              Kira-kira, tempat seperti apa yang sedang kupikirkan untuk kita berdua?
            </p>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Buka Clue #2</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CLUE 2 - APAKAH AKU? (Stiker 3) */}
        {currentStep === 5 && (
          <div className="glass-card rounded-3xl p-7 sm:p-11 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-32 h-32 drop-shadow-md hover:scale-105 transition-transform">
                <img
                  src="/gif/stiker 3.gif"
                  alt="Curious cute sticker"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-100 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <Camera className="w-3.5 h-3.5 text-sky-600" /> Clue #2 — Keindahan
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Apakah Aku?
              </h2>
            </div>

            {/* Quote Clue #2 */}
            <div className="p-6 sm:p-7 glass-card-inner rounded-2xl border-l-4 border-sky-500 text-left shadow-sm">
              <p className="text-2xl sm:text-3xl text-sky-700 mb-3 leading-snug">
                &ldquo;Aku menjadi bagian dari sesuatu yang di abadikan seseorang di media sosial. Bukan karena aku langka, tetapi karena ada seseorang yang begitu menyukai keindahanku. Apakah aku?&rdquo;
              </p>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed not-italic font-medium">
                Sesuatu yang sederhana, tapi selalu berhasil mencuri perhatianmu dan membuat matamu berbinar setiap kali melihatnya.
              </p>
            </div>

            <p className="text-stone-500 text-xs sm:text-sm italic">
              Bisa jadi senja, secangkir kopi hangat, pemandangan favoritmu, atau hal yang pernah kamu posting...
            </p>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Buka Clue #3 (Paling Penting)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CLUE 3 - PERTARUNGAN KEBERANIAN & HARAPAN (Stiker 4) */}
        {currentStep === 6 && (
          <div className="glass-card rounded-3xl p-7 sm:p-11 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-32 h-32 drop-shadow-md hover:scale-105 transition-transform">
                <img
                  src="/gif/stiker 4.gif"
                  alt="Hoping cute gif"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" /> Clue #3 — Keberanian & Harapan
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Pertarungan Yang Tak Terlihat
              </h2>
            </div>

            {/* Quote Clue #3 */}
            <div className="p-6 sm:p-7 glass-card-inner rounded-2xl border-l-4 border-rose-500 text-left shadow-sm">
              <p className="text-2xl sm:text-3xl text-rose-600 mb-3 leading-snug">
                &ldquo;Ada pertarungan yang tidak terlihat oleh siapa pun. Bukan tentang menang atau kalah, bukan pula tentang siapa yang paling kuat. Namun, tentang keberanian untuk menunjukan satu kemungkinan yang belum tentu sesuai harapan.&rdquo;
              </p>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed not-italic font-medium">
                Dan keberanian itu adalah mengulurkan tangan kepadamu melalui surat undangan ini...
              </p>
            </div>

            {/* Explicit Deep Hope Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border border-rose-200 text-stone-800 text-sm text-left shadow-inner">
              <span className="text-rose-600 font-bold block mb-1 text-base flex items-center gap-2">
                Aku benar-benar berharap banget...
              </span>
              <p className="leading-relaxed">
                Jujur, aku sangat berharap dan mendambakan kamu bersedia menerima undangan rahasia ini di tanggal <strong>14 November 2026</strong> nanti. Menghabiskan waktu bersamamu, membuktikan clue-clue ini secara langsung, dan menciptakan cerita yang menyenangkan berdua.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={nextStep}
                className="btn-romantic px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Lihat Lembar Undangan ✉️</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: LEMBAR UNDANGAN & FORM KEPUTUSAN (Stiker 5, 6, 7) */}
        {currentStep === 7 && (
          <div className="glass-card rounded-3xl p-7 sm:p-11 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-28 h-28 drop-shadow-md">
                  <img
                    src="/gif/stiker 5.gif"
                    alt="Invitation sticker"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
                Surat Undangan: 14 November 2026
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mt-2">
                Tanpa rundown yang kaku, tanpa bocoran tempat lebih awal. Cukup kamu dan aku, menikmati waktu dan membuktikan apakah tebakanmu tepat.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              {/* Decision Section with runaway button */}
              <div>
                <label className="block text-center text-sm font-bold text-stone-800 mb-4">
                  Maukah kamu menerima surat undangan ini? 🥺
                </label>

                {noCount > 0 && decision !== "accepted" && (
                  <div className="flex justify-center mb-3 animate-bounce">
                    <div className="w-20 h-20">
                      <img
                        src="/gif/stiker 6.gif"
                        alt="Funny sticker"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[90px]">
                  {/* Accept Button */}
                  <button
                    type="button"
                    onClick={handleAccept}
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg cursor-pointer ${
                      decision === "accepted"
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-200 scale-105 shadow-emerald-400/40"
                        : "btn-romantic text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 fill-current animate-bounce" />
                    <span>Iya, Aku Terima Undangannya! 🥰</span>
                  </button>

                  {/* Playful Reject Button that escapes */}
                  <button
                    type="button"
                    onMouseEnter={moveNoButton}
                    onClick={moveNoButton}
                    style={{
                      transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                      transition: "transform 0.15s ease-out",
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-stone-300 bg-stone-100/90 text-stone-600 text-sm font-semibold hover:bg-stone-200 transition-colors shadow-sm cursor-pointer"
                  >
                    {getRejectButtonText()}
                  </button>
                </div>

                {decision === "accepted" && (
                  <div className="flex flex-col items-center justify-center mt-4 animate-fade-in">
                    <div className="w-24 h-24 mb-1">
                      <img
                        src="/gif/stiker 7.gif"
                        alt="Celebrating sticker"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-center text-emerald-600 font-bold text-sm flex items-center justify-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-5 h-5" />
                      Terima kasih sudah menerima! Aku janji bakal bikin 14 November 2026 jadi hari yang berkesan! ✨
                    </p>
                  </div>
                )}
              </div>

              {/* Form detail inputs (Tebakan Clue & Pesan) */}
              <div className="p-6 glass-card-inner rounded-2xl space-y-4">
                <p className="text-xs uppercase font-extrabold text-rose-500 tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Tebakan Jawaban Clue Kamu
                </p>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-rose-500" /> Menurutmu, apa jawaban dari 3 clue di atas?
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
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-rose-500" /> Ada pesan atau hal yang ingin kamu sampaikan ke aku?
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
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={!decision}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    decision
                      ? "btn-romantic cursor-pointer"
                      : "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>
                    {decision ? "Kirimkan Jawaban Undangan" : "Pilih jawabanmu di atas dulu ya 🥺"}
                  </span>
                </button>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-stone-500 hover:text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Baca ulang clue sebelumnya
                  </button>
                  <p className="text-[11px] text-stone-400">
                    Aku sangat menantikan kehadiranmu
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 8: HASIL KEPUTUSAN & WHATSAPP (Stiker 7) */}
        {currentStep === 8 && (
          <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
            <div className="w-32 h-32 mx-auto drop-shadow-md">
              <img
                src="/gif/stiker 7.gif"
                alt="Happy celebrating sticker"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-1">
                Undangan Berhasil Diterima 🎉
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800">
                Terima Kasih, {displayName}!
              </h2>
            </div>

            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              Jawabanmu sangat berharga dan membuat hariku jadi jauh lebih cerah. Sampai bertemu di tanggal <strong>14 November 2026</strong>! Kirimkan konfirmasi ini ke WhatsApp aku ya!
            </p>

            <div className="bg-white/95 p-5 rounded-2xl text-left text-xs sm:text-sm text-stone-700 space-y-2.5 border border-rose-200 max-w-md mx-auto shadow-sm">
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={sendToWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-400/40 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Kirim Jawaban ke WhatsApp 💬</span>
              </button>

              <button
                onClick={copyAnswer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>Salin Jawaban</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-rose-100">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setGameScore(0);
                  setGameWon(false);
                  setDecision("");
                  setNoCount(0);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-stone-400 hover:text-stone-600 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors"
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
