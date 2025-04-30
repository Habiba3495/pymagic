import { useEffect, useRef } from 'react';
import trackEvent from '../utils/trackEvent';

const TrackInactivity = ({ userId, user }) => {
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!user || !userId) {
        console.log('No user or userId, skipping inactivity tracking');
        return;
      }

      trackEvent(userId, 'inactive', {
        category: 'Session',
        action: 'inactive',
        label: window.location.pathname,
        value: 30,
      }, user);
    }, 30000); // 30 seconds of inactivity
  };

  const handleActivity = () => {
    resetTimeout();
  };

  useEffect(() => {
    // إضافة listeners لأحداث التفاعل
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // بدء الـ timer لأول مرة
    resetTimeout();

    // تنظيف الـ listeners والـ timer
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [userId, user]);

  return null;
};

export default TrackInactivity;