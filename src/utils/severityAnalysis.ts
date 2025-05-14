/**
 * Utility for analyzing symptom and diagnosis severity
 */

// Severity levels:
// 1 = Not urgent (Не срочно)
// 2 = Requires attention (Требует внимания)
// 3 = Urgent (Срочно)

// Keywords that might indicate urgency level
const URGENT_KEYWORDS = [
  'немедленно', 'срочно', 'критическ', 'экстренн', 'неотложн', 
  'опасн', 'тяжел', 'острая боль', 'сильная боль', 'нестерпимая',
  'кровотеч', 'потеря сознания', 'инсульт', 'инфаркт', 'сердечный приступ',
  'отравлени', 'анафилактическ', 'затруднение дыхания', 'удушье', 'судороги',
  'смертельно', 'летальн', 'неотложная помощь', 'вызывать скорую'
];

const ATTENTION_KEYWORDS = [
  'требует внимания', 'обратиться к врачу', 'консультация специалиста',
  'наблюдение', 'контроль', 'записаться на прием', 'посетить стоматолога',
  'в ближайшее время', 'в течение нескольких дней', 'умеренная боль',
  'воспаление', 'инфекция', 'обострение', 'хроническое', 'повышенная температура',
  'симптомы ухудшаются', 'продолжительная боль', 'дискомфорт', 'беспокойство'
];

const NON_URGENT_KEYWORDS = [
  'не срочно', 'можно подождать', 'плановый прием', 'профилактическ',
  'рекомендации', 'домашнее лечение', 'незначительн', 'слабая боль', 'легкое недомогание',
  'самостоятельно пройдет', 'не требует срочного вмешательства', 'легкий дискомфорт'
];

/**
 * Analyzes symptoms and diagnosis to determine severity level
 * @param symptoms Patient symptoms text
 * @param diagnosis Medical diagnosis text
 * @returns Severity level (1-3)
 */
export const analyzeSeverity = (symptoms: string, diagnosis: string): number => {
  // Combine text for analysis
  const combinedText = (symptoms + ' ' + diagnosis).toLowerCase();
  
  // Count keyword matches for each severity level
  let urgentScore = 0;
  let attentionScore = 0;
  let nonUrgentScore = 0;
  
  // Check for urgent keywords
  URGENT_KEYWORDS.forEach(keyword => {
    if (combinedText.includes(keyword.toLowerCase())) {
      urgentScore += 1;
    }
  });
  
  // Check for attention keywords
  ATTENTION_KEYWORDS.forEach(keyword => {
    if (combinedText.includes(keyword.toLowerCase())) {
      attentionScore += 1;
    }
  });
  
  // Check for non-urgent keywords
  NON_URGENT_KEYWORDS.forEach(keyword => {
    if (combinedText.includes(keyword.toLowerCase())) {
      nonUrgentScore += 1;
    }
  });
  
  // Apply some domain-specific rules for certain conditions
  const hasDentalKeywords = combinedText.includes('зуб') || combinedText.includes('десн');
  
  // If we're talking about teeth and the problem isn't explicitly urgent,
  // likely it's not an emergency but requires attention from a dentist
  if (hasDentalKeywords && urgentScore === 0) {
    attentionScore += 1;
  }
  
  // For dental pain after cold water (the specific scenario mentioned)
  if (hasDentalKeywords && combinedText.includes('холодн') && combinedText.includes('вод')) {
    // Usually indicates sensitivity or early cavity - not typically urgent
    nonUrgentScore += 1;
  }
  
  // Choose severity based on highest score
  if (urgentScore > attentionScore && urgentScore > nonUrgentScore) {
    return 3; // Urgent
  } else if (attentionScore > nonUrgentScore) {
    return 2; // Requires attention
  } else {
    return 1; // Not urgent
  }
};

/**
 * Gets the string description for a severity level
 * @param severity Severity level (1-3)
 * @returns String description
 */
export const getSeverityLabel = (severity: number): string => {
  switch(severity) {
    case 3: return 'Срочно';
    case 2: return 'Требует внимания';
    case 1: return 'Не срочно';
    default: return 'Не определено';
  }
};
