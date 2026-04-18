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
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    activeSection,
    expandedExp,
    isVisible,
    scrollToSection,
    setExpandedExp,
  };
};