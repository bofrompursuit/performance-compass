import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/contexts/ReviewContext';
import ReviewForm from '@/components/ReviewForm';
import AISummary from '@/components/AISummary';
import { LogOut, Users, UserCheck, User, Brain } from 'lucide-react';

const Dashboard = () => {
  const { signOut, userName } = useReviews();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold text-foreground">P2P</h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">Performance to Potential</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hi, <span className="font-semibold text-foreground">{userName}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground">Peer Review Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Submit and manage performance reviews across multiple perspectives.
            </p>
          </div>

          <Tabs defaultValue="staff" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg h-12">
              <TabsTrigger value="staff" className="gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Staff</span>
              </TabsTrigger>
              <TabsTrigger value="leader" className="gap-2 text-sm">
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Leader</span>
              </TabsTrigger>
              <TabsTrigger value="self" className="gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Own Review</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2 text-sm">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Summary</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="staff">
              <ReviewForm
                type="staff"
                title="Staff Review"
                description="Provide peer feedback for a fellow team member."
              />
            </TabsContent>

            <TabsContent value="leader">
              <ReviewForm
                type="leader"
                title="Leader Review"
                description="Submit a review as a team lead or manager."
              />
            </TabsContent>

            <TabsContent value="self">
              <ReviewForm
                type="self"
                title="Own Review (Self-Assessment)"
                description="Reflect on your own performance and contributions."
              />
            </TabsContent>

            <TabsContent value="ai">
              <AISummary />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
