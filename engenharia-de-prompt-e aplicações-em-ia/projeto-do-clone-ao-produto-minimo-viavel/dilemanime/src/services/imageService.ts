/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ScenarioSide } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateScenarioImage(side: ScenarioSide, label: string): Promise<string | null> {
  const charactersList = side.characters.join(", ");
  
  const prompt = `Anime style illustration from the first-person perspective of a driver inside an autonomous vehicle. 
    View through the windshield looking at the road ahead.
    ${label}: A group of pedestrians (${charactersList}) are crossing the street directly in front of the car. 
    The dashboard and steering wheel are partially visible at the bottom of the frame.
    Style: High-quality anime art, clean line art, vibrant colors, cinematic lighting, detailed urban background. 
    Color palette: Vibrant and expressive. 
    No text in the image. 2D aesthetic, professional anime studio quality.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating scenario image:", error);
    return null;
  }
}
