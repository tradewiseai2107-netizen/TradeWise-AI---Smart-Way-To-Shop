import { GoogleGenAI, Type } from "@google/genai";
import type { Product, BuyingOption } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const productSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The full brand and model name of the electronic device.",
      },
      category: {
        type: Type.STRING,
        description: "The category of the electronic device (e.g., Laptop, Smartphone, Camera, Headphones).",
      },
      key_specs: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "An array of 3-5 most important technical specifications relevant to the user's query.",
      },
      reasoning: {
        type: Type.STRING,
        description: "A brief, one or two-sentence explanation of why this product is a good match for the user's request.",
      },
      estimated_price: {
        type: Type.STRING,
        description: "The estimated retail price in Indian Rupees (INR), formatted as '₹XXXX'.",
      },
    },
    required: ["name", "category", "key_specs", "reasoning", "estimated_price"],
  },
};

export const fetchProductSuggestions = async (query: string): Promise<Product[]> => {
  const prompt = `
    You are "TradeWise AI", an expert electronics shopping assistant.
    A user is looking for an electronic device. Based on their query, recommend 3 to 6 suitable products.
    The estimated price must be in Indian Rupees (INR).
    For each product, provide its name, category, key specifications, a brief reason for the recommendation, and an estimated price.
    User Query: "${query}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: productSchema,
      },
    });

    const jsonText = response.text.trim();
    const products: Product[] = JSON.parse(jsonText);
    return products;
  } catch (error) {
    console.error("Error fetching product suggestions:", error);
    throw new Error("Failed to get suggestions from AI. The model may have returned an invalid format.");
  }
};

export const generateProductImage = async (productName: string): Promise<string> => {
    const prompt = `Generate a professional, high-fidelity studio product photograph of the following electronic device: ${productName}. 
    The device should be the central focus, angled slightly. The background should be a clean, minimalist, light gray gradient. 
    The lighting should be soft and even, highlighting the product's design and materials. No text or logos in the background.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '4:3',
            },
        });
    
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating product image:", error);
        throw new Error("Failed to generate product image.");
    }
};

export const findBuyingOptions = async (productName: string): Promise<BuyingOption[]> => {
    const prompt = `Based on the product name "${productName}", find the official product page or links to major online retailers where this product can be purchased. Use Google Search to find this information.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (!chunks || chunks.length === 0) {
            return [];
        }

        const options: BuyingOption[] = chunks
            .map((chunk: any) => {
                if (chunk.web && chunk.web.uri && chunk.web.title) {
                    return {
                        uri: chunk.web.uri,
                        title: chunk.web.title,
                    };
                }
                return null;
            })
            .filter((option): option is BuyingOption => option !== null)
            // Deduplicate based on URI
            .filter((value, index, self) => 
                index === self.findIndex((t) => t.uri === value.uri)
            );

        return options.slice(0, 3); // Return max 3 options
    } catch (error) {
        console.error(`Error finding buying options for ${productName}:`, error);
        throw new Error("Failed to find buying options.");
    }
};
