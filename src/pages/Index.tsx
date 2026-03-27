import { useReviews } from '@/contexts/ReviewContext';
import SignInForm from '@/components/SignInForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { isSignedIn } = useReviews();
  return isSignedIn ? <Dashboard /> : <SignInForm />;
};

export default Index;
