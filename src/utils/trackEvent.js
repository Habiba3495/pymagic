
import apiClient from '../services';
import { debounce } from 'lodash';

const eventCache = new Map();
const CACHE_DURATION = 60000; // 60 ثانية

const debouncedTrackEvent = debounce((userId, eventType, eventData, user, duration, resolve, reject) => {
  const eventKey = `${userId}-${eventType}-${JSON.stringify(eventData)}`;
  
  try {
    // فحص الـ cache
    if (eventCache.has(eventKey)) {
      console.log(`[Event Cache] Skipping duplicate: ${eventKey}`);
      resolve();
      return;
    }

    // فحص sessionStorage لو الـ event من نوع معين
    const sessionEventKey = `${eventType}-${userId}-${JSON.stringify(eventData)}`;
    const trackedEvents = JSON.parse(sessionStorage.getItem('trackedEvents') || '{}');
    if (['flashcards_loaded', 'lesson_data_loaded'].includes(eventType) && trackedEvents[sessionEventKey]) {
      console.log(`[Session Storage] Skipping tracked event: ${sessionEventKey}`);
      resolve();
      return;
    }

    // إضافة الـ event للـ cache
    eventCache.set(eventKey, Date.now());
    setTimeout(() => eventCache.delete(eventKey), CACHE_DURATION);

    // إرسال لـ Google Analytics
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

    // إرسال للـ API
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
        .catch((error) => reject(error));
    } else {
      resolve();
    }
  } catch (error) {
    if (!error.message.includes('aborted')) {
      console.error('[Tracking Error]', error);
    }
    reject(error);
  }
}, 300);

const trackEvent = (userId, eventType, eventData, user, duration = null) => {
  return new Promise((resolve, reject) => {
    debouncedTrackEvent(userId, eventType, eventData, user, duration, resolve, reject);
  });
};

export default trackEvent;
