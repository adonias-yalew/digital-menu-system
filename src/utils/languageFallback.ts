/**
 * Utility functions for language fallbacks
 * If Amharic or Oromo text is missing/empty, fallback to English
 */

export const getLocalizedText = (
  text: { en: string; am?: string; om?: string },
  lang: "en" | "am" | "om"
): string => {
  // If requesting English, always return English
  if (lang === "en") {
    return text.en || "";
  }

  // For Amharic or Oromo, check if translation exists
  if (lang === "am") {
    return text.am && text.am.trim() ? text.am : text.en;
  }

  if (lang === "om") {
    return text.om && text.om.trim() ? text.om : text.en;
  }

  // Default fallback to English
  return text.en || "";
};

/**
 * Helper to get category name with fallback
 */
export const getCategoryName = (
  category: string,
  lang: "en" | "am" | "om",
  categoryMap: Record<string, { en: string; am: string; om: string }>
): string => {
  const categoryText = categoryMap[category];
  if (!categoryText) {
    return category;
  }

  return getLocalizedText(categoryText, lang);
};
