class BookLibraryBackend {
  constructor() {
    this.books = this.loadFromStorage('books') || [];
    this.borrowedBooks = this.loadFromStorage('borrowedBooks') || [];
    this.history = this.loadFromStorage('history') || [];
  }

  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from storage:', error);
      // If data is corrupted, return empty
      localStorage.removeItem(key);
      return null;
    }
  }

  saveToStorage(key, data) {
    try {
      const jsonString = JSON.stringify(data);
      localStorage.setItem(key, jsonString);
      console.log(`Saved ${key}: ${(jsonString.length / (1024 * 1024)).toFixed(2)} MB`);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        const jsonString = JSON.stringify(data);
        
        console.error('Storage quota exceeded:', error);
        
        // Check if we're trying to delete (data should be smaller than current)
        const currentData = localStorage.getItem(key);
        if (!currentData || jsonString.length < currentData.length) {
          // Force save for delete operations
          try {
            localStorage.removeItem(key);
            localStorage.setItem(key, jsonString);
            console.log('Forced save after cleanup successful');
            return;
          } catch (e) {
            console.error('Failed to save after cleanup:', e);
          }
        }
        
        const currentSize = this.getStorageSize();
        const availableSize = this.getAvailableStorage();
        
        alert(`❌ Storage Full!\n\nCurrent Usage: ${currentSize} MB\nAvailable: ${availableSize} MB\n\nSolutions:\n1. Delete some books with large PDFs\n2. Remove PDFs from existing books (Edit → Remove PDF)\n3. Clear browser cache\n\nNote: Most browsers limit storage to 50-100MB`);
        throw error;
      }
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  addBook(book) {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      addedDate: new Date().toISOString()
    };
    this.books.push(newBook);
    
    try {
      this.saveToStorage('books', this.books);
      this.addHistory('Added', newBook.title);
      console.log(`Book added successfully: ${newBook.title}`);
      return newBook;
    } catch (error) {
      // Rollback if save fails
      this.books.pop();
      console.error('Failed to add book, rolled back');
      throw error;
    }
  }

  updateBook(id, updates) {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      const oldBook = { ...this.books[index] };
      this.books[index] = { ...this.books[index], ...updates };
      
      try {
        this.saveToStorage('books', this.books);
        this.addHistory('Updated', this.books[index].title);
        console.log(`Book updated successfully: ${this.books[index].title}`);
        return this.books[index];
      } catch (error) {
        // Rollback if save fails
        this.books[index] = oldBook;
        console.error('Failed to update book, rolled back');
        throw error;
      }
    }
    return null;
  }

  deleteBook(id) {
    const book = this.books.find(b => b.id === id);
    const oldBooks = [...this.books];
    this.books = this.books.filter(b => b.id !== id);
    
    try {
      this.saveToStorage('books', this.books);
      if (book) {
        this.addHistory('Deleted', book.title);
        console.log(`Book deleted successfully: ${book.title}`);
      }
    } catch (error) {
      // Rollback if save fails
      this.books = oldBooks;
      console.error('Failed to delete book, rolled back');
    }
  }

  getBooks() {
    return this.books;
  }

  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / (1024 * 1024)).toFixed(2);
  }

  getAvailableStorage() {
    // Estimate available storage (browsers typically allow 50-100MB)
    const used = parseFloat(this.getStorageSize());
    const estimated = 100; // Assume 100MB max
    return (estimated - used).toFixed(2);
  }

  getStorageInfo() {
    const booksSize = localStorage.getItem('books') 
      ? (localStorage.getItem('books').length / (1024 * 1024)).toFixed(2) 
      : 0;
    const borrowedSize = localStorage.getItem('borrowedBooks')
      ? (localStorage.getItem('borrowedBooks').length / (1024 * 1024)).toFixed(2)
      : 0;
    const historySize = localStorage.getItem('history')
      ? (localStorage.getItem('history').length / (1024 * 1024)).toFixed(2)
      : 0;

    return {
      total: this.getStorageSize(),
      books: booksSize,
      borrowed: borrowedSize,
      history: historySize,
      available: this.getAvailableStorage()
    };
  }

  borrowBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      const borrowed = {
        ...book,
        borrowedDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };
      this.borrowedBooks.push(borrowed);
      
      try {
        this.saveToStorage('borrowedBooks', this.borrowedBooks);
        this.addHistory('Borrowed', book.title);
      } catch (error) {
        this.borrowedBooks.pop();
        throw error;
      }
    }
  }

  returnBook(bookId) {
    const book = this.borrowedBooks.find(b => b.id === bookId);
    this.borrowedBooks = this.borrowedBooks.filter(b => b.id !== bookId);
    
    try {
      this.saveToStorage('borrowedBooks', this.borrowedBooks);
      if (book) {
        this.addHistory('Returned', book.title);
      }
    } catch (error) {
      console.error('Failed to return book:', error);
    }
  }

  getBorrowedBooks() {
    return this.borrowedBooks;
  }

  addHistory(action, bookTitle) {
    const entry = {
      id: Date.now().toString(),
      action,
      bookTitle,
      timestamp: new Date().toISOString()
    };
    this.history.unshift(entry);
    
    // Keep only last 100 history entries to save space
    if (this.history.length > 100) {
      this.history = this.history.slice(0, 100);
    }
    
    try {
      this.saveToStorage('history', this.history);
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  getHistory() {
    return this.history;
  }

  searchBooks(query) {
    const lowerQuery = query.toLowerCase();
    return this.books.filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.category.toLowerCase().includes(lowerQuery)
    );
  }

  clearAllData() {
    if (window.confirm('⚠️ This will delete ALL books, borrowed books, and history. Are you sure?')) {
      localStorage.clear();
      this.books = [];
      this.borrowedBooks = [];
      this.history = [];
      alert('✅ All data cleared! Storage freed.');
      window.location.reload();
    }
  }

  // Remove PDF from a book to save space
  removePdfFromBook(bookId) {
    const index = this.books.findIndex(b => b.id === bookId);
    if (index !== -1) {
      const hadPdf = this.books[index].pdfData ? true : false;
      this.books[index].pdfData = '';
      this.books[index].pdfName = '';
      
      try {
        this.saveToStorage('books', this.books);
        if (hadPdf) {
          alert('✅ PDF removed successfully! Storage space freed.');
          console.log('PDF removed, storage freed');
        }
      } catch (error) {
        console.error('Failed to remove PDF:', error);
      }
    }
  }

  // Optimize storage by compressing history
  optimizeStorage() {
    // Keep only last 50 history entries
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
      this.saveToStorage('history', this.history);
    }
    
    const info = this.getStorageInfo();
    alert(`Storage Optimized!\n\nTotal: ${info.total} MB\nAvailable: ${info.available} MB\n\nBooks: ${info.books} MB\nBorrowed: ${info.borrowed} MB\nHistory: ${info.history} MB`);
  }
}

export const backend = new BookLibraryBackend();

// Add global function to check storage
window.checkStorage = () => {
  const info = backend.getStorageInfo();
  console.log('=== STORAGE INFO ===');
  console.log(`Total Used: ${info.total} MB`);
  console.log(`Books: ${info.books} MB`);
  console.log(`Borrowed: ${info.borrowed} MB`);
  console.log(`History: ${info.history} MB`);
  console.log(`Available: ${info.available} MB`);
  console.log('==================');
  return info;
};