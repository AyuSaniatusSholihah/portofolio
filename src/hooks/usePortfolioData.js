import { useState, useEffect } from 'react';
import { portfolioContent as defaultContent } from '../data/portfolioContent.js';

export const usePortfolioData = () => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('local'); // 'local' | 'database'

  useEffect(() => {
    let isMounted = true;

    async function fetchFromApi() {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (json.success && json.data && isMounted) {
          setContent((prev) => ({
            ...prev,
            ...json.data,
            // Preserve icon map & local photo if needed
            profilePhoto: json.data.profilePhoto || prev.profilePhoto,
            techIconMap: prev.techIconMap,
          }));
          setSource('database');
        }
      } catch (err) {
        // Silently fallback to static portfolioContent.js
        console.info('Using local portfolio data fallback.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFromApi();

    return () => {
      isMounted = false;
    };
  }, []);

  return { content, loading, source };
};
