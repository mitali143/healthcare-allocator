import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY_HERE");

export async function analyzeSymptoms(symptoms) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Patient symptoms: ${symptoms}

    Give:
    1. Urgency (Low/Medium/High)
    2. Hospital type (General/ICU/Emergency)

    Return JSON:
    { "urgency": "...", "hospitalType": "..." }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);

  } catch (err) {
    console.log(err);

    return {
      urgency: "High",
      hospitalType: "ICU"
    };
  }
}