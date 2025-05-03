import apiClient from '../services';
import { debounce } from 'lodash';
import { setBackendError } from '../context/ErrorContextManager';

const eventCache = new Map();
const CACHE_DURATION = 60000;

const debouncedTrackEvent = debounce((userId, eventType, eventData, user, duration, resolve, reject) => {
  const eventKey = `${userId}-${eventType}-${JSON.stringify(eventData)}`;
  
  try {
    if (eventCache.has(eventKey)) {
      console.log(`[Event Cache] Skipping duplicate: ${eventKey}`);
      resolve();
      return;
    }

    const sessionEventKey = `${eventType}-${userId}-${JSON.stringify(eventData)}`;
    const trackedEvents = JSON.parse(sessionStorage.getItem('trackedEvents') || '{}');
    if (['flashcards_loaded', 'lesson_data_loaded'].includes(eventType) && trackedEvents[sessionEventKey]) {
      console.log(`[Session Storage] Skipping tracked event: ${sessionEventKey}`);
      resolve();
      return;
    }

    eventCache.set(eventKey, Date.now());
    setTimeout(() => eventCache.delete(eventKey), CACHE_DURATION);

    const gtagEvent = eventType === 'pageview' ? 'page_view' : eventType;
    if (window.gtag) {
      window.gtag('event', gtagEvent, {
        ...eventData,
        custom_user_id: userId || 'anonymous',
        non_interaction: true
      });
    } else {
      console.warn('Google Analytics gtag not initialized');
    }

    if (user?.id === userId && navigator.onLine) {
      const controller = new AbortController();
      
      Promise.race([
        apiClient.post('/api/track-event', {
          user_id: userId,
          event_type: eventType,
          event_data: eventData,
          duration
        }, { signal: controller.signal }),
        new Promise((_, reject) => 
          setTimeout(() => {
            controller.abort();
            reject(new Error('Request timeout'));
          }, 3000)
        )
      ])
        .then(() => resolve())
        .catch((error) => {
          if (error.status === 401) {
            console.log('Authentication error in tracking, skipping...');
            resolve();
          } else if (error.message === 'No internet connection' || error.message.includes('aborted')) {
            console.log('Network error in tracking, updating ErrorContext...');
            setBackendError('No internet connection', null);
            resolve();
          } else {
            console.error('[Tracking Error]', error);
            reject(error);
          }
        });
    } else {
      console.log('[Track Event] Skipping request: No connection or user mismatch');
      if (!navigator.onLine && user?.id === userId) {
        setBackendError('No internet connection', null);
      }
      resolve();
    }
  } catch (error) {
    console.error('[General Tracking Error]', error);
    if (error.message === 'No internet connection') {
      setBackendError('No internet connection', null);
      resolve();
    } else {
      reject(error);
    }
  }
}, 300);

const trackEvent = (userId, eventType, eventData, user, duration = null) => {
  return new Promise((resolve, reject) => {
    debouncedTrackEvent(userId, eventType, eventData, user, duration, resolve, reject);
  });
};

export default trackEvent;