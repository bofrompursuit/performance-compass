import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReviews } from '@/contexts/ReviewContext';
import { AISummary as AISummaryType, PerformanceRating } from '@/types/review';
import { toast } from 'sonner';
import { Brain, Sparkles, TrendingUp, Award, AlertTriangle } from 'lucide-react';

const ratingLabel: Record<PerformanceRating, string> = {
  'needs-improvement': 'Needs Improvement',
  'meets-expectations': 'Meets Expectations',
  'above-and-beyond': 'Above & Beyond',
};

const ratingColor: Record<PerformanceRating, string> = {
  'needs-improvement': 'bg-destructive text-destructive-foreground',
  'meets-expectations': 'bg-primary text-primary-foreground',
  'above-and-beyond': 'bg-accent text-accent-foreground',
};

const AISummary = () => {
  const { reviews } = useReviews();
  const [summary, setSummary] = useState<AISummaryType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = () => {
    if (reviews.length < 2) {
      toast.error('At least 2 reviews are required to generate a summary.');
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const ratings = reviews.map(r => r.rating);
      const ratingScores: Record<PerformanceRating, number> = {
        'needs-improvement': 1,
        'meets-expectations': 2,
        'above-and-beyond': 3,
      };

      const avgScore = ratings.reduce((sum, r) => sum + ratingScores[r], 0) / ratings.length;

      let overallRating: PerformanceRating;
      if (avgScore < 1.5) overallRating = 'needs-improvement';
      else if (avgScore < 2.5) overallRating = 'meets-expectations';
      else overallRating = 'above-and-beyond';

      const strengths = reviews
        .filter(r => r.kudos.trim())
        .map(r => r.kudos);
      const improvements = reviews
        .filter(r => r.areasOfImprovement.trim())
        .map(r => r.areasOfImprovement);

      const reviewSummaries = reviews.map(r =>
        `${r.reviewerName} (${r.type} review): "${r.content}" — rated ${ratingLabel[r.rating]}`
      ).join('. ');

      setSummary({
        overallRating,
        summary: `Based on ${reviews.length} reviews, the employee demonstrates consistent performance. ${reviewSummaries}. The consensus points toward a rating of "${ratingLabel[overallRating]}".`,
        strengths: strengths.length > 0 ? strengths : ['No specific kudos provided yet.'],
        improvements: improvements.length > 0 ? improvements : ['No specific improvement areas noted.'],
      });

      setIsGenerating(false);
      toast.success('AI Summary generated!');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-display text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Summary
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aggregates all submitted reviews and produces a final performance assessment.
            Requires at least 2 reviews.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
            <div>
              <p className="text-sm font-medium text-foreground">
                Total Reviews: <span className="font-bold text-primary">{reviews.length}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {reviews.filter(r => r.type === 'staff').length} Staff · {reviews.filter(r => r.type === 'leader').length} Leader · {reviews.filter(r => r.type === 'self').length} Self
              </p>
            </div>
            <Button
              onClick={generateSummary}
              disabled={isGenerating || reviews.length < 2}
              className="gap-2 font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Analyzing...' : 'Generate Summary'}
            </Button>
          </div>

          {isGenerating && (
            <div className="flex flex-col items-center py-12 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <Brain className="h-12 w-12 text-primary" />
              </motion.div>
              <p className="text-muted-foreground font-medium">AI is analyzing reviews...</p>
            </div>
          )}

          {summary && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center py-6 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground mb-2">Overall Performance Rating</p>
                <Badge className={`text-lg px-6 py-2 ${ratingColor[summary.overallRating]}`}>
                  {ratingLabel[summary.overallRating]}
                </Badge>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{summary.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-accent" />
                    Strengths & Kudos
                  </h3>
                  <ul className="space-y-2">
                    {summary.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {summary.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {!summary && !isGenerating && reviews.length < 2 && (
            <div className="flex flex-col items-center py-12 gap-3 text-center">
              <AlertTriangle className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Submit at least 2 reviews across any tab to enable AI summarization.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {reviews.length > 0 && (
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-display text-foreground">Submitted Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg border border-border flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize">{review.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        by {review.reviewerName} · {review.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground truncate">{review.content}</p>
                  </div>
                  <Badge className={`shrink-0 text-xs ${ratingColor[review.rating]}`}>
                    {ratingLabel[review.rating]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AISummary;
