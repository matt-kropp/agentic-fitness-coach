'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WorkoutCalendar from './components/WorkoutCalendar';
import ChatInterface from './components/ChatInterface';
import { UserProfile, WorkoutPlan } from './utils/storage/index';

export default function Home() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    goals: 'Build strength and improve cardiovascular health',
    healthStatus: 'Generally healthy, no injuries',
    pastWorkouts: 'Regular cycling, occasional strength training',
    availability: 'Weekdays after 6pm, weekends mornings',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchWorkoutPlan();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/storage?resource=profile');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setUserProfile(data.profile);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchWorkoutPlan = async () => {
    try {
      const response = await fetch('/api/storage?resource=workout-plan');
      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          setWorkoutPlan(data.plan);
          return;
        }
      }
      generateWorkoutPlan();
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      generateWorkoutPlan();
    }
  };

  const generateWorkoutPlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/workout-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to generate workout plan');
      }

      const data = await response.json();
      const plan = JSON.parse(data.workoutPlan);
      setWorkoutPlan(plan);
      
      await fetch('/api/storage?resource=workout-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-background">
        <div className="w-full max-w-6xl space-y-8">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 border">
            <h1 className="text-3xl font-bold mb-4">Your Fitness Dashboard</h1>
            <p className="text-lg mb-6">
              Welcome to your personal AI fitness coach! Here's your weekly workout plan based on your goals and preferences.
            </p>
            
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Goal: {userProfile.goals}
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Health: {userProfile.healthStatus}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-card text-card-foreground rounded-lg shadow-sm border flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <WorkoutCalendar workoutPlan={workoutPlan || undefined} />
              )}
            </div>
            <div className="lg:col-span-1">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
