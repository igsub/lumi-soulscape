import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
  const elementsRef = useRef<Map<Element, boolean>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const hasAnimated = elementsRef.current.get(element);
          
          if (entry.isIntersecting && !hasAnimated) {
            element.classList.add('animate');
            elementsRef.current.set(element, true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
      '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in'
    );
    
    animatedElements.forEach((element) => {
      observer.observe(element);
      elementsRef.current.set(element, false);
    });

    return () => {
      observer.disconnect();
      elementsRef.current.clear();
    };
  }, []);

  return null;
};