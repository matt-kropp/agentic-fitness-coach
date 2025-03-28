'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import { UserProfile, WorkoutPlan } from './utils/storage/index';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Dumbbell, Clock } from 'lucide-react';

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

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = [...Array(7)].map((_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    return {
      date: day,
      dayName: format(day, 'EEEE'),
      dayOfMonth: format(day, 'd'),
      month: format(day, 'MMM'),
      isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
    };
  });

  const dayToKey: { [key: string]: string } = {
    'Monday': 'monday',
    'Tuesday': 'tuesday',
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday',
    'Saturday': 'saturday',
    'Sunday': 'sunday',
  };

  const getWorkoutsForDay = (dayName: string) => {
    if (!workoutPlan) return [];
    const key = dayToKey[dayName];
    return workoutPlan[key as keyof WorkoutPlan] || [];
  };

  const getWorkoutTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      'Strength Training': 'bg-blue-100 text-blue-800',
      'Cardio': 'bg-red-100 text-red-800',
      'Cycling': 'bg-green-100 text-green-800',
      'Peloton': 'bg-purple-100 text-purple-800',
      'Rest': 'bg-gray-100 text-gray-800',
      'Yoga': 'bg-yellow-100 text-yellow-800',
      'HIIT': 'bg-orange-100 text-orange-800',
    };
    
    return typeMap[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Profile Summary */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Weekly Workout Schedule</h1>
              <p className="text-gray-600 mb-4">
                Welcome to your personal AI fitness coach! Here&apos;s your weekly workout plan tailored to your goals and preferences.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1">
                  <span className="font-semibold mr-1">Goal:</span> {userProfile.goals}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1">
                  <span className="font-semibold mr-1">Health:</span> {userProfile.healthStatus}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={generateWorkoutPlan} disabled={isLoading} className="whitespace-nowrap">
                {isLoading ? 'Generating...' : 'Regenerate Plan'}
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/workout-log'} className="whitespace-nowrap">
                Log Workout
              </Button>
            </div>
          </div>

          {/* Week Header */}
          <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold">
                {format(startOfCurrentWeek, 'MMMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMMM d, yyyy')}
              </h2>
            </div>
          </div>

          {/* Weekly Schedule */}
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px] bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {weekDays.map((day) => (
                <div key={day.dayName} className={`${day.isToday ? 'bg-blue-50' : ''}`}>
                  {/* Day Header */}
                  <div className={`p-3 border-b border-gray-200 ${day.isToday ? 'bg-blue-100' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{day.dayName}</p>
                        <p className="text-xs text-gray-500">{day.month} {day.dayOfMonth}</p>
                      </div>
                      {day.isToday && (
                        <Badge className="bg-blue-500 text-white">Today</Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Workouts */}
                  <div className="p-3 h-full">
                    {getWorkoutsForDay(day.dayName).length > 0 ? (
                      <div className="space-y-3">
                        {getWorkoutsForDay(day.dayName).map((workout: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-md p-3 bg-white shadow-sm">
                            <Badge className={`mb-2 ${getWorkoutTypeColor(workout.type)}`}>
                              {workout.type}
                            </Badge>
                            <p className="text-sm mb-2">{workout.description}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {workout.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-gray-400">
                        <Dumbbell className="h-5 w-5 mb-1" />
                        <p className="text-sm">Rest day</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chat Section */}
          <Card className="mt-8 border shadow-sm">
            <CardHeader>
              <CardTitle>Chat with Your Fitness Coach</CardTitle>
              <CardDescription>
                Ask questions or request changes to your workout plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
