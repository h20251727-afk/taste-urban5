import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const query = req.body?.query;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `사용자가 다음 키워드를 검색했습니다: "${query}". 이 키워드와 관련된 '특정 지역(동네)'을 파악하고, 해당 지역에 위치한 실제 인기 맛집 4곳을 추천해주세요. 지역 이름이 검색어에 있다면 우선적으로 그 지역에 맞춰서 찾고, 만약 지역 없이 상황/메뉴만 있다면(예: '비오는 날 파전') 어울리는 구체적인 동네 하나를 임의로 선정하여 그 동네의 식당들로 모아서 추천해주세요. 특정한 식당 체인점(예: 스타벅스)이나 일반명사 대신 고유한 개성 있는 식당들을 추천하세요. 가상의 식당은 절대 만들지 마세요.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              signatureMenu: { type: Type.STRING },
              reason: { type: Type.STRING },
              location: { type: Type.STRING }
            },
            required: ["name", "category", "signatureMenu", "reason", "location"]
          },
        },
        temperature: 0.7,
      },
    });

    const jsonStr = response.text?.trim() || "[]";
    res.status(200).json(JSON.parse(jsonStr));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
}
