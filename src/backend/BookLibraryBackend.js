class BookLibraryBackend {
  constructor() {
    this.books = this.loadFromStorage('books') || [];
    this.borrowedBooks = this.loadFromStorage('borrowedBooks') || [];
    this.history = this.loadFromStorage('history') || [];
  }

  loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  addBook(book) {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      addedDate: new Date().toISOString()
    };
    this.books.push(newBook);
    this.saveToStorage('books', this.books);
    this.addHistory('Added', newBook.title);
    return newBook;
  }

  updateBook(id, updates) {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updates };
      this.saveToStorage('books', this.books);
      this.addHistory('Updated', this.books[index].title);
      return this.books[index];
    }
    return null;
  }

  deleteBook(id) {
    const book = this.books.find(b => b.id === id);
    this.books = this.books.filter(b => b.id !== id);
    this.saveToStorage('books', this.books);
    if (book) {
      this.addHistory('Deleted', book.title);
    }
  }

  getBooks() {
    return this.books;
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
      this.saveToStorage('borrowedBooks', this.borrowedBooks);
      this.addHistory('Borrowed', book.title);
    }
  }

  returnBook(bookId) {
    const book = this.borrowedBooks.find(b => b.id === bookId);
    this.borrowedBooks = this.borrowedBooks.filter(b => b.id !== bookId);
    this.saveToStorage('borrowedBooks', this.borrowedBooks);
    if (book) {
      this.addHistory('Returned', book.title);
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
    this.saveToStorage('history', this.history);
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
}

export const backend = new BookLibraryBackend();