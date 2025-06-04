import React, { ButtonHTMLAttributes } from 'react';
import { Link as ScrollLink } from 'react-scroll';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  to?: string; // For scroll links
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  to,
  ...props
}) => {
  const baseClasses = variant === 'primary' 
    ? 'btn-primary' 
    : variant === 'secondary' 
      ? 'btn-secondary' 
      : 'btn-outline';
  
  if (to) {
    return (
      <ScrollLink
        to={to}
        spy={true}
        smooth={true}
        offset={-80}
        duration={500}
        className={`${baseClasses} inline-block cursor-pointer ${className}`}
      >
        {children}
      </ScrollLink>
    );
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;