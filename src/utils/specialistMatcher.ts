import { specializationBySymptoms } from '../data/doctors';

/**
 * Analyzes symptoms and diagnosis to recommend appropriate medical specialist
 * @param userSymptoms User's reported symptoms
 * @param diagnosis AI-generated diagnosis
 * @returns Specialization code for the recommended specialist
 */
export const getRecommendedSpecialization = (userSymptoms: string, diagnosis: string): string | null => {
  const combinedText = (userSymptoms + ' ' + diagnosis).toLowerCase();
  
  // Map of symptoms to specialization codes
  const symptomMatches = specializationBySymptoms.filter(item => {
    return item.symptoms.some((symptom: string) => 
      combinedText.includes(symptom.toLowerCase())
    );
  });
  
  // Sort by number of symptom matches (most relevant first)
  const sortedMatches = symptomMatches.sort((a, b) => {
    const aMatches = a.symptoms.filter((symptom: string) => 
      combinedText.includes(symptom.toLowerCase())
    ).length;
    
    const bMatches = b.symptoms.filter((symptom: string) => 
      combinedText.includes(symptom.toLowerCase())
    ).length;
    
    return bMatches - aMatches;
  });
  
  // Return the most relevant specialization or null if no matches
  return sortedMatches.length > 0 ? sortedMatches[0].specialization : null;
}
