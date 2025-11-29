import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    }
  }, [editingBook, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          pdfName: file.name,
          pdfData: event.target.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleSubmit = () => {
    if (formData.title && formData.author && formData.category && formData.releaseDate) {
      onSubmit(formData);
      onClose();
    } else {
      alert('Please fill all required fields');
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
            <label className="label">Upload PDF</label>
            <input
              type="file"
              accept=".pdf"
              className="file-input"
              onChange={handleFileChange}
            />
            {formData.pdfName && (
              <p className="file-name">Selected: {formData.pdfName}</p>
            )}
          </div>

          <button onClick={handleSubmit} className="btn btn-primary btn-submit">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;