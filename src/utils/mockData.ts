/**
 * Mock analytics data for the dashboard
 * This replaces backend API calls to make the frontend self-contained
 */

// Generate dates for the last 30 days
const generateDailyDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Format as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Generate a reasonable random count (0-5)
    const count = Math.floor(Math.random() * 6);
    
    dates.push({
      date: formattedDate,
      count
    });
  }
  
  return dates;
};

// Generate weeks for the last 12 weeks
const generateWeeklyData = () => {
  const weeks = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - (i * 7));
    
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    
    weeks.push({
      week: `Week ${weekNumber} (${year})`,
      count: Math.floor(Math.random() * 20) + 5 // 5-25 consultations per week
    });
  }
  
  return weeks;
};

// Helper function to get ISO week number
const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Top reported symptoms
const topSymptoms = [
  { symptom: "Головная боль", count: 42 },
  { symptom: "Кашель", count: 38 },
  { symptom: "Насморк", count: 31 },
  { symptom: "Боль в горле", count: 27 },
  { symptom: "Температура", count: 25 },
  { symptom: "Слабость", count: 23 },
  { symptom: "Боль в животе", count: 18 },
  { symptom: "Головокружение", count: 15 },
  { symptom: "Боль в спине", count: 12 },
  { symptom: "Тошнота", count: 10 }
];

// Diagnosis distribution
const diagnosisDistribution = [
  { diagnosis: "Респираторное", count: 45 },
  { diagnosis: "Инфекция", count: 32 },
  { diagnosis: "Воспаление", count: 28 },
  { diagnosis: "Головные боли", count: 22 },
  { diagnosis: "Пищеварительное", count: 17 },
  { diagnosis: "Аллергия", count: 14 },
  { diagnosis: "Травма", count: 12 },
  { diagnosis: "Кожное", count: 9 },
  { diagnosis: "Хроническое", count: 7 },
  { diagnosis: "Другое", count: 5 }
];

// Severity distribution
const severityDistribution = [
  { severity: "Не срочно", count: 65 },
  { severity: "Требует внимания", count: 25 },
  { severity: "Срочно", count: 10 },
  { severity: "Не определено", count: 5 }
];

/**
 * Complete mock analytics data that matches the structure from the backend
 */
export const mockAnalyticsData = {
  daily_counts: generateDailyDates(),
  weekly_counts: generateWeeklyData(),
  top_symptoms: topSymptoms,
  diagnosis_distribution: diagnosisDistribution,
  severity_distribution: severityDistribution
};
