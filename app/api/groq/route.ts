import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: 'You are a stand-up comedian. Return only a short, punchy one-sentence joke based on the user topic.',
        },
        {
          role: 'user',
          content: `Tell a joke about ${topic}`,
        },
      ],
      temperature: 0.7,
    });

    const punchline = completion.choices[0]?.message?.content || 'No joke found!';

    return NextResponse.json({ joke: punchline });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate joke' },
      { status: 500 }
    );
  }
}