import React from 'react';
import { CardProps } from './Card.types';
import './Card.css';

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
);
