import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 30, className = '' }) => {
  return <Loader2 className={`animate-spin text-[#1DAFA1] ${className}`} size={size} />;
};

export default LoadingSpinner;
