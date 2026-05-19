import React, { useEffect, useMemo, useRef, useState } from "react";

const API = "https://api.alquran.cloud/v1";
const WHATSAPP_NUMBER = "923166311442";
const BISMILLAH_AUDIO = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
const WHATSAPP_LINK = "https://web.whatsapp.com/send?phone=" + WHATSAPP_NUMBER + "&text=" + encodeURIComponent("Assalamualaikum");

const RECITERS = [
  { id: "nooresunnat-sudais-shuraim-urdu", name: "Sudais & Shuraim + Urdu" },
  { id: "ar.alafasy", name: "Mishary Alafasy" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit" },
  { id: "ar.husary", name: "Al-Husary" },
  { id: "ar.minshawi", name: "Al-Minshawi" },
];

const NOORESUNNAT_BASE = "https://www.nooresunnat.com/Audio/Complete%20Quran/Shuraim-Sudais-Urdu/";
const NOORESUNNAT_FILES = {
  1: "001s-fatiha.mp3", 2: "002s-Baqarah.mp3", 3: "003s-Imran.mp3", 4: "004s-Nisa.mp3", 5: "005s-Maida.mp3", 6: "006sAnham.mp3", 7: "007s-Aaraf.mp3", 8: "008s-Anfal.mp3", 9: "009s-Tobah.mp3", 10: "010s-Younus.mp3",
  11: "011s-Hood.mp3", 12: "012s-Yousuf.mp3", 13: "013s-Raad.mp3", 14: "014s-Ibraheem.mp3", 15: "015s-Hijr.mp3", 16: "016s-Nihal.mp3", 17: "017s-Bani-Israil.mp3", 18: "018s-Kahf.mp3", 19: "019s-Mariam.mp3", 20: "020s-Taha.mp3",
  21: "021s-Anbiyea.mp3", 22: "022s-Haj.mp3", 23: "023s-Mominoon.mp3", 24: "024s-Noor.mp3", 25: "025s-Furqaan.mp3", 26: "026s-Shuaara.mp3", 27: "027s-Namal.mp3", 28: "028s-Qasas.mp3", 29: "029s-Ankaboot.mp3", 30: "030s-Room.mp3",
  31: "031s-Luqmaan.mp3", 32: "032s-Sajda.mp3", 33: "033s-Ahzab.mp3", 34: "034s-Saba.mp3", 35: "035s-Fatir.mp3", 36: "036s-Yaseen.mp3", 37: "037s-Saafaat.mp3", 38: "038s-Swad.mp3", 39: "039s-Zomar.mp3", 40: "040s-Momin.mp3",
  41: "041s-H-Sajda.mp3", 42: "042s-Shoora.mp3", 43: "043s-Zukhraf.mp3", 44: "044s-Dukham.mp3", 45: "045s-Jasia.mp3", 46: "046s-Ahkaf.mp3", 47: "047s-Mohammad.mp3", 48: "048s-Fatah.mp3", 49: "049s-Hujara.mp3", 50: "050s-Qaaf.mp3",
  51: "051s-Zaryeat.mp3", 52: "052s-Toor.mp3", 53: "053s-Najam.mp3", 54: "054s-Qamar.mp3", 55: "055s-Rahman.mp3", 56: "056s-Waqia.mp3", 57: "057s-Hadeed.mp3", 58: "058s-Mojadilah.mp3", 59: "059s-Hashar.mp3", 60: "060s-Mumtahina.mp3",
  61: "061s-Saf.mp3", 62: "062s-Jumah.mp3", 63: "063s-Munafiqoon.mp3", 64: "064s-Taghabun.mp3", 65: "065s-Talaq.mp3", 66: "066s-Tahreem.mp3", 67: "067s-Mulk.mp3", 68: "068s-Qalm.mp3", 69: "069s-Haaqah.mp3", 70: "070s-Maarij.mp3",
  71: "071s-Nooh.mp3", 72: "072s-Jin.mp3", 73: "073s-Muzammil.mp3", 74: "074s-Mudasir.mp3", 75: "075s-Qeamah.mp3", 76: "076s-Dahar.mp3", 77: "077s-Mursalat.mp3", 78: "078s-Naba.mp3", 79: "079s-Naziaat.mp3", 80: "080s-Abas.mp3",
  81: "081s-Taqweer.mp3", 82: "082s-Infitaar.mp3", 83: "083s-Mutafifeen.mp3", 84: "084s-Inshiqaq.mp3", 85: "085s-Burooj.mp3", 86: "086s-Tariq.mp3", 87: "087s-Aala.mp3", 88: "088s-Ghashiah.mp3", 89: "089s-Fajr.mp3", 90: "090s-Balad.mp3",
  91: "091s-Shams.mp3", 92: "092s-Lail.mp3", 93: "093s-Duha.mp3", 94: "094s-Alam-Nashrah.mp3", 95: "095s-Teen.mp3", 96: "096s-Alaq.mp3", 97: "097s-Qadar.mp3", 98: "098s-Bayina.mp3", 99: "099s-Zilzaal.mp3", 100: "100s-Aadiyeat.mp3",
  101: "101s-Qariah.mp3", 102: "102s-Takasur.mp3", 103: "103s-Aasar.mp3", 104: "104s-Humaza.mp3", 105: "105s-feel.mp3", 106: "106s-Qureish.mp3", 107: "107s-Maoon.mp3", 108: "108s-Kusar.mp3", 109: "109s-Kafiroon.mp3", 110: "110s-Nasr.mp3",
  111: "111s-Tabat.mp3", 112: "112s-Akhlaas.mp3", 113: "113s-Falaq.mp3", 114: "114s-Naas.mp3",
};

function getNooreSunnatAudioUrl(surahNumber) {
  return NOORESUNNAT_FILES[surahNumber] ? NOORESUNNAT_BASE + NOORESUNNAT_FILES[surahNumber] : "";
}

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
  {
    q: "Quran Pak seekhne ka behtareen tareeqa kya hai?",
    a: "Rozana thora time fix karein, Arabic text dhyan se parhein, translation samjhein aur audio recitation ke sath repeat karein.",
  },
  {
    q: "Audio kaise chalegi?",
    a: "Surah select karein aur Play button dabayein. Internet connection zaroori hai.",
  },
];

