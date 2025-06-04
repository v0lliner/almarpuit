import React, { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up';
  delay?: 0 | 1 | 2 | 3;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  id,
  children,
  className = '',
  animation = 'fade',
  delay = 0,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getAnimationClass = () => {
    const baseClass = animation === 'slide-up' ? 'slide-up' : 'fade-in';
    const delayClass = delay > 0 ? `stagger-delay-${delay}` : '';
    const visibleClass = inView ? 'visible' : '';
    
    return `${baseClass} ${delayClass} ${visibleClass}`;
  };

  return (
    <section
      id={id}
      ref={ref}
      className={`section ${className} ${getAnimationClass()}`}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;