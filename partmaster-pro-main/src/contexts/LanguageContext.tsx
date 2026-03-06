import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ta" | "hi";

const translations: Record<string, Record<Language, string>> = {
  "dashboard": { en: "Dashboard", ta: "டாஷ்போர்டு", hi: "डैशबोर्ड" },
  "generator": { en: "Generator", ta: "ஜெனரேட்டர்", hi: "जनरेटर" },
  "search": { en: "Search", ta: "தேடு", hi: "खोज" },
  "history": { en: "History", ta: "வரலாறு", hi: "इतिहास" },
  "translator": { en: "Translator", ta: "மொழிபெயர்ப்பாளர்", hi: "अनुवादक" },
  "settings": { en: "Settings", ta: "அமைப்புகள்", hi: "सेटिंग्स" },
  "partgen": { en: "PartGen", ta: "PartGen", hi: "PartGen" },
  "teamcenter": { en: "Teamcenter", ta: "Teamcenter", hi: "Teamcenter" },
  "connected": { en: "Connected", ta: "இணைக்கப்பட்டது", hi: "जुड़ा हुआ" },
  "active": { en: "Active", ta: "செயலில்", hi: "सक्रिय" },
  "parts_generated": { en: "Parts Generated", ta: "உருவாக்கப்பட்ட பாகங்கள்", hi: "पार्ट्स जनरेटेड" },
  "searches": { en: "Searches", ta: "தேடல்கள்", hi: "खोजें" },
  "total_parts": { en: "Total Parts", ta: "மொத்த பாகங்கள்", hi: "कुल पार्ट्स" },
  "efficiency": { en: "Efficiency", ta: "திறன்", hi: "दक्षता" },
  "this_month": { en: "This month", ta: "இந்த மாதம்", hi: "इस महीने" },
  "in_teamcenter": { en: "In Teamcenter", ta: "Teamcenter-ல்", hi: "Teamcenter में" },
  "generation_by_category": { en: "Generation by Category", ta: "வகை வாரியான உருவாக்கம்", hi: "श्रेणी के अनुसार" },
  "part_number_generator": { en: "Part Number Generator", ta: "பாகம் எண் ஜெனரேட்டர்", hi: "पार्ट नंबर जनरेटर" },
  "configure_parameters": { en: "Configure parameters to generate a new part number", ta: "புதிய பாகம் எண்ணை உருவாக்க அளவுருக்களை உள்ளமைக்கவும்", hi: "नया पार्ट नंबर जनरेट करने के लिए पैरामीटर कॉन्फ़िगर करें" },
  "category": { en: "Category", ta: "வகை", hi: "श्रेणी" },
  "subcategory": { en: "Subcategory", ta: "துணைப்பிரிவு", hi: "उपश्रेणी" },
  "material": { en: "Material", ta: "பொருள்", hi: "सामग्री" },
  "sequence_number": { en: "Sequence Number", ta: "வரிசை எண்", hi: "क्रम संख्या" },
  "classification": { en: "Classification", ta: "வகைப்பாடு", hi: "वर्गीकरण" },
  "part_details": { en: "Part Details", ta: "பாகம் விவரங்கள்", hi: "पार्ट विवरण" },
  "description": { en: "Description", ta: "விளக்கம்", hi: "विवरण" },
  "reset": { en: "Reset", ta: "மீட்டமை", hi: "रीसेट" },
  "generate_save": { en: "Generate & Save", ta: "உருவாக்கு & சேமி", hi: "जनरेट और सेव" },
  "search_parts": { en: "Search Parts", ta: "பாகங்களைத் தேடு", hi: "पार्ट्स खोजें" },
  "search_existing": { en: "Search existing parts in Teamcenter database", ta: "Teamcenter தரவுத்தளத்தில் உள்ள பாகங்களைத் தேடுங்கள்", hi: "Teamcenter डेटाबेस में मौजूदा पार्ट्स खोजें" },
  "export_csv": { en: "Export CSV", ta: "CSV ஏற்றுமதி", hi: "CSV निर्यात" },
  "history_log": { en: "Part generation and search history log", ta: "பாகம் உருவாக்கம் மற்றும் தேடல் வரலாற்றுப் பதிவு", hi: "पार्ट जनरेशन और खोज इतिहास लॉग" },
  "notifications": { en: "Notifications", ta: "அறிவிப்புகள்", hi: "सूचनाएं" },
  "no_notifications": { en: "No new notifications", ta: "புதிய அறிவிப்புகள் இல்லை", hi: "कोई नई सूचना नहीं" },
  "mark_all_read": { en: "Mark all as read", ta: "அனைத்தையும் படித்ததாகக் குறி", hi: "सभी को पढ़ा हुआ चिह्नित करें" },
  "clear_all": { en: "Clear all", ta: "அனைத்தையும் அழி", hi: "सभी साफ़ करें" },
  "welcome_title": { en: "Automated Part Number Generator", ta: "தானியங்கி பாகம் எண் ஜெனரேட்டர்", hi: "स्वचालित पार्ट नंबर जनरेटर" },
  "welcome_subtitle": { en: "Powered by Teamcenter SOA APIs", ta: "Teamcenter SOA API-களால் இயக்கப்படுகிறது", hi: "Teamcenter SOA API द्वारा संचालित" },
  "welcome_desc": { en: "Generate, search, and manage part numbers with an intelligent system integrated with Siemens Teamcenter.", ta: "Siemens Teamcenter உடன் ஒருங்கிணைக்கப்பட்ட நுண்ணறிவு அமைப்புடன் பாகம் எண்களை உருவாக்கவும், தேடவும், நிர்வகிக்கவும்.", hi: "Siemens Teamcenter के साथ एकीकृत बुद्धिमान प्रणाली से पार्ट नंबर जनरेट करें, खोजें और प्रबंधित करें।" },
  "get_started": { en: "Get Started", ta: "தொடங்குங்கள்", hi: "शुरू करें" },
  "translate_text": { en: "Translate Text", ta: "உரையை மொழிபெயர்", hi: "टेक्स्ट अनुवाद करें" },
  "enter_text": { en: "Enter text to translate...", ta: "மொழிபெயர்க்க உரையை உள்ளிடவும்...", hi: "अनुवाद करने के लिए टेक्स्ट दर्ज करें..." },
  "translate": { en: "Translate", ta: "மொழிபெயர்", hi: "अनुवाद करें" },
  "from": { en: "From", ta: "இருந்து", hi: "से" },
  "to": { en: "To", ta: "க்கு", hi: "को" },
  "ai_assistant": { en: "AI Assistant", ta: "AI உதவியாளர்", hi: "AI सहायक" },
  "type_message": { en: "Type a message...", ta: "ஒரு செய்தியைத் தட்டச்சு செய்யுங்கள்...", hi: "संदेश टाइप करें..." },
  "language": { en: "Language", ta: "மொழி", hi: "भाषा" },
  "theme": { en: "Theme", ta: "தீம்", hi: "थीम" },
  "dark": { en: "Dark", ta: "இருண்ட", hi: "डार्क" },
  "light": { en: "Light", ta: "ஒளி", hi: "लाइट" },
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("partgen-lang") as Language) || "en";
  });

  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem("partgen-lang", l);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
