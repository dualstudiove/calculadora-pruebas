import { GoogleGenAI, Type } from "@google/genai";

export async function extractPricesFromImage(base64Image: string, mimeType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API key no configurada. Por favor, añade GEMINI_API_KEY en las variables de entorno.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: "Extrae la fecha de actualización de precios (si es visible) y la lista de exámenes con sus nombres y precios. Devuelve un objeto JSON con la fecha en formato DD/MM/YYYY (o null si no se encuentra) y un array de exámenes con 'name' y 'price'.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: "Fecha de actualización de precios en formato DD/MM/YYYY, o null si no se encuentra.",
            nullable: true,
          },
          exams: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "Nombre del examen",
                },
                price: {
                  type: Type.NUMBER,
                  description: "Precio del examen",
                },
              },
              required: ["name", "price"],
            },
            description: "Lista de exámenes extraídos",
          },
        },
        required: ["exams"],
      },
    },
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr) as { date: string | null; exams: { name: string; price: number }[] };
}
