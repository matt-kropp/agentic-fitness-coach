import { NextResponse } from 'next/server';
import { chatWithCoach } from '../../utils/openai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid messages' },
        { status: 400 }
      );
    }

    const response = await chatWithCoach(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to chat with fitness coach' },
      { status: 500 }
    );
  }
}
