import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Dementia Cognitive Assessment Insights (AI Functionality)
    if (body.type === "assessment_insight" || body.sessionData) {
      const { sessionData, playerName, recentTrend } = body;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate cognitive health assistant supporting caregivers of older adults.
Analyze the user's game activity objectively and warmly.
Strict Rule: OBSERVE, DO NOT DIAGNOSE. Never issue a medical diagnosis or say "cognitive decline".
Focus on engagement, consistency, accuracy patterns, and offer warm encouragement. Keep the response under 100 words.`,
          },
          {
            role: 'user',
            content: `Player: ${playerName || "Sarah"}
Session Performance: ${JSON.stringify(sessionData || {})}
Recent Trend: ${JSON.stringify(recentTrend || {})}
Please provide a brief, reassuring clinical-style summary for the caregiver.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 250,
      });

      const insight = completion.choices[0]?.message?.content || "Activity completed with strong engagement.";
      return NextResponse.json({ success: true, insight });
    }

    // 2. Topic / Joke mode (Preserving existing demo functionality)
    const { topic } = body;
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic or sessionData is required' },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a warm, gentle comedian suitable for seniors. Return only a short, punchy one-sentence joke based on the user topic.',
        },
        {
          role: 'user',
          content: `Tell a clean, uplifting joke about ${topic}`,
        },
      ],
      temperature: 0.7,
    });

    const punchline = completion.choices[0]?.message?.content || 'No joke found!';
    return NextResponse.json({ joke: punchline });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}