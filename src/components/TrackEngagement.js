import { useEffect, useRef } from 'react';
import trackEvent from '../utils/trackEvent';

const TrackEngagement = ({ userId, user }) => {
  const longSessionTimer = useRef(null);

  // تتبع جلسة طويلة (long session)
  useEffect(() => {
    longSessionTimer.current = setTimeout(() => {
      if (!user || !userId) {
        console.log('No user or userId, skipping long session tracking');
        return;
      }
      trackEvent(userId, 'long_session', {
        category: 'Session',
        action: 'long_session',
        label: 'Over 60s',
      }, user);
    }, 60000); // 1 minute

    return () => {
      if (longSessionTimer.current) {
        clearTimeout(longSessionTimer.current);
      }
    };
  }, [userId, user]);

  // تتبع التفاعلات (click events)
  useEffect(() => {
    const handleClick = (event) => {
      if (!user || !userId) {
        console.log('No user or userId, skipping engagement tracking');
        return;
      }

      const target = event.target;
      let category = 'Unknown';
      let label = 'Unknown';

      if (target.tagName === 'BUTTON') {
        category = 'Button';
        label = target.textContent || target.id || 'Unnamed Button';
      } else if (target.tagName === 'A') {
        category = 'Link';
        label = target.textContent || target.href || 'Unnamed Link';
      } else if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        category = 'Form';
        label = target.name || target.id || 'Unnamed Form Element';
      }

      trackEvent(userId, 'click', { category, label }, user);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [userId, user]);

  return null;
};

export default TrackEngagement;