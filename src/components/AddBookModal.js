import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import '../styles/Modal.css';

const AddBookModal = ({ isOpen, onClose, onSubmit, editingBook }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    releaseDate: '',
    pdfName: '',
    pdfData: ''
  });
  const [fileSize, setFileSize] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setFormData(editingBook);
    } else {
      setFormData({
        title: '',
        author: '',
        category: '',
        releaseDate: '',
        pdfName: '',
        pdfData: ''
      });
      setFileSize(0);
    }
  }, [editingBook, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      // Maximum 50MB - browser limit
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      
      setFileSize(fileSizeInMB);
      
      if (file.size > maxSize) {
        alert(`PDF file is too large! (${fileSizeInMB}MB)\n\nMaximum allowed: 50MB`);
        e.target.value = '';
        setFileSize(0);
        return;
      }
      
      setUploading(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          pdfName: file.name,
          pdfData: event.target.result
        });
        setUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to read PDF file. Please try again.');
        e.target.value = '';
        setFileSize(0);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleSubmit = () => {
    if (formData.title && formData.author && formData.category && formData.releaseDate) {
      onSubmit(formData);
      onClose();
    } else {
      alert('Please fill all required fields (Title, Author, Category, Release Date)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="form">
          <div className="form-group">
            <label className="label">Book Title *</label>
            <input
              type="text"
              name="title"
              className="input"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Harry Potter"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Author Name *</label>
            <input
              type="text"
              name="author"
              className="input"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g., J.K. Rowling"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Category *</label>
            <input
              type="text"
              name="category"
              className="input"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Fiction, Science, History"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Release Date *</label>
            <input
              type="date"
              name="releaseDate"
              className="input"
              value={formData.releaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Upload PDF (Optional - Up to 50MB)</label>
            <input
              type="file"
              accept=".pdf"
              className="file-input"
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {uploading && (
              <div style={{
                backgroundColor: '#fff3e0',
                padding: '0.75rem',
                borderRadius: '6px',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid #f57c00',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{color: '#f57c00', fontWeight: 500}}>
                  Uploading PDF... Please wait
                </span>
              </div>
            )}
            
            {formData.pdfName && !uploading && (
              <div style={{
                backgroundColor: '#e8f5e9',
                padding: '0.75rem',
                borderRadius: '6px',
                marginTop: '0.5rem'
              }}>
                <p style={{
                  color: '#2e7d32',
                  margin: '0 0 0.25rem 0',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle size={18} />
                  {formData.pdfName}
                </p>
                <p style={{color: '#666', margin: 0, fontSize: '0.85rem'}}>
                  Size: {fileSize} MB
                </p>
              </div>
            )}
            
            <div className="file-warning">
              <AlertCircle size={16} />
              <span>Max file size: 50MB. Storage depends on your browser (typically 50-100MB total).</span>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="btn btn-primary btn-submit"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : (editingBook ? 'Update Book' : 'Add Book')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;