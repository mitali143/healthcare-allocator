const axios = require('axios');

async function analyzeSymptoms(symptoms, age, vitals) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'user',
            content: `You are a medical triage assistant. Based on the following patient information, provide a severity score from 1-10 (10 being most critical) and a brief reason.

Patient Information:
- Age: ${age}
- Symptoms: ${symptoms}
- Vitals: ${vitals}

Respond in this exact format:
SCORE: [number]
REASON: [one sentence explanation]`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const scoreMatch = text.match(/SCORE:\s*(\d+)/);
    const reasonMatch = text.match(/REASON:\s*(.+)/);

    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 5,
      reason: reasonMatch ? reasonMatch[1] : 'Unable to analyze symptoms'
    };
  } catch (error) {
    console.error('OpenRouter API error:', error.message);
    return { score: 5, reason: 'AI analysis unavailable' };
  }
}

module.exports = { analyzeSymptoms };