function cls(...classes) {
  return classes.filter(Boolean).join(" ");
}

function toArabicDigits(value) {
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return (value ?? "").toString().replace(/[0-9]/g, (d) => digits[d]);
}

function normalizeArabicText(text = "") {
  const marks = ["َ", "ً", "ُ", "ٌ", "ِ", "ٍ", "ْ", "ّ", "ٰ", "ۡ", "ۙ", "ۚ", "ۖ", "ـ"];
  let output = text || "";
  marks.forEach((mark) => {
    output = output.split(mark).join("");
  });
  output = output
    .split("ٱ").join("ا")
    .split("إ").join("ا")
    .split("أ").join("ا")
    .split("آ").join("ا")
    .split("ى").join("ي")
    .split("ة").join("ه")
    .split(" ").join("");
  return output;
}

function removeStartingBismillah(text = "") {
  const cleaned = (text || "").trim();
  const words = cleaned.split(" ").filter(Boolean);
  const firstFourWords = words.slice(0, 4).join(" ");
  const normalizedStart = normalizeArabicText(firstFourWords);

  if (normalizedStart.includes("بسماللهالرحمنالرحيم")) {
    return words.slice(4).join(" ").trim();
  }

  return cleaned;
}

function cleanTopLabel(text = "") {
  const cleaned = removeStartingBismillah(text);
  return cleaned.split(" ").filter(Boolean).slice(0, 2).join(" ") || "القرآن";
}

function splitAyahsIntoMushafPages(ayahs = [], isFatiha = false) {
  if (isFatiha) return [ayahs];

  const pages = [];
  let current = [];
  let count = 0;
  const maxChars = 780;
  const minCharsLastPage = 500;

  for (const ayah of ayahs) {
    const len = (ayah.text || "").length + 14;
    if (current.length && count + len > maxChars) {
      pages.push(current);
      current = [];
      count = 0;
    }
    current.push(ayah);
    count += len;
  }

  if (current.length) pages.push(current);

  // Last page bohat chhota na rahe: previous page se ayaat shift kar ke balance karo
  if (pages.length > 1) {
    let lastTextLength = pages[pages.length - 1].reduce((sum, a) => sum + (a.text || "").length + 14, 0);
    while (lastTextLength < minCharsLastPage && pages[pages.length - 2]?.length > 2) {
      const movedAyah = pages[pages.length - 2].pop();
      pages[pages.length - 1].unshift(movedAyah);
      lastTextLength += (movedAyah.text || "").length + 14;
    }
  }

  return pages;
}

