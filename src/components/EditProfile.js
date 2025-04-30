import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from "../services";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import trackEvent from '../utils/trackEvent';

const EditProfile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    parentEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Track page view
    trackEvent(user.id, 'pageview', { 
      page: '/edit-profile',
      category: 'Navigation'
    });

    setFormData({
      name: user.name || '',
      email: user.email || '',
      parentEmail: user.parent_email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Track field edits (except password fields for security)
    if (user?.id && value && !name.includes('Password')) {
      trackEvent(user.id, 'profile_field_edit', {
        category: 'Profile',
        label: `Editing ${name}`,
        field: name,
        value_length: value.length
      });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('editProfile.errors.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('editProfile.errors.emailRequired');
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t('editProfile.errors.invalidEmail');
    }
    
    if (formData.parentEmail && !/^\S+@\S+\.\S+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = t('editProfile.errors.invalidParentEmail');
    }
    
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = t('editProfile.errors.currentPasswordRequired');
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = t('editProfile.errors.passwordTooShort');
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t('editProfile.errors.passwordsDontMatch');
      }
    }
    
    setErrors(newErrors);
    
    // Track validation result
    trackEvent(user.id, 'profile_validation', {
      category: 'Profile',
      label: 'Form Validation',
      is_valid: Object.keys(newErrors).length === 0,
      error_count: Object.keys(newErrors).length,
      has_password_change: Boolean(formData.currentPassword)
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrors({});
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        parentEmail: formData.parentEmail,
      };
      
      // Track profile update attempt
      trackEvent(user.id, 'profile_update_attempt', {
        category: 'Profile',
        label: 'Profile Update Started',
        fields_updated: Object.keys(payload).filter(k => payload[k]).join(','),
        has_password_change: Boolean(formData.currentPassword)
      });

      // Only include password fields if they're being changed
      if (formData.currentPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
        
        // Track password change attempt
        trackEvent(user.id, 'password_change_attempt', {
          category: 'Security',
          label: 'Password Change Attempt'
        });
      }
      
      const response = await apiClient.put('/api/users/Editprofile', payload);
      
      // Update auth context with new user data
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
        parent_email: formData.parentEmail
      });
      
      setSuccessMessage(t('editProfile.successMessage'));
      
      // Track successful update
      trackEvent(user.id, 'profile_update_success', {
        category: 'Profile',
        label: 'Profile Updated Successfully',
        fields_updated: Object.keys(payload).filter(k => payload[k]).join(','),
        has_password_change: Boolean(formData.currentPassword)
      });

      if (formData.currentPassword) {
        // Track successful password change
        trackEvent(user.id, 'password_change_success', {
          category: 'Security',
          label: 'Password Changed Successfully'
        });
      }

      setTimeout(() => {
        setSuccessMessage('');
        navigate('/profile');
      }, 1000);
      
      // Clear password fields if update was successful
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Update failed:', error);
      
      // Track update failure
      trackEvent(user.id, 'profile_update_failed', {
        category: 'Error',
        label: 'Profile Update Failed',
        error: error.response?.data?.error || error.message,
        status_code: error.response?.status,
        has_password_change: Boolean(formData.currentPassword)
      });

      if (error.response) {
        if (error.response.status === 401) {
          setErrors({ currentPassword: t('editProfile.errors.incorrectPassword') });
          
          // Track password change failure
          trackEvent(user.id, 'password_change_failed', {
            category: 'Security',
            label: 'Incorrect Current Password'
          });
        } else if (error.response.data?.error) {
          setErrors({ form: error.response.data.error });
        } else {
          setErrors({ form: t('editProfile.errors.updateFailed') });
        }
      } else {
        setErrors({ form: t('editProfile.errors.networkError') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Track cancel action
    trackEvent(user.id, 'profile_edit_cancelled', {
      category: 'Navigation',
      label: 'Profile Edit Cancelled'
    });
    navigate('/setting');
  };

  return (
    <div className='background_edit-profile-container'>
      <div className="edit-profile-container">
        {errors.form && (
          <div className="error-message">
            {errors.form}
          </div>
        )}
        
        {successMessage && (
          <div className='success-messag-overlay'>
            <div className="success-message">{successMessage}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">{t('editProfile.nameLabel')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('editProfile.emailLabel')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="parentEmail">{t('editProfile.parentEmailLabel')}</label>
            <input
              type="email"
              id="parentEmail"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              className={errors.parentEmail ? 'error' : ''}
            />
            {errors.parentEmail && <span className="error-message">{errors.parentEmail}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="currentPassword">{t('editProfile.currentPasswordLabel')}</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? 'error' : ''}
            />
            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">{t('editProfile.newPasswordLabel')}</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('editProfile.confirmPasswordLabel')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t('editProfile.cancelButton')}
            </button>
            <button 
              type="submit" 
              className="save-buttonn"
              disabled={isLoading}
            >
              {isLoading ? t('editProfile.saving') : t('editProfile.saveButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;