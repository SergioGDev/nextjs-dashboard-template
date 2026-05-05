export interface EmptyStateProps {
  variant?: 'default' | 'search' | 'error';
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}
