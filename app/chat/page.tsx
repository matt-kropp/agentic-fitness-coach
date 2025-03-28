'use client';

import React from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';

export default function ChatPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-background">
        <div className="w-full max-w-4xl space-y-8">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 border">
            <h1 className="text-2xl font-semibold mb-4">Chat with Your Fitness Coach</h1>
            <p className="text-muted-foreground mb-4">
              Discuss your fitness goals, ask for workout advice, or request changes to your weekly plan.
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </main>
    </>
  );
}
