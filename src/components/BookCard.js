import React from 'react';
import { Book, Edit2, Trash2, Download } from 'lucide-react';
import '../styles/BookCard.css';

const BookCard = ({ 
  book, 
  onBorrow, 
  onEdit, 
  onDelete, 
  showActions = true, 
  isBorrowed = false, 
  onReturn 
}) => {
  return (
    <div className="book-card">
      <h3 className="book-title">{book.title}</h3>
      <p className="book-text">
        <strong>Author:</strong> {book.author}
      </p>
      <p className="book-text">
        <strong>Category:</strong> {book.category}
      </p>
      <p className="book-text">
        <strong>Release Date:</strong> {book.releaseDate}
      </p>
      {book.pdfName && (
        <p className="book-text">
          <strong>PDF:</strong> {book.pdfName}
        </p>
      )}
      {isBorrowed && (
        <p className="book-text">
          <strong>Due:</strong> {new Date(book.dueDate).toLocaleDateString()}
        </p>
      )}
      <span className="badge">{book.category}</span>

      {showActions && (
        <div className="card-actions">
          {!isBorrowed ? (
            <>
              <button
                className="icon-btn btn-borrow"
                onClick={() => onBorrow(book.id)}
                title="Borrow"
              >
                <Book size={18} />
              </button>
              <button
                className="icon-btn btn-edit"
                onClick={() => onEdit(book)}
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                className="icon-btn btn-delete"
                onClick={() => onDelete(book.id)}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
              {book.pdfData && (
                <button
                  className="icon-btn btn-download"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = book.pdfData;
                    link.download = book.pdfName || 'book.pdf';
                    link.click();
                  }}
                  title="Download PDF"
                >
                  <Download size={18} />
                </button>
              )}
            </>
          ) : (
            <button
              className="btn btn-primary btn-return"
              onClick={() => onReturn(book.id)}
            >
              Return Book
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;