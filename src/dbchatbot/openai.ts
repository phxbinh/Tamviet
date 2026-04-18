import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // Model rẻ và hiệu quả nhất 2026
    input: text,
    encoding_format: "float",
  });

  return response.data[0].embedding; // Trả về mảng 1536 số thực
}
