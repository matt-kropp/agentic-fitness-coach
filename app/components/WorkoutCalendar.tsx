'use client';

import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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
    return workoutPlan[key] || [];
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between pb-4">
        <h2 className="text-xl font-semibold">Weekly Workout Schedule</h2>
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <Card key={day.dayName} className={`border ${day.isToday ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="p-3">
              <CardTitle className="text-lg flex justify-between items-center">
                {day.dayName}
                <span className="text-sm bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center">
                  {day.dayOfMonth}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {getWorkoutsForDay(day.dayName).length > 0 ? (
                getWorkoutsForDay(day.dayName).map((workout: any, index: number) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <Badge variant="outline" className="mb-1">{workout.type}</Badge>
                    <div className="text-sm text-muted-foreground">{workout.description}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {workout.duration}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground flex items-center justify-center h-[80px]">
                  No workouts scheduled
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
