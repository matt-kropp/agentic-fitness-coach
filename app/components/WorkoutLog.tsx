'use client';

import React, { useState, useEffect } from 'react';
import { WorkoutEntry } from '../utils/storage/index';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Plus, X, Calendar, Clock, MapPin, Dumbbell } from 'lucide-react';

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [workoutType, setWorkoutType] = useState<WorkoutEntry['type']>('outdoor-ride');
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState<number | undefined>();
  const [reps, setReps] = useState<number | undefined>();
  const [sets, setSets] = useState<number | undefined>();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/storage?resource=workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWorkout: Omit<WorkoutEntry, 'id'> = {
      date,
      type: workoutType,
      details: {
        duration,
        notes
      }
    };
    
    if (workoutType === 'outdoor-ride' || workoutType === 'peloton-ride') {
      newWorkout.details.distance = distance;
    } else if (workoutType === 'strength-training') {
      newWorkout.details.exercise = exercise;
      newWorkout.details.weight = weight;
      newWorkout.details.reps = reps;
      newWorkout.details.sets = sets;
    }
    
    try {
      const response = await fetch('/api/storage?resource=workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workout: newWorkout }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkouts(prev => [data.workout, ...prev]);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };
  
  const resetForm = () => {
    setShowForm(false);
    setWorkoutType('outdoor-ride');
    setDuration('');
    setDistance('');
    setExercise('');
    setWeight(undefined);
    setReps(undefined);
    setSets(undefined);
    setNotes('');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Workout Log</CardTitle>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
          className="flex items-center gap-1"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Workout
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        {showForm && (
          <Card className="mb-8 border">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workout Type</label>
                    <select
                      value={workoutType}
                      onChange={(e) => setWorkoutType(e.target.value as WorkoutEntry['type'])}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="outdoor-ride">Outdoor Ride</option>
                      <option value="peloton-ride">Peloton Ride</option>
                      <option value="strength-training">Strength Training</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 45"
                      required
                    />
                  </div>
                  
                  {(workoutType === 'outdoor-ride' || workoutType === 'peloton-ride') && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Distance (miles/km)</label>
                      <Input
                        type="text"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g., 10 miles"
                      />
                    </div>
                  )}
                  
                  {workoutType === 'strength-training' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Exercise</label>
                        <Input
                          type="text"
                          value={exercise}
                          onChange={(e) => setExercise(e.target.value)}
                          placeholder="e.g., Bench Press"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Weight (lbs/kg)</label>
                        <Input
                          type="number"
                          value={weight || ''}
                          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g., 135"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reps</label>
                        <Input
                          type="number"
                          value={reps || ''}
                          onChange={(e) => setReps(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g., 10"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sets</label>
                        <Input
                          type="number"
                          value={sets || ''}
                          onChange={(e) => setSets(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g., 3"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mb-4 space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any additional notes about your workout..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Save Workout
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workouts logged yet. Add your first workout to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center gap-1">
                        {workout.type === 'outdoor-ride' ? (
                          <>
                            <MapPin className="h-4 w-4 text-primary" /> Outdoor Ride
                          </>
                        ) : workout.type === 'peloton-ride' ? (
                          <>
                            <MapPin className="h-4 w-4 text-primary" /> Peloton Ride
                          </>
                        ) : workout.type === 'strength-training' ? (
                          <>
                            <Dumbbell className="h-4 w-4 text-primary" /> Strength: {workout.details.exercise}
                          </>
                        ) : (
                          'Other Workout'
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" /> {new Date(workout.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" /> {workout.details.duration} minutes
                      </p>
                      {(workout.type === 'outdoor-ride' || workout.type === 'peloton-ride') && 
                        workout.details.distance && (
                          <p className="text-sm text-muted-foreground mt-1">{workout.details.distance}</p>
                        )}
                    </div>
                  </div>
                  
                  {workout.type === 'strength-training' && (
                    <div className="mt-2 text-sm border-t pt-2">
                      <p className="flex items-center gap-1">
                        <Dumbbell className="h-3 w-3 text-muted-foreground" />
                        {workout.details.sets && workout.details.reps ? 
                          `${workout.details.sets} sets × ${workout.details.reps} reps` : ''}
                        {workout.details.weight ? ` @ ${workout.details.weight} lbs` : ''}
                      </p>
                    </div>
                  )}
                  
                  {workout.details.notes && (
                    <div className="mt-2 text-sm text-muted-foreground border-t pt-2">
                      <p>{workout.details.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
