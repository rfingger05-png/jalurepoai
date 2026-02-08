
import { GoogleGenAI } from "@google/genai";

export const askGrammarAI = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert language teacher. Help the user with grammar questions. 
        Provide clear explanations and practical examples. Keep the tone encouraging and professional. 
        If asked for examples, provide them in a clear bulleted list. Use Markdown for formatting.`,
      },
    });
    return response.text || "Maaf, AI sedang tidak tersedia.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Terjadi kesalahan saat menghubungi AI. Pastikan kunci API Anda valid.";
  }
};
