import { NextResponse } from 'next/server';
import storage from '../../utils/storage';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  try {
    switch (resource) {
      case 'profile':
        return NextResponse.json({ profile: storage.getUserProfile() });
      case 'workout-plan':
        return NextResponse.json({ plan: storage.getWorkoutPlan() });
      case 'workouts':
        return NextResponse.json({ workouts: storage.getWorkoutEntries() });
      case 'chat-history':
        return NextResponse.json({ messages: storage.getChatHistory() });
      default:
        return NextResponse.json(
          { error: 'Invalid resource requested' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in storage API:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  try {
    const body = await request.json();

    switch (resource) {
      case 'profile':
        const updatedProfile = storage.updateUserProfile(body.profile);
        return NextResponse.json({ profile: updatedProfile });
      
      case 'workout-plan':
        if (!body.plan) {
          return NextResponse.json(
            { error: 'Missing plan data' },
            { status: 400 }
          );
        }
        const updatedPlan = storage.setWorkoutPlan(body.plan);
        return NextResponse.json({ plan: updatedPlan });
      
      case 'workout':
        if (!body.workout) {
          return NextResponse.json(
            { error: 'Missing workout data' },
            { status: 400 }
          );
        }
        const newWorkout = storage.addWorkoutEntry(body.workout);
        return NextResponse.json({ workout: newWorkout });
      
      case 'chat-message':
        if (!body.message) {
          return NextResponse.json(
            { error: 'Missing message data' },
            { status: 400 }
          );
        }
        const updatedHistory = storage.addChatMessage(body.message);
        return NextResponse.json({ messages: updatedHistory });
      
      default:
        return NextResponse.json(
          { error: 'Invalid resource requested' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in storage API:', error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');
  const id = searchParams.get('id');

  try {
    if (resource === 'workout' && id) {
      const success = storage.deleteWorkoutEntry(id);
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: 'Workout not found' },
          { status: 404 }
        );
      }
    } else if (resource === 'chat-history') {
      storage.clearChatHistory();
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid resource or missing ID' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in storage API:', error);
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
