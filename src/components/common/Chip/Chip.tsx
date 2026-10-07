/* CHQ: Claude AI (Haiku) generated this file */

import React from 'react';
import { ChipProps } from './Chip.types';
import './Chip.css';

export const Chip: React.FC<ChipProps> = ({
  icon,
  title,
  subtitle,
  active,
  disabled,
  onChange,
}) => (
  <button
    className={`chip ${active ? 'on' : ''}`}
    disabled={disabled}
    onClick={() => onChange(!active)}
  >
    <span className="ic">{icon}</span>
    <span>
      <b>{title}</b>
      <small>{subtitle}</small>
    </span>
  </button>
);
