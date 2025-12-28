import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateEventDescription = async (keywords: string): Promise<string> => {
  if (!API_KEY) {
    return "AI機能を利用するにはAPIキーの設定が必要です。";
  }
  try {
    const prompt = `以下のキーワードを基に、日本のマルシェ（市場）イベントの魅力的で心温まる説明文を150字程度で作成してください。若者や家族連れが参加したくなるような、楽しげな雰囲気を表現してください。
キーワード: 「${keywords}」`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating event description:", error);
    return "説明文の生成中にエラーが発生しました。";
  }
};

export const generateServiceDescription = async (keywords: string): Promise<string> => {
    if (!API_KEY) {
        return "AI機能を利用するにはAPIキーの設定が必要です。";
    }
    try {
        const prompt = `以下のキーワードを基に、スキルマーケットに出品するサービスの魅力的で分かりやすい説明文を150字程度で作成してください。顧客が安心して依頼したくなるような、プロフェッショナルで信頼感のある文章を心がけてください。
キーワード: 「${keywords}」`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating service description:", error);
        return "説明文の生成中にエラーが発生しました。";
    }
};