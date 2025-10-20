import { HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export default function Section({ 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: SectionProps) {
  const sizeClasses = {
    sm: 'section-sm',
    md: 'section',
    lg: 'section-lg',
  };

  return (
    <section
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}