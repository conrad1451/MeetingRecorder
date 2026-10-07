import React from 'react';
import { ButtonProps } from './Button.types';
import './Button.css';

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}) => (
  <button
    className={`btn btn-${variant} btn-${size} ${className}`}
    {...props}
  >
    {children}
  </button>
);
