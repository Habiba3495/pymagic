import apiClient from '../services';

const trackEvent = async (userId, eventType, eventData, user, duration = null) => {
  try {
    console.log('Tracking event with userId:', userId);

    // إرسال الأحداث لـ Google Analytics حتى لو مفيش user
    if (eventType === 'pageview') {
      window.gtag('event', 'page_view', {
        page_path: eventData.page,
        custom_user_id: userId || 'anonymous',
      });
      console.log('Pageview sent:', eventData.page);
    } else {
      const eventParams = {
        category: eventData.category,
        action: eventType,
        label: eventData.label,
        custom_user_id: userId || 'anonymous',
      };

      const value = eventData.value || duration;
      if (typeof value === 'number') {
        eventParams.value = value;
      }

      window.gtag('event', eventType, eventParams);
      console.log('Custom event sent:', { eventType, eventData });
    }

    // إرسال الطلب للـ API بس لو فيه user و userId متطابق
    if (!user || !userId || user.id !== userId) {
      console.log('No user, no userId, or userId mismatch, skipping API track event');
      return;
    }

    await apiClient.post('/api/track-event', {
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      duration,
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    throw error;
  }
};

export default trackEvent;