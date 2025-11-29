// App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import AddBookModal from './components/AddBookModal';
import HistoryList from './components/HistoryList';
import { backend } from './backend/BookLibraryBackend';
import { Book } from 'lucide-react';
import './styles/App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBooks(backend.getBooks());
    setBorrowedBooks(backend.getBorrowedBooks());
    setHistory(backend.getHistory());
  };

  const handleAddBook = (bookData) => {
    if (editingBook) {
      backend.updateBook(editingBook.id, bookData);
    } else {
      backend.addBook(bookData);
    }
    loadData();
    setEditingBook(null);
  };

  const handleBorrowBook = (bookId) => {
    backend.borrowBook(bookId);
    loadData();
  };

  const handleReturnBook = (bookId) => {
    backend.returnBook(bookId);
    loadData();
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      backend.deleteBook(bookId);
      loadData();
    }
  };

  const filteredBooks = searchQuery
    ? backend.searchBooks(searchQuery)
    : books;

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="container">
        {currentPage === 'home' && (
          <>
            <h1 className="page-title">Library Collection</h1>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {filteredBooks.length === 0 ? (
              <div className="empty-state">
                <Book size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3>No Books Found</h3>
                <p>Start by adding books to your library</p>
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBorrow={handleBorrowBook}
                    onEdit={handleEditBook}
                    onDelete={handleDeleteBook}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentPage === 'add' && (
          <>
            <h1 className="page-title">Add New Book</h1>
            <div style={{ textAlign: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                Add Book
              </button>
            </div>
          </>
        )}

        {currentPage === 'borrowed' && (
          <>
            <h1 className="page-title">Borrowed Books</h1>
            {borrowedBooks.length === 0 ? (
              <div className="empty-state">
                <Book size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3>No Borrowed Books</h3>
                <p>Borrow books from the library collection</p>
              </div>
            ) : (
              <div className="books-grid">
                {borrowedBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isBorrowed={true}
                    onReturn={handleReturnBook}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentPage === 'history' && (
          <>
            <h1 className="page-title">Activity History</h1>
            <HistoryList history={history} />
          </>
        )}
      </div>

      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleAddBook}
        editingBook={editingBook}
      />
    </div>
  );
}