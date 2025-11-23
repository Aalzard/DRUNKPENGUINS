import { GoogleGenAI } from "@google/genai";
import { Game, User } from '../types';
import { USERS } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSquadVerdict = async (game: Game): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  const ratingSummary = Object.values(game.ratings).map(rating => {
    const user = USERS.find(u => u.id === rating.userId);
    const userName = user ? user.name : 'Unknown Player';
    
    let details = `${userName} gave it a total of ${rating.totalScore}/10.\n`;
    Object.entries(rating.ratings).forEach(([cat, val]) => {
      details += `  - ${cat}: ${val.score}/2. Comment: "${val.comment || 'No comment'}"\n`;
    });
    return details;
  }).join('\n');

  if (!ratingSummary) {
    return "Not enough data to form a verdict yet.";
  }

  const prompt = `
    You are a sarcastic, knowledgeable gaming journalist AI for a group of 4 friends.
    Analyze the following reviews for the game "${game.name}".
    
    Here is the data:
    ${ratingSummary}

    Provide a "Squad Verdict". Keep it under 100 words. 
    Highlight where they agreed or disagreed. Be witty.
    Format as plain text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate verdict.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error contacting the AI mainframe.";
  }
};

export const enhanceGameDescription = async (gameName: string): Promise<string> => {
  if (!apiKey) return "";

  const prompt = `Write a 1-sentence hype summary for the video game "${gameName}". Do not include quotes.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};