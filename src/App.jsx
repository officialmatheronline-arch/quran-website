import React, { useEffect, useMemo, useRef, useState } from "react";

const API = "https://api.alquran.cloud/v1";
const WHATSAPP_NUMBER = "923166311442";
const BISMILLAH_AUDIO = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
const WHATSAPP_LINK = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Assalamualaikum")}`;

const QUIZZES = [
  {
    title: "Quiz 1: Basic Quran Knowledge",
    questions: [
      { q: "Quran Pak mein total kitni Surah hain?", options: ["110", "114", "120", "124"], answer: "114" },
      { q: "Quran Pak ki pehli Surah ka naam kya hai?", options: ["Al-Baqarah", "Al-Fatiha", "An-Nas", "Al-Ikhlas"], answer: "Al-Fatiha" },
      { q: "Surah Al-Ikhlas ka Surah number kya hai?", options: ["110", "111", "112", "113"], answer: "112" },
    ],
  },
  {
    title: "Quiz 2: Surah Names",
    questions: [
      { q: "Quran Pak ki sab se lambi Surah kaunsi hai?", options: ["Al-Baqarah", "Yaseen", "Ar-Rahman", "Al-Mulk"], answer: "Al-Baqarah" },
      { q: "Quran Pak ki akhri Surah kaunsi hai?", options: ["Al-Falaq", "An-Nas", "Al-Kawthar", "Al-Asr"], answer: "An-Nas" },
      { q: "Surah Yaseen ka Surah number kya hai?", options: ["34", "35", "36", "37"], answer: "36" },
    ],
  },
  {
    title: "Quiz 3: Short Surahs",
    questions: [
      { q: "Quran Pak ki sab se choti Surah kaunsi hai?", options: ["Al-Kawthar", "Al-Asr", "Al-Ikhlas", "An-Nasr"], answer: "Al-Kawthar" },
      { q: "Surah Al-Falaq ka Surah number kya hai?", options: ["112", "113", "114", "111"], answer: "113" },
      { q: "Surah An-Nas mein kitni ayat hain?", options: ["4", "5", "6", "7"], answer: "6" },
    ],
  },
];

const QNA = [
  { q: "Quran Pak seekhne ka behtareen tareeqa kya hai?", a: "Rozana thora time fix karein, Arabic text dhyan se parhein, translation samjhein aur audio recitation ke sath repeat karein." },
  { q: "Audio kaise chalegi?", a: "Surah select karein aur Play button dabayein. Internet connection zaroori hai." },
];

function cls(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, dark, className = "" }) {
  return (
    <div className={cls("rounded-[2rem] border shadow-[0_20px_70px_rgba(16,185,129,0.10)] backdrop-blur", dark ? "bg-slate-900 border-slate-800" : "bg-white/90 border-emerald-100", className)}>
      {children}
    </div>
  );
}

function Btn({ children, className = "", disabled, ...props }) {
  return (
    <button disabled={disabled} className={cls("rounded-2xl px-4 py-3 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed", className)} {...props}>
      {children}
    </button>
  );
}

function getSurahInfo(surah) {
  if (!surah) return "";
  const type = surah.revelationType === "Meccan" ? "Makki" : "Madani";
  const paraText = surah.number === 67 ? "and it is commonly found in the 29th Para" : "and it is an important chapter of the Holy Quran";
  return `Surah ${surah.englishName} is the ${surah.number}th Surah of the Holy Quran ${paraText}. It is a ${type} Surah and has ${surah.numberOfAyahs} ayats. You can read Surah ${surah.englishName} online with Arabic text, Urdu/English translation, and listen to clear audio recitation for easy learning and reflection.`;
}

