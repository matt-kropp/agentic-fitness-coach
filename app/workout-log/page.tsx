'use client';

import React from 'react';
import Header from '../components/Header';
import WorkoutLog from '../components/WorkoutLog';

export default function WorkoutLogPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-background">
        <div className="w-full max-w-6xl space-y-8">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 border">
            <h1 className="text-2xl font-semibold mb-4">Workout Log</h1>
            <p className="text-muted-foreground mb-4">
              Track your workouts including outdoor rides, Peloton rides, and strength training exercises.
            </p>
          </div>
          
          <WorkoutLog />
        </div>
      </main>
    </>
  );
}
