export interface VoiceLanguage {
  code: string;       // BCP-47 tag, e.g., 'en-US'
  name: string;       // English name, e.g., 'Swahili'
  nativeName: string; // Native name, e.g., 'Kiswahili'
  flag: string;       // Emoji flag representation
}

export const SUPPORTED_VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'sw-KE', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu-ZA', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh-ZA', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'af-ZA', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh-CN', name: 'Mandarin Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'th-TH', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'am-ET', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'yo-NG', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ha-NG', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'ig-NG', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬' },
  { code: 'fil-PH', name: 'Filipino', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'el-GR', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' }
];

export function getLanguageByCode(code: string): VoiceLanguage {
  const found = SUPPORTED_VOICE_LANGUAGES.find(l => l.code === code || l.code.startsWith(code.split('-')[0]));
  return found || SUPPORTED_VOICE_LANGUAGES[0];
}

/**
 * Clean markdown symbols for smooth, natural text-to-speech reading.
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold asterisks
    .replace(/\*(.*?)\*/g, '$1')     // remove italic asterisks
    .replace(/^#+\s+/gm, '')        // remove heading hashes
    .replace(/•/g, '')              // remove bullet dots
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // replace markdown links with text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`([^`]+)`/g, '$1')    // remove inline backticks
    .replace(/\n+/g, '. ')          // turn line breaks into pauses
    .trim();
}
