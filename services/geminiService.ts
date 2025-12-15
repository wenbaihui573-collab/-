
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LANDSCAPE_ARCHITECT_SYSTEM_PROMPT, MJ_PROMPT_TEMPLATE } from "../constants";
import { Marker, SiteData } from "../types";

// Ensure API key is present (handled by environment in production, but assumed present here)
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert markers to text description for the AI
const formatMarkers = (markers: Marker[]): string => {
  if (markers.length === 0) return "No specific areas marked by user.";
  return markers.map(m => `- [${m.type}] at position ${Math.round(m.x)}%,${Math.round(m.y)}%: ${m.label}`).join('\n');
};

export const startDesignChat = async (siteData: SiteData, userMessage: string, history: any[]) => {
  // Deprecated/Unused helper in current flow, but kept for compatibility logic
  return userMessage; 
};

// Function to actually generate the response
export const generateResponse = async (chatSession: any, message: string) => {
    try {
        const result: GenerateContentResponse = await chatSession.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I'm having trouble connecting to the design cloud. Please try again.";
    }
};

export const createChatSession = (siteData: SiteData, language: 'zh' | 'en') => {
    const history = [];
    
    // Instructions for language
    const langInstruction = language === 'zh' 
      ? "IMPORTANT: Please converse with the user in Chinese (Simplified)." 
      : "IMPORTANT: Please converse with the user in English.";

    // If there is an image, we send it in the history as the first user message
    if (siteData.image) {
        history.push({
            role: 'user',
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: siteData.image.split(',')[1]
                    }
                },
                {
                    text: `Here is the site photo. ${formatMarkers(siteData.markers)}. ${langInstruction}`
                }
            ]
        });
        history.push({
            role: 'model',
            parts: [{ text: language === 'zh' ? "收到现场照片和标记。请问您对这个空间有什么设想？" : "Received site photo and markers. What is your vision for this space?" }]
        });
    } else {
       // If no image (edge case), just set language instruction in history
       history.push({
         role: 'user',
         parts: [{ text: `I am starting a design session. ${langInstruction}` }]
       });
       history.push({
         role: 'model',
         parts: [{ text: language === 'zh' ? "你好！我是您的景观设计助手。" : "Hello! I am your landscape design assistant." }]
       });
    }

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: LANDSCAPE_ARCHITECT_SYSTEM_PROMPT + `\n\n${langInstruction}`,
            temperature: 0.7,
        },
        history: history
    });
}

export const generateRenderPrompt = async (conversationSummary: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on this conversation summary: "${conversationSummary}", generate a specific Midjourney prompt using this template: ${MJ_PROMPT_TEMPLATE}. Return ONLY the prompt text.`,
        });
        return response.text;
    } catch (e) {
        return "Error generating render prompt.";
    }
}
