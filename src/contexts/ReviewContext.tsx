import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from '@/types/review';

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Review) => void;
  isSignedIn: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
  userName: string;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const addReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
  };

  const signIn = (email: string) => {
    setUserName(email.split('@')[0]);
    setIsSignedIn(true);
  };

  const signOut = () => {
    setIsSignedIn(false);
    setUserName('');
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, isSignedIn, signIn, signOut, userName }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReviews must be used within ReviewProvider');
  return context;
};