function getSurahBenefits(surah) {
  const benefits = {
    "Al-Faatiha": "Surah Al-Faatiha is known as the opening of the Quran and is recited in every prayer. It helps Muslims seek guidance, mercy, and blessings from Allah.",
    "Al-Baqarah": "Reading Surah Al-Baqarah brings blessings to the home and protects from negative influences. It contains Ayat-ul-Kursi and many important teachings.",
    "Yaseen": "Surah Yaseen is called the heart of the Quran. Muslims often recite it for peace, ease, and blessings.",
    "Al-Mulk": "Surah Al-Mulk reminds believers about Allah’s power and is popularly recited at night for reflection and spiritual benefit.",
    "Ar-Rahman": "Surah Ar-Rahman highlights the countless blessings of Allah and increases gratitude and peace in the heart.",
  };
  return benefits[surah.englishName] || `Reading Surah ${surah.englishName} helps Muslims understand the message of the Quran, improve recitation, and gain spiritual peace and guidance.`;
}

function getSurahLongInfo(surah) {
  if (!surah) return [];
  return [
    {
      title: `Surah ${surah.englishName} Read Online`,
      body: `Surah ${surah.englishName} is the ${surah.number}th chapter of the Holy Quran. It is a ${surah.revelationType === "Meccan" ? "Makki" : "Madani"} Surah consisting of ${surah.numberOfAyahs} ayats. This section helps you read Surah ${surah.englishName} online with Arabic text and translation in a clean and easy style.`,
    },
    {
      title: `Surah ${surah.englishName} Audio`,
      body: `You can listen to Surah ${surah.englishName} audio recitation using the Play button. The audio plays ayat by ayat, and for most Surahs Bismillah is played before the Surah begins.`,
    },
    {
      title: `Benefits of Reading Surah ${surah.englishName}`,
      body: getSurahBenefits(surah),
    },
    {
      title: `What are the main benefits of reading Surah ${surah.englishName}?`,
      body: `Every Surah of the Quran contains guidance, wisdom, and spiritual lessons. Reading Surah ${surah.englishName} regularly can help improve understanding of Islam and strengthen connection with Allah.`,
    },
  ];
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [arabicEdition, setArabicEdition] = useState("quran-uthmani");
  const [translationEdition, setTranslationEdition] = useState("ur.jalandhry");
  const [surahData, setSurahData] = useState(null);
  const [translationData, setTranslationData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [surahLoading, setSurahLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [unlockedQuiz, setUnlockedQuiz] = useState(0);
  const [isSurahPlaying, setIsSurahPlaying] = useState(false);
  const [surahAudioIndex, setSurahAudioIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentCity, setCommentCity] = useState("");
  const [captcha, setCaptcha] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [captchaInput, setCaptchaInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const surahAudioRef = useRef(null);

  useEffect(() => {
    async function loadSurahs() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/surah`);
        const json = await res.json();
        if (json.code !== 200) throw new Error("Surah list load nahi hui.");
        setSurahs(json.data);
      } catch {
        setError("Internet/API issue: Surah list load nahi ho saki. Dobara refresh karein.");
      } finally {
        setLoading(false);
      }
    }
    loadSurahs();
  }, []);

  useEffect(() => {
    async function loadSurah() {
      try {
        setSurahLoading(true);
        setError("");
        const [arabicRes, translationRes, audioRes] = await Promise.all([
          fetch(`${API}/surah/${selectedSurah}/${arabicEdition}`),
          fetch(`${API}/surah/${selectedSurah}/${translationEdition}`),
          fetch(`${API}/surah/${selectedSurah}/ar.alafasy`),
        ]);
        const [arabicJson, translationJson, audioJson] = await Promise.all([arabicRes.json(), translationRes.json(), audioRes.json()]);
        if (arabicJson.code !== 200 || translationJson.code !== 200) throw new Error("Surah load error");
        setSurahData(arabicJson.data);
        setTranslationData(translationJson.data);
        setAudioData(audioJson.code === 200 ? audioJson.data : null);
      } catch {
        setError("Selected Surah load nahi ho saki. Internet connection check karein.");
      } finally {
        setSurahLoading(false);
      }
    }
    loadSurah();
  }, [selectedSurah, arabicEdition, translationEdition]);

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter((s) => `${s.number} ${s.englishName} ${s.name} ${s.englishNameTranslation}`.toLowerCase().includes(q));
  }, [surahs, query]);

  const currentQuiz = QUIZZES[activeQuiz];
  const quizDone = currentQuiz.questions.every((_, i) => answers[`${activeQuiz}-${i}`]);
  const score = currentQuiz.questions.reduce((total, item, i) => total + (answers[`${activeQuiz}-${i}`] === item.answer ? 1 : 0), 0);

  function finishQuiz() {
    setShowResult(true);
    if (quizDone && activeQuiz < QUIZZES.length - 1) setUnlockedQuiz(Math.max(unlockedQuiz, activeQuiz + 1));
  }

  function openNextQuiz() {
    setActiveQuiz((q) => Math.min(q + 1, QUIZZES.length - 1));
    setShowResult(false);
  }

  function stopFullSurah() {
    if (surahAudioRef.current) {
      surahAudioRef.current.pause();
      surahAudioRef.current = null;
    }
    setIsSurahPlaying(false);
    setSurahAudioIndex(0);
  }

  function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim() || !commentCity.trim()) {
      setCommentError("Please comment, name aur city fill karein.");
      return;
    }
    if (String(captchaInput).trim() !== String(captcha)) {
      setCommentError("Code galat hai. Dobara try karein.");
      return;
    }
    setComments([{ text: commentText, name: commentName, city: commentCity, surah: surahData?.englishName || "Surah" }, ...comments]);
    setCommentText("");
    setCommentName("");
    setCommentCity("");
    setCaptchaInput("");
    setCaptcha(Math.floor(1000 + Math.random() * 9000));
    setCommentError("");
  }

  function playFullSurah(startIndex = 0, withBismillah = true) {
    const ayahs = audioData?.ayahs || [];
    if (!ayahs.length) return;
    const safeIndex = Math.max(0, Math.min(startIndex, ayahs.length - 1));
    if (surahAudioRef.current) surahAudioRef.current.pause();

    const shouldPlayBismillah = withBismillah && safeIndex === 0 && surahData?.number !== 1 && surahData?.number !== 9;
    const audio = new Audio(shouldPlayBismillah ? BISMILLAH_AUDIO : ayahs[safeIndex].audio);
    surahAudioRef.current = audio;
    setIsSurahPlaying(true);
    setSurahAudioIndex(shouldPlayBismillah ? -1 : safeIndex);

    audio.play().catch(() => setIsSurahPlaying(false));
    audio.onended = () => {
      if (shouldPlayBismillah) playFullSurah(0, false);
      else if (safeIndex + 1 < ayahs.length) playFullSurah(safeIndex + 1, false);
      else stopFullSurah();
    };
  }

  function playNextAyah() {
    const ayahs = audioData?.ayahs || [];
    if (!ayahs.length) return;
    const nextIndex = surahAudioIndex === -1 ? 0 : Math.min(surahAudioIndex + 1, ayahs.length - 1);
    playFullSurah(nextIndex, false);
  }

  function playPrevAyah() {
    const ayahs = audioData?.ayahs || [];
    if (!ayahs.length) return;
    const prevIndex = surahAudioIndex === -1 ? 0 : Math.max(surahAudioIndex - 1, 0);
    playFullSurah(prevIndex, false);
  }

  useEffect(() => {
    stopFullSurah();
    return () => stopFullSurah();
  }, [selectedSurah]);

  const pageClass = dark ? "min-h-screen bg-slate-950 text-white font-sans" : "min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 text-slate-900 font-sans";

  return (
    <main className={pageClass}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_32%),radial-gradient(circle_at_bottom,rgba(20,184,166,0.18),transparent_36%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          <nav className="flex items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-2xl ring-4 ring-white/70">📖</div>
              <div>
                <p className="text-sm text-emerald-700 font-semibold">Quran Learning Website</p>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Quran Pak Seekhain</h1>
              </div>
            </div>
            <Btn onClick={() => setDark(!dark)} className="bg-white/80 hover:bg-white text-emerald-700 border border-emerald-100 shadow-sm">{dark ? "☀️ Light" : "🌙 Dark"}</Btn>
          </nav>

          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-6 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">Quran Pak <span className="text-emerald-600">parhein</span>, sunein aur seekhein</h2>
              <p className="mt-5 text-lg text-slate-600 max-w-2xl">Surah list, Arabic Uthmani text, Urdu/English translation, audio recitation, search, Q&A aur quizzes ke sath complete responsive website.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#read" className="rounded-2xl px-7 py-4 font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25">Start Reading</a>
                <a href={WHATSAPP_LINK} target="_top" className="inline-flex items-center rounded-2xl px-7 py-4 font-semibold transition bg-white/90 border border-emerald-100 hover:bg-emerald-50 text-emerald-700 shadow-sm">💬 WhatsApp</a>
              </div>
            </div>
            <div className="rounded-[2.5rem] border border-emerald-100 bg-white/85 backdrop-blur-xl shadow-[0_30px_90px_rgba(16,185,129,0.18)] p-6 md:p-8 text-center ring-1 ring-white">
              <p className="text-5xl md:text-7xl leading-[2] text-emerald-700 font-serif font-bold tracking-wide" dir="rtl">بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              <p className="mt-5 text-emerald-800 text-lg font-semibold tracking-wide">Bismillahir Rahmanir Raheem</p>
            </div>
          </div>
        </div>
      </section>

      <section id="read" className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[340px_1fr] gap-6">
        <Card dark={dark} className="sticky top-4 h-fit">
          <div className="p-5">
            <div className="relative mb-4">
              <span className="absolute left-3 top-3 opacity-60">🔎</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Surah search karein..." className={cls("w-full rounded-2xl py-3 pl-10 pr-3 outline-none border shadow-inner", dark ? "bg-slate-950 border-slate-700" : "bg-white border-emerald-100 focus:ring-2 focus:ring-emerald-200")} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <select value={arabicEdition} onChange={(e) => setArabicEdition(e.target.value)} className={cls("rounded-2xl p-3 border outline-none", dark ? "bg-slate-950 border-slate-700" : "bg-white border-emerald-100")}>
                <option value="quran-uthmani">Uthmani Mushaf</option>
                <option value="quran-simple">Simple Arabic</option>
              </select>
              <select value={translationEdition} onChange={(e) => setTranslationEdition(e.target.value)} className={cls("rounded-2xl p-3 border outline-none", dark ? "bg-slate-950 border-slate-700" : "bg-white border-emerald-100")}>
                <option value="ur.jalandhry">Urdu</option>
                <option value="en.sahih">English Sahih</option>
                <option value="en.pickthall">English Pickthall</option>
              </select>
            </div>
            {loading ? (
              <div className="opacity-75">⏳ Loading Surahs...</div>
            ) : (
              <div className="max-h-[620px] overflow-auto pr-1 space-y-2">
                {filteredSurahs.map((s) => (
                  <button key={s.number} onClick={() => setSelectedSurah(s.number)} className={cls("w-full text-left rounded-2xl p-3 transition border", selectedSurah === s.number ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" : dark ? "bg-slate-950 border-slate-800 hover:bg-slate-800" : "bg-white border-emerald-100 hover:bg-emerald-50 hover:shadow-md")}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{s.number}. {s.englishName}</p>
                        <p className="text-xs opacity-75">{s.englishNameTranslation} • {s.numberOfAyahs} Ayahs</p>
                      </div>
                      <p className="text-xl" dir="rtl">{s.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          {error && <div className="rounded-2xl p-4 bg-red-500/15 border border-red-400/30 text-red-200">{error}</div>}
          <Card dark={dark}>
            <div className="p-5 md:p-8">
              {surahLoading ? (
                <div className="text-lg">⏳ Surah load ho rahi hai...</div>
              ) : surahData ? (
                <div>
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                      <div>
                        <p className="opacity-70">Surah {surahData.number}</p>
                        <h3 className="text-3xl font-black">{surahData.englishName}</h3>
                        <p className="opacity-70">{surahData.englishNameTranslation} • {surahData.revelationType}</p>
                      </div>
                      {audioData?.ayahs?.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Btn onClick={playPrevAyah} disabled={!isSurahPlaying || surahAudioIndex <= 0} className="bg-slate-700 hover:bg-slate-800 text-white px-3">⏮</Btn>
                            <Btn onClick={() => (isSurahPlaying ? stopFullSurah() : playFullSurah(0))} className={cls("text-white", isSurahPlaying ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700")}>{isSurahPlaying ? "⏸ Stop" : "▶ Play"}</Btn>
                            <Btn onClick={playNextAyah} disabled={!isSurahPlaying || surahAudioIndex >= audioData.ayahs.length - 1} className="bg-slate-700 hover:bg-slate-800 text-white px-3">⏭</Btn>
                          </div>
                          <p className="text-sm text-slate-600 font-semibold">{isSurahPlaying ? (surahAudioIndex === -1 ? "Bismillah" : `Ayah ${surahAudioIndex + 1} / ${audioData.ayahs.length}`) : ""}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={cls("rounded-[2rem] overflow-hidden border-4", dark ? "border-slate-700 bg-slate-950" : "border-stone-700 bg-[#faf7f2]")}>
                    <div className={cls("px-5 py-4 border-b text-center", dark ? "border-slate-700 bg-slate-900" : "border-stone-700 bg-[#f1ebdf]")}>
                      <h3 className="text-3xl md:text-5xl font-bold font-serif tracking-wide" dir="rtl">{surahData.name}</h3>
                      <p className="mt-2 text-sm opacity-70">Surah {surahData.englishName} • {surahData.numberOfAyahs} Ayahs</p>
                    </div>

                    <div className="p-4 md:p-8">
                      {surahData.number !== 9 && (
                        <div className="flex justify-center mb-8">
                          <div className={cls("inline-block px-8 py-3 rounded-full border-2 text-center", dark ? "border-slate-600 bg-slate-900" : "border-stone-700 bg-[#f6f0e3]")}>
                            <p className="text-3xl md:text-5xl font-serif font-bold" dir="rtl">بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-6">
                        {surahData.ayahs.map((ayah, i) => (
                          <div key={ayah.number} className={cls("border-b pb-6", dark ? "border-slate-700" : "border-stone-300")}>
                            <div className="flex justify-between items-center mb-4">
                              <div className={cls("h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold border-2", dark ? "bg-slate-900 border-slate-600 text-white" : "bg-[#f6f0e3] border-stone-700 text-stone-800")}>{ayah.numberInSurah}</div>
                              {audioData?.ayahs?.[i]?.audio && (
                                <audio controls preload="none" className="w-40 md:w-60 rounded-lg">
                                  <source src={audioData.ayahs[i].audio} type="audio/mpeg" />
                                  Your browser does not support audio.
                                </audio>
                              )}
                            </div>
                            <p className={cls("text-right leading-[2.5] font-serif font-bold", dark ? "text-white" : "text-black", "text-[2rem] md:text-[4rem]")} dir="rtl">{ayah.text}</p>
                            <p className="mt-5 text-lg md:text-xl text-slate-700 leading-10 font-medium border-t pt-4 border-emerald-100">{translationData?.ayahs?.[i]?.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 mt-6 space-y-5">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Surah {surahData.englishName} Read Online</h2>
                    <p className="text-slate-700 leading-8 font-medium">{getSurahInfo(surahData)}</p>
                    {getSurahLongInfo(surahData).map((section) => (
                      <div key={section.title}>
                        <h3 className="text-xl md:text-2xl font-extrabold mb-2">{section.title}</h3>
                        <p className="text-slate-700 leading-8 font-medium">{section.body}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={submitComment} className="rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 mt-6">
                    <h3 className="text-2xl font-extrabold mb-4">Comments / Review</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Type your Comments / Review" className="min-h-28 rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-emerald-200 md:row-span-2" />
                      <input value={commentName} onChange={(e) => setCommentName(e.target.value)} placeholder="Enter Name" className="rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-emerald-200" />
                      <input value={commentCity} onChange={(e) => setCommentCity(e.target.value)} placeholder="Enter City" className="rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-emerald-200" />
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-bold tracking-widest text-slate-500 text-center">{captcha}</div>
                        <input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter Code" className="rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-emerald-200" />
                      </div>
                      <button type="submit" className="rounded-xl bg-black text-white font-bold p-4 hover:bg-slate-800">SUBMIT</button>
                    </div>
                    {commentError && <p className="mt-3 text-red-600 font-semibold">{commentError}</p>}
                    {comments.length > 0 && <div className="mt-5 space-y-3">{comments.map((c, i) => <div key={i} className="rounded-xl bg-emerald-50 border border-emerald-100 p-4"><p className="font-semibold">{c.text}</p><p className="text-sm text-slate-500 mt-1">{c.name} • {c.city} • {c.surah}</p></div>)}</div>}
                  </form>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
        <Card dark={dark}>
          <div className="p-6 md:p-8">
            <h3 className="text-3xl font-extrabold mb-5 tracking-tight">❓ Q&A</h3>
            <div className="space-y-4">
              {QNA.map((item, i) => (
                <details key={i} className={cls("rounded-2xl p-4 border", dark ? "bg-slate-950 border-slate-800" : "bg-white/95 border-emerald-100 shadow-sm")}>
                  <summary className="cursor-pointer font-bold text-lg">{item.q}</summary>
                  <p className="mt-3 opacity-80 leading-7">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Card>

        <Card dark={dark}>
          <div className="p-6 md:p-8">
            <h3 className="text-3xl font-extrabold mb-5 tracking-tight">Learning Quiz</h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {QUIZZES.map((quiz, i) => (
                <Btn key={quiz.title} disabled={i > unlockedQuiz} onClick={() => { setActiveQuiz(i); setShowResult(false); }} className={cls("text-white", activeQuiz === i ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-700 hover:bg-slate-600")}>{i > unlockedQuiz ? "Locked" : `Quiz ${i + 1}`}</Btn>
              ))}
            </div>
            <h4 className="text-2xl font-bold mb-4 tracking-tight">{currentQuiz.title}</h4>
            <div className="space-y-5">
              {currentQuiz.questions.map((item, i) => {
                const key = `${activeQuiz}-${i}`;
                return (
                  <div key={key} className={cls("rounded-2xl p-4 border", dark ? "bg-slate-950 border-slate-800" : "bg-white/95 border-emerald-100 shadow-sm")}>
                    <p className="font-bold text-lg mb-3">{i + 1}. {item.q}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {item.options.map((option) => {
                        const selected = answers[key] === option;
                        const isCorrect = option === item.answer;
                        const isWrongSelected = showResult && selected && !isCorrect;
                        const showCorrect = showResult && isCorrect;
                        return (
                          <button key={option} onClick={() => setAnswers({ ...answers, [key]: option })} className={cls("rounded-xl p-3 border text-left transition font-semibold", showCorrect ? "bg-emerald-600 text-white border-emerald-600" : isWrongSelected ? "bg-red-500 text-white border-red-500" : selected ? "bg-slate-700 text-white border-slate-700" : dark ? "border-slate-700 hover:bg-slate-800" : "border-emerald-100 hover:bg-white")}>
                            {option} {showCorrect ? "✓" : isWrongSelected ? "✗" : ""}
                          </button>
                        );
                      })}
                    </div>
                    {showResult && answers[key] !== item.answer && <div className="mt-3 rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 font-semibold">Aapka answer galat tha: {answers[key]}<br />Sahi answer: {item.answer}</div>}
                    {showResult && answers[key] === item.answer && <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 font-semibold">Sahi answer ✓</div>}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Btn disabled={!quizDone} onClick={finishQuiz} className="bg-emerald-600 hover:bg-emerald-700 text-white">Finish Quiz</Btn>
              {showResult && <div className="font-semibold">Score: {score}/{currentQuiz.questions.length}</div>}
              {showResult && activeQuiz < QUIZZES.length - 1 && <Btn onClick={openNextQuiz} className="bg-sky-600 hover:bg-sky-700 text-white">Next Quiz Open Karein</Btn>}
            </div>
          </div>
        </Card>
      </section>

      <a href={WHATSAPP_LINK} target="_top" className="fixed bottom-5 right-5 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition text-3xl ring-4 ring-white" aria-label="WhatsApp">💬</a>
    </main>
  );
}
