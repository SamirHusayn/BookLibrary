import React from 'react';
import { Book, Home, Plus, History } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'add', label: 'Add Book', icon: Plus },
    { id: 'borrowed', label: 'Borrowed', icon: Book },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <Book size={28} />
          <span>BookLib</span>
        </div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li
              key={item.id}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <item.icon size={20} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;