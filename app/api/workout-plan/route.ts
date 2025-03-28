import { NextResponse } from 'next/server';
import { generateWorkoutPlan } from '../../utils/openai';

export async function POST(request: Request) {
  try {
    const { goals, healthStatus, pastWorkouts, availability, additionalInfo } = await request.json();
    
    if (!goals || !healthStatus || !availability) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const workoutPlan = await generateWorkoutPlan(
      goals,
      healthStatus,
      pastWorkouts || '',
      availability,
      additionalInfo || ''
    );

    return NextResponse.json({ workoutPlan });
  } catch (error) {
    console.error('Error in workout plan API:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}
