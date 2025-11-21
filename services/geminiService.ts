import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a highly intelligent, multilingual assistant. 
      Your primary goal is to answer any question asked by the user accurately and helpfully.
      CRITICAL RULE: You MUST answer in the EXACT SAME LANGUAGE that the user asks in. 
      If the user asks in Khmer, answer in Khmer. If the user asks in English, answer in English.
      Keep responses concise but complete. formatted in Markdown.`,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  try {
    if (!chatSession) {
        throw new Error("Failed to initialize chat session.");
    }
    
    const response: GenerateContentResponse = await chatSession.sendMessage({ 
      message: message 
    });
    
    const text = response.text;
    if (!text) {
      return "I understood the request but could not generate a text response.";
    }
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
