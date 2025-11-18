import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Settings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Remove the data:image/png;base64, prefix if present
const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
};

const getMimeType = (base64: string) => {
  const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

export const generateCaptions = async (
  imageBase64: string,
  settings: Settings
): Promise<string[]> => {
  
  const isStory = settings.platform === 'Story/Status';
  
  const systemInstruction = `
    You are a world-class social media copywriter known for authentic, viral, and human-sounding content. 
    Your goal is to write captions that feel organic and creative, avoiding the robotic "AI tone".
    
    CRITICAL GUIDELINES:
    1.  **Sound Human**: Write like a real person sharing a moment. Use natural phrasing, conversational hooks, and variable sentence structure.
    2.  **NO AI Clichés**: STRICTLY AVOID overused AI words like: "unleash", "elevate", "unlock", "dive into", "tapestry", "symphony", "testament", "realm", "masterpiece", "embrace".
    3.  **Show, Don't Just Tell**: Capture the vibe and emotion of the image, not just a literal description of objects.
    4.  **Platform Native**: Adapt the voice to fit the specific platform (e.g., professional for LinkedIn, casual/trendy for Instagram).
  `;

  const prompt = `
    Analyze the provided image and generate 3 distinct caption variants based on these settings:
    
    Configuration:
    - Platform: ${settings.platform}
    - Style: ${settings.style}
    - Tone: ${settings.tone}
    ${isStory 
      ? '- Constraint: Ultra-short, punchy, max 10 words. High impact for quick reading.' 
      : `- Length: ${settings.length}`}
    
    Formatting Requirements:
    - Emojis: ${settings.useEmojis ? 'Use relevant emojis naturally (do not spam).' : 'No emojis.'}
    - Hashtags: ${settings.useHashtags && !isStory ? 'Include 3-5 relevant, high-reach hashtags at the very end.' : 'No hashtags.'}
    
    Output:
    Return exactly 3 variants. Ensure they are distinct from each other in structure and wording.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      captions: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING
        },
        description: "A list of 3 generated captions."
      }
    },
    required: ["captions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64(imageBase64),
              mimeType: getMimeType(imageBase64),
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.1, // Higher temperature for more creativity
        topP: 0.95,
        topK: 40,
      },
    });

    const json = JSON.parse(response.text || '{"captions": []}');
    return json.captions || [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate captions. Please try again.");
  }
};