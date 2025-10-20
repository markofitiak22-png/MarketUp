import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glow';
  children: React.ReactNode;
  className?: string;
}

export default function Card({ 
  variant = 'default', 
  children, 
  className = '', 
  ...props 
}: CardProps) {
  const baseClasses = 'rounded-2xl';
  const variantClasses = {
    default: 'glass',
    elevated: 'glass-elevated',
    glow: 'glass-glow',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}