import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-md';
  const variants = {
    primary: 'bg-[#131416] text-white hover:bg-[#2c2d30]',
    secondary: 'bg-[#f4f6f8] text-[#131416] hover:bg-[#ebedee] border border-[#e8eaec]',
    danger: 'bg-[#c4242a] text-white hover:bg-[#a31c22]',
    outline: 'border border-[#e8eaec] bg-white text-[#131416] hover:bg-[#f9fbfc]',
  };
  const sizes = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-xs px-3.5 py-2',
    lg: 'text-sm px-4 py-2.5',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};
