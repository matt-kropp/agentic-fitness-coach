'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:opacity-90 transition-opacity">
          Fitness Coach
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost"
          size="icon"
          className="md:hidden text-primary-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className="font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/chat" 
            className="font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Chat
          </Link>
          <Link 
            href="/workout-log" 
            className="font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Workout Log
          </Link>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 flex flex-col space-y-4 px-2 py-3 bg-primary/95 rounded-md">
          <Link 
            href="/" 
            className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/chat" 
            className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Chat
          </Link>
          <Link 
            href="/workout-log" 
            className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Workout Log
          </Link>
        </nav>
      )}
    </header>
  );
}
