import { GoogleGenAI } from "@google/genai";

// Initialize the client. Note: We will re-instantiate this inside functions 
// where we need to ensure the latest key is used, especially for Veo.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Checks if the user has selected an API key.
 */
export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

/**
 * Opens the API key selection dialog.
 */
export const selectApiKey = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  }
};

/**
 * Helpers to encode file to Base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generate Video using Veo (Text or Image based)
 */
export const generateVideo = async (
  prompt: string,
  aspectRatio: '16:9' | '9:16',
  imageFile?: File
): Promise<string | null> => {
  if (!navigator.onLine) {
    throw new Error("You are currently offline. Please check your internet connection.");
  }

  const ai = getClient();
  const model = 'veo-3.1-fast-generate-preview';

  let operation;

  try {
    if (imageFile) {
      const imageBase64 = await fileToBase64(imageFile);
      // Image-to-Video
      operation = await ai.models.generateVideos({
        model,
        prompt: prompt || "Animate this image", // Prompt is optional but recommended
        image: {
            imageBytes: imageBase64,
            mimeType: imageFile.type,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio,
        },
      });
    } else {
      // Text-to-Video
      operation = await ai.models.generateVideos({
        model,
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio,
        },
      });
    }

    // Polling loop
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5s (Veo is fast-ish but needs time)
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
        throw new Error("No video URI returned.");
    }

    // Append API key for download
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Video generation failed:", error);
    throw error;
  }
};

/**
 * Edit Image using Gemini 2.5 Flash Image
 */
export const editImage = async (
  imageFile: File,
  instruction: string
): Promise<string> => {
  if (!navigator.onLine) {
    throw new Error("You are currently offline. Please check your internet connection.");
  }

  const ai = getClient();
  const model = 'gemini-2.5-flash-image';
  const imageBase64 = await fileToBase64(imageFile);

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageFile.type,
          },
        },
        {
          text: instruction,
        },
      ],
    },
  });

  // Extract image from response
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image generated in response.");
};