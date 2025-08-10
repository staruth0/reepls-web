import React, { useState } from 'react';
import { apiClient } from '../../services/apiClient';

interface PodcastFormData {
  title: string;
  description: string;
  tags: string;
  category: string;
  isPublic: boolean;
  audioFile: File | null;
}

interface UploadPodcastTestPageProps {
  onUploadSuccess?: (response: { id: string; title: string; url: string }) => void;
  onUploadError?: (error: Error | string) => void;
  className?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const UploadPodcastTestPage: React.FC<UploadPodcastTestPageProps> = ({
  onUploadSuccess,
  onUploadError,
  className = '',
}) => {
  const [formData, setFormData] = useState<PodcastFormData>({
    title: '',
    description: '',
    tags: '',
    category: '',
    isPublic: true,
    audioFile: null,
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Handle changes for inputs, selects, and checkbox
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    // Conditionally get the value based on the input type
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  // Handle file selection with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('audio/')) {
        const errMsg = 'Please select a valid audio file (MP3, WAV, M4A, OGG)';
        setError(errMsg);
        onUploadError?.(errMsg);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const errMsg = 'File size must be less than 50MB';
        setError(errMsg);
        onUploadError?.(errMsg);
        return;
      }

      setFormData((prev) => ({ ...prev, audioFile: file }));
      setError(null);
    }
  };

  // Reset form fields and file input
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tags: '',
      category: '',
      isPublic: true,
      audioFile: null,
    });
    setUploadProgress(0);
    setError(null);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      const errMsg = 'Title is required';
      setError(errMsg);
      onUploadError?.(errMsg);
      return;
    }

    if (!formData.audioFile) {
      const errMsg = 'Audio file is required';
      setError(errMsg);
      onUploadError?.(errMsg);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title.trim());
      uploadData.append('description', formData.description.trim());
      uploadData.append('category', formData.category);
      uploadData.append('isPublic', formData.isPublic.toString());
      uploadData.append('audio', formData.audioFile);
      uploadData.append('tags', formData.tags); // Added tags to FormData

      const result = await apiClient.post('/podcasts/standalone', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 1;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });

      setError(null);
      resetForm();
      onUploadSuccess?.(result.data);
    } catch (err: any) {
      let errorMessage = 'Upload failed';
      let errorDetails = '';

      if (err.response) {
        const status = err.response.status;
        const statusText = err.response.statusText;

        errorMessage = `Upload failed: ${status} ${statusText}`;

        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorDetails = err.response.data;
          } else if (err.response.data.message) {
            errorDetails = err.response.data.message;
          } else if (err.response.data.error) {
            errorDetails =
              typeof err.response.data.error === 'string'
                ? err.response.data.error
                : err.response.data.error.message || JSON.stringify(err.response.data.error);
          }
        }

        switch (status) {
          case 401:
            errorMessage = 'Authentication failed. Please login again.';
            break;
          case 403:
            errorMessage = 'Access denied. Check your permissions.';
            break;
          case 400:
            errorMessage = 'Invalid request data.';
            if (errorDetails.toLowerCase().includes('unexpected field')) {
              errorDetails = 'API field validation error. Please check the form data.';
            }
            break;
          case 413:
            errorMessage = 'File too large. Maximum size is 50MB.';
            break;
          case 415:
            errorMessage = 'Unsupported file type. Please use audio files only.';
            break;
          default:
            if (status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            }
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
        if (err.code === 'ECONNABORTED') {
          errorDetails = 'Request timeout. File might be too large or connection is slow.';
        } else if (err.code === 'ERR_NETWORK') {
          errorDetails = 'Network connection failed.';
        }
      } else {
        errorMessage = 'Request error';
        errorDetails = err.message || 'Unknown error occurred';
      }

      const fullError = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
      setError(fullError);
      onUploadError?.(fullError);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`podcast-upload-only ${className}`}>
      <form onSubmit={handleSubmit} className="upload-form">
        {/* Title - Required */}
        <div className="form-group">
          <label htmlFor="title">
            Podcast Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter podcast title"
            disabled={uploading}
            required
          />
        </div>

        {/* Description - Optional */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter podcast description"
            rows={4}
            disabled={uploading}
          />
        </div>

        {/* Category - Optional */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={uploading}
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Sports">Sports</option>
            <option value="Music">Music</option>
            <option value="News">News</option>
            <option value="Science">Science</option>
            <option value="Comedy">Comedy</option>
            <option value="Arts">Arts</option>
            <option value="History">History</option>
          </select>
        </div>

        {/* Tags - Optional */}
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Enter tags separated by commas (e.g., tech, innovation, AI)"
            disabled={uploading}
          />
          <small className="form-help">Separate multiple tags with commas</small>
        </div>

        {/* Public/Private Toggle */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              disabled={uploading}
            />
            <span className="checkbox-text">Make podcast public</span>
          </label>
        </div>

        {/* Audio File - Required */}
        <div className="form-group">
          <label htmlFor="audioFile">
            Audio File <span className="required">*</span>
          </label>
          <input
            type="file"
            id="audioFile"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={uploading}
            required
          />
          <small className="form-help">Supported formats: MP3, WAV, M4A, OGG (max 50MB)</small>
          {formData.audioFile && (
            <div className="file-info">
              <span className="file-name">📁 {formData.audioFile.name}</span>
              <span className="file-size">
                ({(formData.audioFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <span className="progress-text">Uploading... {uploadProgress}%</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={uploading} className="submit-button">
          {uploading ? 'Uploading...' : 'Upload Podcast'}
        </button>
      </form>
    </div>
  );
};

export default UploadPodcastTestPage;