function CornerOrnament({ className = "" }) {
  return (
    <svg viewBox="0 0 44 44" className={cls("absolute h-9 w-9 text-[#1a1000]", className)} fill="none" aria-hidden="true">
      <path d="M5 39V14C5 9 9 5 14 5H39" stroke="currentColor" strokeWidth="2.2" />
      <path d="M11 33V16C11 13 13 11 16 11H33" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 5C18 12 12 18 5 18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Rosette({ flip = false }) {
  return (
    <svg viewBox="0 0 110 34" className={cls("h-8 w-24 text-[#1a1000]", flip && "scale-x-[-1]")} fill="none" aria-hidden="true">
      <path d="M6 17H104" stroke="currentColor" strokeWidth="1.3" />
      <path d="M22 17C28 17 31 13 34 8C37 13 40 17 46 17C40 17 37 21 34 26C31 21 28 17 22 17Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="34" cy="17" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M64 17C70 17 73 13 76 8C79 13 82 17 88 17C82 17 79 21 76 26C73 21 70 17 64 17Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="76" cy="17" r="3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function PatternBox({ children, className = "", innerClassName = "" }) {
  return (
    <div className={cls("relative border-[1.5px] border-[#1a1000] bg-[#fffef5] p-[7px]", className)}>
      <div
        className="absolute inset-[3px] opacity-90"
        style={{ backgroundImage: "radial-gradient(circle,#1a1000 1px,transparent 1.5px)", backgroundSize: "8px 8px" }}
      />
      <div className={cls("relative z-10 border border-[#1a1000] bg-[#fffef5]", innerClassName)}>{children}</div>
    </div>
  );
}

function MushafSurahPage({ surahData, translationData }) {
  const [mushafPageIndex, setMushafPageIndex] = useState(0);

  if (!surahData) return null;
  const firstAyah = surahData.ayahs?.[0] || {};
  const juzNumber = firstAyah.juz || "";
  const realPageNumber = firstAyah.page || surahData.number;
  const rukuNumbers = new Set((surahData.ayahs || []).map((a) => a.ruku).filter(Boolean));
  const rukuCount = rukuNumbers.size || (surahData.numberOfAyahs > 80 ? 5 : surahData.numberOfAyahs > 30 ? 3 : 1);
  const showBismillah = surahData.number !== 9;
  const isFatiha = surahData.number === 1;
  const firstWords = cleanTopLabel(surahData.ayahs?.[0]?.text || surahData.name);

  const cleanAyahs = useMemo(() => {
    return (surahData.ayahs || [])
      .map((ayah) => ({
        ...ayah,
        text: ayah.numberInSurah === 1 && surahData.number !== 9 ? removeStartingBismillah(ayah.text) : ayah.text,
      }))
      .filter((ayah) => (ayah.text || "").trim().length > 0);
  }, [surahData]);

  const mushafPages = useMemo(() => splitAyahsIntoMushafPages(cleanAyahs, isFatiha), [cleanAyahs, isFatiha]);
  const currentAyahs = mushafPages[mushafPageIndex] || [];
  const displayPageNumber = realPageNumber + mushafPageIndex;
  const currentChars = currentAyahs.reduce((sum, a) => sum + (a.text || "").length, 0);
  const compactPage = !isFatiha && currentChars > 700;
  const mediumPage = !isFatiha && currentChars > 520 && currentChars <= 700;

  useEffect(() => {
    setMushafPageIndex(0);
  }, [surahData.number]);

  useEffect(() => {
    if (mushafPageIndex > Math.max(0, mushafPages.length - 1)) {
      setMushafPageIndex(0);
    }
  }, [mushafPageIndex, mushafPages.length]);

  const canGoPrev = mushafPageIndex > 0;
  const canGoNext = mushafPageIndex < mushafPages.length - 1;
  
  return (
    <div className="mx-auto w-full">
      <div className="mx-auto flex w-full justify-center overflow-x-auto py-2">
        <div
          className="relative w-[720px] shrink-0 overflow-hidden bg-[#fffef5] text-[#1a1000]"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          <div className="pointer-events-none absolute inset-2 border-[3px] border-[#1a1000]" />
          <div
            className="pointer-events-none absolute inset-[11px] opacity-95"
            style={{ backgroundImage: "radial-gradient(circle,#1a1000 1px,transparent 1.35px)", backgroundSize: "9px 9px" }}
          />
          <div className="pointer-events-none absolute inset-[14px] bg-[#fffef5]" />
          <div className="pointer-events-none absolute inset-[14px] border-[1.5px] border-[#1a1000]" />

          <CornerOrnament className="left-[14px] top-[14px] rotate-180" />
          <CornerOrnament className="right-[14px] top-[14px] -rotate-90" />
          <CornerOrnament className="bottom-[14px] left-[14px] rotate-90" />
          <CornerOrnament className="bottom-[14px] right-[14px]" />

          <div className="absolute left-[-2px] top-[150px] z-20 origin-left -rotate-90 whitespace-nowrap text-[15px] leading-none text-[#1a1000]">
            نَمْبَر {toArabicDigits(juzNumber || 29)}&nbsp;&nbsp; سِيپَارَہ
          </div>

          <div className="relative z-10 px-[28px] py-[22px] pb-[44px]">
            <div dir="rtl" className="mx-[18px] mb-[10px] flex items-center justify-center text-[#1a1000]">
              <div className="text-center text-[28px] font-bold leading-none">{toArabicDigits(displayPageNumber)}</div>
            </div>

            <PatternBox className="mx-4 mb-3" innerClassName="relative min-h-[58px] px-3 py-2">
              <div dir="rtl" className="grid h-full grid-cols-[120px_1fr_120px] items-center text-center">
                <div className="text-[19px]">آياتها ۝ {toArabicDigits(surahData.numberOfAyahs)}</div>
                <div className="text-[27px] font-bold leading-[1.35]">{toArabicDigits(surahData.number)} {surahData.name} {surahData.revelationType === "Meccan" ? "مَكِّيَّةٌ" : "مَدَنِيَّةٌ"}</div>
                <div className="text-[19px]">رکوعاتھا ۝ {toArabicDigits(rukuCount)}</div>
              </div>
              <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2"><Rosette /></div>
              <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2"><Rosette flip /></div>
            </PatternBox>

            {showBismillah && mushafPageIndex === 0 && (
              <PatternBox className="mx-4 mb-4" innerClassName="grid min-h-[66px] grid-cols-[120px_1fr_120px] items-center px-3">
                <div className="flex justify-center"><Rosette /></div>
                <div dir="rtl" className="whitespace-nowrap text-center text-[28px] leading-[1.6] text-[#1a1000]" style={{ fontFamily: "'Amiri Quran','Amiri',serif" }}>
                  بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ
                </div>
                <div className="flex justify-center"><Rosette flip /></div>
              </PatternBox>
            )}

            <div className={cls("px-6", isFatiha ? "flex min-h-[430px] items-center justify-center pt-4 pb-4" : "pt-3 pb-3")}>
              <div
                dir="rtl"
                className={cls(
                  "w-full text-black",
                  isFatiha
                    ? "mx-auto max-w-[94%] text-center text-[42px] leading-[2.05]"
                    : compactPage
                      ? "text-justify text-[34px] leading-[1.78]"
                      : mediumPage
                        ? "text-justify text-[37px] leading-[1.86]"
                        : "text-justify text-[41px] leading-[1.92]"
                )}
                style={{ fontFamily: "'Amiri Quran','Amiri',serif", textJustify: "inter-word" }}
              >
                {currentAyahs.map((ayah) => (
                  <span key={ayah.number}>
                    {ayah.text} <span>۝{toArabicDigits(ayah.numberInSurah)}</span>{" "}
                  </span>
                ))}
              </div>
            </div>

            <div dir="rtl" className="mt-5 text-center text-[28px] font-extrabold leading-tight text-[#1a1000]">
              {surahData.name}
              {mushafPages.length > 1 && (
                <span className="mr-2 align-middle text-[16px] font-bold">
                  - {toArabicDigits(mushafPageIndex + 1)} / {toArabicDigits(mushafPages.length)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {mushafPages.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setMushafPageIndex((p) => Math.max(0, p - 1))}
            disabled={!canGoPrev}
            className="rounded-xl bg-slate-800 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev Page
          </button>
          <span className="rounded-xl bg-emerald-50 px-4 py-2 font-bold text-emerald-800 border border-emerald-100">
            Page {mushafPageIndex + 1} / {mushafPages.length}
          </span>
          <button
            onClick={() => setMushafPageIndex((p) => Math.min(mushafPages.length - 1, p + 1))}
            disabled={!canGoNext}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Page →
          </button>
        </div>
      )}
    </div>
  );
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
  return "Surah " + surah.englishName + " is the " + surah.number + "th Surah of the Holy Quran " + paraText + ". It is a " + type + " Surah and has " + surah.numberOfAyahs + " ayats. You can read Surah " + surah.englishName + " online with Arabic text, Urdu/English translation, and listen to clear audio recitation for easy learning and reflection.";
}

function getSurahBenefits(surah) {
  const benefits = {
    "Al-Faatiha": "Surah Al-Faatiha is known as the opening of the Quran and is recited in every prayer. It helps Muslims seek guidance, mercy, and blessings from Allah.",
    "Al-Baqarah": "Reading Surah Al-Baqarah brings blessings to the home and protects from negative influences. It contains Ayat-ul-Kursi and many important teachings.",
    "Yaseen": "Surah Yaseen is called the heart of the Quran. Muslims often recite it for peace, ease, and blessings.",
    "Al-Mulk": "Surah Al-Mulk reminds believers about Allah’s power and is popularly recited at night for reflection and spiritual benefit.",
    "Ar-Rahman": "Surah Ar-Rahman highlights the countless blessings of Allah and increases gratitude and peace in the heart.",
  };

  return benefits[surah.englishName] || "Reading Surah " + surah.englishName + " helps Muslims understand the message of the Quran, improve recitation, and gain spiritual peace and guidance.";
}

function getSurahLongInfo(surah) {
  if (!surah) return [];
  return [
    {
      title: "Surah " + surah.englishName + " Read Online",
      body: "Surah " + surah.englishName + " is the " + surah.number + "th chapter of the Holy Quran. It is a " + (surah.revelationType === "Meccan" ? "Makki" : "Madani") + " Surah consisting of " + surah.numberOfAyahs + " ayats. This section helps you read Surah " + surah.englishName + " online with Arabic text and translation in a clean and easy style.",
    },
    {
      title: "Surah " + surah.englishName + " Audio",
      body: "You can listen to Surah " + surah.englishName + " audio recitation using the Play button. The audio plays ayat by ayat, and for most Surahs Bismillah is played before the Surah begins.",
    },
    {
      title: "Benefits of Reading Surah " + surah.englishName,
      body: getSurahBenefits(surah),
    },
    {
      title: "What are the main benefits of reading Surah " + surah.englishName + "?",
      body: "Every Surah of the Quran contains guidance, wisdom, and spiritual lessons. Reading Surah " + surah.englishName + " regularly can help improve understanding of Islam and strengthen connection with Allah.",
    },
  ];
}

export default function QuranPakWebsite() {
  const [dark, setDark] = useState(false);
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [arabicEdition, setArabicEdition] = useState("quran-uthmani");
  const [translationEdition, setTranslationEdition] = useState("ur.jalandhry");
  const [surahData, setSurahData] = useState(null);
  const [translationData, setTranslationData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [selectedReciter, setSelectedReciter] = useState("nooresunnat-sudais-shuraim-urdu");
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
  const isNooreSunnatReciter = selectedReciter === "nooresunnat-sudais-shuraim-urdu";
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentCity, setCommentCity] = useState("");
  const [captcha, setCaptcha] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [captchaInput, setCaptchaInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("03166311442");
  const [contactCity, setContactCity] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
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
          fetch(`${API}/surah/${selectedSurah}/${isNooreSunnatReciter ? "ar.alafasy" : selectedReciter}`),
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
  }, [selectedSurah, arabicEdition, translationEdition, selectedReciter, isNooreSunnatReciter]);

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter((s) => {
      const searchText = ((s.number ?? "") + " " + (s.englishName ?? "") + " " + (s.name ?? "") + " " + (s.englishNameTranslation ?? "")).toLowerCase();
      return searchText.includes(q);
    });
  }, [surahs, query]);

  const currentQuiz = QUIZZES[activeQuiz];
  const quizDone = currentQuiz.questions.every((_, i) => answers[activeQuiz + "-" + i]);
  const score = currentQuiz.questions.reduce((total, item, i) => total + (answers[activeQuiz + "-" + i] === item.answer ? 1 : 0), 0);

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
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSurahPlaying(false);
    setSurahAudioIndex(0);
  }

  function finishAudioPlayback() {
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

  function submitContact(e) {
    e.preventDefault();
    const message = "اسسلام و علیکم، میں قرآن پاک سیکھنا چاہتا/چاہتی ہوں۔";
    const whatsappUrl = "https://wa.me/923166311442?text=" + encodeURIComponent(message);

    setContactError("");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function playFullSurah(startIndex = 0, withBismillah = true) {
    if (surahAudioRef.current) surahAudioRef.current.pause();

    if (isNooreSunnatReciter) {
      const fullSurahUrl = getNooreSunnatAudioUrl(selectedSurah);
      if (!fullSurahUrl) return;
      const audio = new Audio(fullSurahUrl);
      surahAudioRef.current = audio;
      setIsSurahPlaying(true);
      setSurahAudioIndex(0);
      audio.play().catch(() => setIsSurahPlaying(false));
      audio.onended = () => finishAudioPlayback();
      audio.onerror = () => {
        setError("NooreSunnat audio load nahi hui. Ho sakta hai browser/server ne direct MP3 block kar di ho.");
        finishAudioPlayback();
      };
      return;
    }

    const ayahs = audioData?.ayahs || [];
    if (!ayahs.length) return;
    const safeIndex = Math.max(0, Math.min(startIndex, ayahs.length - 1));

    const shouldPlayBismillah = withBismillah && safeIndex === 0 && surahData?.number !== 1 && surahData?.number !== 9;
    const dynamicBismillahAudio = "https://cdn.islamic.network/quran/audio/128/" + selectedReciter + "/1.mp3";
    const audio = new Audio(shouldPlayBismillah ? dynamicBismillahAudio : ayahs[safeIndex].audio);
    surahAudioRef.current = audio;
    setIsSurahPlaying(true);
    setSurahAudioIndex(shouldPlayBismillah ? -1 : safeIndex);

    audio.play().catch(() => setIsSurahPlaying(false));
    audio.onended = () => {
      if (shouldPlayBismillah) playFullSurah(0, false);
      else if (safeIndex + 1 < ayahs.length) playFullSurah(safeIndex + 1, false);
      else finishAudioPlayback();
    };
  }

  function playNextAyah() {
    if (isNooreSunnatReciter) return;
    const ayahs = audioData?.ayahs || [];
    if (!ayahs.length) return;
    const nextIndex = surahAudioIndex === -1 ? 0 : Math.min(surahAudioIndex + 1, ayahs.length - 1);
    playFullSurah(nextIndex, false);
  }

  function playPrevAyah() {
    if (isNooreSunnatReciter) return;
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
                  <button key={s.number} onClick={() => setSelectedSurah(s.number)} className={cls("w-full text-left rounded-2xl px-4 py-4 transition border", selectedSurah === s.number ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" : dark ? "bg-slate-950 border-slate-800 hover:bg-slate-800" : "bg-white border-emerald-100 hover:bg-emerald-50 hover:shadow-md")}>
                    <div className="grid grid-cols-[1fr_132px] items-center gap-3">
                      <div className="min-w-0 pr-1">
                        <p className="break-words text-[17px] md:text-[18px] font-extrabold leading-[1.18] tracking-tight">{s.number}. {s.englishName}</p>
                        <p className="mt-1 break-words text-[13px] md:text-[14px] font-semibold leading-[1.25] opacity-85">{s.englishNameTranslation} • {s.numberOfAyahs} Ayahs</p>
                      </div>
                      <div className="flex justify-end">
                        <p className="max-w-[132px] text-right text-[24px] md:text-[27px] font-bold leading-[1.15]" dir="rtl">{s.name}</p>
                      </div>
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
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-[#fffaf0] via-white to-emerald-50 px-4 py-3 shadow-[0_18px_55px_rgba(120,83,20,0.14)] ring-1 ring-white/80">
                          <select
                            value={selectedReciter}
                            onChange={(e) => {
                              stopFullSurah();
                              setSelectedReciter(e.target.value);
                            }}
                            className="rounded-2xl border border-amber-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm"
                            title="Reciter select karein"
                          >
                            {RECITERS.map((reciter) => (
                              <option key={reciter.id} value={reciter.id}>{reciter.name}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-3 rounded-[1.8rem] border border-amber-200/80 bg-white/95 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_35px_rgba(92,67,18,0.13)] backdrop-blur">
                            <button
                              onClick={playPrevAyah}
                              disabled={isNooreSunnatReciter || !isSurahPlaying || surahAudioIndex <= 0}
                              className="group grid h-13 w-13 place-items-center rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:from-amber-50 hover:to-white hover:text-amber-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
                              title="Previous ayah"
                            >
                              <span className="text-xl">⏮</span>
                            </button>

                            <button
                              onClick={() => (isSurahPlaying ? stopFullSurah() : playFullSurah(0))}
                              className={cls(
                                "min-w-[120px] rounded-2xl px-6 py-3.5 text-base font-extrabold tracking-wide text-white shadow-xl transition hover:-translate-y-0.5 active:translate-y-0",
                                isSurahPlaying
                                  ? "bg-gradient-to-r from-rose-500 via-red-500 to-red-700 shadow-red-500/30 hover:from-rose-600 hover:to-red-800"
                                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 shadow-emerald-500/30 hover:from-emerald-700 hover:to-cyan-800"
                              )}
                              title={isSurahPlaying ? "Stop recitation" : "Play recitation"}
                            >
                              <span className="inline-flex items-center justify-center gap-2">
                                <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/20 text-sm">{isSurahPlaying ? "⏸" : "▶"}</span>
                                <span>{isSurahPlaying ? "Stop" : "Play"}</span>
                              </span>
                            </button>

                            <button
                              onClick={playNextAyah}
                              disabled={isNooreSunnatReciter || !isSurahPlaying || surahAudioIndex >= audioData.ayahs.length - 1}
                              className="group grid h-13 w-13 place-items-center rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:from-amber-50 hover:to-white hover:text-amber-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
                              title="Next ayah"
                            >
                              <span className="text-xl">⏭</span>
                            </button>
                          </div>
                          <p className="rounded-xl bg-white/80 px-3 py-2 text-sm font-bold text-slate-600 shadow-sm">
                            {isSurahPlaying ? (isNooreSunnatReciter ? "Full Surah + Urdu" : surahAudioIndex === -1 ? "Bismillah" : "Ayah " + (surahAudioIndex + 1) + " / " + audioData.ayahs.length) : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <MushafSurahPage surahData={surahData} translationData={translationData} />

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
                <Btn key={quiz.title} disabled={i > unlockedQuiz} onClick={() => { setActiveQuiz(i); setShowResult(false); }} className={cls("text-white", activeQuiz === i ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-700 hover:bg-slate-600")}>{i > unlockedQuiz ? "Locked" : "Quiz " + (i + 1)}</Btn>
              ))}
            </div>
            <h4 className="text-2xl font-bold mb-4 tracking-tight">{currentQuiz.title}</h4>
            <div className="space-y-5">
              {currentQuiz.questions.map((item, i) => {
                const key = activeQuiz + "-" + i;
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

      <section id="contact" className="max-w-7xl mx-auto px-4 py-8">
        <div className={cls("relative overflow-hidden rounded-[2rem] border shadow-[0_24px_80px_rgba(16,185,129,0.14)]", dark ? "bg-slate-900 border-slate-800" : "bg-[#fffef5] border-emerald-100")}>
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.18),transparent_30%)]" />
          <div className="relative p-5 md:p-8">
            <div className="mx-auto max-w-5xl rounded-[1.7rem] border-2 border-[#8b6914] bg-white/90 p-4 md:p-7 shadow-sm">
              <div className="rounded-[1.35rem] border border-[#c9a040] bg-[#fffef5] p-5 md:p-7" dir="rtl">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 h-1 w-28 rounded-full bg-gradient-to-r from-transparent via-[#b8860b] to-transparent" />
                  <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.5] text-[#5c4312]" style={{ fontFamily: "'Amiri', serif" }}>
                    قرآن پاک سیکھنے کے لیے رابطہ کریں
                  </h2>
                  <p className="mt-3 text-lg md:text-xl font-semibold leading-8 text-slate-700">
                    اگر آپ قرآن پاک سیکھنا چاہتے ہیں تو ہم سے رابطہ کریں
                  </p>
                </div>

                <form onSubmit={submitContact} className="flex justify-center">
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 px-10 py-4 text-xl font-extrabold text-white shadow-xl shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-cyan-800"
                  >
                    ابھی رابطہ کریں
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <a href={WHATSAPP_LINK} target="_top" className="fixed bottom-5 right-5 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition text-3xl ring-4 ring-white" aria-label="WhatsApp">💬</a>
    </main>
  );
}
