import { useState, useEffect, useCallback } from 'react';
import { portfolioContent as defaultContent } from '../data/portfolioContent.js';

const STORAGE_KEY = 'nia_portfolio_custom_data';
const EVENT_KEY = 'nia_portfolio_data_updated';

// Helper to get initial stored data safely
export function getStoredPortfolioData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultContent,
        ...parsed,
        // Always ensure latest tech stack definitions from defaultContent take effect
        techStackCategories: defaultContent.techStackCategories,
        educationHistory: defaultContent.educationHistory,
        // Preserve assets / objects that shouldn't be overridden if missing
        profilePhoto: parsed.profilePhoto || defaultContent.profilePhoto,
        aboutPhoto: parsed.aboutPhoto || defaultContent.aboutPhoto,
        techIconMap: defaultContent.techIconMap,
      };
    }
  } catch (e) {
    console.warn('Failed to parse portfolio data from localStorage:', e);
  }
  return defaultContent;
}

// Helper to save data to localStorage and sync to Cloud Database asynchronously
export async function savePortfolioData(newData) {
  let localSaved = false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: newData }));
    localSaved = true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  // Attempt sync to Cloud Database (/api/portfolio)
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    const json = await res.json();
    if (json.success) {
      return {
        success: true,
        cloudSaved: true,
        message: 'Perubahan berhasil disimpan ke Cloud Database & Browser! 🎉',
      };
    } else {
      return {
        success: localSaved,
        cloudSaved: false,
        message: json.message || 'Tersimpan di browser lokal.',
      };
    }
  } catch (err) {
    return {
      success: localSaved,
      cloudSaved: false,
      message: 'Tersimpan di browser lokal.',
    };
  }
}

// Helper to reset to default static data
export function resetPortfolioData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: defaultContent }));
    return true;
  } catch (e) {
    console.error('Failed to reset portfolio data:', e);
    return false;
  }
}

// Helper to export current data as JSON file download
export function exportPortfolioDataJSON(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to generate JS code formatted for portfolioContent.js
export function generatePortfolioContentJS(data) {
  // Exclude functions and cycle references, format nicely
  const sanitized = { ...data };
  delete sanitized.techIconMap; // keep icon imports separate
  
  return `// Generated from Admin Dashboard on ${new Date().toLocaleString()}
import profilePhoto from '../assets/projects/FotoNia.png';

export const portfolioContent = ${JSON.stringify(sanitized, null, 2)};
`;
}

export const usePortfolioData = () => {
  const [content, setContent] = useState(() => getStoredPortfolioData());
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ? 'localStorage' : 'local';
  });

  // Re-sync whenever localStorage changes across components
  useEffect(() => {
    const handleDataUpdate = (e) => {
      if (e.detail) {
        setContent(e.detail);
        setSource('localStorage');
      } else {
        setContent(getStoredPortfolioData());
      }
    };

    window.addEventListener(EVENT_KEY, handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  // Check API if available and user hasn't overridden with localStorage
  useEffect(() => {
    let isMounted = true;

    async function fetchFromApi() {
      // If user has local edits, prioritize them unless requested
      const hasLocalCustom = !!localStorage.getItem(STORAGE_KEY);
      if (hasLocalCustom) {
        setLoading(false);
        return;
      }

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
            profilePhoto: json.data.profilePhoto || prev.profilePhoto,
            aboutPhoto: json.data.aboutPhoto || prev.aboutPhoto,
            techIconMap: prev.techIconMap,
          }));
          setSource('database');
        }
      } catch (err) {
        // Silently fallback to static portfolioContent.js / localStorage
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

  const updateContent = useCallback((newData) => {
    setContent(newData);
    savePortfolioData(newData);
    setSource('localStorage');
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultContent);
    resetPortfolioData();
    setSource('local');
  }, []);

  return { 
    content, 
    loading, 
    source, 
    updateContent, 
    resetContent,
    defaultContent 
  };
};
