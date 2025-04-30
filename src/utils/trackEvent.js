//src\utils\trackEvent.js
import apiClient from '../services';
import { useAuth } from '../context/AuthContext';

// ملاحظة: بما إن useAuth هو React hook، لازم نستخدمه داخل مكون React
// هنمرر الـ user كمعامل للدالة بدل ما نستخدم useAuth هنا مباشرة
const trackEvent = async (userId, eventType, eventData, user, duration = null) => {
  try {
    console.log('Tracking event with userId:', userId);

    // إرسال الأحداث لـ Google Analytics (ما يحتاجش token، فبنبعت دايماً)
    if (eventType === 'pageview') {
      window.gtag('event', 'page_view', {
        page_path: eventData.page,
        custom_user_id: userId,
      });
      console.log('Pageview sent:', eventData.page);
    } else {
      const eventParams = {
        category: eventData.category,
        action: eventType,
        label: eventData.label,
        custom_user_id: userId,
      };

      const value = eventData.value || duration;
      if (typeof value === 'number') {
        eventParams.value = value;
      }

      window.gtag('event', eventType, eventParams);
      console.log('Custom event sent:', { eventType, eventData });
    }

    // إرسال الطلب للـ API بس لو فيه user مسجل دخول
    if (!user) {
      console.log('No user logged in, skipping API track event');
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
    // الـ interceptor في apiClient.js هيتعامل مع الـ 401 ويعمل redirect لصفحة الـ login
  }
};

export default trackEvent;