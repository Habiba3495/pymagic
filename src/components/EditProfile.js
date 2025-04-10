import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from "../services";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

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
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        parentEmail: user.parent_email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    // Password validation only if any password field is filled
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        parentEmail: formData.parentEmail,
        
      };
      
      const response = await apiClient.put('/api/users/Editprofile', payload);


      // Only include password fields if they're being changed
      if (formData.currentPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      
      
      // Update auth context with new user data
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
        parent_email: formData.parentEmail
      });
      
      setSuccessMessage(t('editProfile.successMessage'));
      setTimeout(() => setSuccessMessage(''), 1000);
      
      // Clear password fields if update was successful
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Update failed:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrors({ currentPassword: t('editProfile.errors.incorrectPassword') });
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

  return (
    <div className='background_edit-profile-container'>
    <div className="edit-profile-container">
      <h2>{t('editProfile.title')}</h2>
      
      {errors.form && <div className="error-message">{errors.form}</div>}
      {successMessage && <div className='success-messag-overlay'><div className="success-message">{successMessage}</div></div>}
      
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
        
        <h3 className="password-section-title">{t('editProfile.passwordSectionTitle')}</h3>
        <p className="password-instructions">{t('editProfile.passwordInstructions')}</p>
        
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
            onClick={() => navigate('/setting')}
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