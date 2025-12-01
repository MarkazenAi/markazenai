"""
Language Detection System
Supports 65 languages with automatic detection
"""

SUPPORTED_LANGUAGES = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi",
    "bn": "Bengali",
    "pa": "Punjabi",
    "te": "Telugu",
    "mr": "Marathi",
    "ta": "Tamil",
    "ur": "Urdu",
    "tr": "Turkish",
    "vi": "Vietnamese",
    "pl": "Polish",
    "uk": "Ukrainian",
    "ro": "Romanian",
    "nl": "Dutch",
    "el": "Greek",
    "cs": "Czech",
    "sv": "Swedish",
    "hu": "Hungarian",
    "fi": "Finnish",
    "no": "Norwegian",
    "da": "Danish",
    "th": "Thai",
    "id": "Indonesian",
    "ms": "Malay",
    "he": "Hebrew",
    "fa": "Persian",
    "sw": "Swahili",
    "am": "Amharic",
    "ne": "Nepali",
    "si": "Sinhala",
    "my": "Burmese",
    "km": "Khmer",
    "lo": "Lao",
    "ka": "Georgian",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "kk": "Kazakh",
    "uz": "Uzbek",
    "et": "Estonian",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "hr": "Croatian",
    "sr": "Serbian",
    "bg": "Bulgarian",
    "mk": "Macedonian",
    "sq": "Albanian",
    "is": "Icelandic",
    "ga": "Irish",
    "cy": "Welsh",
    "eu": "Basque",
    "ca": "Catalan",
    "gl": "Galician",
    "af": "Afrikaans",
    "zu": "Zulu",
    "xh": "Xhosa",
}

# Common phrases in different languages for basic detection
LANGUAGE_PATTERNS = {
    "en": ["hello", "thank", "please", "yes", "no"],
    "es": ["hola", "gracias", "por favor", "sí", "no"],
    "fr": ["bonjour", "merci", "s'il vous plaît", "oui", "non"],
    "de": ["hallo", "danke", "bitte", "ja", "nein"],
    "it": ["ciao", "grazie", "per favore", "sì", "no"],
    "pt": ["olá", "obrigado", "por favor", "sim", "não"],
    "ru": ["привет", "спасибо", "пожалуйста", "да", "нет"],
    "ja": ["こんにちは", "ありがとう", "はい", "いいえ"],
    "ko": ["안녕하세요", "감사합니다", "네", "아니요"],
    "zh": ["你好", "谢谢", "是", "不是"],
    "ar": ["مرحبا", "شكرا", "نعم", "لا"],
    "hi": ["नमस्ते", "धन्यवाद", "हाँ", "नहीं"],
}


def detect_language(text: str, browser_lang: str = "en") -> str:
    """
    Detect language from text with fallback to browser language
    
    Args:
        text: Input text to analyze
        browser_lang: Browser's detected language as fallback
        
    Returns:
        Language code (e.g., "en", "es", "fr")
    """
    if not text or len(text.strip()) < 2:
        return browser_lang if browser_lang in SUPPORTED_LANGUAGES else "en"
    
    text_lower = text.lower()
    
    # Simple pattern matching for common phrases
    scores = {}
    for lang_code, patterns in LANGUAGE_PATTERNS.items():
        score = sum(1 for pattern in patterns if pattern in text_lower)
        if score > 0:
            scores[lang_code] = score
    
    if scores:
        detected = max(scores, key=scores.get)
        return detected
    
    # Character-based detection for specific scripts
    if any('\u4e00' <= char <= '\u9fff' for char in text):
        return "zh"  # Chinese
    if any('\u3040' <= char <= '\u309f' or '\u30a0' <= char <= '\u30ff' for char in text):
        return "ja"  # Japanese
    if any('\uac00' <= char <= '\ud7af' for char in text):
        return "ko"  # Korean
    if any('\u0600' <= char <= '\u06ff' for char in text):
        return "ar"  # Arabic
    if any('\u0900' <= char <= '\u097f' for char in text):
        return "hi"  # Hindi
    if any('\u0400' <= char <= '\u04ff' for char in text):
        return "ru"  # Russian
    if any('\u0e00' <= char <= '\u0e7f' for char in text):
        return "th"  # Thai
    
    # Fallback to browser language or English
    return browser_lang if browser_lang in SUPPORTED_LANGUAGES else "en"


def get_language_name(lang_code: str) -> str:
    """Get full language name from code"""
    return SUPPORTED_LANGUAGES.get(lang_code, "English")
