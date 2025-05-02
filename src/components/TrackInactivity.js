import { useEffect, useRef, useCallback, useState } from 'react';
import trackEvent from '../utils/trackEvent';

const TrackInactivity = ({ userId, user }) => {
  const timeoutRef = useRef(null);
  const [isActive, setIsActive] = useState(true);

  const resetTimeout = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isActive) {
        // ... كود التتبع
        setIsActive(false);
      }
    }, 30000);
  }, [userId, user, isActive]);

  const handleActivity = useCallback(() => {
    if (!isActive) setIsActive(true);
    resetTimeout();
  }, [isActive, resetTimeout]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(e => window.addEventListener(e, handleActivity));
    resetTimeout();

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      clearTimeout(timeoutRef.current);
    };
  }, [handleActivity, resetTimeout]);

  return null;
};

export default TrackInactivity;