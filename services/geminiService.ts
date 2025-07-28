import { GoogleGenerativeAI } from "@google/generative-ai";
import { type ServiceAnalysis, JobCategory, UrgencyLevel, SeverityLevel, type PriceEstimateValue } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; // Use Expo environment variable for React Native

if (!API_KEY) {
  console.warn("GEMINI_API_KEY is not set. Service requests will not be analyzed by AI.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-pro" });

const priceEstimateOptions: PriceEstimateValue[] = ["Affordable", "Moderate", "Premium", "Requires Quote"];

export const analyzeServiceRequestWithGemini = async (description: string): Promise<ServiceAnalysis> => {
  if (!model) {
    console.warn("Gemini AI client not initialized. Returning default analysis.");
    return {
      jobType: JobCategory.OTHER,
      urgency: UrgencyLevel.MEDIUM,
      severity: SeverityLevel.MODERATE,
      estimatedDuration: "Not Estimated",
      priceEstimate: "Requires Quote",
    };
  }

  const prompt = `
    Analyze this service request and respond in JSON format with these properties:
    - jobType (possible values: ${Object.values(JobCategory).join(', ')})
    - urgency (possible values: ${Object.values(UrgencyLevel).join(', ')})
    - severity (possible values: ${Object.values(SeverityLevel).join(', ')})
    - estimatedDuration (e.g., "1-2 hours", "half a day")
    - priceEstimate (possible values: ${priceEstimateOptions.join(', ')})
    
    Rules:
    1. If unsure, pick the most general/moderate option
    2. For complex jobs, set priceEstimate to "Requires Quote"
    3. Keep durations reasonable
    
    Service Request: "${description}"
    
    Respond ONLY with valid JSON like this:
    {
      "jobType": "...",
      "urgency": "...",
      "severity": "...",
      "estimatedDuration": "...",
      "priceEstimate": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to extract JSON
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    
    const parsedData = JSON.parse(jsonStr);

    return {
      jobType: parsedData.jobType || JobCategory.OTHER,
      urgency: parsedData.urgency || UrgencyLevel.MEDIUM,
      severity: parsedData.severity || SeverityLevel.MODERATE,
      estimatedDuration: parsedData.estimatedDuration || "Not Estimated",
      priceEstimate: parsedData.priceEstimate || "Requires Quote",
    };

  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      jobType: JobCategory.OTHER,
      urgency: UrgencyLevel.MEDIUM,
      severity: SeverityLevel.MODERATE,
      estimatedDuration: "Not Estimated",
      priceEstimate: "Requires Quote",
    };
  }
};