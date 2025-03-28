'use client';

import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

type WorkoutPlan = {
  [day: string]: {
    type: string;
    description: string;
    duration: string;
  }[];
};

export default function WorkoutCalendar({ workoutPlan }: { workoutPlan?: WorkoutPlan }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    return {
      date: day,
      dayName: format(day, 'EEEE'),
      dayOfMonth: format(day, 'd'),
      month: format(day, 'MMM'),
      isToday: isSameDay(day, new Date())
    };
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    setCurrentDate(addDays(currentDate, days));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Weekly Workout Plan</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateWeek('prev')}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMM d, yyyy')}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateWeek('next')}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day.dayName} className="text-center">
              <div className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center mb-1 ${
                day.isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
              }`}>
                {day.dayOfMonth}
              </div>
              <p className="text-xs font-medium">{day.dayName.substring(0, 3)}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 mt-4">
          {weekDays.map((day) => {
            const dayWorkouts = workoutPlan?.[day.dayName.toLowerCase()] || [];
            
            return (
              <div 
                key={`workout-${day.dayName}`} 
                className={`border rounded-md p-3 min-h-[120px] ${
                  day.isToday ? 'border-primary' : 'border-border'
                } hover:border-primary/50 transition-colors`}
              >
                {dayWorkouts.length > 0 ? (
                  <div className="space-y-2">
                    {dayWorkouts.map((workout, index) => (
                      <div key={index} className="space-y-1">
                        <p className="font-medium text-sm">{workout.type}</p>
                        <p className="text-xs text-muted-foreground">{workout.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {workout.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic flex items-center justify-center h-full">
                    No workouts scheduled
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
