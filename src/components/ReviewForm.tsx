import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReviews } from '@/contexts/ReviewContext';
import { PerformanceRating, Review } from '@/types/review';
import { toast } from 'sonner';
import { Send, Award, TrendingUp } from 'lucide-react';

interface ReviewFormProps {
  type: 'staff' | 'leader' | 'self';
  title: string;
  description: string;
}

const ReviewForm = ({ type, title, description }: ReviewFormProps) => {
  const { addReview, userName } = useReviews();
  const [employeeName, setEmployeeName] = useState('');
  const [content, setContent] = useState('');
  const [kudos, setKudos] = useState('');
  const [areasOfImprovement, setAreasOfImprovement] = useState('');
  const [rating, setRating] = useState<PerformanceRating>('meets-expectations');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please write a review before submitting.');
      return;
    }

    const review: Review = {
      id: crypto.randomUUID(),
      type,
      employeeName: type === 'self' ? userName : employeeName,
      reviewerName: userName,
      content,
      kudos,
      areasOfImprovement,
      rating,
      createdAt: new Date(),
    };

    addReview(review);
    setContent('');
    setKudos('');
    setAreasOfImprovement('');
    setEmployeeName('');
    setRating('meets-expectations');
    toast.success('Review submitted successfully!');
  };

  const ratingOptions: { value: PerformanceRating; label: string; icon: React.ReactNode }[] = [
    { value: 'needs-improvement', label: 'Needs Improvement', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'meets-expectations', label: 'Meets Expectations', icon: <Award className="h-4 w-4" /> },
    { value: 'above-and-beyond', label: 'Above & Beyond', icon: <Award className="h-4 w-4 text-accent" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-display text-foreground">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {type !== 'self' && (
              <div className="space-y-2">
                <Label htmlFor={`employee-${type}`} className="font-medium text-foreground">
                  Employee Name
                </Label>
                <Input
                  id={`employee-${type}`}
                  placeholder="Enter employee's name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor={`review-${type}`} className="font-medium text-foreground">
                Review *
              </Label>
              <Textarea
                id={`review-${type}`}
                placeholder="Write your detailed review here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`kudos-${type}`} className="font-medium text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  Kudos (Optional)
                </Label>
                <Textarea
                  id={`kudos-${type}`}
                  placeholder="Highlight achievements and positive contributions..."
                  value={kudos}
                  onChange={(e) => setKudos(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`improvement-${type}`} className="font-medium text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Areas of Improvement (Optional)
                </Label>
                <Textarea
                  id={`improvement-${type}`}
                  placeholder="Suggest areas for growth and development..."
                  value={areasOfImprovement}
                  onChange={(e) => setAreasOfImprovement(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-foreground">Performance Rating</Label>
              <RadioGroup
                value={rating}
                onValueChange={(v) => setRating(v as PerformanceRating)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {ratingOptions.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`${type}-${option.value}`}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      rating === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`${type}-${option.value}`} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full h-11 font-semibold gap-2">
              <Send className="h-4 w-4" />
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewForm;
