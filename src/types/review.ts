export type PerformanceRating = 'needs-improvement' | 'meets-expectations' | 'above-and-beyond';

export interface Review {
  id: string;
  type: 'staff' | 'leader' | 'self';
  employeeName: string;
  reviewerName: string;
  content: string;
  kudos: string;
  areasOfImprovement: string;
  rating: PerformanceRating;
  createdAt: Date;
}

export interface AISummary {
  overallRating: PerformanceRating;
  summary: string;
  strengths: string[];
  improvements: string[];
}
