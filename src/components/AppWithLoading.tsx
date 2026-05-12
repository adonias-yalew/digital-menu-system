import { useLoading } from '@/contexts/LoadingContext';
import LoadingPage from './LoadingPage';

interface AppWithLoadingProps {
  children: React.ReactNode;
}

export default function AppWithLoading({ children }: AppWithLoadingProps) {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}
