const { analyzeSymptoms } = require('./geminiservice');

async function scorePatient(patient) {
  try {
    const { age, symptoms, vitals } = patient;
    
    const aiAnalysis = await analyzeSymptoms(symptoms, age, vitals);
    
    let baseScore = aiAnalysis.score * 10;
    
    if (age > 60) baseScore += 10;
    if (age < 5) baseScore += 10;
    
    if (vitals) {
      if (vitals.includes('low blood pressure')) baseScore += 15;
      if (vitals.includes('high fever')) baseScore += 10;
      if (vitals.includes('low oxygen')) baseScore += 20;
    }
    
    return Math.min(baseScore, 100);
  } catch (error) {
    console.error('Scoring error:', error);
    return 50;
  }
}

module.exports = { scorePatient };