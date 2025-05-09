import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import trackEvent from '../utils/trackEvent';

const TrackPageViews = ({ userId, user }) => {
  const location = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    const currentPath = location.pathname;

    // منع الإرسال لو مفيش userId أو user
    if (!userId || !user || currentPath === lastPath.current) {
      return;
    }

    const eventData = {
      page: currentPath,
      category: 'Navigation',
      referrer: lastPath.current,
    };

    trackEvent(userId, 'pageview', eventData, user);
    lastPath.current = currentPath;
  }, [location.pathname, userId, user]); // استخدمنا location.pathname بس

  return null;
};

export default TrackPageViews;