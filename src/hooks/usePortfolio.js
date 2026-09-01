import { useEffect, useState } from 'react';

export const usePortfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);
  const [expandedExp, setExpandedExp] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      // Use standard scrollIntoView which naturally respects CSS scroll-mt-28
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return {
    activeSection,
    expandedExp,
    isVisible,
    scrollToSection,
    setExpandedExp,
  };
};