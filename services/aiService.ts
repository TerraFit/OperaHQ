
import { GoogleGenAI, Type } from "@google/genai";
import { SOPDepartment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeneratedSOP {
  title: string;
  contentHtml: string;
  summary: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export const AIService = {
  generateSOP: async (
    title: string, 
    department: SOPDepartment, 
    category: string, 
    additionalInstructions: string
  ): Promise<GeneratedSOP> => {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Create a professional, high-standard SOP for Zebra Lodge (South Africa).
      Title: ${title}
      Department: ${department}
      Category: ${category}
      Specific Instructions: ${additionalInstructions}`,
      config: {
        systemInstruction: `You are an expert Safety and Operations Consultant for high-end safari lodges in South Africa. 
        Your task is to generate Standard Operating Procedures (SOPs) that are legally compliant with South African labor and safety laws.
        
        The output must be high-quality, professional, and strictly formatted.
        The contentHtml should use standard semantic HTML tags (h1, h2, p, ul, li, strong).
        The quiz questions must be challenging enough to ensure 100% competency. 
        Each question must have exactly 4 options.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            contentHtml: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER }
                },
                required: ["question", "options", "correctIndex"]
              }
            }
          },
          required: ["title", "summary", "contentHtml", "questions"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}') as GeneratedSOP;
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("AI output was malformed. Please try again.");
    }
  }
};
