// Hook data portofolio langsung dari data frontend statis (portfolioContent.js)
import { portfolioContent } from '../data/portfolioContent.js';

export const usePortfolioData = () => {
  return {
    content: portfolioContent,
    loading: false,
    defaultContent: portfolioContent,
  };
};

export { portfolioContent };
