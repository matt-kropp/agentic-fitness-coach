import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('dummy') 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const demoWorkoutPlan = `{
  "monday": [
    {
      "type": "Strength Training",
      "description": "Upper body focus: 3 sets of push-ups, dumbbell presses, and rows",
      "duration": "45 minutes"
    }
  ],
  "tuesday": [
    {
      "type": "Cardio",
      "description": "Cycling session (moderate intensity)",
      "duration": "30 minutes"
    }
  ],
  "wednesday": [
    {
      "type": "Rest",
      "description": "Active recovery - light stretching or yoga",
      "duration": "20 minutes"
    }
  ],
  "thursday": [
    {
      "type": "Strength Training",
      "description": "Lower body: Squats, lunges, and calf raises",
      "duration": "45 minutes"
    }
  ],
  "friday": [
    {
      "type": "Cardio",
      "description": "Peloton ride (high intensity intervals)",
      "duration": "30 minutes"
    }
  ],
  "saturday": [
    {
      "type": "Strength Training",
      "description": "Full body workout with emphasis on core",
      "duration": "60 minutes"
    }
  ],
  "sunday": [
    {
      "type": "Rest",
      "description": "Complete rest day or light walking",
      "duration": "As needed"
    }
  ]
}`;

export async function generateWorkoutPlan(
  goals: string,
  healthStatus: string,
  pastWorkouts: string,
  availability: string,
  additionalInfo: string = ''
) {
  if (!openai || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.log('Using demo workout plan');
    return demoWorkoutPlan;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional fitness coach. Create a detailed weekly workout plan based on the user\'s goals, health status, past workouts, and schedule availability. Format the response as a JSON object with days of the week as keys and workout details as values.'
        },
        {
          role: 'user',
          content: `Please create a weekly workout plan for me with the following information:
            Goals: ${goals}
            Current Health Status: ${healthStatus}
            Past Workouts: ${pastWorkouts}
            Schedule Availability: ${availability}
            Additional Information: ${additionalInfo}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw new Error('Failed to generate workout plan');
  }
}

const demoResponses = [
  "I'd recommend adding more strength training to help with your goals. How about we replace one cardio session with a strength workout?",
  "Based on your progress, I think we should increase the intensity of your workouts. Would you like to try some HIIT sessions?",
  "Your consistency is impressive! Let's add some variety to keep you motivated. How about trying a yoga session on your rest day?",
  "I notice you've been doing well with your workouts. Would you like to focus more on specific muscle groups or keep the full-body approach?",
  "Given your schedule constraints, I've adjusted your plan to include shorter, more intense workouts on busy days. Does that work for you?"
];

export async function chatWithCoach(messages: any[]) {
  if (!openai || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.log('Using demo chat response');
    const randomIndex = Math.floor(Math.random() * demoResponses.length);
    return {
      role: 'assistant',
      content: demoResponses[randomIndex]
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional fitness coach. Provide helpful, motivating, and personalized fitness advice based on the user\'s goals and needs. Be conversational but focused on fitness guidance.'
        },
        ...messages
      ]
    });

    return response.choices[0].message;
  } catch (error) {
    console.error('Error chatting with coach:', error);
    throw new Error('Failed to chat with fitness coach');
  }
}
