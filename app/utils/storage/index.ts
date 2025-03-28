
export type UserProfile = {
  goals: string;
  healthStatus: string;
  pastWorkouts: string;
  availability: string;
  additionalInfo?: string;
};

export type WorkoutPlan = {
  [day: string]: Array<{
    type: string;
    description: string;
    duration: string;
  }>;
};

export type WorkoutEntry = {
  id: string;
  date: string;
  type: 'outdoor-ride' | 'peloton-ride' | 'strength-training' | 'other';
  details: {
    duration?: string;
    distance?: string;
    weight?: number;
    reps?: number;
    sets?: number;
    exercise?: string;
    notes?: string;
  };
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

class Storage {
  private userProfile: UserProfile = {
    goals: 'Build strength and improve cardiovascular health',
    healthStatus: 'Generally healthy, no injuries',
    pastWorkouts: 'Regular cycling, occasional strength training',
    availability: 'Weekdays after 6pm, weekends mornings',
  };
  
  private workoutPlan: WorkoutPlan | null = null;
  private workoutEntries: WorkoutEntry[] = [];
  private chatHistory: ChatMessage[] = [];

  getUserProfile(): UserProfile {
    return { ...this.userProfile };
  }

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    this.userProfile = { ...this.userProfile, ...profile };
    return this.getUserProfile();
  }

  getWorkoutPlan(): WorkoutPlan | null {
    return this.workoutPlan ? { ...this.workoutPlan } : null;
  }

  setWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
    this.workoutPlan = { ...plan };
    return this.getWorkoutPlan() as WorkoutPlan;
  }

  getWorkoutEntries(): WorkoutEntry[] {
    return [...this.workoutEntries];
  }

  addWorkoutEntry(entry: Omit<WorkoutEntry, 'id'>): WorkoutEntry {
    const newEntry: WorkoutEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    this.workoutEntries = [newEntry, ...this.workoutEntries];
    return newEntry;
  }

  deleteWorkoutEntry(id: string): boolean {
    const initialLength = this.workoutEntries.length;
    this.workoutEntries = this.workoutEntries.filter(entry => entry.id !== id);
    return initialLength !== this.workoutEntries.length;
  }

  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  addChatMessage(message: ChatMessage): ChatMessage[] {
    this.chatHistory = [...this.chatHistory, message];
    return this.getChatHistory();
  }

  clearChatHistory(): void {
    this.chatHistory = [];
  }
}

const storage = new Storage();

export default storage;
