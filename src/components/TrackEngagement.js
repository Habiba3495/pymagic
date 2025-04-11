import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const TrackEngagement = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      ReactGA.event({
        category: 'Session',
        action: 'long_session',
        label: 'Over 60s',
      });
    }, 60000); // 1 minute
    return () => clearTimeout(timer);
  }, []);
  return null;
};

export default TrackEngagement;