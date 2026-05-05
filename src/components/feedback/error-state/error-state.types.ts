export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  error?: Error | null;
  size?: 'default' | 'compact';
  className?: string;
}
