import ReactGA from 'react-ga4';
import apiClient from '../services';

const trackEvent = async (userId, eventType, eventData, duration = null) => {
  try {
    if (eventType === 'pageview') {
      // Track page view with ReactGA
      ReactGA.send({ hitType: 'pageview', page: eventData.page });
    } else {
      // Track custom event with ReactGA
      ReactGA.event({
        category: eventData.category,
        action: eventType,
        label: eventData.label,
        value: eventData.value || duration,
        user_id: userId,
      });
    }

    // Send to backend using apiClient
    await apiClient.post('/api/track-event', {
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      duration,
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export default trackEvent;