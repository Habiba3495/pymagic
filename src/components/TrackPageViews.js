import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import trackEvent from '../utils/trackEvent';

const TrackPageViews = ({ userId, user }) => {
  const location = useLocation();

  useEffect(() => {
    if (!user || !userId) {
      console.log('No user or userId, skipping page view tracking');
      return;
    }
    trackEvent(userId, 'pageview', { page: location.pathname }, user);
  }, [location, userId, user]);

  return null;
};

export default TrackPageViews;