import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const TrackInactivity = () => {
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        ReactGA.event({
          category: 'Session',
          action: 'inactive',
          label: window.location.pathname,
          value: 30,
        });
      }, 30000); // 30 seconds of inactivity
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  }, []);

  return null;
};

export default TrackInactivity;