import { useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import trackEvent from '../utils/trackEvent';

const TrackEngagement = ({ userId, user }) => {
  const interactionCache = useRef(new Set());

  // تتبع الجلسة الطويلة
  useEffect(() => {
    const timer = setTimeout(() => {
      const eventData = {
        category: 'Session',
        label: 'Long Session (60s+)'
      };
      
      if (!interactionCache.current.has('long_session')) {
        trackEvent(userId, 'long_session', eventData, user);
        interactionCache.current.add('long_session');
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [userId, user]);

  // معالجة النقرات المثبّتة
  const handleClick = useCallback(debounce((event) => {
    const target = event.target.closest('[data-trackable]');
    if (!target) return;

    const eventData = {
      category: target.dataset.category || 'General',
      label: target.dataset.label || target.id || 'Unnamed Element',
      path: window.location.pathname
    };

    const eventKey = `click-${eventData.category}-${eventData.label}`;
    
    if (!interactionCache.current.has(eventKey)) {
      trackEvent(userId, 'click', eventData, user);
      interactionCache.current.add(eventKey);
      
      setTimeout(() => {
        interactionCache.current.delete(eventKey);
      }, 5000);
    }
  }, 300), [userId, user]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);

  return null;
};

export default TrackEngagement;